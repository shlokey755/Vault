/**
 * UIManager.js
 * Manages all DOM interactions: rendering the table, summary cards,
 * opening/closing modals, showing toasts, and handling form state.
 */

const SUB_CATEGORIES = {
  Income:  ['Salary', 'Allowances', 'Bonus', 'Petty Cash'],
  Expense: ['Rent', 'Food', 'Shopping', 'Entertainment'],
};

export class UIManager {
  constructor() {
    // Summary
    this.totalIncomeEl   = document.getElementById('totalIncome');
    this.totalExpensesEl = document.getElementById('totalExpenses');
    this.netBalanceEl    = document.getElementById('netBalance');

    // Table
    this.txTableBody = document.getElementById('txTableBody');
    this.emptyState  = document.getElementById('emptyState');
    this.txCount     = document.getElementById('txCount');

    // Form modal
    this.modalOverlay = document.getElementById('modalOverlay');
    this.modalTitle   = document.getElementById('modalTitle');
    this.txForm       = document.getElementById('txForm');
    this.editIdInput  = document.getElementById('editId');

    // Form fields
    this.amountInput      = document.getElementById('amount');
    this.dateInput        = document.getElementById('date');
    this.catIncomeInput   = document.getElementById('catIncome');
    this.catExpenseInput  = document.getElementById('catExpense');
    this.subCatInput      = document.getElementById('subCategory');
    this.descInput        = document.getElementById('description');
    this.charCount        = document.getElementById('charCount');
    this.submitBtn        = document.getElementById('submitBtn');

    // Error spans
    this.errors = {
      amount:      document.getElementById('amountError'),
      date:        document.getElementById('dateError'),
      category:    document.getElementById('categoryError'),
      subCategory: document.getElementById('subCategoryError'),
      description: document.getElementById('descriptionError'),
    };

    // Delete modal
    this.deleteOverlay  = document.getElementById('deleteOverlay');
    this._pendingDelete = null;

    // Toast
    this.toastEl = document.getElementById('toast');
    this._toastTimer = null;

    this._initDefaultDate();
    this._initCharCounter();
    this._initCategoryChange();
  }

  // ── Initialization helpers ───────────────────────────────────

  _initDefaultDate() {
    const today = new Date().toISOString().split('T')[0];
    this.dateInput.value = today;
    this.dateInput.max   = today;
  }

  _initCharCounter() {
    this.descInput.addEventListener('input', () => {
      const len = this.descInput.value.length;
      this.charCount.textContent = `${len} / 100`;
      this.charCount.style.color = len > 90 ? 'var(--red)' : 'var(--text-muted)';
    });
  }

  _initCategoryChange() {
    [this.catIncomeInput, this.catExpenseInput].forEach(radio => {
      radio.addEventListener('change', () => this._updateSubCategories(radio.value));
    });
  }

  _updateSubCategories(category) {
    const options = SUB_CATEGORIES[category] || [];
    this.subCatInput.innerHTML = '<option value="">— Select —</option>' +
      options.map(o => `<option value="${o}">${o}</option>`).join('');
  }

  // ── Summary ──────────────────────────────────────────────────

  /**
   * @param {{ totalIncome: number, totalExpenses: number, netBalance: number }} summary
   */
  renderSummary({ totalIncome, totalExpenses, netBalance }) {
    this.totalIncomeEl.textContent   = this._formatCurrency(totalIncome);
    this.totalExpensesEl.textContent = this._formatCurrency(totalExpenses);
    this.netBalanceEl.textContent    = this._formatCurrency(Math.abs(netBalance));

    // Color the balance card
    const balanceCard = this.netBalanceEl;
    balanceCard.classList.remove('positive', 'negative');
    if (netBalance > 0) balanceCard.classList.add('positive');
    if (netBalance < 0) balanceCard.classList.add('negative');
  }

  // ── Table ────────────────────────────────────────────────────

  /**
   * Render filtered/sorted transactions into the table.
   * @param {Transaction[]} transactions
   * @param {Function} onEdit   - (id) => void
   * @param {Function} onDelete - (id) => void
   */
  renderTable(transactions, onEdit, onDelete) {
    this.txTableBody.innerHTML = '';

    if (transactions.length === 0) {
      this.emptyState.classList.add('visible');
      this.txCount.textContent = '0 transactions';
      return;
    }

    this.emptyState.classList.remove('visible');
    this.txCount.textContent = `${transactions.length} transaction${transactions.length !== 1 ? 's' : ''}`;

    const fragment = document.createDocumentFragment();
    transactions.forEach(tx => {
      const tr = document.createElement('tr');
      tr.dataset.id = tx.id;

      const catClass = tx.category.toLowerCase();
      const sign     = tx.category === 'Income' ? '+' : '-';

      tr.innerHTML = `
        <td class="tx-date">${tx.formattedDate}</td>
        <td><span class="tx-category-badge ${catClass}">${tx.category}</span></td>
        <td class="tx-subcategory">${this._escapeHtml(tx.subCategory)}</td>
        <td class="tx-desc" title="${this._escapeHtml(tx.description)}">${this._escapeHtml(tx.description) || '<span style="color:var(--text-muted)">—</span>'}</td>
        <td class="tx-amount ${catClass}">${sign}${this._formatCurrency(tx.amount)}</td>
        <td class="tx-actions">
          <button class="btn-edit"   data-id="${tx.id}">Edit</button>
          <button class="btn-delete" data-id="${tx.id}">Delete</button>
        </td>
      `;

      tr.querySelector('.btn-edit').addEventListener('click',   () => onEdit(tx.id));
      tr.querySelector('.btn-delete').addEventListener('click', () => onDelete(tx.id));
      fragment.appendChild(tr);
    });

    this.txTableBody.appendChild(fragment);
  }

  // ── Add/Edit Modal ───────────────────────────────────────────

  openAddModal() {
    this.txForm.reset();
    this._initDefaultDate();
    this.editIdInput.value    = '';
    this.modalTitle.textContent = 'New Transaction';
    this.submitBtn.textContent  = 'Add Transaction';
    this.subCatInput.innerHTML  = '<option value="">— Select —</option>';
    this.charCount.textContent  = '0 / 100';
    this._clearErrors();
    this.modalOverlay.classList.add('open');
    this.amountInput.focus();
  }

  /**
   * Pre-fill the modal for editing.
   * @param {Transaction} tx
   */
  openEditModal(tx) {
    this.txForm.reset();
    this._clearErrors();

    this.editIdInput.value        = tx.id;
    this.modalTitle.textContent   = 'Edit Transaction';
    this.submitBtn.textContent    = 'Save Changes';
    this.amountInput.value        = tx.amount;
    this.dateInput.value          = tx.date;
    this.descInput.value          = tx.description;
    this.charCount.textContent    = `${tx.description.length} / 100`;

    // Set category radio
    if (tx.category === 'Income')  this.catIncomeInput.checked  = true;
    if (tx.category === 'Expense') this.catExpenseInput.checked = true;

    // Populate sub-categories then set value
    this._updateSubCategories(tx.category);
    this.subCatInput.value = tx.subCategory;

    this.modalOverlay.classList.add('open');
    this.amountInput.focus();
  }

  closeModal() {
    this.modalOverlay.classList.remove('open');
    this._clearErrors();
  }

  /** Get current form values */
  getFormData() {
    const category = document.querySelector('input[name="category"]:checked')?.value || '';
    return {
      amount:      this.amountInput.value,
      date:        this.dateInput.value,
      category,
      subCategory: this.subCatInput.value,
      description: this.descInput.value,
      id:          this.editIdInput.value || undefined,
    };
  }

  /** Display validation errors on form fields */
  showErrors(errors) {
    this._clearErrors();
    Object.entries(errors).forEach(([field, msg]) => {
      const errorEl = this.errors[field];
      if (errorEl) {
        errorEl.textContent = msg;
        // Highlight the associated input
        const input = this._getFieldElement(field);
        if (input) input.classList.add('invalid');
      }
    });
  }

  _clearErrors() {
    Object.values(this.errors).forEach(el => { if (el) el.textContent = ''; });
    document.querySelectorAll('.tx-form .invalid').forEach(el => el.classList.remove('invalid'));
  }

  _getFieldElement(field) {
    const map = {
      amount:      this.amountInput,
      date:        this.dateInput,
      subCategory: this.subCatInput,
      description: this.descInput,
    };
    return map[field] || null;
  }

  // ── Delete Confirm Modal ──────────────────────────────────────

  openDeleteModal(id, onConfirm) {
    this._pendingDelete = { id, onConfirm };
    this.deleteOverlay.classList.add('open');
  }

  closeDeleteModal() {
    this.deleteOverlay.classList.remove('open');
    this._pendingDelete = null;
  }

  confirmDelete() {
    if (this._pendingDelete) {
      this._pendingDelete.onConfirm(this._pendingDelete.id);
    }
    this.closeDeleteModal();
  }

  // ── Toast ─────────────────────────────────────────────────────

  /**
   * @param {string} message
   * @param {'success'|'error'|''} type
   */
  showToast(message, type = '') {
    if (this._toastTimer) clearTimeout(this._toastTimer);
    this.toastEl.textContent = message;
    this.toastEl.className   = `toast ${type}`;
    // Force reflow so animation retriggers
    void this.toastEl.offsetWidth;
    this.toastEl.classList.add('show');
    this._toastTimer = setTimeout(() => {
      this.toastEl.classList.remove('show');
    }, 3000);
  }

  // ── Utilities ─────────────────────────────────────────────────

  _formatCurrency(value) {
    return Number(value).toLocaleString('en-IN', {
      style:    'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    });
  }

  _escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
}
