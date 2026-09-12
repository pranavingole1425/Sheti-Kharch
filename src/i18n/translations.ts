import { Language, ExpenseCategory, AreaUnit } from '../types';

export interface Translations {
  appName: string;
  tagline: string;
  myFarms: string;
  addFarm: string;
  editFarm: string;
  deleteFarm: string;
  archiveFarm: string;
  unarchiveFarm: string;
  archivedFarms: string;
  activeFarms: string;
  farmName: string;
  farmLocation: string;
  area: string;
  unit: string;
  currentSeason: string;
  notes: string;
  saveFarm: string;
  farmAddedSuccess: string;
  farmUpdatedSuccess: string;
  farmDeletedSuccess: string;
  farmArchivedSuccess: string;
  deleteFarmConfirm: string;
  deleteFarmSubConfirm: string;
  
  // Dashboard & Totals
  totalInvestment: string;
  thisMonth: string;
  totalExpenses: string;
  costPerAcre: string;
  allFarmsSummary: string;
  allFarmsReport: string;
  farmWiseExpenses: string;
  addExpense: string;
  selectFarm: string;
  selectFarmPlaceholder: string;
  farmContextSelected: string;
  
  // Expense Form
  expenseDetails: string;
  date: string;
  category: string;
  productName: string;
  quantity: string;
  amount: string;
  crop: string;
  selectCrop: string;
  vendor: string;
  saveExpense: string;
  expenseSavedSuccess: string;
  expenseDeletedSuccess: string;
  deleteExpenseConfirm: string;
  
  // Categories
  catPesticide: string;
  catFertilizer: string;
  catSeeds: string;
  catLabour: string;
  catIrrigation: string;
  catMachinery: string;
  catFuel: string;
  catTransportation: string;
  catHarvesting: string;
  catOther: string;

  // History & Filters
  expenseHistory: string;
  search: string;
  searchPlaceholder: string;
  filterBy: string;
  allTime: string;
  today: string;
  thisWeek: string;
  thisMonthFilter: string;
  previousMonth: string;
  currentSeasonFilter: string;
  customRange: string;
  allCategories: string;
  allCrops: string;
  noExpensesRecorded: string;
  addFirstExpense: string;
  noFarmsFound: string;
  addFirstFarm: string;

  // Crop / Season Manager
  cropsSeasons: string;
  addCrop: string;
  cropName: string;
  plantingDate: string;
  harvestDate: string;
  cropSavedSuccess: string;
  
  // Timeline
  expenseTimeline: string;
  stageLandPrep: string;
  stageSeeds: string;
  stagePlanting: string;
  stagePesticide: string;
  stageFertilizer: string;
  stageIrrigation: string;
  stageLabour: string;
  stageHarvesting: string;

  // Navigation
  navFarms: string;
  navAdd: string;
  navReports: string;
  navSettings: string;
  back: string;

  // Reports & Analytics
  reports: string;
  exportPdf: string;
  exportCsv: string;
  farmWiseInvestment: string;
  categoryWiseInvestment: string;
  monthlyTrend: string;
  period: string;

  // Settings & Security
  settings: string;
  language: string;
  appLock: string;
  enableAppLock: string;
  setPin: string;
  enterPin: string;
  pinPlaceholder: string;
  wrongPin: string;
  pinSaved: string;
  backupRestore: string;
  backupNow: string;
  restoreBackup: string;
  encryptedBackup: string;
  enterBackupPassword: string;
  dataLossWarning: string;
  clearDemoData: string;
  clearAllData: string;
  clearAllDataConfirm: string;
  runScenario53: string;
  runScenario53Sub: string;
  offlineReady: string;
  demoDataCleared: string;
  dataClearedSuccess: string;
  restoreSuccess: string;

  // Validation
  errRequiredFarmName: string;
  errRequiredArea: string;
  errRequiredAmount: string;
  errRequiredCategory: string;
  errRequiredProduct: string;
  errSelectFarm: string;

  // Share & Farmer Login
  share: string;
  shareApp: string;
  shareReport: string;
  shareSummary: string;
  shareViaWhatsapp: string;
  copyToClipboard: string;
  copiedToClipboard: string;
  shareExpense: string;
  farmerLogin: string;
  farmerProfile: string;
  loginAsFarmer: string;
  farmerName: string;
  mobileNumber: string;
  village: string;
  saveProfile: string;
  welcomeFarmer: string;
  logoutFarmer: string;
  farmerLoggedInSuccess: string;
}

export const translations: Record<Language, Translations> = {
  mr: {
    appName: 'शेती खर्चा',
    tagline: 'शेतीचा प्रत्येक खर्च, आता आपल्या मोबाईलमध्ये.',
    myFarms: 'माझी शेते',
    addFarm: '+ शेत जोडा',
    editFarm: 'शेत दुरुस्त करा',
    deleteFarm: 'शेत हटवा',
    archiveFarm: 'शेत संग्रहित करा (Archive)',
    unarchiveFarm: 'संग्रहातून बाहेर काढा',
    archivedFarms: 'संग्रहित शेते',
    activeFarms: 'सक्रिय शेते',
    farmName: 'शेताचे नाव',
    farmLocation: 'शेताचे ठिकाण / परिसर',
    area: 'क्षेत्रफळ',
    unit: 'एकक (Unit)',
    currentSeason: 'सध्याचा हंगाम',
    notes: 'विशेष टीप / माहिती',
    saveFarm: '💾 शेत जतन करा',
    farmAddedSuccess: 'शेत यशस्वीरित्या जोडले.',
    farmUpdatedSuccess: 'शेत माहिती अपडेट केली.',
    farmDeletedSuccess: 'शेत हटवले.',
    farmArchivedSuccess: 'शेत यशस्वीरित्या संग्रहित केले.',
    deleteFarmConfirm: 'हे शेत आणि त्याच्याशी संबंधित खर्च हटवायचे आहेत का?',
    deleteFarmSubConfirm: 'ही कृती परत घेता येणार नाही. सर्व खर्च इतिहास हटवला जाईल.',

    totalInvestment: 'एकूण गुंतवणूक',
    thisMonth: 'या महिन्यातील खर्च',
    totalExpenses: 'एकूण खर्च नोंदी',
    costPerAcre: 'दर एकरी / एकक खर्च',
    allFarmsSummary: 'सर्व शेतीचा एकत्रित अहवाल',
    allFarmsReport: 'एकत्रित शेती रिपोर्ट',
    farmWiseExpenses: 'शेत-निहाय खर्च',
    addExpense: '+ खर्च जोडा',
    selectFarm: 'शेत निवडा (अनिवार्य)',
    selectFarmPlaceholder: '-- शेत निवडा --',
    farmContextSelected: 'निवडलेले शेत',

    expenseDetails: 'खर्च तपशील',
    date: 'तारीख',
    category: 'वर्गवारी (Category)',
    productName: 'खर्चाचे / वस्तूचे नाव',
    quantity: 'प्रमाण (उदा. २ बाटल्या, ५ पोती)',
    amount: 'रक्कम (₹)',
    crop: 'पिक',
    selectCrop: '-- पिक निवडा --',
    vendor: 'दुकानाचे / विक्रेत्याचे नाव',
    saveExpense: '💾 खर्च जतन करा',
    expenseSavedSuccess: 'खर्च यशस्वीरित्या जतन केला.',
    expenseDeletedSuccess: 'खर्च हटवला.',
    deleteExpenseConfirm: 'हा खर्च इतिहासामधून हटवायचा का?',

    catPesticide: '💊 औषधे (Pesticide)',
    catFertilizer: '🌱 खते (Fertilizer)',
    catSeeds: '🌾 बियाणे (Seeds)',
    catLabour: '👷 मजुरी (Labour)',
    catIrrigation: '💧 पाणी / ठिबक (Irrigation)',
    catMachinery: '🚜 ट्रॅक्टर / यंत्रे (Machinery)',
    catFuel: '⛽ डिझेल / इंधन (Fuel)',
    catTransportation: '🚚 वाहतूक (Transportation)',
    catHarvesting: '🌾 काढणी / तोडणी (Harvesting)',
    catOther: '📦 इतर खर्च (Other)',

    expenseHistory: 'खर्च इतिहास',
    search: 'शोधा',
    searchPlaceholder: 'खर्च / औषध / खत शोधा...',
    filterBy: 'गाळणी (Filter)',
    allTime: 'सर्व काळ',
    today: 'आज',
    thisWeek: 'या आठवड्यात',
    thisMonthFilter: 'या महिन्यात',
    previousMonth: 'मागील महिन्यात',
    currentSeasonFilter: 'सध्याचा हंगाम',
    customRange: 'ठराविक तारीख',
    allCategories: 'सर्व वर्गवारी',
    allCrops: 'सर्व पिके',
    noExpensesRecorded: 'या शेतासाठी अजून कोणताही खर्च नोंदवलेला नाही.',
    addFirstExpense: '+ पहिला खर्च नोंदवा',
    noFarmsFound: 'अजून एकही शेत जोडलेले नाही.',
    addFirstFarm: '+ पहिले शेत जोडा',

    cropsSeasons: 'पिके आणि हंगाम',
    addCrop: '+ नवीन पिक जोडा',
    cropName: 'पिकाचे नाव',
    plantingDate: 'लागवड / पेरणी तारीख',
    harvestDate: 'अपेक्षित काढणी तारीख',
    cropSavedSuccess: 'पिक यशस्वीरित्या जतन केले.',

    expenseTimeline: 'शेत कामे व खर्च टप्पे',
    stageLandPrep: '🌱 मशागत',
    stageSeeds: '🌾 बियाणे',
    stagePlanting: '🌱 लागवड',
    stagePesticide: '💊 फवारणी / औषधे',
    stageFertilizer: '🌱 खत व्यवस्थापन',
    stageIrrigation: '💧 पाणी व्यवस्थापन',
    stageLabour: '👷 मजुरी कामे',
    stageHarvesting: '🌾 काढणी व तोडणी',

    navFarms: 'माझी शेते',
    navAdd: 'खर्च जोडा',
    navReports: 'अहवाल',
    navSettings: 'सेटिंग्ज',
    back: 'मागे',

    reports: 'अहवाल आणि चार्ट्स',
    exportPdf: '📄 PDF रिपोर्ट डाउनलोड करा',
    exportCsv: '📊 CSV डेटा एक्सपोर्ट',
    farmWiseInvestment: 'शेत-निहाय गुंतवणूक तुलना',
    categoryWiseInvestment: 'वर्गवारी-निहाय एकूण खर्च',
    monthlyTrend: 'महिना-निहाय खर्चाचा आलेख',
    period: 'कालावधी',

    settings: 'ॲप सेटिंग्ज आणि सुरक्षा',
    language: 'भाषा (Language)',
    appLock: '🔒 ॲप लॉक (PIN)',
    enableAppLock: 'PIN सुरक्षा सुरु करा',
    setPin: '४-अंकी PIN टाका',
    enterPin: 'सुरक्षेसाठी PIN प्रविष्ट करा',
    pinPlaceholder: '••••',
    wrongPin: 'चुकलेला PIN! पुन्हा प्रयत्न करा.',
    pinSaved: 'PIN यशस्वीरित्या सेट केला.',
    backupRestore: '💾 डेटा बॅकअप व रिस्टोर',
    backupNow: '💾 आताच बॅकअप डाउनलोड करा',
    restoreBackup: '♻️ बॅकअप रिस्टोर करा',
    encryptedBackup: 'पासवर्डने सुरक्षित बॅकअप',
    enterBackupPassword: 'सुरक्षा पासवर्ड प्रविष्ट करा',
    dataLossWarning: 'आपली शेतीची माहिती या मोबाईलमध्ये साठवली जाते. मोबाईल हरवल्यास, रिसेट केल्यास किंवा डेटा हटवल्यास बॅकअप नसल्यास माहिती गमावली जाऊ शकते.',
    clearDemoData: 'डेमो डेटा हटवा (Clear Demo Data)',
    clearAllData: 'सर्व डेटा हटवा (Clear All Data)',
    clearAllDataConfirm: 'यामुळे सर्व शेते आणि खर्च कायमचे हटवले जातील! तरीही हटवायचे का?',
    runScenario53: '🧪 नियम क्र. ५३ स्वयंचलित चाचणी',
    runScenario53Sub: 'सर्व शेत-निहाय गणितीय सूत्रे व अलगीकरणाची पडताळणी करा',
    offlineReady: 'ॲप पूर्णपणे ऑफलाइन चालण्यासाठी तयार आहे.',
    demoDataCleared: 'डेमो डेटा हटवला.',
    dataClearedSuccess: 'सर्व डेटा हटवला गेला.',
    restoreSuccess: 'बॅकअप यशस्वीरित्या रिस्टोर केला.',

    errRequiredFarmName: 'कृपया शेताचे नाव टाका.',
    errRequiredArea: 'क्षेत्रफळ ० पेक्षा जास्त असणे आवश्यक आहे.',
    errRequiredAmount: 'खर्चाची रक्कम ० पेक्षा जास्त असणे आवश्यक आहे.',
    errRequiredCategory: 'कृपया वर्गवारी निवडा.',
    errRequiredProduct: 'कृपया खर्चाचे किंवा वस्तूचे नाव टाका.',
    errSelectFarm: 'कृपया खर्च जोडण्यासाठी शेत निवडा.',

    share: 'शेअर करा',
    shareApp: 'ॲप शेअर करा',
    shareReport: 'अहवाल शेअर करा',
    shareSummary: 'सारांश शेअर करा',
    shareViaWhatsapp: 'WhatsApp वर शेअर करा',
    copyToClipboard: 'माहिती कॉपी करा',
    copiedToClipboard: 'माहिती क्लिपबोर्डवर कॉपी झाली!',
    shareExpense: 'खर्च शेअर करा',
    farmerLogin: 'शेतकरी लॉगिन',
    farmerProfile: 'शेतकरी प्रोफाईल',
    loginAsFarmer: '🧑‍🌾 शेतकरी म्हणून लॉगिन करा',
    farmerName: 'शेतकऱ्याचे नाव',
    mobileNumber: 'मोबाईल नंबर',
    village: 'गाव / परिसर',
    saveProfile: '💾 प्रोफाईल जतन करा',
    welcomeFarmer: 'सुस्वागतम',
    logoutFarmer: 'लॉगआउट करा',
    farmerLoggedInSuccess: 'शेतकरी लॉगिन यशस्वी!'
  },
  en: {
    appName: 'SHETI KHARCHA',
    tagline: 'Every farm expense, now on your mobile.',
    myFarms: 'My Farms',
    addFarm: '+ Add Farm',
    editFarm: 'Edit Farm',
    deleteFarm: 'Delete Farm',
    archiveFarm: 'Archive Farm',
    unarchiveFarm: 'Unarchive Farm',
    archivedFarms: 'Archived Farms',
    activeFarms: 'Active Farms',
    farmName: 'Farm Name',
    farmLocation: 'Farm Location / Area',
    area: 'Area',
    unit: 'Unit',
    currentSeason: 'Current Season',
    notes: 'Notes / Description',
    saveFarm: '💾 Save Farm',
    farmAddedSuccess: 'Farm added successfully.',
    farmUpdatedSuccess: 'Farm updated successfully.',
    farmDeletedSuccess: 'Farm deleted successfully.',
    farmArchivedSuccess: 'Farm archived successfully.',
    deleteFarmConfirm: 'Do you want to delete this farm and its associated records?',
    deleteFarmSubConfirm: 'This action cannot be undone. All expense history for this farm will be permanently erased.',

    totalInvestment: 'Total Investment',
    thisMonth: 'This Month',
    totalExpenses: 'Total Expenses',
    costPerAcre: 'Cost Per Acre / Unit',
    allFarmsSummary: 'All Farms Summary',
    allFarmsReport: 'All Farms Combined Report',
    farmWiseExpenses: 'Farm-Wise Expenses',
    addExpense: '+ Add Expense',
    selectFarm: 'Select Farm (Mandatory)',
    selectFarmPlaceholder: '-- Select Farm --',
    farmContextSelected: 'Selected Farm',

    expenseDetails: 'Expense Details',
    date: 'Date',
    category: 'Category',
    productName: 'Product / Expense Name',
    quantity: 'Quantity (e.g. 2 bottles, 5 bags)',
    amount: 'Amount (₹)',
    crop: 'Crop',
    selectCrop: '-- Select Crop --',
    vendor: 'Shop / Vendor Name',
    saveExpense: '💾 Save Expense',
    expenseSavedSuccess: 'Expense saved successfully.',
    expenseDeletedSuccess: 'Expense deleted.',
    deleteExpenseConfirm: 'Delete this expense record?',

    catPesticide: '💊 Pesticide',
    catFertilizer: '🌱 Fertilizer',
    catSeeds: '🌾 Seeds',
    catLabour: '👷 Labour',
    catIrrigation: '💧 Irrigation',
    catMachinery: '🚜 Machinery',
    catFuel: '⛽ Fuel / Diesel',
    catTransportation: '🚚 Transportation',
    catHarvesting: '🌾 Harvesting',
    catOther: '📦 Other',

    expenseHistory: 'Expense History',
    search: 'Search',
    searchPlaceholder: 'Search expenses, chemicals, fertilizers...',
    filterBy: 'Filter By',
    allTime: 'All Time',
    today: 'Today',
    thisWeek: 'This Week',
    thisMonthFilter: 'This Month',
    previousMonth: 'Previous Month',
    currentSeasonFilter: 'Current Season',
    customRange: 'Custom Date Range',
    allCategories: 'All Categories',
    allCrops: 'All Crops',
    noExpensesRecorded: 'No expenses recorded for this farm yet.',
    addFirstExpense: '+ Add First Expense',
    noFarmsFound: 'No farms added yet.',
    addFirstFarm: '+ Add First Farm',

    cropsSeasons: 'Crops & Seasons',
    addCrop: '+ Add New Crop',
    cropName: 'Crop Name',
    plantingDate: 'Planting / Sowing Date',
    harvestDate: 'Expected Harvest Date',
    cropSavedSuccess: 'Crop saved successfully.',

    expenseTimeline: 'Farm Work & Expense Stages',
    stageLandPrep: '🌱 Land Preparation',
    stageSeeds: '🌾 Seeds',
    stagePlanting: '🌱 Planting',
    stagePesticide: '💊 Pesticides',
    stageFertilizer: '🌱 Fertilizers',
    stageIrrigation: '💧 Irrigation',
    stageLabour: '👷 Labour',
    stageHarvesting: '🌾 Harvesting',

    navFarms: 'Farms',
    navAdd: 'Add Expense',
    navReports: 'Reports',
    navSettings: 'Settings',
    back: 'Back',

    reports: 'Reports & Analytics',
    exportPdf: '📄 Export PDF Report',
    exportCsv: '📊 Export CSV Data',
    farmWiseInvestment: 'Farm-Wise Investment Comparison',
    categoryWiseInvestment: 'Category-Wise Total Investment',
    monthlyTrend: 'Monthly Expense Trend',
    period: 'Period',

    settings: 'App Settings & Security',
    language: 'Language',
    appLock: '🔒 App Lock (PIN)',
    enableAppLock: 'Enable PIN Lock',
    setPin: 'Set 4-Digit PIN',
    enterPin: 'Enter PIN to unlock',
    pinPlaceholder: '••••',
    wrongPin: 'Incorrect PIN! Please try again.',
    pinSaved: 'PIN saved successfully.',
    backupRestore: '💾 Backup & Restore',
    backupNow: '💾 Backup Now',
    restoreBackup: '♻️ Restore Backup',
    encryptedBackup: 'Password Protected Backup',
    enterBackupPassword: 'Enter Security Password',
    dataLossWarning: 'Your farming information is stored on this device. If the phone is lost, reset, or application storage is cleared, your data may be lost unless you have a backup.',
    clearDemoData: 'Clear Demo Data',
    clearAllData: 'Clear All Data',
    clearAllDataConfirm: 'THIS WILL PERMANENTLY DELETE ALL FARMS AND EXPENSES. Are you sure?',
    runScenario53: '🧪 Run Automated Test (Scenario #53)',
    runScenario53Sub: 'Verify strict farm isolation and calculation formulas',
    offlineReady: 'App is ready for 100% offline usage.',
    demoDataCleared: 'Demo data cleared.',
    dataClearedSuccess: 'All data cleared successfully.',
    restoreSuccess: 'Backup restored successfully.',

    errRequiredFarmName: 'Please enter farm name.',
    errRequiredArea: 'Farm area must be greater than 0.',
    errRequiredAmount: 'Amount must be greater than 0.',
    errRequiredCategory: 'Please select a category.',
    errRequiredProduct: 'Please enter product or expense name.',
    errSelectFarm: 'Please select a farm for this expense.',

    share: 'Share',
    shareApp: 'Share App',
    shareReport: 'Share Report',
    shareSummary: 'Share Summary',
    shareViaWhatsapp: 'Share on WhatsApp',
    copyToClipboard: 'Copy Summary',
    copiedToClipboard: 'Summary copied to clipboard!',
    shareExpense: 'Share Expense',
    farmerLogin: 'Farmer Login',
    farmerProfile: 'Farmer Profile',
    loginAsFarmer: '🧑‍🌾 Login as Farmer',
    farmerName: 'Farmer Name',
    mobileNumber: 'Mobile Number',
    village: 'Village / Location',
    saveProfile: '💾 Save Profile',
    welcomeFarmer: 'Welcome',
    logoutFarmer: 'Logout',
    farmerLoggedInSuccess: 'Farmer logged in successfully!'
  }
};

export const categoryLabels: Record<ExpenseCategory, { mr: string; en: string; icon: string }> = {
  pesticide: { mr: 'औषधे (Pesticide)', en: 'Pesticide', icon: '💊' },
  fertilizer: { mr: 'खते (Fertilizer)', en: 'Fertilizer', icon: '🌱' },
  seeds: { mr: 'बियाणे (Seeds)', en: 'Seeds', icon: '🌾' },
  labour: { mr: 'मजुरी (Labour)', en: 'Labour', icon: '👷' },
  irrigation: { mr: 'पाणी / ठिबक (Irrigation)', en: 'Irrigation', icon: '💧' },
  machinery: { mr: 'ट्रॅक्टर / यंत्रे (Machinery)', en: 'Machinery', icon: '🚜' },
  fuel: { mr: 'डिझेल / इंधन (Fuel)', en: 'Fuel / Diesel', icon: '⛽' },
  transportation: { mr: 'वाहतूक (Transportation)', en: 'Transportation', icon: '🚚' },
  harvesting: { mr: 'काढणी / तोडणी (Harvesting)', en: 'Harvesting', icon: '🌾' },
  other: { mr: 'इतर खर्च (Other)', en: 'Other', icon: '📦' }
};

export const unitLabels: Record<AreaUnit, { mr: string; en: string }> = {
  Acre: { mr: 'एकड (Acre)', en: 'Acre' },
  Hectare: { mr: 'हेक्टर (Hectare)', en: 'Hectare' },
  Guntha: { mr: 'गुंठा (Guntha)', en: 'Guntha' }
};
