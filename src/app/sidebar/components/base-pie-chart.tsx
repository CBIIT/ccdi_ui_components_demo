"use client"

import * as React from "react"
import { PieChart, Pie, Sector, Label } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/charts/chart"

// Generic data type constraint - must have a numeric value and a label
export type PieChartDataItem = {
  [key: string]: string | number | undefined
  fill?: string
}

export type BasePieChartProps = {
  data: PieChartDataItem[]
  dataKey: keyof PieChartDataItem & string // The numeric value field (e.g., "visitors", "count", "value")
  nameKey: keyof PieChartDataItem & string // The label field (e.g., "browser", "category", "name")
  config: ChartConfig
  className?: string
}

export function BasePieChart({
  data,
  dataKey,
  nameKey,
  config,
  className = "mx-auto aspect-square w-full max-w-[300px]",
}: BasePieChartProps) {
  const [activeIndex, setActiveIndex] = React.useState<number | undefined>(undefined)

  // Generate label text from config using dataKey (e.g., config["visitors"].label = "Visitors")
  const labelText = React.useMemo(() => {
    const configEntry = config[dataKey]
    if (configEntry?.label) {
      return typeof configEntry.label === 'string' 
        ? configEntry.label 
        : String(configEntry.label)
    }
    // Fallback: capitalize first letter and add space before capital letters
    return dataKey.toString().charAt(0).toUpperCase() + dataKey.toString().slice(1)
  }, [config, dataKey])
  
  // Calculate total dynamically
  const total = React.useMemo(() => {
    return data.reduce((acc, curr) => {
      const value = curr[dataKey]
      return acc + (typeof value === 'number' ? value : 0)
    }, 0)
  }, [data, dataKey])

  return (
    <ChartContainer
      config={config}
      className={className}
    >
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent />} />
        <Pie
          data={data}
          dataKey={dataKey}
          nameKey={nameKey}
          innerRadius={60}
          strokeWidth={5}
          activeIndex={activeIndex}
          onMouseEnter={(_, index) => setActiveIndex(index)}
          onMouseLeave={() => setActiveIndex(undefined)}
          activeShape={({
            outerRadius = 0,
            ...props
          }: any) => (
            <g>
              <Sector {...props} outerRadius={outerRadius} />
              <Sector {...props} outerRadius={outerRadius + 8} innerRadius={outerRadius + 5} />
            </g>
          )}
        >
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  const displayValue =
                    activeIndex !== undefined
                      ? (data[activeIndex]?.[dataKey] as number) || 0
                      : total;
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-xl font-bold"
                      >
                        {displayValue.toLocaleString()}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 16}
                        className="fill-muted-foreground"
                      >
                        {labelText}
                      </tspan>
                    </text>
                  );
                }
                return null;
              }}
            />
        </Pie>
      </PieChart>
    </ChartContainer>
  )
}
