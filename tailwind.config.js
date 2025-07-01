/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#3B82F6',
          DEFAULT: '#3B82F6',
          dark: '#60A5FA'
        },
        secondary: {
          light: '#10B981',
          DEFAULT: '#10B981',
          dark: '#34D399'
        },
        accent: {
          light: '#8B5CF6',
          DEFAULT: '#8B5CF6',
          dark: '#A78BFA'
        },
        background: {
          light: '#FFFFFF',
          dark: '#121212'
        },
        surface: {
          light: '#F9FAFB',
          dark: '#1E1E1E'
        },
        text: {
          light: '#1F2937',
          dark: '#F3F4F6'
        },
        border: {
          light: '#E5E7EB',
          dark: '#374151'
        }
      },
    },
  },
  plugins: [],
} 