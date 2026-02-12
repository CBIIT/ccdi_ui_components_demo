"use client";

import * as React from "react";
import { FilterSidebar } from "@/components/blocks/filter-sidebar/filter-sidebar";
import { ActiveFiltersBanner } from "@/components/blocks/active-filters-banner";
import { sampleCategories } from "@/components/blocks/filter-sidebar/data";
import { BarChartCard } from "../charts/components/bar-chart-card";
import { LineChartCard } from "../charts/components/line-chart-card";
import { ComposedChartCard } from "../charts/components/composed-chart-card";
import { PieChartCard } from "../charts/components/pie-chart-card";
import { AreaChartCard } from "../charts/components/area-chart-card";
import { HorizontalBarChartCard } from "../charts/components/horizontal-bar-chart-card";

export default function CompleteDemoPage() {
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

          <ActiveFiltersBanner
            selectedFilters={selectedFilters}
            categories={sampleCategories}
            onClear={handleClearAll}
            className="mb-6"
          />

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
