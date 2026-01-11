// home.js
document.addEventListener("DOMContentLoaded", function () {
  const auth = firebase.auth();
  const db = firebase.firestore();

  // Join tournament buttons
  document.querySelectorAll(".join-btn").forEach(btn => {
    btn.addEventListener("click", async () => {
      const user = auth.currentUser;
      const tournamentName = btn.closest(".tournament-card").querySelector("h3").innerText;

      if (!user) {
        // Show Join Modal instead of old popups
        document.getElementById("joinModal").classList.remove("hidden");
        return;
      }

      try {
        const userRef = db.collection("players").doc(user.uid);
        await userRef.update({
          tournaments_played: firebase.firestore.FieldValue.increment(1)
        });
        alert(`✅ You joined ${tournamentName}`);
      } catch (err) {
        console.error(err);
        alert("❌ Could not join tournament");
      }
    });
  });

  // Eye toggle for password fields
  document.querySelectorAll(".eye-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const input = document.getElementById(btn.dataset.target);
      if (!input) return;
      input.type = input.type === "password" ? "text" : "password";
      btn.classList.toggle("active");
    });
  });
});

// Close Join Modal
function closeModal() {
  document.getElementById("joinModal").classList.add("hidden");
}
