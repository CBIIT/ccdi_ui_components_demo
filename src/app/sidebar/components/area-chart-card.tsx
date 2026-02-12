"use client"

import * as React from "react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/charts/chart"
import { chartCumulativeData, chartCumulativeConfig } from "../data/chart-data"

export function AreaChartCard() {
  return (
    <Card className="flex flex-col max-w-xl">
      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <h2 className="font-bold font-merriweather text-lg">
            Area Chart - Cumulative Enrollment
          </h2>
          <p className="text-sm text-muted-foreground">
            Total participants over study weeks
          </p>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center pb-0">
        <ChartContainer
          config={chartCumulativeConfig}
          className="mx-auto aspect-video w-full"
        >
          <AreaChart data={chartCumulativeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="participants"
              stroke="var(--color-red-50v)"
              fill="var(--color-red-50v)"
              fillOpacity={0.6}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="text-muted-foreground leading-none">
          Monitor cumulative enrollment over the study period
        </div>
      </CardFooter>
    </Card>
  )
}
