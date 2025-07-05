import React, { useEffect } from "react";
import { useChartData } from "../../hooks/useChartData";
import { injectKeyframes } from "../../utils/styles";
import { chartContainerStyle, backlightStyle } from "../../styles/chartStyles";
import { LoadingState } from "../LoadingState";
import { ErrorState } from "../ErrorState";
import { ChartCanvas } from "../ChartCanvas";
import { ChartLegend } from "../ChartLegend";
import { ModelInfo } from "../ModelInfo";

const BTCPriceChart: React.FC = () => {
  const { data, modelWeights, loading, error } = useChartData();

  useEffect(() => {
    injectKeyframes();
  }, []);

  const handleRetry = () => {
    window.location.reload();
  };

  if (loading) {
    return (
      <div style={chartContainerStyle}>
        <LoadingState />
      </div>
    );
  }

  if (error) {
    return (
      <div style={chartContainerStyle}>
        <ErrorState error={error} onRetry={handleRetry} />
      </div>
    );
  }

  return (
    <div style={chartContainerStyle}>
      <div style={backlightStyle}></div>
      <ChartCanvas data={data} />
      <ChartLegend />
      {modelWeights && <ModelInfo modelWeights={modelWeights} />}
    </div>
  );
};

export default BTCPriceChart;
