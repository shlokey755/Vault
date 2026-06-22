/**
 * FormValidator.js
 * Stateless validation utilities for the transaction form.
 */
export class FormValidator {
  /**
   * Validate all form fields.
   * @param {{ amount, date, category, subCategory, description }} fields
   * @returns {{ valid: boolean, errors: Object.<string, string> }}
   */
  static validate({ amount, date, category, subCategory, description }) {
    const errors = {};

    // Amount
    const numAmount = parseFloat(amount);
    if (amount === '' || amount === null || amount === undefined) {
      errors.amount = 'Amount is required.';
    } else if (isNaN(numAmount)) {
      errors.amount = 'Amount must be a number.';
    } else if (numAmount <= 0) {
      errors.amount = 'Amount must be greater than zero.';
    }

    // Date
    if (!date) {
      errors.date = 'Date is required.';
    } else {
      const chosen = new Date(date + 'T00:00:00');
      const today  = new Date();
      today.setHours(23, 59, 59, 999);
      if (isNaN(chosen.getTime())) {
        errors.date = 'Please enter a valid date.';
      } else if (chosen > today) {
        errors.date = 'Date cannot be in the future.';
      }
    }

    // Category
    if (!category) {
      errors.category = 'Please select a category.';
    }

    // Sub-Category
    if (!subCategory) {
      errors.subCategory = 'Please select a sub-category.';
    }

    // Description (optional, max 100)
    if (description && description.length > 100) {
      errors.description = 'Description cannot exceed 100 characters.';
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  }
}
