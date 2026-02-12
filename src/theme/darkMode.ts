// Dark mode color schemes for charts and UI components

export const chartColors = {
  light: {
    primary: '#4f46e5',       // indigo-600
    secondary: '#06b6d4',     // cyan-500
    success: '#10b981',       // emerald-500
    warning: '#f59e0b',       // amber-500
    danger: '#ef4444',        // red-500
    neutral: '#64748b',       // slate-500
    background: '#ffffff',
    foreground: '#0f172a',    // slate-900
    gridLine: '#e2e8f0',      // slate-200
    text: '#1e293b',          // slate-800
  },
  dark: {
    primary: '#818cf8',       // indigo-400
    secondary: '#22d3ee',     // cyan-400
    success: '#34d399',       // emerald-400
    warning: '#fbbf24',       // amber-400
    danger: '#f87171',        // red-400
    neutral: '#94a3b8',       // slate-400
    background: '#020617',    // slate-950
    foreground: '#f1f5f9',    // slate-100
    gridLine: '#334155',      // slate-700
    text: '#e2e8f0',          // slate-200
  }
};

export const getChartTheme = (isDark: boolean) => {
  const theme = isDark ? chartColors.dark : chartColors.light;
  
  return {
    cartesianAxisStyles: {
      stroke: theme.gridLine,
      style: { fontSize: '12px' },
    },
    cartesianGridStyles: {
      strokeDasharray: '3 3',
      stroke: theme.gridLine,
      opacity: 0.5,
    },
    textStyle: {
      fill: theme.text,
      fontSize: 12,
    },
    tooltipStyle: {
      backgroundColor: isDark ? '#1e293b' : '#ffffff',
      border: `1px solid ${theme.gridLine}`,
      borderRadius: '8px',
      color: theme.text,
    },
    colors: [
      theme.primary,
      theme.secondary,
      theme.success,
      theme.warning,
      theme.danger,
    ],
  };
};

export const darkModeClasses = {
  // Backgrounds
  bg: {
    primary: 'bg-white dark:bg-slate-900',
    secondary: 'bg-slate-50 dark:bg-slate-800',
    tertiary: 'bg-slate-100 dark:bg-slate-700',
    overlay: 'bg-black/50 dark:bg-black/70',
  },
  // Text
  text: {
    primary: 'text-slate-900 dark:text-white',
    secondary: 'text-slate-600 dark:text-slate-400',
    tertiary: 'text-slate-500 dark:text-slate-500',
    muted: 'text-slate-400 dark:text-slate-600',
  },
  // Borders
  border: {
    primary: 'border-slate-200 dark:border-slate-700',
    secondary: 'border-slate-100 dark:border-slate-800',
  },
  // Hover
  hover: {
    bg: 'hover:bg-slate-50 dark:hover:bg-slate-800',
    text: 'hover:text-slate-900 dark:hover:text-white',
  },
};
