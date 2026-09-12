import React from 'react';
import { useFarm } from '../context/FarmContext';
import { Home, PlusCircle, BarChart3, Settings } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, setSelectedFarmId, setIsExpenseFormOpen, t } = useFarm();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-30 pb-safe">
      <div className="max-w-4xl mx-auto flex items-center justify-around py-1.5 px-2">
        {/* Farms Tab */}
        <button
          onClick={() => {
            setSelectedFarmId(null);
            setActiveTab('farms');
          }}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
            activeTab === 'farms'
              ? 'text-farm-700 font-extrabold scale-105'
              : 'text-gray-500 font-medium hover:text-farm-600'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] leading-none">{t.navFarms}</span>
        </button>

        {/* Global Add Expense Button */}
        <button
          onClick={() => {
            setIsExpenseFormOpen(true);
          }}
          className="flex flex-col items-center justify-center -mt-5 bg-gradient-to-tr from-farm-700 to-farm-500 text-white p-3 rounded-full shadow-lg border-4 border-white active:scale-95 transition-all"
          title={t.addExpense}
        >
          <PlusCircle className="w-6 h-6" />
          <span className="sr-only">{t.addExpense}</span>
        </button>

        {/* Reports Tab */}
        <button
          onClick={() => {
            setActiveTab('reports');
          }}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
            activeTab === 'reports'
              ? 'text-farm-700 font-extrabold scale-105'
              : 'text-gray-500 font-medium hover:text-farm-600'
          }`}
        >
          <BarChart3 className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] leading-none">{t.navReports}</span>
        </button>

        {/* Settings Tab */}
        <button
          onClick={() => {
            setActiveTab('settings');
          }}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
            activeTab === 'settings'
              ? 'text-farm-700 font-extrabold scale-105'
              : 'text-gray-500 font-medium hover:text-farm-600'
          }`}
        >
          <Settings className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] leading-none">{t.navSettings}</span>
        </button>
      </div>
    </nav>
  );
};
