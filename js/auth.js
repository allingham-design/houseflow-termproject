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

// Signup (mock - adds to session only)
function signup(name, email, password) {
  const exists = MOCK_USERS.find((u) => u.email === email);
  if (exists) {
    return { success: false, message: "An account with this email already exists." };
  }

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const newUser = {
    id: "user" + (MOCK_USERS.length + 1),
    name: name,
    email: email,
    password: password,
    role: "roommate",
    avatar: initials,
    color: "richie"
  };

  MOCK_USERS.push(newUser);
  const sessionUser = { ...newUser };
  delete sessionUser.password;
  sessionStorage.setItem("houseflow_user", JSON.stringify(sessionUser));
  return { success: true, user: sessionUser };
}

// Logout
function logout() {
  sessionStorage.removeItem("houseflow_user");
  window.location.href = "index.html";
}

// Protect pages - redirect to login if not authenticated
function requireAuth() {
  const user = getCurrentUser();
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
