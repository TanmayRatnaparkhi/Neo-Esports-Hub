// detail.js
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("detail-content");
  const data = JSON.parse(localStorage.getItem("selectedTournament"));

  if (!data) {
    container.innerHTML = "<p>No tournament selected.</p>";
    return;
  }

  container.innerHTML = `
    <div class="tournament-card" style="max-width:500px; margin:auto;">
      <h1>${data.name}</h1>
      <p><strong>Date:</strong> ${data.date}</p>
      <p><strong>Prize:</strong> ${data.prize}</p>
      <p><strong>Description:</strong> ${data.desc}</p>
      <button class="join-btn">Join Tournament</button>
    </div>
  `;
});
function formatDate(dateString) {
  const d = new Date(dateString);
  return d.toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });
}

const menuBtn = document.getElementById("menuBtn"); // your navbar button
const sidebar = document.querySelector(".sidebar");

menuBtn.addEventListener("click", () => {
  sidebar.classList.toggle("active");
});
