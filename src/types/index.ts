export type Language = 'mr' | 'en';

export type AreaUnit = 'Acre' | 'Hectare' | 'Guntha';

export type FarmStatus = 'active' | 'archived';

export type ExpenseCategory =
  | 'pesticide'
  | 'fertilizer'
  | 'seeds'
  | 'labour'
  | 'irrigation'
  | 'machinery'
  | 'fuel'
  | 'transportation'
  | 'harvesting'
  | 'other';

export interface Farm {
  id?: number;
  name: string;
  location?: string;
  area: number;
  unit: AreaUnit;
  currentSeason: string;
  notes?: string;
  status: FarmStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Crop {
  id?: number;
  farmId: number;
  cropName: string;
  season: string;
  plantingDate?: string;
  expectedHarvestDate?: string;
  area?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Expense {
  id?: number;
  farmId: number;
  cropId?: number;
  date: string;
  category: ExpenseCategory;
  productName: string;
  quantity?: string;
  amount: number;
  vendor?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Settings {
  id?: number;
  key: string;
  language: Language;
  appLockEnabled: boolean;
  pinHash?: string;
  preferences?: Record<string, any>;
  hasDemoData?: boolean;
}

export interface FarmTotals {
  farmId: number;
  farmName: string;
  area: number;
  unit: AreaUnit;
  totalInvestment: number;
  thisMonthInvestment: number;
  expenseCount: number;
  costPerAcre: number;
  categoryBreakdown: Record<ExpenseCategory, number>;
}

export interface CropTotals {
  cropId: number;
  cropName: string;
  season: string;
  totalInvestment: number;
  costPerAcre: number;
  categoryBreakdown: Record<ExpenseCategory, number>;
}

export interface AllFarmsSummaryData {
  totalFarms: number;
  totalArea: number;
  totalInvestment: number;
  totalExpensesCount: number;
  categoryTotals: Record<ExpenseCategory, number>;
  farmBreakdown: FarmTotals[];
}

export interface ExpenseFilter {
  dateRange: 'all' | 'today' | 'week' | 'month' | 'prev_month' | 'season' | 'custom';
  startDate?: string;
  endDate?: string;
  category?: ExpenseCategory | 'all';
  cropId?: number | 'all';
  searchQuery?: string;
}

export interface BackupData {
  version: string;
  exportedAt: string;
  farms: Farm[];
  crops: Crop[];
  expenses: Expense[];
  settings?: Settings;
}
