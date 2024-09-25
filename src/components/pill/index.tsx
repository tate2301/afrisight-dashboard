import styled from "../design-sytem/theme"

const Pill = styled("div", {
    padding: "0 12px",
    height: 28,
    gap: 4,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9999,
    backgroundColor: "$gray2",
    color: "$labelPrimary",
    fontSize: 14,
    width: "fit-content",
    variants: {
        colorScheme: {
            surface: {
                backgroundColor: "$gray1",
                color: "$labelPrimary",
            },
            primary: {
                backgroundColor: "$primary",
                color: "$white",
            },
            danger: {
                backgroundColor: "$danger",
                color: "$white"
            },
            success: {
                backgroundColor: "$secondary",
                color: "$white"
            }
        }
    }
})

export default Pill;