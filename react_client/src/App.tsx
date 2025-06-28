import React from "react";
import BTCFearGreedChart from "./components/BTCFearGreedChart";

const App: React.FC = () => {
  return (
    <div>
      <h1>₿ BTC Price Prediction $</h1>
      <BTCFearGreedChart />
    </div>
  );
};

export default App;
