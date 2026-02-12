"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import type { FilterCategory } from "@/components/blocks/filter-sidebar/filter-sidebar-types";

export interface ActiveFiltersBannerProps {
  /** Selected filter IDs */
  selectedFilters: string[];
  /** Categories to resolve filter IDs to labels */
  categories: FilterCategory[];
  /** Callback when clear filters is clicked */
  onClear?: () => void;
  /** Optional custom class name */
  className?: string;
}

function getFilterLabel(filterId: string, categories: FilterCategory[]): string {
  for (const cat of categories) {
    for (const facet of cat.children ?? []) {
      const option = facet.options?.find((o) => o.id === filterId);
      if (option) return option.label;
    }
  }
  return filterId;
}

/**
 * Banner displayed when filters are active. Uses NCI colors (cerulean)
 * and Button size="sm" per design system. Prints selected filter labels.
 */
export function ActiveFiltersBanner({
  selectedFilters,
  categories,
  onClear,
  className,
}: ActiveFiltersBannerProps) {
  const count = selectedFilters.length;
  if (count === 0) return null;

  const labels = selectedFilters.map((id) => getFilterLabel(id, categories));

  return (
    <div
      className={cn(
        "flex flex-col flex-wrap items-start justify-between gap-3 rounded border-2 border-gray-10 bg-white p-4",
        className
      )}
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-row flex-wrap items-center justify-start gap-2">
        <div className="flex items-center gap-2">
          <Badge
            variant="default"
            className="rounded-sm border-0 bg-teal-50 px-2 py-0.5 text-white hover:bg-teal-70"
          >
            {count}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-2">
          {labels.map((label, i) => (
            <Badge
              key={selectedFilters[i]}
              variant="outline"
              className="rounded-sm border-0 bg-teal-50 px-2 py-1 font-normal text-white hover:bg-teal-70"
            >
              {label}
            </Badge>
          ))}
        </div>
      </div>
      {onClear && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onClear}
        >
          Clear filters
        </Button>
      )}
    </div>
  );
}

export default ActiveFiltersBanner;
