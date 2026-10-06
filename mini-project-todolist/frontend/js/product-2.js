/* ============================================================
   product-2.js — Halaman Detail Product 2 (dari RESPONSE API)
   Seluruh konten (nama, deskripsi, durasi, checklist) diisi
   otomatis dari hasil fetch ke backend Express + MySQL.
   ============================================================ */

const CONFIG = window.APP_CONFIG;

// ------------------------------------------------------------
// STATE (diisi setelah data API datang)
// ------------------------------------------------------------
const state = {
  task: null,               // objek task dari API
  selectedStep: null,       // string | null
  quantity: 1,              // jumlah sesi, range [1, 5]
  confirmationShown: false,
};

// ------------------------------------------------------------
// UTILITAS
// ------------------------------------------------------------
function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0 && mins > 0) return `${hours} jam ${mins} menit`;
  if (hours > 0) return `${hours} jam`;
  return `${mins} menit`;
}

function calculateTotal(quantity) {
  if (!state.task) return 0;
  return state.task.duration * quantity;
}

function show(el) { el.removeAttribute("hidden"); }
function hide(el) { el.setAttribute("hidden", ""); }

// ------------------------------------------------------------
// AMBIL DATA DARI API
// ------------------------------------------------------------
async function loadTask() {
  const loading = document.getElementById("loading");
  const error = document.getElementById("error");
  const content = document.getElementById("content");

  show(loading);
  hide(error);
  hide(content);

  try {
    const res = await fetch(`${CONFIG.apiBase}/tasks/${CONFIG.taskCode}`);
    if (!res.ok) {
      throw new Error(`API merespons dengan status ${res.status}`);
    }
    const json = await res.json();
    if (!json.success || !json.data) {
      throw new Error(json.message || "Format response API tidak sesuai");
    }

    state.task = json.data;
    state.selectedStep = null;
    state.quantity = 1;
    state.confirmationShown = false;

    renderContentFromApi();
    render();

    hide(loading);
    show(content);
  } catch (err) {
    document.getElementById("error-message").textContent =
      `Gagal memuat data dari API: ${err.message}. Pastikan backend berjalan.`;
    hide(loading);
    show(error);
  }
}

// ------------------------------------------------------------
// ISI KONTEN DARI RESPONSE API
// ------------------------------------------------------------
function renderContentFromApi() {
  const t = state.task;

  const img = document.getElementById("product-image");
  img.src = t.image_url || "";
  img.alt = `Ilustrasi task ${t.title}`;

  document.getElementById("product-code").textContent = t.code;
  document.getElementById("product-name").textContent = t.title;
  document.getElementById("product-subtitle").textContent = t.subtitle || "";
  document.getElementById("product-price").textContent = `${t.duration} menit`;

  document.getElementById("product-description").textContent = t.description;

  const meta = document.getElementById("product-meta");
  meta.innerHTML = "";
  const priorityBadge = document.createElement("span");
  priorityBadge.className = `badge badge--priority-${t.priority}`;
  priorityBadge.textContent = `Prioritas: ${t.priority}`;
  meta.appendChild(priorityBadge);

  (t.tags || []).forEach((tag) => {
    const badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent = tag;
    meta.appendChild(badge);
  });

  const list = document.getElementById("checklist");
  list.innerHTML = "";
  (t.checklists || []).forEach((item) => {
    const li = document.createElement("li");
    li.className = "checklist__item";
    li.dataset.step = String(item.id);
    li.setAttribute("role", "button");
    li.setAttribute("tabindex", "0");
    li.setAttribute("aria-pressed", "false");

    const mark = document.createElement("span");
    mark.className = "checklist__mark";
    mark.innerHTML = "&#10003;";
    li.appendChild(mark);
    li.appendChild(document.createTextNode(item.label));

    li.addEventListener("click", () => selectStep(li.dataset.step));
    li.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        selectStep(li.dataset.step);
      }
    });

    list.appendChild(li);
  });
}

// ------------------------------------------------------------
// MUTASI STATE
// ------------------------------------------------------------
function selectStep(stepValue) {
  state.selectedStep = stepValue;
  state.confirmationShown = false;
  render();
}

function changeQuantity(delta) {
  const next = state.quantity + delta;
  if (next >= 1 && next <= 5) {
    state.quantity = next;
    state.confirmationShown = false;
    render();
  }
}

function confirmSelection() {
  if (state.selectedStep === null) return;
  state.confirmationShown = true;
  render();
}

// ------------------------------------------------------------
// RENDER
// ------------------------------------------------------------
function updateChecklist() {
  document.querySelectorAll(".checklist__item").forEach((item) => {
    const isActive = item.dataset.step === state.selectedStep;
    item.classList.toggle("is-done", isActive);
    item.setAttribute("aria-pressed", isActive ? "true" : "false");
  });
}

function updateQuantityControls() {
  document.getElementById("quantity-display").textContent = state.quantity;
  document.getElementById("btn-decrease").disabled = state.quantity <= 1;
  document.getElementById("btn-increase").disabled = state.quantity >= 5;
}

function updateSummary() {
  const summaryStep = document.getElementById("summary-size");
  const summaryQty = document.getElementById("summary-qty");
  const summaryTotal = document.getElementById("summary-total");

  if (!state.task || state.selectedStep === null) {
    summaryStep.textContent = "Pilih langkah terlebih dahulu";
  } else {
    const step = (state.task.checklists || []).find(
      (s) => String(s.id) === state.selectedStep
    );
    summaryStep.textContent = step ? step.label : state.selectedStep;
  }

  summaryQty.textContent = state.quantity;
  summaryTotal.textContent = state.task ? formatDuration(calculateTotal(state.quantity)) : "—";
}

function updateConfirmButton() {
  document.getElementById("btn-confirm").disabled = state.selectedStep === null;
}

function updateConfirmationMessage() {
  const el = document.getElementById("confirmation-message");
  if (state.confirmationShown && state.selectedStep !== null && state.task) {
    const step = (state.task.checklists || []).find(
      (s) => String(s.id) === state.selectedStep
    );
    const total = formatDuration(calculateTotal(state.quantity));
    el.textContent = `Dikonfirmasi: ${state.task.title}, langkah "${step.label}", ${state.quantity} sesi. Total ${total}.`;
    el.removeAttribute("hidden");
  } else {
    el.setAttribute("hidden", "");
  }
}

function render() {
  updateChecklist();
  updateQuantityControls();
  updateSummary();
  updateConfirmButton();
  updateConfirmationMessage();
}

// ------------------------------------------------------------
// INIT
// ------------------------------------------------------------
document.getElementById("btn-decrease").addEventListener("click", () => changeQuantity(-1));
document.getElementById("btn-increase").addEventListener("click", () => changeQuantity(1));
document.getElementById("btn-confirm").addEventListener("click", confirmSelection);
document.getElementById("btn-retry").addEventListener("click", loadTask);

loadTask();
