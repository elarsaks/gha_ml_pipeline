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

export const SEO_CONFIG = {
  title: "Bitcoin Price Prediction | ML Pipeline with Fear & Greed Index",
  description:
    "Real-time Bitcoin price prediction using machine learning and Fear & Greed Index. Complete ML pipeline with data visualization, model training, and interactive charts.",
  url: "https://elarsaks.github.io/gha_ml_pipeline/",
  image:
    "https://repository-images.githubusercontent.com/1006038998/c4d24540-64b5-443d-85d5-1920e5267e91",
  author: "Elar Saks",
  twitter: "@elarsaks",
  keywords:
    "Bitcoin, cryptocurrency, machine learning, price prediction, Fear and Greed Index, data visualization, ML pipeline, GitHub Actions",
} as const;
