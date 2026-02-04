"use client"

import * as React from "react"
import {
  PieChart,
  Pie,
  Sector,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Label,
} from "recharts"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/charts/chart"

// Pie Chart Data & Config
const chartBrowserData = [
  { browser: "Chrome", visitors: 275, fill: "hsl(var(--chart-1))" },
  { browser: "Safari", visitors: 200, fill: "hsl(var(--chart-2))" },
  { browser: "Firefox", visitors: 187, fill: "hsl(var(--chart-3))" },
  { browser: "Edge", visitors: 173, fill: "hsl(var(--chart-4))" },
  { browser: "Other", visitors: 90, fill: "hsl(var(--chart-5))" },
]

const chartBrowserConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Firefox",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Edge",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
}

// Line Chart Data & Config
const chartSalesData = [
  { month: "Jan", sales: 186 },
  { month: "Feb", sales: 305 },
  { month: "Mar", sales: 237 },
  { month: "Apr", sales: 273 },
  { month: "May", sales: 209 },
  { month: "Jun", sales: 214 },
]

const chartSalesConfig = {
  sales: {
    label: "Sales",
    color: "hsl(var(--chart-1))",
  },
}

// Bar Chart Data & Config
const chartRevenueData = [
  { product: "Product A", revenue: 1200 },
  { product: "Product B", revenue: 1900 },
  { product: "Product C", revenue: 3000 },
  { product: "Product D", revenue: 2100 },
  { product: "Product E", revenue: 1800 },
]

const chartRevenueConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-2))",
  },
}

// Area Chart Data & Config
const chartUsersData = [
  { week: "Week 1", users: 400 },
  { week: "Week 2", users: 300 },
  { week: "Week 3", users: 500 },
  { week: "Week 4", users: 450 },
  { week: "Week 5", users: 600 },
  { week: "Week 6", users: 550 },
]

const chartUsersConfig = {
  users: {
    label: "Active Users",
    color: "hsl(var(--chart-3))",
  },
}

export default function DashboardPage() {
  const [pieActiveIndex, setPieActiveIndex] = React.useState<number | undefined>(undefined)
  const pieId = React.useId()
  const lineId = React.useId()
  const barId = React.useId()
  const areaId = React.useId()

  const pieTotal = chartBrowserData.reduce((acc, curr) => acc + curr.visitors, 0)

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="font-bold font-merriweather text-3xl mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <Card data-chart={pieId} className="flex flex-col max-w-xl">
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
              id={pieId}
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
                  activeIndex={pieActiveIndex}
                  onMouseEnter={(_, index) => setPieActiveIndex(index)}
                  onMouseLeave={() => setPieActiveIndex(undefined)}
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
                          pieActiveIndex !== undefined
                            ? chartBrowserData[pieActiveIndex].visitors
                            : pieTotal;
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

        {/* Line Chart */}
        <Card data-chart={lineId} className="flex flex-col max-w-xl">
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
              id={lineId}
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
                  stroke="hsl(var(--chart-1))"
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

        {/* Bar Chart */}
        <Card data-chart={barId} className="flex flex-col max-w-xl">
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
              id={barId}
              config={chartRevenueConfig}
              className="mx-auto aspect-video w-full"
            >
              <BarChart data={chartRevenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="product" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="revenue" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="text-muted-foreground leading-none">
              Compare revenue across different products
            </div>
          </CardFooter>
        </Card>

        {/* Area Chart */}
        <Card data-chart={areaId} className="flex flex-col max-w-xl">
          <CardHeader className="flex-row items-start space-y-0 pb-0">
            <div className="grid gap-1">
              <h2 className="font-bold font-merriweather text-lg">
                Area Chart - User Growth
              </h2>
              <p className="text-sm text-muted-foreground">
                Weekly active users
              </p>
            </div>
          </CardHeader>
          <CardContent className="flex flex-1 justify-center pb-0">
            <ChartContainer
              id={areaId}
              config={chartUsersConfig}
              className="mx-auto aspect-video w-full"
            >
              <AreaChart data={chartUsersData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="hsl(var(--chart-3))"
                  fill="hsl(var(--chart-3))"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="text-muted-foreground leading-none">
              Monitor user growth over time
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
