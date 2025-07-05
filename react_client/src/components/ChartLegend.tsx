import React from "react";
import {
  legendStyle,
  legendItemStyle,
  legendColorStyle,
} from "../styles/chartStyles";

export const ChartLegend: React.FC = () => (
  <div style={legendStyle}>
    <div style={legendItemStyle}>
      <span style={{ ...legendColorStyle, background: "#2196F3" }}></span>
      <span>Actual BTC Price</span>
    </div>
    <div style={legendItemStyle}>
      <span style={{ ...legendColorStyle, background: "#8E24AA" }}></span>
      <span>Predicted BTC Price</span>
    </div>
  </div>
);
