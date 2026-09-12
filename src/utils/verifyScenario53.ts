import { db } from '../db/db';
import { calculateFarmTotals, calculateAllFarmsSummary } from './calculations';
import { Farm, Expense } from '../types';

export interface TestStepResult {
  step: string;
  expected: string;
  actual: string;
  passed: boolean;
}

export interface TestSuiteResult {
  success: boolean;
  timestamp: string;
  steps: TestStepResult[];
  logs: string[];
}

export async function runScenario53Test(): Promise<TestSuiteResult> {
  const steps: TestStepResult[] = [];
  const logs: string[] = [];
  const now = new Date().toISOString();

  logs.push('Starting Scenario #53 Farm-Wise Data Isolation Verification Test...');

  try {
    // 1. Create Farm A & Farm B
    const farmAId = await db.farms.add({
      name: 'Test Farm A (Cotton)',
      location: 'Test Zone A',
      area: 5,
      unit: 'Acre',
      currentSeason: 'Kharif 2026',
      notes: 'SCENARIO_53_TEST',
      status: 'active',
      createdAt: now,
      updatedAt: now
    });

    const farmBId = await db.farms.add({
      name: 'Test Farm B (Soybean)',
      location: 'Test Zone B',
      area: 3,
      unit: 'Acre',
      currentSeason: 'Kharif 2026',
      notes: 'SCENARIO_53_TEST',
      status: 'active',
      createdAt: now,
      updatedAt: now
    });

    logs.push(`Created Test Farm A (ID: ${farmAId}) and Test Farm B (ID: ${farmBId})`);

    // 2. Add Farm A expenses: Pesticide 2500, Fertilizer 4000, Seeds 6500
    const expA1 = await db.expenses.add({
      farmId: farmAId,
      date: '2026-09-12',
      category: 'pesticide',
      productName: 'Test Pesticide A',
      amount: 2500,
      notes: 'SCENARIO_53_TEST',
      createdAt: now,
      updatedAt: now
    });

    await db.expenses.add({
      farmId: farmAId,
      date: '2026-09-12',
      category: 'fertilizer',
      productName: 'Test Fertilizer A',
      amount: 4000,
      notes: 'SCENARIO_53_TEST',
      createdAt: now,
      updatedAt: now
    });

    await db.expenses.add({
      farmId: farmAId,
      date: '2026-09-12',
      category: 'seeds',
      productName: 'Test Seeds A',
      amount: 6500,
      notes: 'SCENARIO_53_TEST',
      createdAt: now,
      updatedAt: now
    });

    // Verify Farm A Total = 13,000
    let farmAObj = await db.farms.get(farmAId);
    let allExp = await db.expenses.where('farmId').equals(farmAId).toArray();
    let totalA = calculateFarmTotals(farmAObj!, allExp).totalInvestment;

    steps.push({
      step: '1. Farm A initial expenses (2500+4000+6500)',
      expected: '₹13,000',
      actual: `₹${totalA.toLocaleString()}`,
      passed: totalA === 13000
    });

    // 3. Add Farm B expenses: Pesticide 2000, Fertilizer 3000
    const expB1 = await db.expenses.add({
      farmId: farmBId,
      date: '2026-09-12',
      category: 'pesticide',
      productName: 'Test Pesticide B',
      amount: 2000,
      notes: 'SCENARIO_53_TEST',
      createdAt: now,
      updatedAt: now
    });

    await db.expenses.add({
      farmId: farmBId,
      date: '2026-09-12',
      category: 'fertilizer',
      productName: 'Test Fertilizer B',
      amount: 3000,
      notes: 'SCENARIO_53_TEST',
      createdAt: now,
      updatedAt: now
    });

    // Verify Farm B Total = 5,000
    let farmBObj = await db.farms.get(farmBId);
    let allExpB = await db.expenses.where('farmId').equals(farmBId).toArray();
    let totalB = calculateFarmTotals(farmBObj!, allExpB).totalInvestment;

    steps.push({
      step: '2. Farm B initial expenses (2000+3000)',
      expected: '₹5,000',
      actual: `₹${totalB.toLocaleString()}`,
      passed: totalB === 5000
    });

    // 4. Verify All Farms Total = 18,000 while Farm A remains 13,000 and Farm B remains 5,000
    const testFarms = [farmAObj!, farmBObj!];
    const testExpenses = await db.expenses.toArray();
    const scenarioExpenses = testExpenses.filter(e => e.notes === 'SCENARIO_53_TEST');
    
    const summary1 = calculateAllFarmsSummary(testFarms, scenarioExpenses);
    
    steps.push({
      step: '3. All Farms Total (13000 + 5000)',
      expected: '₹18,000',
      actual: `₹${summary1.totalInvestment.toLocaleString()}`,
      passed: summary1.totalInvestment === 18000
    });

    steps.push({
      step: '4. Farm A Data Isolation Check',
      expected: '₹13,000 (Not mixed with B)',
      actual: `₹${totalA.toLocaleString()}`,
      passed: totalA === 13000
    });

    steps.push({
      step: '5. Farm B Data Isolation Check',
      expected: '₹5,000 (Not mixed with A)',
      actual: `₹${totalB.toLocaleString()}`,
      passed: totalB === 5000
    });

    // 5. Edit Farm A pesticide: 2500 -> 3500
    await db.expenses.update(expA1, { amount: 3500, updatedAt: new Date().toISOString() });
    
    let allExpA2 = await db.expenses.where('farmId').equals(farmAId).toArray();
    let totalA2 = calculateFarmTotals(farmAObj!, allExpA2).totalInvestment;

    const testExpenses2 = await db.expenses.toArray();
    const scenarioExpenses2 = testExpenses2.filter(e => e.notes === 'SCENARIO_53_TEST');
    const summary2 = calculateAllFarmsSummary(testFarms, scenarioExpenses2);

    steps.push({
      step: '6. Edit Farm A Pesticide (2500 -> 3500) -> Farm A Total',
      expected: '₹14,000',
      actual: `₹${totalA2.toLocaleString()}`,
      passed: totalA2 === 14000
    });

    steps.push({
      step: '7. All Farms Total after Farm A Edit',
      expected: '₹19,000',
      actual: `₹${summary2.totalInvestment.toLocaleString()}`,
      passed: summary2.totalInvestment === 19000
    });

    // 6. Delete Farm B pesticide (2000)
    await db.expenses.delete(expB1);

    let allExpB2 = await db.expenses.where('farmId').equals(farmBId).toArray();
    let totalB2 = calculateFarmTotals(farmBObj!, allExpB2).totalInvestment;

    const testExpenses3 = await db.expenses.toArray();
    const scenarioExpenses3 = testExpenses3.filter(e => e.notes === 'SCENARIO_53_TEST');
    const summary3 = calculateAllFarmsSummary(testFarms, scenarioExpenses3);

    steps.push({
      step: '8. Delete Farm B Pesticide (2000) -> Farm B Total',
      expected: '₹3,000',
      actual: `₹${totalB2.toLocaleString()}`,
      passed: totalB2 === 3000
    });

    steps.push({
      step: '9. All Farms Total after Farm B Delete',
      expected: '₹17,000',
      actual: `₹${summary3.totalInvestment.toLocaleString()}`,
      passed: summary3.totalInvestment === 17000
    });

    // 7. Cleanup Test Records
    await db.expenses.where('notes').equals('SCENARIO_53_TEST').delete();
    await db.farms.delete(farmAId);
    await db.farms.delete(farmBId);

    logs.push('Scenario #53 Verification completed cleanly and test data was sanitized.');

    const allPassed = steps.every(s => s.passed);

    return {
      success: allPassed,
      timestamp: new Date().toLocaleString(),
      steps,
      logs
    };
  } catch (err: any) {
    logs.push(`Error executing verification test: ${err.message}`);
    return {
      success: false,
      timestamp: new Date().toLocaleString(),
      steps,
      logs
    };
  }
}
