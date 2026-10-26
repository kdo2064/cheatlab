/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Surface stack (warm-dark). Darkest -> lightest.
        'canvas':   '#080806',
        'surface':  '#0d0c0a',
        'card':     '#131210',
        'row-alt':  '#0f0e0c',
        'elevated': '#1a1815',

        // Borders
        'line':        '#272420',
        'line-hover':  '#3a342e',
        'line-strong': '#4a433c',

        // Brand: blue (logo primary)
        'brand':       '#2557d4',
        'brand-hover': '#2f65e8',
        'brand-light': '#4d7ff0',
        'brand-text':  '#7aa3f5',

        // Lime accent (logo secondary — "Lab" color)
        'lime':    '#a3d900',
        'lime-lt': '#c4f000',

        // Text
        'txt-primary':   '#f0ece6',
        'txt-secondary': '#a09890',
        'txt-muted':     '#5a524c',
        'txt-disabled':  '#2a2420',

        // Status
        'st-saved':   '#27ae60',
        'st-saving':  '#f39c12',
        'st-unsaved': '#e67e22',
        'st-error':   '#e74c3c',

        // Legacy alias consumed by App.tsx (`bg-bg-base`)
        'bg-base': '#080806',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"Cascadia Code"', '"JetBrains Mono"', 'Consolas', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        ctl:  '6px', // buttons, inputs
        card: '8px', // cards, panels
      },
      transitionDuration: { DEFAULT: '120ms' },
    },
  },
  plugins: [],
};
