import { CATEGORIES } from '../data/constants.js';
import { itemSubtotal, itemsTotal } from './calculations.js';
import { sortForChecklist } from './filters.js';

// Categories follow the app's standard order. Any unknown category is placed last.
function categoryOrder(category) {
  const index = CATEGORIES.indexOf(category);
  return index === -1 ? CATEGORIES.length : index;
}

function groupItems(items) {
  const groups = new Map();
  items.forEach((item) => {
    if (!groups.has(item.category)) groups.set(item.category, []);
    groups.get(item.category).push(item);
  });
  return [...groups.entries()].sort(
    ([a], [b]) => categoryOrder(a) - categoryOrder(b) || a.localeCompare(b),
  );
}

// Checklist sections. Within each category, remaining items come before purchased ones.
export function groupByCategory(items) {
  return groupItems(items).map(([category, categoryItems]) => ({
    title: category,
    data: sortForChecklist(categoryItems),
    total: itemsTotal(categoryItems),
  }));
}

// Cost per category, with each category's share of the list total.
export function categoryBreakdown(items) {
  const grandTotal = itemsTotal(items);
  return groupItems(items).map(([category, categoryItems]) => {
    const total = itemsTotal(categoryItems);
    return {
      category,
      itemCount: categoryItems.length,
      purchasedCount: categoryItems.filter((item) => item.purchased).length,
      total,
      share: grandTotal === 0 ? 0 : total / grandTotal,
    };
  });
}

export function mostExpensiveItems(items, count = 3) {
  return [...items].sort((a, b) => itemSubtotal(b) - itemSubtotal(a)).slice(0, count);
}
