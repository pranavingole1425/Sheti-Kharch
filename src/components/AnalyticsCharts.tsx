import React from 'react';
import { useFarm } from '../context/FarmContext';
import { categoryLabels } from '../i18n/translations';
import { ExpenseCategory } from '../types';

export const AnalyticsCharts: React.FC = () => {
  const { allFarmsSummary, expenses, farms } = useFarm();

  const farmData = allFarmsSummary.farmBreakdown;
  const maxFarmInvestment = Math.max(...farmData.map(f => f.totalInvestment), 1);

  // Category totals array
  const categoryData = (Object.keys(allFarmsSummary.categoryTotals) as ExpenseCategory[])
    .map(cat => ({
      cat,
      label: categoryLabels[cat].en,
      icon: categoryLabels[cat].icon,
      amount: allFarmsSummary.categoryTotals[cat]
    }))
    .filter(c => c.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  // Monthly totals array (last 6 months)
  const monthlyTotals: Record<string, number> = {};
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  expenses.forEach(exp => {
    const d = new Date(exp.date);
    const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
    monthlyTotals[key] = (monthlyTotals[key] || 0) + (Number(exp.amount) || 0);
  });

  const monthKeys = Object.keys(monthlyTotals).slice(-6);
  const maxMonthly = Math.max(...Object.values(monthlyTotals), 1);

  return (
    <div className="space-y-4">
      {/* 1. Farm-wise Bar Chart */}
      <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm space-y-3">
        <h3 className="text-sm font-black text-gray-900 flex items-center space-x-2">
          <span>📊 Farm-Wise Investment Comparison</span>
        </h3>

        <div className="space-y-2.5 pt-1">
          {farmData.map((f, idx) => {
            const widthPct = Math.max(Math.round((f.totalInvestment / maxFarmInvestment) * 100), 4);
            const colors = ['bg-emerald-600', 'bg-amber-500', 'bg-teal-600', 'bg-indigo-600', 'bg-orange-500'];

            return (
              <div key={f.farmId} className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-gray-800">
                  <span className="truncate">{f.farmName}</span>
                  <span className="text-farm-900 font-black">₹{f.totalInvestment.toLocaleString('en-IN')}</span>
                </div>
                <div className="w-full bg-gray-100 h-3.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${colors[idx % colors.length]} rounded-full transition-all duration-500`}
                    style={{ width: `${widthPct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Category Wise Breakdown Donut Visual */}
      <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm space-y-3">
        <h3 className="text-sm font-black text-gray-900">
          🍩 Category-Wise Investment Distribution
        </h3>

        <div className="space-y-2 pt-1">
          {categoryData.map(c => {
            const pct = Math.round((c.amount / (allFarmsSummary.totalInvestment || 1)) * 100);

            return (
              <div key={c.cat} className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2 min-w-0">
                  <span className="text-base">{c.icon}</span>
                  <span className="font-semibold text-gray-800 truncate">{c.label}</span>
                </div>
                <div className="flex items-center space-x-3 shrink-0">
                  <span className="font-extrabold text-gray-900">₹{c.amount.toLocaleString('en-IN')}</span>
                  <span className="w-10 text-right text-[11px] font-bold text-farm-700 bg-farm-50 px-1.5 py-0.5 rounded-md">
                    {pct}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Monthly Trend */}
      {monthKeys.length > 0 && (
        <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm space-y-3">
          <h3 className="text-sm font-black text-gray-900">
            📈 Monthly Expense Trend
          </h3>

          <div className="flex items-end justify-between h-36 pt-4 border-b border-gray-200 px-2 gap-2">
            {monthKeys.map(mKey => {
              const val = monthlyTotals[mKey] || 0;
              const heightPct = Math.max(Math.round((val / maxMonthly) * 100), 8);

              return (
                <div key={mKey} className="flex flex-col items-center flex-1 space-y-1">
                  <span className="text-[10px] font-extrabold text-farm-900">
                    ₹{Math.round(val / 1000)}k
                  </span>
                  <div
                    className="w-full bg-gradient-to-t from-farm-800 to-farm-500 rounded-t-lg transition-all"
                    style={{ height: `${heightPct}%` }}
                  />
                  <span className="text-[10px] font-bold text-gray-500 truncate w-full text-center">
                    {mKey.split(' ')[0]}
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
