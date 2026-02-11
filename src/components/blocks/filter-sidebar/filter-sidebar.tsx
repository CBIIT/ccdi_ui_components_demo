"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Search } from "@/components/ui/search"
import { Icon } from "@/components/ui/icon"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { NumericRangeFilter, type UnknownOptionValue } from "@/components/blocks/filter-sidebar/numeric-range-filter"
import { FilterCategory, FilterFacet, FilterOptionValue } from "@/components/blocks/filter-sidebar/filter-sidebar-types"

type FilterSidebarProps = {
  categories: FilterCategory[];
  selectedFilters: string[];
  onFilterChange: (filterId: string, isSelected: boolean) => void;
  onClearAll: () => void;
  onSearch: (query: string) => void;
  searchPlaceholder?: string;
  className?: string;
}

const colorToBarClass: Record<string, string> = {
  teal: "bg-teal-40",
  magenta: "bg-magenta-60",
  violet: "bg-violet-60",
  orange: "bg-orange-60",
  red: "bg-red-60",
  blue: "bg-blue-60",
  "dark-blue": "bg-blue-80",
  green: "bg-green-60",
}

// Filter category button component
const FilterCategoryButton: React.FC<{
  category: FilterCategory
  isActive: boolean
  hasSelection: boolean
  onClick: () => void
}> = ({ category, isActive, hasSelection, onClick }) => {
  const barClass = colorToBarClass[category.color] || "bg-gray-60"
  return (
    <Button
      type="button"
      variant="link"
      onClick={onClick}
      className={cn(
        "w-full text-left no-underline text-gray-90 hover:text-gray-90 border-none focus:outline-none",
        "rounded-none !p-0",
        isActive && "bg-white"
      )}
    >
      <div className="w-full bg-gray-5 font-bold uppercase tracking-wide">
        <div className={cn("h-2 w-full", barClass)}></div>
        <div className="flex items-center justify-between gap-3 py-4">
          <span className="flex items-center">
            <span className="px-4 min-h-5 flex items-center justify-center">{category.label}</span>
            {hasSelection ? (
              <span
                aria-hidden="true"
                className="size-2 rounded-full bg-teal-10 ring-1 ring-white/30"
              />
            ) : null}
          </span>
          {isActive ? <Icon icon="arrow_forward" size="sm" className="h-5 w-5" /> : null}
        </div>
      </div>
    </Button>
  )
}

// Filter option checkbox component
const FilterOptionItem: React.FC<{
  option: FilterOptionValue
  isSelected: boolean
  onChange: (isSelected: boolean) => void
}> = ({ option, isSelected, onChange }) => {
  return (
    <Label className="flex items-center gap-3 py-3 cursor-pointer hover:bg-gray-5 text-base leading-normal">
      <Checkbox
        checked={isSelected}
        onCheckedChange={onChange}
      />
      <span className="flex-1 text-gray-90">{option.label}</span>
      <Badge variant="secondary" className="shrink-0 rounded-sm bg-teal-10 px-2 py-0.5 text-sm text-gray-90 hover:bg-teal-10">
        {option.count.toLocaleString()}
      </Badge>
    </Label>
  )
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  categories,
  selectedFilters,
  onFilterChange,
  onClearAll,
  onSearch,
  searchPlaceholder = "e.g. Sarcoma/Neoplasm",
  className
}) => {
  const [activeCategory, setActiveCategory] = React.useState<string | null>(() => {
    return categories[0]?.id ?? null
  })
  const [searchByFacetId, setSearchByFacetId] = React.useState<Record<string, string>>({})
  const [sortModeByFacetId, setSortModeByFacetId] = React.useState<Record<string, "alpha" | "count">>({})

  type AgeRangeState = {
    valueMin: number
    valueMax: number
    unit: string
    unknownValue: UnknownOptionValue
  }
  const [ageRangeByFacetId, setAgeRangeByFacetId] = React.useState<Record<string, AgeRangeState>>({})

  const getInitialAgeRangeState = React.useCallback((facet: FilterFacet): AgeRangeState => {
    const min = facet.ageConfig?.min ?? 0
    const max = facet.ageConfig?.max ?? 16217
    const units = facet.ageConfig?.units ?? [
      { value: "days", label: "DAYS" },
      { value: "years", label: "YEARS" },
    ]
    return {
      valueMin: min,
      valueMax: max,
      unit: units[0]?.value ?? "days",
      unknownValue: "include",
    }
  }, [])

  const getAgeRangeState = React.useCallback((facet: FilterFacet): AgeRangeState => {
    const existing = ageRangeByFacetId[facet.id]
    if (existing) return existing
    return getInitialAgeRangeState(facet)
  }, [ageRangeByFacetId, getInitialAgeRangeState])

  const updateAgeRange = React.useCallback((facet: FilterFacet, patch: Partial<AgeRangeState>) => {
    const facetId = facet.id
    setAgeRangeByFacetId((prev) => {
      const current = prev[facetId] ?? getInitialAgeRangeState(facet)
      return { ...prev, [facetId]: { ...current, ...patch } }
    })
  }, [getInitialAgeRangeState])

  const getSearchForFacet = React.useCallback((facetId: string): string => {
    return searchByFacetId[facetId] ?? ""
  }, [searchByFacetId])

  const getSortModeForFacet = React.useCallback((facetId: string): "alpha" | "count" => {
    return sortModeByFacetId[facetId] ?? "alpha"
  }, [sortModeByFacetId])

  const setSearchForFacet = React.useCallback((facetId: string, query: string) => {
    setSearchByFacetId((prev) => ({ ...prev, [facetId]: query }))
  }, [])

  const setSortModeForFacet = React.useCallback((facetId: string, mode: "alpha" | "count") => {
    setSortModeByFacetId((prev) => ({ ...prev, [facetId]: mode }))
  }, [])

  const getVisibleOptionsForFacet = React.useCallback((facet: FilterFacet): FilterOptionValue[] => {
    const options = facet.options ?? []
    const searchQuery = facet.searchEnabled ? (getSearchForFacet(facet.id).trim().toLowerCase()) : ""
    const filtered = searchQuery
      ? options.filter((o) => o.label.toLowerCase().includes(searchQuery))
      : options.slice()
    const sortMode = facet.sortEnabled ? getSortModeForFacet(facet.id) : "alpha"
    filtered.sort((a, b) => {
      if (sortMode === "count") return b.count - a.count
      return a.label.localeCompare(b.label)
    })
    return filtered
  }, [getSearchForFacet, getSortModeForFacet])

  const handleFacetSearch = (query: string) => {
    onSearch(query)
  }

  const totalSelectedFilters = selectedFilters.length
  const activeCategoryData = React.useMemo(
    () => categories.find((c) => c.id === activeCategory) ?? null,
    [categories, activeCategory]
  )

  const facets = React.useMemo(
    () => activeCategoryData?.children ?? [],
    [activeCategoryData]
  )
  const mainFacet = React.useMemo(
    () => facets.find((f) => f.isActive) ?? facets[0] ?? null,
    [facets]
  )

  const perCategorySelectedCount = React.useMemo(() => {
    const map = new Map<string, number>()
    for (const cat of categories) {
      const optionIds = (cat.children ?? []).flatMap((f) => (f.options ?? []).map((o) => o.id))
      const count = optionIds.filter((id) => selectedFilters.includes(id)).length
      map.set(cat.id, count)
    }
    return map
  }, [categories, selectedFilters])

  return (
    <div className={cn("flex h-screen bg-gray-10", className)}>
      {/* Left rail */}
      <aside className="w-80 bg-teal-60 text-white flex flex-col">
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Button variant="outline-inverse" size="icon" aria-label="Explore the CCDI User Guide">
              <Icon icon="assessment" size="sm" className="h-5 w-5" />
            </Button>
            <span>Explore the CCDI User Guide</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline-inverse" size="icon" aria-label="Notes to User">
              <Icon icon="label" size="sm" className="h-5 w-5" />
            </Button>
            <span>Notes to User</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline-inverse" size="icon" onClick={onClearAll} aria-label="Clear all filtered selections">
              <Icon icon="remove" size="sm" className="h-5 w-5" />
            </Button>
            <span>Clear all filtered selections</span>
          </div>

          <div className="pt-3 border-t border-white/30">
            <div className="flex items-center justify-around text-sm">
              <span>Total Filters Selected:</span>
              <span className="inline-flex min-w-6 items-center justify-center rounded-sm border border-white bg-transparent px-2 py-0.5 font-bold">
                {totalSelectedFilters}
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <nav aria-label="Filter categories" className="divide-y divide-white/10">
            {categories.map((category) => {
              const selectedCount = perCategorySelectedCount.get(category.id) ?? 0
              return (
                <FilterCategoryButton
                  key={category.id}
                  category={category}
                  isActive={activeCategory === category.id}
                  hasSelection={selectedCount > 0}
                  onClick={() => setActiveCategory(category.id)}
                />
              )
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-2 text-sm text-white/80 italic">
            <span aria-hidden="true" className="size-2 rounded-full bg-teal-10" />
            denotes facet(s) selected
          </div>
        </div>
      </aside>

      {/* Right panel */}
      <section className="w-80 bg-gray-5 flex flex-col min-w-0">
        {activeCategoryData ? (
          <>
            <div className="flex items-center justify-end bg-green-cool-5 px-4 py-3">
              <Button
                type="button"
                variant="link"
                className="no-underline text-gray-70 hover:text-gray-90 hover:bg-gray-20 rounded-sm !p-1 focus:outline focus:outline-4 focus:outline-blue-40"
                onClick={() => setActiveCategory(null)}
                aria-label="Close"
              >
                <Icon icon="close" size="sm" className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto bg-green-cool-5 py-1">
              {(activeCategoryData.searchEnabled || activeCategoryData.uploadEnabled) && (
                <div className="bg-white space-y-2 pt-7 pb-3 px-3">
                  {activeCategoryData.searchEnabled && (
                    <Search
                      placeholder={activeCategoryData.searchPlaceholder ?? searchPlaceholder}
                      onSearch={handleFacetSearch}
                      iconOnly={true}
                      className="max-w-none border-gray-40"
                      inputProps={{ className: "max-w-none border-gray-40 bg-white" }}
                      buttonProps={{
                        className:
                          "bg-violet-60 hover:bg-violet-70 active:bg-violet-80",
                      }}
                    />
                  )}
                  {activeCategoryData.uploadEnabled && (
                    <Button variant="secondary" size="sm" className="w-full flex items-center justify-between bg-violet-60 hover:bg-violet-70 active:bg-violet-80">
                      <span>{activeCategoryData.uploadLabel}</span>
                      <Icon icon="file_upload" size="sm" className="inline-flex min-w-6 items-center justify-center rounded-sm border border-white bg-transparent" />
                    </Button>
                  )}
                </div>
              )}

              <Accordion
                key={activeCategoryData.id}
                type="multiple"
                variant="borderless"
                defaultValue={mainFacet ? [mainFacet.id] : []}
                className="bg-white"
              >
                {facets.map((facet) => {
                  const visibleOptions = getVisibleOptionsForFacet(facet)

                  return (
                    <AccordionItem key={facet.id} value={facet.id} className="border-b border-gray-20">
                      <AccordionTrigger openIcon="expand_less" closedIcon="expand_more" className="bg-white">
                        {facet.label}
                      </AccordionTrigger>
                      <AccordionContent className="py-0 px-0">
                        <div className="border-t border-gray-20">
                          {(
                            <div className="px-5 py-4 space-y-3">
                              {facet.searchEnabled && (
                                <Search
                                  placeholder={facet.searchPlaceholder ?? searchPlaceholder}
                                  onSearch={(query) => setSearchForFacet(facet.id, query)}
                                  iconOnly={true}
                                  className="max-w-none border-gray-40"
                                  inputProps={{ className: "max-w-none border-gray-40 bg-white" }}
                                  buttonProps={{
                                    className:
                                      "bg-teal-50 hover:bg-teal-70 active:bg-teal-80",
                                  }}
                                />
                              )}

                              {facet.expandedDisplayEnabled && (
                                <Button
                                  type="button"
                                  variant="secondary"
                                  size="sm"
                                  className="w-full flex items-center justify-between"
                                >
                                  <span>VIEW EXPANDED DISPLAY</span>
                                  <Badge
                                    variant="secondary"
                                    className="min-w-10 justify-center rounded-sm bg-teal-60 px-2 py-0.5 text-sm text-white hover:bg-teal-80"
                                  >
                                    {(facet.expandedCount ?? visibleOptions.length).toLocaleString()}
                                  </Badge>
                                </Button>
                              )}

                              {facet.sortEnabled && (
                                <div className="flex items-center justify-between gap-2">
                                  <Icon icon="sort_arrow" size="sm" className="h-4 w-4" />
                                  <Button
                                    type="button"
                                    variant="link"
                                    size="sm"
                                    className={cn(
                                      "no-underline !p-0 inline-flex items-center gap-2 text-gray-60 hover:text-gray-90",
                                      getSortModeForFacet(facet.id) === "alpha" && "text-gray-90 font-semibold"
                                    )}
                                    onClick={() => setSortModeForFacet(facet.id, "alpha")}
                                  >
                                    Sort Alphabetically
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="link"
                                    size="sm"
                                    className={cn(
                                      "no-underline !p-0 inline-flex items-center gap-2 text-gray-60 hover:text-gray-90",
                                      getSortModeForFacet(facet.id) === "count" && "text-gray-90 font-semibold"
                                    )}
                                    onClick={() => setSortModeForFacet(facet.id, "count")}
                                  >
                                    Sort by Count
                                  </Button>
                                </div>
                              )}

                              {facet.ageEnabled ? (
                                (() => {
                                  const min = facet.ageConfig?.min ?? 0
                                  const max = facet.ageConfig?.max ?? 16217
                                  const units = facet.ageConfig?.units ?? [
                                    { value: "days", label: "DAYS" },
                                    { value: "years", label: "YEARS" },
                                  ]
                                  const ageState = getAgeRangeState(facet)
                                  return (
                                    <NumericRangeFilter
                                      min={min}
                                      max={max}
                                      valueMin={ageState.valueMin}
                                      valueMax={ageState.valueMax}
                                      onRangeChange={(valueMin, valueMax) =>
                                        updateAgeRange(facet, { valueMin, valueMax })
                                      }
                                      units={units}
                                      unit={ageState.unit}
                                      onUnitChange={(unit) => updateAgeRange(facet, { unit })}
                                      unknownLabel="UNKNOWN AGES:"
                                      unknownValue={ageState.unknownValue}
                                      onUnknownChange={(unknownValue) =>
                                        updateAgeRange(facet, { unknownValue })
                                      }
                                      onReset={() =>
                                        setAgeRangeByFacetId((prev) => {
                                          const { [facet.id]: _, ...rest } = prev
                                          return rest
                                        })
                                      }
                                      formatLabel={(n) => n.toLocaleString()}
                                      accentColor={activeCategoryData?.color}
                                    />
                                  )
                                })()
                              ) : (
                                <div className="border-t border-gray-20 divide-y divide-gray-20">
                                  {visibleOptions.map((option) => (
                                    <FilterOptionItem
                                      key={option.id}
                                      option={option}
                                      isSelected={selectedFilters.includes(option.id)}
                                      onChange={(isSelected) => onFilterChange(option.id, isSelected)}
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )
                })}
              </Accordion>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-60">
            <div className="text-center">
              <Icon icon="bookmark" size="lg" className="size-16 mx-auto mb-4" />
              <p className="text-lg">Select a filter category to begin</p>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

export default FilterSidebar
