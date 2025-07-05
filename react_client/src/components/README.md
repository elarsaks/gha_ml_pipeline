# BTC Price Chart Component

A React component that displays Bitcoin price data with machine learning predictions using D3.js for visualization.

## 📁 Project Structure

```
src/
├── components/
│   ├── BTCPriceChart/
│   │   ├── BTCPriceChart.tsx    # Main component
│   │   └── index.ts             # Export barrel
│   ├── BTCPriceChart.tsx        # Legacy export (re-exports new component)
│   ├── ChartCanvas.tsx          # D3 chart rendering
│   ├── ChartLegend.tsx          # Chart legend component
│   ├── ErrorState.tsx           # Error display component
│   ├── LoadingState.tsx         # Loading spinner component
│   └── ModelInfo.tsx            # Model information display
├── constants/
│   └── index.ts                 # Chart dimensions and API URLs
├── hooks/
│   └── useChartData.ts          # Data fetching hook
├── services/
│   └── dataService.ts           # API calls and data processing
├── styles/
│   └── chartStyles.ts           # Component styles
├── types/
│   └── index.ts                 # TypeScript interfaces
└── utils/
    ├── chartUtils.ts            # D3 chart creation utilities
    └── styles.ts                # Style injection utilities
```

## 🏗️ Architecture

### Components
- **BTCPriceChart**: Main container component that orchestrates the chart
- **ChartCanvas**: Handles D3.js chart rendering and interactions
- **ChartLegend**: Displays chart legend
- **LoadingState**: Shows loading spinner
- **ErrorState**: Displays error messages with retry option
- **ModelInfo**: Shows model equation and parameters

### Services
- **dataService**: Handles API calls and data processing
  - Fetches JSONL data from GitHub
  - Fetches model weights from CSV
  - Processes data with predictions
  - Sorts data chronologically

### Hooks
- **useChartData**: Custom hook for data fetching and state management

### Utilities
- **chartUtils**: D3.js chart creation and interaction logic
- **styles**: CSS keyframe injection for animations

## 🎨 Features

- **Real-time data**: Fetches Bitcoin price data from GitHub
- **ML predictions**: Displays predicted prices using linear regression
- **Interactive tooltips**: Shows detailed information on hover
- **Responsive design**: Adapts to container size
- **Error handling**: Graceful error states with retry functionality
- **Loading states**: Visual feedback during data fetching
- **Animations**: Smooth transitions and glowing effects

## 🚀 Usage

```tsx
import BTCPriceChart from './components/BTCPriceChart';

function App() {
  return (
    <div className="App">
      <BTCPriceChart />
    </div>
  );
}
```

## 🔧 Configuration

### Constants
Chart dimensions and API URLs can be configured in `src/constants/index.ts`:

```typescript
export const CHART_DIMENSIONS = {
  WIDTH: 800,
  HEIGHT: 400,
  MARGIN: { top: 20, right: 60, bottom: 40, left: 60 },
};
```

### Styling
Component styles are centralized in `src/styles/chartStyles.ts` for easy theming.

## 📊 Data Flow

1. **useChartData hook** initiates data fetching
2. **dataService** fetches raw data and model weights
3. **processData** adds predictions and sorts chronologically
4. **ChartCanvas** renders the chart using D3.js
5. **Interactive elements** handle user interactions

## 🔍 Best Practices Implemented

- **Separation of Concerns**: Each file has a single responsibility
- **Custom Hooks**: Reusable data fetching logic
- **Type Safety**: Comprehensive TypeScript interfaces
- **Error Boundaries**: Graceful error handling
- **Performance**: Efficient re-rendering with proper dependencies
- **Accessibility**: Proper color contrast and semantic HTML
- **Maintainability**: Clear folder structure and naming conventions

## 🛠️ Development

### Adding New Features
1. Create new components in `src/components/`
2. Add shared logic to `src/utils/`
3. Update types in `src/types/`
4. Add constants to `src/constants/`

### Styling
- Use the centralized styles in `src/styles/chartStyles.ts`
- Follow the existing pattern for consistent theming
- Add new animations to `src/utils/styles.ts`

## 🤝 Contributing

1. Follow the established folder structure
2. Use TypeScript for type safety
3. Add proper error handling
4. Include loading states for async operations
5. Write meaningful component and function names
6. Keep components focused on single responsibilities
