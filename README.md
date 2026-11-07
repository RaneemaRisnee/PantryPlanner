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

## Progress

Done:

- Project setup and navigation
- Home dashboard
- Create, edit and delete shopping lists
- Add, edit and delete grocery items
- Item subtotals and list totals in LKR
- Local persistence with AsyncStorage
- Sample dataset on first launch

Still to do:

- Mark items as purchased
- Search and filters
- Shopping history and summary
- Offline and final testing
