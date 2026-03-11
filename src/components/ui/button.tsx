import * as React from "react"
import * as Slot from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  [
    "rounded font-semibold relative inline-flex cursor-pointer items-center justify-center gap-1 border-2 border-transparent font-sans leading-none [&_svg:not([class*='size-'])]:size-6",

    // Focus states
    "focus:outline focus:outline-4 focus:outline-offset-4 focus:outline-ring",
    "focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-ring",

    // Disabled states
    "aria-disabled:cursor-not-allowed aria-disabled:bg-gray-20 aria-disabled:text-gray-70",
    "disabled:cursor-not-allowed disabled:bg-gray-20 disabled:text-gray-70",
  ],
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-active",
        primary:
          "bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-active",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary-hover active:bg-secondary-active",
        accent: "bg-accent text-accent-foreground hover:bg-accent-hover active:bg-accent-active",
        base: "text-white bg-gray-cool-50 hover:bg-gray-cool-60 active:bg-gray-cool-70",
        outline:
          "border-2 border-primary bg-transparent text-primary hover:border-primary-hover hover:text-primary-hover active:border-primary-active active:text-primary-active disabled:border-gray-20 disabled:bg-transparent disabled:text-gray-50",
        "outline-inverse":
          "active:text-white active:border-white border-2 border-gray-cool-10 bg-transparent text-gray-cool-10 hover:border-gray-5 hover:text-gray-5 disabled:border-gray-40 disabled:bg-transparent disabled:text-gray-50",
        "outline-primary":
          "border-2 border-primary bg-transparent text-primary hover:border-primary-hover hover:text-primary-hover active:border-primary-active active:text-primary-active disabled:border-gray-20 disabled:bg-transparent disabled:text-gray-50",
        "outline-secondary":
          "border-2 border-secondary bg-transparent text-secondary hover:border-secondary-hover hover:text-secondary-hover active:border-secondary-active active:text-secondary-active disabled:border-gray-20 disabled:bg-transparent disabled:text-gray-50",
        info: "text-white bg-navy-50 hover:bg-navy-70 active:bg-navy-80",
        success: "text-white bg-green-cool-50v hover:bg-green-cool-60v active:bg-green-cool-70v",
        warning: "bg-golden-20 text-gray-90 hover:bg-golden-30 active:bg-golden-40",
        ghost: "bg-transparent text-gray-90 hover:bg-gray-5 active:bg-gray-10",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive-hover active:bg-destructive-active",
        link: "font-normal rounded-none !p-0 text-blue-60v underline underline-offset-2 hover:text-blue-warm-70v disabled:bg-transparent disabled:text-gray-50",
      },
      size: {
        sm: "text-sm p-2 leading-3",
        default: "px-5 py-3",
        lg: "text-xl px-6 py-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }

function Button({
  className,
  variant = "primary",
  size = "default",
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
