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
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                // --- Material 3 Core Tokens (Derived from Logo) ---
                "primary": "#FF7700",                     // Bright vibrant orange
                "on-primary": "#3B1000",                  // Dark contrast text on primary
                "primary-container": "#FF5500",           // Vivid fiery orange
                "on-primary-container": "#FFEAE0",        // Light contrast text on primary container
                "primary-fixed": "#FFD700",               // Gold/yellow highlight from logo
                "primary-fixed-dim": "#FFCC00",           // Slightly muted yellow highlight
                "on-primary-fixed": "#332B00",            // Text on primary fixed
                "on-primary-fixed-variant": "#806B00",    // Muted text on primary fixed

                "secondary": "#E60023",                   // Crimson/Red border ring from logo
                "on-secondary": "#FFFFFF",                 // Text on secondary
                "secondary-container": "#900014",         // Deep crimson container
                "on-secondary-container": "#FFDADA",      // Light text on secondary container
                "secondary-fixed": "#FFDADA",             // Fixed light red tint
                "secondary-fixed-dim": "#FFB4B4",         // Muted red tint
                "on-secondary-fixed": "#410007",          // Dark text on secondary fixed
                "on-secondary-fixed-variant": "#8B0011",  // Variant text on secondary fixed

                "tertiary": "#FFD700",                    // Energetic yellow text fill from logo
                "on-tertiary": "#3A2E00",                 // Contrast text on tertiary
                "tertiary-container": "#594800",          // Deep dark yellow/amber container
                "on-tertiary-container": "#FFEBA3",       // Light text on tertiary container
                "tertiary-fixed": "#FFF0B3",              // Soft yellow tint
                "tertiary-fixed-dim": "#FFE066",          // Fixed dim yellow
                "on-tertiary-fixed": "#241D00",           // Text on tertiary fixed
                "on-tertiary-fixed-variant": "#594800",   // Variant text on tertiary fixed

                // --- Backgrounds & Surfaces (Preserved Deep Navy Tone) ---
                "background": "#0b1326",
                "on-background": "#F5F5F7",
                "surface": "#0b1326",
                "on-surface": "#F5F5F7",
                "surface-dim": "#0b1326",
                "surface-bright": "#31394e",
                "surface-tint": "#FF7700",
                "surface-variant": "#2d3449",
                "on-surface-variant": "#c2c6d6",
                "surface-container-lowest": "#060d20",
                "surface-container-low": "#131b2e",
                "surface-container": "#171f33",
                "surface-container-high": "#222a3e",
                "surface-container-highest": "#2d3449",
                "inverse-surface": "#F5F5F7",
                "inverse-on-surface": "#171f33",
                "inverse-primary": "#FF5500",

                // --- Outlines & Borders ---
                "outline": "#8c909f",
                "outline-variant": "#424754",

                // --- Feedback / Error States ---
                "error": "#ffb4ab",
                "on-error": "#690005",
                "error-container": "#93000a",
                "on-error-container": "#ffdad6",

                // --- Legacy Fallback Tokens (Updated to match logo accents) ---
                "pitch-green": "#CCFF00",
                "accent-cyan": "#00F2FF",
                "accent-pink": "#E60023",                 // Updated to logo crimson red
                "accent-purple": "#8A2BE2",
                "accent-orange": "#FF5500",               // Updated to logo fiery orange
                "accent-yellow": "#FFD700",               // Added logo vivid yellow
                "dashboard-bg": "#0b1326",
                "card-bg": "rgba(30, 41, 59, 0.6)",
            },
            borderRadius: {
                "DEFAULT": "0.125rem",
                "lg": "0.25rem",
                "xl": "0.5rem",
                "2xl": "0.75rem",
                "3xl": "1rem",
                "full": "0.75rem"
            },
            spacing: {
                "margin-mobile": "16px",
                "container-max-width": "1280px",
                "container-max": "1280px",
                "gutter": "16px",
                "margin-desktop": "32px",
                "unit": "4px"
            },
            fontFamily: {
                "headline-lg-mobile": ["Archivo Narrow", "sans-serif"],
                "body-md": ["Archivo Narrow", "sans-serif"],
                "headline-lg": ["Archivo Narrow", "sans-serif"],
                "title-md": ["Archivo Narrow", "sans-serif"],
                "display-lg": ["Archivo Narrow", "sans-serif"],
                "label-sm": ["Archivo Narrow", "sans-serif"],
                "archivo": ["Archivo Narrow", "sans-serif"],
                "headline": ["Archivo Narrow", "sans-serif"],
                "body": ["Archivo Narrow", "sans-serif"],
                "label": ["Archivo Narrow", "sans-serif"],
                sans: ['Archivo Narrow', 'Figtree', ...defaultTheme.fontFamily.sans],
                outfit: ["'Outfit'", ...defaultTheme.fontFamily.sans],
            },
            fontSize: {
                "headline-lg-mobile": ["24px", { "lineHeight": "30px", "fontWeight": "700" }],
                "body-md": ["16px", { "lineHeight": "24px", "fontWeight": "400" }],
                "headline-lg": ["32px", { "lineHeight": "40px", "letterSpacing": "-0.01em", "fontWeight": "700" }],
                "title-md": ["20px", { "lineHeight": "28px", "fontWeight": "600" }],
                "display-lg": ["48px", { "lineHeight": "52px", "letterSpacing": "-0.02em", "fontWeight": "700" }],
                "label-sm": ["12px", { "lineHeight": "16px", "letterSpacing": "0.05em", "fontWeight": "600" }]
            },
            animation: {
                'glow-pulse': 'glow-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'subtle-float': 'subtle-float 3s ease-in-out infinite',
                'spin-reverse': 'spin-reverse 2s linear infinite',
            },
            keyframes: {
                'glow-pulse': {
                    '0%, 100%': { opacity: 1, filter: 'brightness(1)' },
                    '50%': { opacity: 0.8, filter: 'brightness(1.5)' },
                },
                'subtle-float': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-5px)' },
                },
                'spin-reverse': {
                    'from': { transform: 'rotate(360deg)' },
                    'to': { transform: 'rotate(0deg)' },
                }
            },
        },
    },
    plugins: [forms],
};

