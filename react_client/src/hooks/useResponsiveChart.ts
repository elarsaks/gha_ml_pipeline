import { useState, useEffect } from "react";
import { CHART_DIMENSIONS } from "../constants";

interface ResponsiveChartDimensions {
  width: number;
  height: number;
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

export const useResponsiveChart = (): ResponsiveChartDimensions => {
  const [dimensions, setDimensions] = useState<ResponsiveChartDimensions>({
    width: CHART_DIMENSIONS.WIDTH,
    height: CHART_DIMENSIONS.HEIGHT,
    margin: CHART_DIMENSIONS.MARGIN,
  });

  useEffect(() => {
    const updateDimensions = () => {
      const isMobile = window.innerWidth <= CHART_DIMENSIONS.MOBILE_BREAKPOINT;

      if (isMobile) {
        // Calculate mobile dimensions based on screen width
        const availableWidth = Math.min(
          window.innerWidth * 0.9,
          CHART_DIMENSIONS.MOBILE_WIDTH
        );
        const scaleFactor = availableWidth / CHART_DIMENSIONS.MOBILE_WIDTH;

        setDimensions({
          width: availableWidth,
          height: CHART_DIMENSIONS.MOBILE_HEIGHT * scaleFactor,
          margin: CHART_DIMENSIONS.MOBILE_MARGIN,
        });
      } else {
        setDimensions({
          width: CHART_DIMENSIONS.WIDTH,
          height: CHART_DIMENSIONS.HEIGHT,
          margin: CHART_DIMENSIONS.MARGIN,
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  return dimensions;
};
