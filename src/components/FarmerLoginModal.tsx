import React, { useState, useEffect } from 'react';
import { useFarm } from '../context/FarmContext';
import { UserCheck, LogOut, X, User, Phone, MapPin, Save } from 'lucide-react';

export const FarmerLoginModal: React.FC = () => {
  const {
    isFarmerLoginOpen,
    setIsFarmerLoginOpen,
    farmerProfile,
    loginFarmer,
    logoutFarmer,
    t
  } = useFarm();

  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [village, setVillage] = useState<string>('');

  useEffect(() => {
    if (farmerProfile) {
      setName(farmerProfile.name || '');
      setPhone(farmerProfile.phone || '');
      setVillage(farmerProfile.village || '');
    }
  }, [farmerProfile]);

  if (!isFarmerLoginOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await loginFarmer({
      name: name.trim(),
      phone: phone.trim(),
      village: village.trim()
    });
    setIsFarmerLoginOpen(false);
  };

  const handleLogout = async () => {
    await logoutFarmer();
    setName('');
    setPhone('');
    setVillage('');
    setIsFarmerLoginOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl space-y-4 border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-farm-100 text-farm-800 rounded-xl flex items-center justify-center font-bold text-xl">
              🧑‍🌾
            </div>
            <div>
              <h3 className="text-base font-black text-gray-900">{t.farmerProfile}</h3>
              <p className="text-[11px] text-gray-500 font-medium">
                {farmerProfile?.isLoggedIn ? 'Manage farmer credentials' : 'Login / Set farmer profile'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsFarmerLoginOpen(false)}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {farmerProfile?.isLoggedIn && farmerProfile.name ? (
          <div className="bg-farm-50 border border-farm-200 rounded-2xl p-4 space-y-2">
            <div className="flex items-center space-x-2 text-farm-900 font-black text-sm">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>{farmerProfile.name}</span>
            </div>
            {farmerProfile.village && (
              <p className="text-xs text-gray-600 flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                <span>{farmerProfile.village}</span>
              </p>
            )}
            {farmerProfile.phone && (
              <p className="text-xs text-gray-600 flex items-center space-x-1">
                <Phone className="w-3.5 h-3.5 text-gray-400" />
                <span>{farmerProfile.phone}</span>
              </p>
            )}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-3 pt-1">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center space-x-1">
              <User className="w-3.5 h-3.5 text-farm-700" />
              <span>{t.farmerName} *</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Ramesh Patil / रमेश पाटील"
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 focus:outline-none focus:border-farm-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center space-x-1">
              <Phone className="w-3.5 h-3.5 text-farm-700" />
              <span>{t.mobileNumber}</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="e.g. 9876543210"
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 focus:outline-none focus:border-farm-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-farm-700" />
              <span>{t.village}</span>
            </label>
            <input
              type="text"
              value={village}
              onChange={e => setVillage(e.target.value)}
              placeholder="e.g. Nashik / नाशिक"
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 focus:outline-none focus:border-farm-600"
            />
          </div>

          <div className="flex space-x-2 pt-2">
            {farmerProfile?.isLoggedIn && (
              <button
                type="button"
                onClick={handleLogout}
                className="bg-red-50 hover:bg-red-100 text-red-700 font-bold px-4 py-3 rounded-2xl text-xs flex items-center justify-center space-x-1 border border-red-200"
              >
                <LogOut className="w-4 h-4" />
                <span>{t.logoutFarmer}</span>
              </button>
            )}

            <button
              type="submit"
              className="flex-1 bg-amber-400 hover:bg-amber-300 text-farm-950 font-black py-3 px-4 rounded-2xl shadow-md flex items-center justify-center space-x-1 text-xs active:scale-95 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{t.saveProfile}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
