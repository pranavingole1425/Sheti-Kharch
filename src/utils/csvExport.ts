import { Farm, Crop, Expense, Language } from '../types';
import { categoryLabels } from '../i18n/translations';

// Generate CSV string with UTF-8 BOM so Marathi text renders properly in Excel
export function exportExpensesToCSV(
  expenses: Expense[],
  farmsMap: Map<number, Farm>,
  cropsMap: Map<number, Crop>,
  language: Language = 'mr',
  fileNamePrefix: string = 'ShetiKharcha'
): void {
  const isMr = language === 'mr';
  const headers = isMr
    ? ['शेताचे नाव (Farm)', 'तारीख (Date)', 'वर्गवारी (Category)', 'वस्तूचे नाव (Product)', 'प्रमाण (Quantity)', 'रक्कम ₹ (Amount)', 'पिक (Crop)', 'विक्रेता (Vendor)', 'टीप (Notes)']
    : ['Farm Name', 'Date', 'Category', 'Product Name', 'Quantity', 'Amount (INR)', 'Crop', 'Vendor', 'Notes'];

  const rows = expenses.map(exp => {
    const farm = farmsMap.get(exp.farmId);
    const crop = exp.cropId ? cropsMap.get(exp.cropId) : undefined;
    const catObj = categoryLabels[exp.category];
    const catText = isMr ? catObj.mr : catObj.en;

    return [
      farm ? farm.name : `Farm #${exp.farmId}`,
      exp.date,
      catText,
      exp.productName,
      exp.quantity || '',
      exp.amount.toString(),
      crop ? crop.cropName : '',
      exp.vendor || '',
      exp.notes || ''
    ];
  });

  // Escape quotes and commas
  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  // Add UTF-8 BOM (\uFEFF) for Excel Marathi font support
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const dateStr = new Date().toISOString().split('T')[0];
  link.setAttribute('href', url);
  link.setAttribute('download', `${fileNamePrefix}_${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
