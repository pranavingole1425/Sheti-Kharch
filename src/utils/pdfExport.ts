import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Farm, Crop, Expense, Language } from '../types';
import { calculateFarmTotals, calculateAllFarmsSummary } from './calculations';
import { categoryLabels } from '../i18n/translations';

export function exportFarmReportPDF(
  farm: Farm,
  expenses: Expense[],
  crops: Crop[],
  language: Language = 'mr'
): void {
  const isMr = language === 'mr';
  const doc = new jsPDF();
  const totals = calculateFarmTotals(farm, expenses);
  const farmExpenses = expenses.filter(e => e.farmId === farm.id);

  // Title & Header
  doc.setFillColor(27, 94, 32); // Farm Dark Green (#1b5e20)
  doc.rect(0, 0, 210, 35, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.text('SHETI KHARCHA REPORT', 14, 18);
  doc.setFontSize(12);
  doc.text(isMr ? 'शेतीचा प्रत्येक खर्च, आता आपल्या मोबाईलमध्ये' : 'Digital Farming Expense Diary', 14, 27);

  // Farm Metadata Card
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.text(`FARM: ${farm.name.toUpperCase()}`, 14, 45);

  doc.setFontSize(10);
  doc.text(`Area: ${farm.area} ${farm.unit}`, 14, 52);
  doc.text(`Season: ${farm.currentSeason}`, 14, 58);
  doc.text(`Location: ${farm.location || 'N/A'}`, 14, 64);
  doc.text(`Date Generated: ${new Date().toLocaleDateString()}`, 140, 52);

  // Financial Metrics Summary Box
  doc.setFillColor(240, 253, 244); // Light Green (#f0fdf4)
  doc.rect(14, 70, 182, 24, 'F');
  doc.setDrawColor(22, 163, 74);
  doc.rect(14, 70, 182, 24, 'S');

  doc.setFontSize(11);
  doc.setTextColor(21, 128, 61);
  doc.text('TOTAL INVESTMENT', 20, 80);
  doc.text('COST PER ACRE', 85, 80);
  doc.text('TOTAL EXPENSES', 145, 80);

  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text(`INR ${totals.totalInvestment.toLocaleString('en-IN')}`, 20, 89);
  doc.text(`INR ${Math.round(totals.costPerAcre).toLocaleString('en-IN')}`, 85, 89);
  doc.text(`${totals.expenseCount} records`, 145, 89);

  // Category Breakdown Table
  const categoryRows = (Object.keys(totals.categoryBreakdown) as (keyof typeof totals.categoryBreakdown)[])
    .filter(cat => totals.categoryBreakdown[cat] > 0)
    .map(cat => [
      categoryLabels[cat].en,
      `INR ${totals.categoryBreakdown[cat].toLocaleString('en-IN')}`,
      `${Math.round((totals.categoryBreakdown[cat] / (totals.totalInvestment || 1)) * 100)}%`
    ]);

  doc.setFontSize(12);
  doc.setTextColor(27, 94, 32);
  doc.text('Category Wise Breakdown', 14, 104);

  autoTable(doc, {
    startY: 108,
    head: [['Category', 'Amount (INR)', 'Percentage']],
    body: categoryRows.length > 0 ? categoryRows : [['No expenses recorded', 'INR 0', '0%']],
    theme: 'grid',
    headStyles: { fillColor: [27, 94, 32] },
    margin: { left: 14, right: 14 }
  });

  // Detailed Expense List Table
  const lastY = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY + 12 : 150;
  doc.setFontSize(12);
  doc.setTextColor(27, 94, 32);
  doc.text('Detailed Expense History', 14, lastY);

  const expenseRows = farmExpenses.map(exp => [
    exp.date,
    categoryLabels[exp.category].en,
    exp.productName,
    exp.quantity || '-',
    `INR ${exp.amount.toLocaleString('en-IN')}`,
    exp.vendor || '-'
  ]);

  autoTable(doc, {
    startY: lastY + 4,
    head: [['Date', 'Category', 'Product / Item', 'Quantity', 'Amount', 'Vendor']],
    body: expenseRows.length > 0 ? expenseRows : [['-', '-', 'No records found', '-', '-', '-']],
    theme: 'striped',
    headStyles: { fillColor: [22, 163, 74] },
    margin: { left: 14, right: 14 }
  });

  // Save PDF file
  const dateStr = new Date().toISOString().split('T')[0];
  const safeName = farm.name.replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`ShetiKharcha_${safeName}_Report_${dateStr}.pdf`);
}

export function exportAllFarmsReportPDF(
  farms: Farm[],
  expenses: Expense[],
  language: Language = 'mr'
): void {
  const doc = new jsPDF();
  const summary = calculateAllFarmsSummary(farms, expenses);

  // Title Header
  doc.setFillColor(27, 94, 32);
  doc.rect(0, 0, 210, 35, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.text('ALL FARMS COMBINED REPORT', 14, 18);
  doc.setFontSize(12);
  doc.text('SHETI KHARCHA - Complete Farming Summary', 14, 27);

  // Summary Metrics Box
  doc.setFillColor(240, 253, 244);
  doc.rect(14, 45, 182, 28, 'F');
  doc.setDrawColor(22, 163, 74);
  doc.rect(14, 45, 182, 28, 'S');

  doc.setFontSize(10);
  doc.setTextColor(21, 128, 61);
  doc.text('TOTAL FARMS', 20, 54);
  doc.text('TOTAL LAND', 65, 54);
  doc.text('COMBINED INVESTMENT', 115, 54);

  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text(`${summary.totalFarms}`, 20, 64);
  doc.text(`${summary.totalArea} Acres`, 65, 64);
  doc.text(`INR ${summary.totalInvestment.toLocaleString('en-IN')}`, 115, 64);

  // Farm Breakdown Table
  const farmRows = summary.farmBreakdown.map(fb => [
    fb.farmName,
    `${fb.area} ${fb.unit}`,
    `INR ${fb.totalInvestment.toLocaleString('en-IN')}`,
    `INR ${Math.round(fb.costPerAcre).toLocaleString('en-IN')}`,
    `${fb.expenseCount}`
  ]);

  doc.setFontSize(12);
  doc.setTextColor(27, 94, 32);
  doc.text('Farm Wise Summary', 14, 84);

  autoTable(doc, {
    startY: 88,
    head: [['Farm Name', 'Area', 'Total Investment', 'Cost Per Acre', 'Expenses Count']],
    body: farmRows,
    theme: 'grid',
    headStyles: { fillColor: [27, 94, 32] },
    margin: { left: 14, right: 14 }
  });

  // Category Totals Table
  const lastY = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY + 12 : 150;
  const categoryRows = (Object.keys(summary.categoryTotals) as (keyof typeof summary.categoryTotals)[])
    .filter(cat => summary.categoryTotals[cat] > 0)
    .map(cat => [
      categoryLabels[cat].en,
      `INR ${summary.categoryTotals[cat].toLocaleString('en-IN')}`,
      `${Math.round((summary.categoryTotals[cat] / (summary.totalInvestment || 1)) * 100)}%`
    ]);

  doc.setFontSize(12);
  doc.setTextColor(27, 94, 32);
  doc.text('Combined Category Totals Across All Farms', 14, lastY);

  autoTable(doc, {
    startY: lastY + 4,
    head: [['Category', 'Combined Total (INR)', 'Percentage']],
    body: categoryRows,
    theme: 'striped',
    headStyles: { fillColor: [22, 163, 74] },
    margin: { left: 14, right: 14 }
  });

  const dateStr = new Date().toISOString().split('T')[0];
  doc.save(`ShetiKharcha_AllFarms_Report_${dateStr}.pdf`);
}
