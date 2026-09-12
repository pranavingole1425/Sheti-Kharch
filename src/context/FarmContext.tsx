import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import { seedDemoData, clearDemoData as clearDemoDataFn } from '../db/seed';
import { verifyPin, hashPin } from '../db/crypto';
import { Farm, Crop, Expense, Settings, Language, ExpenseFilter, FarmTotals, AllFarmsSummaryData } from '../types';
import { translations, Translations } from '../i18n/translations';
import { calculateFarmTotals, calculateAllFarmsSummary } from '../utils/calculations';

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
}

interface FarmContextType {
  // Data
  farms: Farm[];
  activeFarms: Farm[];
  archivedFarms: Farm[];
  crops: Crop[];
  expenses: Expense[];
  settings: Settings | undefined;

  // Selected state
  selectedFarmId: number | null;
  setSelectedFarmId: (id: number | null) => void;
  selectedFarm: Farm | undefined;
  activeTab: 'farms' | 'add_expense' | 'reports' | 'settings' | 'all_summary';
  setActiveTab: (tab: 'farms' | 'add_expense' | 'reports' | 'settings' | 'all_summary') => void;

  // Filters & Search
  filter: ExpenseFilter;
  setFilter: React.Dispatch<React.SetStateAction<ExpenseFilter>>;
  globalSearchQuery: string;
  setGlobalSearchQuery: (q: string) => void;

  // Language & i18n
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  t: Translations;

  // App Lock
  isLocked: boolean;
  unlockApp: (pin: string) => Promise<boolean>;
  setPinCode: (pin: string) => Promise<void>;
  disableAppLock: () => Promise<void>;

  // Calculations
  selectedFarmTotals: FarmTotals | null;
  allFarmsSummary: AllFarmsSummaryData;

  // CRUD Actions
  addFarm: (farm: Omit<Farm, 'id' | 'createdAt' | 'updatedAt'>) => Promise<number>;
  updateFarm: (id: number, farm: Partial<Farm>) => Promise<void>;
  deleteFarm: (id: number) => Promise<void>;
  archiveFarm: (id: number) => Promise<void>;
  unarchiveFarm: (id: number) => Promise<void>;

  addCrop: (crop: Omit<Crop, 'id' | 'createdAt' | 'updatedAt'>) => Promise<number>;
  deleteCrop: (id: number) => Promise<void>;

  addExpense: (expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => Promise<number>;
  updateExpense: (id: number, expense: Partial<Expense>) => Promise<void>;
  deleteExpense: (id: number) => Promise<void>;

  // Modals & UI controls
  isFarmFormOpen: boolean;
  setIsFarmFormOpen: (open: boolean) => void;
  editingFarm: Farm | null;
  setEditingFarm: (farm: Farm | null) => void;

  isExpenseFormOpen: boolean;
  setIsExpenseFormOpen: (open: boolean) => void;
  editingExpense: Expense | null;
  setEditingExpense: (exp: Expense | null) => void;

  // Toast
  toasts: ToastMessage[];
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;

  // Demo & Reset
  clearDemoData: () => Promise<void>;
  clearAllData: () => Promise<void>;
  seedDemo: () => Promise<void>;
}

const FarmContext = createContext<FarmContextType | undefined>(undefined);

export const FarmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Live IndexedDB Queries
  const farms = useLiveQuery(() => db.farms.toArray(), [], []);
  const crops = useLiveQuery(() => db.crops.toArray(), [], []);
  const expenses = useLiveQuery(() => db.expenses.toArray(), [], []);
  const settings = useLiveQuery(async () => {
    let set = await db.settings.get({ key: 'app_settings' });
    if (!set) {
      // Default settings
      const defaultSet: Settings = {
        key: 'app_settings',
        language: 'mr',
        appLockEnabled: false
      };
      await db.settings.put(defaultSet);
      return defaultSet;
    }
    return set;
  }, [], undefined);

  // Active / Archived Lists
  const activeFarms = farms.filter(f => f.status === 'active');
  const archivedFarms = farms.filter(f => f.status === 'archived');

  // UI States
  const [selectedFarmId, setSelectedFarmId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'farms' | 'add_expense' | 'reports' | 'settings' | 'all_summary'>('farms');
  const [language, setLangState] = useState<Language>('mr');
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');

  // Modals
  const [isFarmFormOpen, setIsFarmFormOpen] = useState<boolean>(false);
  const [editingFarm, setEditingFarm] = useState<Farm | null>(null);
  const [isExpenseFormOpen, setIsExpenseFormOpen] = useState<boolean>(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Filter
  const [filter, setFilter] = useState<ExpenseFilter>({
    dateRange: 'all',
    category: 'all',
    cropId: 'all',
    searchQuery: ''
  });

  // Seed demo data on initial app launch if database is empty
  useEffect(() => {
    async function initSeed() {
      const count = await db.farms.count();
      if (count === 0) {
        await seedDemoData();
      }
    }
    initSeed();
  }, []);

  // Sync Language & PIN Lock from settings
  useEffect(() => {
    if (settings) {
      setLangState(settings.language || 'mr');
      if (settings.appLockEnabled && settings.pinHash && !isLocked) {
        setIsLocked(true);
      }
    }
  }, [settings?.language, settings?.appLockEnabled]);

  // Derived selected farm object
  const selectedFarm = farms.find(f => f.id === selectedFarmId);

  // Translations
  const t = translations[language] || translations.mr;

  // Selected Farm Totals calculation (STRICT FARM ISOLATION)
  const selectedFarmTotals = selectedFarm
    ? calculateFarmTotals(selectedFarm, expenses)
    : null;

  // All Farms Summary calculation
  const allFarmsSummary = calculateAllFarmsSummary(farms, expenses);

  // Toast Helpers
  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Language Setter
  const setLanguage = async (newLang: Language) => {
    setLangState(newLang);
    if (settings) {
      await db.settings.put({ ...settings, language: newLang });
    }
  };

  // App Lock Helpers
  const unlockApp = async (pin: string): Promise<boolean> => {
    if (!settings?.pinHash) return true;
    const ok = await verifyPin(pin, settings.pinHash);
    if (ok) {
      setIsLocked(false);
    }
    return ok;
  };

  const setPinCode = async (pin: string) => {
    const hash = await hashPin(pin);
    if (settings) {
      await db.settings.put({
        ...settings,
        appLockEnabled: true,
        pinHash: hash
      });
      showToast(t.pinSaved);
    }
  };

  const disableAppLock = async () => {
    if (settings) {
      await db.settings.put({
        ...settings,
        appLockEnabled: false,
        pinHash: undefined
      });
      setIsLocked(false);
    }
  };

  // CRUD Functions
  const addFarm = async (farmData: Omit<Farm, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const id = await db.farms.add({
      ...farmData,
      createdAt: now,
      updatedAt: now
    });
    
    // Create initial crop if crop name exists or default
    await db.crops.add({
      farmId: id,
      cropName: farmData.notes ? farmData.notes.split(' ')[0] : 'Crop',
      season: farmData.currentSeason || 'Kharif 2026',
      area: farmData.area,
      createdAt: now,
      updatedAt: now
    });

    showToast(t.farmAddedSuccess);
    return id;
  };

  const updateFarm = async (id: number, farmData: Partial<Farm>) => {
    await db.farms.update(id, {
      ...farmData,
      updatedAt: new Date().toISOString()
    });
    showToast(t.farmUpdatedSuccess);
  };

  const deleteFarm = async (id: number) => {
    // Delete farm, crops, and expenses associated with this farm
    await db.farms.delete(id);
    await db.crops.where('farmId').equals(id).delete();
    await db.expenses.where('farmId').equals(id).delete();

    if (selectedFarmId === id) {
      setSelectedFarmId(null);
    }
    showToast(t.farmDeletedSuccess);
  };

  const archiveFarm = async (id: number) => {
    await db.farms.update(id, {
      status: 'archived',
      updatedAt: new Date().toISOString()
    });
    if (selectedFarmId === id) {
      setSelectedFarmId(null);
    }
    showToast(t.farmArchivedSuccess);
  };

  const unarchiveFarm = async (id: number) => {
    await db.farms.update(id, {
      status: 'active',
      updatedAt: new Date().toISOString()
    });
    showToast(t.farmUpdatedSuccess);
  };

  const addCrop = async (cropData: Omit<Crop, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const id = await db.crops.add({
      ...cropData,
      createdAt: now,
      updatedAt: now
    });
    showToast(t.cropSavedSuccess);
    return id;
  };

  const deleteCrop = async (id: number) => {
    await db.crops.delete(id);
  };

  const addExpense = async (expData: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const id = await db.expenses.add({
      ...expData,
      createdAt: now,
      updatedAt: now
    });
    showToast(t.expenseSavedSuccess);
    return id;
  };

  const updateExpense = async (id: number, expData: Partial<Expense>) => {
    await db.expenses.update(id, {
      ...expData,
      updatedAt: new Date().toISOString()
    });
    showToast(t.expenseSavedSuccess);
  };

  const deleteExpense = async (id: number) => {
    await db.expenses.delete(id);
    showToast(t.expenseDeletedSuccess);
  };

  const clearDemo = async () => {
    await clearDemoDataFn();
    showToast(t.demoDataCleared);
  };

  const clearAllData = async () => {
    await db.expenses.clear();
    await db.crops.clear();
    await db.farms.clear();
    setSelectedFarmId(null);
    showToast(t.dataClearedSuccess);
  };

  const seedDemo = async () => {
    await seedDemoData();
    showToast('Demo data seeded successfully.');
  };

  return (
    <FarmContext.Provider
      value={{
        farms,
        activeFarms,
        archivedFarms,
        crops,
        expenses,
        settings,
        selectedFarmId,
        setSelectedFarmId,
        selectedFarm,
        activeTab,
        setActiveTab,
        filter,
        setFilter,
        globalSearchQuery,
        setGlobalSearchQuery,
        language,
        setLanguage,
        t,
        isLocked,
        unlockApp,
        setPinCode,
        disableAppLock,
        selectedFarmTotals,
        allFarmsSummary,
        addFarm,
        updateFarm,
        deleteFarm,
        archiveFarm,
        unarchiveFarm,
        addCrop,
        deleteCrop,
        addExpense,
        updateExpense,
        deleteExpense,
        isFarmFormOpen,
        setIsFarmFormOpen,
        editingFarm,
        setEditingFarm,
        isExpenseFormOpen,
        setIsExpenseFormOpen,
        editingExpense,
        setEditingExpense,
        toasts,
        showToast,
        removeToast,
        clearDemoData: clearDemo,
        clearAllData,
        seedDemo
      }}
    >
      {children}
    </FarmContext.Provider>
  );
};

export const useFarm = () => {
  const ctx = useContext(FarmContext);
  if (!ctx) throw new Error('useFarm must be used within FarmProvider');
  return ctx;
};
