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
        neutral: {
          100: withOpacity("--ssovee-neutral-100"),
          200: withOpacity("--ssovee-neutral-200"),
          300: withOpacity("--ssovee-neutral-300"),
          400: withOpacity("--ssovee-neutral-400"),
          500: withOpacity("--ssovee-neutral-500"),
          600: withOpacity("--ssovee-neutral-600"),
          700: withOpacity("--ssovee-neutral-700"),
          800: withOpacity("--ssovee-neutral-800"),
          900: withOpacity("--ssovee-neutral-900"),
        },
        gray: {
          500: withOpacity("--ssovee-gray-500"),
          600: withOpacity("--ssovee-gray-600"),
          700: withOpacity("--ssovee-gray-700"),
        },
        slate: {
          100: withOpacity("--ssovee-slate-100"),
          900: withOpacity("--ssovee-slate-900"),
        },
      },
    },
  },
};
