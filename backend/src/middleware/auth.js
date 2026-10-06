// ============================================================
// middleware/auth.js — Verifikasi JWT
// File : backend/src/middleware/auth.js
// ============================================================

const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-ganti-di-produksi";

/**
 * Middleware: hanya lanjut jika request membawa Bearer token yang valid.
 * Hasil decode disimpan di req.user.
 */
function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ success: false, message: "Token tidak ditemukan. Silakan login." });
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Token tidak valid atau sudah kadaluarsa." });
  }
}

module.exports = { requireAuth, JWT_SECRET };
