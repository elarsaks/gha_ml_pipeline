import React from "react";
import { ModelWeights } from "../types";

interface ModelInfoProps {
  modelWeights: ModelWeights;
}

export const ModelInfo: React.FC<ModelInfoProps> = ({ modelWeights }) => (
  <div
    style={{
      color: "#ccc",
      marginTop: "16px",
      fontSize: "clamp(11px, 2.5vw, 14px)",
      textAlign: "center",
      padding: "0 10px",
      wordBreak: "break-word",
    }}
  >
    Model: BTC Price = {modelWeights.intercept.toFixed(2)} +{" "}
    {modelWeights.coefficient.toFixed(6)} × Fear &amp; Greed Index
  </div>
);
