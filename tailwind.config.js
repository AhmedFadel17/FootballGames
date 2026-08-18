import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
        './resources/**/*.blade.php',
        './resources/**/*.js',
        './resources/**/*.jsx',
        './resources/**/*.ts',
        './resources/**/*.tsx',
    ],
    theme: {
        extend: {
            colors: {
                "pitch-green": "#CCFF00",
                "accent-cyan": "#00F2FF",
                "accent-pink": "#FF007F",
                "accent-purple": "#8A2BE2",
                "accent-orange": "#FF5500",

                "primary": "#00F2FF",
                "on-primary": "#003640",
                "primary-container": "#00424e",
                "on-primary-container": "#acedff",
                "secondary": "#CCFF00",
                "on-secondary": "#1A2E00",
                "secondary-container": "#335C00",
                "on-secondary-container": "#E5FF80",

                "tertiary": "#FF007F",
                "on-tertiary": "#4A0022",
                "tertiary-container": "#800040",
                "on-tertiary-container": "#FFB2CF",

                "dashboard-bg": "#060912",
                "background": "#0B1120",
                "surface": "#0B1120",
                "surface-dim": "#080D1A",
                "surface-bright": "#1F2B47",
                "surface-container-lowest": "#04070F",
                "surface-container-low": "#10182B",
                "surface-container": "#17233B",
                "surface-container-high": "#202E4C",
                "surface-container-highest": "#2A3A5E",
                "card-bg": "rgba(23, 35, 59, 0.7)",

                "on-surface": "#F0F4FF",
                "on-surface-variant": "#94A3B8",
                "outline": "#334155",
                "outline-variant": "#1E293B",

                "error": "#FF4D4D",
                "on-error": "#690005",
                "error-container": "#93000A",
                "on-error-container": "#FFDAD6",
            },
            fontFamily: {
                "headline": ["Space Grotesk", "sans-serif"],
                "body": ["Inter", "sans-serif"],
                "label": ["Inter", "sans-serif"],
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
                outfit: ["'Outfit'", ...defaultTheme.fontFamily.sans],
            },
            borderRadius: {
                "DEFAULT": "0.25rem",
                "lg": "0.5rem",
                "xl": "0.75rem",
                "2xl": "1rem",
                "3xl": "1.5rem",
                "full": "9999px"
            },
            animation: {
                'glow-pulse': 'glow-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'subtle-float': 'subtle-float 3s ease-in-out infinite',
            },
            keyframes: {
                'glow-pulse': {
                    '0%, 100%': { opacity: 1, filter: 'brightness(1)' },
                    '50%': { opacity: 0.8, filter: 'brightness(1.5)' },
                },
                'subtle-float': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-5px)' },
                }
            },
        },
    },
    plugins: [forms],
};
