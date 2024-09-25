import { createStitches } from "@stitches/react";

const { styled } = createStitches({
    theme: {
        colors: {
            white: "#FFFFFF",
            primary: "#4618AF",
            secondary: "#FFDD33",
            accent: "#FD4E19",
            labelPrimary: "hsl(0, 0%, 7%)",
            labelSecondary: "hsl(240, 1%, 27%)",
            labelTertiary: "hsla(240, 1%, 27%, 0.5)",
            labelQuartenary: "hsla(240, 1%, 27%, 0.24)",
            gray1: "hsl(0, 0%, 96%)",
            gray2: "hsl(0, 0%, 90%)",
            gray3: "hsl(0, 0%, 80%)",
            gray4: "hsl(0, 0%, 60%)",
            gray5: "hsl(0, 0%, 40%)",
            gray6: "hsl(0, 0%, 20%)",
            gray7: "hsl(0, 0%, 10%)",
            gray8: "hsl(0, 0%, 4%)",
            secondaryBase: "oklch(66.61% 0.219 35.61)"
        }
    }
})

export default styled;