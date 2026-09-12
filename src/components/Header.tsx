import React, { useState, useEffect } from 'react';
import { useFarm } from '../context/FarmContext';
import { formatAppShareText } from '../utils/shareUtils';
import { Globe, ArrowLeft, Lock, BarChart2, Download, Smartphone, Share2, User, UserCheck } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    t,
    language,
    setLanguage,
    selectedFarm,
    setSelectedFarmId,
    activeTab,
    setActiveTab,
    settings,
    farmerProfile,
    setIsFarmerLoginOpen,
    openShareModal
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

  const handleShareApp = () => {
    const shareText = formatAppShareText(language);
    openShareModal({
      title: t.shareApp,
      text: shareText
    });
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
          {/* Farmer Login Badge */}
          <button
            onClick={() => setIsFarmerLoginOpen(true)}
            className={`px-2.5 py-1.5 rounded-xl font-bold text-xs flex items-center space-x-1 shadow-sm transition-all active:scale-95 ${
              farmerProfile?.isLoggedIn && farmerProfile.name
                ? 'bg-amber-400 text-farm-950 font-black'
                : 'bg-farm-700/80 hover:bg-farm-700 text-amber-300 border border-amber-400/40'
            }`}
            title={t.farmerLogin}
          >
            {farmerProfile?.isLoggedIn && farmerProfile.name ? (
              <>
                <UserCheck className="w-3.5 h-3.5 text-emerald-800" />
                <span className="max-w-[70px] sm:max-w-[100px] truncate">{farmerProfile.name}</span>
              </>
            ) : (
              <>
                <User className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.loginAsFarmer}</span>
                <span className="sm:hidden">Login</span>
              </>
            )}
          </button>

          {/* Share App Button */}
          <button
            onClick={handleShareApp}
            className="p-1.5 sm:p-2 rounded-xl bg-farm-700/70 hover:bg-farm-700 text-amber-300 text-xs font-bold flex items-center space-x-1 shadow-sm transition-all active:scale-95"
            title={t.shareApp}
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Download Project Docx Guide Button */}
          <a
            href="/HOW_TO_RUN_THIS_PROJECT.docx"
            download="HOW_TO_RUN_THIS_PROJECT.docx"
            className="px-2 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-farm-950 font-extrabold text-[11px] sm:text-xs flex items-center space-x-1 shadow-sm transition-all active:scale-95 hidden lg:flex"
            title="Download User & Setup Guide (.docx)"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Guide</span>
          </a>

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

