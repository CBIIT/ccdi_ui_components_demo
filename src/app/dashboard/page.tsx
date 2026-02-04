"use client"

import * as React from "react"
import { FilterSidebar } from "@/components/blocks/filter-sidebar"
import { sampleCategories } from "./constants/filter-categories"
import {
  PieChartCard,
  LineChartCard,
  BarChartCard,
  AreaChartCard,
  HorizontalBarChartCard,
  ComposedChartCard,
} from "./components"

export default function DashboardPage() {
  const [selectedFilters, setSelectedFilters] = React.useState<string[]>([])

  const handleFilterChange = (filterId: string, isSelected: boolean) => {
    setSelectedFilters(prev => 
      isSelected 
        ? [...prev, filterId]
        : prev.filter(id => id !== filterId)
    )
    // You can add logic here to filter chart data based on selected filters
  }

  const handleClearAll = () => {
    setSelectedFilters([])
  }

  const handleSearch = (query: string) => {
    console.log("Search query:", query)
    // Implement search logic here
  }

  return (
    <div className="h-screen">
      <FilterSidebar
        categories={sampleCategories}
        selectedFilters={selectedFilters}
        onFilterChange={handleFilterChange}
        onClearAll={handleClearAll}
        onSearch={handleSearch}
        searchPlaceholder="e.g. Sarcoma/Neoplasm"
        className="h-full"
      >
        {/* Dashboard Content */}
        <div className="p-6 overflow-y-auto h-full">
          <h1 className="font-bold font-merriweather text-3xl mb-8">Dashboard</h1>
          
          {selectedFilters.length > 0 && (
            <div className="mb-6 p-4 bg-blue-5 border border-blue-40 rounded">
              <p className="text-sm text-gray-90">
                <span className="font-bold">{selectedFilters.length}</span> filter(s) active
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <PieChartCard />
            <LineChartCard />
            <BarChartCard />
            <AreaChartCard />
            <HorizontalBarChartCard />
            <ComposedChartCard />
          </div>
        </div>
      </FilterSidebar>
    </div>
  )
}
