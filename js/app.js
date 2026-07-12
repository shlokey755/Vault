/**
 * app.js — Entry Point
 * Initialises all modules and wires up the event flow.
 *
 * Architecture:
 *   app.js  (orchestrator)
 *     ├── TransactionManager  (business logic + persistence)
 *     ├── UIManager           (DOM rendering + modals)
 *     ├── ChartManager        (Chart.js charts)
 *     ├── FilterManager       (filter/sort controls)
 *     ├── FormValidator       (validation)
 *     └── ExportManager       (CSV export)
 */

// service-worker-registration.js
// Add this code to your app.js OR as a separate script in your HTML

// ═══ Service Worker Registration ═══
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/Vault/sw.js')
      .then((registration) => {
        console.log('✓ Service Worker registered successfully!', registration);

        // Optional: Listen for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'activated') {
              console.log('✓ New Service Worker activated!');
              // Optional: Show a "refresh" prompt to the user
              // location.reload();
            }
          });
        });
      })
      .catch((error) => {
        console.warn('✗ Service Worker registration failed:', error);
      });
  });
} else {
  console.warn('Service Workers are not supported in this browser.');
}

// ═══ Optional: Detect Installation ═══
window.addEventListener('beforeinstallprompt', (event) => {
  console.log('✓ Install prompt is available!');
  // You could customize the install prompt here if desired
  // event.preventDefault(); // Prevent automatic prompt
});

window.addEventListener('appinstalled', () => {
  console.log('✓ App was installed!');
});

import { TransactionManager } from './TransactionManager.js';
import { UIManager } from './UIManager.js';
import { ChartManager } from './ChartManager.js';
import { FilterManager } from './FilterManager.js';
import { FormValidator } from './FormValidator.js';
import { ExportManager } from './ExportManager.js';

// ── Bootstrap ──────────────────────────────────────────────────

const txManager = new TransactionManager();
const uiManager = new UIManager();
const chartManager = new ChartManager();

// ── Render helper — called on every state change ──────────────

function refreshUI() {
  try {
    const filters = filterManager.getFilters();
    const visible = txManager.filter(filters);
    const summary = txManager.getSummary();
    const expBySubCat = txManager.getExpenseBySubCategory();

    uiManager.renderSummary(summary);
    uiManager.renderTable(visible, handleEdit, handleDelete);
    chartManager.update(summary, expBySubCat);
  } catch (err) {
    console.error('refreshUI error:', err);
    uiManager.showToast('An error occurred while refreshing.', 'error');
  }
}

// ── Filter Manager (needs refreshUI, so defined after) ────────

const filterManager = new FilterManager(refreshUI);

// ── Event Handlers ────────────────────────────────────────────

/** Open "Add" form */
document.getElementById('openFormBtn').addEventListener('click', () => {
  uiManager.openAddModal();
});

/** Close form modal */
document.getElementById('closeFormBtn').addEventListener('click', () => {
  uiManager.closeModal();
});
document.getElementById('cancelFormBtn').addEventListener('click', () => {
  uiManager.closeModal();
});

/** Close modal on backdrop click */
document.getElementById('modalOverlay').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) uiManager.closeModal();
});

/** Form submit — Add or Edit */
document.getElementById('txForm').addEventListener('submit', (e) => {
  e.preventDefault();
  try {
    const data = uiManager.getFormData();
    const { valid, errors } = FormValidator.validate(data);

    if (!valid) {
      uiManager.showErrors(errors);
      return;
    }

    const isEdit = Boolean(data.id);

    if (isEdit) {
      txManager.update(data.id, data);
      uiManager.showToast('Transaction updated successfully.', 'success');
    } else {
      txManager.add(data);
      uiManager.showToast('Transaction added successfully.', 'success');
    }

    uiManager.closeModal();
    refreshUI();
  } catch (err) {
    console.error('Form submit error:', err);
    uiManager.showToast('Something went wrong. Please try again.', 'error');
  }
});

/** Edit — pre-fill form */
function handleEdit(id) {
  try {
    const tx = txManager.getById(id);
    if (!tx) throw new Error(`Transaction ${id} not found`);
    uiManager.openEditModal(tx);
  } catch (err) {
    console.error('handleEdit error:', err);
    uiManager.showToast('Could not open edit form.', 'error');
  }
}

/** Delete — show confirm modal */
function handleDelete(id) {
  uiManager.openDeleteModal(id, (confirmedId) => {
    try {
      txManager.delete(confirmedId);
      uiManager.showToast('Transaction deleted.', 'success');
      refreshUI();
    } catch (err) {
      console.error('handleDelete error:', err);
      uiManager.showToast('Could not delete transaction.', 'error');
    }
  });
}

/** Delete confirm modal buttons */
document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
  uiManager.confirmDelete();
});
document.getElementById('cancelDeleteBtn').addEventListener('click', () => {
  uiManager.closeDeleteModal();
});
document.getElementById('deleteOverlay').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) uiManager.closeDeleteModal();
});

/** Export CSV */
document.getElementById('exportCsvBtn').addEventListener('click', () => {
  const all = txManager.getAll();
  const ok = ExportManager.exportCSV(all);
  if (!ok) {
    uiManager.showToast('No transactions to export.', 'error');
  } else {
    uiManager.showToast('CSV exported successfully!', 'success');
  }
});

/** Close modals on Escape key */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    uiManager.closeModal();
    uiManager.closeDeleteModal();
  }
});

// ── Initial render ────────────────────────────────────────────
refreshUI();
