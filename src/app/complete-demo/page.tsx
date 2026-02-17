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
import { Icon } from "@/components/ui/icon";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
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

      {/* Statistics banner */}
      <section
        className="bg-teal-30"
        aria-label="Program statistics"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: "topic" as const,
                value: 40,
                label: "Studies",
              },
              {
                icon: "people" as const,
                value: 59795,
                label: "Participants",
              },
              {
                icon: "science" as const,
                value: 68140,
                label: "Samples",
              },
              {
                icon: "folder_open" as const,
                value: 1238181,
                label: "Files",
              },
            ].map((stat, index) => {
              const showHorizontalBelowMobileOnly = index < 3 && index !== 1;
              const showHorizontalBelowSm = index === 1;
              const showVerticalRightLgOnly = index === 1;

              return (
                <div
                  key={stat.label}
                  className="flex flex-col min-w-0"
                >
                  <div className="flex flex-1 min-w-0 items-center justify-center gap-3 px-4 py-4 sm:gap-4 sm:px-5 sm:py-4 lg:py-3">
                    <div className="flex flex-1 min-w-0 items-center justify-center gap-3 sm:gap-4">
                      <Icon
                        icon={stat.icon}
                        size="lg"
                        className="h-8 w-8 shrink-0 text-teal-80 sm:h-9 sm:w-9 lg:h-10 lg:w-10"
                      />
                      <div className="flex flex-col items-start">
                        <span className="text-xl font-bold tabular-nums text-teal-70 sm:text-2xl">
                          {stat.value.toLocaleString()}
                        </span>
                        <Label className="text-xs font-normal uppercase tracking-wide text-teal-80 cursor-default">
                          {stat.label}
                        </Label>
                      </div>
                    </div>
                    {index < 3 && (
                      <Separator
                        orientation="vertical"
                        className={`h-auto min-h-[3rem] self-center border-teal-70/50 ${
                          showVerticalRightLgOnly ? "hidden lg:flex" : "hidden sm:flex"
                        }`}
                      />
                    )}
                  </div>
                  {index < 3 && (
                    <Separator
                      orientation="horizontal"
                      className={`w-full shrink-0 border-teal-70/50 ${
                        showHorizontalBelowMobileOnly
                          ? "flex lg:hidden"
                          : showHorizontalBelowSm
                            ? "flex lg:hidden"
                            : "hidden"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="h-screen max-w-[1800px] mx-auto border-l-1 border-r-1 border-gray-90">
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
