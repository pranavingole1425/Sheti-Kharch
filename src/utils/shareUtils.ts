import { Farm, FarmTotals, Expense, AllFarmsSummaryData, FarmerProfile, Language } from '../types';
import { categoryLabels } from '../i18n/translations';

export const formatFarmSummaryShareText = (
  farm: Farm,
  totals: FarmTotals,
  profile?: FarmerProfile | null,
  lang: Language = 'mr'
): string => {
  const isMr = lang === 'mr';
  const farmerHeader = profile?.isLoggedIn && profile.name
    ? `${isMr ? '🧑‍🌾 शेतकरी' : '🧑‍🌾 Farmer'}: ${profile.name}${profile.village ? ` (${profile.village})` : ''}\n`
    : '';

  let text = isMr
    ? `🌾 *शेती खर्चा - शेत अहवाल*\n`
    : `🌾 *SHETI KHARCHA - Farm Financial Summary*\n`;

  text += `${farmerHeader}`;
  text += isMr
    ? `🌱 *शेत:* ${farm.name}\n`
    : `🌱 *Farm:* ${farm.name}\n`;
  text += isMr
    ? `📏 *क्षेत्रफळ:* ${farm.area} ${farm.unit}\n`
    : `📏 *Area:* ${farm.area} ${farm.unit}\n`;
  text += isMr
    ? `🗓️ *हंगाम:* ${farm.currentSeason}\n`
    : `🗓️ *Season:* ${farm.currentSeason}\n`;
  text += `----------------------------------\n`;
  text += isMr
    ? `💰 *एकूण गुंतवणूक:* ₹${totals.totalInvestment.toLocaleString('en-IN')}\n`
    : `💰 *Total Investment:* ₹${totals.totalInvestment.toLocaleString('en-IN')}\n`;
  text += isMr
    ? `📈 *दर ${farm.unit} खर्च:* ₹${Math.round(totals.costPerAcre).toLocaleString('en-IN')}\n`
    : `📈 *Cost per ${farm.unit}:* ₹${Math.round(totals.costPerAcre).toLocaleString('en-IN')}\n`;
  text += isMr
    ? `📅 *या महिन्यातील खर्च:* ₹${totals.thisMonthInvestment.toLocaleString('en-IN')}\n`
    : `📅 *This Month:* ₹${totals.thisMonthInvestment.toLocaleString('en-IN')}\n`;
  text += isMr
    ? `📋 *एकूण खर्च नोंदी:* ${totals.expenseCount}\n`
    : `📋 *Total Expense Records:* ${totals.expenseCount}\n`;

  text += `----------------------------------\n`;
  text += isMr ? `📦 *वर्गवारीनुसार खर्च breakdown:*\n` : `📦 *Category Breakdown:*\n`;

  (Object.keys(totals.categoryBreakdown) as (keyof typeof totals.categoryBreakdown)[]).forEach(cat => {
    const amt = totals.categoryBreakdown[cat];
    if (amt > 0) {
      const catObj = categoryLabels[cat];
      const catName = isMr ? catObj.mr : catObj.en;
      text += `${catObj.icon} ${catName}: ₹${amt.toLocaleString('en-IN')}\n`;
    }
  });

  text += `----------------------------------\n`;
  text += isMr
    ? `📲 Sheti Kharcha App द्वारे तयार केलेला अहवाल.`
    : `📲 Report generated via Sheti Kharcha App.`;

  return text;
};

export const formatAllFarmsSummaryShareText = (
  summary: AllFarmsSummaryData,
  profile?: FarmerProfile | null,
  lang: Language = 'mr'
): string => {
  const isMr = lang === 'mr';
  const farmerHeader = profile?.isLoggedIn && profile.name
    ? `${isMr ? '🧑‍🌾 शेतकरी' : '🧑‍🌾 Farmer'}: ${profile.name}${profile.village ? ` (${profile.village})` : ''}\n`
    : '';

  let text = isMr
    ? `📊 *शेती खर्चा - सर्व शेतीचा एकत्रित अहवाल*\n`
    : `📊 *SHETI KHARCHA - All Farms Combined Summary*\n`;

  text += `${farmerHeader}`;
  text += isMr
    ? `🌱 *एकूण सक्रिय शेते:* ${summary.totalFarms}\n`
    : `🌱 *Total Active Farms:* ${summary.totalFarms}\n`;
  text += isMr
    ? `📏 *एकूण शेती क्षेत्रफळ:* ${summary.totalArea} Acres\n`
    : `📏 *Total Land Area:* ${summary.totalArea} Acres\n`;
  text += isMr
    ? `💰 *एकूण एकत्रित गुंतवणूक:* ₹${summary.totalInvestment.toLocaleString('en-IN')}\n`
    : `💰 *Combined Total Investment:* ₹${summary.totalInvestment.toLocaleString('en-IN')}\n`;
  text += isMr
    ? `📋 *एकूण खर्च नोंदी:* ${summary.totalExpensesCount}\n`
    : `📋 *Total Expense Records:* ${summary.totalExpensesCount}\n`;

  text += `----------------------------------\n`;
  text += isMr ? `🌱 *शेत-निहाय गुंतवणूक:*\n` : `🌱 *Farm Comparison:*\n`;

  summary.farmBreakdown.forEach(fb => {
    text += `• ${fb.farmName} (${fb.area} ${fb.unit}): ₹${fb.totalInvestment.toLocaleString('en-IN')}\n`;
  });

  text += `----------------------------------\n`;
  text += isMr
    ? `📲 Sheti Kharcha App द्वारे पाठवला.`
    : `📲 Shared via Sheti Kharcha App.`;

  return text;
};

export const formatExpenseItemShareText = (
  expense: Expense,
  farmName?: string,
  lang: Language = 'mr'
): string => {
  const isMr = lang === 'mr';
  const catObj = categoryLabels[expense.category];
  const catName = isMr ? catObj.mr : catObj.en;

  let text = isMr
    ? `🧾 *शेती खर्चा पावती (Expense Receipt)*\n`
    : `🧾 *SHETI KHARCHA Expense Receipt*\n`;

  if (farmName) {
    text += `🌱 ${isMr ? 'शेत' : 'Farm'}: ${farmName}\n`;
  }
  text += `🗓️ ${isMr ? 'तारीख' : 'Date'}: ${expense.date}\n`;
  text += `${catObj.icon} ${isMr ? 'वस्तू/खर्च' : 'Item'}: ${expense.productName} (${catName})\n`;
  text += `💰 ${isMr ? 'रक्कम' : 'Amount'}: ₹${expense.amount.toLocaleString('en-IN')}\n`;
  if (expense.quantity) {
    text += `📦 ${isMr ? 'प्रमाण' : 'Quantity'}: ${expense.quantity}\n`;
  }
  if (expense.vendor) {
    text += `🏪 ${isMr ? 'विक्रेता' : 'Vendor'}: ${expense.vendor}\n`;
  }

  text += `----------------------------------\n`;
  text += isMr
    ? `📲 Sheti Kharcha App द्वारे पाठवले.`
    : `📲 Sent via Sheti Kharcha App.`;

  return text;
};

export const formatAppShareText = (lang: Language = 'mr'): string => {
  return lang === 'mr'
    ? `🌾 *शेती खर्चा (Sheti Kharcha App)*\n\nशेतीचा प्रत्येक खर्च, खते, औषधे, मजुरी आणि ट्रॅक्टर खर्चाचा हिशोब ठेवा अत्यंत सोप्या पद्धतीने!\n\n१००% मोफत व सुरक्षित ॲप. आताच वापरा!`
    : `🌾 *SHETI KHARCHA APP*\n\nTrack every farm expense, pesticides, fertilizers, labor, and machinery costs easily on your mobile!\n\n100% free, offline & secure app for farmers. Try it now!`;
};

export const shareContent = async (data: {
  title?: string;
  text: string;
  url?: string;
}): Promise<{ shared: boolean; copied: boolean }> => {
  const shareData = {
    title: data.title || 'Sheti Kharcha',
    text: data.text,
    url: data.url || window.location.href
  };

  if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
    try {
      await navigator.share(shareData);
      return { shared: true, copied: false };
    } catch (e) {
      console.log('Native share canceled or failed', e);
    }
  }

  // Fallback to WhatsApp link opening
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(data.text)}`;
  window.open(whatsappUrl, '_blank');

  return { shared: false, copied: false };
};
