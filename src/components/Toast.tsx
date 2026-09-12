import React from 'react';
import { useFarm } from '../context/FarmContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useFarm();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-16 right-4 left-4 sm:left-auto sm:w-80 z-50 flex flex-col space-y-2 pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-2xl shadow-xl border backdrop-blur-md transition-all transform animate-bounce-short ${
            toast.type === 'success'
              ? 'bg-farm-900/95 border-farm-600 text-white'
              : toast.type === 'error'
              ? 'bg-red-900/95 border-red-600 text-white'
              : 'bg-amber-900/95 border-amber-600 text-white'
          }`}
        >
          <div className="flex items-center space-x-2.5">
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-amber-400 shrink-0" />}
            <span className="text-xs sm:text-sm font-semibold">{toast.text}</span>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="p-1 hover:bg-white/20 rounded-full transition-all text-white/80"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
