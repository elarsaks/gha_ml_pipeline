import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { DataPoint } from "../types";
import { CHART_DIMENSIONS } from "../constants";
import { createChart } from "../utils/chartUtils";
import { tooltipStyle } from "../styles/chartStyles";

const { WIDTH, HEIGHT } = CHART_DIMENSIONS;

interface ChartCanvasProps {
  data: DataPoint[];
}

export const ChartCanvas: React.FC<ChartCanvasProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!data.length || !svgRef.current || !tooltipRef.current) return;

    const svg = d3.select(svgRef.current);
    const tooltip = d3.select(tooltipRef.current);

    createChart(svg, tooltip, data);
  }, [data]);

  return (
    <>
      <svg ref={svgRef} width={WIDTH} height={HEIGHT}></svg>
      <div ref={tooltipRef} style={tooltipStyle}></div>
    </>
  );
};
