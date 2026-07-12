/**
 * StorageManager.js — Improved
 * Handles all localStorage read/write operations with repository-path isolation.
 */
export class StorageManager {
  // Generates a unique key specific to this repository path (e.g., "vault_transactions_/vault-money-manager/")
  // This prevents localData pollution if you host multiple apps under your github.io domain.
  static get STORAGE_KEY() {
    const namespace = window.location.pathname.replace(/\/$/, ""); 
    return `vault_transactions_${namespace || 'root'}`;
  }

  /**
   * Load raw transaction objects from localStorage.
   * @returns {Array<Object>}
   */
  static load() {
    try {
      const raw = localStorage.getItem(StorageManager.STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.error('StorageManager: failed to load data —', err);
      return [];
    }
  }

  /**
   * Save an array of plain objects to localStorage.
   * @param {Array<Object>} transactions
   */
  static save(transactions) {
    try {
      if (!Array.isArray(transactions)) return;
      const data = transactions.map(tx =>
        (tx && typeof tx.toJSON === 'function') ? tx.toJSON() : tx
      );
      localStorage.setItem(StorageManager.STORAGE_KEY, JSON.stringify(data));
    } catch (err) {
      console.error('StorageManager: failed to save data —', err);
    }
  }

  /** Clear all stored data */
  static clear() {
    try {
      localStorage.removeItem(StorageManager.STORAGE_KEY);
    } catch (err) {
      console.error('StorageManager: failed to clear data —', err);
    }
  }
}
