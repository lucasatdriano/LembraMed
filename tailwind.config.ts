import type { Config } from 'tailwindcss';

export default {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    important: true,
    theme: {
        screens: {
            xs: '400px',
            sm: '660px',
            md: '768px',
            ml: '896px',
            lg: '1024px',
            xl: '1280px',
            '2xl': '1536px',
        },
        extend: {
            maxWidth: {
                '8xl': '88rem',
                '9xl': '96rem',
                '10xl': '104rem',
            },
            maxHeight: {
                '8xl': '88rem',
                '9xl': '96rem',
                '10xl': '104rem',
            },
            padding: {
                '18': '4.5rem',
            },
            inset: {
                '18': '4.5rem',
                '22': '5.5rem',
                '1/5': '20%',
            },
            colors: {
                background: 'var(--background)',
                foreground: 'var(--foreground)',
                primary: 'var(--colorPrimary)',
                tint: 'var(--tint)',
                tabIconDefault: 'var(--tabIconDefault)',
                tabIconSelected: 'var(--tabIconSelected)',
                shadow: 'var(--shadow)',
                input: 'var(--input)',
                button: 'var(--button)',
                error: 'var(--error)',
            },
            fontFamily: {
                space_mono: ['Space Mono', 'monospace'],
                roboto: ['Roboto', 'sans-serif'],
                poppins: ['Poppins', 'sans-serif'],
            },
            borderRadius: {
                '4xl': '2rem',
                '5xl': '2.5rem',
            },
            borderWidth: {
                '1': '1px',
            },
            transitionProperty: {
                'rounded-and-color': 'border-radius, border-color',
            },
        },
    },
    plugins: [],
} satisfies Config;
