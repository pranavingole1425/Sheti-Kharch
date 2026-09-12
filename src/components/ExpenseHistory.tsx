import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext';
import { filterExpenses } from '../utils/calculations';
import { categoryLabels } from '../i18n/translations';
import { Expense, ExpenseCategory } from '../types';
import { formatExpenseItemShareText } from '../utils/shareUtils';
import { Search, Filter, Calendar, Edit2, Trash2, Tag, Plus, ShoppingBag, Share2 } from 'lucide-react';

interface ExpenseHistoryProps {
  farmId?: number;
  limit?: number;
}

export const ExpenseHistory: React.FC<ExpenseHistoryProps> = ({ farmId, limit }) => {
  const {
    expenses,
    farms,
    crops,
    setEditingExpense,
    setIsExpenseFormOpen,
    deleteExpense,
    openShareModal,
    language,
    t
  } = useFarm();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dateRange, setDateRange] = useState<'all' | 'today' | 'week' | 'month' | 'prev_month' | 'custom'>('all');
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | 'all'>('all');
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // STRICT FARM ISOLATION: Filter by farmId if provided
  const targetExpenses = farmId
    ? expenses.filter(e => e.farmId === farmId)
    : expenses;

  // Apply search & filters
  const filtered = filterExpenses(targetExpenses, {
    dateRange,
    category: selectedCategory,
    searchQuery
  });

  // Sort chronologically descending (newest first)
  const sorted = [...filtered].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const displayList = limit ? sorted.slice(0, limit) : sorted;

  // Calculate sum of filtered list
  const filteredTotal = sorted.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  const farmsMap = new Map(farms.map(f => [f.id!, f]));
  const cropsMap = new Map(crops.map(c => [c.id!, c]));

  const handleDelete = async (id: number) => {
    await deleteExpense(id);
    setDeletingId(null);
  };

  return (
    <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-black text-gray-900 flex items-center space-x-2">
            <span>📋 {t.expenseHistory}</span>
            {farmId && (
              <span className="text-xs font-semibold bg-farm-100 text-farm-800 px-2.5 py-0.5 rounded-full">
                ₹{filteredTotal.toLocaleString('en-IN')}
              </span>
            )}
          </h3>
          <p className="text-xs text-gray-500 font-medium">
            Showing {displayList.length} of {targetExpenses.length} records
          </p>
        </div>

        {!limit && (
          <button
            onClick={() => {
              setEditingExpense(null);
              setIsExpenseFormOpen(true);
            }}
            className="bg-amber-400 hover:bg-amber-300 text-farm-950 font-black px-3 py-2 rounded-xl text-xs flex items-center space-x-1 self-start sm:self-auto shadow-sm active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>{t.addExpense}</span>
          </button>
        )}
      </div>

      {!limit && (
        <div className="space-y-2.5 bg-gray-50 p-3 rounded-2xl border border-gray-100">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 focus:outline-none focus:border-farm-600"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <select
              value={dateRange}
              onChange={e => setDateRange(e.target.value as any)}
              className="px-2.5 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-800 focus:outline-none"
            >
              <option value="all">{t.allTime}</option>
              <option value="today">{t.today}</option>
              <option value="week">{t.thisWeek}</option>
              <option value="month">{t.thisMonthFilter}</option>
              <option value="prev_month">{t.previousMonth}</option>
            </select>

            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value as any)}
              className="px-2.5 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-800 focus:outline-none"
            >
              <option value="all">{t.allCategories}</option>
              {(Object.keys(categoryLabels) as ExpenseCategory[]).map(cat => (
                <option key={cat} value={cat}>
                  {categoryLabels[cat].icon} {categoryLabels[cat].en}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Expense List Items */}
      {displayList.length === 0 ? (
        /* 42. EMPTY FARM STATE */
        <div className="text-center py-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200 p-4">
          <div className="text-3xl mb-2">🌾</div>
          <p className="text-xs font-bold text-gray-700 mb-1">
            {t.noExpensesRecorded}
          </p>
          <button
            onClick={() => {
              setEditingExpense(null);
              setIsExpenseFormOpen(true);
            }}
            className="mt-2 bg-farm-700 hover:bg-farm-800 text-white font-bold px-4 py-2 rounded-xl text-xs inline-flex items-center space-x-1 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.addFirstExpense}</span>
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {displayList.map(item => {
            const catObj = categoryLabels[item.category];
            const farm = farmsMap.get(item.farmId);
            const crop = item.cropId ? cropsMap.get(item.cropId) : undefined;

            return (
              <div
                key={item.id}
                className="bg-white border border-gray-200 hover:border-farm-400 rounded-2xl p-3.5 shadow-sm transition-all flex items-center justify-between group"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-10 h-10 bg-farm-50 text-farm-800 rounded-2xl flex items-center justify-center font-bold text-lg shrink-0 border border-farm-100">
                    {catObj.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-xs font-black text-gray-900 truncate">
                        {item.productName}
                      </h4>
                      <span className="text-[10px] font-bold bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full shrink-0">
                        {catObj.en}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-gray-500 font-medium mt-0.5">
                      <span>🗓️ {item.date}</span>
                      {!farmId && farm && (
                        <span className="font-bold text-farm-700">🌱 {farm.name}</span>
                      )}
                      {crop && <span className="text-amber-700">🌾 {crop.cropName}</span>}
                      {item.quantity && <span>• {item.quantity}</span>}
                      {item.vendor && <span>• 🏪 {item.vendor}</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 shrink-0 ml-2">
                  <div className="text-right">
                    <p className="text-base font-black text-farm-900">
                      ₹{item.amount.toLocaleString('en-IN')}
                    </p>
                  </div>

                  <div className="flex items-center space-x-1 opacity-90 group-hover:opacity-100">
                    <button
                      onClick={() => {
                        const text = formatExpenseItemShareText(item, farm?.name, language);
                        openShareModal({
                          title: `${t.shareExpense} - ${item.productName}`,
                          text
                        });
                      }}
                      className="p-1.5 hover:bg-amber-50 text-gray-500 hover:text-amber-700 rounded-lg transition-all"
                      title={t.shareExpense}
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setEditingExpense(item);
                        setIsExpenseFormOpen(true);
                      }}
                      className="p-1.5 hover:bg-gray-100 text-gray-600 hover:text-farm-800 rounded-lg transition-all"
                      title="Edit Expense"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeletingId(item.id!)}
                      className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg transition-all"
                      title="Delete Expense"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 w-full max-w-xs shadow-xl text-center space-y-3">
            <h4 className="text-sm font-bold text-gray-900">{t.deleteExpenseConfirm}</h4>
            <div className="flex space-x-2 pt-1">
              <button
                onClick={() => setDeletingId(null)}
                className="flex-1 bg-gray-100 text-gray-700 font-bold py-2 rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deletingId)}
                className="flex-1 bg-red-600 text-white font-bold py-2 rounded-xl text-xs shadow"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
