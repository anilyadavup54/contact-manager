import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import contactsRouter from "../routes/contacts.routes.js";
import { readFile } from "fs/promises";
import { seedContacts } from "../controllers/contacts.controller.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

// Serve static frontend (if present) — use fileURLToPath for Windows compatibility
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, "..", "frontend/index.html")));

app.get("/", (req, res) => {
  res.send("Contacts Manager API");
});

// Simple health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Contacts API
app.use("/api/contacts", contactsRouter);

// Global error fallback (optional)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    error: "Unexpected server error",
  });
});

const PORT =4000;

async function start() {
  try {
    const dataPath = new URL("../data/contacts.json", import.meta.url).pathname;
    const raw = await readFile(dataPath, "utf8");
    const arr = JSON.parse(raw);
    if (Array.isArray(arr)) seedContacts(arr);
  } catch (e) {
    // no seed file or parse error — continue without seed
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start();
