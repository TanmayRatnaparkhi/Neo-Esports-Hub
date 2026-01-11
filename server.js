import express from "express";
import chatbotRouter from "./chatbot.js";

const app = express();
app.use(express.json());

app.use("/api", chatbotRouter);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));