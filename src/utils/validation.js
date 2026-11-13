export const MAX_QUANTITY = 10000;
export const MAX_PRICE = 10000000;

// Plain decimal numbers only, so inputs such as "1e5", "-2" or "1,100" are rejected.
const QUANTITY_PATTERN = /^(?:\d+(?:\.\d{0,3})?|\.\d{1,3})$/;
const PRICE_PATTERN = /^(?:\d+(?:\.\d{0,2})?|\.\d{1,2})$/;

export function validateList({ title }) {
  return title.trim() ? {} : { title: 'Enter a list title' };
}

function normaliseName(name) {
  return name.trim().toLowerCase();
}

// Returns field errors, plus the parsed numbers when the form is valid.
// otherNames are the names of the other items in the same list, used to prevent duplicates.
export function validateItem(
  { name, category, quantity, unit, estimatedUnitPrice },
  otherNames = [],
) {
  const errors = {};
  const quantityText = String(quantity).trim();
  const priceText = String(estimatedUnitPrice).trim();
  const parsedQuantity = Number(quantityText);
  const parsedPrice = Number(priceText);

  if (!name.trim()) {
    errors.name = 'Enter a product name';
  } else if (otherNames.some((other) => normaliseName(other) === normaliseName(name))) {
    errors.name = `${name.trim()} is already on this list. Edit that item instead.`;
  }
  if (!category) errors.category = 'Choose a category';
  if (!unit) errors.unit = 'Choose a unit';

  if (!QUANTITY_PATTERN.test(quantityText)) {
    errors.quantity = 'Enter a number such as 2 or 0.5';
  } else if (parsedQuantity <= 0) {
    errors.quantity = 'Enter a quantity above 0';
  } else if (parsedQuantity > MAX_QUANTITY) {
    errors.quantity = 'Enter a quantity up to 10,000';
  }

  if (!PRICE_PATTERN.test(priceText)) {
    errors.estimatedUnitPrice = 'Enter a price such as 240 or 99.50';
  } else if (parsedPrice > MAX_PRICE) {
    errors.estimatedUnitPrice = 'Enter a price up to 10,000,000';
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
    quantity: parsedQuantity,
    estimatedUnitPrice: parsedPrice,
  };
}
