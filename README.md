# 💰 Vault — Money Manager App

Vault is a modern, responsive, web-based **Money Manager application** designed to help users track income and expenses, visualize financial data, and manage transactions efficiently — all within a sleek, luxury dark-themed interface.

---

## 🚀 Features

### ✅ Core Functionality

* **Add Transactions** — Record income and expenses with validation
* **View History** — Clean, formatted transaction table
* **Edit Transactions** — Pre-filled forms for quick updates
* **Delete Transactions** — Confirmation modal for safety

### 📊 Financial Insights

* Total Income, Expenses, and Net Balance cards
* Color-coded balance (profit/loss indication)
* Interactive charts:

  * Bar chart (Income vs Expenses)
  * Doughnut chart (Expense breakdown)

### 🔍 Filter & Sort

* Filter by:

  * Category
  * Sub-category
  * Date range
* Sort by:

  * Date (ascending/descending)
  * Amount (ascending/descending)
* One-click reset filters

### 🛡️ Validation

* Amount must be numeric and greater than zero
* Date must be valid and not in the future
* Category & sub-category required
* Description optional (max 100 characters with live counter)
* Inline error messages with visual feedback

### 📁 Extras

* CSV export with timestamped filenames
* Persistent storage using `localStorage`
* Fully responsive design (mobile → desktop)
* Keyboard accessibility (Escape closes modals)
* Toast notifications for user feedback

---

## 🏗️ Tech Stack

* **HTML5**
* **CSS3** (Custom properties, responsive layout)
* **JavaScript (ES6 Modules)**
* **Chart.js** (data visualization)
* **localStorage** (client-side persistence)

---

## 🧠 Architecture

The project follows **Object-Oriented Programming (OOP)** and **Separation of Concerns** principles.

| Module                  | Responsibility                     |
| ----------------------- | ---------------------------------- |
| `Transaction.js`        | Transaction data model             |
| `StorageManager.js`     | Handles localStorage operations    |
| `TransactionManager.js` | CRUD + filtering + summaries       |
| `FormValidator.js`      | Input validation logic             |
| `UIManager.js`          | DOM updates, modals, notifications |
| `ChartManager.js`       | Chart rendering and updates        |
| `FilterManager.js`      | Filter/sort event handling         |
| `ExportManager.js`      | CSV generation                     |
| `app.js`                | Main controller (event wiring)     |

### 🔄 Data Flow

```
User Action
   ↓
app.js (event handler)
   ↓
FormValidator (validation)
   ↓
TransactionManager (CRUD + storage)
   ↓
refreshUI()
   ↓
UIManager + ChartManager
```

---

## 💾 Data Persistence

* All transactions are stored in **localStorage**
* Key used: `vault_transactions`
* Data is automatically loaded on app startup

---

## ⚙️ Installation & Running

Because the app uses **ES6 modules**, it must be served via a local server.

### Option 1: VS Code Live Server

* Right-click `index.html`
* Click **"Open with Live Server"**

### Option 2: Node.js

```bash
npx serve .
```

### Option 3: Python

```bash
python -m http.server 8000
```

Then open:

```
http://localhost:8000
```

> ⚠️ Opening via `file://` will NOT work due to module restrictions.

---

## 📁 Project Structure

```
money-manager/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── app.js
│   ├── Transaction.js
│   ├── StorageManager.js
│   ├── TransactionManager.js
│   ├── FormValidator.js
│   ├── UIManager.js
│   ├── ChartManager.js
│   ├── FilterManager.js
│   └── ExportManager.js
└── PROJECT_REPORT.md
```

---

## ⚠️ Known Challenges & Solutions

* **ES6 Modules not working locally**
  → Fixed by running a local HTTP server

* **Dynamic sub-category updates**
  → Ensured correct order of UI updates before setting values

* **Chart.js canvas reuse error**
  → Reused chart instances and called `.update()`

* **Date off-by-one issue**
  → Appended `T00:00:00` to enforce local timezone

---

## 🎨 UI Highlights

* Dark luxury theme with gold accents
* Elegant typography (Cormorant Garamond + Syne)
* Smooth modals with backdrop blur
* Clean, responsive layout

---

## 📚 Key Learnings

* OOP in vanilla JavaScript can scale well with proper structure
* localStorage is powerful for lightweight persistence
* Chart.js simplifies data visualization significantly
* CSS variables enable consistent and flexible theming
* Defensive programming improves reliability and UX

---

## 📌 Future Improvements

* Add user authentication
* Cloud database integration (Firebase / MongoDB)
* Recurring transactions
* Budget tracking & alerts
* Multi-currency support

---

## 👨‍💻 Author

**Shlok**

---

## 📄 License

This project is open-source and available for educational and personal use.
