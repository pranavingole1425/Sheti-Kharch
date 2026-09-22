# 🌾 SHETI KHARCHA (शेती खर्चा)
### *शेतीचा प्रत्येक खर्च, आता आपल्या मोबाईलमध्ये.*

![PWA Ready](https://img.shields.io/badge/PWA-100%25%20Offline-emerald?style=for-the-badge&logo=pwa)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=for-the-badge&logo=tailwindcss)
![IndexedDB](https://img.shields.io/badge/Database-IndexedDB%20%2F%20Dexie.js-orange?style=for-the-badge)
![Languages](https://img.shields.io/badge/Languages-मराठी%20%7C%20English-green?style=for-the-badge)

A complete, production-quality, mobile-first **Progressive Web App (PWA)** specifically designed for farmers to manage their farm-wise expenses, crops, reports, and backups 100% offline.

---

## 🌟 Key Highlights & Features

### 1. 🌾 Strict Farm-Wise Data Isolation (Most Important)
- **Separate Farm Dashboards**: Expenses belonging to Farm A (e.g. *Main Farm - ₹35,500*) **NEVER** mix into Farm B (*River Side Farm - ₹24,000*).
- **Mandatory Farm Association**: Every expense requires a valid `farmId`.
- **Automatic Calculations**:
  - `Farm Total`: Sum of expenses where `farmId == selectedFarm.id`
  - `Cost Per Acre`: `Farm Total / Farm Area` (Supports Acre, Hectare, Guntha)
  - `This Month Total`: Expenses in the current calendar month for the selected farm.
  - `Combined All-Farms Total`: Summary view aggregating totals across all active farms without cluttering individual farm dashboards.

### 2. 📱 Mobile-First & Older Farmer Friendly UX
- **Prominent Farm Context Header**: High-visibility banner when inside a farm dashboard (`🌱 MAIN FARM | 5 Acres • Cotton • Kharif 2026`).
- **Touch-Friendly Controls**: Large cards, minimum 48px tap targets, large numerical displays, and quick product suggestion chips (*Coragen, Urea, DAP, Cotton Seeds, Labour, Tractor*).
- **Bilingual Interface**: Toggle between **Marathi (मराठी) & English** with instant reactivity and persistent preference.

### 3. 📶 100% Offline-First & PWA Installable
- **IndexedDB (`ShetiKharchaDB`)**: Local data store via Dexie.js for instant offline reads/writes. No cloud account or registration required.
- **Service Worker & Manifest**: Pre-caches app shell and static assets (`sw.js` & `manifest.json`) for standalone home-screen installation on Android devices.

### 4. 🔒 Security, PIN Lock & Encrypted Backup
- **Web Crypto API Encryption**: Optional AES-GCM password protection for exported backup files (`.skb` / `.json`).
- **App Lock (4-Digit PIN)**: PBKDF2 / SHA-256 derived PIN verification with custom on-screen numeric keypad.
- **Data Loss Warning & Clear Data Safeguards**: Prominent Marathi/English warnings and double-confirmation protection (`DELETE` prompt) against accidental data wiping.

### 5. 📄 Export & Reports
- **PDF Export**: Single farm and combined all-farms PDF statements generated directly in-browser using `jsPDF`.
- **CSV Data Export**: Formatted spreadsheet download with UTF-8 BOM byte marker for seamless opening in Excel with Marathi script.
- **SVG Analytics Charts**: Responsive Bar, Donut, and Line charts for farm-wise comparison, category distribution, and monthly expense trends.

### 6. 🧪 Automated Scenario #53 Test Suite
- Includes an embedded verification test suite in Settings to run automated mathematical and data isolation checks, confirming 100% PASS results.

---

## 🏗️ Data Hierarchy & Architecture

```
🌾 SHETI KHARCHA (ShetiKharchaDB - IndexedDB)
 ├── ⚙️ Settings (Language, PIN Hash, Preferences)
 ├── 🏡 Farms (id, name, location, area, unit, currentSeason, notes, status)
 ├── 🌾 Crops / Seasons (id, farmId, cropName, season, plantingDate, expectedHarvestDate)
 └── 💰 Expenses (id, farmId, cropId, date, category, productName, quantity, amount, vendor, notes)
```

---

## 🚀 Quick Start Commands

### Prerequisites
- Node.js v18+ (Tested on v24.19.0)
- npm v9+ (Tested on 11.17.0)

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open browser at `http://localhost:3000/`.

### 3. Build for Production
```bash
npm run build
```

### 4. Preview Production Build
```bash
npm run preview
```
Open browser at `http://localhost:4173/`.

---

## 📲 How to Install as a PWA on an Android Phone

1. Connect your Android phone to the **same Wi-Fi network** as your computer.
2. Open **Google Chrome** on your phone and enter your computer's IP address (e.g. `http://192.168.31.81:3000/`).
3. Tap Chrome menu (**⋮** top-right corner).
4. Tap **Add to Home screen** / **Install App**.
5. The **SHETI KHARCHA** icon will appear on your phone home screen and work **100% offline**!

---

## 📁 Project Structure Reference

```
SHETI KHARCH/
 ├── index.html               # Main Entrypoint
 ├── README.md                # Project Overview & Setup Guide
 ├── HOW_TO_RUN_THIS_PROJECT.md / .docx # User & Developer Documentation
 ├── package.json             # Dependencies & Build Scripts
 ├── vite.config.ts           # Vite Config
 ├── public/                  # Manifest, Service Worker & Icons
 └── src/
      ├── App.tsx             # Root Layout & Router
      ├── context/            # React Context & IndexedDB State
      ├── db/                 # Dexie DB, Seeder & Web Crypto
      ├── i18n/               # Marathi & English Translations
      ├── utils/              # Calculations, PDF & CSV Exporters, Test Suite
      └── components/         # UI Views & Modals
```

---

## 📄 Documentation Downloads

Downloadable setup guides are embedded directly inside the app under **Settings (⚙️)**:
- `HOW_TO_RUN_THIS_PROJECT.docx` (Microsoft Word Document)
- `HOW_TO_RUN_THIS_PROJECT.md` (Markdown File)

## 🌐 Deployment Guide (100% Production Ready)

The project is fully configured and ready for 1-click deployment across all major static hosting and cloud platforms:

### 1. Deploy on Vercel
- Already configured with `vercel.json` for SPA routing and PWA Service Worker caching.
- Connect your GitHub repository on [vercel.com](https://vercel.com).
- Vercel will automatically detect the settings:
  - **Framework Preset**: Vite
  - **Build Command**: `npm run build`
  - **Output Directory**: `dist`

### 2. Deploy on Netlify
- Configured with `netlify.toml` and `public/_redirects`.
- Connect your GitHub repository on [netlify.com](https://netlify.com).
- Click **Deploy Site** — all redirects and PWA manifest headers are applied automatically.

### 3. Deploy on GitHub Pages (Automated CI/CD)
- A GitHub Actions workflow is provided in `.github/workflows/deploy.yml`.
- Go to your GitHub repository -> **Settings** -> **Pages** -> under **Source**, select **GitHub Actions**.
- Any push to `main` will automatically build and deploy the app to `https://<your-username>.github.io/<repo-name>/`.

### 4. Deploy with Docker
```bash
# Build Docker image
docker build -t sheti-kharcha .

# Run container on port 80
docker run -p 80:80 sheti-kharcha
```

---

## 👤 Author & License

**Developed for**: Farmers managing multiple fields & crops.  
**Repository**: [https://github.com/pranavingole1425/Sheti-Kharch](https://github.com/pranavingole1425/Sheti-Kharch)  
**License**: MIT License