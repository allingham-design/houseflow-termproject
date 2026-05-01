// HouseFlow - Expense / Rent Data Store (Firestore)
// Stores rent configuration and payment tracking in the "expenses" collection

// get the current month key like "2026-04"
function getCurrentMonthKey() {
  var today = new Date();
  return today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, "0");
}

// format a month key like "2026-04" to "Apr 2026"
function formatMonthKey(key) {
  var parts = key.split("-");
  var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return months[parseInt(parts[1]) - 1] + " " + parts[0];
}

// get the expense document for the current month
// creates a default one if it doesnt exist yet
async function getExpenses() {
  var monthKey = getCurrentMonthKey();
  var doc = await db.collection("expenses").doc(monthKey).get();

  if (doc.exists) {
    var data = doc.data();

    // sync splits with current users (add new, remove deleted)
    var users = await getAllUsers();
    var userIds = users.map(function(u) { return u.id; });
    var updated = false;

    // add any new users
    var existingIds = data.splits.map(function(s) { return s.userId; });
    users.forEach(function(u) {
      if (existingIds.indexOf(u.id) === -1) {
        data.splits.push({ userId: u.id, amount: 0, paid: false, paidDate: null });
        updated = true;
      }
    });

    // remove users that no longer exist
    var before = data.splits.length;
    data.splits = data.splits.filter(function(s) {
      return userIds.indexOf(s.userId) !== -1;
    });
    if (data.splits.length !== before) updated = true;

    if (updated) {
      await db.collection("expenses").doc(monthKey).set(data);
    }

    return data;
  }

  // doesn't exist yet, create default with all users
  var users = await getAllUsers();

  var defaultSplits = users.map(function(u) {
    return { userId: u.id, amount: 0, paid: false, paidDate: null };
  });

  var defaultData = {
    rentTotal: 0,
    month: monthKey,
    splits: defaultSplits
  };

  await db.collection("expenses").doc(monthKey).set(defaultData);
  return defaultData;
}

// save updated expense data for current month
async function saveExpenses(data) {
  var monthKey = getCurrentMonthKey();
  await db.collection("expenses").doc(monthKey).set(data);
}

// update the rent total and split amounts
async function updateRentConfig(rentTotal, splits) {
  var data = await getExpenses();
  data.rentTotal = rentTotal;
  data.splits = splits;
  await saveExpenses(data);
}

// mark a roommate as paid for this month
async function markAsPaid(userId) {
  var data = await getExpenses();
  var split = data.splits.find(function(s) { return s.userId === userId; });
  if (split) {
    split.paid = true;
    split.paidDate = new Date().toISOString().split("T")[0];
    await saveExpenses(data);
  }
}

// mark a roommate as unpaid
async function markAsUnpaid(userId) {
  var data = await getExpenses();
  var split = data.splits.find(function(s) { return s.userId === userId; });
  if (split) {
    split.paid = false;
    split.paidDate = null;
    await saveExpenses(data);
  }
}

// get payment history (all past month documents)
async function getPaymentHistory() {
  var snapshot = await db.collection("expenses").orderBy("month", "desc").get();
  var history = [];
  snapshot.forEach(function(doc) {
    history.push(doc.data());
  });
  return history;
}

