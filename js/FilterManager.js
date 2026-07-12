/**
 * FilterManager.js — Improved
 * Reads and manages the filter/sort controls safely.
 */
export class FilterManager {
  constructor(onChange) {
    this._onChange = onChange;

    this.categoryEl    = document.getElementById('filterCategory');
    this.subCategoryEl = document.getElementById('filterSubCategory');
    this.dateFromEl    = document.getElementById('filterDateFrom');
    this.dateToEl      = document.getElementById('filterDateTo');
    this.sortByEl      = document.getElementById('sortBy');
    this.resetBtn      = document.getElementById('resetFiltersBtn');

    this._bindEvents();
  }

  _bindEvents() {
    const elements = [this.categoryEl, this.subCategoryEl, this.dateFromEl, this.dateToEl, this.sortByEl];
    
    // Safely look through elements that exist in the DOM
    elements.forEach(el => {
      if (el) {
        el.addEventListener('change', () => {
          if (typeof this._onChange === 'function') {
            this._onChange(this.getFilters());
          }
        });
      }
    });

    if (this.resetBtn) {
      this.resetBtn.addEventListener('click', () => this.reset());
    }
  }

  /** @returns {Object} current filter state */
  getFilters() {
    return {
      category:    this.categoryEl ? this.categoryEl.value : 'all',
      subCategory: this.subCategoryEl ? this.subCategoryEl.value : 'all',
      dateFrom:    this.dateFromEl ? this.dateFromEl.value : '',
      dateTo:      this.dateToEl ? this.dateToEl.value : '',
      sortBy:      this.sortByEl ? this.sortByEl.value : 'date-desc',
    };
  }

  /** Reset all filters to defaults */
  reset() {
    if (this.categoryEl)    this.categoryEl.value    = 'all';
    if (this.subCategoryEl) this.subCategoryEl.value = 'all';
    if (this.dateFromEl)    this.dateFromEl.value    = '';
    if (this.dateToEl)      this.dateToEl.value      = '';
    if (this.sortByEl)      this.sortByEl.value      = 'date-desc';
    
    if (typeof this._onChange === 'function') {
      this._onChange(this.getFilters());
    }
  }
}
