import { CATEGORIES, UNITS } from '../data/constants.js';
import { MAX_PRICE, MAX_QUANTITY } from '../utils/validation.js';

export class InvalidDataError extends Error {}

const isText = (value) => typeof value === 'string' && value.trim() !== '';
const isDate = (value) => typeof value === 'string' && !Number.isNaN(Date.parse(value));

function cleanList(list, now) {
  if (!list || !isText(list.id) || !isText(list.title)) return null;
  const createdAt = isDate(list.createdAt) ? list.createdAt : now;
  const completed = list.completed === true;
  return {
    id: list.id,
    title: list.title,
    description: typeof list.description === 'string' ? list.description : '',
    createdAt,
    updatedAt: isDate(list.updatedAt) ? list.updatedAt : createdAt,
    completed,
    completedAt: completed && isDate(list.completedAt) ? list.completedAt : completed ? now : null,
  };
}

function cleanItem(item, listIds) {
  if (!item || !isText(item.id) || !isText(item.name) || !listIds.has(item.listId)) return null;
  const { quantity, estimatedUnitPrice } = item;
  if (!Number.isFinite(quantity) || quantity <= 0 || quantity > MAX_QUANTITY) return null;
  if (!Number.isFinite(estimatedUnitPrice) || estimatedUnitPrice < 0 || estimatedUnitPrice > MAX_PRICE) {
    return null;
  }
  return {
    id: item.id,
    listId: item.listId,
    name: item.name,
    category: CATEGORIES.includes(item.category) ? item.category : 'Other',
    quantity,
    unit: UNITS.includes(item.unit) ? item.unit : 'pieces',
    estimatedUnitPrice,
    purchased: item.purchased === true,
    notes: typeof item.notes === 'string' ? item.notes : '',
  };
}

function keepValidUnique(records, clean) {
  const seen = new Set();
  return records
    .map(clean)
    .filter((record) => record && !seen.has(record.id) && seen.add(record.id));
}

// Checks data read from storage. Records that cannot be repaired are dropped
// and missing optional fields get defaults. Throws InvalidDataError when the
// overall shape is wrong, so the app can offer recovery instead of crashing.
export function sanitizeData(data, now = new Date().toISOString()) {
  if (!data || !Array.isArray(data.lists) || !Array.isArray(data.items)) {
    throw new InvalidDataError('Saved data is not in the expected format');
  }
  const lists = keepValidUnique(data.lists, (list) => cleanList(list, now));
  const listIds = new Set(lists.map((list) => list.id));
  const items = keepValidUnique(data.items, (item) => cleanItem(item, listIds));
  return {
    data: { lists, items },
    dropped: data.lists.length - lists.length + data.items.length - items.length,
  };
}
