export const DATA_URL =
  "https://raw.githubusercontent.com/elarsaks/gha_ml_pipeline/master/data/raw/fear_and_greed_history_5min.jsonl";
export const MODEL_WEIGHTS_URL =
  "https://raw.githubusercontent.com/elarsaks/gha_ml_pipeline/master/models/champion_model.csv";

export const CHART_DIMENSIONS = {
  WIDTH: 800,
  HEIGHT: 400,
  MARGIN: { top: 20, right: 60, bottom: 40, left: 60 },
  MOBILE_BREAKPOINT: 768,
  MOBILE_WIDTH: 350,
  MOBILE_HEIGHT: 250,
  MOBILE_MARGIN: { top: 15, right: 30, bottom: 30, left: 40 },
} as const;
