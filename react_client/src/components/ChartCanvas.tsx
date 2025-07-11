import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { DataPoint } from "../types";
import { useResponsiveChart } from "../hooks/useResponsiveChart";
import { createChart } from "../utils/chartUtils";
import { tooltipStyle } from "../styles/chartStyles";

interface ChartCanvasProps {
  data: DataPoint[];
}

export const ChartCanvas: React.FC<ChartCanvasProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const dimensions = useResponsiveChart();

  useEffect(() => {
    if (!data.length || !svgRef.current || !tooltipRef.current) return;

    const svg = d3.select(svgRef.current);
    const tooltip = d3.select(tooltipRef.current);

    createChart(svg, tooltip, data, dimensions);
  }, [data, dimensions]);

  return (
    <>
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        style={{ maxWidth: "100%", height: "auto" }}
      />
      <div ref={tooltipRef} style={tooltipStyle}></div>
    </>
  );
};
