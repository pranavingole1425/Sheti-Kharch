import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext';
import { ExpenseHistory } from './ExpenseHistory';
import { CropManager } from './CropManager';
import { calculateFarmTotals } from '../utils/calculations';
import { categoryLabels } from '../i18n/translations';
import { formatFarmSummaryShareText } from '../utils/shareUtils';
import {
  Plus,
  History,
  BarChart3,
  Sprout,
  Edit,
  Trash2,
  Archive,
  ArrowLeft,
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
  Layers,
  FileText,
  Share2
} from 'lucide-react';

export const FarmDashboard: React.FC = () => {
  const {
    selectedFarm,
    setSelectedFarmId,
    selectedFarmTotals,
    expenses,
    crops,
    setIsExpenseFormOpen,
    setEditingExpense,
    setIsFarmFormOpen,
    setEditingFarm,
    deleteFarm,
    archiveFarm,
    setActiveTab,
    farmerProfile,
    openShareModal,
    language,
    t
  } = useFarm();

  const [activeSubView, setActiveSubView] = useState<'overview' | 'history' | 'crops'>('overview');
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  if (!selectedFarm || !selectedFarmTotals) return null;

  const farmExpenses = expenses.filter(e => e.farmId === selectedFarm.id);
  const farmCrops = crops.filter(c => c.farmId === selectedFarm.id);
  const currentCrop = farmCrops.length > 0 ? farmCrops[0] : null;

  const handleDeleteConfirm = async () => {
    await deleteFarm(selectedFarm.id!);
    setShowDeleteModal(false);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* 45. PROMINENT FARM HEADER BANNER */}
      <div className="bg-gradient-to-r from-farm-900 via-farm-800 to-farm-900 text-white rounded-3xl p-5 shadow-xl border border-farm-700/80 relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => setSelectedFarmId(null)}
            className="flex items-center space-x-1 bg-farm-950/60 hover:bg-farm-950 px-3 py-1.5 rounded-xl text-xs font-bold transition-all text-amber-300"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.back}</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                const text = formatFarmSummaryShareText(selectedFarm, selectedFarmTotals, farmerProfile, language);
                openShareModal({
                  title: `${t.shareSummary} - ${selectedFarm.name}`,
                  text
                });
              }}
              className="p-2 bg-amber-400 hover:bg-amber-300 text-farm-950 rounded-xl text-xs font-bold flex items-center space-x-1 shadow"
              title={t.shareSummary}
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">{t.share}</span>
            </button>
            <button
              onClick={() => {
                setEditingFarm(selectedFarm);
                setIsFarmFormOpen(true);
              }}
              className="p-2 bg-farm-700/70 hover:bg-farm-700 rounded-xl text-xs text-white"
              title={t.editFarm}
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="p-2 bg-red-900/60 hover:bg-red-800 rounded-xl text-xs text-white"
              title={t.deleteFarm}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="mt-2">
          <div className="inline-flex items-center space-x-2 bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-extrabold px-3 py-1 rounded-full mb-1">
            <span>🌱 {t.farmContextSelected}:</span>
            <span className="uppercase tracking-wider">{selectedFarm.name}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {selectedFarm.name}
          </h1>

          <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-farm-100/90 font-medium">
            <span className="bg-farm-950/70 px-2.5 py-1 rounded-lg">
              📏 {selectedFarm.area} {selectedFarm.unit}
            </span>
            {currentCrop && (
              <span className="bg-farm-950/70 px-2.5 py-1 rounded-lg">
                🌾 {currentCrop.cropName}
              </span>
            )}
            <span className="bg-farm-950/70 px-2.5 py-1 rounded-lg">
              🗓️ {selectedFarm.currentSeason}
            </span>
          </div>
        </div>
      </div>

      {/* 4. FINANCIAL METRICS DASHBOARD CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Total Investment Card (Requirement #4, #8, #39 - STRICTLY FOR THIS FARM ONLY) */}
        <div className="bg-gradient-to-br from-farm-800 to-farm-900 text-white rounded-3xl p-4 shadow-md col-span-2 sm:col-span-2">
          <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider block">
            {t.totalInvestment} ({selectedFarm.name})
          </span>
          <p className="text-3xl sm:text-4xl font-black mt-1 text-white tracking-tight">
            ₹{selectedFarmTotals.totalInvestment.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-farm-200 mt-1">
            Cost per {selectedFarm.unit}: <strong className="text-amber-300">₹{Math.round(selectedFarmTotals.costPerAcre).toLocaleString('en-IN')}</strong>
          </p>
        </div>

        {/* This Month */}
        <div className="bg-white rounded-2xl p-3.5 border border-gray-200 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-gray-500">
            {t.thisMonth}
          </span>
          <p className="text-xl font-black text-gray-900 mt-1">
            ₹{selectedFarmTotals.thisMonthInvestment.toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] text-emerald-600 font-semibold">Monthly Total</span>
        </div>

        {/* Total Expenses Count */}
        <div className="bg-white rounded-2xl p-3.5 border border-gray-200 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-gray-500">
            {t.totalExpenses}
          </span>
          <p className="text-xl font-black text-gray-900 mt-1">
            {selectedFarmTotals.expenseCount}
          </p>
          <span className="text-[10px] text-gray-500">Records</span>
        </div>
      </div>

      {/* Action Bar Buttons */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => {
            setEditingExpense(null);
            setIsExpenseFormOpen(true);
          }}
          className="bg-amber-400 hover:bg-amber-300 text-farm-950 font-black px-4 py-3 rounded-2xl shadow-md flex items-center space-x-1.5 text-xs shrink-0 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{t.addExpense}</span>
        </button>

        <button
          onClick={() => setActiveSubView('overview')}
          className={`px-3.5 py-3 rounded-2xl font-extrabold text-xs flex items-center space-x-1 shrink-0 transition-all ${
            activeSubView === 'overview'
              ? 'bg-farm-800 text-white shadow'
              : 'bg-white text-gray-700 border border-gray-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Overview</span>
        </button>

        <button
          onClick={() => setActiveSubView('history')}
          className={`px-3.5 py-3 rounded-2xl font-extrabold text-xs flex items-center space-x-1 shrink-0 transition-all ${
            activeSubView === 'history'
              ? 'bg-farm-800 text-white shadow'
              : 'bg-white text-gray-700 border border-gray-200'
          }`}
        >
          <History className="w-4 h-4" />
          <span>{t.expenseHistory} ({farmExpenses.length})</span>
        </button>

        <button
          onClick={() => setActiveSubView('crops')}
          className={`px-3.5 py-3 rounded-2xl font-extrabold text-xs flex items-center space-x-1 shrink-0 transition-all ${
            activeSubView === 'crops'
              ? 'bg-farm-800 text-white shadow'
              : 'bg-white text-gray-700 border border-gray-200'
          }`}
        >
          <Sprout className="w-4 h-4" />
          <span>{t.cropsSeasons}</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className="px-3.5 py-3 rounded-2xl font-extrabold text-xs bg-white text-farm-800 border border-farm-200 flex items-center space-x-1 shrink-0 shadow-sm"
        >
          <BarChart3 className="w-4 h-4 text-amber-500" />
          <span>{t.reports}</span>
        </button>
      </div>

      {/* SUBVIEW CONTENT */}
      {activeSubView === 'overview' && (
        <div className="space-y-4">
          {/* Category Wise Breakdown for this farm */}
          <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm">
            <h3 className="text-base font-black text-gray-900 mb-3 flex items-center space-x-2">
              <span>📊 Category Wise Expenses</span>
              <span className="text-xs font-normal text-gray-500">({selectedFarm.name})</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {(Object.keys(selectedFarmTotals.categoryBreakdown) as (keyof typeof selectedFarmTotals.categoryBreakdown)[])
                .filter(cat => selectedFarmTotals.categoryBreakdown[cat] > 0)
                .map(cat => {
                  const catObj = categoryLabels[cat];
                  const amt = selectedFarmTotals.categoryBreakdown[cat];
                  const pct = Math.round((amt / (selectedFarmTotals.totalInvestment || 1)) * 100);

                  return (
                    <div
                      key={cat}
                      className="bg-gray-50 rounded-2xl p-3 border border-gray-100 flex flex-col justify-between"
                    >
                      <div className="flex items-center space-x-1.5 text-xs font-bold text-gray-800 mb-1">
                        <span>{catObj.icon}</span>
                        <span className="truncate">{catObj.en}</span>
                      </div>
                      <div>
                        <p className="text-base font-black text-farm-900">
                          ₹{amt.toLocaleString('en-IN')}
                        </p>
                        <span className="text-[10px] text-gray-500 font-semibold">{pct}% of total</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* 23. EXPENSE TIMELINE / STAGE FLOW */}
          <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm">
            <h3 className="text-base font-black text-gray-900 mb-3 flex items-center space-x-2">
              <Clock className="w-4 h-4 text-farm-700" />
              <span>{t.expenseTimeline}</span>
            </h3>

            <div className="flex flex-wrap gap-2">
              {[
                { stage: t.stageLandPrep, icon: '🌱' },
                { stage: t.stageSeeds, icon: '🌾' },
                { stage: t.stagePlanting, icon: '🌱' },
                { stage: t.stagePesticide, icon: '💊' },
                { stage: t.stageFertilizer, icon: '🌱' },
                { stage: t.stageIrrigation, icon: '💧' },
                { stage: t.stageLabour, icon: '👷' },
                { stage: t.stageHarvesting, icon: '🌾' }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-farm-50 border border-farm-200 text-farm-900 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center space-x-1 shadow-sm"
                >
                  <span>{item.icon}</span>
                  <span>{item.stage}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Expense History Preview */}
          <ExpenseHistory farmId={selectedFarm.id} limit={5} />
        </div>
      )}

      {activeSubView === 'history' && (
        <ExpenseHistory farmId={selectedFarm.id} />
      )}

      {activeSubView === 'crops' && (
        <CropManager farmId={selectedFarm.id!} farmArea={selectedFarm.area} />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <Trash2 className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-lg font-black text-gray-900">
                {t.deleteFarmConfirm}
              </h3>
              <p className="text-xs text-gray-600 mt-1">
                {t.deleteFarmSubConfirm}
              </p>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 rounded-2xl text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-2xl text-xs shadow-md"
              >
                Delete Farm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
