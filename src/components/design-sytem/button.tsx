import { styled } from '@stitches/react';

const Button = styled('button', {
    // Base styles
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '12px',
    fontWeight: 600,
    fontSize: '14px',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    border: 'none',
    outline: 'none',
    gap: 4,

    // Variants
    variants: {
        variant: {
            solid: {},
            outline: {
                backgroundColor: 'transparent',
                boxShadow: "var(--pressable-shadow)"
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
            danger: {
                backgroundColor: "$danger",
                color: "$white"
            },
            warning: {},
        },
        size: {
            small: {
                height: '28px',
                padding: '0 12px',
                fontSize: '12px',
            },
            medium: {
                height: '32px',
                padding: '0 14px',
            },
            large: {
                height: '40px',
                padding: '0 20px',
                fontSize: '16px',
            },
            icon: {
                height: "32px",
                width: "32px",
                padding: 0,
                justifyContent: "center"
            }
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
                color: '$white',
            },
        },
        {
            variant: 'solid',
            colorScheme: 'secondary',
            css: {
                backgroundColor: '$secondary',
                color: '$labelPrimary',
            },
        },
        {
            variant: 'solid',
            colorScheme: 'accent',
            css: {
                backgroundColor: '$accent',
                color: '$white',
            },
        },
        {
            variant: 'solid',
            colorScheme: 'surface',
            css: {
                backgroundColor: '$gray2',
                color: '$labelPrimary',
            },
        },
        {
            variant: 'solid',
            colorScheme: 'danger',
            css: {
                backgroundColor: '$danger',
                color: '$white',
            },
        },
        {
            variant: 'solid',
            colorScheme: 'warning',
            css: {
                backgroundColor: '$warning',
                color: '$onWarning',
            },
        },

        // Outline variants
        {
            variant: 'outline',
            colorScheme: 'primary',
            css: {
                border: '1px solid $primary',
                color: '$primary',
            },
        },
        {
            variant: 'outline',
            colorScheme: 'secondary',
            css: {
                border: '1px solid $secondary',
                color: '$secondary',
            },
        },
        {
            variant: 'outline',
            colorScheme: 'accent',
            css: {
                border: '1px solid $accent',
                color: '$accent',
            },
        },
        {
            variant: 'outline',
            colorScheme: 'surface',
            css: {
                boxShadow: 'var(--pressable-shadow)',
                color: '$labelPrimary',
            },
        },
        {
            variant: 'outline',
            colorScheme: 'danger',
            css: {
                border: '1px solid $danger',
                color: '$danger',
            },
        },
        {
            variant: 'outline',
            colorScheme: 'warning',
            css: {
                border: '1px solid $warning',
                color: '$warning',
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
            },
        },
        {
            variant: 'ghost',
            colorScheme: 'secondary',
            css: {
                color: '$secondary',
            },
        },
        {
            variant: 'ghost',
            colorScheme: 'accent',
            css: {
                color: '$accent',
            },
        },
        {
            variant: 'ghost',
            colorScheme: 'surface',
            css: {
                color: '$labelSecondary',
                "&:hover": {
                    backgroundColor: "$gray2"
                }
            },
        },
        {
            variant: 'ghost',
            colorScheme: 'danger',
            css: {
                color: '$danger',
            },
        },
        {
            variant: 'ghost',
            colorScheme: 'warning',
            css: {
                color: '$warning',
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