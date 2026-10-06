// ============================================================
// routes/tasks.js — Endpoint API untuk resource "tasks"
// File : backend/src/routes/tasks.js
// ============================================================

const express = require("express");
const { pool } = require("../db");

const router = express.Router();

// ------------------------------------------------------------
// Helper: ambil semua checklist milik satu task.
// ------------------------------------------------------------
async function getChecklists(taskId) {
  const [rows] = await pool.query(
    "SELECT id, label, is_done, sort_order FROM checklists WHERE task_id = ? ORDER BY sort_order ASC",
    [taskId]
  );
  return rows;
}

// ------------------------------------------------------------
// GET /api/tasks
// Mengembalikan seluruh task yang sudah dipublikasikan.
// ------------------------------------------------------------
router.get("/", async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, code, title, subtitle, description, priority, status,
              duration, tags, image_url, created_at, updated_at
       FROM tasks
       WHERE is_published = 1
       ORDER BY id ASC`
    );
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    next(err);
  }
});

// ------------------------------------------------------------
// GET /api/tasks/:code
// Mengembalikan satu task berdasarkan `code` (slug) beserta checklist-nya.
// Inilah endpoint yang dipakai Product Detail 2 (dari response API).
// ------------------------------------------------------------
router.get("/:code", async (req, res, next) => {
  try {
    const { code } = req.params;
    const [rows] = await pool.query(
      `SELECT id, code, title, subtitle, description, priority, status,
              duration, tags, image_url, created_at, updated_at
       FROM tasks
       WHERE code = ? AND is_published = 1
       LIMIT 1`,
      [code]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Task tidak ditemukan" });
    }

    const task = rows[0];
    task.checklists = await getChecklists(task.id);

    res.json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
