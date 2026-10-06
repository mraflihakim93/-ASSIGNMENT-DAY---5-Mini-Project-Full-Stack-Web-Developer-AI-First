/* ============================================================
   product-1.js — Halaman Detail Product 1 (HARDCODE)
   Semua data task ditulis langsung di file ini (tanpa API).
   Pola: UI State Machine sederhana (state + fungsi render()).
   ============================================================ */

// ------------------------------------------------------------
// 1. DATA (HARDCODE)
// ------------------------------------------------------------
const TASK = {
  code: "belajar-html-dasar",
  title: "Belajar HTML Dasar",
  subtitle: "Membangun Struktur Halaman",
  durationPerStep: 15, // menit per langkah (pengganti "harga")
  steps: [
    { value: "struktur", label: "Pahami struktur dasar dokumen HTML5" },
    { value: "heading", label: "Latihan membuat heading dan paragraf" },
    { value: "semantic", label: "Gunakan elemen semantik header/main/footer" },
  ],
};

// ------------------------------------------------------------
// 2. STATE
// ------------------------------------------------------------
const state = {
  selectedStep: null,       // string | null
  quantity: 1,              // jumlah sesi, range [1, 5]
  confirmationShown: false, // apakah pesan konfirmasi tampil
};

// ------------------------------------------------------------
// 3. UTILITAS
// ------------------------------------------------------------
function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0 && mins > 0) return `${hours} jam ${mins} menit`;
  if (hours > 0) return `${hours} jam`;
  return `${mins} menit`;
}

function calculateTotal(quantity) {
  return TASK.durationPerStep * quantity;
}

// ------------------------------------------------------------
// 4. MUTASI STATE
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
// 5. RENDER
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

  if (state.selectedStep === null) {
    summaryStep.textContent = "Pilih langkah terlebih dahulu";
  } else {
    const step = TASK.steps.find((s) => s.value === state.selectedStep);
    summaryStep.textContent = step ? step.label : state.selectedStep;
  }

  summaryQty.textContent = state.quantity;
  summaryTotal.textContent = formatDuration(calculateTotal(state.quantity));
}

function updateConfirmButton() {
  document.getElementById("btn-confirm").disabled = state.selectedStep === null;
}

function updateConfirmationMessage() {
  const el = document.getElementById("confirmation-message");
  if (state.confirmationShown && state.selectedStep !== null) {
    const step = TASK.steps.find((s) => s.value === state.selectedStep);
    const total = formatDuration(calculateTotal(state.quantity));
    el.textContent = `Dikonfirmasi: ${TASK.title}, langkah "${step.label}", ${state.quantity} sesi. Total ${total}.`;
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
// 6. EVENT LISTENERS & INIT
// ------------------------------------------------------------
document.querySelectorAll(".checklist__item").forEach((item) => {
  item.addEventListener("click", () => selectStep(item.dataset.step));
  item.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      selectStep(item.dataset.step);
    }
  });
});

document.getElementById("btn-decrease").addEventListener("click", () => changeQuantity(-1));
document.getElementById("btn-increase").addEventListener("click", () => changeQuantity(1));
document.getElementById("btn-confirm").addEventListener("click", confirmSelection);

render();
