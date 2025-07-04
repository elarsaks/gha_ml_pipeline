// Inject CSS keyframes for animations
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
  `;
  document.head.appendChild(styleSheet);
};
