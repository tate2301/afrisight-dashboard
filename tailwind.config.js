/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['class'],
	content: [
		'./pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./src/app/**/*.{ts,tsx}',
		'./src/**/*.{ts,tsx}',
	],
	prefix: '',
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px',
			},
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
				surface: {
					DEFAULT: 'hsl(var(--surface-default))',
					secondary: 'hsl(var(--surface-secondary))',
					tertiary: 'hsl(var(--surface-tertiary))',
					quaternary: 'hsl(var(--surface-quaternary))',
				},
				content: {
					DEFAULT: 'hsl(var(--content-primary))',
					secondary: 'hsl(var(--content-secondary))',
					tertiary: 'hsl(var(--content-tertiary))',
					quaternary: 'hsl(var(--content-quaternary))',
				},
				interactive: {
					DEFAULT: 'hsl(var(--interactive-default))',
					hover: 'hsl(var(--interactive-hover))',
					active: 'hsl(var(--interactive-active))',
					disabled: 'hsl(var(--interactive-disabled))',
				},
				status: {
					success: {
						DEFAULT: 'hsl(var(--status-success))',
						foreground: 'hsl(var(--status-success-foreground))',
					},
					warning: {
						DEFAULT: 'hsl(var(--status-warning))',
						foreground: 'hsl(var(--status-warning-foreground))',
					},
					error: {
						DEFAULT: 'hsl(var(--status-error))',
						foreground: 'hsl(var(--status-error-foreground))',
					},
					info: {
						DEFAULT: 'hsl(var(--status-info))',
						foreground: 'hsl(var(--status-info-foreground))',
					},
				},
			},

			keyframes: {
				'accordion-down': {
					from: {height: '0'},
					to: {height: 'var(--radix-accordion-content-height)'},
				},
				'accordion-up': {
					from: {height: 'var(--radix-accordion-content-height)'},
					to: {height: '0'},
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
			},
		},
	},
	plugins: [require('tailwindcss-animate')],
};
