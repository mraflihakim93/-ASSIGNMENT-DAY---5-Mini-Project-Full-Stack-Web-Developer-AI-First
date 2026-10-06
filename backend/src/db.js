// ============================================================
// db.js — Koneksi MySQL menggunakan mysql2/promise (connection pool)
// File : backend/src/db.js
// ============================================================

const mysql = require("mysql2/promise");

// Pool lebih baik daripada koneksi tunggal: menangani banyak request
// dan otomatis mengembalikan koneksi ke pool setelah selesai.
const pool = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "todo_list",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // Ubah hasil JSON MySQL agar otomatis di-parse menjadi objek.
  // Kolom `tags` bertipe JSON akan langsung menjadi array di JS.
  typeCast(field, next) {
    if (field.type === "JSON") {
      const value = field.string("utf8");
      return value === null ? null : JSON.parse(value);
    }
    return next();
  },
});

// Cek koneksi sekali saat startup agar error terlihat jelas.
async function testConnection() {
  const conn = await pool.getConnection();
  try {
    await conn.query("SELECT 1");
  } finally {
    conn.release();
  }
}

module.exports = { pool, testConnection };
