/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'bg-deep': '#0a0908',
                'bg-dark': '#0f0d0a',
                'bg-card': 'rgba(20, 17, 14, 0.8)',
                'border-subtle': 'rgba(255, 147, 41, 0.1)',
                'ember-core': '#ff9933',
                'ember-glow': 'rgba(255, 147, 41, 0.3)',
                'ember-halo': 'rgba(255, 111, 0, 0.15)',
                'text-primary': '#f5f0e8',
                'text-secondary': 'rgba(245, 240, 232, 0.6)',
                'text-dim': 'rgba(245, 240, 232, 0.3)',
                'accent': '#ffb366',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                mono: ['Fira Code', 'monospace'],
            },
            animation: {
                'halo-breathe': 'halo-breathe 4s ease-in-out infinite',
                'core-breathe': 'core-breathe 3s ease-in-out infinite',
                'float-up': 'float-up 3s ease-out infinite',
                'fade-in': 'fade-in 0.3s ease forwards',
                'message-in': 'message-in 0.3s ease',
            },
        },
    },
    plugins: [],
}
