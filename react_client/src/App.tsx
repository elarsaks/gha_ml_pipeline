import React, { useEffect } from "react";
import BTCPriceChart from "./components/BTCPriceChart";
import { SEO } from "./components/SEO";
import { injectKeyframes } from "./utils/styles";

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

const descriptionStyle: React.CSSProperties = {
  textAlign: "center",
  fontSize: "clamp(0.9rem, 2.5vw, 1.1rem)",
  color: "#a0a0a0",
  margin: "clamp(8px, 2vw, 16px) 0 clamp(16px, 4vw, 24px) 0",
  maxWidth: "600px",
  lineHeight: 1.5,
};

const linkStyle: React.CSSProperties = {
  color: "#FFD700",
  textDecoration: "none",
  borderBottom: "1px solid transparent",
  transition: "border-bottom-color 0.2s ease",
};

const linkHoverStyle: React.CSSProperties = {
  borderBottomColor: "#FFD700",
};

const App: React.FC = () => {
  useEffect(() => {
    injectKeyframes();
  }, []);

  return (
    <div style={appContainerStyle}>
      <SEO />
      <h1 style={headerStyle}> ₿/$ BTC Price Prediction </h1>
      <p style={descriptionStyle}>
        End-to-end machine learning pipeline powered by GitHub Actions.
        <br />
        View the{" "}
        <a
          href="https://github.com/elarsaks/gha_ml_pipeline"
          target="_blank"
          rel="noopener noreferrer"
          style={linkStyle}
          onMouseEnter={(e) =>
            Object.assign(e.currentTarget.style, linkHoverStyle)
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.borderBottomColor = "transparent")
          }
        >
          source code on GitHub
        </a>
        .
      </p>
      <div style={{ width: "100%", maxWidth: 900, minWidth: 0 }}>
        <BTCPriceChart />
      </div>
    </div>
  );
};

export default App;
