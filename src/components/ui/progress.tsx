"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const progressVariants = cva(
  "h-full transition-all duration-300 ease-in-out rounded-full",
  {
    variants: {
      variant: {
        default: "bg-blue-60v",
        success: "bg-green-60v",
        warning: "bg-orange-60v",
        error: "bg-red-60v",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

type ProgressProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof progressVariants> & {
    value?: number
    max?: number
    label?: string
  }

const Progress = (
  ({ 
    className, 
    value = 0, 
    max = 100,
    label,
    variant,
    ...props 
  }: ProgressProps) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

    return (
      <div className="w-full">
        {label && (
          <div className="mb-2 flex justify-between text-sm font-source-sans text-gray-70">
            <span>{label}</span>
            <span className="font-bold">{Math.round(percentage)}%</span>
          </div>
        )}
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-label={`Progress: ${Math.round(percentage)}%`}
          className={cn(
            "relative w-full h-2 overflow-hidden rounded-full bg-gray-10",
            className
          )}
          {...props}
        >
          <div
            className={cn(progressVariants({ variant }))}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    )
  }
)

export { Progress, progressVariants }
