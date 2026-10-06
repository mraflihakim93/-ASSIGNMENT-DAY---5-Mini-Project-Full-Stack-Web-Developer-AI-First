// ============================================================
// server.js — Entry point backend Express
// File : backend/src/server.js
// Menyediakan REST API untuk Hello World To-Do List dan
// (opsional) menyajikan folder frontend sebagai static files.
// ============================================================

require("dotenv").config();

const path = require("path");
const express = require("express");
const cors = require("cors");

const { testConnection } = require("./db");
const tasksRouter = require("./routes/tasks");
const authRouter = require("./routes/auth");

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// ------------------------------------------------------------
// Middleware global
// ------------------------------------------------------------
// Frontend disajikan oleh server Express yang sama (same-origin),
// jadi CORS cukup dibatasi ke localhost untuk kebutuhan pengembangan.
app.use(
  cors({
    origin: [/^http:\/\/localhost:\d+$/, /^http:\/\/127\.0\.0\.1:\d+$/],
  })
);
app.use(express.json());  // parsing body JSON

// ------------------------------------------------------------
// Health check — berguna untuk memastikan server & DB hidup
// ------------------------------------------------------------
app.get("/api/health", async (req, res) => {
  try {
    await testConnection();
    res.json({ success: true, message: "API & database OK" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Database tidak dapat diakses", error: err.message });
  }
});

// ------------------------------------------------------------
// Routes
// ------------------------------------------------------------
app.use("/api/tasks", tasksRouter);
app.use("/api/auth", authRouter);

// Sajikan frontend sebagai static agar Product 2 bisa fetch
// API tanpa masalah CORS saat dibuka via http://localhost:3000
app.use(express.static(path.join(__dirname, "..", "..", "frontend")));

// ------------------------------------------------------------
// 404 handler (untuk route API yang tidak dikenal)
// ------------------------------------------------------------
app.use("/api", (req, res) => {
  res.status(404).json({ success: false, message: "Endpoint tidak ditemukan" });
});

// ------------------------------------------------------------
// Error handler terpusat
// ------------------------------------------------------------
app.use((err, req, res, next) => {
  console.error("[ERROR]", err.message);
  res.status(500).json({ success: false, message: "Terjadi kesalahan pada server", error: err.message });
});

// ------------------------------------------------------------
// Start server + cek koneksi database
// ------------------------------------------------------------
async function start() {
  try {
    await testConnection();
    console.log("[DB] Koneksi MySQL berhasil.");
  } catch (err) {
    console.error("[DB] GAGAL koneksi MySQL:", err.message);
    console.error("     Periksa file .env dan pastikan MySQL berjalan.");
  }

  app.listen(PORT, () => {
    console.log(`[SERVER] Berjalan di http://localhost:${PORT}`);
    console.log(`[SERVER] Coba: http://localhost:${PORT}/api/tasks`);
  });
}

start();
