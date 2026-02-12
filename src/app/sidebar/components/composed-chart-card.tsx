"use client"

import * as React from "react"
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid } from "recharts"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/charts/chart"
import { chartStudyData, chartStudyConfig } from "../data/chart-data"

export function ComposedChartCard() {
  return (
    <Card className="flex flex-col max-w-xl">
      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <h2 className="font-bold font-merriweather text-lg">
            Composed Chart - Enrollment & Specimens
          </h2>
          <p className="text-sm text-muted-foreground">
            Quarterly enrollment and specimen collection
          </p>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center pb-0">
        <ChartContainer
          config={chartStudyConfig}
          className="mx-auto aspect-video w-full"
        >
          <ComposedChart data={chartStudyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="quarter" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar yAxisId="left" dataKey="participants" fill="var(--color-navy-60v)" radius={[4, 4, 0, 0]} />
            <Line yAxisId="right" type="monotone" dataKey="specimens" stroke="var(--color-teal-20)" strokeWidth={2} dot={{ r: 4 }} />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="text-muted-foreground leading-none">
          Combined view of participants enrolled (bars) and specimens collected (line)
        </div>
      </CardFooter>
    </Card>
  )
}
