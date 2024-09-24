import styled from "./theme";

const Box = styled('div', {
    variants: {
        as: {
            aside: {
                backgroundColor: '$primary'
            }
        }
    }
});

export default Box;