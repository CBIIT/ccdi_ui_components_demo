"use client";

import * as React from "react";
import { FilterSidebar } from "@/components/blocks/filter-sidebar/filter-sidebar";
import { sampleCategories } from "@/components/blocks/filter-sidebar/data";
import { BarChartCard } from "./components/bar-chart-card";
import { LineChartCard } from "./components/line-chart-card";
import { ComposedChartCard } from "./components/composed-chart-card";
import { PieChartCard } from "./components/pie-chart-card";
import { AreaChartCard } from "./components/area-chart-card";
import { HorizontalBarChartCard } from "./components/horizontal-bar-chart-card";

export default function Sidebar() {
  const [selectedFilters, setSelectedFilters] = React.useState<string[]>([]);

  const handleFilterChange = (filterId: string, isSelected: boolean) => {
    setSelectedFilters((prev) =>
      isSelected ? [...prev, filterId] : prev.filter((id) => id !== filterId),
    );
  };

  const handleClearAll = () => {
    setSelectedFilters([]);
  };

  const handleSearch = (query: string) => {
    console.log("Search query:", query);
    // Implement search logic here
  };

  return (
    <div className="h-screen">
      <h1 className="sr-only">Filter Sidebar</h1>
      <FilterSidebar
        categories={sampleCategories}
        selectedFilters={selectedFilters}
        onFilterChange={handleFilterChange}
        onClearAll={handleClearAll}
        onSearch={handleSearch}
      >
        {/* Dashboard Content */}
        <>
          <h1 className="font-bold font-merriweather text-3xl mb-8">
            Dashboard
          </h1>

          {selectedFilters.length > 0 && (
            <div className="mb-6 p-4 bg-blue-5 border border-blue-40 rounded">
              <p className="text-sm text-gray-90">
                <span className="font-bold">{selectedFilters.length}</span>{" "}
                filter(s) active
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
        </>
      </FilterSidebar>
    </div>
  );
}
