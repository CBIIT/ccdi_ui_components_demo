"use client"

import * as React from "react"
import { PieChart, Pie, Sector, Label } from "recharts"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/charts/chart"
import { chartBrowserData, chartBrowserConfig } from "../data/chart-data"

interface PieChartCardProps {
  id: string
}

export function PieChartCard({ id }: PieChartCardProps) {
  const [activeIndex, setActiveIndex] = React.useState<number | undefined>(undefined)
  const total = chartBrowserData.reduce((acc, curr) => acc + curr.visitors, 0)

  return (
    <Card data-chart={id} className="flex flex-col max-w-xl">
      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <h2 className="font-bold font-merriweather text-lg">
            Pie Chart - Interactive
          </h2>
          <p className="text-sm text-muted-foreground">
            Browser usage distribution
          </p>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center pb-0">
        <ChartContainer
          id={id}
          config={chartBrowserConfig}
          className="mx-auto aspect-square w-full max-w-[300px]"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent />} />
            <Pie
              data={chartBrowserData}
              dataKey="visitors"
              nameKey="browser"
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
                        ? chartBrowserData[activeIndex].visitors
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
                          Visitors
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
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="text-muted-foreground leading-none">
          Hover over a segment to highlight it and see its value
        </div>
      </CardFooter>
    </Card>
  )
}
