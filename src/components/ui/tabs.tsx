"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type TabsContextValue = {
  value: string
  onValueChange: (value: string) => void
}

const TabsContext = React.createContext<TabsContextValue | null>(null)

const useTabsContext = () => {
  const context = React.useContext(TabsContext)
  if (!context) {
    throw new Error("Tabs components must be used within a Tabs component")
  }
  return context
}

type TabsProps = React.HTMLAttributes<HTMLDivElement> & {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ className, defaultValue, value, onValueChange, children, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue || "")
    
    const currentValue = value !== undefined ? value : internalValue
    
    const handleValueChange = React.useCallback(
      (newValue: string) => {
        if (value === undefined) {
          setInternalValue(newValue)
        }
        onValueChange?.(newValue)
      },
      [value, onValueChange]
    )

    return (
      <TabsContext.Provider value={{ value: currentValue, onValueChange: handleValueChange }}>
        <div
          ref={ref}
          data-slot="tabs"
          className={cn("flex flex-col", className)}
          {...props}
        >
          {children}
        </div>
      </TabsContext.Provider>
    )
  }
)
Tabs.displayName = "Tabs"

type TabsListProps = React.HTMLAttributes<HTMLDivElement>

const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="tabs-list"
        role="tablist"
        className={cn(
          "inline-flex w-fit items-center justify-center gap-0.5 bg-white border-b-4 border-gray-30",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
TabsList.displayName = "TabsList"

type TabsTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  value: string
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, value, children, ...props }, ref) => {
    const { value: selectedValue, onValueChange } = useTabsContext()
    const isActive = selectedValue === value

    return (
      <button
        ref={ref}
        type="button"
        role="tab"
        aria-selected={isActive}
        aria-controls={`tabpanel-${value}`}
        id={`tab-${value}`}
        data-slot="tabs-trigger"
        data-state={isActive ? "active" : "inactive"}
        className={cn(
          "inline-flex items-center justify-center gap-1.5 px-4 py-3 text-base font-medium whitespace-nowrap transition-all",
          "border-t-4 border-transparent",
          "hover:bg-gray-5 hover:text-blue-60v",
          "focus:outline focus:outline-4 focus:outline-blue-40v focus:z-10",
          "disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed",
          isActive
            ? "border-blue-60v text-blue-60v bg-gray-5"
            : "text-gray-70 hover:border-gray-30",
          "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
          className
        )}
        onClick={() => onValueChange(value)}
        {...props}
      >
        {children}
      </button>
    )
  }
)
TabsTrigger.displayName = "TabsTrigger"

type TabsContentProps = React.HTMLAttributes<HTMLDivElement> & {
  value: string
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value, children, ...props }, ref) => {
    const { value: selectedValue } = useTabsContext()
    const isActive = selectedValue === value

    if (!isActive) {
      return null
    }

    return (
      <div
        ref={ref}
        role="tabpanel"
        id={`tabpanel-${value}`}
        aria-labelledby={`tab-${value}`}
        data-slot="tabs-content"
        data-state={isActive ? "active" : "inactive"}
        tabIndex={0}
        className={cn("flex-1 outline-none py-6 px-4 border-4 border-gray-5", className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
TabsContent.displayName = "TabsContent"

export { Tabs, TabsList, TabsTrigger, TabsContent }
export type { TabsProps, TabsListProps, TabsTriggerProps, TabsContentProps }
