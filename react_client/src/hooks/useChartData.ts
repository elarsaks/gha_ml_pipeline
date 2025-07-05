import { useEffect, useState } from "react";
import { DataPoint, ModelWeights } from "../types";
import {
  fetchData,
  fetchModelWeights,
  processData,
} from "../services/dataService";

interface UseChartDataReturn {
  data: DataPoint[];
  modelWeights: ModelWeights | null;
  loading: boolean;
  error: string | null;
}

export const useChartData = (): UseChartDataReturn => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [modelWeights, setModelWeights] = useState<ModelWeights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [rawData, weights] = await Promise.all([
          fetchData(),
          fetchModelWeights(),
        ]);

        const processedData = processData(rawData, weights);

        setData(processedData);
        setModelWeights(weights);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { data, modelWeights, loading, error };
};
