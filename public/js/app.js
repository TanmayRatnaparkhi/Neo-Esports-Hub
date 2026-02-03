// app.js — handles login, register, Google sign-in, and admin redirect 🚀

import {
  auth,
  db,
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  increment,
  updateDoc,
} from "./firebase.js";

// ---------------------- Toast Notification ----------------------
function showToast(msg, duration = 2500) {
  const toast = document.createElement("div");
  toast.className =
    "fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-cyan-500 text-black px-4 py-2 rounded-lg font-semibold shadow-lg z-50";
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), duration);
}

// ---------------------- SIGN UP ----------------------
const registerForm = document.getElementById("registerForm")?.querySelector("form");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("regUsername").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const password = document.getElementById("regPassword").value.trim();

    if (!username || !email || !password) return alert("All fields are required!");

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCred.user;

      await setDoc(doc(db, "players", user.uid), {
        username,
        email,
        uid: user.uid,
        coins: 10,
        wins: 0,
        tournaments_played: 0,
        joinedAt: new Date().toISOString(),
      });

      localStorage.setItem("username", username);
      showToast(`✅ Welcome ${username}! You earned 10 coins.`);

      setTimeout(() => (window.location.href = "create-tournament.html"), 1500);
    } catch (err) {
      console.error(err);
      alert("Registration failed: " + err.message);
    }
  });
}

// ---------------------- LOGIN ----------------------
const loginForm = document.getElementById("loginform");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();
    if (!email || !password) return alert("Enter email & password!");

      const loginBtn = loginForm.querySelector('button[type="submit"]');
      if (loginBtn) loginBtn.disabled = true;

    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const user = userCred.user;

      // Check if user is admin
      const adminQuery = query(collection(db, "admins"), where("email", "==", user.email));
      const adminSnap = await getDocs(adminQuery);

      if (!adminSnap.empty) {
        // redirect to admin dashboard
        showToast("👑 Welcome back, Admin!");
        setTimeout(() => (window.location.href = "admin/admin.html"), 1000);
      } else {
        // normal user
        const playerSnap = await getDoc(doc(db, "players", user.uid));
        if (playerSnap.exists()) {
          localStorage.setItem("username", playerSnap.data().username);
          showToast(`Welcome ${playerSnap.data().username || "Gamer"}!`);
        }
        setTimeout(() => (window.location.href = "create-tournament.html"), 1000);
      }
    } catch (err) {
      console.error(err);
      alert("Login failed: " + err.message);
    }
  });
}

// ---------------------- GOOGLE SIGN-IN ----------------------
const googleBtn = document.getElementById("googleLogin");
if (googleBtn) {
  googleBtn.addEventListener("click", async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user exists in Firestore
      const userRef = doc(db, "players", user.uid);
      const snap = await getDoc(userRef);
      if (!snap.exists()) {
        await setDoc(userRef, {
          username: user.displayName || "Gamer",
          email: user.email,
          uid: user.uid,
          coins: 10,
          wins: 0,
          tournaments_played: 0,
          joinedAt: new Date().toISOString(),
        });
      }

      // Check if Google user is admin
      const adminQuery = query(collection(db, "admins"), where("email", "==", user.email));
      const adminSnap = await getDocs(adminQuery);
      if (!adminSnap.empty) {
        showToast("👑 Logged in as Admin!");
        setTimeout(() => (window.location.href = "admin/admin.html"), 1200);
      } else {
        showToast("✅ Logged in successfully!");
        setTimeout(() => (window.location.href = "create-tournament.html"), 1200);
      }
    } catch (err) {
      console.error(err);
      alert("Google Sign-in failed: " + err.message);
    }
  });
}

// ---------------------- JOIN TOURNAMENT ----------------------
document.querySelectorAll(".join-btn").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const user = auth.currentUser;
    if (!user) return alert("Please log in first!");

    try {
      const userRef = doc(db, "players", user.uid);
      await updateDoc(userRef, {
        tournaments_played: increment(1),
        coins: increment(5),
      });
      showToast("✅ You joined a tournament! +5 coins");
    } catch (err) {
      console.error("Join error:", err);
      alert("Something went wrong joining tournament.");
    }
  });
});

// ---------------------- LOGOUT ----------------------
window.logout = function () {
  signOut(auth)
    .then(() => {
      localStorage.removeItem("username");
      showToast("Logged out!");
      setTimeout(() => (window.location.href = "index.html"), 800);
    })
    .catch((err) => console.error("Logout Error:", err));
};

// ---------------------- AUTO-LOGIN REDIRECT ----------------------
onAuthStateChanged(auth, (user) => {
  if (!user) return;
  const page = window.location.pathname;

  if (page.includes("index.html") || page === "/") {
    query(collection(db, "admins"), where("email", "==", user.email)).then(async (snap) => {
      if (!snap.empty) window.location.href = "admin/admin.html";
      else window.location.href = "create-tournament.html";
    });
  }
});
