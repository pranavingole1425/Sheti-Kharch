import React, { useState, useEffect } from 'react';
import { useFarm } from '../context/FarmContext';
import { ExpenseCategory } from '../types';
import { categoryLabels } from '../i18n/translations';
import { X, Save, PlusCircle, Check } from 'lucide-react';

export const ExpenseFormModal: React.FC = () => {
  const {
    isExpenseFormOpen,
    setIsExpenseFormOpen,
    editingExpense,
    setEditingExpense,
    selectedFarm,
    activeFarms,
    crops,
    addExpense,
    updateExpense,
    t
  } = useFarm();

  const [farmId, setFarmId] = useState<number | ''>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState<ExpenseCategory>('pesticide');
  const [productName, setProductName] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [cropId, setCropId] = useState<number | ''>('');
  const [vendor, setVendor] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Quick product suggestion chips per category
  const productSuggestions: Record<ExpenseCategory, string[]> = {
    pesticide: ['Coragen', 'Fungicide', 'Insecticide', 'Amistar', 'Monocrotophos'],
    fertilizer: ['Urea', 'DAP 18:46:0', '10:26:26', '19:19:19', 'Organic Compost'],
    seeds: ['Cotton Seeds', 'Soybean Seeds', 'Wheat Seeds', 'Chilli Saplings'],
    labour: ['Weeding Labour', 'Planting Labour', 'Spraying Labour', 'Harvest Labour'],
    irrigation: ['Water Pump Repair', 'Drip Lateral Pipe', 'Canal Water Tax'],
    machinery: ['Tractor Ploughing', 'Rotavator', 'Combine Harvester'],
    fuel: ['Diesel for Pump', 'Tractor Fuel'],
    transportation: ['Tempo Freight', 'Tractor Transport'],
    harvesting: ['Cotton Picking Labour', 'Grain Threshing'],
    other: ['Tea & Snacks for Labour', 'Rope & Bags']
  };

  useEffect(() => {
    if (editingExpense) {
      setFarmId(editingExpense.farmId);
      setDate(editingExpense.date);
      setCategory(editingExpense.category);
      setProductName(editingExpense.productName);
      setQuantity(editingExpense.quantity || '');
      setAmount(editingExpense.amount.toString());
      setCropId(editingExpense.cropId || '');
      setVendor(editingExpense.vendor || '');
      setNotes(editingExpense.notes || '');
    } else {
      // Preselect active farm context if available
      setFarmId(selectedFarm ? selectedFarm.id! : (activeFarms.length > 0 ? activeFarms[0].id! : ''));
      setDate(new Date().toISOString().split('T')[0]);
      setCategory('pesticide');
      setProductName('');
      setQuantity('');
      setAmount('');
      setCropId('');
      setVendor('');
      setNotes('');
    }
    setErrorMsg('');
  }, [editingExpense, isExpenseFormOpen, selectedFarm]);

  if (!isExpenseFormOpen) return null;

  // Filter crops available for selected farm
  const currentFarmCrops = farmId ? crops.filter(c => c.farmId === Number(farmId)) : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmId) {
      setErrorMsg(t.errSelectFarm);
      return;
    }
    if (!productName.trim()) {
      setErrorMsg(t.errRequiredProduct);
      return;
    }
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setErrorMsg(t.errRequiredAmount);
      return;
    }

    if (editingExpense) {
      await updateExpense(editingExpense.id!, {
        farmId: Number(farmId),
        date,
        category,
        productName: productName.trim(),
        quantity: quantity.trim(),
        amount: parsedAmount,
        cropId: cropId ? Number(cropId) : undefined,
        vendor: vendor.trim(),
        notes: notes.trim()
      });
    } else {
      await addExpense({
        farmId: Number(farmId),
        date,
        category,
        productName: productName.trim(),
        quantity: quantity.trim(),
        amount: parsedAmount,
        cropId: cropId ? Number(cropId) : undefined,
        vendor: vendor.trim(),
        notes: notes.trim()
      });
    }

    setIsExpenseFormOpen(false);
    setEditingExpense(null);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-farm-800 to-farm-700 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-amber-400 text-farm-950 rounded-xl">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight">
                {editingExpense ? 'Edit Expense' : t.addExpense}
              </h2>
              {selectedFarm && (
                <p className="text-[11px] text-amber-200 font-semibold">
                  For: {selectedFarm.name}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={() => {
              setIsExpenseFormOpen(false);
              setEditingExpense(null);
            }}
            className="p-1.5 hover:bg-white/20 rounded-full text-white/80 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-2xl">
              ⚠️ {errorMsg}
            </div>
          )}

          {/* 6. MANDATORY FARM SELECTION */}
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1">
              {t.selectFarm} <span className="text-red-500">*</span>
            </label>
            <select
              value={farmId}
              onChange={e => setFarmId(e.target.value ? Number(e.target.value) : '')}
              className="w-full px-4 py-3 bg-amber-50 border border-amber-300 rounded-2xl text-sm font-extrabold text-farm-900 focus:bg-white focus:border-farm-600 focus:outline-none shadow-sm"
              required
            >
              <option value="">{t.selectFarmPlaceholder}</option>
              {activeFarms.map(f => (
                <option key={f.id} value={f.id}>
                  🌱 {f.name} ({f.area} {f.unit} • {f.currentSeason})
                </option>
              ))}
            </select>
          </div>

          {/* Date Picker & Amount */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                {t.date} <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold text-gray-900 focus:bg-white focus:border-farm-600 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                {t.amount} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-farm-800 font-extrabold text-base">₹</span>
                <input
                  type="number"
                  step="1"
                  min="1"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="2500"
                  className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-base font-black text-farm-900 focus:bg-white focus:border-farm-600 focus:outline-none"
                  required
                />
              </div>
            </div>
          </div>

          {/* 7. CATEGORY SELECTOR (Touch Cards) */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              {t.category} <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-44 overflow-y-auto p-1 scrollbar-thin">
              {(Object.keys(categoryLabels) as ExpenseCategory[]).map(catKey => {
                const catObj = categoryLabels[catKey];
                const isSelected = category === catKey;
                return (
                  <button
                    type="button"
                    key={catKey}
                    onClick={() => setCategory(catKey)}
                    className={`p-2.5 rounded-2xl border text-left flex items-center space-x-2 transition-all active:scale-95 ${
                      isSelected
                        ? 'bg-farm-800 text-white border-farm-800 font-bold shadow-md'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-800 border-gray-200 text-xs font-semibold'
                    }`}
                  >
                    <span className="text-lg">{catObj.icon}</span>
                    <span className="truncate text-xs">{catObj.en}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Product Name & Quick Suggestion Chips */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              {t.productName} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={productName}
              onChange={e => setProductName(e.target.value)}
              placeholder="e.g. Coragen, Urea, Cotton Seeds, Labour..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-semibold text-gray-900 focus:bg-white focus:border-farm-600 focus:outline-none"
              required
            />
            {/* Quick Chips */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {productSuggestions[category]?.map(chip => (
                <button
                  type="button"
                  key={chip}
                  onClick={() => setProductName(chip)}
                  className="text-[11px] font-bold bg-farm-50 hover:bg-farm-100 text-farm-800 px-2.5 py-1 rounded-xl border border-farm-200 transition-all"
                >
                  + {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity & Crop */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                {t.quantity} <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                placeholder="e.g. 2 bottles / 5 bags"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold text-gray-900 focus:bg-white focus:border-farm-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                {t.crop}
              </label>
              <select
                value={cropId}
                onChange={e => setCropId(e.target.value ? Number(e.target.value) : '')}
                className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold text-gray-900 focus:bg-white focus:border-farm-600 focus:outline-none"
              >
                <option value="">{t.selectCrop}</option>
                {currentFarmCrops.map(c => (
                  <option key={c.id} value={c.id}>
                    🌾 {c.cropName} ({c.season})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Vendor / Shop Name */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              {t.vendor} <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={vendor}
              onChange={e => setVendor(e.target.value)}
              placeholder="e.g. Kisan Krushi Seva Kendra"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold text-gray-900 focus:bg-white focus:border-farm-600 focus:outline-none"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              {t.notes} <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Additional notes..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-medium text-gray-900 focus:bg-white focus:border-farm-600 focus:outline-none"
            />
          </div>

          {/* Save Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-farm-800 hover:bg-farm-900 text-white font-extrabold py-3.5 px-4 rounded-2xl shadow-lg flex items-center justify-center space-x-2 text-sm active:scale-95 transition-all"
            >
              <Save className="w-5 h-5 text-amber-400" />
              <span>{t.saveExpense}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
