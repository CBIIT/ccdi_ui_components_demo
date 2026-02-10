"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type SwitchProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  onCheckedChange?: (checked: boolean) => void
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, onCheckedChange, checked, defaultChecked, ...props }, ref) => {
    const [internalChecked, setInternalChecked] = React.useState(
      defaultChecked || false
    )
    
    const isChecked = checked !== undefined ? checked : internalChecked

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newChecked = e.target.checked
      
      if (checked === undefined) {
        setInternalChecked(newChecked)
      }
      
      onCheckedChange?.(newChecked)
      props.onChange?.(e)
    }

    return (
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          ref={ref}
          checked={isChecked}
          onChange={handleChange}
          className="sr-only peer"
          {...props}
        />
        <div
          data-slot="switch"
          className={cn(
            "peer inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border-2 border-transparent shadow-sm transition-all outline-none",
            // Unchecked state
            "bg-gray-50 peer-checked:bg-blue-60",
            // Focus states
            "peer-focus:outline peer-focus:outline-4 peer-focus:outline-offset-4 peer-focus:outline-blue-40",
            // Disabled states
            "peer-disabled:cursor-not-allowed peer-disabled:opacity-50 peer-disabled:bg-gray-30 peer-disabled:peer-checked:bg-gray-50",
            className
          )}
        >
          <div
            data-slot="switch-thumb"
            className={cn(
              "pointer-events-none block size-4 rounded-full bg-white ring-0 transition-transform",
              isChecked ? "translate-x-[calc(100%-4px)]" : "translate-x-0"
            )}
          />
        </div>
      </label>
    )
  }
)

Switch.displayName = "Switch"

export { Switch }
export type { SwitchProps }
