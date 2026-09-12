import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext';
import { AnalyticsCharts } from './AnalyticsCharts';
import { exportFarmReportPDF, exportAllFarmsReportPDF } from '../utils/pdfExport';
import { exportExpensesToCSV } from '../utils/csvExport';
import { FileText, Download, BarChart3, Printer } from 'lucide-react';

export const ReportsExporter: React.FC = () => {
  const {
    farms,
    activeFarms,
    expenses,
    crops,
    selectedFarm,
    language,
    t
  } = useFarm();

  const [reportType, setReportType] = useState<'single' | 'all'>(selectedFarm ? 'single' : 'all');
  const [targetFarmId, setTargetFarmId] = useState<number>(selectedFarm ? selectedFarm.id! : (activeFarms[0]?.id || 1));

  const farmsMap = new Map(farms.map(f => [f.id!, f]));
  const cropsMap = new Map(crops.map(c => [c.id!, c]));

  const currentFarm = farmsMap.get(targetFarmId);
  const currentFarmExpenses = expenses.filter(e => e.farmId === targetFarmId);

  const handleExportPDF = () => {
    if (reportType === 'single' && currentFarm) {
      exportFarmReportPDF(currentFarm, expenses, crops, language);
    } else {
      exportAllFarmsReportPDF(activeFarms, expenses, language);
    }
  };

  const handleExportCSV = () => {
    if (reportType === 'single' && currentFarm) {
      exportExpensesToCSV(currentFarmExpenses, farmsMap, cropsMap, language, `ShetiKharcha_${currentFarm.name}`);
    } else {
      exportExpensesToCSV(expenses, farmsMap, cropsMap, language, 'ShetiKharcha_AllFarms');
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Banner */}
      <div className="bg-gradient-to-r from-farm-900 to-farm-700 text-white rounded-3xl p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="bg-amber-400 text-farm-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-1 inline-block">
            Reports & Analytics
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            📊 {t.reports}
          </h2>
          <p className="text-xs text-farm-100 mt-0.5">
            Download PDF statements and CSV spreadsheets for accounting
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportPDF}
            className="bg-amber-400 hover:bg-amber-300 text-farm-950 font-black px-3.5 py-2.5 rounded-2xl shadow-md flex items-center space-x-1.5 text-xs active:scale-95 transition-all"
          >
            <FileText className="w-4 h-4" />
            <span>{t.exportPdf}</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="bg-white hover:bg-gray-100 text-farm-900 font-extrabold px-3.5 py-2.5 rounded-2xl shadow-md flex items-center space-x-1.5 text-xs active:scale-95 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>{t.exportCsv}</span>
          </button>
        </div>
      </div>

      {/* Scope Selector */}
      <div className="bg-white p-4 rounded-3xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex bg-gray-100 p-1 rounded-2xl">
          <button
            onClick={() => setReportType('single')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              reportType === 'single' ? 'bg-farm-800 text-white shadow' : 'text-gray-700'
            }`}
          >
            Single Farm Report
          </button>
          <button
            onClick={() => setReportType('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              reportType === 'all' ? 'bg-farm-800 text-white shadow' : 'text-gray-700'
            }`}
          >
            {t.allFarmsReport}
          </button>
        </div>

        {reportType === 'single' && (
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-gray-700">Select Farm:</span>
            <select
              value={targetFarmId}
              onChange={e => setTargetFarmId(Number(e.target.value))}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900"
            >
              {activeFarms.map(f => (
                <option key={f.id} value={f.id}>
                  🌱 {f.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Embedded Charts */}
      <AnalyticsCharts />
    </div>
  );
};
