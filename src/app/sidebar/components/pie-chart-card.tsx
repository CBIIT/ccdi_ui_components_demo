"use client"

import * as React from "react"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { BasePieChart } from "./base-pie-chart"
import { chartBrowserData, chartBrowserConfig } from "../data/chart-data"

export function PieChartCard() {
  return (
    <Card className="flex flex-col max-w-xl">
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
        <BasePieChart
          data={chartBrowserData}
          dataKey="visitors"
          nameKey="browser"
          config={chartBrowserConfig}
        />
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="text-muted-foreground leading-none">
          Hover over a segment to highlight it and see its value
        </div>
      </CardFooter>
    </Card>
  )
}
