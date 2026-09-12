import { Farm, Crop, Expense, ExpenseCategory, FarmTotals, CropTotals, AllFarmsSummaryData, ExpenseFilter } from '../types';

export const INITIAL_CATEGORY_BREAKDOWN: Record<ExpenseCategory, number> = {
  pesticide: 0,
  fertilizer: 0,
  seeds: 0,
  labour: 0,
  irrigation: 0,
  machinery: 0,
  fuel: 0,
  transportation: 0,
  harvesting: 0,
  other: 0
};

// Calculate metrics for a single farm
export function calculateFarmTotals(farm: Farm, expenses: Expense[]): FarmTotals {
  // STRICT DATA ISOLATION: Filter ONLY expenses matching this farm's ID
  const farmExpenses = expenses.filter(e => e.farmId === farm.id);

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  let totalInvestment = 0;
  let thisMonthInvestment = 0;
  const categoryBreakdown: Record<ExpenseCategory, number> = { ...INITIAL_CATEGORY_BREAKDOWN };

  for (const exp of farmExpenses) {
    const amt = Number(exp.amount) || 0;
    totalInvestment += amt;

    // Track category totals
    if (categoryBreakdown[exp.category] !== undefined) {
      categoryBreakdown[exp.category] += amt;
    } else {
      categoryBreakdown.other += amt;
    }

    // Track this month's expenses
    const expDate = new Date(exp.date);
    if (expDate.getFullYear() === currentYear && expDate.getMonth() === currentMonth) {
      thisMonthInvestment += amt;
    }
  }

  // Cost per acre = farmTotal / farmArea
  const area = Number(farm.area) || 1;
  const costPerAcre = totalInvestment / (area > 0 ? area : 1);

  return {
    farmId: farm.id!,
    farmName: farm.name,
    area: farm.area,
    unit: farm.unit,
    totalInvestment,
    thisMonthInvestment,
    expenseCount: farmExpenses.length,
    costPerAcre,
    categoryBreakdown
  };
}

// Calculate metrics for a specific crop within a farm
export function calculateCropTotals(crop: Crop, expenses: Expense[], farmArea: number): CropTotals {
  const cropExpenses = expenses.filter(e => e.cropId === crop.id);

  let totalInvestment = 0;
  const categoryBreakdown: Record<ExpenseCategory, number> = { ...INITIAL_CATEGORY_BREAKDOWN };

  for (const exp of cropExpenses) {
    const amt = Number(exp.amount) || 0;
    totalInvestment += amt;
    if (categoryBreakdown[exp.category] !== undefined) {
      categoryBreakdown[exp.category] += amt;
    }
  }

  const effectiveArea = crop.area || farmArea || 1;
  const costPerAcre = totalInvestment / (effectiveArea > 0 ? effectiveArea : 1);

  return {
    cropId: crop.id!,
    cropName: crop.cropName,
    season: crop.season,
    totalInvestment,
    costPerAcre,
    categoryBreakdown
  };
}

// Calculate combined summary metrics across all farms
export function calculateAllFarmsSummary(farms: Farm[], expenses: Expense[]): AllFarmsSummaryData {
  const activeFarms = farms.filter(f => f.status === 'active');
  const farmBreakdown: FarmTotals[] = activeFarms.map(f => calculateFarmTotals(f, expenses));

  let totalArea = 0;
  let totalInvestment = 0;
  let totalExpensesCount = 0;
  const categoryTotals: Record<ExpenseCategory, number> = { ...INITIAL_CATEGORY_BREAKDOWN };

  for (const fb of farmBreakdown) {
    totalArea += Number(fb.area) || 0;
    totalInvestment += fb.totalInvestment;
    totalExpensesCount += fb.expenseCount;

    for (const cat of Object.keys(fb.categoryBreakdown) as ExpenseCategory[]) {
      categoryTotals[cat] += fb.categoryBreakdown[cat];
    }
  }

  return {
    totalFarms: activeFarms.length,
    totalArea,
    totalInvestment,
    totalExpensesCount,
    categoryTotals,
    farmBreakdown
  };
}

// Filter expenses by query criteria
export function filterExpenses(expenses: Expense[], filter: ExpenseFilter): Expense[] {
  return expenses.filter(exp => {
    // 1. Date Filter
    if (filter.dateRange && filter.dateRange !== 'all') {
      const expDate = new Date(exp.date);
      const now = new Date();
      
      if (filter.dateRange === 'today') {
        const todayStr = now.toISOString().split('T')[0];
        if (exp.date !== todayStr) return false;
      } else if (filter.dateRange === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        if (expDate < weekAgo) return false;
      } else if (filter.dateRange === 'month') {
        if (expDate.getMonth() !== now.getMonth() || expDate.getFullYear() !== now.getFullYear()) {
          return false;
        }
      } else if (filter.dateRange === 'prev_month') {
        const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        if (expDate.getMonth() !== prevMonth.getMonth() || expDate.getFullYear() !== prevMonth.getFullYear()) {
          return false;
        }
      } else if (filter.dateRange === 'custom') {
        if (filter.startDate && exp.date < filter.startDate) return false;
        if (filter.endDate && exp.date > filter.endDate) return false;
      }
    }

    // 2. Category Filter
    if (filter.category && filter.category !== 'all') {
      if (exp.category !== filter.category) return false;
    }

    // 3. Crop Filter
    if (filter.cropId && filter.cropId !== 'all') {
      if (exp.cropId !== filter.cropId) return false;
    }

    // 4. Search Query
    if (filter.searchQuery && filter.searchQuery.trim() !== '') {
      const q = filter.searchQuery.toLowerCase().trim();
      const matchProduct = exp.productName.toLowerCase().includes(q);
      const matchVendor = exp.vendor ? exp.vendor.toLowerCase().includes(q) : false;
      const matchNotes = exp.notes ? exp.notes.toLowerCase().includes(q) : false;
      const matchCategory = exp.category.toLowerCase().includes(q);
      if (!matchProduct && !matchVendor && !matchNotes && !matchCategory) return false;
    }

    return true;
  });
}
