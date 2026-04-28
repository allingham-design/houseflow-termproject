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
    return doc.data();
  }

  // doesn't exist yet, create default
  var users = await getAllUsers();
  // filter out admin (admin collects rent, doesn't pay themselves)
  var payers = users.filter(function(u) { return u.role !== "admin"; });

  var defaultSplits = payers.map(function(u) {
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
  var currentMonth = getCurrentMonthKey();
  var snapshot = await db.collection("expenses").orderBy("month", "desc").get();
  var history = [];
  snapshot.forEach(function(doc) {
    var data = doc.data();
    // skip current month
    if (data.month !== currentMonth) {
      history.push(data);
    }
  });
  return history;
}

// seed some sample history data for demo purposes
async function seedExpenseHistory(users) {
  var payers = users.filter(function(u) { return u.role !== "admin"; });

  // create a few months of history
  var months = ["2026-03", "2026-02", "2026-01"];
  for (var i = 0; i < months.length; i++) {
    var doc = await db.collection("expenses").doc(months[i]).get();
    if (!doc.exists) {
      var splits = payers.map(function(u) {
        return {
          userId: u.id,
          amount: 600,
          paid: true,
          paidDate: months[i] + "-0" + (i + 2)
        };
      });
      await db.collection("expenses").doc(months[i]).set({
        rentTotal: 1800,
        month: months[i],
        splits: splits
      });
    }
  }
}
