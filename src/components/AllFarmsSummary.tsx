import React from 'react';
import { useFarm } from '../context/FarmContext';
import { categoryLabels } from '../i18n/translations';
import { formatAllFarmsSummaryShareText } from '../utils/shareUtils';
import { BarChart3, Sprout, Map, ChevronRight, Layers, Share2 } from 'lucide-react';

export const AllFarmsSummary: React.FC = () => {
  const {
    allFarmsSummary,
    setSelectedFarmId,
    setActiveTab,
    farmerProfile,
    openShareModal,
    language,
    t
  } = useFarm();

  const handleShareCombined = () => {
    const text = formatAllFarmsSummaryShareText(allFarmsSummary, farmerProfile, language);
    openShareModal({
      title: t.allFarmsSummary,
      text
    });
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-farm-800 to-farm-900 text-white rounded-3xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="bg-amber-400 text-farm-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Combined View
            </span>
            <span className="text-xs text-amber-200 font-semibold">
              {allFarmsSummary.totalFarms} Active Farms
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            📊 {t.allFarmsSummary}
          </h2>
          <p className="text-xs text-farm-100/90 mt-0.5">
            Comprehensive financial insights across all fields
          </p>
        </div>

        <button
          onClick={handleShareCombined}
          className="bg-amber-400 hover:bg-amber-300 text-farm-950 font-black px-4 py-2.5 rounded-2xl shadow-md flex items-center space-x-1.5 text-xs active:scale-95 transition-all self-start sm:self-auto"
        >
          <Share2 className="w-4 h-4" />
          <span>{t.shareSummary}</span>
        </button>
      </div>

      {/* Top 4 Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-gray-500 block">Total Farms</span>
          <p className="text-2xl font-black text-farm-900 mt-1">{allFarmsSummary.totalFarms}</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-gray-500 block">Total Land</span>
          <p className="text-2xl font-black text-farm-900 mt-1">{allFarmsSummary.totalArea} Acres</p>
        </div>

        <div className="bg-gradient-to-br from-farm-800 to-farm-900 text-white rounded-2xl p-4 shadow-md col-span-2">
          <span className="text-[10px] uppercase font-bold text-amber-300 block">Combined Total Investment</span>
          <p className="text-2xl sm:text-3xl font-black mt-0.5 text-white">
            ₹{allFarmsSummary.totalInvestment.toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      {/* Farm Comparison Breakdown List */}
      <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm space-y-3">
        <h3 className="text-base font-black text-gray-900 flex items-center justify-between">
          <span>🌱 Farm Investment Comparison</span>
          <span className="text-xs font-normal text-gray-500">Tap farm to open isolated dashboard</span>
        </h3>

        <div className="space-y-2.5">
          {allFarmsSummary.farmBreakdown.map(fb => {
            const pct = Math.round((fb.totalInvestment / (allFarmsSummary.totalInvestment || 1)) * 100);

            return (
              <div
                key={fb.farmId}
                onClick={() => {
                  setSelectedFarmId(fb.farmId);
                  setActiveTab('farms');
                }}
                className="bg-gray-50 hover:bg-farm-50 border border-gray-200 hover:border-farm-400 rounded-2xl p-3.5 transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-farm-100 text-farm-800 rounded-xl flex items-center justify-center font-bold text-lg">
                    🌱
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-gray-900 group-hover:text-farm-800">
                      {fb.farmName}
                    </h4>
                    <span className="text-[11px] text-gray-500 font-medium">
                      {fb.area} {fb.unit} • {fb.expenseCount} expenses
                    </span>
                  </div>
                </div>

                <div className="text-right flex items-center space-x-2">
                  <div>
                    <p className="text-base font-black text-farm-900">
                      ₹{fb.totalInvestment.toLocaleString('en-IN')}
                    </p>
                    <span className="text-[10px] text-gray-500 font-semibold">{pct}% of total</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Combined Category Totals */}
      <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm space-y-3">
        <h3 className="text-base font-black text-gray-900">
          📦 Category Breakdown Across All Farms
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {(Object.keys(allFarmsSummary.categoryTotals) as (keyof typeof allFarmsSummary.categoryTotals)[])
            .filter(cat => allFarmsSummary.categoryTotals[cat] > 0)
            .map(cat => {
              const catObj = categoryLabels[cat];
              const amt = allFarmsSummary.categoryTotals[cat];
              const pct = Math.round((amt / (allFarmsSummary.totalInvestment || 1)) * 100);

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
                    <span className="text-[10px] text-gray-500 font-semibold">{pct}%</span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};
