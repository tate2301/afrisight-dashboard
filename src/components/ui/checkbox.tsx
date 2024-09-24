import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"
import styled from "../design-sytem/theme"

const StyledCheckboxPrimitive = styled(CheckboxPrimitive.Root, {
  borderColor: "$gray2",
})

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <StyledCheckboxPrimitive
    ref={ref}
    css={{
      peer: true,
      height: '1rem',
      width: '1rem',
      flexShrink: 0,
      borderRadius: 4,
      border: '1px solid $gray2',
      ringOffsetBackground: true,
      '&:focus-visible': {
        outline: 'none',
        ring: '2px solid',
        ringColor: 'var(--ring)',
        ringOffset: '2px',
      },
      '&:disabled': {
        cursor: 'not-allowed',
        opacity: 0.5,
      },
      '&[data-state=checked]': {
        backgroundColor: '$primary',
        color: '$white',
      }
    }}
    className={cn(

      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </StyledCheckboxPrimitive>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
