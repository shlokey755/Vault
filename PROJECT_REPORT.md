# Vault — Money Manager App
## Project Report

---

### 1. Overview

**Vault** is a responsive, web-based Money Manager application built as a capstone project. It allows users to track income and expenses, categorize transactions, view financial summaries with charts, and persist data across sessions—all within a polished, luxury-dark UI.

---

### 2. Implementation Approach

#### Architecture: OOP with ES6 Modules

The codebase is organized around the **Separation of Concerns** principle, with each class owning a distinct responsibility:

| Module | Responsibility |
|--------|---------------|
| `Transaction.js` | Data model for a single transaction |
| `StorageManager.js` | Reads/writes JSON to localStorage |
| `TransactionManager.js` | CRUD operations, filtering, sorting, summaries |
| `FormValidator.js` | Stateless validation logic |
| `UIManager.js` | All DOM manipulation, modal control, toast notifications |
| `ChartManager.js` | Chart.js bar and doughnut charts |
| `FilterManager.js` | Filter/sort control bindings |
| `ExportManager.js` | CSV download generation |
| `app.js` | Orchestrator — wires modules together, handles events |

#### Data Flow
```
User Action → app.js event handler
           → FormValidator (validate)
           → TransactionManager (CRUD + persist via StorageManager)
           → refreshUI() → UIManager + ChartManager
```

#### Persistence
All transactions are stored as a JSON array in `localStorage` under the key `vault_transactions`. On page load, `TransactionManager` automatically hydrates from storage via `StorageManager.load()`.

---

### 3. Features Implemented

**CRUD:**
- ✅ Create transactions with full validation
- ✅ Read — transaction history table with formatted display
- ✅ Update — edit form pre-fills existing values
- ✅ Delete — with confirmation modal

**Financial Summary:**
- ✅ Total Income, Total Expenses, Net Balance cards
- ✅ Positive/negative color coding on balance

**Filter & Sort:**
- ✅ Filter by Category, Sub-Category, Date Range
- ✅ Sort by Date (asc/desc) and Amount (asc/desc)
- ✅ Reset filters button

**Validation:**
- ✅ Amount: required, numeric, > 0
- ✅ Date: required, valid, not in future
- ✅ Category: required (radio buttons)
- ✅ Sub-Category: required, dynamically populated from category
- ✅ Description: optional, max 100 chars with live counter
- ✅ Inline error messages + red border highlights
- ✅ `try…catch` throughout business logic

**Bonus Features:**
- ✅ Bar chart — Income vs Expenses (Chart.js)
- ✅ Doughnut chart — Expense breakdown by sub-category
- ✅ CSV export with timestamped filename

**UI/UX:**
- ✅ Fully responsive (mobile, tablet, desktop)
- ✅ Sticky header, toast notifications, backdrop blur modals
- ✅ Dark luxury theme: Cormorant Garamond + Syne fonts, gold accents
- ✅ Keyboard accessible (Escape key closes modals)

---

### 4. Challenges Faced

1. **ES6 Module CORS Restriction** — Browsers block `import` statements on `file://` protocol. The app must be served via a local HTTP server (e.g., `npx serve` or VS Code Live Server).

2. **Dynamic Sub-Category Population** — Sub-category options needed to change based on which category radio was selected, both on the change event and when pre-filling the edit modal (requiring `_updateSubCategories()` before setting `.value`).

3. **Chart Reuse** — Chart.js instances must be updated (not re-created) to avoid "canvas already in use" errors. Solved by holding references to `_barChart` and `_pieChart` and calling `.update()` each time.

4. **Date Handling** — JavaScript's `new Date(dateString)` interprets `YYYY-MM-DD` as UTC midnight, causing off-by-one display errors in local time. Fixed by appending `T00:00:00` to force local timezone interpretation.

---

### 5. Key Learnings

- **OOP in vanilla JS** produces maintainable, testable code comparable to framework-based projects when modules are well-separated.
- **localStorage** is sufficient for client-side persistence; `JSON.parse`/`JSON.stringify` with error handling via `try…catch` is essential.
- **Chart.js** provides excellent out-of-the-box charts with minimal configuration and good dark-theme support via `Chart.defaults`.
- **CSS custom properties (variables)** make theming and consistency trivial — changing `--gold` propagates to the entire UI instantly.
- **Defensive programming** (input validation + `try…catch` at every boundary) prevents cryptic runtime errors and provides a better user experience.

---

### 6. How to Run

```bash
# Option A: VS Code Live Server
# Right-click index.html → "Open with Live Server"

# Option B: Node.js serve
npx serve .

# Option C: Python
python -m http.server 8000
# Then open http://localhost:8000
```

> **Note:** ES6 modules (`type="module"`) require an HTTP server. Opening `index.html` directly via `file://` will not work.

---

### 7. File Structure

```
money-manager/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── app.js                  ← Entry point / orchestrator
│   ├── Transaction.js          ← Data model
│   ├── StorageManager.js       ← localStorage layer
│   ├── TransactionManager.js   ← Business logic + CRUD
│   ├── FormValidator.js        ← Validation
│   ├── UIManager.js            ← DOM + modals + toasts
│   ├── ChartManager.js         ← Chart.js charts
│   ├── FilterManager.js        ← Filter/sort controls
│   └── ExportManager.js        ← CSV export
└── PROJECT_REPORT.md
```
