/** @type {import('tailwindcss').Config} */
const withOpacity = (variable) => `rgb(var(${variable}) / <alpha-value>)`;

export default {
  theme: {
    extend: {
      colors: {
        primary: withOpacity("--ssovee-primary"),
        secondary: withOpacity("--ssovee-secondary"),
        "surface-1": withOpacity("--ssovee-surface-1"),
        "surface-2": withOpacity("--ssovee-surface-2"),
        "surface-3": withOpacity("--ssovee-surface-3"),
        "surface-4": withOpacity("--ssovee-surface-4"),
        "brand-color": withOpacity("--ssovee-brand-color"),
        "border-1": withOpacity("--ssovee-border-1"),
        muted: withOpacity("--ssovee-muted"),
      },
    },
  },
};
