import React from "react";

export const chartContainerStyle: React.CSSProperties = {
  background: "#181c24",
  borderRadius: 12,
  padding: "clamp(12px, 3vw, 24px)",
  margin: "clamp(16px, 4vw, 32px) auto",
  width: "min(900px, 95vw)",
  maxWidth: "95vw",
  boxShadow: "0 2px 16px rgba(0,0,0,0.12)",
  position: "relative",
  overflow: "visible",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

export const legendStyle: React.CSSProperties = {
  display: "flex",
  gap: "clamp(12px, 3vw, 24px)",
  marginTop: 16,
  justifyContent: "center",
  flexWrap: "wrap",
};

export const legendItemStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  color: "#fff",
  fontWeight: 500,
  fontSize: "clamp(12px, 2.5vw, 14px)",
};

export const legendColorStyle: React.CSSProperties = {
  display: "inline-block",
  width: 18,
  height: 8,
  borderRadius: 4,
};

export const backlightStyle: React.CSSProperties = {
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

export const loadingSpinnerStyle: React.CSSProperties = {
  width: "50px",
  height: "50px",
  margin: "0 auto",
  border: "3px solid rgba(255,255,255,0.2)",
  borderTop: "3px solid #2196F3",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
};

export const tooltipStyle: React.CSSProperties = {
  position: "absolute",
  padding: "clamp(6px, 2vw, 12px)",
  background: "rgba(0,0,0,0.9)",
  color: "#fff",
  borderRadius: "4px",
  fontSize: "clamp(10px, 2.5vw, 12px)",
  pointerEvents: "none",
  zIndex: 10,
  display: "none",
  boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
  transition: "transform 0.1s ease-out",
  maxWidth: "200px",
  wordWrap: "break-word",
};

export const buttonStyle: React.CSSProperties = {
  marginTop: "24px",
  padding: "8px 16px",
  background: "#2196F3",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};
