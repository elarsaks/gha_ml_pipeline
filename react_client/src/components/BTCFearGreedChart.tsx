import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import "./BTCFearGreedChart.css";

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
    return <div className="chart-container">Loading chart...</div>;
  }

  return (
    <div className="chart-container">
      <svg ref={svgRef} width={WIDTH} height={HEIGHT}></svg>
      <div className="legend">
        <div className="legend-item">
          <span className="legend-color fg"></span>
          <span>Fear & Greed Index</span>
        </div>
        <div className="legend-item">
          <span className="legend-color btc"></span>
          <span>Bitcoin Price (USD)</span>
        </div>
      </div>
    </div>
  );
};

export default BTCFearGreedChart;
