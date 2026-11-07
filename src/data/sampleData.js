// Illustrative demonstration values from the project proposal, not market prices.
const SAMPLE_LIST_ID = 'sample-weekly-groceries';

const SAMPLE_ITEMS = [
  ['Rice', 'Grains', 5, 'kg', 240],
  ['Sugar', 'Grains', 1, 'kg', 280],
  ['Milk powder', 'Dairy', 1, 'packet', 1100],
  ['Eggs', 'Dairy', 10, 'pieces', 40],
  ['Onions', 'Vegetables', 1, 'kg', 350],
  ['Bread', 'Bakery', 2, 'loaves', 150],
];

export function createSampleData(now = new Date().toISOString()) {
  return {
    lists: [
      {
        id: SAMPLE_LIST_ID,
        title: 'Weekly Groceries',
        description: 'Sample list for demonstration',
        createdAt: now,
        updatedAt: now,
        completed: false,
      },
    ],
    items: SAMPLE_ITEMS.map(([name, category, quantity, unit, estimatedUnitPrice], index) => ({
      id: `sample-item-${index + 1}`,
      listId: SAMPLE_LIST_ID,
      name,
      category,
      quantity,
      unit,
      estimatedUnitPrice,
      purchased: false,
      notes: '',
    })),
  };
}
