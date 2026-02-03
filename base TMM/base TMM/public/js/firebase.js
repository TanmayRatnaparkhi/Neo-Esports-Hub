// ==================== FIREBASE IMPORTS ====================
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { 
  getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, 
  GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut 
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { 
  getFirestore, doc, setDoc, updateDoc, getDoc, increment 
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// ==================== FIREBASE CONFIG ====================
const firebaseConfig = {
  apiKey: "AIzaSyB8Xl3RQMHUhsiJS4Kk2y64Rsnwoh3jVkI",
  authDomain: "neo-esports-hub.firebaseapp.com",
  projectId: "neo-esports-hub",
  storageBucket: "neo-esports-hub.firebasestorage.app",
  messagingSenderId: "1033553084106",
  appId: "1:1033553084106:web:33a391d3e7eb1faaae7e33",
  measurementId: "G-5952VXT79F"
};

// ==================== INITIALIZE ====================
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ==================== PASSWORD TOGGLE ====================
document.querySelectorAll(".eye-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const input = document.getElementById(btn.getAttribute("data-target"));
    if(input) input.type = input.type === "password" ? "text" : "password";
  });
});

// ==================== HELPER FUNCTIONS ====================
function showToast(msg, duration = 2000) {
  const toast = document.createElement("div");
  toast.className = "custom-toast";
  toast.innerText = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), duration);
}

// ==================== LOGIN ====================
const loginForm = document.getElementById("loginformSection");
if (loginForm) {
  loginForm.addEventListener("submit", async e => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;
    const loginBtn = loginForm.querySelector("button[type=submit]");
    loginBtn.disabled = true;

    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const user = userCred.user;
      const docSnap = await getDoc(doc(db, "players", user.uid));

      if (docSnap.exists()) localStorage.setItem("username", docSnap.data().username);
      showToast(`Welcome back, ${docSnap.data().username || "Gamer"}!`);
      
      setTimeout(() => window.location.href = "/create-tournament.html", 1000);

    } catch (err) {
      console.error("Login Error:", err);
      alert("Login Failed: " + err.message);
    } finally {
      loginBtn.disabled = false;
    }
  });
}

// ==================== SIGNUP ====================
const registerForm = document.getElementById("registerForm")?.querySelector("form");
if (registerForm) {
  registerForm.addEventListener("submit", async e => {
    e.preventDefault();
    const username = document.getElementById("register-username").value.trim();
    const email = document.getElementById("register-email").value.trim();
    const password = document.getElementById("register-password").value;
    const submitBtn = registerForm.querySelector("button[type=submit]");
    submitBtn.disabled = true;

    if (!username || !email || !password) {
      alert("All fields are required!");
      submitBtn.disabled = false;
      return;
    }

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCred.user;

      await setDoc(doc(db, "players", user.uid), {
        username,
        uid: user.uid,
        coins: 10,
        wins: 0,
        tournaments_played: 0
      });

      localStorage.setItem("username", username);
      showToast(`✅ Registered! Welcome ${username}. You got 10 coins.`);
      setTimeout(() => window.location.href = "/create-tournament.html", 1000);

    } catch (err) {
      console.error("Registration Error:", err);
      if (err.code === "auth/email-already-in-use") {
        alert("This email is already registered. Please log in.");
        window.location.href = "login.html";
      } else {
        alert("Registration Failed: " + err.message);
      }
    } finally {
      submitBtn.disabled = false;
    }
  });
}

// ==================== GOOGLE LOGIN ====================
const googleBtn = document.getElementById("googleLogin");
if (googleBtn) {
  googleBtn.addEventListener("click", async () => {
    const provider = new GoogleAuthProvider();
    googleBtn.disabled = true;

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const userRef = doc(db, "players", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          username: user.displayName || "Gamer",
          uid: user.uid,
          coins: 10,
          wins: 0,
          tournaments_played: 0
        });
      }

      localStorage.setItem("username", user.displayName || "Gamer");
      showToast(`Welcome ${user.displayName || "Gamer"}!`);
      setTimeout(() => window.location.href = "/create-tournament.html", 1000);

    } catch (err) {
      console.error("Google Login Error:", err);
      alert("Google Login Failed: " + err.message);
    } finally {
      googleBtn.disabled = false;
    }
  });
}

// ==================== JOIN TOURNAMENT ====================
document.querySelectorAll(".join-btn").forEach(btn => {
  btn.addEventListener("click", async () => {
    const user = auth.currentUser;
    const tournamentName = btn.closest("div")?.querySelector("h3")?.innerText || "Tournament";

    if (!user) {
      alert("Please log in to join!");
      return window.location.href = "login.html";
    }

    try {
      const userRef = doc(db, "players", user.uid);
      await updateDoc(userRef, { tournaments_played: increment(1), coins: increment(5) });

      const updatedSnap = await getDoc(userRef);
      if (updatedSnap.exists()) {
        console.log("Updated Player Data:", updatedSnap.data());
        showToast(`✅ You joined ${tournamentName}! +5 coins added.`);
      }
    } catch (err) {
     
    }
  });
});

// ==================== PAGE PROTECTION ====================
onAuthStateChanged(auth, user => {
  if (!user && document.body.classList.contains("create-tournament-page")) {
    alert("Please log in first!");
    window.location.href = "login.html";
  } else if (user) {
    // Show username dynamically
    const usernameEl = document.querySelector("#currentUsername");
    if (usernameEl) usernameEl.textContent = localStorage.getItem("username") || "Gamer";
  }
});

// ==================== LOGOUT ====================
window.logout = function () {
  signOut(auth)
    .then(() => {
      localStorage.removeItem("username");
      showToast("Logged out successfully!");
      setTimeout(() => window.location.href = "home.html", 500);
    })
    .catch(err => console.error("Logout Error:", err));
};
