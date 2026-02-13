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
import { TabbedTableComponent } from "@/components/blocks/tabbed-table-component";
import NCIDSNavbar from "@/components/blocks/header";
import { USWDSFooter } from "@/components/blocks/footer";
import { Banner } from "@/components/ui/banner";
import { navItems } from "../header-and-footer/data/header-data";
import { agencyInfo, contactInfo, navigation } from "../header-and-footer/data/footer-data";
import { BackToHomepage } from "@/components/back-to-homepage";

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
    <>
      <Banner />
      <NCIDSNavbar navItems={navItems} />

      <h1 className="sr-only">Complete Demo</h1>

      <div className="h-screen">
        <FilterSidebar
          categories={sampleCategories}
          selectedFilters={selectedFilters}
          onFilterChange={handleFilterChange}
          onClearAll={handleClearAll}
          onSearch={handleSearch}
        >
          {/* Dashboard Content */}
          <div className="px-6 pt-6">
            <BackToHomepage />
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
          </div>

          <hr className="my-10 border-5 border-gray-20" />

          {/* Tabbed Table Content */}
          <TabbedTableComponent />
        </FilterSidebar>
      </div>

      <USWDSFooter agencyInfo={agencyInfo} contactInfo={contactInfo} navigation={navigation} />
    </>
  );
}
