import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  cn(
    // Base layout and appearance
    "relative rounded font-semibold font-open-sans leading-none cursor-pointer inline-flex items-center justify-center gap-1",

    // Focus states
    "focus:outline focus:outline-4 focus:outline-offset-4 focus:outline-blue-40v",
    "focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-blue-40v",

    // Disabled states
    "aria-disabled:cursor-not-allowed aria-disabled:bg-gray-20 aria-disabled:text-gray-70",
    "disabled:cursor-not-allowed disabled:bg-gray-20 disabled:text-gray-70"
  ),
  {
    variants: {
      variant: {
        primary: "text-white bg-cerulean-50 hover:bg-cerulean-70 active:bg-cerulean-80",
        secondary: "text-white bg-teal-50 hover:bg-teal-70 active:bg-teal-80",
        'accent-cool': "text-white bg-navy-50 hover:bg-navy-70 active:bg-navy-80",
        'accent-warm': "text-gray-90 bg-golden-20 hover:bg-golden-30 active:bg-golden-40",
        base: "text-white bg-gray-cool-50 hover:bg-gray-cool-60 active:bg-gray-cool-70",
        outline: "text-cerulean-50 bg-transparent border-2 border-cerulean-50 hover:text-cerulean-70 hover:border-cerulean-70 active:text-cerulean-80 active:border-cerulean-80 disabled:border-gray-20 disabled:text-gray-50 disabled:bg-transparent",
        'outline-inverse': "text-gray-cool-10 bg-transparent border-2 border-gray-cool-10 hover:text-gray-5 hover:border-gray-5 active:text-white active:border-white disabled:border-gray-40 disabled:text-gray-50 disabled:bg-transparent",
        'outline-primary': "text-cerulean-50 bg-transparent border-2 border-cerulean-50 hover:text-cerulean-70 hover:border-cerulean-70 active:text-cerulean-80 active:border-cerulean-80 disabled:border-gray-20 disabled:text-gray-50 disabled:bg-transparent",
        'outline-secondary': "text-teal-50 bg-transparent border-2 border-teal-50 hover:text-teal-70 hover:border-teal-70 active:text-teal-80 active:border-teal-80 disabled:border-gray-20 disabled:text-gray-50 disabled:bg-transparent",
        info: "text-white bg-navy-50 hover:bg-navy-70 active:bg-navy-80",
        success: "text-white bg-green-cool-50v hover:bg-green-cool-60v active:bg-green-cool-70v",
        warning: "text-gray-90 bg-golden-20 hover:bg-golden-30 active:bg-golden-40",
        danger: "text-white bg-red-60v hover:bg-red-warm-70v active:bg-red-warm-80v",
        link: "text-blue-60v underline underline-offset-2 hover:text-blue-warm-70v !p-0 font-normal rounded-none disabled:text-gray-50 disabled:bg-transparent "
      },
      size: {
        sm: "p-2 text-sm leading-3.5",
        default: "px-5 py-3",
        lg: "px-6 py-4 text-xl",
        icon: "size-9",
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "default"
    }
  }
)

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {

    const isAsChildProperlyUsed = asChild && React.isValidElement(props.children);
    
    if (isAsChildProperlyUsed) {
      const child = React.Children.only(props.children) as React.ReactElement<React.HTMLAttributes<HTMLElement>>;
      return React.cloneElement(child, {
        className: cn(buttonVariants({ variant, size }), child.props.className, className),
        ref,
        ...props,
      } as React.HTMLAttributes<HTMLElement>);
    }

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants } 