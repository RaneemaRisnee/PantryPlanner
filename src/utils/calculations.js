export function itemSubtotal(item) {
  return item.quantity * item.estimatedUnitPrice;
}

export function itemsTotal(items) {
  return items.reduce((total, item) => total + itemSubtotal(item), 0);
}

export function remainingTotal(items) {
  return itemsTotal(items.filter((item) => !item.purchased));
}

export function listProgress(items) {
  const total = items.length;
  const purchased = items.filter((item) => item.purchased).length;
  return {
    total,
    purchased,
    remaining: total - purchased,
    fraction: total === 0 ? 0 : purchased / total,
  };
}

// The dashboard covers active lists only. Completed lists appear in History.
export function dashboardSummary({ lists, items }) {
  const activeIds = new Set(lists.filter((list) => !list.completed).map((list) => list.id));
  const activeItems = items.filter((item) => activeIds.has(item.listId));
  const { total, purchased, remaining } = listProgress(activeItems);
  return {
    listCount: activeIds.size,
    totalItems: total,
    purchasedItems: purchased,
    remainingItems: remaining,
    estimatedTotal: itemsTotal(activeItems),
  };
}

// Adds or removes one unit, rounded to avoid floating point noise such as 0.30000000000000004.
export function stepQuantity(quantity, step) {
  return Math.round((quantity + step) * 1000) / 1000;
}
