import styled from "./theme";

const Button = styled('button', {
    backgroundColor: 'gainsboro',
    borderRadius: '9999px',
    fontWeight: 600,
    padding: '10px 15px',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flexDirection: 'row',


    variants: {
        colorScheme: {
            primary: {
                backgroundColor: '$primary',
                color: 'white',
                borderColor: '$primary',
            },
            secondary: {
                backgroundColor: '$gray2',
                color: '$labelPrimary',
                borderColor: '$gray2',
                '&:hover': {
                    backgroundColor: '$gray3',
                },
            },
        },
        variant: {
            text: {
                backgroundColor: 'transparent',
                paddingTop: 0,
                paddingBottom: 0,
                textDecoration: 'underline',
            },
            outline: {
                backgroundColor: 'transparent',
                border: '1px solid $gray3',
                padding: '8px 12px',
            },
            ghost: {
                backgroundColor: 'transparent',
                padding: '0px',
            },
            disabled: {
                opacity: 0.5,
            },
            default: {},
        },
        padding: {
            default: {
                padding: '10px 15px',
            },
            small: {
                padding: '8px 12px',
            },
            medium: {
                padding: '10px 15px',
            },
            iconLeft: {
                padding: '10px',
                paddingLeft: '6px',
                paddingRight: '16px',
            },
            iconRight: {
                padding: '10px',
                paddingLeft: '16px',
                paddingRight: '6px',
            },
        },
    },
    compoundVariants: [
        {
            colorScheme: 'primary',
            variant: 'text',
            css: {
                color: '$primary',
                backgroundColor: 'transparent',
            },
        },
        {
            colorScheme: 'secondary',
            variant: 'text',
            css: {
                color: '$labelSecondary',
                backgroundColor: 'transparent',
            },
        },
    ],
});

export default Button;
