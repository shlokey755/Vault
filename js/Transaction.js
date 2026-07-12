/**
 * Transaction.js
 * Represents a single financial transaction (Model).
 */
export class Transaction {
  /**
   * @param {Object} data
   * @param {string} [data.id]          - Unique ID (auto-generated if omitted)
   * @param {number}  data.amount       - Positive numeric value
   * @param {string}  data.date         - ISO date string YYYY-MM-DD
   * @param {string}  data.category     - 'Income' | 'Expense'
   * @param {string}  data.subCategory  - e.g. 'Salary', 'Food', etc.
   * @param {string}  [data.description]- Optional note
   */
  constructor({ id, amount, date, category, subCategory, description = '' }) {
    this.id          = id || Transaction.generateId();
    this.amount      = parseFloat(amount);
    this.date        = date;
    this.category    = category;
    this.subCategory = subCategory;
    this.description = description.trim().slice(0, 100);
    this.createdAt   = new Date().toISOString();
  }

  /** Generate a short unique ID */
  static generateId() {
    return `tx_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  }

  /** Return plain object suitable for JSON storage */
  toJSON() {
    return {
      id:          this.id,
      amount:      this.amount,
      date:        this.date,
      category:    this.category,
      subCategory: this.subCategory,
      description: this.description,
      createdAt:   this.createdAt,
    };
  }

  /** Reconstruct a Transaction instance from a plain object */
  static fromJSON(obj) {
    const tx = new Transaction(obj);
    tx.createdAt = obj.createdAt || new Date().toISOString();
    return tx;
  }

  /** Signed amount: positive for income, negative for expense */
  get signedAmount() {
    return this.category === 'Income' ? this.amount : -this.amount;
  }

  /** Human-readable formatted amount with sign */
  get formattedAmount() {
    const sign   = this.category === 'Income' ? '+' : '-';
    const amount = this.amount.toLocaleString('en-IN', {
      style:    'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    });
    return `${sign}${amount}`;
  }

  /** Formatted display date */
  get formattedDate() {
    return new Date(this.date + 'T00:00:00').toLocaleDateString('en-IN', {
      day:   '2-digit',
      month: 'short',
      year:  'numeric',
    });
  }
}
