import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-base': '#0F1117',
        'bg-card': '#1A1D27',
        'border-base': '#2A2D3A',
        'text-primary': '#F1F5F9',
        'text-secondary': '#94A3B8',
        accent: '#38BDF8',
        'state-idle': '#22C55E',
        'state-smoking': '#EAB308',
        'state-warning': '#F97316',
        'state-fire': '#EF4444',
        'state-error': '#A855F7',
      },
    },
  },
  plugins: [],
} satisfies Config;
