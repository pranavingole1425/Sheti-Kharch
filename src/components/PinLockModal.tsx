import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext';
import { Lock, KeyRound } from 'lucide-react';

export const PinLockModal: React.FC = () => {
  const { isLocked, unlockApp, t } = useFarm();
  const [pin, setPin] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isLocked) return null;

  const handleNumClick = async (num: string) => {
    if (pin.length >= 4) return;
    const newPin = pin + num;
    setPin(newPin);
    setErrorMsg('');

    if (newPin.length === 4) {
      const ok = await unlockApp(newPin);
      if (!ok) {
        setErrorMsg(t.wrongPin);
        setPin('');
      }
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 bg-farm-950/95 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 w-full max-w-xs shadow-2xl text-center">
        <div className="w-16 h-16 bg-farm-100 rounded-full flex items-center justify-center mx-auto mb-4 text-farm-800 shadow-inner">
          <Lock className="w-8 h-8" />
        </div>

        <h2 className="text-xl font-black text-gray-900 mb-1">{t.appLock}</h2>
        <p className="text-xs text-gray-600 mb-6">{t.enterPin}</p>

        {/* PIN Dots */}
        <div className="flex justify-center space-x-4 mb-6">
          {[0, 1, 2, 3].map(index => (
            <div
              key={index}
              className={`w-4 h-4 rounded-full border-2 transition-all ${
                index < pin.length
                  ? 'bg-farm-700 border-farm-700 scale-110 shadow'
                  : 'border-gray-300 bg-gray-100'
              }`}
            />
          ))}
        </div>

        {errorMsg && (
          <p className="text-xs font-bold text-red-600 mb-4 animate-shake">
            {errorMsg}
          </p>
        )}

        {/* Large Touchable Numpad */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
            <button
              key={num}
              onClick={() => handleNumClick(num)}
              className="w-16 h-14 bg-gray-100 hover:bg-farm-100 text-gray-900 font-extrabold text-xl rounded-2xl flex items-center justify-center mx-auto shadow-sm active:scale-95 transition-all"
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => setPin('')}
            className="w-16 h-14 bg-gray-200 text-gray-700 font-bold text-xs rounded-2xl flex items-center justify-center mx-auto active:scale-95"
          >
            Clear
          </button>
          <button
            onClick={() => handleNumClick('0')}
            className="w-16 h-14 bg-gray-100 hover:bg-farm-100 text-gray-900 font-extrabold text-xl rounded-2xl flex items-center justify-center mx-auto shadow-sm active:scale-95"
          >
            0
          </button>
          <button
            onClick={handleBackspace}
            className="w-16 h-14 bg-amber-100 text-amber-900 font-bold text-sm rounded-2xl flex items-center justify-center mx-auto active:scale-95"
          >
            ⌫
          </button>
        </div>
      </div>
    </div>
  );
};
