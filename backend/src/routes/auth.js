// ============================================================
// routes/auth.js — Register, Login, dan profil user
// File : backend/src/routes/auth.js
// ============================================================

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { pool } = require("../db");
const { requireAuth, JWT_SECRET } = require("../middleware/auth");

const router = express.Router();
const SALT_ROUNDS = 10;
const TOKEN_EXPIRES = "2h";

// ------------------------------------------------------------
// Validasi sederhana
// ------------------------------------------------------------
function validateRegister({ name, email, password }) {
  if (!name || name.trim().length < 2) return "Nama minimal 2 karakter.";
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Format email tidak valid.";
  if (!password || password.length < 6) return "Password minimal 6 karakter.";
  return null;
}

function signToken(user) {
  return jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, {
    expiresIn: TOKEN_EXPIRES,
  });
}

// ------------------------------------------------------------
// POST /api/auth/register
// ------------------------------------------------------------
router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body || {};

    const error = validateRegister({ name, email, password });
    if (error) {
      return res.status(400).json({ success: false, message: error });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const [existing] = await pool.query("SELECT id FROM users WHERE email = ? LIMIT 1", [normalizedEmail]);
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: "Email sudah terdaftar. Silakan login." });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const [result] = await pool.query(
      "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
      [name.trim(), normalizedEmail, passwordHash]
    );

    const user = { id: result.insertId, name: name.trim(), email: normalizedEmail };
    const token = signToken(user);

    res.status(201).json({ success: true, message: "Registrasi berhasil.", token, data: user });
  } catch (err) {
    next(err);
  }
});

// ------------------------------------------------------------
// POST /api/auth/login
// ------------------------------------------------------------
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email dan password wajib diisi." });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const [rows] = await pool.query(
      "SELECT id, name, email, password_hash FROM users WHERE email = ? LIMIT 1",
      [normalizedEmail]
    );

    // Pesan dibuat sama untuk email/password salah (hindari kebocoran info akun).
    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: "Email atau password salah." });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ success: false, message: "Email atau password salah." });
    }

    const token = signToken(user);
    res.json({
      success: true,
      message: "Login berhasil.",
      token,
      data: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    next(err);
  }
});

// ------------------------------------------------------------
// GET /api/auth/me — buktikan token valid (route terproteksi)
// ------------------------------------------------------------
router.get("/me", requireAuth, async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, email, created_at FROM users WHERE id = ? LIMIT 1",
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "User tidak ditemukan." });
    }

    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
