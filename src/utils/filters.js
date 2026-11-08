export const ALL = 'All';
export const STATUS_OPTIONS = [ALL, 'Remaining', 'Purchased'];

export function filterItems(items, { query = '', category = ALL, status = ALL } = {}) {
  const search = query.trim().toLowerCase();
  return items
    .filter((item) => !search || item.name.toLowerCase().includes(search))
    .filter((item) => category === ALL || item.category === category)
    .filter((item) => {
      if (status === 'Purchased') return item.purchased;
      if (status === 'Remaining') return !item.purchased;
      return true;
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

// Remaining items first, keeping their original order within each group.
export function sortForChecklist(items) {
  return [...items.filter((item) => !item.purchased), ...items.filter((item) => item.purchased)];
}
