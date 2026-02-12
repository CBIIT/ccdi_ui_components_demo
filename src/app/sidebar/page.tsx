"use client";

import * as React from "react";
import { FilterSidebar } from "@/components/blocks/filter-sidebar/filter-sidebar";
import { sampleCategories } from "@/components/blocks/filter-sidebar/data";

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
      />
    </div>
  );
}
