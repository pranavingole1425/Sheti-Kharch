import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext';
import { calculateFarmTotals } from '../utils/calculations';
import { Sprout, Plus, Archive, ChevronRight, BarChart3, MapPin, Layers } from 'lucide-react';

export const FarmList: React.FC = () => {
  const {
    activeFarms,
    archivedFarms,
    expenses,
    setSelectedFarmId,
    setIsFarmFormOpen,
    setEditingFarm,
    setActiveTab,
    allFarmsSummary,
    t
  } = useFarm();

  const [showArchived, setShowArchived] = useState<boolean>(false);

  const displayFarms = showArchived ? archivedFarms : activeFarms;

  return (
    <div className="space-y-4 pb-20">
      {/* Header Banner & Title */}
      <div className="bg-gradient-to-r from-farm-800 to-farm-700 text-white rounded-3xl p-5 shadow-lg flex items-center justify-between">
        <div>
          <span className="bg-amber-400 text-farm-950 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-1 inline-block">
            {t.myFarms}
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            🌾 {t.myFarms}
          </h2>
          <p className="text-xs text-farm-100/90 mt-0.5">
            {activeFarms.length} {showArchived ? t.archivedFarms : t.activeFarms} • {allFarmsSummary.totalArea} Acres Total
          </p>
        </div>

        <button
          onClick={() => {
            setEditingFarm(null);
            setIsFarmFormOpen(true);
          }}
          className="bg-amber-400 hover:bg-amber-300 active:scale-95 text-farm-950 font-black px-4 py-3 rounded-2xl shadow-md flex items-center space-x-1 text-xs sm:text-sm transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>{t.addFarm}</span>
        </button>
      </div>

      {/* Combined Quick Summary Banner */}
      <div
        onClick={() => setActiveTab('all_summary')}
        className="bg-gradient-to-r from-amber-50 to-emerald-50 border border-amber-200/80 rounded-2xl p-4 shadow-sm flex items-center justify-between cursor-pointer hover:border-amber-300 transition-all active:scale-[0.99]"
      >
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-amber-500 text-white rounded-xl shadow-sm">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wide">
              {t.allFarmsSummary}
            </h3>
            <p className="text-lg font-black text-farm-900">
              ₹{allFarmsSummary.totalInvestment.toLocaleString('en-IN')}
            </p>
          </div>
        </div>
        <div className="flex items-center text-xs font-bold text-farm-700 bg-white px-3 py-1.5 rounded-xl border shadow-sm">
          <span>{t.reports}</span>
          <ChevronRight className="w-4 h-4 ml-1" />
        </div>
      </div>

      {/* Active vs Archived Toggle */}
      {archivedFarms.length > 0 && (
        <div className="flex justify-end">
          <button
            onClick={() => setShowArchived(!showArchived)}
            className="text-xs font-bold text-farm-800 hover:text-farm-900 flex items-center space-x-1 bg-farm-50 px-3 py-1.5 rounded-xl border border-farm-200"
          >
            <Archive className="w-3.5 h-3.5" />
            <span>{showArchived ? t.activeFarms : `${t.archivedFarms} (${archivedFarms.length})`}</span>
          </button>
        </div>
      )}

      {/* Farm List Grid */}
      {displayFarms.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 text-center border border-dashed border-gray-300 my-6">
          <div className="w-16 h-16 bg-farm-50 text-farm-700 rounded-full flex items-center justify-center mx-auto mb-3">
            <Sprout className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-gray-800 mb-1">
            {t.noFarmsFound}
          </h3>
          <p className="text-xs text-gray-500 mb-4">
            {t.addFirstFarm}
          </p>
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

            return (
              <div
                key={farm.id}
                onClick={() => setSelectedFarmId(farm.id!)}
                className="bg-white rounded-3xl p-5 border border-gray-200/90 shadow-md hover:shadow-xl hover:border-farm-400 transition-all cursor-pointer relative overflow-hidden group active:scale-[0.99]"
              >
                {/* Top Farm Info Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-11 h-11 bg-farm-100 text-farm-800 rounded-2xl flex items-center justify-center font-extrabold text-xl shadow-inner group-hover:bg-farm-600 group-hover:text-white transition-all">
                      🌱
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-gray-900 group-hover:text-farm-800 transition-all line-clamp-1">
                        {farm.name}
                      </h3>
                      <div className="flex items-center space-x-2 text-xs text-gray-600 font-medium">
                        <span>{farm.area} {farm.unit}</span>
                        <span>•</span>
                        <span className="text-farm-700 font-semibold">{farm.currentSeason}</span>
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-bold bg-farm-50 text-farm-800 px-2.5 py-1 rounded-xl border border-farm-200 shrink-0">
                    {farm.unit}
                  </span>
                </div>

                {farm.location && (
                  <div className="flex items-center text-[11px] text-gray-500 mb-3">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-gray-400" />
                    <span className="truncate">{farm.location}</span>
                  </div>
                )}

                {/* Financial Summary Pill */}
                <div className="bg-farm-50/80 rounded-2xl p-3 border border-farm-100 flex items-center justify-between">
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

                {/* Footer Action Arrow */}
                <div className="mt-3 flex items-center justify-between text-xs font-bold text-farm-700 group-hover:translate-x-1 transition-all">
                  <span className="text-[11px] font-semibold text-gray-500">
                    {t.farmWiseExpenses}
                  </span>
                  <div className="flex items-center text-farm-700">
                    <span>{t.back === 'मागे' ? 'तपशील पहा' : 'View Dashboard'}</span>
                    <ChevronRight className="w-4 h-4 ml-0.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
