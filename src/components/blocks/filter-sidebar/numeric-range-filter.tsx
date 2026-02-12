"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Icon } from "@/components/ui/icon"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"

export type NumericRangeFilterUnit = string

export type UnknownOptionValue = "include" | "exclude" | "only"

export type NumericRangeFilterProps = {
  /** Minimum value of the full range */
  min: number
  /** Maximum value of the full range */
  max: number
  /** Current minimum selected value */
  valueMin: number
  /** Current maximum selected value */
  valueMax: number
  /** Called when the range changes */
  onRangeChange: (min: number, max: number) => void
  /** Unit options, e.g. [{ value: 'days', label: 'DAYS' }, { value: 'years', label: 'YEARS' }] */
  units: { value: string; label: string }[]
  /** Currently selected unit */
  unit: string
  /** Called when unit changes */
  onUnitChange: (unit: string) => void
  /** Label for the "unknown" radio section, e.g. "UNKNOWN AGES:" */
  unknownLabel?: string
  /** Current unknown option */
  unknownValue: UnknownOptionValue
  /** Called when unknown option changes */
  onUnknownChange: (value: UnknownOptionValue) => void
  /** Called when reset (refresh) is clicked */
  onReset?: () => void
  /** Optional format function for slider labels (e.g. add commas) */
  formatLabel?: (n: number) => string
  /**
   * Accent color key aligning with filter category (e.g. "teal", "violet", "orange").
   * When set, unit toggle, slider, and radio use this color instead of the default navy/blue.
   */
  accentColor?: string
  className?: string
}

const defaultFormatLabel = (n: number) => n.toLocaleString()

/** Tailwind classes for accent elements by category color key */
const accentColorMap: Record<
  string,
  { button: string; slider: string; radioItem: string }
> = {
  teal: {
    button: "bg-teal-50 text-white hover:bg-teal-70 active:bg-teal-80 border-teal-50",
    slider:
      "[&_[data-slot=slider-range]]:bg-teal-50 [&_[data-slot=slider-thumb]]:border-teal-50 [&_[data-slot=slider-thumb]]:hover:ring-teal-50/30 [&_[data-slot=slider-thumb]]:focus-visible:ring-teal-50/60 [&_[data-slot=slider-thumb]]:ring-teal-50/60",
    radioItem:
      "peer-checked:before:bg-teal-50 peer-checked:ring-teal-50 peer-focus:peer-checked:ring-teal-50",
  },
  magenta: {
    button: "bg-magenta-60 text-white hover:bg-magenta-70 active:bg-magenta-80 border-magenta-60",
    slider:
      "[&_[data-slot=slider-range]]:bg-magenta-60 [&_[data-slot=slider-thumb]]:border-magenta-60 [&_[data-slot=slider-thumb]]:hover:ring-magenta-60/30 [&_[data-slot=slider-thumb]]:focus-visible:ring-magenta-60/60 [&_[data-slot=slider-thumb]]:ring-magenta-60/60",
    radioItem:
      "peer-checked:before:bg-magenta-60 peer-checked:ring-magenta-60 peer-focus:peer-checked:ring-magenta-60",
  },
  violet: {
    button: "bg-violet-60 text-white hover:bg-violet-70 active:bg-violet-80 border-violet-60",
    slider:
      "[&_[data-slot=slider-range]]:bg-violet-60 [&_[data-slot=slider-thumb]]:border-violet-60 [&_[data-slot=slider-thumb]]:hover:ring-violet-60/30 [&_[data-slot=slider-thumb]]:focus-visible:ring-violet-60/60 [&_[data-slot=slider-thumb]]:ring-violet-60/60",
    radioItem:
      "peer-checked:before:bg-violet-60 peer-checked:ring-violet-60 peer-focus:peer-checked:ring-violet-60",
  },
  orange: {
    button: "bg-orange-60 text-white hover:bg-orange-70 active:bg-orange-80 border-orange-60",
    slider:
      "[&_[data-slot=slider-range]]:bg-orange-60 [&_[data-slot=slider-thumb]]:border-orange-60 [&_[data-slot=slider-thumb]]:hover:ring-orange-60/30 [&_[data-slot=slider-thumb]]:focus-visible:ring-orange-60/60 [&_[data-slot=slider-thumb]]:ring-orange-60/60",
    radioItem:
      "peer-checked:before:bg-orange-60 peer-checked:ring-orange-60 peer-focus:peer-checked:ring-orange-60",
  },
  red: {
    button: "bg-red-60 text-white hover:bg-red-warm-70 active:bg-red-warm-80 border-red-60",
    slider:
      "[&_[data-slot=slider-range]]:bg-red-60 [&_[data-slot=slider-thumb]]:border-red-60 [&_[data-slot=slider-thumb]]:hover:ring-red-60/30 [&_[data-slot=slider-thumb]]:focus-visible:ring-red-60/60 [&_[data-slot=slider-thumb]]:ring-red-60/60",
    radioItem:
      "peer-checked:before:bg-red-60 peer-checked:ring-red-60 peer-focus:peer-checked:ring-red-60",
  },
  blue: {
    button: "bg-blue-60 text-white hover:bg-blue-70 active:bg-blue-80 border-blue-60",
    slider:
      "[&_[data-slot=slider-range]]:bg-blue-60 [&_[data-slot=slider-thumb]]:border-blue-60 [&_[data-slot=slider-thumb]]:hover:ring-blue-60/30 [&_[data-slot=slider-thumb]]:focus-visible:ring-blue-60/60 [&_[data-slot=slider-thumb]]:ring-blue-60/60",
    radioItem:
      "peer-checked:before:bg-blue-60 peer-checked:ring-blue-60 peer-focus:peer-checked:ring-blue-60",
  },
  "dark-blue": {
    button: "bg-blue-80 text-white hover:bg-blue-90 active:bg-blue-90 border-blue-80",
    slider:
      "[&_[data-slot=slider-range]]:bg-blue-80 [&_[data-slot=slider-thumb]]:border-blue-80 [&_[data-slot=slider-thumb]]:hover:ring-blue-80/30 [&_[data-slot=slider-thumb]]:focus-visible:ring-blue-80/60 [&_[data-slot=slider-thumb]]:ring-blue-80/60",
    radioItem:
      "peer-checked:before:bg-blue-80 peer-checked:ring-blue-80 peer-focus:peer-checked:ring-blue-80",
  },
  green: {
    button: "bg-green-60 text-white hover:bg-green-70 active:bg-green-80 border-green-60",
    slider:
      "[&_[data-slot=slider-range]]:bg-green-60 [&_[data-slot=slider-thumb]]:border-green-60 [&_[data-slot=slider-thumb]]:hover:ring-green-60/30 [&_[data-slot=slider-thumb]]:focus-visible:ring-green-60/60 [&_[data-slot=slider-thumb]]:ring-green-60/60",
    radioItem:
      "peer-checked:before:bg-green-60 peer-checked:ring-green-60 peer-focus:peer-checked:ring-green-60",
  },
}

const defaultAccent = {
  button: "bg-navy-50 text-white hover:bg-navy-70 active:bg-navy-80 border border-navy-50",
  slider: "mt-0",
  radioItem: "",
}

export function NumericRangeFilter({
  min,
  max,
  valueMin,
  valueMax,
  onRangeChange,
  units,
  unit,
  onUnitChange,
  unknownLabel = "UNKNOWN AGES:",
  unknownValue,
  onUnknownChange,
  onReset,
  formatLabel = defaultFormatLabel,
  accentColor,
  className,
}: NumericRangeFilterProps) {
  const accent = accentColor && accentColorMap[accentColor] ? accentColorMap[accentColor] : defaultAccent
  const [localMin, setLocalMin] = React.useState(String(valueMin))
  const [localMax, setLocalMax] = React.useState(String(valueMax))
  const safeValueMin = Math.max(min, Math.min(valueMin, valueMax))
  const safeValueMax = Math.min(max, Math.max(valueMax, valueMin))

  React.useEffect(() => {
    setLocalMin(String(valueMin))
    setLocalMax(String(valueMax))
  }, [valueMin, valueMax])

  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    setLocalMin(v)
    const n = Number(v)
    if (!Number.isNaN(n)) {
      const newMin = Math.max(min, Math.min(n, safeValueMax))
      onRangeChange(newMin, safeValueMax)
    }
  }

  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    setLocalMax(v)
    const n = Number(v)
    if (!Number.isNaN(n)) {
      const newMax = Math.min(max, Math.max(n, safeValueMin))
      onRangeChange(safeValueMin, newMax)
    }
  }

  const handleMinBlur = () => {
    const n = Number(localMin)
    if (Number.isNaN(n)) {
      setLocalMin(String(safeValueMin))
      return
    }
    const newMin = Math.max(min, Math.min(n, safeValueMax))
    setLocalMin(String(newMin))
    onRangeChange(newMin, safeValueMax)
  }

  const handleMaxBlur = () => {
    const n = Number(localMax)
    if (Number.isNaN(n)) {
      setLocalMax(String(safeValueMax))
      return
    }
    const newMax = Math.min(max, Math.max(n, safeValueMin))
    setLocalMax(String(newMax))
    onRangeChange(safeValueMin, newMax)
  }

  const handleSliderValueChange = React.useCallback(
    (values: number[]) => {
      const [newMin, newMax] = values
      setLocalMin(String(newMin))
      setLocalMax(String(newMax))
      onRangeChange(newMin, newMax)
    },
    [onRangeChange]
  )

  return (
    <div className={cn("flex flex-col", className)}>
      {/* Reset + Unit toggle */}
      <div className="flex items-center gap-2 mb-4">
        {onReset && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={onReset}
            aria-label="Reset"
            className="shrink-0 rounded-full border-gray-60 bg-white text-gray-90 hover:bg-gray-10 hover:border-gray-70"
          >
            <Icon icon="undo" size="sm" className="h-5 w-5" />
          </Button>
        )}
        <ButtonGroup orientation="horizontal" className="flex-1">
          {units.map((u) => (
            <Button
              key={u.value}
              type="button"
              onClick={() => onUnitChange(u.value)}
              className={cn(
                "flex-1 font-semibold uppercase border",
                unit === u.value
                  ? accent.button
                  : "bg-gray-20 text-gray-90 hover:bg-gray-30 border-gray-40"
              )}
            >
              {u.label}
            </Button>
          ))}
        </ButtonGroup>
      </div>

      {/* Min / Max inputs */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-0.5">
          <Label htmlFor="numeric-range-min" className="text-gray-90 font-public-sans">
            Min:
          </Label>
          <Input
            id="numeric-range-min"
            type="number"
            min={min}
            max={max}
            value={localMin}
            onChange={handleMinInputChange}
            onBlur={handleMinBlur}
            className="mt-0 h-10"
          />
        </div>
        <div className="flex items-center gap-0.5">
          <Label htmlFor="numeric-range-max" className="text-gray-90 font-public-sans">
            Max:
          </Label>
          <Input
            id="numeric-range-max"
            type="number"
            min={min}
            max={max}
            value={localMax}
            onChange={handleMaxInputChange}
            onBlur={handleMaxBlur}
            className="mt-0 h-10"
          />
        </div>
      </div>

      {/* Dual-thumb range slider */}
      <div className="relative flex flex-col gap-1 px-1">
        <Slider
          min={min}
          max={max}
          step={1}
          value={[safeValueMin, safeValueMax]}
          onValueChange={handleSliderValueChange}
          className={cn("mt-0", accent.slider)}
        />
        <div className="flex justify-between text-sm text-gray-70 font-public-sans">
          <span>{formatLabel(min)}</span>
          <span>{formatLabel(max)}</span>
        </div>
      </div>

      <hr className="border-gray-30 my-4" />

      {/* Unknown options */}
      <div className="flex flex-col gap-2">
        <Label className="text-gray-90 font-public-sans font-semibold uppercase tracking-wide mb-2">
          {unknownLabel}
        </Label>
        <RadioGroup
          value={unknownValue}
          onValueChange={(v) => onUnknownChange(v as UnknownOptionValue)}
          className="flex flex-col gap-2"
        >
          <RadioGroupItem
            value="include"
            className={cn("flex items-center gap-3", accent.radioItem)}
          >
            Include
          </RadioGroupItem>
          <RadioGroupItem
            value="exclude"
            className={cn("flex items-center gap-3", accent.radioItem)}
          >
            Exclude
          </RadioGroupItem>
          <RadioGroupItem
            value="only"
            className={cn("flex items-center gap-3", accent.radioItem)}
          >
            Only
          </RadioGroupItem>
        </RadioGroup>
      </div>
    </div>
  )
}
