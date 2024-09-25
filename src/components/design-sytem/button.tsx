import { styled } from '@stitches/react';

const Button = styled('button', {
    // Base styles
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '9999px',
    fontWeight: 600,
    fontSize: '14px',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    border: 'none',
    outline: 'none',

    // Variants
    variants: {
        variant: {
            solid: {},
            outline: {
                backgroundColor: 'transparent',
                '&:hover': {
                    backgroundColor: '$backgroundHover',
                },
            },
            text: {
                backgroundColor: 'transparent',
                '&:hover': {
                    backgroundColor: '$backgroundHover',
                },
            },
            ghost: {
                backgroundColor: 'transparent',
                '&:hover': {
                    backgroundColor: '$backgroundHover',
                },
            },
        },
        colorScheme: {
            primary: {},
            secondary: {},
            accent: {},
            surface: {},
            danger: {},
            warning: {},
        },
        size: {
            small: {
                height: '32px',
                padding: '0 12px',
                fontSize: '12px',
            },
            medium: {
                height: '40px',
                padding: '0 16px',
            },
            large: {
                height: '48px',
                padding: '0 20px',
                fontSize: '16px',
            },
        },
    },

    // Compound variants
    compoundVariants: [
        // Solid variants
        {
            variant: 'solid',
            colorScheme: 'primary',
            css: {
                backgroundColor: '$primary',
                color: '$onPrimary',
                '&:hover': { backgroundColor: '$primaryHover' },
            },
        },
        {
            variant: 'solid',
            colorScheme: 'secondary',
            css: {
                backgroundColor: '$secondary',
                color: '$onSecondary',
                '&:hover': { backgroundColor: '$secondaryHover' },
            },
        },
        {
            variant: 'solid',
            colorScheme: 'accent',
            css: {
                backgroundColor: '$accent',
                color: '$onAccent',
                '&:hover': { backgroundColor: '$accentHover' },
            },
        },
        {
            variant: 'solid',
            colorScheme: 'surface',
            css: {
                backgroundColor: '$surface',
                color: '$onSurface',
                '&:hover': { backgroundColor: '$surfaceHover' },
            },
        },
        {
            variant: 'solid',
            colorScheme: 'danger',
            css: {
                backgroundColor: '$danger',
                color: '$onDanger',
                '&:hover': { backgroundColor: '$dangerHover' },
            },
        },
        {
            variant: 'solid',
            colorScheme: 'warning',
            css: {
                backgroundColor: '$warning',
                color: '$onWarning',
                '&:hover': { backgroundColor: '$warningHover' },
            },
        },

        // Outline variants
        {
            variant: 'outline',
            colorScheme: 'primary',
            css: {
                border: '1px solid $primary',
                color: '$primary',
                '&:hover': { backgroundColor: '$primaryLight' },
            },
        },
        {
            variant: 'outline',
            colorScheme: 'secondary',
            css: {
                border: '1px solid $secondary',
                color: '$secondary',
                '&:hover': { backgroundColor: '$secondaryLight' },
            },
        },
        {
            variant: 'outline',
            colorScheme: 'accent',
            css: {
                border: '1px solid $accent',
                color: '$accent',
                '&:hover': { backgroundColor: '$accentLight' },
            },
        },
        {
            variant: 'outline',
            colorScheme: 'surface',
            css: {
                border: '1px solid $surface',
                color: '$surface',
                '&:hover': { backgroundColor: '$surfaceLight' },
            },
        },
        {
            variant: 'outline',
            colorScheme: 'danger',
            css: {
                border: '1px solid $danger',
                color: '$danger',
                '&:hover': { backgroundColor: '$dangerLight' },
            },
        },
        {
            variant: 'outline',
            colorScheme: 'warning',
            css: {
                border: '1px solid $warning',
                color: '$warning',
                '&:hover': { backgroundColor: '$warningLight' },
            },
        },

        // Text variants
        {
            variant: 'text',
            colorScheme: 'primary',
            css: { color: '$primary' },
        },
        {
            variant: 'text',
            colorScheme: 'secondary',
            css: { color: '$secondary' },
        },
        {
            variant: 'text',
            colorScheme: 'accent',
            css: { color: '$accent' },
        },
        {
            variant: 'text',
            colorScheme: 'surface',
            css: { color: '$surface' },
        },
        {
            variant: 'text',
            colorScheme: 'danger',
            css: { color: '$danger' },
        },
        {
            variant: 'text',
            colorScheme: 'warning',
            css: { color: '$warning' },
        },

        // Ghost variants
        {
            variant: 'ghost',
            colorScheme: 'primary',
            css: {
                color: '$primary',
                '&:hover': { backgroundColor: '$primaryLight' },
            },
        },
        {
            variant: 'ghost',
            colorScheme: 'secondary',
            css: {
                color: '$secondary',
                '&:hover': { backgroundColor: '$secondaryLight' },
            },
        },
        {
            variant: 'ghost',
            colorScheme: 'accent',
            css: {
                color: '$accent',
                '&:hover': { backgroundColor: '$accentLight' },
            },
        },
        {
            variant: 'ghost',
            colorScheme: 'surface',
            css: {
                color: '$surface',
                '&:hover': { backgroundColor: '$surfaceLight' },
            },
        },
        {
            variant: 'ghost',
            colorScheme: 'danger',
            css: {
                color: '$danger',
                '&:hover': { backgroundColor: '$dangerLight' },
            },
        },
        {
            variant: 'ghost',
            colorScheme: 'warning',
            css: {
                color: '$warning',
                '&:hover': { backgroundColor: '$warningLight' },
            },
        },
    ],

    // Default variants
    defaultVariants: {
        variant: 'solid',
        colorScheme: 'primary',
        size: 'medium',
    },
});

export default Button;