import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const chartContainerStyle: React.CSSProperties = {
  background: "#181c24",
  borderRadius: 12,
  padding: 24,
  margin: "32px auto",
  maxWidth: 900,
  boxShadow: "0 2px 16px rgba(0,0,0,0.12)",
  position: "relative",
  overflow: "visible",
};
const legendStyle: React.CSSProperties = {
  display: "flex",
  gap: 24,
  marginTop: 16,
};
const legendItemStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
};
const legendColorStyle: React.CSSProperties = {
  display: "inline-block",
  width: 18,
  height: 8,
  borderRadius: 4,
};
const backlightStyle: React.CSSProperties = {
  position: "absolute",
  content: '""',
  top: "5vw",
  left: 0,
  right: 0,
  zIndex: -1,
  height: "100%",
  width: "100%",
  margin: "0 auto",
  transform: "scale(0.75)",
  filter: "blur(5vw)",
  background: "linear-gradient(270deg, #0fffc1, #7e0fff)",
  backgroundSize: "200% 200%",
  animation: "animateGlow 10s ease infinite",
  pointerEvents: "none",
};

const COIN_BUBBLE_API_URL =
  "https://api.coinybubble.com/v1/history/5min?hours=12";

interface DataPoint {
  interval_end_time: string;
  close_bitcoin_price_usd: number;
  avg_actual_value: number;
}

const WIDTH = 800;
const HEIGHT = 400;
const MARGIN = { top: 20, right: 60, bottom: 40, left: 60 };

const styleSheet = document.createElement("style");
styleSheet.innerHTML = `
@keyframes animateGlow {
  0%{background-position:0% 50%}
  50%{background-position:100% 50%}
  100%{background-position:0% 50%}
}`;
document.head.appendChild(styleSheet);

const BTCFearGreedChart: React.FC = () => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    fetch(COIN_BUBBLE_API_URL)
      .then((res) => res.json())
      .then((json) => {
        setData(json || []);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!data.length || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const parseDate = d3.utcParse("%Y-%m-%dT%H:%M:%SZ");
    const times = data.map((d) => parseDate(d.interval_end_time) as Date);
    const prices = data.map((d) => d.close_bitcoin_price_usd);
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(times) as [Date, Date])
      .range([MARGIN.left, WIDTH - MARGIN.right]);
    const yPrice = d3
      .scaleLinear()
      .domain([d3.min(prices) as number, d3.max(prices) as number])
      .nice()
      .range([HEIGHT - MARGIN.bottom, MARGIN.top]);
    const yFear = d3
      .scaleLinear()
      .domain([0, 100])
      .range([HEIGHT - MARGIN.bottom, MARGIN.top]);
    const priceArea = d3
      .area<DataPoint>()
      .x((d) => xScale(parseDate(d.interval_end_time) as Date))
      .y0(HEIGHT - MARGIN.bottom)
      .y1((d) => yPrice(d.close_bitcoin_price_usd));
    const priceLine = d3
      .line<DataPoint>()
      .x((d) => xScale(parseDate(d.interval_end_time) as Date))
      .y((d) => yPrice(d.close_bitcoin_price_usd));
    const fearLine = d3
      .line<DataPoint>()
      .x((d) => xScale(parseDate(d.interval_end_time) as Date))
      .y((d) => yFear(d.avg_actual_value));
    svg
      .append("rect")
      .attr("width", WIDTH)
      .attr("height", HEIGHT)
      .attr("fill", "transparent");
    const xAxis = d3.axisBottom(xScale).ticks(8);
    const yAxisLeft = d3.axisLeft(yPrice).ticks(6);
    const yAxisRight = d3.axisRight(yFear).ticks(5);
    svg
      .append("g")
      .attr("transform", `translate(0,${HEIGHT - MARGIN.bottom})`)
      .call(xAxis)
      .call((g) =>
        g.selectAll("path, line").attr("stroke", "rgba(255,255,255,0.3)")
      )
      .call((g) => g.selectAll("text").attr("fill", "#ccc"));
    svg
      .append("g")
      .attr("transform", `translate(${MARGIN.left},0)`)
      .call(yAxisLeft)
      .call((g) =>
        g.selectAll("path, line").attr("stroke", "rgba(255,255,255,0.3)")
      )
      .call((g) => g.selectAll("text").attr("fill", "#ccc"));
    svg
      .append("g")
      .attr("transform", `translate(${WIDTH - MARGIN.right},0)`)
      .call(yAxisRight)
      .call((g) =>
        g.selectAll("path, line").attr("stroke", "rgba(255,255,255,0.3)")
      )
      .call((g) => g.selectAll("text").attr("fill", "#ccc"));
    svg
      .append("path")
      .datum(data)
      .attr("fill", "rgba(33,150,243,0.3)")
      .attr("d", priceArea);
    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#2196F3")
      .attr("stroke-width", 2)
      .attr("d", priceLine);
    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#FFC107")
      .attr("stroke-width", 2)
      .attr("d", fearLine);
  }, [data]);

  if (loading) {
    return <div style={chartContainerStyle}>Loading chart...</div>;
  }

  return (
    <div style={chartContainerStyle}>
      <div style={backlightStyle}></div>
      <svg ref={svgRef} width={WIDTH} height={HEIGHT}></svg>
      <div style={legendStyle}>
        <div style={legendItemStyle}>
          <span style={{ ...legendColorStyle, background: "#FFC107" }}></span>
          <span>Fear & Greed Index</span>
        </div>
        <div style={legendItemStyle}>
          <span style={{ ...legendColorStyle, background: "#2196F3" }}></span>
          <span>Bitcoin Price (USD)</span>
        </div>
      </div>
    </div>
  );
};

export default BTCFearGreedChart;
