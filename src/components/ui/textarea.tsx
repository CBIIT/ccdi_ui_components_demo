import * as React from "react";
import { cn } from "@/lib/utils";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-30 w-full rounded-none border border-gray-60 bg-white mt-2 px-3 py-2 text-gray-90 font-public-sans placeholder:text-gray-50",
          // Focus states
          "focus:outline focus:outline-4 focus:outline-blue-40 focus:border-blue-60",
          // Disabled states
          "disabled:cursor-not-allowed disabled:text-gray-70 disabled:bg-gray-20",
          // Error states
          "aria-[invalid=true]:border-red-60v aria-[invalid=true]:border-4",
          // Resize
          "resize-y",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
