import assert from 'node:assert/strict';
import { test } from 'node:test';

import { createSampleData } from '../data/sampleData.js';
import { dashboardSummary, itemSubtotal, itemsTotal, listProgress } from './calculations.js';
import { formatCurrency, formatDate } from './format.js';
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
