"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Icon } from "./icon";

const searchInputVariants = cva(
  cn(
    // Layout classes
    "w-full min-w-75 lg:min-w-55 border border-r-0 border-gray-60",
    // Font classes
    "font-open-sans text-gray-90 placeholder:text-gray-50",
    // Focus states
    "focus:outline focus:outline-offset-0 focus:outline-4 focus:outline-blue-40",
    // Invalid states
    "data-[invalid]:ring-4 data-[invalid]:ring-red-60 data-[invalid]:border-transparent data-[invalid]:outline-offset-4"
  ),
  {
    variants: {
      size: {
        default: "p-2 h-8 text-base",
        large: "p-2 h-10 text-xl",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

const searchButtonVariants = cva(
  "rounded-r font-open-sans font-semibold leading-none flex items-center justify-center text-white bg-cerulean-50 hover:bg-cerulean-70 active:bg-cerulean-80 focus:outline focus:outline-4 focus:outline-offset-4 focus:outline-blue-40",
  {
    variants: {
      size: {
        default: "px-4 h-8 text-base",
        large: "px-8 h-10 text-xl",
      },
      iconOnly: {
        true: "px-3",
        false: "",
      },
    },
    defaultVariants: {
      size: "default",
      iconOnly: false,
    },
  }
);

export interface SearchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof searchInputVariants> {
  label?: string;
  buttonText?: string;
  onSearch?: (value: string) => void;
  iconOnly?: boolean;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  buttonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
}

const Search = React.forwardRef<HTMLInputElement, SearchProps>(
  (
    {
      className,
      size,
      label = "Search",
      buttonText = "Search",
      onSearch,
      iconOnly = false,
      inputProps,
      buttonProps,
      ...props
    },
    ref
  ) => {
    const [searchValue, setSearchValue] = React.useState("");

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSearch?.(searchValue);
    };

    const handleButtonClick = () => {
      onSearch?.(searchValue);
    };

    // Extract className from inputProps and buttonProps, then merge with variants
    const { className: inputClassName, ...restInputProps } = inputProps || {};
    const { className: buttonClassName, ...restButtonProps } = buttonProps || {};

    const inputClasses = cn(
      searchInputVariants({ size }), 
      className, // Base className prop
      inputClassName // className from inputProps
    );

    const buttonClasses = cn(
      searchButtonVariants({ size, iconOnly }),
      buttonClassName // className from buttonProps
    );

    return (
      <div>
        <label htmlFor={props.id || "search"} className="sr-only">
          {label}
        </label>
        <form onSubmit={handleSubmit}>
          <div className="relative flex items-center">
            <input
              id={props.id || "search"}
              type="search"
              className={inputClasses}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              ref={ref}
              {...restInputProps} // Spread without className
              {...props}
            />
            <button
              type="submit"
              className={buttonClasses}
              onClick={handleButtonClick}
              aria-label={iconOnly ? "search" : undefined}
              {...restButtonProps} // Spread without className
            >
              {iconOnly ? (
                <Icon icon="search" size="sm" className="size-6" />
              ) : (
                buttonText
              )}
            </button>
          </div>
        </form>
      </div>
    );
  }
);

Search.displayName = "Search";

export { Search, searchInputVariants, searchButtonVariants };
