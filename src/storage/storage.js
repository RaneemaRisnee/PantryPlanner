import AsyncStorage from '@react-native-async-storage/async-storage';

import { createSampleData } from '../data/sampleData';

const STORAGE_KEY = '@pantryplanner/data/v1';

// Seeds the sample dataset on first launch only. Parse and read errors are
// thrown so that existing data is never overwritten by the seed.
export async function loadData() {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (raw !== null) {
    return JSON.parse(raw);
  }
  const seeded = createSampleData();
  await saveData(seeded);
  return seeded;
}

export function saveData(data) {
  return AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
