# 🌾 SHETI KHARCHA (शेती खर्चा)
## How to Run & Deploy This Project Guide

**Application Name**: SHETI KHARCHA (शेती खर्चा)  
**Tagline**: शेतीचा प्रत्येक खर्च, आता आपल्या मोबाईलमध्ये.  
**Platform**: Progressive Web App (PWA) — Mobile-First, Offline-First, Bilingual (Marathi & English).

---

## 📋 1. Prerequisites

Before running the application, make sure you have the following installed on your system:

- **Node.js**: Version 18.0 or higher (Tested on Node v24.19.0).
- **npm**: Version 9.0 or higher (Tested on npm 11.17.0).
- **Web Browser**: Google Chrome, Microsoft Edge, Mozilla Firefox, or Safari (Chrome recommended for PWA installation).

---

## 🚀 2. Quick Start Commands

### Step A: Open Terminal in Project Folder
Navigate to the project root directory:
```bash
cd "c:\Users\Admin\OneDrive\Desktop\Antigravity\SHETI KHARCH"
```

### Step B: Install Dependencies (First Time Only)
Run the following command to install all required npm packages (`react`, `dexie`, `jspdf`, `tailwindcss`, `lucide-react`, etc.):
```bash
npm install
```

### Step C: Run Development Server
Start the Vite development server with local network access enabled:
```bash
npm run dev
```
OR run Vite directly:
```bash
npx vite --host 0.0.0.0 --port 3000
```

Once started, open your browser at:
- **Local Desktop Access**: `http://localhost:3000/`
- **Network / Mobile Access**: `http://<YOUR_LOCAL_IP>:3000/` (e.g., `http://192.168.31.81:3000/`)

---

## 📦 3. Production Build & Deployment

### Build Production Bundle
To create a minified, production-ready PWA build bundle inside the `dist/` directory:
```bash
npm run build
```

### Preview Production Build Locally
To test the built production bundle locally before deploying to web hosting:
```bash
npm run preview
```
Open browser at `http://localhost:4173/`.

---

## 📱 4. Installing as a PWA on an Android Phone

1. Connect your Android phone to the **same Wi-Fi network** as your computer.
2. Open **Google Chrome** on your phone and enter your computer's IP URL (e.g., `http://192.168.31.81:3000/`).
3. Tap the Chrome menu button (**⋮** three dots in top-right corner).
4. Tap **Add to Home screen** or **Install app**.
5. Confirm installation. The **SHETI KHARCHA** icon will now appear on your phone's app drawer/home screen.
6. **Offline Capability**: You can now turn OFF mobile data and Wi-Fi! The app will continue working 100% offline.

---

## 🧪 5. Running the Automated Mathematical Verification Test (Scenario #53)

To verify farm-wise data isolation and mathematical formulas:
1. Open the app in browser/phone.
2. Go to **Settings (⚙️)** ➔ **🧪 Run Automated Test (Scenario #53)**.
3. Click **Run Test Suite**.
4. The system will execute 9 automated steps testing Farm A & Farm B initial totals, edits, deletions, and combined summary, reporting **100% PASS** results.

---

## 📁 6. Project Directory Structure

```
SHETI KHARCH/
 ├── index.html               # Main PWA HTML Entrypoint
 ├── package.json             # NPM Dependencies & Scripts
 ├── vite.config.ts           # Vite Bundler Configuration
 ├── tailwind.config.js       # Tailwind CSS Theme & Colors
 ├── tsconfig.json            # TypeScript Compiler Configuration
 ├── public/
 │    ├── manifest.json       # PWA Web App Manifest
 │    ├── sw.js               # Service Worker for Offline Caching
 │    └── icons/              # App Icons
 └── src/
      ├── App.tsx             # Root React Component & View Router
      ├── main.tsx            # React Mount & ServiceWorker Registration
      ├── index.css           # Global Styles & Tailwind Directives
      ├── context/
      │    └── FarmContext.tsx# State Management & IndexedDB Queries
      ├── db/
      │    ├── db.ts          # IndexedDB ShetiKharchaDB (Dexie.js)
      │    ├── seed.ts        # Sample Demo Data Seeder
      │    └── crypto.ts      # Web Crypto API Encryption & Hashing
      ├── i18n/
      │    └── translations.ts# Marathi & English Translations
      ├── utils/
      │    ├── calculations.ts# Financial Calculations & Filters
      │    ├── pdfExport.ts   # Client-Side PDF Report Generator
      │    ├── csvExport.ts   # UTF-8 BOM CSV Export Generator
      │    └── verifyScenario53.ts # Scenario #53 Test Runner
      └── components/
           ├── Header.tsx           # Navigation Header & Language Switch
           ├── BottomNav.tsx        # Mobile Touch Bottom Navigation
           ├── FarmList.tsx         # Home Farm Cards View
           ├── FarmDashboard.tsx    # Farm-Specific Dashboard View
           ├── FarmFormModal.tsx    # Add/Edit Farm Modal
           ├── ExpenseFormModal.tsx # Add/Edit Expense Modal
           ├── ExpenseHistory.tsx   # Expense List & Search
           ├── CropManager.tsx      # Crop & Season Management
           ├── AllFarmsSummary.tsx  # Combined Analytics Dashboard
           ├── AnalyticsCharts.tsx  # SVG Responsive Charts
           ├── ReportsExporter.tsx  # PDF/CSV Export View
           ├── SettingsView.tsx     # Security & Backup Settings
           ├── PinLockModal.tsx     # PIN App Lock Security Screen
           └── Toast.tsx            # Visual Toast Notifications
```

---

## 🛠️ 7. Troubleshooting & FAQ

- **Q: Expenses from Farm A are showing up in Farm B!**  
  *A: Impossible by architecture! Every expense requires a valid `farmId` and database queries scope strictly by `farmId`.*
- **Q: How to reset demo data?**  
  *A: Go to Settings (⚙️) ➔ Danger Zone ➔ Clear Demo Data / Load Demo Data.*
- **Q: Will data be lost if browser is closed?**  
  *A: No! Data is permanently persisted in your browser's IndexedDB (`ShetiKharchaDB`). Use "Backup Now" in Settings to download a JSON backup file anytime.*
