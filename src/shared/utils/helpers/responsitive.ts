import { css } from "styled-components";

// Helper function to generate media queries for arbitrary style parameters
type StyleParams = {
  [key: string]: number; // Each property will have a numeric value (e.g., width, height, fontSize)
};

type Breakpoint = {
  minWidth?: number;
  minHeight?: number;
  scaleFactor: number;
};

export const generateResponsiveStyles = (
  styleParams: StyleParams,
  breakpoints=defaultBreakpoints
) => {
  return breakpoints.map(({ minWidth, minHeight, scaleFactor }) => {
    // Generate styles for each property based on the scale factor
    const styles = Object.entries(styleParams)
      .map(([property, value]) => `${property}: ${value * scaleFactor}px;`)
      .join("\n");

    const responseParameter = `${
        (minHeight && minWidth) ? `(min-width: ${minWidth}px)` : 
            (minWidth) ? `(min-width: ${minWidth}px)` :
                `(min-height: ${minHeight}px)`    
    }`

    // Return media query with scaled styles
    return css`
      @media ${responseParameter} {
        ${styles}
      }
    `;
  });
};

// Example breakpoints
const defaultBreakpoints: Breakpoint[] = [
  { minWidth: 933, scaleFactor: 1.5 },  // Larger screens
  { minWidth: 700, scaleFactor: 1.3 },    // Base size
  { minWidth: 600, scaleFactor: 1.2 },    // Base size
  { minWidth: 500, scaleFactor: 1.1 },    // Base size
  { minWidth: 430, scaleFactor: 1.3 },    // Base size
  { minWidth: 380, scaleFactor: 1.2 },  // Smaller screens
  { minWidth: 320, scaleFactor: 0.8 },  // Smaller screens
];