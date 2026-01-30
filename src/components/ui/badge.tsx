import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded px-2.5 py-0.5 text-xs font-bold font-public-sans transition-colors focus:outline-none focus:ring-2 focus:ring-blue-40 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-blue-10 text-blue-80 hover:bg-blue-20",
        secondary: "bg-gray-10 text-gray-80 hover:bg-gray-20",
        success: "bg-green-10 text-green-80 hover:bg-green-20",
        warning: "bg-orange-10 text-orange-80 hover:bg-orange-20",
        danger: "bg-red-10 text-red-80 hover:bg-red-20",
        outline: "text-gray-80 border border-gray-60 hover:bg-gray-5",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants } 