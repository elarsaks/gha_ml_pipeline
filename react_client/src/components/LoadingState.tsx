import React from "react";
import { backlightStyle, loadingSpinnerStyle } from "../styles/chartStyles";

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = "Loading chart and model weights...",
}) => (
  <>
    <div style={backlightStyle}></div>
    <div style={{ color: "#fff", padding: "40px", textAlign: "center" }}>
      <div style={{ fontSize: "18px", marginBottom: "16px" }}>{message}</div>
      <div style={loadingSpinnerStyle}></div>
    </div>
  </>
);
