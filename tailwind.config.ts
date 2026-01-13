import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#374151',
            lineHeight: '1.75',
            p: {
              marginTop: '1.25em',
              marginBottom: '1.25em',
            },
            'h1, h2, h3, h4': {
              color: '#111827',
              fontWeight: '700',
              marginTop: '1.5em',
              marginBottom: '0.75em',
            },
            'ul, ol': {
              marginTop: '1.25em',
              marginBottom: '1.25em',
            },
            li: {
              marginTop: '0.5em',
              marginBottom: '0.5em',
            },
            strong: {
              color: '#111827',
              fontWeight: '600',
            },
            a: {
              color: '#059669',
              textDecoration: 'underline',
              fontWeight: '500',
            },
            blockquote: {
              borderLeftColor: '#059669',
              fontStyle: 'italic',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

export default config;