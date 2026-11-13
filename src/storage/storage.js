import AsyncStorage from '@react-native-async-storage/async-storage';

import { createSampleData } from '../data/sampleData';
import { InvalidDataError, sanitizeData } from './sanitize';

const STORAGE_KEY = '@pantryplanner/data/v1';
const BACKUP_KEY_PREFIX = '@pantryplanner/backup/';

// Seeds the sample dataset on first launch only. Damaged data raises an
// InvalidDataError and is never overwritten here, so nothing is lost silently.
export async function loadData() {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (raw === null) {
    const seeded = createSampleData();
    await saveData(seeded);
    return seeded;
  }

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new InvalidDataError('Saved data could not be read');
  }
  const { data, dropped } = sanitizeData(parsed);
  if (dropped > 0) {
    console.warn(`Removed ${dropped} damaged record(s) from saved data`);
  }
  return data;
}

export function saveData(data) {
  return AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Copies the damaged data to a backup key, then starts again with no lists.
export async function resetData() {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (raw !== null) {
    await AsyncStorage.setItem(`${BACKUP_KEY_PREFIX}${Date.now()}`, raw);
  }
  const empty = { lists: [], items: [] };
  await saveData(empty);
  return empty;
}
