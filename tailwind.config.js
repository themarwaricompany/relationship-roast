/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                cream: '#FFFBF0',
                ink: '#1A1A1A',
                red: {
                    DEFAULT: '#FF3B30',
                    dark: '#E0342A',
                }
            },
            fontFamily: {
                heading: ['Clash Display', 'sans-serif'],
                body: ['Inter', 'sans-serif'],
            },
            boxShadow: {
                neo: '6px 6px 0px 0px rgba(0, 0, 0, 1)',
            },
            animation: {
                float: 'float 4s ease-in-out infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' },
                }
            }
        },
    },
    plugins: [],
}
