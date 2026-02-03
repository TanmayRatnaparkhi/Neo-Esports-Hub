// ==================== FIREBASE IMPORTS ====================
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// ==================== FIREBASE CONFIG ====================
const firebaseConfig = {
  apiKey: "AIzaSyB8Xl3RQMHUhsiJS4Kk2y64Rsnwoh3jVkI",
  authDomain: "neo-esports-hub.firebaseapp.com",
  projectId: "neo-esports-hub",
  storageBucket: "neo-esports-hub.firebasestorage.app",
  messagingSenderId: "1033553084106",
  appId: "1:1033553084106:web:33a391d3e7eb1faaae7e33",
};

// ==================== INITIALIZE FIREBASE ====================
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ==================== VERIFY ADMIN ACCESS ====================
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    alert("Please log in first!");
    return (window.location.href = "index.html");
  }

  // Query Firestore admins collection
  const q = query(collection(db, "admins"), where("email", "==", user.email));
  const snap = await getDocs(q);

  if (snap.empty) {
    alert("❌ Unauthorized access — you are not an admin!");
    return (window.location.href = "index.html");
  }

  console.log(`✅ Verified Admin: ${user.email}`);
  loadDashboard();
});

// ==================== LOGOUT ====================
document.getElementById("logoutBtn")?.addEventListener("click", () => {
  signOut(auth).then(() => {
    alert("Logged out successfully!");
    window.location.href = "index.html";
  });
});

// ==================== LOAD DASHBOARD DATA ====================
async function loadDashboard() {
  try {
    const playerSnap = await getDocs(collection(db, "players"));
    const tournamentSnap = await getDocs(collection(db, "tournaments"));
    const bgmiSnap = await getDocs(collection(db, "BGMI_Users"));
    const valoSnap = await getDocs(collection(db, "Valorant_Users"));
    const ffSnap = await getDocs(collection(db, "FreeFire_Users"));

    document.getElementById("totalPlayers").textContent = playerSnap.size;
    document.getElementById("totalTournaments").textContent =
      tournamentSnap.size || 3;
    document.getElementById("totalJoins").textContent =
      bgmiSnap.size + valoSnap.size + ffSnap.size;

    // ====== Player Table ======
    const playerTable = document.getElementById("playerTable");
    playerSnap.forEach((docu) => {
      const d = docu.data();
      playerTable.innerHTML += `
        <tr class="border-t border-gray-800 hover:bg-gray-800 transition">
          <td class="py-2 px-3">${d.email || "N/A"}</td>
          <td class="py-2 px-3">${d.username}</td>
          <td class="py-2 px-3">${d.coins ?? 0}</td>
          <td class="py-2 px-3">${d.tournaments_played ?? 0}</td>
        </tr>
      `;
    });

    // ====== Tournaments ======
    const tournamentList = document.getElementById("tournamentList");
    tournamentSnap.forEach((docu) => {
      const t = docu.data();
      tournamentList.innerHTML += `
        <div class="p-3 border border-gray-700 rounded flex justify-between items-center hover:bg-gray-800 transition">
          <div>
            <h4 class="font-semibold text-white">${t.name}</h4>
            <p class="text-sm text-gray-400">${t.date || "No date"} • ${
        t.game || "Game"
      }</p>
          </div>
          <button class="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded text-sm font-medium"
            onclick="editTournament('${docu.id}')">✏️ Edit</button>
        </div>
      `;
    });
  } catch (err) {
    console.error("Dashboard Load Error:", err);
    alert("⚠️ Failed to load admin data.");
  }
}

// ==================== ADD TOURNAMENT ====================
document.getElementById("addTournament")?.addEventListener("click", async () => {
  const name = prompt("Enter tournament name:");
  const game = prompt("Enter game (BGMI / Valorant / Free Fire):");
  const date = prompt("Enter date (YYYY-MM-DD):");

  if (!name || !game) return alert("Please fill all fields!");

  try {
    await addDoc(collection(db, "tournaments"), {
      name,
      game,
      date,
      status: "upcoming",
      createdAt: new Date().toISOString(),
    });
    alert("✅ Tournament added successfully!");
    location.reload();
  } catch (err) {
    console.error("Add Tournament Error:", err);
    alert("❌ Failed to add tournament.");
  }
});

// ==================== EDIT TOURNAMENT ====================
window.editTournament = async (id) => {
  const newName = prompt("Enter new tournament name:");
  if (!newName) return alert("No changes made.");

  try {
    const ref = doc(db, "tournaments", id);
    await updateDoc(ref, { name: newName });
    alert("✅ Tournament updated!");
    location.reload();
  } catch (err) {
    console.error("Update Error:", err);
    alert("⚠️ Failed to update tournament.");
  }
};
