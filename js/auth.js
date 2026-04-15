/* ============================================
   HouseFlow - Mock Authentication
   Simulates login/signup for prototype phase.
   Will be replaced with Firebase Auth later.
   ============================================ */

// Mock user database
const MOCK_USERS = [
  {
    id: "user1",
    name: "Danny Nguyen",
    email: "dannynguyen995@gmail.com",
    password: "password123",
    role: "admin",
    avatar: "DN",
    color: "danny"
  },
  {
    id: "user2",
    name: "Brittney Vo",
    email: "Brittneyvo1026@gmail.com",
    password: "password123",
    role: "roommate",
    avatar: "BV",
    color: "brittney"
  },
  {
    id: "user3",
    name: "Richie Huynh",
    email: "richhhuynh722@gmail.com",
    password: "password123",
    role: "roommate",
    avatar: "RH",
    color: "richie"
  }
];

// Get current logged-in user from session
function getCurrentUser() {
  const userData = sessionStorage.getItem("houseflow_user");
  if (userData) {
    return JSON.parse(userData);
  }
  return null;
}

// Login
function login(email, password) {
  const user = MOCK_USERS.find(
    (u) => u.email === email && u.password === password
  );
  if (user) {
    const sessionUser = { ...user };
    delete sessionUser.password;
    sessionStorage.setItem("houseflow_user", JSON.stringify(sessionUser));
    return { success: true, user: sessionUser };
  }
  return { success: false, message: "Invalid email or password." };
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
