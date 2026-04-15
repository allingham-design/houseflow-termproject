/* ============================================
   HouseFlow - Expense / Rent Data Store
   Mock data layer for rent tracking.
   ============================================ */

// Initialize expenses in localStorage if not present
function initExpenses() {
  if (!localStorage.getItem("houseflow_expenses")) {
    var today = new Date();
    var monthKey = today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, "0");

    var defaultExpenses = {
      rentTotal: 1800,
      splits: [
        { userId: "user2", amount: 600, paid: false, paidDate: null },
        { userId: "user3", amount: 600, paid: false, paidDate: null }
      ],
      month: monthKey,
      history: [
        {
          month: "2026-02",
          rentTotal: 1800,
          splits: [
            { userId: "user2", amount: 600, paid: true, paidDate: "2026-02-03" },
            { userId: "user3", amount: 600, paid: true, paidDate: "2026-02-05" }
          ]
        },
        {
          month: "2026-01",
          rentTotal: 1800,
          splits: [
            { userId: "user2", amount: 600, paid: true, paidDate: "2026-01-04" },
            { userId: "user3", amount: 600, paid: true, paidDate: "2026-01-02" }
          ]
        }
      ]
    };
    localStorage.setItem("houseflow_expenses", JSON.stringify(defaultExpenses));
  }
}

// Get current expense data
function getExpenses() {
  initExpenses();
  return JSON.parse(localStorage.getItem("houseflow_expenses"));
}

// Save expenses
function saveExpenses(data) {
  localStorage.setItem("houseflow_expenses", JSON.stringify(data));
}

// Update rent total and splits
function updateRentConfig(rentTotal, splits) {
  var data = getExpenses();
  data.rentTotal = rentTotal;
  data.splits = splits;
  saveExpenses(data);
}

// Mark a roommate as paid
function markAsPaid(userId) {
  var data = getExpenses();
  var split = data.splits.find(function(s) { return s.userId === userId; });
  if (split) {
    split.paid = true;
    split.paidDate = new Date().toISOString().split("T")[0];
    saveExpenses(data);
  }
}

// Mark a roommate as unpaid
function markAsUnpaid(userId) {
  var data = getExpenses();
  var split = data.splits.find(function(s) { return s.userId === userId; });
  if (split) {
    split.paid = false;
    split.paidDate = null;
    saveExpenses(data);
  }
}

// Roll to a new month (archive current, reset statuses)
function rollNewMonth() {
  var data = getExpenses();
  var today = new Date();
  var monthKey = today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, "0");

  if (data.month !== monthKey) {
    // Archive current month
    data.history.unshift({
      month: data.month,
      rentTotal: data.rentTotal,
      splits: JSON.parse(JSON.stringify(data.splits))
    });

    // Reset for new month
    data.month = monthKey;
    data.splits.forEach(function(s) {
      s.paid = false;
      s.paidDate = null;
    });

    saveExpenses(data);
  }
}

// Reset expenses to default
function resetExpenses() {
  localStorage.removeItem("houseflow_expenses");
  initExpenses();
}
