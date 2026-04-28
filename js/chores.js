// HouseFlow - Chore Data Store (Firestore)
// All chore CRUD operations go through the "chores" collection

// default sample chores used for seeding / resetting
var defaultChores = [
  {
    title: "Wash Dishes",
    description: "Clean all dishes in the sink and put them away.",
    status: "pending",
    dueDate: "2026-04-28",
    recurrence: "daily",
    rotationOrder: [],
    createdBy: "",
    completedAt: null,
    assignedTo: "",
    history: []
  },
  {
    title: "Vacuum Living Room",
    description: "Vacuum the entire living room including under furniture.",
    status: "pending",
    dueDate: "2026-04-29",
    recurrence: "weekly",
    rotationOrder: [],
    createdBy: "",
    completedAt: null,
    assignedTo: "",
    history: []
  },
  {
    title: "Take Out Trash",
    description: "Empty all trash bins and take bags to the dumpster.",
    status: "completed",
    dueDate: "2026-04-27",
    recurrence: "daily",
    rotationOrder: [],
    createdBy: "",
    completedAt: "2026-04-27",
    assignedTo: "",
    history: []
  },
  {
    title: "Clean Bathroom",
    description: "Scrub toilet, sink, shower, and mop the bathroom floor.",
    status: "overdue",
    dueDate: "2026-04-20",
    recurrence: "weekly",
    rotationOrder: [],
    createdBy: "",
    completedAt: null,
    assignedTo: "",
    history: []
  },
  {
    title: "Wipe Kitchen Counters",
    description: "Wipe down all kitchen countertops and stovetop.",
    status: "pending",
    dueDate: "2026-04-28",
    recurrence: "daily",
    rotationOrder: [],
    createdBy: "",
    completedAt: null,
    assignedTo: "",
    history: []
  },
  {
    title: "Mop Kitchen Floor",
    description: "Sweep and mop the kitchen floor thoroughly.",
    status: "pending",
    dueDate: "2026-04-30",
    recurrence: "weekly",
    rotationOrder: [],
    createdBy: "",
    completedAt: null,
    assignedTo: "",
    history: []
  }
];

// get all chores from firestore
async function getAllChores() {
  var snapshot = await db.collection("chores").get();
  var chores = [];
  snapshot.forEach(function(doc) {
    chores.push({ id: doc.id, ...doc.data() });
  });
  return chores;
}

// get a single chore by document ID
async function getChoreById(id) {
  var doc = await db.collection("chores").doc(id).get();
  if (doc.exists) {
    return { id: doc.id, ...doc.data() };
  }
  return null;
}

// add a new chore to firestore
async function addChore(choreData) {
  var newChore = {
    title: choreData.title,
    description: choreData.description || "",
    assignedTo: choreData.assignedTo,
    status: "pending",
    dueDate: choreData.dueDate,
    recurrence: choreData.recurrence || "once",
    rotationOrder: choreData.rotationOrder || [],
    createdBy: choreData.createdBy || "",
    completedAt: null,
    history: []
  };
  var docRef = await db.collection("chores").add(newChore);
  return { id: docRef.id, ...newChore };
}

// update fields on an existing chore
async function updateChore(id, updates) {
  await db.collection("chores").doc(id).update(updates);
}

// mark a chore as completed
async function completeChore(id) {
  var doc = await db.collection("chores").doc(id).get();
  if (!doc.exists) return;

  var chore = doc.data();
  var today = new Date().toISOString().split("T")[0];
  var updatedHistory = chore.history || [];
  updatedHistory.push({
    userId: chore.assignedTo,
    date: today,
    status: "completed"
  });

  await db.collection("chores").doc(id).update({
    status: "completed",
    completedAt: today,
    history: updatedHistory
  });
}

// delete a chore from firestore
async function deleteChore(id) {
  await db.collection("chores").doc(id).delete();
}

// compute stats from a chores array (pass chores in to avoid extra db call)
function computeStats(chores, userId) {
  var total = chores.length;
  var completed = chores.filter(function(c) { return c.status === "completed"; }).length;
  var pending = chores.filter(function(c) { return c.status === "pending"; }).length;
  var overdue = chores.filter(function(c) { return c.status === "overdue"; }).length;
  var myChores = chores.filter(function(c) { return c.assignedTo === userId; }).length;
  return { total: total, completed: completed, pending: pending, overdue: overdue, myChores: myChores };
}

// get completion counts per user from chore history
function getCompletionCounts(chores) {
  var counts = {};
  chores.forEach(function(chore) {
    (chore.history || []).forEach(function(entry) {
      if (entry.status === "completed") {
        counts[entry.userId] = (counts[entry.userId] || 0) + 1;
      }
    });
  });
  return counts;
}

// get all users from the users collection
async function getAllUsers() {
  var snapshot = await db.collection("users").get();
  var users = [];
  snapshot.forEach(function(doc) {
    users.push({ id: doc.id, ...doc.data() });
  });
  return users;
}

// get a single user by their document ID
async function getUserById(uid) {
  var doc = await db.collection("users").doc(uid).get();
  if (doc.exists) {
    return { id: doc.id, ...doc.data() };
  }
  return null;
}

// reset chores - delete everything and seed with defaults
// pulls users from the users collection and assigns chores round-robin
async function resetChores() {
  // delete all current chores
  var snapshot = await db.collection("chores").get();
  var batch = db.batch();
  snapshot.forEach(function(doc) {
    batch.delete(doc.ref);
  });
  await batch.commit();

  // load users to assign chores to
  var users = await getAllUsers();
  if (users.length === 0) return;

  // seed default chores, assigning round-robin
  for (var i = 0; i < defaultChores.length; i++) {
    var chore = Object.assign({}, defaultChores[i]);
    var assignee = users[i % users.length];
    chore.assignedTo = assignee.id;
    chore.createdBy = users[0].id;
    // build rotation order from all users starting at assignee
    var rotation = [];
    for (var j = 0; j < users.length; j++) {
      rotation.push(users[(i + j) % users.length].id);
    }
    chore.rotationOrder = rotation;

    // add completed history entry for the "completed" chore
    if (chore.status === "completed") {
      chore.history = [{ userId: assignee.id, date: chore.completedAt, status: "completed" }];
    }

    await db.collection("chores").add(chore);
  }
}
