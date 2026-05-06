/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#050505',
        primary: '#00D4FF',
        secondary: '#7C3AED',
        accent: '#F59E0B',
        success: '#10B981',
        surface: '#0D0D0D',
        surfaceLight: '#161616',
        border: '#1a1a2e',
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'radial-gradient(ellipse at 50% 0%, rgba(0,212,255,0.15) 0%, rgba(5,5,5,0) 70%)',
        'card-gradient': 'linear-gradient(135deg, rgba(13,13,13,0.9) 0%, rgba(22,22,22,0.9) 100%)',
      },
      boxShadow: {
        'neon-blue': '0 0 20px rgba(0,212,255,0.4), 0 0 60px rgba(0,212,255,0.1)',
        'neon-purple': '0 0 20px rgba(124,58,237,0.4), 0 0 60px rgba(124,58,237,0.1)',
        'neon-gold': '0 0 20px rgba(245,158,11,0.4), 0 0 60px rgba(245,158,11,0.1)',
        'card': '0 4px 24px rgba(0,0,0,0.6)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(0,212,255,0.4)' },
          '100%': { boxShadow: '0 0 40px rgba(0,212,255,0.8), 0 0 80px rgba(0,212,255,0.3)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
