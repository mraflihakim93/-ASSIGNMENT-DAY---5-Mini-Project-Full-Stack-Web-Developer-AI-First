/* ============================================================
   session.js — Sesi login (localStorage) + proteksi halaman
   File : frontend/js/session.js
   ============================================================ */

const TOKEN_KEY = "todo_token";
const USER_KEY = "todo_user";

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function getUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || "null");
  } catch {
    return null;
  }
}

function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

function saveSession(token, user) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function logout() {
  clearSession();
  window.location.href = "login.html";
}

/**
 * Proteksi halaman: jika tidak ada token, tendang ke login.
 * Mengembalikan token bila ada.
 */
function requireLogin() {
  const token = getToken();
  if (!token) {
    window.location.href = "login.html";
    return null;
  }
  return token;
}

/**
 * Panggil endpoint terproteksi GET /api/auth/me untuk memastikan
 * token masih valid di sisi server (bukan hanya ada di browser).
 */
async function fetchMe() {
  const token = getToken();
  const apiBase = (window.APP_CONFIG?.apiBase || "/api");
  const res = await fetch(`${apiBase}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 401) {
    clearSession();
    window.location.href = "login.html";
    return null;
  }
  const json = await res.json();
  return json.data || null;
}
