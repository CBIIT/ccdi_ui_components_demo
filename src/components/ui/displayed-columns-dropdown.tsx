"use client";

import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { GridViewIcon, ArrowDropDownIcon, CloseIcon } from "@/components/ui/icon";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  useDropdownMenu,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export interface DisplayedColumnConfig {
  id: string;
  label: string;
  fixed?: boolean;
}

function DisplayedColumnsDropdownHeader() {
  const { setIsOpen } = useDropdownMenu();
  return (
    <div className="border-b border-gray-30 px-3 py-2 flex items-center justify-between">
      <span className="font-public-sans font-bold text-gray-90">Displayed Columns</span>
      <button
        type="button"
        onClick={() => setIsOpen(false)}
        aria-label="Close"
        className="p-1 text-gray-70 hover:text-gray-90 focus:outline focus:ring-2 focus:ring-blue-40 rounded"
      >
        <CloseIcon size="sm" aria-hidden />
      </button>
    </div>
  );
}

export interface DisplayedColumnsDropdownProps {
  columns: DisplayedColumnConfig[];
  visibleColumns: Set<string>;
  onVisibleChange: (next: Set<string>) => void;
  /** Optional id suffix for aria when multiple on page */
  idSuffix?: string;
  /** Side to open the dropdown. Defaults to "bottom", use "top" for bottom pagination */
  side?: "top" | "bottom";
}

export function DisplayedColumnsDropdown({
  columns,
  visibleColumns,
  onVisibleChange,
  idSuffix = "",
  side = "bottom",
}: DisplayedColumnsDropdownProps) {
  const toggleableColumns = columns.filter((c) => !c.fixed);
  const allToggleableVisible =
    toggleableColumns.length > 0 && toggleableColumns.every((c) => visibleColumns.has(c.id));

  const handleColumnVisibility = (columnId: string, checked: boolean) => {
    if (columns.some((c) => c.id === columnId && c.fixed)) return;
    const next = new Set(visibleColumns);
    if (checked) next.add(columnId);
    else next.delete(columnId);
    onVisibleChange(next);
  };

  const handleSelectAll = (checked: boolean) => {
    const next = new Set(visibleColumns);
    toggleableColumns.forEach((c) => (checked ? next.add(c.id) : next.delete(c.id)));
    onVisibleChange(next);
  };

  return (
    <div className="relative inline-block">
      <DropdownMenu>
        <DropdownMenuTrigger
          id={idSuffix ? `displayed-columns-trigger${idSuffix}` : undefined}
          className={cn(
            "inline-flex items-center gap-1 rounded border border-blue-60v bg-white px-3 py-2",
            "font-public-sans text-base text-gray-90",
            "hover:bg-gray-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-60v focus-visible:ring-offset-2"
          )}
          aria-label="Displayed columns"
        >
          <GridViewIcon size="sm" aria-hidden />
          <ArrowDropDownIcon size="sm" aria-hidden />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side={side} className="min-w-[240px] p-0" sideOffset={4}>
          <DisplayedColumnsDropdownHeader />
          <div className="max-h-[min(60vh,400px)] overflow-y-auto py-1">
            {columns.map((col) => (
              <label
                key={col.id}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 cursor-pointer font-public-sans text-gray-90",
                  col.fixed && "opacity-60 cursor-default pointer-events-none"
                )}
              >
                <Checkbox
                  checked={visibleColumns.has(col.id)}
                  onCheckedChange={(checked) => !col.fixed && handleColumnVisibility(col.id, !!checked)}
                  disabled={col.fixed}
                  aria-label={col.label}
                  aria-disabled={col.fixed}
                />
                <span className={col.fixed ? "text-gray-60" : ""}>{col.label}</span>
              </label>
            ))}
            <div className="border-t border-gray-30 mt-1 pt-1">
              <label className="flex items-center gap-2 px-3 py-2 cursor-pointer font-public-sans text-gray-90">
                <Checkbox
                  checked={allToggleableVisible}
                  onCheckedChange={(checked) => handleSelectAll(!!checked)}
                  aria-label="Select all"
                />
                <span>Select All</span>
              </label>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
