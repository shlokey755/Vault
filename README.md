# 💎 Vault — Money Manager

A sleek, modern personal finance manager for tracking income and expenses with beautiful charts and analytics. **Now available as a Progressive Web App (PWA)** — install it like a native app!

---

## ✨ Features

### 💰 Core Functionality
- **Track Income & Expenses** — Categorize and record all transactions
- **Real-time Analytics** — Visual charts showing income vs expenses and breakdown by category
- **Smart Filtering** — Filter by category, date range, and more
- **CSV Export** — Download your transaction history as CSV for backup or analysis
- **Responsive Design** — Works perfectly on desktop, tablet, and mobile

### 📊 Visual Insights
- **Income vs Expenses Chart** — Bar chart comparing total income and expenses
- **Expense Breakdown Chart** — Donut chart showing where your money goes
- **Summary Cards** — Quick view of Total Income, Net Balance, and Total Expenses
- **Transaction Table** — Complete history with date, category, amount, and actions

### 🎯 Smart Categorization
- **Income Categories:** Salary, Allowances, Bonus, Petty Cash
- **Expense Categories:** Rent, Food, Shopping, Entertainment
- **Custom Descriptions** — Add notes to track details (max 100 characters)
- **Sub-categories** — Organize expenses by specific type

### 🚀 PWA (Progressive Web App)
- **Install as Native App** — Add to home screen or start menu
- **Offline Support** — Access your data without internet
- **Instant Loading** — Cached assets load in milliseconds
- **No App Store Needed** — Install directly from the browser

---

## 🖥️ Installation

### Desktop (Chrome/Edge)
1. Visit: [https://shlokey755.github.io/Vault/](https://shlokey755.github.io/Vault/)
2. Look for the **Install button** in the address bar (right side)
3. Click **Install**
4. App opens in a window like a native application

### Mobile (Android)
1. Open in **Chrome** browser
2. Tap the **⋮ menu** (three dots, top right)
3. Tap **"Install app"** or **"Add to Home Screen"**
4. App appears on your home screen

### Mobile (iOS/Safari)
1. Open in **Safari** browser
2. Tap the **Share** button
3. Tap **"Add to Home Screen"**
4. App opens fullscreen without browser UI

---

## 🎮 How to Use

### Adding a Transaction
1. Click **"+ Add Transaction"** button (top right)
2. Fill in the form:
   - **Amount** — How much (required)
   - **Date** — When it happened (required, can't be future)
   - **Category** — Income or Expense (required)
   - **Sub-Category** — Specific type (required)
   - **Description** — Optional note (max 100 chars)
3. Click **"Add Transaction"**
4. Charts update instantly!

### Editing a Transaction
1. Find the transaction in the table
2. Click the **Edit** button
3. Modify the fields
4. Click **"Update Transaction"**

### Deleting a Transaction
1. Find the transaction in the table
2. Click the **Delete** button
3. Confirm in the popup
4. Transaction is removed

### Filtering & Sorting
- **Category Filter** — Show Income, Expense, or All
- **Sub-Category Filter** — Filter by specific type
- **Date Range** — Filter between two dates
- **Sort Options:**
  - Date: Newest First (default)
  - Date: Oldest First
  - Amount: High → Low
  - Amount: Low → High
- Click **Reset** to clear all filters

### Exporting Data
1. Click **"Export CSV"** button (top left)
2. File downloads as `vault_transactions_YYYY-MM-DD.csv`
3. Open in Excel, Google Sheets, or any spreadsheet app

---

## 📱 Offline Support

Your Vault app works **completely offline** thanks to PWA technology:

- ✅ **View existing transactions** without internet
- ✅ **Access charts and analytics** with cached data
- ✅ **Use all features** while offline
- ✅ **Data syncs when online** automatically

**Note:** Data is stored locally in your browser (localStorage). It persists across sessions.

---

## 🏗️ Architecture

### Frontend Stack
- **HTML5** — Semantic markup with ARIA accessibility
- **CSS3** — Mobile-first responsive design with dark theme
- **JavaScript (ES6+)** — Modular class-based architecture
- **Chart.js** — Beautiful interactive charts

### Key Classes
- **Transaction** — Data model for a single transaction
- **StorageManager** — Handles localStorage persistence
- **TransactionManager** — Business logic (CRUD operations)
- **UIManager** — DOM manipulation and modal management
- **ChartManager** — Initializes and updates charts
- **FilterManager** — Manages filter and sort state
- **FormValidator** — Validates transaction form
- **ExportManager** — Handles CSV export

### Storage
- **LocalStorage** — Persists all transactions and settings
- **Service Worker Cache** — Caches app assets for offline access

---

## 🔒 Privacy & Security

- ✅ **No backend server** — All data stays on your device
- ✅ **No cloud sync** — Your financial data is private
- ✅ **No tracking** — No analytics or user tracking
- ✅ **HTTPS only** — All communications encrypted
- ✅ **Open source** — Code is transparent and auditable

---

## 🎨 Design

### Theme
- **Dark Mode** — Easy on the eyes, modern aesthetic
- **Color Palette:**
  - Primary: Deep Navy (#1a1a2e)
  - Accent: Gold (#ffd700)
  - Income: Green (#2ecc71)
  - Expense: Red (#e74c3c)

### Typography
- **Serif** (Cormorant Garamond) — Headings, elegant look
- **Sans-serif** (Syne) — Body text, clean readability

### Responsive Breakpoints
- **Mobile** — 320px and up
- **Tablet** — 768px and up
- **Desktop** — 1024px and up

---

## 📊 Categories & Sub-Categories

### Income Types
- **Salary** — Regular employment income
- **Allowances** — Gifts or allowances received
- **Bonus** — Performance bonuses or windfalls
- **Petty Cash** — Small income sources

### Expense Types
- **Rent** — Housing costs
- **Food** — Groceries and dining
- **Shopping** — General shopping and purchases
- **Entertainment** — Fun and leisure activities

---

## 🚀 Browser Support

| Browser | Desktop | Mobile |
|---------|---------|--------|
| Chrome | ✅ Full | ✅ Full |
| Edge | ✅ Full | ✅ Full |
| Firefox | ✅ Full | ✅ Full |
| Safari | ✅ Full | ⚠️ Limited |

**Note:** Safari on iOS has limited PWA support but works well as a home screen shortcut.

---

## 📈 Future Roadmap

- [ ] Budget planning and alerts
- [ ] Recurring transactions
- [ ] Multi-currency support
- [ ] Data backup to cloud
- [ ] Family/shared accounts
- [ ] Advanced reports and trends
- [ ] Dark/light theme toggle
- [ ] Custom categories

---

## 🐛 Known Issues

- None currently! Please report bugs via GitHub Issues.

---

## 💡 Tips & Tricks

1. **Quick Add** — Use the home screen shortcut to quickly add transactions
2. **Backup Data** — Regularly export to CSV for backup
3. **Mobile Gesture** — Swipe down to refresh data
4. **Keyboard Shortcuts** — Press `Esc` to close modals
5. **Offline Access** — All data cached, works without internet

---

## 📄 License

Open source — feel free to use, modify, and share!

---

## 🤝 Contributing

Found a bug? Have a suggestion?

1. Create an issue on GitHub
2. Describe the problem clearly
3. Include screenshots if possible
4. We'll review and fix ASAP!

---

## 📞 Support

For questions or issues:
1. Check the FAQ section below
2. Review existing GitHub issues
3. Create a new issue with details

---

## ❓ FAQ

**Q: Is my data safe?**  
A: Completely! Data never leaves your device. We don't have servers or cloud storage.

**Q: Can I sync across devices?**  
A: Currently each device has its own data. We're working on optional cloud sync.

**Q: What happens if I clear browser data?**  
A: All transactions are deleted. Always export to CSV for backup!

**Q: Can I use this offline?**  
A: Yes! Install as PWA and it works completely offline with cached data.

**Q: Is this better than spreadsheets?**  
A: Yes! Visual charts, instant filtering, mobile-friendly, and automatic calculations.

**Q: Can I change the categories?**  
A: Currently categories are fixed, but we're planning customizable categories.

**Q: How do I uninstall?**  
A: Desktop: Uninstall like any app. Mobile: Long-press app → Remove from home screen.

---

## 🎉 Enjoy Managing Your Finances!

Download, install, and start tracking your money today. Your financial health starts here.

**[Install Vault Now →](https://shlokey755.github.io/Vault/)**

---

**Made with 💎 and JavaScript**
