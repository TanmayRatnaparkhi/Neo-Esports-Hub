import express from "express";
import fs from "fs";
import path from "path";
import sqlite3 from "sqlite3";
import { Groq } from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
GROQ_API_KEY="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"

// ---------------------- Groq Setup ----------------------
const client = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// ---------------------- Paths ----------------------
const __dirname = path.resolve();
const DATA_DIR = path.join(__dirname, "Data");
const CHAT_LOG_PATH = path.join(DATA_DIR, "ChatLog.json");
const DB_PATH = path.join(__dirname, "users.db");

// Ensure directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}

// ---------------------- SQLite DB Setup ----------------------
const db = new sqlite3.Database(DB_PATH);

db.run(`
  CREATE TABLE IF NOT EXISTS reported_issues (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL,
      issue TEXT NOT NULL,
      reply TEXT DEFAULT '',
      status TEXT DEFAULT 'Pending',
      date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

// ---------------------- Helpers ----------------------
function loadChatLog() {
  if (!fs.existsSync(CHAT_LOG_PATH)) {
    fs.writeFileSync(CHAT_LOG_PATH, JSON.stringify([]));
    return [];
  }

  try {
    return JSON.parse(fs.readFileSync(CHAT_LOG_PATH));
  } catch {
    return [];
  }
}

function saveChatLog(messages) {
  fs.writeFileSync(CHAT_LOG_PATH, JSON.stringify(messages, null, 4));
}

function cleanAnswer(text) {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l)
    .join("\n");
}

function timeInfo() {
  const now = new Date();
  return `Today is ${now.toLocaleDateString()} and time is ${now.toLocaleTimeString()}`;
}

// ---------------------- Report Issue Route ----------------------
router.post("/report_issue", (req, res) => {
  const { email, issue } = req.body;

  if (!email || !issue) {
    return res.json({ reply: "Please provide both email and issue details." });
  }

  db.run(
    `INSERT INTO reported_issues (email, issue, status) VALUES (?, ?, ?)`,
    [email, issue, "Pending"],
    (err) => {
      if (err) {
        return res.json({ reply: `Failed to save issue: ${err.message}` });
      }

      return res.json({
        reply:
          "Thank you! Your issue has been reported successfully. Our admin team will contact you soon."
      });
    }
  );
});

// ---------------------- Chatbot Conversation ----------------------
router.post("/chatbot", async (req, res) => {
  const userInput = req.body.message?.trim().toLowerCase();
  if (!userInput) return res.json({ reply: "Please enter a message." });

  // Quick replies
  const quickReplies = {
    "latest news": "Here are today's top headlines from NewsSphere! (coming soon)",
    "contact support": "Reach us at support@newssphere.com or +91-9876543210.",
    "about newssphere": "NewsSphere is your trusted AI-powered news platform.",
    help: "You can ask about news, contact info, or report an issue."
  };

  if (quickReplies[userInput]) {
    return res.json({ reply: quickReplies[userInput] });
  }

  // Issue detection
  if (
    userInput.includes("report issue") ||
    userInput.includes("bug") ||
    userInput.includes("problem")
  ) {
    return res.json({
      reply: "Sure! Please enter your email address so we can contact you."
    });
  }

  // ---- AI CHAT ----
  try {
    let messages = loadChatLog();
    messages.push({ role: "user", content: userInput });

    messages = messages.slice(-15); // keep latest 15

    const systemPrompt = `
You are NewsSphere Assistant, an AI chatbot for a news platform.
Help users, provide news info, and guide issue reporting.
Use this time info if needed: ${timeInfo()}.
    `;

    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      max_tokens: 500,
      temperature: 0.5
    });

    const aiReply = completion.choices[0].message.content.trim();

    messages.push({ role: "assistant", content: aiReply });
    saveChatLog(messages);

    return res.json({ reply: cleanAnswer(aiReply) });
  } catch (err) {
    console.log("Chatbot Error:", err);
    
    return res.json({ reply: `Error: ${err.message}` });
  }
});

// ---------------------- Reset Chat ----------------------
router.post("/chatbot/reset", (req, res) => {
  saveChatLog([]);
  return res.json({ reply: "Chat reset successfully." });
});

export default router;
