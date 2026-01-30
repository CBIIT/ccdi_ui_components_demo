import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonGroupVariants = cva(
  "inline-flex",
  {
    variants: {
      orientation: {
        horizontal: cn(
          "flex-row",
          // Style direct button children to connect them
          "[&>button:not(:first-child):not(:last-child)]:rounded-none",
          "[&>button:first-child:not(:only-child)]:rounded-e-none",
          "[&>button:last-child:not(:only-child)]:rounded-s-none",
          "[&>button:not(:first-child)]:-ms-px",
          "[&>button:not(:first-child)]:hover:z-10",
          "[&>button:not(:first-child)]:focus:z-10",
          "[&>button:not(:first-child)]:focus-visible:z-10"
        ),
        vertical: cn(
          "flex-col",
          // Style direct button children to connect them
          "[&>button:not(:first-child):not(:last-child)]:rounded-none",
          "[&>button:first-child:not(:only-child)]:rounded-b-none",
          "[&>button:last-child:not(:only-child)]:rounded-t-none",
          "[&>button:not(:first-child)]:-mt-px",
          "[&>button:not(:first-child)]:hover:z-10",
          "[&>button:not(:first-child)]:focus:z-10",
          "[&>button:not(:first-child)]:focus-visible:z-10"
        ),
      },
    },
    defaultVariants: {
      orientation: "horizontal",
    },
  }
)

export interface ButtonGroupProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof buttonGroupVariants> {
  asChild?: boolean
}

const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ className, orientation, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div"
    
    return (
      <Comp
        ref={ref}
        role="group"
        className={cn(
          buttonGroupVariants({ orientation }),
          // Add gap for nested ButtonGroups
          "[&>div[role=group]]:gap-2",
          className
        )}
        {...props}
      />
    )
  }
)
ButtonGroup.displayName = "ButtonGroup"

export {
  ButtonGroup
}
