/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'Roboto', 'sans-serif'],
            },
            colors: {
                'glass-bg': 'rgba(255, 255, 255, 0.3)',
                'glass-border': 'rgba(255, 255, 255, 0.2)',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                fadeInLeft: {
                    '0%': { opacity: '0', transform: 'translateX(-20px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                }
            },
            animation: {
                'bounce-short': 'bounce 1s infinite',
                'fade-in': 'fadeIn 0.5s ease-out',
                'fade-in-left': 'fadeInLeft 0.5s ease-out',
            }
        },
    },
    plugins: [],
}
