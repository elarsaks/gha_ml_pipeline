import * as d3 from "d3";
import { DataPoint } from "../types";
import { CHART_DIMENSIONS } from "../constants";

const { WIDTH, HEIGHT, MARGIN } = CHART_DIMENSIONS;

export const createChart = (
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  tooltip: d3.Selection<HTMLDivElement, unknown, null, undefined>,
  data: DataPoint[]
): void => {
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

  // Add axes
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

  // Add gradient for area chart
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

  // Add area chart
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

  // Add actual price line
  svg
    .append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "#2196F3")
    .attr("stroke-width", 2)
    .attr("d", lineActual);

  // Add predicted price line
  svg
    .append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "#8E24AA")
    .attr("stroke-width", 2)
    .attr("stroke-dasharray", "5,5")
    .attr("d", linePred);

  // Add tooltip interaction
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
};
