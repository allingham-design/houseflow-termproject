// HouseFlow - Firebase Authentication
// Handles login, signup, logout, and auth protection

// LOGIN - authenticate with firebase and load user profile from firestore
function login(email, password) {
  return auth.signInWithEmailAndPassword(email, password)
    .then(async (cred) => {
      const uid = cred.user.uid;

      // load user profile from firestore
      const userDoc = await db.collection("users").doc(uid).get();

      if (!userDoc.exists) {
        alert("User profile not found.");
        return { success: false };
      }
      
      const userData = userDoc.data();

      // store in session for quick access on other pages
      sessionStorage.setItem("houseflow_user", JSON.stringify(userData));

      // redirect to dashboard
      window.location.href = "dashboard.html";

      return { success: true };
    })
    .catch((err) => {
      return { success: false, message: err.message };
    });
}

// SIGNUP - create firebase auth account and save profile to firestore
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

      // assign a color based on how many users exist
      const usersSnap = await db.collection("users").get();
      const colorIndex = (usersSnap.size % 5) + 1;

      const newUser = {
        id: uid,
        name,
        email,
        role: "roommate",
        avatar: initials,
        color: "color-" + colorIndex
      };

      // save user profile to firestore users collection
      await db.collection("users").doc(uid).set(newUser);

      // store in session
      sessionStorage.setItem("houseflow_user", JSON.stringify(newUser));

      // redirect
      window.location.href = "dashboard.html";

      return { success: true };
    })
    .catch((err) => {
      return { success: false, message: err.message };
    });
}

// LOGOUT - sign out of firebase and clear session
function logout() {
  auth.signOut().then(() => {
    sessionStorage.removeItem("houseflow_user");
    window.location.href = "index.html";
  });
}

// check if current user is admin based on session data
function isAdmin() {
  const data = sessionStorage.getItem("houseflow_user");
  if (!data) return false;
  const user = JSON.parse(data);
  return user && user.role === "admin";
}

// LOGIN BUTTON handler
document.getElementById("login-btn")?.addEventListener("click", async () => {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  const result = await login(email, password);

  if (!result.success) {
    alert(result.message || "Login failed.");
  }
});

// SIGNUP BUTTON handler
document.getElementById("signup-btn")?.addEventListener("click", async () => {
  const name = document.getElementById("signup-name").value;
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  if (!name || !email || !password) {
    alert("Please fill out all fields.");
    return;
  }

  const result = await signup(name, email, password);

  if (!result.success) {
    alert(result.message || "Signup failed.");
  }
});
