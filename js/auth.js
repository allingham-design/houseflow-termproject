 //  HouseFlow - Firebase Authentication

// LOGIN
function login(email, password) {
  return auth.signInWithEmailAndPassword(email, password)
    .then(async (cred) => {
      const uid = cred.user.uid;

      // Load Firestore profile
      const userDoc = await db.collection("users").doc(uid).get();

      if (!userDoc.exists) {
        alert("User profile missing in Firestore.");
        return { success: false };
      }

      const userData = userDoc.data();

      // Store in sessionStorage (your site already uses this)
      sessionStorage.setItem("houseflow_user", JSON.stringify(userData));

      // Redirect to dashboard
      window.location.href = "dashboard.html";

      return { success: true };
    })
    .catch((err) => {
      return { success: false, message: err.message };
    });
}

// SIGNUP
function signup(name, email, password) {
  return auth.createUserWithEmailAndPassword(email, password)
    .then(async (cred) => {
      const uid = cred.user.uid;

      const initials = name
        .split(" ")
        .map(n => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

      const newUser = {
        id: uid,
        name,
        email,
        role: "roommate",
        avatar: initials,
        color: "default"
      };

      // Save to Firestore
      await db.collection("users").doc(uid).set(newUser);

      // Save to session
      sessionStorage.setItem("houseflow_user", JSON.stringify(newUser));

      // Redirect
      window.location.href = "dashboard.html";

      return { success: true };
    })
    .catch((err) => {
      return { success: false, message: err.message };
    });
}

// LOGOUT
function logout() {
  auth.signOut().then(() => {
    sessionStorage.removeItem("houseflow_user");
    window.location.href = "index.html";
  });
}
// Protect pages - redirect to login if not authenticated
function requireAuth() {
  const user = auth.currentUser;
  if (!user) {
    window.location.href = "index.html";
    return null;
  }
  return user;
}

// Check if user is admin
function isAdmin() {
  const user = getCurrentUser();
  return user && user.role === "admin";
}

// Get all users (for assignment dropdowns)
function getAllUsers() {
  return MOCK_USERS.map((u) => ({
    id: u.id,
    name: u.name,
    avatar: u.avatar,
    color: u.color,
    role: u.role
  }));
}

// Get user by ID
function getUserById(id) {
  const user = MOCK_USERS.find((u) => u.id === id);
  if (user) {
    return { id: user.id, name: user.name, avatar: user.avatar, color: user.color, role: user.role };
  }
  return null;
}
