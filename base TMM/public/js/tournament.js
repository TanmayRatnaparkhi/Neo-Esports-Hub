// tournament.js (fixed, ready-to-paste)

// ----- Firebase imports -----
import { db, auth } from "./firebase.js";
import {
  collection,
  addDoc,
  getDoc,
  doc,
  Timestamp
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

// ----- Auth State -----
let currentUser = null;
onAuthStateChanged(auth, (user) => {
  currentUser = user;
  if (user) console.log("Logged in:", user.email);
  else console.log("No user logged in");
});

// ----- Popup Elements -----
const popup = document.getElementById('popupForm');
const openBtn = document.querySelector('[id^="openPopup"]');
const closeBtn = document.getElementById('closePopup');
const submitBtn = document.getElementById('submitPlayer');
const usernameInput = document.getElementById('username');
const gameIdInput = document.getElementById('gameId');

// ----- Popup Open/Close -----
openBtn.addEventListener('click', () => popup.style.display = 'flex');
closeBtn.addEventListener('click', () => popup.style.display = 'none');
popup.addEventListener('click', e => { if (e.target === popup) popup.style.display = 'none'; });

// ----- Dynamic collection helper -----
function getCurrentCollection() {
  if (window.location.href.includes('bgmi')) return 'BGMI_Users';
  else if (window.location.href.includes('valorant')) return 'Valorant_Users';
  else if (window.location.href.includes('freefire')) return 'FreeFire_Users';
  else return 'Default_Users';
}

// ----- Submit player data (popup form) -----
submitBtn.addEventListener('click', async () => {
  const username = usernameInput.value.trim();
  const gameId = gameIdInput.value.trim();
  const tournamentId = document.querySelector('.t-card')?.querySelector('.t-id')?.textContent || 'TPP-001';

  if (!username || !gameId) return alert('Please enter all fields!');

  const currentCollection = getCurrentCollection();

  try {
    await addDoc(collection(db, currentCollection), {
      username,
      gameId,
      tournamentName: tournamentId,
      joinedAt: Timestamp.now()
    });
    alert('Player added successfully!');
    usernameInput.value = '';
    gameIdInput.value = '';
    popup.style.display = 'none';
  } catch (err) {
    console.error(err);
    alert('Error adding player.');
  }
});

// ----- Tournaments Data -----
const tournaments = [
  {
    id: "TPP-001",
    name: "BGMI Royale Cup",
    game: "BGMI",
    description: "BGMI tournament for everyone",
    date: "2025-10-05",
    time: "5:00 PM",
    map: "Erangel",
    mode: "Squad/Duo",
    image: "https://cdn.discordapp.com/attachments/1272819774749147192/1420339335756251229/Screenshot_2025-09-24_144603.png",
  },
  {
    id: "TPP-002",
    name: "Free Fire Clash",
    game: "Free Fire",
    description: "Free Fire fun tournament",
    date: "2025-10-10",
    time: "6:00 PM",
    map: "Bermuda",
    mode: "Squad",
    image: "https://cdn.discordapp.com/attachments/1272819774749147192/1420339334892097707/Screenshot_2025-09-24_144923.png",
  },
  {
    id: "TPP-003",
    name: "Valorant Strike",
    game: "Valorant",
    description: "Competitive Valorant tournament",
    date: "2025-10-15",
    time: "7:00 PM",
    map: "Ascent",
    mode: "5v5",
    image: "https://cdn.discordapp.com/attachments/1272819774749147192/1420339335319912498/Screenshot_2025-09-24_144632.png",
  },
];

// ----- Render Tournaments -----
function renderTournaments(filterGame = null) {
  const container = document.getElementById("tournament-list");
  if (!container) return;
  container.innerHTML = "";

  const filtered = filterGame ? tournaments.filter(t => t.game === filterGame) : tournaments;

  filtered.forEach(t => {
    const card = document.createElement("div");
    card.classList.add("t-card");
    card.innerHTML = `
      <div class="t-banner">
        <img src="${t.image}" alt="${t.name} banner">
        <div class="platform-badge">${t.game}</div>
      </div>
      <div class="t-body">
        <div class="t-title"><h3>${t.name}</h3><div class="t-id badge">${t.id}</div></div>
        <div class="time"><strong>Start:</strong> ${t.date} ${t.time}</div>
        <p>${t.description}</p>
        <input type="text" class="player-id" placeholder="Enter your in-game ID (optional)">
        <div><button class="btn join-btn">Join Now</button></div>
      </div>
    `;

    const joinBtn = card.querySelector(".join-btn");
    const idInput = card.querySelector(".player-id");

    joinBtn.addEventListener("click", async () => {
      const quickId = idInput.value.trim();

      if (!currentUser) { alert("Please log in first!"); return; }

      const currentCollection = getCurrentCollection();

      // Quick join
      if (quickId) {
        try {
          await addDoc(collection(db, currentCollection), {
            userEmail: currentUser.email || currentUser.uid,
            game: t.game,
            tournamentName: t.name,
            playerId: quickId,
            joinedAt: Timestamp.now()
          });
          alert(`✅ You joined ${t.name} with ID: ${quickId}`);
          joinBtn.disabled = true; joinBtn.textContent = "Joined"; idInput.disabled = true;
          return;
        } catch (err) { console.error(err); alert("Failed to join with entered ID."); return; }
      }

      // Saved profile join
      try {
        const playerDocRef = doc(db, "playersGameIDs", currentUser.uid);
        const snap = await getDoc(playerDocRef);
        const saved = snap.exists() && snap.data() && snap.data()[t.game.toLowerCase()];

        if (saved) {
          const ok = await joinTournament(t.name, t.game);
          if (ok) { alert(`✅ You joined ${t.name} successfully!`); joinBtn.disabled = true; joinBtn.textContent = "Joined"; }
          else alert("⚠️ Could not join. Try again.");
        } else {
          window.pendingTournamentName = t.name;
          popup.style.display = "flex";
        }
      } catch (err) { console.error(err); alert("Something went wrong."); }
    });

    container.appendChild(card);
  });
}

// ----- joinTournament helper -----
async function joinTournament(tournamentName, tGame) {
  if (!currentUser) return false;

  const currentCollection = getCurrentCollection();

  try {
    await addDoc(collection(db, currentCollection), {
      userEmail: currentUser.email || currentUser.uid,
      game: tGame,
      tournamentName,
      joinedAt: Timestamp.now()
    });
    return true;
  } catch (err) {
    console.error("joinTournament error:", err);
    return false;
  }
}


// ----- Filter helper -----
window.filterTournaments = (game) => renderTournaments(game);

// ----- Initial render -----
renderTournaments();
document.addEventListener("click", () => {
  if (!localStorage.getItem('played')) {
    music.play();
    setTimeout(() => {
      music.pause();
      music.currentTime = 0;
    }, 5000);
    localStorage.setItem('played', 'true');
  }
}, { once: true });
