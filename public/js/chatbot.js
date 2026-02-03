import { systemPrompt } from "./customPrompts.js";

// ✅ Use Firebase API key directly
const API_KEY = "AIzaSyB8Xl3RQMHUhsiJS4Kk2y64Rsnwoh3jVkI";

export async function neoChat(userMessage) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

  const body = {
    contents: [
      {
        parts: [
          { text: `${systemPrompt}\nUser: ${userMessage}\nAI:` }
        ]
      }
    ]
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    console.log("AI Response:", data);

    if (data.candidates && data.candidates.length > 0) {
      return data.candidates[0].content.parts[0].text;
    }

    return "No reply from AI 🥲";
  } catch (err) {
    console.error("AI Error:", err);
    return "Something went wrong communicating with AI 😭";
  }
}
