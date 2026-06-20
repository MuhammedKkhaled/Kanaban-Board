import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            transitionTimingFunction: {
                // Stronger curves than the built-in CSS easings (Emil Kowalski).
                'out-strong': 'cubic-bezier(0.23, 1, 0.32, 1)',
                'in-out-strong': 'cubic-bezier(0.77, 0, 0.175, 1)',
            },
            keyframes: {
                'card-in': {
                    from: { opacity: '0', transform: 'translateY(8px)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
                'column-in': {
                    from: { opacity: '0', transform: 'translateY(12px) scale(0.98)' },
                    to: { opacity: '1', transform: 'translateY(0) scale(1)' },
                },
                'fade-in': {
                    from: { opacity: '0' },
                    to: { opacity: '1' },
                },
                'rise-in': {
                    from: { opacity: '0', transform: 'translateY(20px)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
                // Subtle decorative float for landing/auth visuals.
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-8px)' },
                },
            },
            animation: {
                'card-in': 'card-in 300ms cubic-bezier(0.23, 1, 0.32, 1) both',
                'column-in': 'column-in 350ms cubic-bezier(0.23, 1, 0.32, 1) both',
                'fade-in': 'fade-in 400ms cubic-bezier(0.23, 1, 0.32, 1) both',
                'rise-in': 'rise-in 500ms cubic-bezier(0.23, 1, 0.32, 1) both',
                float: 'float 6s ease-in-out infinite',
            },
        },
    },

    plugins: [forms],
};
