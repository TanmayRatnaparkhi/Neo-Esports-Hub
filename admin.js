import {
  db,
  auth,
  onAuthStateChanged,
  signOut,
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  Timestamp
} from "./firebase.js";

/* ---------------- DOM ---------------- */
const totalPlayersEl = document.getElementById("totalPlayers");
const totalTournamentsEl = document.getElementById("totalTournaments");
const totalJoinsEl = document.getElementById("totalJoins");

const tournamentListEl = document.getElementById("tournamentList");
const playerTableEl = document.getElementById("playerTable");

const popupEl = document.getElementById("tournamentPopup");
const addTournamentBtn = document.getElementById("addTournamentBtn");
const closePopupBtn = document.getElementById("closeTournamentPopup");
const saveTournamentBtn = document.getElementById("saveTournament");
const logoutBtn = document.getElementById("logoutBtn");

/* ---------------- Navigation ---------------- */
document.querySelectorAll(".nav-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.target;

    document.querySelectorAll(".admin-section").forEach((sec) =>
      sec.classList.add("hidden")
    );
    document.getElementById(target).classList.remove("hidden");

    if (target === "playerSection") loadPlayerManagement();
    if (target === "resultSection") loadResults();
    if (target === "supportSection") loadSupportTickets();
    if (target === "communicationSection") loadCommunication();
  });
});

/* ---------------- POPUP ---------------- */
addTournamentBtn.addEventListener("click", () =>
  popupEl.classList.remove("hidden")
);
closePopupBtn.addEventListener("click", () =>
  popupEl.classList.add("hidden")
);

/* ---------------- AUTH CHECK ---------------- */
onAuthStateChanged(auth, (user) => {
  if (!user) return (window.location.href = "index.html");
  initDashboard();
});

/* ---------------- INIT ---------------- */
async function initDashboard() {
  enableRealtimeDashboard();
  loadTournaments();
  loadPlayers();
}

/* ---------------- REALTIME DASHBOARD ---------------- */
function enableRealtimeDashboard() {
  // REALTIME PLAYERS COUNT FROM "players" collection
  onSnapshot(collection(db, "players"), (snap) => {
    totalPlayersEl.textContent = snap.size;
  });

  // REALTIME TOURNAMENTS + JOINS
  onSnapshot(collection(db, "tournaments"), async (tSnap) => {
    totalTournamentsEl.textContent = tSnap.size;

    // correct total joins (RECALCULATE FROM ZERO)
    let totalJoins = 0;

    for (const t of tSnap.docs) {
      const tId = t.id;

      const joinedRef = collection(db, "tournaments", tId, "joinedUsers");

      onSnapshot(joinedRef, (joinSnap) => {
        let currentTournamentJoinCount = joinSnap.size;

        // recalc global joins
        totalJoins += currentTournamentJoinCount;
        totalJoinsEl.textContent = totalJoins;
      });
    }
  });
}

/* ---------------- LOAD TOURNAMENTS ---------------- */
let currentFilter = "ALL";
let currentSort = "newest";
let tournamentsData = [];
let visibleCount = 10; // pagination

async function loadTournaments() {
  tournamentListEl.innerHTML = `<p class="text-gray-400">Loading...</p>`;

  const snap = await getDocs(collection(db, "tournaments"));
  tournamentsData = snap.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));

  renderTournamentCards();
}

function renderTournamentCards() {
  let list = [...tournamentsData];

  // FILTER
  if (currentFilter !== "ALL") {
    list = list.filter(t => t.game === currentFilter);
  }

  // SORT
  list.sort((a, b) => applySorting(a, b));

  // LIMIT (pagination)
  const displayList = list.slice(0, visibleCount);

  const cards = displayList.map(t => {
    
    // DATE FIX
    let createdAt = "Unknown";
    if (t.createdAt) {
      createdAt = new Date(t.createdAt.toDate ? t.createdAt.toDate() : t.createdAt).toLocaleString();
    }

    let startTime = t.startTime
      ? new Date(t.startTime.toDate()).toLocaleString()
      : "Not Set";

    // STATUS BADGE
    let status = "Upcoming";
    let now = Date.now();
    let start = t.startTime ? t.startTime.toDate().getTime() : 0;

    if (t.winner) status = "Completed";
    else if (start < now) status = "Live";

    let statusColor = {
      "Upcoming": "bg-blue-600",
      "Live": "bg-green-600",
      "Completed": "bg-gray-600"
    }[status];

    return `
      <div class="bg-gray-800 p-4 rounded-lg border border-gray-700 shadow-md">

        <div class="flex justify-between items-center">
          <h3 class="text-lg font-bold text-yellow-300">${t.title}</h3>
          <span class="text-xs ${statusColor} px-2 py-1 rounded">${status}</span>
        </div>

        <p class="text-xs bg-cyan-600 inline-block px-2 py-1 rounded mt-1">${t.game}</p>

        <div class="text-gray-300 text-sm mt-2 space-y-1">
          <p><b>Modes:</b> ${t.modes}</p>
          <p><b>Prize:</b> ₹${t.prize} | <b>Entry:</b> ₹${t.entryFee}</p>
          <p><b>Players:</b> ${(t.joinedPlayers || 0)} / ${t.totalPlayers}</p>
          <p><b>Room:</b> ${t.roomId} | Pass: ${t.roomPass}</p>
          <p><b>Start:</b> ${startTime}</p>
          <p class="text-gray-500 text-xs"><b>Created:</b> ${createdAt}</p>
        </div>

        <div class="flex gap-2 mt-3">
          <button onclick="openEditPopup('${t.id}')"
            class="bg-blue-600 px-3 py-2 rounded w-1/2 hover:bg-blue-700">Edit</button>

          <button onclick="deleteTournament('${t.id}')"
            class="bg-red-600 px-3 py-2 rounded w-1/2 hover:bg-red-700">Delete</button>
        </div>

      </div>
    `;
  }).join("");

  // LOAD MORE BUTTON
  const loadMoreBtn = list.length > visibleCount
    ? `<button onclick="loadMore()" class="bg-gray-700 px-4 py-2 rounded w-full mt-4">Load More</button>`
    : "";

  tournamentListEl.innerHTML = cards + loadMoreBtn;
}

function loadMore() {
  visibleCount += 10;
  renderTournamentCards();
}

// SORTING LOGIC
function applySorting(a, b) {
  switch (currentSort) {
    case "newest": return b.createdAt - a.createdAt;
    case "oldest": return a.createdAt - b.createdAt;
    case "prizeHigh": return b.prize - a.prize;
    case "prizeLow": return a.prize - b.prize;
    case "joinHigh": return (b.joinedPlayers || 0) - (a.joinedPlayers || 0);
    case "joinLow": return (a.joinedPlayers || 0) - (b.joinedPlayers || 0);
    default: return 0;
  }
}



/* DELETE TOURNAMENT */
window.deleteTournament = async (id) => {
  if (!confirm("Delete this tournament?")) return;

  await deleteDoc(doc(db, "tournaments", id));
  loadTournaments();
};

/* ---------------- LOAD JOINED PLAYERS ---------------- */
async function loadPlayers() {
  playerTableEl.innerHTML = `
    <tr>
      <td colspan="4" class="text-center py-3 text-gray-400">Loading...</td>
    </tr>
  `;

  try {
    const tournamentsSnap = await getDocs(collection(db, "tournaments"));

    let rows = [];

    for (const tDoc of tournamentsSnap.docs) {
      const tId = tDoc.id;

      // Read joinedUsers from subcollection
      const joinedSnap = await getDocs(
        collection(db, "tournaments", tId, "joinedUsers")
      );

      joinedSnap.forEach((userDoc) => {
        const u = userDoc.data();

        // HANDLE FIRESTORE TIMESTAMP SAFELY
        let joinTime = "-";
        if (u.joinAt) {
          try {
            if (u.joinAt.toDate) {
              joinTime = u.joinAt.toDate().toLocaleString();
            } else {
              joinTime = new Date(u.joinAt).toLocaleString();
            }
          } catch {
            joinTime = "-";
          }
        }

        rows.push(`
          <tr class="border-b border-gray-700 text-sm">
            <td class="py-2 px-3">${tId}</td>
            <td class="py-2 px-3">${u.username || "Unknown"}</td>
            <td class="py-2 px-3">${u.gameId || "-"}</td>
            <td class="py-2 px-3">${joinTime}</td>
          </tr>
        `);
      });
    }

    // If no players joined:
    if (rows.length === 0) {
      playerTableEl.innerHTML = `
        <tr>
          <td colspan="4" class="text-center py-3 text-gray-500">
            No players have joined any tournament yet.
          </td>
        </tr>
      `;
      return;
    }

    playerTableEl.innerHTML = rows.join("");

  } catch (err) {
    console.error("loadPlayers() error:", err);
    playerTableEl.innerHTML = `
      <tr>
        <td colspan="4" class="text-center py-3 text-red-500">
          Error loading players.
        </td>
      </tr>
    `;
  }
}


/* ---------------- RESULTS ---------------- */
async function loadResults() {
  const sec = document.getElementById("resultSection");
  sec.innerHTML = `
    <h2 class="text-xl font-bold text-yellow-300 mb-3">Results & Prize Distribution</h2>
    <div id="resultList" class="space-y-3"></div>
  `;

  const listEl = document.getElementById("resultList");
  const snap = await getDocs(collection(db, "tournaments"));

  listEl.innerHTML = snap.docs
    .map(
      (d) => `
    <div class="bg-gray-800 p-4 rounded">
      <h3 class="font-bold">${d.data().title}</h3>
      <input id="winner-${d.id}" class="w-full p-2 bg-gray-700 mt-2 rounded" placeholder="Winner username">
      <button onclick="saveWinner('${d.id}')" class="bg-green-500 mt-2 px-3 py-1 rounded">Save Winner</button>
    </div>
  `
    )
    .join("");
};

window.saveWinner = async (id) => {
  const input = document.getElementById(`winner-${id}`);
  if (!input.value.trim()) return alert("Enter winner name");

  await updateDoc(doc(db, "tournaments", id), { winner: input.value });
  alert("Winner Saved");
};

/* ---------------- SUPPORT ---------------- */
async function loadSupportTickets() {
  const sec = document.getElementById("supportSection");
  sec.innerHTML = `
    <h2 class="text-xl font-bold text-red-300 mb-3">Support Moderation</h2>
    <div id="supportList" class="space-y-3"></div>
  `;

  const listEl = document.getElementById("supportList");
  const snap = await getDocs(collection(db, "supportTickets"));

  listEl.innerHTML =
    snap.docs
      .map((s) => {
        const d = s.data();
        return `
        <div class="bg-gray-800 p-4 rounded border border-gray-700">
          <p><b>User:</b> ${d.userId}</p>
          <p><b>Issue:</b> ${d.message}</p>
          <button onclick="resolveTicket('${s.id}')" class="bg-green-600 px-3 py-1 mt-2 rounded">Resolve</button>
        </div>
      `;
      })
      .join("") || `<p>No tickets.</p>`;
}

window.resolveTicket = async (id) => {
  await deleteDoc(doc(db, "supportTickets", id));
  loadSupportTickets();
};

/* ---------------- COMMUNICATION ---------------- */
function loadCommunication() {
  const sec = document.getElementById("communicationSection");
  sec.innerHTML = `
    <h2 class="text-xl font-bold text-purple-300 mb-3">Communication</h2>
    <textarea id="broadcastMsg" class="w-full p-3 bg-gray-800 rounded" rows="4"
      placeholder="Write message to broadcast"></textarea>
    <button onclick="sendBroadcast()" class="bg-cyan-500 mt-2 px-3 py-1 rounded">Send</button>
  `;
}

window.sendBroadcast = async () => {
  const msg = document.getElementById("broadcastMsg").value.trim();
  if (!msg) return alert("Type something");

  await addDoc(collection(db, "notifications"), {
    message: msg,
    createdAt: new Date()
  });

  alert("Broadcast Sent!");
  document.getElementById("broadcastMsg").value = "";
};

/* ---------------- SAVE TOURNAMENT ---------------- */
saveTournamentBtn.addEventListener("click", async () => {
  
  const game = document.getElementById("game").value.trim();
  const title = document.getElementById("title").value.trim();
  const banner = document.getElementById("banner").value.trim();
  const modes = document.getElementById("modes").value.trim();
  const prize = Number(document.getElementById("prize").value || 0);
  const entryFee = Number(document.getElementById("entryFee").value || 0);
  const totalPlayers = Number(document.getElementById("totalPlayers").value || 0);
  const startTimeInput = document.getElementById("startTime").value;
  const roomId = document.getElementById("roomId").value.trim();
  const roomPass = document.getElementById("roomPass").value.trim();

  if (!game || !title) return alert("Game & Title are required");

  const startTime = startTimeInput ? Timestamp.fromDate(new Date(startTimeInput)) : null;

  await addDoc(collection(db, "tournaments"), {
    game,
    title,
    banner,
    modes,
    prize,
    entryFee,
    totalPlayers,
    startTime,
    roomId,
    roomPass,
    joinedPlayers: 0,
    createdAt: new Date()
  });

  popupEl.classList.add("hidden");
  loadTournaments();
});

/* ---------------- LOGOUT ---------------- */
logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html";
});

document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.game;
    loadTournaments();
  });
});

// FILTER BUTTONS
document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.game;
    visibleCount = 10;
    renderTournamentCards();
  });
});

// SORT DROPDOWN
document.getElementById("sortSelect").addEventListener("change", (e) => {
  currentSort = e.target.value;
  renderTournamentCards();
});

window.openEditPopup = (id) => {
  const t = tournamentsData.find(x => x.id === id);

  document.getElementById("editTitle").value = t.title;
  document.getElementById("editModes").value = t.modes;
  document.getElementById("editPrize").value = t.prize;
  document.getElementById("editEntryFee").value = t.entryFee;
  document.getElementById("editTotalPlayers").value = t.totalPlayers;
  document.getElementById("editRoomId").value = t.roomId;
  document.getElementById("editRoomPass").value = t.roomPass;
  document.getElementById("editStartTime").value =
    t.startTime ? t.startTime.toDate().toISOString().slice(0,16) : "";

  document.getElementById("updateTournamentBtn").setAttribute("data-id", id);

  document.getElementById("editPopup").classList.remove("hidden");
};

window.closeEditPopup = () => {
  document.getElementById("editPopup").classList.add("hidden");
};

document.getElementById("updateTournamentBtn").addEventListener("click", async (e) => {
  const id = e.target.dataset.id;

  await updateDoc(doc(db, "tournaments", id), {
    title: document.getElementById("editTitle").value,
    modes: document.getElementById("editModes").value,
    prize: Number(document.getElementById("editPrize").value),
    entryFee: Number(document.getElementById("editEntryFee").value),
    totalPlayers: Number(document.getElementById("editTotalPlayers").value),
    roomId: document.getElementById("editRoomId").value,
    roomPass: document.getElementById("editRoomPass").value,
    startTime: Timestamp.fromDate(new Date(document.getElementById("editStartTime").value))
  });

  closeEditPopup();
  loadTournaments();
});
