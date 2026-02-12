"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type SliderProps = {
  className?: string
  defaultValue?: number[]
  value?: number[]
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  onValueChange?: (value: number[]) => void
  name?: string
  id?: string
}

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  (
    {
      className,
      defaultValue = [0],
      value,
      min = 0,
      max = 100,
      step = 1,
      disabled = false,
      onValueChange,
      name,
      id,
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState<number[]>(
      value || defaultValue
    )
    const [activeThumbIndex, setActiveThumbIndex] = React.useState<number | null>(null)
    const trackRef = React.useRef<HTMLDivElement>(null)

    const currentValue = value !== undefined ? value : internalValue

    const handleValueChange = (index: number, newValue: number) => {
      const updatedValues = [...currentValue]
      updatedValues[index] = newValue
      
      // Sort values to maintain order for multi-thumb sliders
      updatedValues.sort((a, b) => a - b)
      
      if (value === undefined) {
        setInternalValue(updatedValues)
      }
      
      onValueChange?.(updatedValues)
    }

    const getThumbPosition = (val: number) => {
      return ((val - min) / (max - min)) * 100
    }

    const getValueFromPosition = (clientX: number) => {
      if (!trackRef.current) return min

      const rect = trackRef.current.getBoundingClientRect()
      const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
      const rawValue = min + percentage * (max - min)
      
      // Snap to step
      const steppedValue = Math.round(rawValue / step) * step
      return Math.max(min, Math.min(max, steppedValue))
    }

    const handleMouseMove = React.useCallback(
      (e: MouseEvent) => {
        if (activeThumbIndex === null || disabled) return
        
        const newValue = getValueFromPosition(e.clientX)
        handleValueChange(activeThumbIndex, newValue)
      },
      [activeThumbIndex, disabled, min, max, step]
    )

    const handleMouseUp = React.useCallback(() => {
      setActiveThumbIndex(null)
    }, [])

    React.useEffect(() => {
      if (activeThumbIndex !== null) {
        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)
        
        return () => {
          document.removeEventListener('mousemove', handleMouseMove)
          document.removeEventListener('mouseup', handleMouseUp)
        }
      }
    }, [activeThumbIndex, handleMouseMove, handleMouseUp])

    const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (disabled) return
      
      // Don't handle clicks on thumbs
      if ((e.target as HTMLElement).closest('[data-slot="slider-thumb"]')) {
        return
      }

      const newValue = getValueFromPosition(e.clientX)
      
      // Find the closest thumb to move
      let closestIndex = 0
      let closestDistance = Math.abs(currentValue[0] - newValue)
      
      currentValue.forEach((val, index) => {
        const distance = Math.abs(val - newValue)
        if (distance < closestDistance) {
          closestDistance = distance
          closestIndex = index
        }
      })
      
      handleValueChange(closestIndex, newValue)
    }

    return (
      <div
        ref={ref}
        data-slot="slider"
        data-disabled={disabled ? "true" : undefined}
        className={cn(
          "relative flex w-full touch-none select-none items-center mt-2",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
      >
        {/* Track */}
        <div
          ref={trackRef}
          data-slot="slider-track"
          className={cn(
            "relative overflow-hidden rounded-full bg-gray-30 h-2 w-full cursor-pointer"
          )}
          onClick={handleTrackClick}
        >
          {/* Range - filled portion between min and first thumb for single, or between thumbs for multiple */}
          <div
            data-slot="slider-range"
            className={cn(
              "absolute bg-blue-60v h-full left-0 pointer-events-none"
            )}
            style={
              currentValue.length > 1
                ? {
                    left: `${getThumbPosition(currentValue[0])}%`,
                    right: `${100 - getThumbPosition(currentValue[currentValue.length - 1])}%`,
                  }
                : {
                    width: `${getThumbPosition(currentValue[0])}%`,
                  }
            }
          />
        </div>

        {/* Thumbs */}
        {currentValue.map((val, index) => (
          <div
            key={index}
            data-slot="slider-thumb-wrapper"
            className={cn(
              "absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
            )}
            style={{
              left: `${getThumbPosition(val)}%`
            }}
          >
            <input
              type="range"
              name={name}
              id={index === 0 ? id : undefined}
              min={min}
              max={max}
              step={step}
              value={val}
              disabled={disabled}
              onChange={(e) => handleValueChange(index, Number(e.target.value))}
              className="sr-only"
              aria-valuemin={min}
              aria-valuemax={max}
              aria-valuenow={val}
              aria-orientation="horizontal"
            />
            <div
              data-slot="slider-thumb"
              className={cn(
                "block h-4 w-4 shrink-0 rounded-full border-2 border-blue-60v bg-white shadow-md transition-shadow",
                "hover:ring-4 hover:ring-blue-60v/30",
                "focus-visible:ring-4 focus-visible:ring-blue-60v/60 focus-visible:outline-none",
                disabled
                  ? "pointer-events-none cursor-not-allowed"
                  : "cursor-grab active:cursor-grabbing",
                activeThumbIndex === index && "ring-4 ring-blue-60v/60 cursor-grabbing"
              )}
              tabIndex={disabled ? -1 : 0}
              role="slider"
              aria-valuemin={min}
              aria-valuemax={max}
              aria-valuenow={val}
              aria-orientation="horizontal"
              aria-disabled={disabled}
              onMouseDown={(e) => {
                if (disabled) return
                e.preventDefault()
                e.stopPropagation()
                setActiveThumbIndex(index)
                ;(e.currentTarget as HTMLElement).focus()
              }}
              onKeyDown={(e) => {
                if (disabled) return
                
                let newValue = val
                const stepValue = step || 1
                const largeStep = (max - min) / 10

                switch (e.key) {
                  case "ArrowRight":
                  case "ArrowUp":
                    e.preventDefault()
                    newValue = Math.min(val + stepValue, max)
                    break
                  case "ArrowLeft":
                  case "ArrowDown":
                    e.preventDefault()
                    newValue = Math.max(val - stepValue, min)
                    break
                  case "PageUp":
                    e.preventDefault()
                    newValue = Math.min(val + largeStep, max)
                    break
                  case "PageDown":
                    e.preventDefault()
                    newValue = Math.max(val - largeStep, min)
                    break
                  case "Home":
                    e.preventDefault()
                    newValue = min
                    break
                  case "End":
                    e.preventDefault()
                    newValue = max
                    break
                  default:
                    return
                }

                handleValueChange(index, newValue)
              }}
            />
          </div>
        ))}
      </div>
    )
  }
)

Slider.displayName = "Slider"

export { Slider }
export type { SliderProps }
