import {Heading} from '@radix-ui/themes';
import styled from './theme';

const textVariants = {
	color: {
		primary: {
			color: '$labelPrimary',
		},
		secondary: {
			color: '$labelSecondary',
		},
		tertiary: {
			color: '$labelTertiary',
		},
		quaternary: {
			color: '$labelQuaternary',
		},
	},
	weight: {
		light: {
			fontWeight: 300,
		},
		regular: {
			fontWeight: 400,
		},
		medium: {
			fontWeight: 500,
		},
		bold: {
			fontWeight: '500',
		},
	},
};

const H1 = styled('h1', {
	fontWeight: '500',
	fontSize: 32,
	lineHeight: '40px',
	color: '$labelPrimary',
	variants: textVariants,
});

const H2 = styled('h2', {
	fontWeight: '500',
	fontSize: 24,
	lineHeight: '32px',
	color: '$labelPrimary',
	variants: textVariants,
});

const H3 = styled(Heading, {
	fontWeight: '500',
	fontSize: 20,
	lineHeight: '28px',
	color: '$labelPrimary',
	variants: textVariants,
});

const Paragraph = styled('p', {
	fontWeight: 400,
	fontSize: 13,
	lineHeight: '24px',
	color: '$labelSecondary',
	variants: textVariants,
});

const Caption = styled('p', {
	fontWeight: 400,
	fontSize: 13,
	lineHeight: '16px',
	variants: textVariants,
});

export {H1, H2, H3, Paragraph, Caption};
