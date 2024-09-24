import styled from "./theme";

const Flex = styled('div', {
    display: 'flex',
    gap: 4,
    variants: {
        direction: {
            row: {
                flexDirection: 'row',
            },
            column: {
                flexDirection: 'column',
            },
        },
        justifyContent: {
            start: {
                justifyContent: 'flex-start',
            },
            center: {
                justifyContent: 'center',
            },
            between: {
                justifyContent: 'space-between',
            },
            end: {
                justifyContent: 'flex-end',
            },
            around: {
                justifyContent: 'space-around',
            },
            evenly: {
                justifyContent: 'space-evenly',
            },
        },
        alignItems: {
            start: {
                alignItems: 'flex-start',
            },
            center: {
                alignItems: 'center',
            },
            end: {
                alignItems: 'flex-end',
            },
        },
    },
});

export default Flex;