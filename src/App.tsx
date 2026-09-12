import React from 'react';
import { FarmProvider, useFarm } from './context/FarmContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { ToastContainer } from './components/Toast';
import { PinLockModal } from './components/PinLockModal';
import { FarmList } from './components/FarmList';
import { FarmDashboard } from './components/FarmDashboard';
import { FarmFormModal } from './components/FarmFormModal';
import { ExpenseFormModal } from './components/ExpenseFormModal';
import { AllFarmsSummary } from './components/AllFarmsSummary';
import { ReportsExporter } from './components/ReportsExporter';
import { SettingsView } from './components/SettingsView';

const MainContent: React.FC = () => {
  const { selectedFarm, activeTab } = useFarm();

  return (
    <main className="max-w-4xl mx-auto px-4 py-4 min-h-[calc(100vh-120px)]">
      {/* Dynamic View Router */}
      {selectedFarm ? (
        <FarmDashboard />
      ) : activeTab === 'farms' ? (
        <FarmList />
      ) : activeTab === 'all_summary' ? (
        <AllFarmsSummary />
      ) : activeTab === 'reports' ? (
        <ReportsExporter />
      ) : activeTab === 'settings' ? (
        <SettingsView />
      ) : (
        <FarmList />
      )}
    </main>
  );
};

export function App() {
  return (
    <FarmProvider>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50/50 via-gray-50 to-amber-50/30 font-sans text-gray-900 selection:bg-farm-600 selection:text-white antialiased">
        <Header />
        <MainContent />
        <BottomNav />

        {/* Global Modals & Overlays */}
        <FarmFormModal />
        <ExpenseFormModal />
        <PinLockModal />
        <ToastContainer />
      </div>
    </FarmProvider>
  );
}

export default App;
