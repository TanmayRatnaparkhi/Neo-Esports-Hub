import { db } from "./firebase.js";
import { collection, query, where, getDocs, setDoc, doc, Timestamp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const openBtn = document.getElementById("openPopupBtn");
  const closeBtn = document.getElementById("closePopup");
  const popup = document.getElementById("popupForm");
  const submitBtn = document.getElementById("submitPlayer");

  openBtn.addEventListener("click", () => { popup.style.display = "block"; });
  closeBtn.addEventListener("click", () => { popup.style.display = "none"; });

  submitBtn.addEventListener("click", async () => {
    const username = document.getElementById("username").value.trim();
    const gameId = document.getElementById("gameId").value.trim();

    if (!username || !gameId) {
      alert("Please enter both Username and Game ID!");
      return;
    }

    try {
      // Query for existing player with same username or gameId
      const userQuery = query(
        collection(db, "UserGamesID"),
        where("username", "==", username),
      );
      const idQuery = query(
        collection(db, "UserGamesID"),
        where("gameId", "==", gameId),
      );

      const [userSnap, idSnap] = await Promise.all([getDocs(userQuery), getDocs(idQuery)]);

      if (!userSnap.empty || !idSnap.empty) {
        alert("⚠️ You have already registered with this Username or Game ID!");
        return;
      }

      // Use gameId as document ID
      const playerRef = doc(db, "UserGamesID", gameId);
      await setDoc(playerRef, {
        username: username,
        gameId: gameId,
        gameName: "BGMI",
        createdAt: Timestamp.now()
      });

      alert("✅ Game ID and Username added successfully!");
      popup.style.display = "none";
      document.getElementById("username").value = "";
      document.getElementById("gameId").value = "";

    } catch (err) {
      console.error("Error adding player: ", err);
      alert("⚠️ Failed to save. Try again!");
    }
  });
});
