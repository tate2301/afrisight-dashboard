import * as NextLink from "next/link";
import styled from "./theme";

const Link = styled(NextLink.default, {
    fontWeight: "500",
    fontSize: 14,
    variants: {
        state: {
            default: {
                fontWeight: "500",
            },
            active: {
                fontWeight: "600",
                color: '$primary'
            }
        },
        color: {
            default: {
                color: '$labelSecondary'
            },
            primary: {
                color: '$primary'
            },
            accent: {
                color: '$accent'
            },
            white: {
                color: '$white'
            }
        }
    },
});

export default Link;
