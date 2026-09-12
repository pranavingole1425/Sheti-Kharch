import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext';
import { calculateFarmTotals } from '../utils/calculations';
import { AnalyticsCharts } from './AnalyticsCharts';
import {
  Sprout,
  Plus,
  Archive,
  ChevronRight,
  BarChart3,
  MapPin,
  TrendingUp,
  DollarSign,
  PlusCircle,
  Clock,
  Sparkles,
  PieChart,
  FileText
} from 'lucide-react';
import { categoryLabels } from '../i18n/translations';

export const FarmList: React.FC = () => {
  const {
    activeFarms,
    archivedFarms,
    expenses,
    setSelectedFarmId,
    setIsFarmFormOpen,
    setEditingFarm,
    setIsExpenseFormOpen,
    setEditingExpense,
    setActiveTab,
    allFarmsSummary,
    t
  } = useFarm();

  const [showArchived, setShowArchived] = useState<boolean>(false);
  const [showCharts, setShowCharts] = useState<boolean>(false);

  const displayFarms = showArchived ? archivedFarms : activeFarms;

  // Highest expense category insight
  const sortedCategories = (Object.keys(allFarmsSummary.categoryTotals) as (keyof typeof allFarmsSummary.categoryTotals)[])
    .filter(cat => allFarmsSummary.categoryTotals[cat] > 0)
    .sort((a, b) => allFarmsSummary.categoryTotals[b] - allFarmsSummary.categoryTotals[a]);

  const topCategory = sortedCategories[0];
  const topCategoryAmount = topCategory ? allFarmsSummary.categoryTotals[topCategory] : 0;
  const topCategoryPct = topCategory ? Math.round((topCategoryAmount / (allFarmsSummary.totalInvestment || 1)) * 100) : 0;

  // Max investment for relative progress bars
  const maxInvestment = Math.max(...activeFarms.map(f => calculateFarmTotals(f, expenses).totalInvestment), 1);

  // Recent 3 expenses across all farms
  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  const farmsMap = new Map(activeFarms.map(f => [f.id!, f]));

  return (
    <div className="space-y-4 pb-20">
      {/* 1. EFFECTIVE DASHBOARD HEADER BANNER */}
      <div className="bg-gradient-to-r from-farm-900 via-farm-800 to-farm-900 text-white rounded-3xl p-5 shadow-xl border border-farm-700/80 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center space-x-1.5 bg-amber-400/20 text-amber-300 text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider mb-1.5 border border-amber-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart Farming Diary</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              🌾 {t.myFarms}
            </h2>
            <p className="text-xs text-farm-100/90 mt-0.5 font-medium">
              {activeFarms.length} Active Fields • {allFarmsSummary.totalArea} Acres Total Cultivated Land
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setEditingFarm(null);
                setIsFarmFormOpen(true);
              }}
              className="bg-amber-400 hover:bg-amber-300 active:scale-95 text-farm-950 font-black px-4 py-3 rounded-2xl shadow-lg flex items-center space-x-1.5 text-xs sm:text-sm transition-all"
            >
              <Plus className="w-5 h-5" />
              <span>{t.addFarm}</span>
            </button>
          </div>
        </div>

        {/* Quick Insight Strip inside Header */}
        {topCategory && (
          <div className="mt-4 pt-3 border-t border-farm-700/60 flex flex-wrap items-center justify-between gap-2 text-xs text-farm-100">
            <div className="flex items-center space-x-2">
              <span className="text-amber-300 font-bold">💡 Top Expense:</span>
              <span className="font-semibold bg-farm-950/60 px-2.5 py-0.5 rounded-lg border border-farm-700">
                {categoryLabels[topCategory].icon} {categoryLabels[topCategory].en} — ₹{topCategoryAmount.toLocaleString('en-IN')} ({topCategoryPct}%)
              </span>
            </div>
            <span className="text-[11px] text-farm-200">
              Avg Cost/Acre: <strong className="text-amber-300">₹{Math.round(allFarmsSummary.totalInvestment / (allFarmsSummary.totalArea || 1)).toLocaleString('en-IN')}</strong>
            </span>
          </div>
        )}
      </div>

      {/* 2. KEY METRICS DASHBOARD CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Total Farms */}
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-gray-500 block">Total Fields</span>
          <div className="flex items-baseline space-x-1 mt-1">
            <span className="text-2xl font-black text-farm-900">{allFarmsSummary.totalFarms}</span>
            <span className="text-xs text-gray-500 font-medium">farms</span>
          </div>
          <span className="text-[10px] text-farm-700 font-semibold">{allFarmsSummary.totalArea} Acres</span>
        </div>

        {/* Total Expenses Count */}
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-gray-500 block">{t.totalExpenses}</span>
          <div className="flex items-baseline space-x-1 mt-1">
            <span className="text-2xl font-black text-farm-900">{allFarmsSummary.totalExpensesCount}</span>
            <span className="text-xs text-gray-500 font-medium">records</span>
          </div>
          <span className="text-[10px] text-gray-500">Farm-wise isolated</span>
        </div>

        {/* Combined Investment Card */}
        <div className="bg-gradient-to-br from-farm-800 to-farm-900 text-white rounded-2xl p-4 shadow-md col-span-2 flex justify-between items-center">
          <div>
            <span className="text-[10px] uppercase font-bold text-amber-300 block">{t.allFarmsSummary}</span>
            <p className="text-2xl sm:text-3xl font-black mt-0.5 text-white tracking-tight">
              ₹{allFarmsSummary.totalInvestment.toLocaleString('en-IN')}
            </p>
            <span className="text-[10px] text-farm-200">Across all active fields</span>
          </div>

          <button
            onClick={() => setActiveTab('all_summary')}
            className="bg-amber-400 hover:bg-amber-300 text-farm-950 font-black px-3 py-2 rounded-xl text-xs flex items-center space-x-1 shadow transition-all active:scale-95 shrink-0"
          >
            <span>{t.reports}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Action Buttons Toolbar */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => {
            setEditingExpense(null);
            setIsExpenseFormOpen(true);
          }}
          className="bg-amber-400 hover:bg-amber-300 text-farm-950 font-black px-4 py-2.5 rounded-2xl shadow-md flex items-center space-x-1.5 text-xs shrink-0 active:scale-95 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{t.addExpense}</span>
        </button>

        <button
          onClick={() => setShowCharts(!showCharts)}
          className={`px-3.5 py-2.5 rounded-2xl font-extrabold text-xs flex items-center space-x-1.5 shrink-0 transition-all ${
            showCharts ? 'bg-farm-800 text-white shadow' : 'bg-white text-gray-700 border border-gray-200'
          }`}
        >
          <PieChart className="w-4 h-4" />
          <span>{showCharts ? 'Hide Visual Analytics' : 'Show Visual Analytics'}</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className="px-3.5 py-2.5 rounded-2xl font-extrabold text-xs bg-white text-farm-800 border border-farm-200 flex items-center space-x-1.5 shrink-0 shadow-sm"
        >
          <FileText className="w-4 h-4 text-amber-500" />
          <span>PDF / CSV Reports</span>
        </button>

        {archivedFarms.length > 0 && (
          <button
            onClick={() => setShowArchived(!showArchived)}
            className="px-3.5 py-2.5 rounded-2xl font-bold text-xs bg-farm-50 text-farm-800 border border-farm-200 flex items-center space-x-1 shrink-0"
          >
            <Archive className="w-3.5 h-3.5" />
            <span>{showArchived ? t.activeFarms : `${t.archivedFarms} (${archivedFarms.length})`}</span>
          </button>
        )}
      </div>

      {/* Optional Embedded Visual Analytics Section */}
      {showCharts && (
        <div className="animate-fadeIn">
          <AnalyticsCharts />
        </div>
      )}

      {/* 3. FARM CARDS GRID (EFFECTIVE FARM-WISE CARDS) */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base font-black text-gray-900 flex items-center space-x-2">
            <span>🌱 Farm Wise Dashboards</span>
            <span className="text-xs font-normal text-gray-500">({displayFarms.length})</span>
          </h3>
          <span className="text-[11px] font-semibold text-gray-500">Select a farm card to manage</span>
        </div>

        {displayFarms.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-dashed border-gray-300 my-4">
            <div className="w-16 h-16 bg-farm-50 text-farm-700 rounded-full flex items-center justify-center mx-auto mb-3">
              <Sprout className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-gray-800 mb-1">{t.noFarmsFound}</h3>
            <p className="text-xs text-gray-500 mb-4">{t.addFirstFarm}</p>
            <button
              onClick={() => {
                setEditingFarm(null);
                setIsFarmFormOpen(true);
              }}
              className="bg-farm-700 hover:bg-farm-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs inline-flex items-center space-x-1.5 shadow"
            >
              <Plus className="w-4 h-4" />
              <span>{t.addFarm}</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {displayFarms.map(farm => {
              const totals = calculateFarmTotals(farm, expenses);
              const progressPct = Math.max(Math.round((totals.totalInvestment / maxInvestment) * 100), 5);

              return (
                <div
                  key={farm.id}
                  className="bg-white rounded-3xl p-5 border border-gray-200/90 shadow-md hover:shadow-xl hover:border-farm-400 transition-all cursor-pointer relative overflow-hidden group space-y-3 active:scale-[0.99]"
                >
                  {/* Top Header Row */}
                  <div className="flex items-start justify-between">
                    <div
                      onClick={() => setSelectedFarmId(farm.id!)}
                      className="flex items-center space-x-3 min-w-0"
                    >
                      <div className="w-12 h-12 bg-farm-100 text-farm-800 rounded-2xl flex items-center justify-center font-extrabold text-2xl shadow-inner group-hover:bg-farm-600 group-hover:text-white transition-all shrink-0">
                        🌱
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-lg font-black text-gray-900 group-hover:text-farm-800 transition-all truncate">
                          {farm.name}
                        </h3>
                        <div className="flex items-center space-x-2 text-xs text-gray-600 font-medium">
                          <span>{farm.area} {farm.unit}</span>
                          <span>•</span>
                          <span className="text-farm-700 font-semibold">{farm.currentSeason}</span>
                        </div>
                      </div>
                    </div>

                    {/* Direct +Add Expense button on Farm Card */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFarmId(farm.id!);
                        setEditingExpense(null);
                        setIsExpenseFormOpen(true);
                      }}
                      className="p-2 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl text-xs font-bold flex items-center space-x-1 shrink-0 shadow-sm active:scale-95 transition-all"
                      title={`Add expense for ${farm.name}`}
                    >
                      <Plus className="w-4 h-4 text-amber-700" />
                      <span className="text-[11px]">{t.addExpense}</span>
                    </button>
                  </div>

                  {/* Investment Progress Bar */}
                  <div className="space-y-1">
                    <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-farm-600 to-amber-500 rounded-full transition-all duration-500"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Financial Metrics Summary Pill */}
                  <div
                    onClick={() => setSelectedFarmId(farm.id!)}
                    className="bg-farm-50/90 rounded-2xl p-3 border border-farm-100 flex items-center justify-between"
                  >
                    <div>
                      <span className="text-[10px] uppercase font-bold text-farm-700 tracking-wider">
                        {t.totalInvestment}
                      </span>
                      <p className="text-xl font-black text-farm-900">
                        ₹{totals.totalInvestment.toLocaleString('en-IN')}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-gray-500 block font-medium">
                        {totals.expenseCount} {t.totalExpenses}
                      </span>
                      <span className="text-xs font-extrabold text-emerald-800">
                        ₹{Math.round(totals.costPerAcre).toLocaleString('en-IN')} /{farm.unit}
                      </span>
                    </div>
                  </div>

                  {/* Card Footer Link */}
                  <div
                    onClick={() => setSelectedFarmId(farm.id!)}
                    className="flex items-center justify-between text-xs font-bold text-farm-700 pt-0.5"
                  >
                    <span className="text-[11px] font-semibold text-gray-500">
                      Isolated Farm Dashboard
                    </span>
                    <div className="flex items-center text-farm-700 group-hover:translate-x-1 transition-all">
                      <span>Open Dashboard</span>
                      <ChevronRight className="w-4 h-4 ml-0.5" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. RECENT ACTIVITY STREAM (EFFECTIVE DASHBOARD RECENT EXPENSES) */}
      {recentExpenses.length > 0 && (
        <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-gray-900 flex items-center space-x-2">
              <Clock className="w-4 h-4 text-farm-700" />
              <span>Recent Expense Activity</span>
            </h3>
            <button
              onClick={() => setActiveTab('reports')}
              className="text-xs font-bold text-farm-700 hover:text-farm-800"
            >
              View All History ➔
            </button>
          </div>

          <div className="space-y-2">
            {recentExpenses.map(exp => {
              const farm = farmsMap.get(exp.farmId);
              const catObj = categoryLabels[exp.category];

              return (
                <div
                  key={exp.id}
                  onClick={() => {
                    if (farm) setSelectedFarmId(farm.id!);
                  }}
                  className="bg-gray-50 hover:bg-farm-50 border border-gray-100 hover:border-farm-300 rounded-2xl p-3 flex items-center justify-between cursor-pointer transition-all"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <span className="text-xl">{catObj.icon}</span>
                    <div className="min-w-0">
                      <p className="text-xs font-black text-gray-900 truncate">
                        {exp.productName}
                      </p>
                      <p className="text-[11px] text-gray-500">
                        🌱 {farm ? farm.name : 'Farm'} • 🗓️ {exp.date}
                      </p>
                    </div>
                  </div>

                  <span className="text-sm font-black text-farm-900 shrink-0">
                    ₹{exp.amount.toLocaleString('en-IN')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
