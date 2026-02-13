"use client"

import * as React from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/charts/chart"
import { chartDiagnosisData, chartDiagnosisConfig } from "../data/chart-data"

export function BarChartCard() {
  return (
    <Card className="flex flex-col max-w-xl">
      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <h2 className="font-bold font-merriweather text-lg">
            Bar Chart - Participants by Diagnosis
          </h2>
          <p className="text-sm text-muted-foreground">
            Participants by cancer type
          </p>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center pb-0">
        <ChartContainer
          config={chartDiagnosisConfig}
          className="mx-auto aspect-video w-full"
        >
          <BarChart data={chartDiagnosisData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="diagnosisType" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="participants" fill="var(--color-teal-50)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="text-muted-foreground leading-none">
          Compare participant counts across cancer types
        </div>
      </CardFooter>
    </Card>
  )
}
