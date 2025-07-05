export interface DataPoint {
  interval_end_time: string;
  close_bitcoin_price_usd: number;
  avg_actual_value: number;
  predicted_btc_price?: number;
}

export interface ModelWeights {
  intercept: number;
  coefficient: number;
}
