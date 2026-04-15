/* ============================================
   HouseFlow - Chore Data Store
   Mock data layer for chores. Will be replaced
   with Firestore reads/writes later.
   ============================================ */

// Initialize chores in localStorage if not present
function initChores() {
  if (!localStorage.getItem("houseflow_chores")) {
    const defaultChores = [
      {
        id: "chore1",
        title: "Wash Dishes",
        description: "Clean all dishes in the sink and put them away.",
        assignedTo: "user1",
        status: "pending",
        dueDate: "2026-03-23",
        recurrence: "daily",
        rotationOrder: ["user1", "user2", "user3"],
        createdBy: "user1",
        completedAt: null,
        history: [
          { userId: "user2", date: "2026-03-18", status: "completed" },
          { userId: "user3", date: "2026-03-19", status: "completed" }
        ]
      },
      {
        id: "chore2",
        title: "Vacuum Living Room",
        description: "Vacuum the entire living room including under furniture.",
        assignedTo: "user2",
        status: "pending",
        dueDate: "2026-03-24",
        recurrence: "weekly",
        rotationOrder: ["user2", "user3", "user1"],
        createdBy: "user1",
        completedAt: null,
        history: [
          { userId: "user1", date: "2026-03-10", status: "completed" },
          { userId: "user2", date: "2026-03-17", status: "completed" }
        ]
      },
      {
        id: "chore3",
        title: "Take Out Trash",
        description: "Empty all trash bins and take bags to the dumpster.",
        assignedTo: "user3",
        status: "completed",
        dueDate: "2026-03-21",
        recurrence: "daily",
        rotationOrder: ["user3", "user1", "user2"],
        createdBy: "user1",
        completedAt: "2026-03-21",
        history: [
          { userId: "user1", date: "2026-03-19", status: "completed" },
          { userId: "user2", date: "2026-03-20", status: "completed" },
          { userId: "user3", date: "2026-03-21", status: "completed" }
        ]
      },
      {
        id: "chore4",
        title: "Clean Bathroom",
        description: "Scrub toilet, sink, shower, and mop the bathroom floor.",
        assignedTo: "user1",
        status: "overdue",
        dueDate: "2026-03-19",
        recurrence: "weekly",
        rotationOrder: ["user1", "user2", "user3"],
        createdBy: "user1",
        completedAt: null,
        history: [
          { userId: "user3", date: "2026-03-05", status: "completed" },
          { userId: "user1", date: "2026-03-12", status: "completed" }
        ]
      },
      {
        id: "chore5",
        title: "Wipe Kitchen Counters",
        description: "Wipe down all kitchen countertops and stovetop.",
        assignedTo: "user2",
        status: "pending",
        dueDate: "2026-03-22",
        recurrence: "daily",
        rotationOrder: ["user2", "user1", "user3"],
        createdBy: "user1",
        completedAt: null,
        history: [
          { userId: "user3", date: "2026-03-20", status: "completed" }
        ]
      },
      {
        id: "chore6",
        title: "Mop Kitchen Floor",
        description: "Sweep and mop the kitchen floor thoroughly.",
        assignedTo: "user3",
        status: "pending",
        dueDate: "2026-03-25",
        recurrence: "weekly",
        rotationOrder: ["user3", "user2", "user1"],
        createdBy: "user1",
        completedAt: null,
        history: []
      }
    ];
    localStorage.setItem("houseflow_chores", JSON.stringify(defaultChores));
  }
}

// Get all chores
function getAllChores() {
  initChores();
  return JSON.parse(localStorage.getItem("houseflow_chores"));
}

// Get chore by ID
function getChoreById(id) {
  const chores = getAllChores();
  return chores.find((c) => c.id === id);
}

// Get chores assigned to a specific user
function getChoresByUser(userId) {
  const chores = getAllChores();
  return chores.filter((c) => c.assignedTo === userId);
}

// Add a new chore
function addChore(choreData) {
  const chores = getAllChores();
  const newChore = {
    id: "chore" + Date.now(),
    title: choreData.title,
    description: choreData.description || "",
    assignedTo: choreData.assignedTo,
    status: "pending",
    dueDate: choreData.dueDate,
    recurrence: choreData.recurrence || "once",
    rotationOrder: choreData.rotationOrder || [choreData.assignedTo],
    createdBy: choreData.createdBy,
    completedAt: null,
    history: []
  };
  chores.push(newChore);
  saveChores(chores);
  return newChore;
}

// Update a chore
function updateChore(id, updates) {
  const chores = getAllChores();
  const index = chores.findIndex((c) => c.id === id);
  if (index !== -1) {
    chores[index] = { ...chores[index], ...updates };
    saveChores(chores);
    return chores[index];
  }
  return null;
}

// Mark chore as complete
function completeChore(id) {
  const chores = getAllChores();
  const index = chores.findIndex((c) => c.id === id);
  if (index !== -1) {
    const today = new Date().toISOString().split("T")[0];
    chores[index].status = "completed";
    chores[index].completedAt = today;
    chores[index].history.push({
      userId: chores[index].assignedTo,
      date: today,
      status: "completed"
    });
    saveChores(chores);
    return chores[index];
  }
  return null;
}

// Delete a chore
function deleteChore(id) {
  const chores = getAllChores();
  const filtered = chores.filter((c) => c.id !== id);
  saveChores(filtered);
}

// Save chores to localStorage
function saveChores(chores) {
  localStorage.setItem("houseflow_chores", JSON.stringify(chores));
}

// Get statistics
function getStats(userId) {
  const chores = getAllChores();
  const total = chores.length;
  const completed = chores.filter((c) => c.status === "completed").length;
  const pending = chores.filter((c) => c.status === "pending").length;
  const overdue = chores.filter((c) => c.status === "overdue").length;
  const myChores = chores.filter((c) => c.assignedTo === userId).length;
  const myCompleted = chores.filter(
    (c) => c.assignedTo === userId && c.status === "completed"
  ).length;

  return { total, completed, pending, overdue, myChores, myCompleted };
}

// Get completion counts per user (for fairness tracking)
function getCompletionCounts() {
  const chores = getAllChores();
  const counts = {};

  chores.forEach((chore) => {
    chore.history.forEach((entry) => {
      if (entry.status === "completed") {
        counts[entry.userId] = (counts[entry.userId] || 0) + 1;
      }
    });
  });

  return counts;
}

// Reset chores to default (for testing)
function resetChores() {
  localStorage.removeItem("houseflow_chores");
  initChores();
}
