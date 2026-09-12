import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext';
import { calculateCropTotals } from '../utils/calculations';
import { Sprout, Plus, Calendar, Trash2 } from 'lucide-react';

interface CropManagerProps {
  farmId: number;
  farmArea: number;
}

export const CropManager: React.FC<CropManagerProps> = ({ farmId, farmArea }) => {
  const { crops, expenses, addCrop, deleteCrop, t } = useFarm();
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  const [cropName, setCropName] = useState<string>('');
  const [season, setSeason] = useState<string>('Kharif 2026');
  const [plantingDate, setPlantingDate] = useState<string>('');
  const [harvestDate, setHarvestDate] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const farmCrops = crops.filter(c => c.farmId === farmId);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cropName.trim()) return;

    await addCrop({
      farmId,
      cropName: cropName.trim(),
      season: season.trim(),
      plantingDate,
      expectedHarvestDate: harvestDate,
      area: farmArea,
      notes: notes.trim()
    });

    setCropName('');
    setSeason('Kharif 2026');
    setPlantingDate('');
    setHarvestDate('');
    setNotes('');
    setShowAddForm(false);
  };

  return (
    <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-black text-gray-900 flex items-center space-x-2">
            <span>🌾 {t.cropsSeasons}</span>
          </h3>
          <p className="text-xs text-gray-500 font-medium">
            Manage multiple crop cycles across seasons for this farm
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-farm-800 hover:bg-farm-900 text-white font-bold px-3 py-2 rounded-xl text-xs flex items-center space-x-1 shadow-sm active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{t.addCrop}</span>
        </button>
      </div>

      {/* Add Crop Inline Form */}
      {showAddForm && (
        <form onSubmit={handleAddSubmit} className="bg-farm-50 p-4 rounded-2xl border border-farm-200 space-y-3">
          <h4 className="text-xs font-black text-farm-900 uppercase tracking-wider">
            Add Crop Cycle
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] font-bold text-gray-700 mb-1">{t.cropName} *</label>
              <input
                type="text"
                value={cropName}
                onChange={e => setCropName(e.target.value)}
                placeholder="e.g. Cotton / कापूस"
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-semibold text-gray-900"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 mb-1">{t.currentSeason} *</label>
              <input
                type="text"
                value={season}
                onChange={e => setSeason(e.target.value)}
                placeholder="e.g. Kharif 2026 / Rabi 2026"
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-semibold text-gray-900"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 mb-1">{t.plantingDate}</label>
              <input
                type="date"
                value={plantingDate}
                onChange={e => setPlantingDate(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-semibold text-gray-900"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 mb-1">{t.harvestDate}</label>
              <input
                type="date"
                value={harvestDate}
                onChange={e => setHarvestDate(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-semibold text-gray-900"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-1">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 bg-gray-200 text-gray-700 text-xs font-bold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-farm-800 text-white text-xs font-bold rounded-xl shadow"
            >
              Save Crop
            </button>
          </div>
        </form>
      )}

      {/* Crop Cards */}
      {farmCrops.length === 0 ? (
        <div className="text-center py-6 bg-gray-50 rounded-2xl text-xs font-bold text-gray-500">
          No crops added for this farm yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {farmCrops.map(c => {
            const totals = calculateCropTotals(c, expenses, farmArea);

            return (
              <div
                key={c.id}
                className="bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-2 flex flex-col justify-between"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-farm-100 text-farm-800 rounded-xl">
                      <Sprout className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-gray-900">{c.cropName}</h4>
                      <span className="text-[10px] font-bold text-farm-700 bg-farm-100 px-2 py-0.5 rounded-md">
                        {c.season}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteCrop(c.id!)}
                    className="text-gray-400 hover:text-red-600 p-1"
                    title="Delete Crop"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-gray-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-gray-500 block">Crop Investment</span>
                    <span className="text-base font-black text-farm-900">
                      ₹{totals.totalInvestment.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-gray-500 block">Cost / Acre</span>
                    <span className="text-xs font-bold text-emerald-800">
                      ₹{Math.round(totals.costPerAcre).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {c.plantingDate && (
                  <div className="text-[10px] text-gray-500 flex items-center space-x-2">
                    <Calendar className="w-3 h-3 text-gray-400" />
                    <span>Sown: {c.plantingDate}</span>
                    {c.expectedHarvestDate && <span>• Harvest: {c.expectedHarvestDate}</span>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
