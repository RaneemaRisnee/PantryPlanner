# PantryPlanner

An offline React Native app for planning household grocery shopping. Create shopping lists, add items with quantities and estimated prices, and see estimated totals. All data stays on the device.

## Run the app

Requires Node.js and the [Expo Go](https://expo.dev/go) app, or an Android or iOS simulator.

```bash
npm install
npm start
```

Scan the QR code with Expo Go, or press `a` for Android or `i` for iOS.

## Run the tests

```bash
npm test
```

## Project structure

| Path | Purpose |
| --- | --- |
| `src/screens` | Application screens |
| `src/components` | Reusable UI components |
| `src/navigation` | Tab and stack navigation |
| `src/context` | Shared app state and list and item operations |
| `src/storage` | AsyncStorage save and load |
| `src/data` | Categories, units and the sample dataset |
| `src/utils` | Calculations, formatting and validation |

## Features

- **Home Dashboard:** active lists, total, purchased and remaining items, and the estimated total
- **My Shopping Lists:** create, rename and delete active lists, with progress and totals
- **Add / Edit Grocery Item:** name, category, quantity, unit, estimated unit price and notes, with validation
- **Shopping Checklist:** items grouped by category with category subtotals. Tick items as purchased, change quantities, edit or delete items, and complete or reopen the list
- **Shopping Summary:** for each list, the purchased amount and amount still to buy, cost by category with each category's share, and the most expensive items
- **Categories & Search:** search by product name and filter by category and purchase status
- **Shopping History:** completed lists with item counts and cost summaries
- Item subtotals, list totals and the amount still to buy, in LKR
- Local persistence with AsyncStorage, with no internet connection needed
- Sample dataset on first launch

## Testing

`npm test` runs unit tests for calculations, filters, formatting and validation.

The testing plan was also checked by clicking through a web build of the app:

| Test | Result |
| --- | --- |
| Create a list and see it in the list view | Pass |
| Add, edit and delete items | Pass |
| Mark items as purchased and check progress and remaining counts | Pass |
| Search for a product | Pass |
| Filter by category and purchase status | Pass |
| Check subtotals and totals with known values | Pass |
| Check category grouping and category cost totals | Pass |
| Reload the app and check that data is still there | Pass |
| Use the app with the network turned off | Pass |

Airplane mode on a physical phone still needs to be checked by hand.
