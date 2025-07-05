import * as d3 from "d3";
import { DataPoint, ModelWeights } from "../types";
import { DATA_URL, MODEL_WEIGHTS_URL } from "../constants";

export const fetchData = async (): Promise<DataPoint[]> => {
  const response = await fetch(DATA_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch data: ${response.status}`);
  }
  const text = await response.text();
  return text
    .split("\n")
    .filter((line) => line.trim())
    .map((line) => JSON.parse(line) as DataPoint);
};

export const fetchModelWeights = async (): Promise<ModelWeights> => {
  const response = await fetch(MODEL_WEIGHTS_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch model weights: ${response.status}`);
  }
  const csv = await response.text();
  const lines = csv.split("\n").filter((l) => l.trim());
  if (lines.length < 2) {
    throw new Error("Invalid model weights CSV");
  }

  // Initialize
  const weights: ModelWeights = { intercept: 0, coefficient: 0 };

  // Skip header, then assign intercept vs. coefficient
  for (let i = 1; i < lines.length; i++) {
    const [feature, rawWeight] = lines[i].split(",").map((s) => s.trim());
    const w = parseFloat(rawWeight);
    if (feature.toLowerCase() === "intercept") {
      weights.intercept = w;
    } else {
      // Any non-intercept feature row becomes our coefficient
      weights.coefficient = w;
    }
  }

  return weights;
};

export const processData = (
  rawData: DataPoint[],
  weights: ModelWeights
): DataPoint[] => {
  // Add predictions
  const withPredictions = rawData.map((pt) => ({
    ...pt,
    predicted_btc_price:
      weights.intercept + weights.coefficient * pt.avg_actual_value,
  }));

  // Sort by timestamp so your chart line is monotonic
  const parseDate = d3.utcParse("%Y-%m-%dT%H:%M:%SZ");
  withPredictions.sort(
    (a, b) =>
      parseDate(a.interval_end_time)!.getTime() -
      parseDate(b.interval_end_time)!.getTime()
  );

  return withPredictions;
};
