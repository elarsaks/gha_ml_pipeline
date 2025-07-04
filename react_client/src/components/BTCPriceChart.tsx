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
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};
const legendStyle: React.CSSProperties = {
  display: "flex",
  gap: 24,
  marginTop: 16,
  justifyContent: "center",
};
const legendItemStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  color: "#fff",
  fontWeight: 500,
};
const legendColorStyle: React.CSSProperties = {
  display: "inline-block",
  width: 18,
  height: 8,
  borderRadius: 4,
};
const backlightStyle: React.CSSProperties = {
  position: "absolute",
  content: "''",
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

const DATA_URL =
  "https://raw.githubusercontent.com/elarsaks/gha_ml_pipeline/master/data/raw/fear_and_greed_history_5min.jsonl";
const MODEL_WEIGHTS_URL =
  "https://raw.githubusercontent.com/elarsaks/gha_ml_pipeline/master/models/champion_model.csv";

interface DataPoint {
  interval_end_time: string;
  close_bitcoin_price_usd: number;
  avg_actual_value: number;
  predicted_btc_price?: number;
}

interface ModelWeights {
  intercept: number;
  coefficient: number;
}

const WIDTH = 800;
const HEIGHT = 400;
const MARGIN = { top: 20, right: 60, bottom: 40, left: 60 };

// Inject keyframes
const styleSheet = document.createElement("style");
styleSheet.innerHTML = `
@keyframes animateGlow { 0% { background-position:0% 50% } 50% { background-position:100% 50% } 100% { background-position:0% 50% } }
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
`;
document.head.appendChild(styleSheet);

const BTCPriceChart: React.FC = () => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [modelWeights, setModelWeights] = useState<ModelWeights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Fetch line-delimited JSONL
    const fetchData = fetch(DATA_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch data: ${res.status}`);
        return res.text();
      })
      .then((text) => {
        return text
          .split("\n")
          .filter((line) => line.trim())
          .map((line) => JSON.parse(line) as DataPoint);
      });

    // Fetch CSV of model weights
    const fetchModelWeights = fetch(MODEL_WEIGHTS_URL)
      .then((res) => {
        if (!res.ok)
          throw new Error(`Failed to fetch model weights: ${res.status}`);
        return res.text();
      })
      .then((csv) => {
        const lines = csv.split("\n").filter((l) => l.trim());
        if (lines.length < 2) throw new Error("Invalid model weights");
        const weights: ModelWeights = { intercept: 0, coefficient: 0 };
        for (let i = 1; i < lines.length; i++) {
          const [feature, w] = lines[i].split(",");
          const val = parseFloat(w);
          if (feature === "intercept") weights.intercept = val;
          else if (
            feature === "avg_actual_value" ||
            feature === "fear_greed_index"
          )
            weights.coefficient = val;
        }
        return weights;
      });

    Promise.all([fetchData, fetchModelWeights])
      .then(([raw, weights]) => {
        // Add predictions
        const withPred = raw.map((pt) => ({
          ...pt,
          predicted_btc_price:
            weights.intercept + weights.coefficient * pt.avg_actual_value,
        }));

        // Sort in place by `interval_end_time`
        const parseDate = d3.utcParse("%Y-%m-%dT%H:%M:%SZ");
        withPred.sort(
          (a, b) =>
            parseDate(a.interval_end_time)!.getTime() -
            parseDate(b.interval_end_time)!.getTime()
        );

        setData(withPred);
        setModelWeights(weights);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!data.length || !svgRef.current || !tooltipRef.current) return;
    const svg = d3.select(svgRef.current);
    const tooltip = d3.select(tooltipRef.current);
    svg.selectAll("*").remove();
    const parseDate = d3.utcParse("%Y-%m-%dT%H:%M:%SZ");
    const fmtDate = d3.timeFormat("%b %d, %H:%M UTC");
    const fmtPrice = d3.format("$,.2f");

    const times = data.map((d) => parseDate(d.interval_end_time) as Date);
    const actuals = data.map((d) => d.close_bitcoin_price_usd);
    const preds = data.map((d) => d.predicted_btc_price || 0);
    const allPrices = [...actuals, ...preds];
    const yMin = d3.min(allPrices) as number;
    const yMax = d3.max(allPrices) as number;

    const xScale = d3
      .scaleTime()
      .domain(d3.extent(times) as [Date, Date])
      .range([MARGIN.left, WIDTH - MARGIN.right]);

    const yScale = d3
      .scaleLinear()
      .domain([yMin * 0.99, yMax * 1.01])
      .nice()
      .range([HEIGHT - MARGIN.bottom, MARGIN.top]);

    const lineActual = d3
      .line<DataPoint>()
      .x((d) => xScale(parseDate(d.interval_end_time) as Date))
      .y((d) => yScale(d.close_bitcoin_price_usd));

    const linePred = d3
      .line<DataPoint>()
      .x((d) => xScale(parseDate(d.interval_end_time) as Date))
      .y((d) => yScale(d.predicted_btc_price || 0));

    // Axes
    svg
      .append("g")
      .attr("transform", `translate(0,${HEIGHT - MARGIN.bottom})`)
      .call(d3.axisBottom(xScale).ticks(8))
      .call((g) =>
        g.selectAll("path, line").attr("stroke", "rgba(255,255,255,0.3)")
      )
      .call((g) => g.selectAll("text").attr("fill", "#ccc"));

    svg
      .append("g")
      .attr("transform", `translate(${MARGIN.left},0)`)
      .call(
        d3
          .axisLeft(yScale)
          .ticks(6)
          .tickFormat((d) => `$${d3.format(",.0f")(d as number)}`)
      )
      .call((g) =>
        g.selectAll("path, line").attr("stroke", "rgba(255,255,255,0.3)")
      )
      .call((g) => g.selectAll("text").attr("fill", "#ccc"));

    // Area under actual
    svg
      .append("defs")
      .append("linearGradient")
      .attr("id", "actual-grad")
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", 0)
      .attr("y1", yScale(yMin))
      .attr("x2", 0)
      .attr("y2", yScale(yMax))
      .call((def) => {
        def
          .append("stop")
          .attr("offset", "0%")
          .attr("stop-color", "rgba(33,150,243,0)");
        def
          .append("stop")
          .attr("offset", "100%")
          .attr("stop-color", "rgba(33,150,243,0.2)");
      });

    svg
      .append("path")
      .datum(data)
      .attr("fill", "url(#actual-grad)")
      .attr(
        "d",
        d3
          .area<DataPoint>()
          .x((d) => xScale(parseDate(d.interval_end_time) as Date))
          .y0(HEIGHT - MARGIN.bottom)
          .y1((d) => yScale(d.close_bitcoin_price_usd))
      );

    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#2196F3")
      .attr("stroke-width", 2)
      .attr("d", lineActual);

    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#8E24AA")
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "5,5")
      .attr("d", linePred);

    // Tooltip interaction
    const pointsLayer = svg.append("g");
    svg
      .append("rect")
      .attr("width", WIDTH)
      .attr("height", HEIGHT)
      .attr("fill", "transparent")
      .on("mousemove", (event) => {
        const [mx, my] = d3.pointer(event);
        let minDist = Infinity;
        let idx = -1;
        data.forEach((d, i) => {
          const x = xScale(parseDate(d.interval_end_time) as Date);
          const y = yScale(d.close_bitcoin_price_usd);
          const dist = Math.hypot(x - mx, y - my);
          if (dist < minDist) {
            minDist = dist;
            idx = i;
          }
        });
        if (minDist < 50 && idx >= 0) {
          const d = data[idx];
          const x = xScale(parseDate(d.interval_end_time) as Date);
          const yA = yScale(d.close_bitcoin_price_usd);
          const yP = yScale(d.predicted_btc_price || 0);
          tooltip
            .style("display", "block")
            .style("left", `${x + 10}px`)
            .style("top", `${yA - 10}px`)
            .html(
              `<div style='font-weight:bold;margin-bottom:5px'>${fmtDate(
                parseDate(d.interval_end_time) as Date
              )}</div>` +
                `<div style='color:#2196F3;margin-bottom:3px'>Actual: ${fmtPrice(
                  d.close_bitcoin_price_usd
                )}</div>` +
                `<div style='color:#8E24AA'>Predicted: ${fmtPrice(
                  d.predicted_btc_price || 0
                )}</div>` +
                `<div style='margin-top:5px;font-size:11px;opacity:0.8'>Fear & Greed: ${d.avg_actual_value}</div>`
            );
          pointsLayer.selectAll("circle").remove();
          pointsLayer
            .append("circle")
            .attr("cx", x)
            .attr("cy", yA)
            .attr("r", 5)
            .attr("fill", "#2196F3")
            .attr("stroke", "#fff")
            .attr("stroke-width", 2);
          pointsLayer
            .append("circle")
            .attr("cx", x)
            .attr("cy", yP)
            .attr("r", 5)
            .attr("fill", "#8E24AA")
            .attr("stroke", "#fff")
            .attr("stroke-width", 2);
        }
      })
      .on("mouseleave", () => {
        tooltip.style("display", "none");
        pointsLayer.selectAll("circle").remove();
      });
  }, [data]);

  if (loading) {
    return (
      <div style={chartContainerStyle}>
        <div style={backlightStyle}></div>
        <div style={{ color: "#fff", padding: "40px", textAlign: "center" }}>
          <div style={{ fontSize: "18px", marginBottom: "16px" }}>
            Loading chart and model weights...
          </div>
          <div
            style={{
              width: "50px",
              height: "50px",
              margin: "0 auto",
              border: "3px solid rgba(255,255,255,0.2)",
              borderTop: "3px solid #2196F3",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          ></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={chartContainerStyle}>
        <div style={backlightStyle}></div>
        <div style={{ color: "#ff5252", padding: "40px", textAlign: "center" }}>
          <div style={{ fontSize: "18px", marginBottom: "16px" }}>
            Error loading chart
          </div>
          <div>{error}</div>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: "24px",
              padding: "8px 16px",
              background: "#2196F3",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={chartContainerStyle}>
      <div style={backlightStyle}></div>
      <svg ref={svgRef} width={WIDTH} height={HEIGHT}></svg>
      <div
        ref={tooltipRef}
        style={{
          position: "absolute",
          padding: "8px 12px",
          background: "rgba(0,0,0,0.8)",
          color: "#fff",
          borderRadius: "4px",
          fontSize: "12px",
          pointerEvents: "none",
          zIndex: 10,
          display: "none",
          boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
          transition: "transform 0.1s ease-out",
        }}
      ></div>
      <div style={legendStyle}>
        <div style={legendItemStyle}>
          <span style={{ ...legendColorStyle, background: "#2196F3" }}></span>
          <span>Actual BTC Price</span>
        </div>
        <div style={legendItemStyle}>
          <span style={{ ...legendColorStyle, background: "#8E24AA" }}></span>
          <span>Predicted BTC Price</span>
        </div>
      </div>
      {modelWeights && (
        <div style={{ color: "#ccc", marginTop: "16px", fontSize: "14px" }}>
          Model: BTC Price = {modelWeights.intercept.toFixed(2)} +{" "}
          {modelWeights.coefficient.toFixed(6)} × Fear &amp; Greed Index
        </div>
      )}
    </div>
  );
};

export default BTCPriceChart;
