export function itemSubtotal(item) {
  return item.quantity * item.estimatedUnitPrice;
}

export function itemsTotal(items) {
  return items.reduce((total, item) => total + itemSubtotal(item), 0);
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

export function dashboardSummary({ lists, items }) {
  const { total, purchased, remaining } = listProgress(items);
  return {
    listCount: lists.length,
    totalItems: total,
    purchasedItems: purchased,
    remainingItems: remaining,
    estimatedTotal: itemsTotal(items),
  };
}
