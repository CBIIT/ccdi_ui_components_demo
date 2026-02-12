"use client"

import * as React from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/charts/chart"
import { chartSalesData, chartSalesConfig } from "../data/chart-data"

export function LineChartCard() {
  return (
    <Card className="flex flex-col max-w-xl">
      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <h2 className="font-bold font-merriweather text-lg">
            Line Chart - Sales Trend
          </h2>
          <p className="text-sm text-muted-foreground">
            Monthly sales performance
          </p>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center pb-0">
        <ChartContainer
          config={chartSalesConfig}
          className="mx-auto aspect-video w-full"
        >
          <LineChart data={chartSalesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="var(--color-blue-60v)"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="text-muted-foreground leading-none">
          Track sales trends over time
        </div>
      </CardFooter>
    </Card>
  )
}
