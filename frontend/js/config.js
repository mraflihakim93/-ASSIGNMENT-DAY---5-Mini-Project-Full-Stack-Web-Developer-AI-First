/* ============================================================
   config.js — Konfigurasi frontend
   Ubah API_BASE jika backend berjalan di host/port berbeda.
   ============================================================ */

window.APP_CONFIG = Object.freeze({
  // Karena frontend disajikan oleh server Express yang sama,
  // gunakan path relatif. Ini otomatis benar untuk localhost maupun hosting.
  apiBase: "/api",

  // Code task yang ditampilkan di Product Detail 2 (diambil dari API).
  taskCode: "styling-css-responsive",
});
