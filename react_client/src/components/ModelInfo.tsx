import React from "react";
import { ModelWeights } from "../types";

interface ModelInfoProps {
  modelWeights: ModelWeights;
}

export const ModelInfo: React.FC<ModelInfoProps> = ({ modelWeights }) => (
  <div style={{ color: "#ccc", marginTop: "16px", fontSize: "14px" }}>
    Model: BTC Price = {modelWeights.intercept.toFixed(2)} +{" "}
    {modelWeights.coefficient} × Fear &amp; Greed Index
  </div>
);
