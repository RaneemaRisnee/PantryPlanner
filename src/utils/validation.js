function parseNumber(value) {
  const text = String(value).trim();
  return text === '' ? NaN : Number(text);
}

export function validateList({ title }) {
  return title.trim() ? {} : { title: 'Enter a list title' };
}

// Returns field errors, plus the parsed numbers when the form is valid.
export function validateItem({ name, category, quantity, unit, estimatedUnitPrice }) {
  const errors = {};
  const parsedQuantity = parseNumber(quantity);
  const parsedPrice = parseNumber(estimatedUnitPrice);

  if (!name.trim()) errors.name = 'Enter a product name';
  if (!category) errors.category = 'Choose a category';
  if (!unit) errors.unit = 'Choose a unit';
  if (!Number.isFinite(parsedQuantity) || parsedQuantity <= 0) {
    errors.quantity = 'Enter a quantity above 0';
  }
  if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
    errors.estimatedUnitPrice = 'Enter a price of 0 or more';
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
    quantity: parsedQuantity,
    estimatedUnitPrice: parsedPrice,
  };
}
