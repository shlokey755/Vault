/**
 * TransactionManager.js
 * Central business-logic layer. Owns the in-memory array,
 * performs CRUD, and delegates persistence to StorageManager.
 */
import { Transaction }   from './Transaction.js';
import { StorageManager } from './StorageManager.js';

export class TransactionManager {
  constructor() {
    /** @type {Transaction[]} */
    this._transactions = [];
    this._load();
  }

  // ── Private helpers ──────────────────────────────────────────

  _load() {
    const raw = StorageManager.load();
    this._transactions = raw.map(obj => Transaction.fromJSON(obj));
  }

  _persist() {
    StorageManager.save(this._transactions);
  }

  // ── CRUD ─────────────────────────────────────────────────────

  /**
   * Add a new transaction.
   * @param {Object} data - Raw form data
   * @returns {Transaction} the created transaction
   */
  add(data) {
    try {
      const tx = new Transaction(data);
      this._transactions.push(tx);
      this._persist();
      return tx;
    } catch (err) {
      throw new Error(`Failed to add transaction: ${err.message}`);
    }
  }

  /**
   * Update an existing transaction by ID.
   * @param {string} id
   * @param {Object} data - Updated fields
   * @returns {Transaction|null}
   */
  update(id, data) {
    try {
      const index = this._transactions.findIndex(tx => tx.id === id);
      if (index === -1) throw new Error(`Transaction "${id}" not found.`);
      // Re-create with same ID to preserve createdAt
      const updated = new Transaction({ ...data, id });
      updated.createdAt = this._transactions[index].createdAt;
      this._transactions[index] = updated;
      this._persist();
      return updated;
    } catch (err) {
      throw new Error(`Failed to update transaction: ${err.message}`);
    }
  }

  /**
   * Delete a transaction by ID.
   * @param {string} id
   * @returns {boolean}
   */
  delete(id) {
    try {
      const before = this._transactions.length;
      this._transactions = this._transactions.filter(tx => tx.id !== id);
      if (this._transactions.length === before) throw new Error(`Transaction "${id}" not found.`);
      this._persist();
      return true;
    } catch (err) {
      throw new Error(`Failed to delete transaction: ${err.message}`);
    }
  }

  /**
   * Retrieve a single transaction by ID.
   * @param {string} id
   * @returns {Transaction|undefined}
   */
  getById(id) {
    return this._transactions.find(tx => tx.id === id);
  }

  /**
   * Return all transactions (shallow copy).
   * @returns {Transaction[]}
   */
  getAll() {
    return [...this._transactions];
  }

  // ── Filter & Sort ────────────────────────────────────────────

  /**
   * Filter and sort the transaction list.
   * @param {Object} filters
   * @param {string} filters.category     - 'all' | 'Income' | 'Expense'
   * @param {string} filters.subCategory  - 'all' | specific
   * @param {string} filters.dateFrom     - YYYY-MM-DD or ''
   * @param {string} filters.dateTo       - YYYY-MM-DD or ''
   * @param {string} filters.sortBy       - 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'
   * @returns {Transaction[]}
   */
  filter({ category = 'all', subCategory = 'all', dateFrom = '', dateTo = '', sortBy = 'date-desc' } = {}) {
    let result = [...this._transactions];

    if (category !== 'all')
      result = result.filter(tx => tx.category === category);

    if (subCategory !== 'all')
      result = result.filter(tx => tx.subCategory === subCategory);

    if (dateFrom)
      result = result.filter(tx => tx.date >= dateFrom);

    if (dateTo)
      result = result.filter(tx => tx.date <= dateTo);

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'date-asc':    return a.date.localeCompare(b.date);
        case 'date-desc':   return b.date.localeCompare(a.date);
        case 'amount-asc':  return a.amount - b.amount;
        case 'amount-desc': return b.amount - a.amount;
        default:            return b.date.localeCompare(a.date);
      }
    });

    return result;
  }

  // ── Computed Summaries ────────────────────────────────────────

  /**
   * @returns {{ totalIncome: number, totalExpenses: number, netBalance: number }}
   */
  getSummary() {
    const all = this._transactions;
    const totalIncome   = all.filter(tx => tx.category === 'Income')
                             .reduce((sum, tx) => sum + tx.amount, 0);
    const totalExpenses = all.filter(tx => tx.category === 'Expense')
                             .reduce((sum, tx) => sum + tx.amount, 0);
    return {
      totalIncome,
      totalExpenses,
      netBalance: totalIncome - totalExpenses,
    };
  }

  /**
   * Expense totals grouped by sub-category, for charts.
   * @returns {Object.<string, number>}
   */
  getExpenseBySubCategory() {
    return this._transactions
      .filter(tx => tx.category === 'Expense')
      .reduce((acc, tx) => {
        acc[tx.subCategory] = (acc[tx.subCategory] || 0) + tx.amount;
        return acc;
      }, {});
  }
}
