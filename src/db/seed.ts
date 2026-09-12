import { db } from './db';
import { Farm, Crop, Expense } from '../types';

export async function seedDemoData(): Promise<void> {
  const existingFarms = await db.farms.count();
  if (existingFarms > 0) return; // Don't seed if data already exists

  const now = new Date().toISOString();

  // 1. Create Farms
  const farm1Id = await db.farms.add({
    name: 'Main Farm (मुख्य शेत)',
    location: 'Shivajinagar / Shivar 1',
    area: 5,
    unit: 'Acre',
    currentSeason: 'Kharif 2026',
    notes: 'Primary cotton production field with drip irrigation',
    status: 'active',
    createdAt: now,
    updatedAt: now
  });

  const farm2Id = await db.farms.add({
    name: 'River Side Farm (नदी काठ शेत)',
    location: 'Near River Bed',
    area: 3,
    unit: 'Acre',
    currentSeason: 'Kharif 2026',
    notes: 'Fertile black soil near river',
    status: 'active',
    createdAt: now,
    updatedAt: now
  });

  const farm3Id = await db.farms.add({
    name: 'Village Farm (गाव शेत)',
    location: 'North Boundary',
    area: 4,
    unit: 'Acre',
    currentSeason: 'Kharif 2026',
    notes: 'Well water available',
    status: 'active',
    createdAt: now,
    updatedAt: now
  });

  const farm4Id = await db.farms.add({
    name: 'East Field (पूर्व शेत)',
    location: 'East Side Road',
    area: 2,
    unit: 'Acre',
    currentSeason: 'Kharif 2026',
    notes: 'High yield chili field',
    status: 'active',
    createdAt: now,
    updatedAt: now
  });

  const farm5Id = await db.farms.add({
    name: 'Home Field (घर शेत)',
    location: 'Behind House',
    area: 3,
    unit: 'Acre',
    currentSeason: 'Kharif 2026',
    notes: 'Wheat crop field',
    status: 'active',
    createdAt: now,
    updatedAt: now
  });

  // 2. Create Crops/Seasons
  const crop1Id = await db.crops.add({
    farmId: farm1Id,
    cropName: 'Cotton (कापूस)',
    season: 'Kharif 2026',
    plantingDate: '2026-06-15',
    expectedHarvestDate: '2026-11-30',
    area: 5,
    notes: 'Bt Cotton 7588',
    createdAt: now,
    updatedAt: now
  });

  const crop2Id = await db.crops.add({
    farmId: farm2Id,
    cropName: 'Soybean (सोयाबीन)',
    season: 'Kharif 2026',
    plantingDate: '2026-06-20',
    expectedHarvestDate: '2026-10-15',
    area: 3,
    notes: 'JS 335 Soybean',
    createdAt: now,
    updatedAt: now
  });

  const crop3Id = await db.crops.add({
    farmId: farm3Id,
    cropName: 'Cotton (कापूस)',
    season: 'Kharif 2026',
    plantingDate: '2026-06-18',
    expectedHarvestDate: '2026-12-05',
    area: 4,
    notes: 'Kharif Cotton',
    createdAt: now,
    updatedAt: now
  });

  const crop4Id = await db.crops.add({
    farmId: farm4Id,
    cropName: 'Chilli (मिरची)',
    season: 'Kharif 2026',
    plantingDate: '2026-07-01',
    expectedHarvestDate: '2026-12-15',
    area: 2,
    notes: 'Red Chilli',
    createdAt: now,
    updatedAt: now
  });

  const crop5Id = await db.crops.add({
    farmId: farm5Id,
    cropName: 'Wheat (गहू)',
    season: 'Kharif 2026',
    plantingDate: '2026-07-05',
    expectedHarvestDate: '2026-11-20',
    area: 3,
    notes: 'Lokwan Wheat',
    createdAt: now,
    updatedAt: now
  });

  // 3. Add Expenses for Farm 1 (Main Farm) -> Total = ₹35,500
  // (Pesticides ₹8000, Fertilizers ₹12000, Seeds ₹5000, Labour ₹7000, Other ₹3500)
  const farm1Expenses: Omit<Expense, 'id'>[] = [
    {
      farmId: farm1Id,
      cropId: crop1Id,
      date: '2026-06-10',
      category: 'seeds',
      productName: 'Cotton Seeds (कापूस बियाणे)',
      quantity: '5 packets',
      amount: 5000,
      vendor: 'Kisan Krushi Seva Kendra',
      notes: 'DEMO DATA - Certified seeds',
      createdAt: now,
      updatedAt: now
    },
    {
      farmId: farm1Id,
      cropId: crop1Id,
      date: '2026-06-25',
      category: 'fertilizer',
      productName: 'DAP & Urea (डीएपी आणि युरिया)',
      quantity: '4 bags DAP, 2 bags Urea',
      amount: 12000,
      vendor: 'Mahesh Fertilisers',
      notes: 'DEMO DATA - Basal dose',
      createdAt: now,
      updatedAt: now
    },
    {
      farmId: farm1Id,
      cropId: crop1Id,
      date: '2026-07-15',
      category: 'pesticide',
      productName: 'Coragen & Insecticide (कोराजन)',
      quantity: '2 bottles 150ml',
      amount: 8000,
      vendor: 'Kisan Krushi Seva',
      notes: 'DEMO DATA - Pink bollworm spray',
      createdAt: now,
      updatedAt: now
    },
    {
      farmId: farm1Id,
      cropId: crop1Id,
      date: '2026-08-05',
      category: 'labour',
      productName: 'Weeding & Hoeing Labour (खुरपणी मजुरी)',
      quantity: '7 workers',
      amount: 7000,
      vendor: 'Local Farm Workers',
      notes: 'DEMO DATA - Field weeding',
      createdAt: now,
      updatedAt: now
    },
    {
      farmId: farm1Id,
      cropId: crop1Id,
      date: '2026-09-02',
      category: 'other',
      productName: 'Drip Pipe Repair & Fitting (ठिबक दुरुस्ती)',
      quantity: '1 set',
      amount: 3500,
      vendor: 'Jain Drip Depot',
      notes: 'DEMO DATA - Lateral repair',
      createdAt: now,
      updatedAt: now
    }
  ];

  // Farm 2 (River Side Farm) -> Total = ₹24,000
  // (Pesticides ₹5000, Fertilizers ₹8000, Seeds ₹4000, Labour ₹7000)
  const farm2Expenses: Omit<Expense, 'id'>[] = [
    {
      farmId: farm2Id,
      cropId: crop2Id,
      date: '2026-06-18',
      category: 'seeds',
      productName: 'Soybean Seeds (सोयाबीन बियाणे)',
      quantity: '3 bags',
      amount: 4000,
      vendor: 'MahaBeej Kendra',
      notes: 'DEMO DATA',
      createdAt: now,
      updatedAt: now
    },
    {
      farmId: farm2Id,
      cropId: crop2Id,
      date: '2026-07-02',
      category: 'fertilizer',
      productName: '10:26:26 Fertilizer (खत)',
      quantity: '3 bags',
      amount: 8000,
      vendor: 'Shree Krushi',
      notes: 'DEMO DATA',
      createdAt: now,
      updatedAt: now
    },
    {
      farmId: farm2Id,
      cropId: crop2Id,
      date: '2026-07-28',
      category: 'pesticide',
      productName: 'Fungicide Spray (बुरशीनाशक)',
      quantity: '1 litre',
      amount: 5000,
      vendor: 'Kisan Kendra',
      notes: 'DEMO DATA',
      createdAt: now,
      updatedAt: now
    },
    {
      farmId: farm2Id,
      cropId: crop2Id,
      date: '2026-08-20',
      category: 'labour',
      productName: 'Spraying & Weeding Labour (फवारणी मजुरी)',
      quantity: '5 workers',
      amount: 7000,
      vendor: 'Local Group',
      notes: 'DEMO DATA',
      createdAt: now,
      updatedAt: now
    }
  ];

  // Farm 3 (Village Farm) -> Total = ₹41,500
  const farm3Expenses: Omit<Expense, 'id'>[] = [
    {
      farmId: farm3Id,
      cropId: crop3Id,
      date: '2026-06-12',
      category: 'seeds',
      productName: 'Hybrid Cotton Seeds (हायब्रिड बियाणे)',
      quantity: '4 packets',
      amount: 6500,
      vendor: 'Gromor Kendra',
      notes: 'DEMO DATA',
      createdAt: now,
      updatedAt: now
    },
    {
      farmId: farm3Id,
      cropId: crop3Id,
      date: '2026-06-30',
      category: 'machinery',
      productName: 'Tractor Ploughing (ट्रॅक्टर नांगरणी)',
      quantity: '6 hours',
      amount: 10000,
      vendor: 'Ramesh Tractor Services',
      notes: 'DEMO DATA',
      createdAt: now,
      updatedAt: now
    },
    {
      farmId: farm3Id,
      cropId: crop3Id,
      date: '2026-07-20',
      category: 'fertilizer',
      productName: 'Complex Fertilizers (मिश्र खत)',
      quantity: '5 bags',
      amount: 14000,
      vendor: 'Mahesh Fertilisers',
      notes: 'DEMO DATA',
      createdAt: now,
      updatedAt: now
    },
    {
      farmId: farm3Id,
      cropId: crop3Id,
      date: '2026-08-14',
      category: 'pesticide',
      productName: 'Insecticide & Tonic (कीटकनाशक)',
      quantity: '2 bottles',
      amount: 6000,
      vendor: 'Kisan Kendra',
      notes: 'DEMO DATA',
      createdAt: now,
      updatedAt: now
    },
    {
      farmId: farm3Id,
      cropId: crop3Id,
      date: '2026-09-01',
      category: 'labour',
      productName: 'Planting & Thinning Labour',
      quantity: '5 workers',
      amount: 5000,
      vendor: 'Village Labour',
      notes: 'DEMO DATA',
      createdAt: now,
      updatedAt: now
    }
  ];

  // Farm 4 (East Field) -> Total = ₹28,000
  const farm4Expenses: Omit<Expense, 'id'>[] = [
    {
      farmId: farm4Id,
      cropId: crop4Id,
      date: '2026-07-02',
      category: 'seeds',
      productName: 'Chilli Saplings / Seedlings (मिरची रोपे)',
      quantity: '4000 plants',
      amount: 8000,
      vendor: 'Nursery House',
      notes: 'DEMO DATA',
      createdAt: now,
      updatedAt: now
    },
    {
      farmId: farm4Id,
      cropId: crop4Id,
      date: '2026-07-22',
      category: 'fertilizer',
      productName: '19:19:19 & Micronutrients (सुलभ खते)',
      quantity: '25 kg',
      amount: 7000,
      vendor: 'Kisan Seva',
      notes: 'DEMO DATA',
      createdAt: now,
      updatedAt: now
    },
    {
      farmId: farm4Id,
      cropId: crop4Id,
      date: '2026-08-10',
      category: 'pesticide',
      productName: 'Thrips & Mite Control (थ्रिप्स औषध)',
      quantity: '1.5 litres',
      amount: 7000,
      vendor: 'Mahesh Fertilisers',
      notes: 'DEMO DATA',
      createdAt: now,
      updatedAt: now
    },
    {
      farmId: farm4Id,
      cropId: crop4Id,
      date: '2026-08-30',
      category: 'labour',
      productName: 'Mulching Paper Layout Labour',
      quantity: '4 workers',
      amount: 6000,
      vendor: 'Local Labour',
      notes: 'DEMO DATA',
      createdAt: now,
      updatedAt: now
    }
  ];

  // Farm 5 (Home Field) -> Total = ₹27,500
  const farm5Expenses: Omit<Expense, 'id'>[] = [
    {
      farmId: farm5Id,
      cropId: crop5Id,
      date: '2026-07-06',
      category: 'seeds',
      productName: 'Wheat Seeds (गहू बियाणे)',
      quantity: '2 bags',
      amount: 4500,
      vendor: 'MahaBeej',
      notes: 'DEMO DATA',
      createdAt: now,
      updatedAt: now
    },
    {
      farmId: farm5Id,
      cropId: crop5Id,
      date: '2026-07-25',
      category: 'fuel',
      productName: 'Diesel for Water Pump (डिझेल)',
      quantity: '50 litres',
      amount: 5000,
      vendor: 'Indian Oil Petrol Pump',
      notes: 'DEMO DATA',
      createdAt: now,
      updatedAt: now
    },
    {
      farmId: farm5Id,
      cropId: crop5Id,
      date: '2026-08-15',
      category: 'fertilizer',
      productName: 'Urea Second Dose (युरिया)',
      quantity: '3 bags',
      amount: 6000,
      vendor: 'Kisan Krushi',
      notes: 'DEMO DATA',
      createdAt: now,
      updatedAt: now
    },
    {
      farmId: farm5Id,
      cropId: crop5Id,
      date: '2026-08-28',
      category: 'labour',
      productName: 'Canal Irrigation & Weeding',
      quantity: '6 workers',
      amount: 7000,
      vendor: 'Village Labour',
      notes: 'DEMO DATA',
      createdAt: now,
      updatedAt: now
    },
    {
      farmId: farm5Id,
      cropId: crop5Id,
      date: '2026-09-05',
      category: 'transportation',
      productName: 'Fertilizer Transport (वाहतूक खर्च)',
      quantity: '1 trip',
      amount: 5000,
      vendor: 'Tempo Operator',
      notes: 'DEMO DATA',
      createdAt: now,
      updatedAt: now
    }
  ];

  await db.expenses.bulkAdd([
    ...farm1Expenses,
    ...farm2Expenses,
    ...farm3Expenses,
    ...farm4Expenses,
    ...farm5Expenses
  ]);

  // Set setting flag for demo data presence
  await db.settings.put({
    key: 'app_settings',
    language: 'mr',
    appLockEnabled: false,
    hasDemoData: true
  });
}

export async function clearDemoData(): Promise<void> {
  const allExpenses = await db.expenses.toArray();
  const demoExpenseIds = allExpenses
    .filter(e => e.notes?.includes('DEMO DATA'))
    .map(e => e.id!)
    .filter(Boolean);

  if (demoExpenseIds.length > 0) {
    await db.expenses.bulkDelete(demoExpenseIds);
  }

  // Also remove demo farms if they only have demo notes
  const allFarms = await db.farms.toArray();
  for (const farm of allFarms) {
    const farmExpenses = await db.expenses.where('farmId').equals(farm.id!).count();
    if (farmExpenses === 0 && farm.notes?.includes('DEMO DATA')) {
      await db.farms.delete(farm.id!);
      await db.crops.where('farmId').equals(farm.id!).delete();
    }
  }

  const settings = await db.settings.get({ key: 'app_settings' });
  if (settings) {
    await db.settings.put({
      ...settings,
      hasDemoData: false
    });
  }
}
