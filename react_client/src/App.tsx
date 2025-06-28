import React from "react";
import BTCFearGreedChart from "./components/BTCFearGreedChart";

const headerStyle: React.CSSProperties = {
  textAlign: "center",
  fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
  fontWeight: 900,
  letterSpacing: 2,
  margin: "clamp(16px, 4vw, 32px) 0 0 0",
  background: "linear-gradient(90deg, #FFD700 0%, #FFC107 50%, #FFF8DC 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  textShadow:
    "0 1px 2px #bfa100, 0 1px 0 #fff8dc, 0 2px 8px #bfa100, 0 0px 1px #fff8dc",
  fontFamily: 'Montserrat, "Segoe UI", Arial, sans-serif',
};

const appContainerStyle: React.CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  width: "100vw",
  padding: "clamp(8px, 4vw, 32px)",
  boxSizing: "border-box",
};

const App: React.FC = () => {
  return (
    <div style={appContainerStyle}>
      <h1 style={headerStyle}> ₿/$ BTC Price Prediction </h1>
      <div style={{ width: "100%", maxWidth: 900, minWidth: 0 }}>
        <BTCFearGreedChart />
      </div>
    </div>
  );
};

export default App;
