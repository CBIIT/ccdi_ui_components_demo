"use client"

import * as React from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/charts/chart"
import { chartPerformanceData, chartPerformanceConfig } from "../data/chart-data"

export function HorizontalBarChartCard() {
  return (
    <Card className="flex flex-col max-w-xl">
      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <h2 className="font-bold font-merriweather text-lg">
            Horizontal Bar Chart - Performance
          </h2>
          <p className="text-sm text-muted-foreground">
            Regional performance scores
          </p>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center pb-0">
        <ChartContainer
          config={chartPerformanceConfig}
          className="mx-auto aspect-video w-full"
        >
          <BarChart data={chartPerformanceData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="region" type="category" width={80} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="performance" fill="var(--color-green-cool-40v)" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="text-muted-foreground leading-none">
          Compare performance across different regions
        </div>
      </CardFooter>
    </Card>
  )
}
