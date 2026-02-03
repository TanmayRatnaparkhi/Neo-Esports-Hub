import { neoChat } from "./chatbot.js";

const chatToggle = document.getElementById("chat-toggle");
const chatBox = document.getElementById("chat-container");
const chatClose = document.getElementById("chat-close");
const chatMessages = document.getElementById("chat-messages");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

/* --- Open/Close --- */
chatToggle.addEventListener("click", () => {
  chatBox.style.display = "flex";
  setTimeout(() => {
    chatBox.style.opacity = "1";
    chatBox.style.transform = "translateY(0)";
  }, 10);
});

chatClose.addEventListener("click", () => {
  chatBox.style.opacity = "0";
  chatBox.style.transform = "translateY(10px)";

  setTimeout(() => {
    chatBox.style.display = "none";
  }, 250);
});

/* --- Message UI --- */
function addMessage(text, sender = "ai") {
  const div = document.createElement("div");
  div.style.maxWidth = "78%";
  div.style.padding = "10px 12px";
  div.style.borderRadius = "12px";
  div.style.whiteSpace = "pre-wrap";
  div.style.lineHeight = "1.35";

  if (sender === "user") {
    div.style.alignSelf = "flex-end";
    div.style.background = "#2563eb";
    div.style.color = "#fff";
  } else {
    div.style.alignSelf = "flex-start";
    div.style.background = "#171923";
    div.style.border = "1px solid #1f2430";
    div.style.color = "#e5e7eb";
  }

  div.textContent = text;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTyping() {
  const t = document.createElement("div");
  t.id = "typing";
  t.textContent = "NEO is typing…";
  t.style.opacity = "0.7";
  t.style.fontStyle = "italic";
  t.style.color = "#a1a1aa";
  chatMessages.appendChild(t);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTyping() {
  const t = document.getElementById("typing");
  if (t) t.remove();
}

/* --- Send message --- */
async function handleSend() {
  const text = userInput.value.trim();
  if (!text) return;

  addMessage(text, "user");
  userInput.value = "";

  showTyping();
  const reply = await neoChat(text);
  hideTyping();

  addMessage(reply, "ai");
}

sendBtn.addEventListener("click", handleSend);
userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleSend();
});
