// Inject CSS keyframes for animations and responsive styles
export const injectKeyframes = (): void => {
  const styleSheet = document.createElement("style");
  styleSheet.innerHTML = `
    @keyframes animateGlow { 
      0% { background-position: 0% 50% } 
      50% { background-position: 100% 50% } 
      100% { background-position: 0% 50% } 
    }
    @keyframes spin { 
      0% { transform: rotate(0deg); } 
      100% { transform: rotate(360deg); } 
    }
    
    /* Mobile responsive styles */
    @media (max-width: 768px) {
      body {
        padding: 0 8px;
      }
      
      * {
        box-sizing: border-box;
      }
      
      /* Ensure charts don't overflow on mobile */
      svg {
        max-width: 100% !important;
        height: auto !important;
      }
    }
    
    /* Prevent horizontal scroll on mobile */
    @media (max-width: 480px) {
      body {
        overflow-x: hidden;
      }
    }
  `;
  document.head.appendChild(styleSheet);
};
