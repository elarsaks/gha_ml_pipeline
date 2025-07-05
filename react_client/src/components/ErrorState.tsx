import React from "react";
import { backlightStyle, buttonStyle } from "../styles/chartStyles";

interface ErrorStateProps {
  error: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => (
  <>
    <div style={backlightStyle}></div>
    <div style={{ color: "#ff5252", padding: "40px", textAlign: "center" }}>
      <div style={{ fontSize: "18px", marginBottom: "16px" }}>
        Error loading chart
      </div>
      <div>{error}</div>
      {onRetry && (
        <button onClick={onRetry} style={buttonStyle}>
          Try Again
        </button>
      )}
    </div>
  </>
);
