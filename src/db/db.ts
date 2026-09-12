import Dexie, { Table } from 'dexie';
import { Farm, Crop, Expense, Settings } from '../types';

export class ShetiKharchaDB extends Dexie {
  farms!: Table<Farm, number>;
  crops!: Table<Crop, number>;
  expenses!: Table<Expense, number>;
  settings!: Table<Settings, number>;

  constructor() {
    super('ShetiKharchaDB');

    // Define schema and indexes for optimal querying speed
    this.version(1).stores({
      farms: '++id, name, status, createdAt',
      crops: '++id, farmId, cropName, season',
      expenses: '++id, farmId, cropId, date, category, productName, amount',
      settings: '++id, key'
    });
  }
}

export const db = new ShetiKharchaDB();
