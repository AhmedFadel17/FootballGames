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
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
                outfit: ["'Outfit'", ...defaultTheme.fontFamily.sans],

            },
            colors: {
                primary: '#a4193d',   
                secondary: '#ffdfb9', 
                accent: '#fcf7f8',  
                // accent: '#0a174e',  
                'steel-gray':'#1f1c2c'
            },
        },
    },

    plugins: [forms],
};
