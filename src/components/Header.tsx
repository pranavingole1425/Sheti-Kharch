import React, { useState, useEffect } from 'react';
import { useFarm } from '../context/FarmContext';
import { Globe, ArrowLeft, Lock, BarChart2, Download, Smartphone } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    t,
    language,
    setLanguage,
    selectedFarm,
    setSelectedFarmId,
    activeTab,
    setActiveTab,
    settings
  } = useFarm();

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted PWA installation');
        }
        setDeferredPrompt(null);
      });
    } else {
      alert(
        language === 'mr'
          ? 'ॲप इंस्टॉल करण्यासाठी क्रोम मेनूमध्ये (⋮) "Add to Home Screen" वर क्लिक करा.'
          : 'To install the app, tap Chrome menu (⋮) and select "Add to Home Screen".'
      );
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'mr' ? 'en' : 'mr');
  };

  return (
    <header className="bg-farm-800 text-white shadow-md sticky top-0 z-30">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {selectedFarm ? (
            <button
              onClick={() => setSelectedFarmId(null)}
              className="p-1.5 rounded-lg bg-farm-900/60 hover:bg-farm-900 text-white flex items-center space-x-1 active:scale-95 transition-all"
              title={t.back}
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-xs font-semibold hidden sm:inline">{t.back}</span>
            </button>
          ) : null}

          <div
            onClick={() => {
              setSelectedFarmId(null);
              setActiveTab('farms');
            }}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <div className="bg-amber-500 p-1.5 rounded-xl shadow-inner text-farm-950 font-bold">
              🌾
            </div>
            <div>
              <h1 className="font-extrabold text-lg sm:text-xl tracking-tight leading-none text-amber-300">
                {t.appName}
              </h1>
              <p className="text-[10px] sm:text-xs text-farm-100/90 font-medium line-clamp-1">
                {selectedFarm ? `${selectedFarm.name} (${selectedFarm.area} ${selectedFarm.unit})` : t.tagline}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 sm:space-x-2">
          {/* Download Project Docx Guide Button */}
          <a
            href="/HOW_TO_RUN_THIS_PROJECT.docx"
            download="HOW_TO_RUN_THIS_PROJECT.docx"
            className="px-2 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-farm-950 font-extrabold text-[11px] sm:text-xs flex items-center space-x-1 shadow-sm transition-all active:scale-95"
            title="Download User & Setup Guide (.docx)"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Guide (.docx)</span>
          </a>

          {/* PWA Install App Button */}
          <button
            onClick={handleInstallClick}
            className="px-2 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[11px] sm:text-xs flex items-center space-x-1 shadow-sm transition-all active:scale-95"
            title="Install App / ॲप डाउनलोड करा"
          >
            <Smartphone className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden md:inline">Install App</span>
          </button>

          {/* Quick All Farms Summary Button */}
          <button
            onClick={() => {
              setSelectedFarmId(null);
              setActiveTab('all_summary');
            }}
            className={`p-1.5 sm:p-2 rounded-xl text-xs font-bold flex items-center space-x-1 transition-all ${
              activeTab === 'all_summary' && !selectedFarm
                ? 'bg-amber-400 text-farm-950 shadow'
                : 'bg-farm-700/70 text-farm-100 hover:bg-farm-700'
            }`}
            title={t.allFarmsSummary}
          >
            <BarChart2 className="w-4 h-4" />
          </button>

          {/* Language Toggle Button */}
          <button
            onClick={toggleLanguage}
            className="px-2 py-1.5 rounded-xl bg-farm-900/70 hover:bg-farm-900 border border-farm-600 text-xs font-bold flex items-center space-x-1 shadow-sm transition-all"
            title="Switch Language / भाषा बदला"
          >
            <Globe className="w-3.5 h-3.5 text-amber-300" />
            <span>{language === 'mr' ? 'मराठी' : 'EN'}</span>
          </button>

          {/* App Lock Icon indicator */}
          {settings?.appLockEnabled && (
            <div className="p-1.5 bg-amber-500/20 text-amber-300 rounded-lg" title="App Lock Active">
              <Lock className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
