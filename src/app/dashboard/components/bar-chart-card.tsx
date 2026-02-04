"use client"

import * as React from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/charts/chart"
import { chartRevenueData, chartRevenueConfig } from "../data/chart-data"

interface BarChartCardProps {
  id: string
}

export function BarChartCard({ id }: BarChartCardProps) {
  return (
    <Card data-chart={id} className="flex flex-col max-w-xl">
      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <h2 className="font-bold font-merriweather text-lg">
            Bar Chart - Revenue
          </h2>
          <p className="text-sm text-muted-foreground">
            Revenue by product
          </p>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center pb-0">
        <ChartContainer
          id={id}
          config={chartRevenueConfig}
          className="mx-auto aspect-video w-full"
        >
          <BarChart data={chartRevenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="product" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="revenue" fill="var(--color-cyan-30v)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="text-muted-foreground leading-none">
          Compare revenue across different products
        </div>
      </CardFooter>
    </Card>
  )
}
