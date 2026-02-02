"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const tooltipContentVariants = cva(
  "absolute z-50 bg-gray-90 text-gray-5 rounded px-2 py-2 text-sm whitespace-nowrap pointer-events-none opacity-0 transition-opacity duration-200 after:content-[''] after:absolute after:border-4",
  {
    variants: {
      position: {
        top: "bottom-full left-1/2 -translate-x-1/2 mb-1 after:top-full after:left-1/2 after:-translate-x-1/2 after:border-l-transparent after:border-r-transparent after:border-b-transparent after:border-t-gray-90",
        right: "left-full top-1/2 -translate-y-1/2 ml-1 after:right-full after:top-1/2 after:-translate-y-1/2 after:border-t-transparent after:border-b-transparent after:border-l-transparent after:border-r-gray-90",
        bottom: "top-full left-1/2 -translate-x-1/2 mt-1 after:bottom-full after:left-1/2 after:-translate-x-1/2 after:border-l-transparent after:border-r-transparent after:border-t-transparent after:border-b-gray-90",
        left: "right-full top-1/2 -translate-y-1/2 mr-1 after:left-full after:top-1/2 after:-translate-y-1/2 after:border-t-transparent after:border-b-transparent after:border-r-transparent after:border-l-gray-90",
      },
    },
    defaultVariants: {
      position: "top",
    },
  }
);

type TooltipContextValue = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  position: "top" | "right" | "bottom" | "left";
};

const TooltipContext = React.createContext<TooltipContextValue | null>(null);

const useTooltip = () => {
  const context = React.useContext(TooltipContext);
  if (!context) {
    throw new Error("Tooltip components must be used within a Tooltip");
  }
  return context;
};

type TooltipProps = React.HTMLAttributes<HTMLDivElement> & {
  position?: "top" | "right" | "bottom" | "left";
};

const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  ({ position = "top", className, children, ...props }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
      <TooltipContext.Provider value={{ isOpen, setIsOpen, position }}>
        <div
          ref={ref}
          className={cn("relative inline-block", className)}
          {...props}
        >
          {children}
        </div>
      </TooltipContext.Provider>
    );
  }
);
Tooltip.displayName = "Tooltip";

type TooltipTriggerProps = React.HTMLAttributes<HTMLElement> & {
  asChild?: boolean;
};

const TooltipTrigger = React.forwardRef<HTMLElement, TooltipTriggerProps>(
  ({ className, children, asChild = false, ...props }, ref) => {
    const { setIsOpen } = useTooltip();

    const handleMouseEnter = () => setIsOpen(true);
    const handleMouseLeave = () => setIsOpen(false);
    const handleFocus = () => setIsOpen(true);
    const handleBlur = () => setIsOpen(false);

    if (asChild && React.isValidElement(children)) {
      const childProps = (children as React.ReactElement<any>).props;
      return React.cloneElement(children as React.ReactElement<any>, {
        ref,
        onMouseEnter: (e: React.MouseEvent) => {
          handleMouseEnter();
          if (childProps?.onMouseEnter) {
            childProps.onMouseEnter(e);
          }
        },
        onMouseLeave: (e: React.MouseEvent) => {
          handleMouseLeave();
          if (childProps?.onMouseLeave) {
            childProps.onMouseLeave(e);
          }
        },
        onFocus: (e: React.FocusEvent) => {
          handleFocus();
          if (childProps?.onFocus) {
            childProps.onFocus(e);
          }
        },
        onBlur: (e: React.FocusEvent) => {
          handleBlur();
          if (childProps?.onBlur) {
            childProps.onBlur(e);
          }
        },
        className: cn(childProps?.className, className),
        ...props,
      });
    }

    return (
      <span
        ref={ref as React.Ref<HTMLSpanElement>}
        className={className}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      >
        {children}
      </span>
    );
  }
);
TooltipTrigger.displayName = "TooltipTrigger";

type TooltipContentProps = React.HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof tooltipContentVariants>;

const TooltipContent = React.forwardRef<HTMLSpanElement, TooltipContentProps>(
  ({ className, children, position: positionProp, ...props }, ref) => {
    const { isOpen, position: contextPosition } = useTooltip();
    const position = positionProp || contextPosition;

    return (
      <span
        ref={ref}
        role="tooltip"
        className={cn(
          tooltipContentVariants({ position }),
          isOpen && "opacity-100",
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);
TooltipContent.displayName = "TooltipContent";

export { Tooltip, TooltipTrigger, TooltipContent, tooltipContentVariants };
export type { TooltipProps, TooltipTriggerProps, TooltipContentProps };
