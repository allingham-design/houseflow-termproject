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
  auth.onAuthStateChanged((user) => {
    if (!user) {
      window.location.href = "index.html";
    }
  });
}

// Check if user is admin
function isAdmin() {
  const data = sessionStorage.getItem("houseflow_user");
  if (!data) return false;
  const user = JSON.parse(data);
  return user && user.role === "admin";
}


// LOGIN BUTTON
document.getElementById("login-btn")?.addEventListener("click", async () => {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  const result = await login(email, password);

  if (!result.success) {
    alert(result.message);
  }
});

// SIGNUP BUTTON 
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
    alert(result.message);
  }
});



