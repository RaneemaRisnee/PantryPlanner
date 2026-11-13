import assert from 'node:assert/strict';
import { test } from 'node:test';

import { createSampleData } from '../data/sampleData.js';
import {
  dashboardSummary,
  itemSubtotal,
  itemsTotal,
  listProgress,
  remainingTotal,
  stepQuantity,
} from './calculations.js';
import { categoryBreakdown, groupByCategory, mostExpensiveItems } from './categories.js';
import { filterItems, sortForChecklist } from './filters.js';
import { formatCurrency, formatDate } from './format.js';
import { InvalidDataError, sanitizeData } from '../storage/sanitize.js';
import { validateItem, validateList } from './validation.js';

const validItem = {
  name: 'Rice',
  category: 'Grains',
  quantity: '5',
  unit: 'kg',
  estimatedUnitPrice: '240',
};

test('subtotal is quantity multiplied by unit price', () => {
  assert.equal(itemSubtotal({ quantity: 5, estimatedUnitPrice: 240 }), 1200);
});

test('sample dataset totals LKR 3,630', () => {
  assert.equal(itemsTotal(createSampleData().items), 3630);
});

test('an empty list totals zero with no progress', () => {
  assert.equal(itemsTotal([]), 0);
  assert.deepEqual(listProgress([]), { total: 0, purchased: 0, remaining: 0, fraction: 0 });
});

test('progress counts purchased and remaining items', () => {
  const progress = listProgress([{ purchased: true }, { purchased: false }, { purchased: false }]);
  assert.equal(progress.purchased, 1);
  assert.equal(progress.remaining, 2);
});

test('dashboard summarises the sample data', () => {
  assert.deepEqual(dashboardSummary(createSampleData()), {
    listCount: 1,
    totalItems: 6,
    purchasedItems: 0,
    remainingItems: 6,
    estimatedTotal: 3630,
  });
});

test('currency is shown in LKR with separators', () => {
  assert.equal(formatCurrency(3630), 'LKR 3,630.00');
  assert.equal(formatCurrency(0), 'LKR 0.00');
  assert.equal(formatCurrency(1234567.5), 'LKR 1,234,567.50');
});

test('dates are shown day first', () => {
  assert.equal(formatDate('2026-11-07T12:00:00'), '7 Nov 2026');
});

test('a list needs a title', () => {
  assert.ok(validateList({ title: '   ' }).title);
  assert.deepEqual(validateList({ title: 'Weekly' }), {});
});

test('a complete item is valid and its numbers are parsed', () => {
  const result = validateItem(validItem);
  assert.equal(result.isValid, true);
  assert.equal(result.quantity, 5);
  assert.equal(result.estimatedUnitPrice, 240);
});

test('invalid item fields are reported', () => {
  const { errors, isValid } = validateItem({
    name: ' ',
    category: '',
    quantity: '0',
    unit: '',
    estimatedUnitPrice: '-1',
  });
  assert.equal(isValid, false);
  assert.deepEqual(Object.keys(errors).sort(), [
    'category',
    'estimatedUnitPrice',
    'name',
    'quantity',
    'unit',
  ]);
});

test('non-numeric and blank numbers are rejected, a zero price is allowed', () => {
  assert.ok(validateItem({ ...validItem, quantity: 'abc' }).errors.quantity);
  assert.ok(validateItem({ ...validItem, estimatedUnitPrice: '' }).errors.estimatedUnitPrice);
  assert.equal(validateItem({ ...validItem, estimatedUnitPrice: '0' }).isValid, true);
});

const shopping = [
  { id: '1', name: 'Rice', category: 'Grains', purchased: true, quantity: 5, estimatedUnitPrice: 240 },
  { id: '2', name: 'Eggs', category: 'Dairy', purchased: false, quantity: 10, estimatedUnitPrice: 40 },
  { id: '3', name: 'Milk powder', category: 'Dairy', purchased: true, quantity: 1, estimatedUnitPrice: 1100 },
  { id: '4', name: 'Brown rice', category: 'Grains', purchased: false, quantity: 1, estimatedUnitPrice: 300 },
];
const names = (items) => items.map((item) => item.name);

test('search matches part of a name, ignoring case and spaces', () => {
  assert.deepEqual(names(filterItems(shopping, { query: '  RICE ' })), ['Brown rice', 'Rice']);
  assert.deepEqual(names(filterItems(shopping, { query: 'tea' })), []);
});

test('filters by category and purchase status', () => {
  assert.deepEqual(names(filterItems(shopping, { category: 'Dairy' })), ['Eggs', 'Milk powder']);
  assert.deepEqual(names(filterItems(shopping, { status: 'Purchased' })), ['Milk powder', 'Rice']);
  assert.deepEqual(names(filterItems(shopping, { status: 'Remaining' })), ['Brown rice', 'Eggs']);
});

test('search, category and status combine', () => {
  const result = filterItems(shopping, { query: 'rice', category: 'Grains', status: 'Remaining' });
  assert.deepEqual(names(result), ['Brown rice']);
  assert.equal(filterItems(shopping).length, 4);
});

test('checklist shows remaining items before purchased ones', () => {
  assert.deepEqual(names(sortForChecklist(shopping)), ['Eggs', 'Brown rice', 'Rice', 'Milk powder']);
});

test('remaining total counts unpurchased items only', () => {
  assert.equal(remainingTotal(shopping), 700);
});

test('dashboard leaves out completed lists', () => {
  const lists = [
    { id: 'a', completed: false },
    { id: 'b', completed: true },
  ];
  const items = [
    { listId: 'a', purchased: true, quantity: 2, estimatedUnitPrice: 100 },
    { listId: 'b', purchased: false, quantity: 1, estimatedUnitPrice: 999 },
  ];
  assert.deepEqual(dashboardSummary({ lists, items }), {
    listCount: 1,
    totalItems: 1,
    purchasedItems: 1,
    remainingItems: 0,
    estimatedTotal: 200,
  });
});

test('quantity steps by one without floating point noise', () => {
  assert.equal(stepQuantity(1.3, -1), 0.3);
  assert.equal(stepQuantity(5, 1), 6);
});

test('checklist groups items by category in the standard order', () => {
  const sections = groupByCategory(createSampleData().items);
  assert.deepEqual(
    sections.map((section) => section.title),
    ['Vegetables', 'Dairy', 'Bakery', 'Grains'],
  );
  const dairy = sections.find((section) => section.title === 'Dairy');
  assert.deepEqual(names(dairy.data), ['Milk powder', 'Eggs']);
  assert.equal(dairy.total, 1500);
});

test('purchased items sink to the bottom of their category', () => {
  const dairy = groupByCategory(shopping).find((section) => section.title === 'Dairy');
  assert.deepEqual(names(dairy.data), ['Eggs', 'Milk powder']);
});

test('unknown categories are listed last', () => {
  const items = [
    { name: 'Soap', category: 'Toiletries', purchased: false, quantity: 1, estimatedUnitPrice: 1 },
    { name: 'Bread', category: 'Bakery', purchased: false, quantity: 1, estimatedUnitPrice: 1 },
  ];
  assert.deepEqual(
    groupByCategory(items).map((section) => section.title),
    ['Bakery', 'Toiletries'],
  );
});

test('category breakdown totals and shares add up', () => {
  const breakdown = categoryBreakdown(createSampleData().items);
  const grains = breakdown.find((row) => row.category === 'Grains');
  assert.equal(grains.total, 1480);
  assert.equal(grains.itemCount, 2);
  assert.equal(breakdown.reduce((sum, row) => sum + row.total, 0), 3630);
  assert.ok(Math.abs(breakdown.reduce((sum, row) => sum + row.share, 0) - 1) < 1e-9);
});

test('breakdown of an empty list is empty, and shares never divide by zero', () => {
  assert.deepEqual(categoryBreakdown([]), []);
  const free = [{ name: 'Bag', category: 'Other', purchased: false, quantity: 1, estimatedUnitPrice: 0 }];
  assert.equal(categoryBreakdown(free)[0].share, 0);
});

test('most expensive items are ranked by subtotal', () => {
  assert.deepEqual(names(mostExpensiveItems(createSampleData().items)), [
    'Rice',
    'Milk powder',
    'Eggs',
  ]);
});

test('number formats that are not plain decimals are rejected', () => {
  for (const quantity of ['1e5', '-2', '1,5', '2 kg', '0x10', '1.2345']) {
    assert.ok(validateItem({ ...validItem, quantity }).errors.quantity, quantity);
  }
  for (const price of ['1,100', '1e3', '99.999', 'Rs 100']) {
    assert.ok(validateItem({ ...validItem, estimatedUnitPrice: price }).errors.estimatedUnitPrice, price);
  }
  const decimals = validateItem({ ...validItem, quantity: '0.5', estimatedUnitPrice: '99.50' });
  assert.equal(decimals.isValid, true);
  assert.equal(decimals.quantity, 0.5);
});

test('quantity and price have upper limits', () => {
  assert.ok(validateItem({ ...validItem, quantity: '10001' }).errors.quantity);
  assert.equal(validateItem({ ...validItem, quantity: '10000' }).isValid, true);
  assert.ok(validateItem({ ...validItem, estimatedUnitPrice: '10000001' }).errors.estimatedUnitPrice);
});

test('an item name cannot be repeated in the same list, ignoring case', () => {
  assert.match(validateItem({ ...validItem, name: ' rice ' }, ['Rice', 'Eggs']).errors.name, /already/);
  assert.equal(validateItem(validItem, ['Eggs']).isValid, true);
});

test('valid saved data passes through unchanged', () => {
  const sample = createSampleData('2026-11-01T00:00:00.000Z');
  const { data, dropped } = sanitizeData(sample);
  assert.deepEqual(data, sample);
  assert.equal(dropped, 0);
});

test('saved data in the wrong shape is reported, not loaded', () => {
  for (const bad of [null, 'text', {}, { lists: [] }, { lists: {}, items: [] }]) {
    assert.throws(() => sanitizeData(bad), InvalidDataError);
  }
});

test('damaged records are dropped and missing fields get defaults', () => {
  const now = '2026-11-13T00:00:00.000Z';
  const { data, dropped } = sanitizeData(
    {
      lists: [
        { id: 'a', title: 'Weekly', createdAt: '2026-11-01T00:00:00.000Z' },
        { id: 'a', title: 'Duplicate id' },
        { id: 'b' },
        { id: 'c', title: 'Done', completed: true },
      ],
      items: [
        { id: '1', listId: 'a', name: 'Rice', quantity: 5, estimatedUnitPrice: 240, category: 'Snacks' },
        { id: '2', listId: 'missing', name: 'Orphan', quantity: 1, estimatedUnitPrice: 1 },
        { id: '3', listId: 'a', name: 'Bad quantity', quantity: '5', estimatedUnitPrice: 1 },
        { id: '4', listId: 'a', name: 'Negative', quantity: 1, estimatedUnitPrice: -1 },
        { id: '5', listId: 'a', name: '', quantity: 1, estimatedUnitPrice: 1 },
      ],
    },
    now,
  );
  assert.deepEqual(data.lists.map((list) => list.title), ['Weekly', 'Done']);
  assert.deepEqual(data.lists[0], {
    id: 'a',
    title: 'Weekly',
    description: '',
    createdAt: '2026-11-01T00:00:00.000Z',
    updatedAt: '2026-11-01T00:00:00.000Z',
    completed: false,
    completedAt: null,
  });
  assert.equal(data.lists[1].completedAt, now);
  assert.deepEqual(data.items, [
    {
      id: '1',
      listId: 'a',
      name: 'Rice',
      category: 'Other',
      quantity: 5,
      unit: 'pieces',
      estimatedUnitPrice: 240,
      purchased: false,
      notes: '',
    },
  ]);
  assert.equal(dropped, 6);
});
