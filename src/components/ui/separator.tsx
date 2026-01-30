import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const separatorVariants = cva(
  "shrink-0 border border-gray-30",
  {
    variants: {
      orientation: {
        horizontal: "h-px w-full",
        vertical: "h-full w-px"
      },
      size: {
        sm: "",
        default: "",
        lg: ""
      }
    },
    compoundVariants: [
      {
        orientation: "horizontal",
        size: "sm",
        className: "h-px"
      },
      {
        orientation: "horizontal", 
        size: "default",
        className: "h-px"
      },
      {
        orientation: "horizontal",
        size: "lg", 
        className: "h-0.5"
      },
      {
        orientation: "vertical",
        size: "sm",
        className: "w-px"
      },
      {
        orientation: "vertical",
        size: "default", 
        className: "w-px"
      },
      {
        orientation: "vertical",
        size: "lg",
        className: "w-0.5"
      }
    ],
    defaultVariants: {
      orientation: "horizontal",
      size: "default"
    }
  }
)

export interface SeparatorProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof separatorVariants> {
  /**
   * Whether the separator is decorative (true) or semantic (false).
   * Decorative separators are ignored by screen readers.
   */
  decorative?: boolean
}

const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  ({ className, orientation, size, decorative = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(separatorVariants({ orientation, size, className }))}
        role={decorative ? "none" : "separator"}
        aria-orientation={orientation === "vertical" ? "vertical" : "horizontal"}
        {...props}
      />
    )
  }
)
Separator.displayName = "Separator"

export { Separator, separatorVariants }
