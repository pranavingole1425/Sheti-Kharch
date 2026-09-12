import React, { useState, useEffect } from 'react';
import { useFarm } from '../context/FarmContext';
import { AreaUnit } from '../types';
import { unitLabels } from '../i18n/translations';
import { X, Save, Sprout } from 'lucide-react';

export const FarmFormModal: React.FC = () => {
  const {
    isFarmFormOpen,
    setIsFarmFormOpen,
    editingFarm,
    setEditingFarm,
    addFarm,
    updateFarm,
    t
  } = useFarm();

  const [name, setName] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [area, setArea] = useState<string>('5');
  const [unit, setUnit] = useState<AreaUnit>('Acre');
  const [season, setSeason] = useState<string>('Kharif 2026');
  const [notes, setNotes] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    if (editingFarm) {
      setName(editingFarm.name);
      setLocation(editingFarm.location || '');
      setArea(editingFarm.area.toString());
      setUnit(editingFarm.unit);
      setSeason(editingFarm.currentSeason);
      setNotes(editingFarm.notes || '');
    } else {
      setName('');
      setLocation('');
      setArea('5');
      setUnit('Acre');
      setSeason('Kharif 2026');
      setNotes('');
    }
    setErrorMsg('');
  }, [editingFarm, isFarmFormOpen]);

  if (!isFarmFormOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg(t.errRequiredFarmName);
      return;
    }
    const parsedArea = parseFloat(area);
    if (isNaN(parsedArea) || parsedArea <= 0) {
      setErrorMsg(t.errRequiredArea);
      return;
    }

    if (editingFarm) {
      await updateFarm(editingFarm.id!, {
        name: name.trim(),
        location: location.trim(),
        area: parsedArea,
        unit,
        currentSeason: season.trim(),
        notes: notes.trim()
      });
    } else {
      await addFarm({
        name: name.trim(),
        location: location.trim(),
        area: parsedArea,
        unit,
        currentSeason: season.trim(),
        notes: notes.trim(),
        status: 'active'
      });
    }

    setIsFarmFormOpen(false);
    setEditingFarm(null);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="bg-farm-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-amber-400 text-farm-950 rounded-xl">
              <Sprout className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black tracking-tight">
              {editingFarm ? t.editFarm : t.addFarm}
            </h2>
          </div>
          <button
            onClick={() => {
              setIsFarmFormOpen(false);
              setEditingFarm(null);
            }}
            className="p-1.5 hover:bg-white/20 rounded-full text-white/80 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-2xl">
              ⚠️ {errorMsg}
            </div>
          )}

          {/* Farm Name */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              {t.farmName} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Main Farm / मुख्य शेत"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-semibold text-gray-900 focus:bg-white focus:border-farm-600 focus:outline-none"
              required
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              {t.farmLocation} <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="e.g. Village / Gut No. / Shivar"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-semibold text-gray-900 focus:bg-white focus:border-farm-600 focus:outline-none"
            />
          </div>

          {/* Area & Unit */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                {t.area} <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={area}
                onChange={e => setArea(e.target.value)}
                placeholder="e.g. 5"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-semibold text-gray-900 focus:bg-white focus:border-farm-600 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                {t.unit}
              </label>
              <select
                value={unit}
                onChange={e => setUnit(e.target.value as AreaUnit)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold text-gray-900 focus:bg-white focus:border-farm-600 focus:outline-none"
              >
                {(['Acre', 'Hectare', 'Guntha'] as AreaUnit[]).map(u => (
                  <option key={u} value={u}>
                    {unitLabels[u].mr} / {u}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Current Season */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              {t.currentSeason}
            </label>
            <input
              type="text"
              value={season}
              onChange={e => setSeason(e.target.value)}
              placeholder="e.g. Kharif 2026 / रब्बी २०२६"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-semibold text-gray-900 focus:bg-white focus:border-farm-600 focus:outline-none"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              {t.notes} <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Additional details..."
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
              <span>{t.saveFarm}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
