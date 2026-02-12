import type { ChartConfig } from "@/components/charts/chart"

// Pie Chart Data & Config
export const chartBrowserData = [
  { browser: "Chrome", visitors: 275, fill: "var(--color-blue-60v)" },
  { browser: "Safari", visitors: 200, fill: "var(--color-cyan-30v)" },
  { browser: "Firefox", visitors: 187, fill: "var(--color-orange-40v)" },
  { browser: "Edge", visitors: 173, fill: "var(--color-green-cool-40v)" },
  { browser: "Other", visitors: 90, fill: "var(--color-gray-30)" },
]

export const chartBrowserConfig: ChartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "var(--color-blue-60v)",
  },
  safari: {
    label: "Safari",
    color: "var(--color-cyan-30v)",
  },
  firefox: {
    label: "Firefox",
    color: "var(--color-orange-40v)",
  },
  edge: {
    label: "Edge",
    color: "var(--color-green-cool-40v)",
  },
  other: {
    label: "Other",
    color: "var(--color-gray-30)",
  },
}

// Line Chart Data & Config
export const chartSalesData = [
  { month: "Jan", sales: 186 },
  { month: "Feb", sales: 305 },
  { month: "Mar", sales: 237 },
  { month: "Apr", sales: 273 },
  { month: "May", sales: 209 },
  { month: "Jun", sales: 214 },
]

export const chartSalesConfig: ChartConfig = {
  sales: {
    label: "Sales",
    color: "var(--color-blue-60v)",
  },
}

// Bar Chart Data & Config
export const chartRevenueData = [
  { product: "Product A", revenue: 1200 },
  { product: "Product B", revenue: 1900 },
  { product: "Product C", revenue: 3000 },
  { product: "Product D", revenue: 2100 },
  { product: "Product E", revenue: 1800 },
]

export const chartRevenueConfig: ChartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--color-cyan-30v)",
  },
}

// Area Chart Data & Config
export const chartUsersData = [
  { week: "Week 1", users: 400 },
  { week: "Week 2", users: 300 },
  { week: "Week 3", users: 500 },
  { week: "Week 4", users: 450 },
  { week: "Week 5", users: 600 },
  { week: "Week 6", users: 550 },
]

export const chartUsersConfig: ChartConfig = {
  users: {
    label: "Active Users",
    color: "var(--color-orange-40v)",
  },
}

// Horizontal Bar Chart Data & Config
export const chartPerformanceData = [
  { region: "North", performance: 85 },
  { region: "South", performance: 92 },
  { region: "East", performance: 78 },
  { region: "West", performance: 88 },
  { region: "Central", performance: 95 },
]

export const chartPerformanceConfig: ChartConfig = {
  performance: {
    label: "Performance Score",
    color: "var(--color-green-cool-40v)",
  },
}

// Composed Chart Data & Config (Bar + Line)
export const chartMetricsData = [
  { period: "Q1", revenue: 1200, profit: 300 },
  { period: "Q2", revenue: 1900, profit: 450 },
  { period: "Q3", revenue: 3000, profit: 600 },
  { period: "Q4", revenue: 2100, profit: 550 },
]

export const chartMetricsConfig: ChartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--color-blue-60v)",
  },
  profit: {
    label: "Profit",
    color: "var(--color-cyan-30v)",
  },
}
