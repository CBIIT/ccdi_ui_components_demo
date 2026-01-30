"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type CheckboxProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  onCheckedChange?: (checked: boolean) => void
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, defaultChecked, onCheckedChange, onChange, ...props }, ref) => {
    const [isChecked, setIsChecked] = React.useState<boolean>(
      defaultChecked ?? (typeof checked === 'boolean' ? checked : false)
    )

    const currentChecked = checked !== undefined ? checked : isChecked

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newChecked = event.target.checked
      
      if (checked === undefined) {
        setIsChecked(newChecked)
      }
      
      onCheckedChange?.(newChecked)
      onChange?.(event)
    }

    return (
      <div className="relative inline-flex">
        <input
          type="checkbox"
          ref={ref}
          checked={currentChecked}
          onChange={handleChange}
          className="peer absolute absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          {...props}
        />
        <div
          className={cn(
            "size-6 shrink-0 rounded-sm border-2 border-gray-90 ring-offset-background",
            "focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-blue-40",
            "peer-disabled:cursor-not-allowed peer-disabled:opacity-50 peer-disabled:border-gray-50",
            "peer-checked:bg-blue-60 peer-checked:text-white peer-checked:border-blue-60",
            "peer-disabled:peer-checked:bg-gray-50",
            "peer-focus:outline peer-focus:outline-4 peer-focus:outline-offset-4 peer-focus:outline-offset-2 peer-focus:outline-blue-40",
            "flex items-center justify-center pointer-events-none",
            className
          )}
        >
          {currentChecked && (
            <svg 
              className="size-3" 
              xmlns="http://www.w3.org/2000/svg" 
              width="65" 
              height="50" 
              viewBox="0 0 65 50"
              aria-hidden="true"
            >
              <path 
                fill="currentColor" 
                fillRule="evenodd" 
                d="M63.268 7.063l-5.616-5.61C56.882.685 55.946.3 54.845.3s-2.038.385-2.808 1.155L24.951 28.552 12.81 16.385c-.77-.77-1.707-1.155-2.808-1.155-1.1 0-2.037.385-2.807 1.154l-5.616 5.61C.81 22.764.425 23.7.425 24.8s.385 2.035 1.155 2.805l14.947 14.93 5.616 5.61c.77.77 1.706 1.154 2.807 1.154s2.038-.384 2.808-1.154l5.616-5.61 29.894-29.86c.77-.77 1.157-1.707 1.157-2.805 0-1.101-.385-2.036-1.156-2.805l-.001-.002z"
              />
            </svg>
          )}
        </div>
      </div>
    )
  }
)
Checkbox.displayName = "Checkbox"

export { Checkbox } 