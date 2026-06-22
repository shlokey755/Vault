/**
 * ExportManager.js
 * Handles exporting transaction data to a CSV file.
 */
export class ExportManager {
  /**
   * Download all transactions as a CSV file.
   * @param {Transaction[]} transactions
   */
  static exportCSV(transactions) {
    if (transactions.length === 0) {
      return false; // caller should show a toast
    }

    const headers = ['ID', 'Date', 'Category', 'Sub-Category', 'Description', 'Amount (INR)'];

    const rows = transactions.map(tx => [
      tx.id,
      tx.date,
      tx.category,
      tx.subCategory,
      `"${(tx.description || '').replace(/"/g, '""')}"`, // escape quotes
      tx.amount.toFixed(2),
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href     = url;
    link.download = `vault_transactions_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Revoke object URL to free memory
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return true;
  }
}
