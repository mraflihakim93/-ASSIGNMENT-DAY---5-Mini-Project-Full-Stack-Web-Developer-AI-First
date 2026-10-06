/* ============================================================
   dashboard.js — Halaman terproteksi setelah login
   File : frontend/js/dashboard.js
   Membaca sesi, memvalidasi token ke server, menampilkan profil.
   ============================================================ */

async function initDashboard() {
  const loading = document.getElementById("dash-loading");
  const error = document.getElementById("dash-error");
  const content = document.getElementById("dash-content");

  // 1. Cek token di browser. Jika tidak ada -> redirect ke login.
  const token = requireLogin();
  if (!token) return;

  // 2. Tombol logout.
  document.getElementById("btn-logout").addEventListener("click", logout);

  // 3. Ambil data user dari server (tokoh bukti valid).
  try {
    const me = await fetchMe();
    if (!me) return; // fetchMe sudah redirect bila token tidak valid.

    document.getElementById("dash-name").textContent = me.name;
    document.getElementById("dash-profile-name").textContent = me.name;
    document.getElementById("dash-profile-email").textContent = me.email;
    document.getElementById("dash-profile-since").textContent = new Date(
      me.created_at
    ).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    document.getElementById("dash-verified").textContent = "Terverifikasi ✓";

    loading.setAttribute("hidden", "");
    content.removeAttribute("hidden");
  } catch (err) {
    document.getElementById("dash-error-message").textContent =
      "Gagal memuat profil: " + err.message;
    loading.setAttribute("hidden", "");
    error.removeAttribute("hidden");
  }
}

document.addEventListener("DOMContentLoaded", initDashboard);
