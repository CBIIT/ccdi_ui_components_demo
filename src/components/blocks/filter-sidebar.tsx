"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
import { Search } from "@/components/ui/search"
import { Icon } from "@/components/ui/icon"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"

// Types for filter categories
export interface FilterCategory {
  id: string
  label: string
  color: string
  isActive?: boolean
  selectedCount?: number
  children?: FilterOption[]
}

export interface FilterOption {
  id: string
  label: string
  count: number
  isSelected?: boolean
}

export interface FilterSidebarProps {
  categories: FilterCategory[]
  selectedFilters: string[]
  onFilterChange: (filterId: string, isSelected: boolean) => void
  onClearAll: () => void
  onSearch: (query: string) => void
  searchPlaceholder?: string
  className?: string
  children?: React.ReactNode
}

// Filter category button component
const FilterCategoryButton: React.FC<{
  category: FilterCategory
  isActive: boolean
  onClick: () => void
}> = ({ category, isActive, onClick }) => {
  const colorClasses = {
    'teal': 'bg-teal-60 hover:bg-teal-70',
    'magenta': 'bg-magenta-60 hover:bg-magenta-70',
    'violet': 'bg-violet-60 hover:bg-violet-70',
    'orange': 'bg-orange-60 hover:bg-orange-70',
    'red': 'bg-red-60 hover:bg-red-70',
    'blue': 'bg-blue-60 hover:bg-blue-70',
    'dark-blue': 'bg-blue-80 hover:bg-blue-90',
    'green': 'bg-green-60 hover:bg-green-70',
  }

  const hrColorClasses = {
    'teal': 'bg-teal-40',
    'magenta': 'bg-magenta-60',
    'violet': 'bg-violet-60',
    'orange': 'bg-orange-60',
    'red': 'bg-red-60',
    'blue': 'bg-blue-60',
    'dark-blue': 'bg-blue-80',
    'green': 'bg-green-60',
  }

  return (
    <div>
      <hr className={cn(
        "h-2 border-0",
        hrColorClasses[category.color as keyof typeof hrColorClasses] || 'bg-gray-60'
      )} />
      <Button
        onClick={onClick}
        variant="outline"
        className={cn(
          "w-full text-left px-4 py-3 font-bold text-black rounded-none border-0",
          "focus:outline focus:outline-4 focus:outline-blue-40",
          'bg-gray-5',
          isActive && "ring-2 ring-white"
        )}
      >
        <div className="flex items-center justify-between">
          <span>{category.label}</span>
          {isActive && (
            <Icon icon="arrow_forward" size="sm" className="size-4" />
          )}
        </div>
        {/* {category.selectedCount && category.selectedCount > 0 && (
          <div className="mt-1 text-sm font-normal">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-40 rounded-full"></div>
              <span>{category.selectedCount} facet(s) selected</span>
            </div>
          </div>
        )} */}
      </Button>
    </div>
  )
}

// Filter option checkbox component
const FilterOptionItem: React.FC<{
  option: FilterOption
  isSelected: boolean
  onChange: (isSelected: boolean) => void
}> = ({ option, isSelected, onChange }) => {
  return (
    <label className="flex items-center gap-3 py-2 cursor-pointer hover:bg-gray-5 px-2 rounded">
      <Checkbox
        checked={isSelected}
        onCheckedChange={onChange}
      />
      <span className="flex-1 text-gray-90">{option.label}</span>
      <span className="text-gray-60 text-sm">({option.count})</span>
    </label>
  )
}


export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  categories,
  selectedFilters,
  onFilterChange,
  onClearAll,
  onSearch,
  searchPlaceholder = "e.g. Sarcoma/Neoplasm",
  className,
  children
}) => {
  const [activeCategory, setActiveCategory] = React.useState<string | null>(null)
  const [searchQuery, setSearchQuery] = React.useState("")

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    onSearch(query)
  }

  const totalSelectedFilters = selectedFilters.length

  return (
    <div className={cn("flex h-screen bg-gray-10", className)}>
      {/* Left Sidebar - Dark Teal Background */}
      <div className="w-80 bg-teal-60 text-white flex flex-col">
        {/* Top Section */}
        <div className="p-4 space-y-4">
          <Button
            variant="outline"
            className="w-full bg-transparent border-white text-white hover:bg-white hover:text-teal-60"
          >
            <Icon icon="help" size="sm" className="size-4 mr-2" />
            Explore the CCDI User Guide
          </Button>
          
          <Button
            variant="outline"
            className="w-full bg-transparent border-white text-white hover:bg-white hover:text-teal-60"
            onClick={onClearAll}
          >
            <Icon icon="remove" size="sm" className="size-4 mr-2" />
            Clear all filtered selections
          </Button>

          <div className="flex items-center gap-2 text-sm">
            <span>Total Filters Selected</span>
            <div className="w-4 h-4 bg-white rounded"></div>
            <span className="font-bold">{totalSelectedFilters}</span>
          </div>
        </div>

        {/* Filter Categories */}
        <div className="flex-1 overflow-y-auto">
          <nav>
            {categories.map((category) => (
              <FilterCategoryButton
                key={category.id}
                category={category}
                isActive={activeCategory === category.id}
                onClick={() => setActiveCategory(
                  activeCategory === category.id ? null : category.id
                )}
              />
            ))}
          </nav>
        </div>
      </div>

      {/* Right Content Area - Light Background */}
      <div className="flex-1 bg-gray-5 overflow-y-auto">
        {activeCategory ? (
          <div className="p-6">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-90 flex items-center gap-2">
                  {categories.find(c => c.id === activeCategory)?.label}
                  <Icon icon="expand_less" size="sm" className="size-5" />
                </h2>
                <Button variant="outline" className="text-blue-60 border-blue-60">
                  VIEW EXPANDED DISPLAY (321)
                </Button>
              </div>

              {/* Search */}
              <Search
                placeholder={searchPlaceholder}
                onSearch={handleSearch}
                className="max-w-md"
                inputProps={{
                  className: "bg-white"
                }}
                iconOnly={true}
              />
            </div>

            {/* Filter Options */}
            {/* <div className="space-y-4">
              {categories
                .find(c => c.id === activeCategory)
                ?.children?.map((option) => (
                  <FilterOptionItem
                    key={option.id}
                    option={option}
                    isSelected={selectedFilters.includes(option.id)}
                    onChange={(isSelected) => onFilterChange(option.id, isSelected)}
                  />
                ))}
            </div> */}

            {/* Collapsible Sections */}
            <div className="mt-8">
              <Accordion type="multiple" variant="borderless">
              <AccordionItem value="diagnosis">
                  <AccordionTrigger>{categories.find(c => c.id === activeCategory)?.label}</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {categories
                        .find(c => c.id === activeCategory)
                        ?.children?.map((option) => (
                          <FilterOptionItem
                            key={option.id}
                            option={option}
                            isSelected={selectedFilters.includes(option.id)}
                            onChange={(isSelected) => onFilterChange(option.id, isSelected)}
                          />
                        ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="diagnosis-anatomic-site">
                  <AccordionTrigger>DIAGNOSIS ANATOMIC SITE</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <FilterOptionItem
                        option={{ id: "site-1", label: "Brain", count: 45 }}
                        isSelected={selectedFilters.includes("site-1")}
                        onChange={(isSelected) => onFilterChange("site-1", isSelected)}
                      />
                      <FilterOptionItem
                        option={{ id: "site-2", label: "Lung", count: 32 }}
                        isSelected={selectedFilters.includes("site-2")}
                        onChange={(isSelected) => onFilterChange("site-2", isSelected)}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="age-at-diagnosis">
                  <AccordionTrigger>AGE AT DIAGNOSIS (DAYS)</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <FilterOptionItem
                        option={{ id: "age-1", label: "0-365 days", count: 123 }}
                        isSelected={selectedFilters.includes("age-1")}
                        onChange={(isSelected) => onFilterChange("age-1", isSelected)}
                      />
                      <FilterOptionItem
                        option={{ id: "age-2", label: "366-1825 days", count: 89 }}
                        isSelected={selectedFilters.includes("age-2")}
                        onChange={(isSelected) => onFilterChange("age-2", isSelected)}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="diagnosis-classification">
                  <AccordionTrigger>DIAGNOSIS CLASSIFICATION SYSTEM</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <FilterOptionItem
                        option={{ id: "class-1", label: "ICCC-3", count: 567 }}
                        isSelected={selectedFilters.includes("class-1")}
                        onChange={(isSelected) => onFilterChange("class-1", isSelected)}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="diagnosis-basis">
                  <AccordionTrigger>DIAGNOSIS BASIS</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <FilterOptionItem
                        option={{ id: "basis-1", label: "Clinical", count: 234 }}
                        isSelected={selectedFilters.includes("basis-1")}
                        onChange={(isSelected) => onFilterChange("basis-1", isSelected)}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="diagnosis-category">
                  <AccordionTrigger>DIAGNOSIS CATEGORY</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <FilterOptionItem
                        option={{ id: "cat-1", label: "Primary", count: 456 }}
                        isSelected={selectedFilters.includes("cat-1")}
                        onChange={(isSelected) => onFilterChange("cat-1", isSelected)}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="disease-phase">
                  <AccordionTrigger>DISEASE PHASE</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <FilterOptionItem
                        option={{ id: "phase-1", label: "Initial", count: 345 }}
                        isSelected={selectedFilters.includes("phase-1")}
                        onChange={(isSelected) => onFilterChange("phase-1", isSelected)}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            
            {/* Show children below filter options if provided */}
            {children && (
              <div className="mt-8 border-t border-gray-20 pt-8">
                {children}
              </div>
            )}
          </div>
        ) : (
          /* No Category Selected State - Show children if provided, otherwise show placeholder */
          children ? (
            children
          ) : (
            <div className="flex items-center justify-center h-full text-gray-60">
              <div className="text-center">
                <Icon icon="bookmark" size="lg" className="size-16 mx-auto mb-4" />
                <p className="text-lg">Select a filter category to begin</p>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  )
}

export default FilterSidebar
