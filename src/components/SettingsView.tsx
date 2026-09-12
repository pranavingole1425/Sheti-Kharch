import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext';
import { db } from '../db/db';
import { encryptData, decryptData } from '../db/crypto';
import { runScenario53Test, TestSuiteResult } from '../utils/verifyScenario53';
import { BackupData, Language } from '../types';
import {
  Globe,
  Lock,
  Download,
  Upload,
  ShieldAlert,
  Trash2,
  TestTube,
  FileText,
  Smartphone,
  AlertTriangle,
  Database
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    language,
    setLanguage,
    settings,
    setPinCode,
    disableAppLock,
    clearDemoData,
    clearAllData,
    seedDemo,
    showToast,
    t
  } = useFarm();

  const [pinInput, setPinInput] = useState<string>('');
  const [showPinForm, setShowPinForm] = useState<boolean>(false);

  // Backup / Restore
  const [backupPassword, setBackupPassword] = useState<string>('');
  const [useEncryption, setUseEncryption] = useState<boolean>(false);
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);
  const [clearConfirmText, setClearConfirmText] = useState<string>('');

  // Scenario 53 runner state
  const [testResult, setTestResult] = useState<TestSuiteResult | null>(null);
  const [isTesting, setIsTesting] = useState<boolean>(false);

  // Download Backup JSON
  const handleBackup = async () => {
    try {
      const farms = await db.farms.toArray();
      const crops = await db.crops.toArray();
      const expenses = await db.expenses.toArray();

      const backupObj: BackupData = {
        version: '1.0.0',
        exportedAt: new Date().toISOString(),
        farms,
        crops,
        expenses,
        settings
      };

      let contentStr = JSON.stringify(backupObj, null, 2);
      let filename = `ShetiKharcha_Backup_${new Date().toISOString().split('T')[0]}.json`;

      if (useEncryption && backupPassword) {
        const encrypted = await encryptData(contentStr, backupPassword);
        contentStr = JSON.stringify({ encrypted: true, payload: encrypted });
        filename = `ShetiKharcha_Encrypted_Backup_${new Date().toISOString().split('T')[0]}.skb`;
      }

      const blob = new Blob([contentStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showToast('Backup downloaded successfully.');
    } catch (err: any) {
      showToast(`Backup error: ${err.message}`, 'error');
    }
  };

  // Restore Backup
  const handleRestoreFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      let parsed = JSON.parse(text);

      if (parsed.encrypted) {
        if (!backupPassword) {
          showToast('Please enter your encryption password first!', 'error');
          return;
        }
        const decryptedStr = await decryptData(parsed.payload, backupPassword);
        parsed = JSON.parse(decryptedStr);
      }

      if (parsed.farms && Array.isArray(parsed.farms)) {
        await db.farms.clear();
        await db.crops.clear();
        await db.expenses.clear();

        await db.farms.bulkAdd(parsed.farms);
        if (parsed.crops) await db.crops.bulkAdd(parsed.crops);
        if (parsed.expenses) await db.expenses.bulkAdd(parsed.expenses);

        showToast(t.restoreSuccess);
      } else {
        showToast('Invalid backup file format.', 'error');
      }
    } catch (err: any) {
      showToast(`Restore failed: ${err.message}`, 'error');
    }
  };

  // Run Scenario #53 Test Suite
  const handleRunScenario53 = async () => {
    setIsTesting(true);
    setTestResult(null);
    const res = await runScenario53Test();
    setTestResult(res);
    setIsTesting(false);
    if (res.success) {
      showToast('Scenario #53 Verification Passed 100%! All calculations & isolation verified.');
    } else {
      showToast('Scenario #53 Verification failed!', 'error');
    }
  };

  const handleSetPinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.length !== 4 || isNaN(Number(pinInput))) {
      showToast('PIN must be 4 digits', 'error');
      return;
    }
    await setPinCode(pinInput);
    setPinInput('');
    setShowPinForm(false);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Banner */}
      <div className="bg-gradient-to-r from-farm-900 to-farm-800 text-white rounded-3xl p-5 shadow-lg">
        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          ⚙️ {t.settings}
        </h2>
        <p className="text-xs text-farm-100 mt-0.5">
          Language, PIN security, local backup & system documentation downloads
        </p>
      </div>

      {/* 📄 PROJECT DOCUMENTATION DOWNLOADS */}
      <div className="bg-gradient-to-r from-amber-50 to-emerald-50 border-2 border-amber-300/80 rounded-3xl p-5 shadow-sm space-y-3">
        <h3 className="text-sm font-black text-farm-950 flex items-center space-x-2">
          <FileText className="w-5 h-5 text-amber-600" />
          <span>📄 Project Setup & User Guide Documentation</span>
        </h3>
        <p className="text-xs text-gray-700 font-medium">
          Download the complete user guide and developer documentation for this project in Word (.docx) or Markdown (.md) format.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <a
            href="/HOW_TO_RUN_THIS_PROJECT.docx"
            download="HOW_TO_RUN_THIS_PROJECT.docx"
            className="bg-amber-400 hover:bg-amber-300 text-farm-950 font-black py-3 px-4 rounded-2xl shadow flex items-center justify-center space-x-2 text-xs transition-all active:scale-95 text-center"
          >
            <Download className="w-4 h-4" />
            <span>Download Guide (.docx)</span>
          </a>

          <a
            href="/HOW_TO_RUN_THIS_PROJECT.md"
            download="HOW_TO_RUN_THIS_PROJECT.md"
            className="bg-farm-800 hover:bg-farm-900 text-white font-extrabold py-3 px-4 rounded-2xl shadow flex items-center justify-center space-x-2 text-xs transition-all active:scale-95 text-center"
          >
            <FileText className="w-4 h-4 text-amber-300" />
            <span>Download Guide (.md)</span>
          </a>
        </div>
      </div>

      {/* 51. DATA LOSS WARNING BOX */}
      <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-4 shadow-sm space-y-2">
        <div className="flex items-center space-x-2 text-amber-900 font-extrabold text-xs uppercase tracking-wider">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
          <span>{t.dataLossWarning}</span>
        </div>
        <p className="text-xs text-amber-950 leading-relaxed font-medium">
          {t.dataLossWarning}
        </p>
      </div>

      {/* 43. LANGUAGE SELECTION */}
      <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm space-y-3">
        <h3 className="text-sm font-black text-gray-900 flex items-center space-x-2">
          <Globe className="w-4 h-4 text-farm-700" />
          <span>{t.language}</span>
        </h3>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setLanguage('mr')}
            className={`p-3 rounded-2xl border text-center font-bold text-xs transition-all ${
              language === 'mr'
                ? 'bg-farm-800 text-white border-farm-800 shadow-md'
                : 'bg-gray-50 text-gray-800 border-gray-200'
            }`}
          >
            मराठी (Marathi)
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={`p-3 rounded-2xl border text-center font-bold text-xs transition-all ${
              language === 'en'
                ? 'bg-farm-800 text-white border-farm-800 shadow-md'
                : 'bg-gray-50 text-gray-800 border-gray-200'
            }`}
          >
            English
          </button>
        </div>
      </div>

      {/* 29. APP LOCK PIN */}
      <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-gray-900 flex items-center space-x-2">
            <Lock className="w-4 h-4 text-farm-700" />
            <span>{t.appLock}</span>
          </h3>

          {settings?.appLockEnabled ? (
            <button
              onClick={disableAppLock}
              className="text-xs font-bold text-red-600 bg-red-50 px-3 py-1 rounded-xl border border-red-200"
            >
              Disable Lock
            </button>
          ) : (
            <button
              onClick={() => setShowPinForm(!showPinForm)}
              className="text-xs font-bold text-farm-800 bg-farm-50 px-3 py-1 rounded-xl border border-farm-200"
            >
              {showPinForm ? 'Cancel' : t.enableAppLock}
            </button>
          )}
        </div>

        {showPinForm && (
          <form onSubmit={handleSetPinSubmit} className="bg-gray-50 p-3.5 rounded-2xl border space-y-2">
            <label className="block text-xs font-bold text-gray-700">{t.setPin}</label>
            <div className="flex space-x-2">
              <input
                type="password"
                maxLength={4}
                value={pinInput}
                onChange={e => setPinInput(e.target.value)}
                placeholder="1234"
                className="w-32 px-3 py-2 bg-white border border-gray-300 rounded-xl text-center font-bold text-lg tracking-widest"
                required
              />
              <button
                type="submit"
                className="px-4 py-2 bg-farm-800 text-white font-bold text-xs rounded-xl shadow"
              >
                Save PIN
              </button>
            </div>
          </form>
        )}
      </div>

      {/* 30, 31. BACKUP & RESTORE */}
      <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm space-y-3">
        <h3 className="text-sm font-black text-gray-900 flex items-center space-x-2">
          <Database className="w-4 h-4 text-farm-700" />
          <span>{t.backupRestore}</span>
        </h3>

        {/* Optional Password Protection */}
        <div className="bg-gray-50 p-3 rounded-2xl border space-y-2">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="encryptOpt"
              checked={useEncryption}
              onChange={e => setUseEncryption(e.target.checked)}
              className="rounded text-farm-700"
            />
            <label htmlFor="encryptOpt" className="text-xs font-bold text-gray-700">
              {t.encryptedBackup}
            </label>
          </div>

          {useEncryption && (
            <input
              type="password"
              value={backupPassword}
              onChange={e => setBackupPassword(e.target.value)}
              placeholder={t.enterBackupPassword}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-semibold"
            />
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <button
            onClick={handleBackup}
            className="bg-farm-800 hover:bg-farm-900 text-white font-extrabold py-3 px-4 rounded-2xl shadow flex items-center justify-center space-x-2 text-xs"
          >
            <Download className="w-4 h-4 text-amber-300" />
            <span>{t.backupNow}</span>
          </button>

          <label className="bg-amber-400 hover:bg-amber-300 text-farm-950 font-black py-3 px-4 rounded-2xl shadow flex items-center justify-center space-x-2 text-xs cursor-pointer text-center">
            <Upload className="w-4 h-4" />
            <span>{t.restoreBackup}</span>
            <input
              type="file"
              accept=".json,.skb"
              onChange={handleRestoreFile}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* 53. AUTOMATED TEST SUITE RUNNER (SCENARIO #53) */}
      <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-gray-900 flex items-center space-x-2">
            <TestTube className="w-4 h-4 text-indigo-600" />
            <span>{t.runScenario53}</span>
          </h3>

          <button
            onClick={handleRunScenario53}
            disabled={isTesting}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-black px-3.5 py-2 rounded-xl text-xs flex items-center space-x-1 shadow active:scale-95 disabled:opacity-50"
          >
            <span>{isTesting ? 'Running Test...' : 'Run Test Suite'}</span>
          </button>
        </div>

        <p className="text-xs text-gray-600">
          {t.runScenario53Sub} (Farm A / Farm B updates, deletions, and all-farm totals).
        </p>

        {testResult && (
          <div className="bg-gray-50 border rounded-2xl p-4 text-xs space-y-2">
            <div className="flex items-center justify-between font-extrabold">
              <span className={testResult.success ? 'text-emerald-700' : 'text-red-700'}>
                {testResult.success ? '✅ TEST PASSED 100%' : '❌ TEST FAILED'}
              </span>
              <span className="text-gray-400 font-normal">{testResult.timestamp}</span>
            </div>

            <div className="space-y-1.5 pt-1">
              {testResult.steps.map((st, i) => (
                <div key={i} className="flex justify-between items-center bg-white p-2 rounded-xl border border-gray-100">
                  <span className="font-semibold text-gray-800">{st.step}</span>
                  <span className={`font-black ${st.passed ? 'text-emerald-600' : 'text-red-600'}`}>
                    {st.actual}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 52. DANGER ZONE (CLEAR DATA) */}
      <div className="bg-red-50 border border-red-200 rounded-3xl p-5 shadow-sm space-y-3">
        <h3 className="text-sm font-black text-red-900 flex items-center space-x-2">
          <Trash2 className="w-4 h-4 text-red-600" />
          <span>Danger Zone</span>
        </h3>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={clearDemoData}
            className="bg-white hover:bg-gray-100 text-gray-800 font-bold px-3.5 py-2 rounded-xl text-xs border border-gray-300"
          >
            {t.clearDemoData}
          </button>

          <button
            onClick={seedDemo}
            className="bg-white hover:bg-gray-100 text-farm-800 font-bold px-3.5 py-2 rounded-xl text-xs border border-farm-300"
          >
            Load Demo Data
          </button>

          <button
            onClick={() => setShowClearConfirm(true)}
            className="bg-red-600 hover:bg-red-700 text-white font-extrabold px-3.5 py-2 rounded-xl text-xs shadow"
          >
            {t.clearAllData}
          </button>
        </div>
      </div>

      {/* Clear All Data Double Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm text-center space-y-4 shadow-2xl">
            <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-base font-black text-red-900">
                {t.clearAllDataConfirm}
              </h3>
              <p className="text-xs text-gray-600 mt-1">
                Type <strong className="text-red-600">DELETE</strong> to confirm wiping all local farms and expenses.
              </p>
            </div>

            <input
              type="text"
              value={clearConfirmText}
              onChange={e => setClearConfirmText(e.target.value)}
              placeholder="DELETE"
              className="w-full text-center py-2.5 bg-gray-100 border border-gray-300 rounded-xl font-bold uppercase"
            />

            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setShowClearConfirm(false);
                  setClearConfirmText('');
                }}
                className="flex-1 bg-gray-200 font-bold py-2.5 rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                disabled={clearConfirmText !== 'DELETE'}
                onClick={async () => {
                  await clearAllData();
                  setShowClearConfirm(false);
                  setClearConfirmText('');
                }}
                className="flex-1 bg-red-600 disabled:opacity-40 text-white font-extrabold py-2.5 rounded-xl text-xs shadow"
              >
                WIPE ALL DATA
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
