/* ============================================================
   auth.js — Logika halaman Login & Register
   File : frontend/js/auth.js
   Menangani submit form, panggil API, simpan token, redirect.
   ============================================================ */

const AUTH_API = (window.APP_CONFIG?.apiBase || "/api") + "/auth";

// ------------------------------------------------------------
// Helper
// ------------------------------------------------------------
// saveSession() dan konstanta TOKEN_KEY/USER_KEY berada di session.js
// agar hanya ada satu sumber kebenaran (single source of truth).
function showMessage(text, type) {
  const el = document.getElementById("auth-message");
  el.textContent = text;
  el.className = `auth-message auth-message--${type}`;
  el.removeAttribute("hidden");
}

function hideMessage() {
  document.getElementById("auth-message").setAttribute("hidden", "");
}

function setLoading(btn, isLoading) {
  btn.disabled = isLoading;
  btn.dataset.label = btn.dataset.label || btn.textContent;
  btn.textContent = isLoading ? "Memproses..." : btn.dataset.label;
}

// ------------------------------------------------------------
// Register
// ------------------------------------------------------------
async function handleRegister(e) {
  e.preventDefault();
  hideMessage();

  const name = document.getElementById("reg-name").value.trim();
  const email = document.getElementById("reg-email").value.trim();
  const password = document.getElementById("reg-password").value;
  const btn = document.getElementById("btn-register");

  if (password.length < 6) {
    showMessage("Password minimal 6 karakter.", "error");
    return;
  }

  setLoading(btn, true);
  try {
    const res = await fetch(`${AUTH_API}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const json = await res.json();

    if (!res.ok || !json.success) {
      throw new Error(json.message || "Registrasi gagal.");
    }

    saveSession(json.token, json.data);
    showMessage("Registrasi berhasil! Mengalihkan...", "success");
    setTimeout(() => (window.location.href = "dashboard.html"), 800);
  } catch (err) {
    showMessage(err.message, "error");
  } finally {
    setLoading(btn, false);
  }
}

// ------------------------------------------------------------
// Login
// ------------------------------------------------------------
async function handleLogin(e) {
  e.preventDefault();
  hideMessage();

  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;
  const btn = document.getElementById("btn-login");

  setLoading(btn, true);
  try {
    const res = await fetch(`${AUTH_API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const json = await res.json();

    if (!res.ok || !json.success) {
      throw new Error(json.message || "Login gagal.");
    }

    saveSession(json.token, json.data);
    showMessage("Login berhasil! Mengalihkan...", "success");
    setTimeout(() => (window.location.href = "dashboard.html"), 800);
  } catch (err) {
    showMessage(err.message, "error");
  } finally {
    setLoading(btn, false);
  }
}

// ------------------------------------------------------------
// Init
// ------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");

  if (loginForm) loginForm.addEventListener("submit", handleLogin);
  if (registerForm) registerForm.addEventListener("submit", handleRegister);

  // Toggle tampil/sembunyi password
  document.querySelectorAll("[data-toggle-password]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const input = document.getElementById(btn.dataset.togglePassword);
      if (!input) return;
      const isHidden = input.type === "password";
      input.type = isHidden ? "text" : "password";
      btn.textContent = isHidden ? "Sembunyikan" : "Lihat";
    });
  });
});
