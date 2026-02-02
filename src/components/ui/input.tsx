import * as React from "react";
import { cn } from "@/lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-none border border-gray-60 bg-white mt-2 px-3 py-2 text-gray-90 font-public-sans placeholder:text-gray-50",
          // Focus states
          "focus-visible:outline focus-visible:outline-4 focus-visible:outline-blue-40 focus-visible:border-blue-60",
          // Disabled states
          "disabled:cursor-not-allowed disabled:text-gray-70 disabled:bg-gray-20",
          // Error states
          "aria-[invalid=true]:border-red-60v aria-[invalid=true]:border-4",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };