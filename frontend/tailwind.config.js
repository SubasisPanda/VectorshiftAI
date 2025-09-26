// // frontend/tailwind.config.js
// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     "./src/**/*.{js,jsx,ts,tsx}",
//   ],
//   theme: {
//     extend: {
//       colors: {
//         // VectorShift inspired color palette
//         primary: {
//           50: '#eff6ff',
//           100: '#dbeafe',
//           200: '#bfdbfe',
//           300: '#93c5fd',
//           400: '#60a5fa',
//           500: '#3b82f6',
//           600: '#2563eb',
//           700: '#1d4ed8',
//           800: '#1e40af',
//           900: '#1e3a8a',
//         },
//         dark: {
//           50: '#f8fafc',
//           100: '#f1f5f9',
//           200: '#e2e8f0',
//           300: '#cbd5e1',
//           400: '#94a3b8',
//           500: '#64748b',
//           600: '#475569',
//           700: '#334155',
//           800: '#1e293b',
//           900: '#0f172a',
//         },
//         glass: {
//           light: 'rgba(255, 255, 255, 0.1)',
//           medium: 'rgba(255, 255, 255, 0.2)',
//           dark: 'rgba(0, 0, 0, 0.1)',
//         }
//       },
//       backgroundImage: {
//         'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
//         'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
//         'mesh-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//         'dark-mesh': 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
//       },
//       animation: {
//         'float': 'float 6s ease-in-out infinite',
//         'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
//         'glow': 'glow 2s ease-in-out infinite alternate',
//         'slide-up': 'slideUp 0.3s ease-out',
//         'slide-down': 'slideDown 0.3s ease-out',
//       },
//       keyframes: {
//         float: {
//           '0%, 100%': { transform: 'translateY(0px)' },
//           '50%': { transform: 'translateY(-10px)' },
//         },
//         glow: {
//           '0%': { boxShadow: '0 0 5px rgba(59, 130, 246, 0.5)' },
//           '100%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.8)' },
//         },
//         slideUp: {
//           '0%': { transform: 'translateY(10px)', opacity: '0' },
//           '100%': { transform: 'translateY(0)', opacity: '1' },
//         },
//         slideDown: {
//           '0%': { transform: 'translateY(-10px)', opacity: '0' },
//           '100%': { transform: 'translateY(0)', opacity: '1' },
//         },
//       },
//       backdropBlur: {
//         xs: '2px',
//       },
//       fontFamily: {
//         sans: ['Inter', 'system-ui', 'sans-serif'],
//         mono: ['JetBrains Mono', 'monospace'],
//       },
//     },
//   },
//   plugins: [
//     require('@tailwindcss/forms'),
//   ],
// }
