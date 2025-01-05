import {ColorPalette, FormTheme} from '../types';

export const predefinedThemes: FormTheme[] = [
	{
		id: 'ocean-breeze',
		name: 'Ocean Breeze',
		description: 'Calming blues and soft teals',
		colors: {
			primary: '#2563eb',
			secondary: '#0ea5e9',
			accent: '#0284c7',
			background: '#f0f9ff',
			surface: '#ffffff',
			text: '#0f172a',
		},
		font: 'Inter, sans-serif',
	},
	{
		id: 'sunset-valley',
		name: 'Sunset Valley',
		description: 'Warm oranges and deep purples inspired by dusk',
		colors: {
			primary: '#ea580c',
			secondary: '#c2410c',
			accent: '#7c2d12',
			background: '#fff7ed',
			surface: '#ffffff',
			text: '#431407',
		},
		font: 'Plus Jakarta Sans, sans-serif',
	},
	{
		id: 'forest-mint',
		name: 'Forest Mint',
		description: 'Fresh greens and cool mints for an organic feel',
		colors: {
			primary: '#059669',
			secondary: '#10b981',
			accent: '#047857',
			background: '#f0fdf4',
			surface: '#ffffff',
			text: '#064e3b',
		},
		font: 'DM Sans, sans-serif',
	},
	{
		id: 'cosmic-night',
		name: 'Cosmic Night',
		description: 'Deep space-inspired dark theme with vibrant accents',
		colors: {
			primary: '#8b5cf6',
			secondary: '#7c3aed',
			accent: '#6d28d9',
			background: '#030712',
			surface: '#1f2937',
			text: '#f8fafc',
		},
		font: 'Space Grotesk, sans-serif',
	},
	{
		id: 'cherry-blossom',
		name: 'Cherry Blossom',
		description: 'Delicate pinks and soft grays inspired by spring',
		colors: {
			primary: '#ec4899',
			secondary: '#db2777',
			accent: '#be185d',
			background: '#fdf2f8',
			surface: '#ffffff',
			text: '#831843',
		},
		font: 'Quicksand, sans-serif',
	},
	{
		id: 'desert-sand',
		name: 'Desert Sand',
		description: 'Earthy tones and warm neutrals',
		colors: {
			primary: '#d97706',
			secondary: '#b45309',
			accent: '#92400e',
			background: '#fef3c7',
			surface: '#fffbeb',
			text: '#78350f',
		},
		font: 'Sora, sans-serif',
	},
	{
		id: 'nordic-frost',
		name: 'Nordic Frost',
		description: 'Minimalist grays with icy blue accents',
		colors: {
			primary: '#64748b',
			secondary: '#475569',
			accent: '#0ea5e9',
			background: '#f8fafc',
			surface: '#ffffff',
			text: '#0f172a',
		},
		font: 'Be Vietnam Pro, sans-serif',
	},
	{
		id: 'royal-velvet',
		name: 'Royal Velvet',
		description: 'Rich purples and gold accents for luxury',
		colors: {
			primary: '#7e22ce',
			secondary: '#6b21a8',
			accent: '#eab308',
			background: '#faf5ff',
			surface: '#ffffff',
			text: '#581c87',
		},
		font: 'Crimson Pro, serif',
	},
];

export const applyThemeToForm = (theme: FormTheme) => ({
	primaryColor: theme.colors.primary,
	backgroundColor: theme.colors.background,
	surfaceColor: theme.colors.surface,
	textColor: theme.colors.text,
	accentColor: theme.colors.accent,
	secondaryColor: theme.colors.secondary,
	fontFamily: theme.font,
});

export const getThemeById = (themeId: string): FormTheme | undefined => {
	return predefinedThemes.find((theme) => theme.id === themeId);
};

export const getCssVariables = (theme: FormTheme) => {
	// Handle case where theme might be incomplete
	const defaultColors = {
		primary: '#3b82f6',
		secondary: '#64748b',
		accent: '#2563eb',
		background: '#ffffff',
		surface: '#f8fafc',
		text: '#0f172a',
	};

	const colors = {
		primary: theme?.colors?.primary ?? defaultColors.primary,
		secondary: theme?.colors?.secondary ?? defaultColors.secondary,
		accent: theme?.colors?.accent ?? defaultColors.accent,
		background: theme?.colors?.background ?? defaultColors.background,
		surface: theme?.colors?.surface ?? defaultColors.surface,
		text: theme?.colors?.text ?? defaultColors.text,
	};

	return {
		'--primary': colors.primary,
		'--primary-hover': adjustColor(colors.primary, -10),
		'--secondary': colors.secondary,
		'--accent': colors.accent,
		'--background': colors.background,
		'--surface': colors.surface,
		'--text': colors.text,
		'--text-secondary': adjustColor(colors.text, 40),
		'--border': adjustColor(colors.text, 85),
	};
};

// Add a utility function to ensure theme always has required properties
export const ensureCompleteTheme = (theme: Partial<FormTheme>): FormTheme => {
	const defaultTheme = predefinedThemes[0];
	return {
		...defaultTheme,
		...theme,
	};
};

// Helper function to darken/lighten colors
function adjustColor(color: string, amount: number): string {
	const hexToRgb = (hex: string) => {
		const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result
			? {
					r: parseInt(result[1], 16),
					g: parseInt(result[2], 16),
					b: parseInt(result[3], 16),
				}
			: null;
	};

	const rgb = hexToRgb(color);
	if (!rgb) return color;

	const newColor = {
		r: Math.max(0, Math.min(255, rgb.r + amount)),
		g: Math.max(0, Math.min(255, rgb.g + amount)),
		b: Math.max(0, Math.min(255, rgb.b + amount)),
	};

	return `#${((1 << 24) + (newColor.r << 16) + (newColor.g << 8) + newColor.b).toString(16).slice(1)}`;
}
