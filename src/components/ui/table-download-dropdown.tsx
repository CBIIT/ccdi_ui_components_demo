"use client";

import * as React from "react";
import { FileDownloadIcon, ArrowDropDownIcon } from "@/components/ui/icon";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { DisplayedColumnConfig } from "@/components/ui/displayed-columns-dropdown";

function escapeCsvCell(value: unknown): string {
  const str = value == null ? "" : String(value);
  if (/[",\r\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function tableToCsv(
  columns: DisplayedColumnConfig[],
  visibleColumns: Set<string>,
  rows: Record<string, unknown>[]
): string {
  const visible = columns.filter((c) => visibleColumns.has(c.id));
  const header = visible.map((c) => escapeCsvCell(c.label)).join(",");
  const dataRows = rows.map((row) =>
    visible.map((c) => escapeCsvCell(row[c.id])).join(",")
  );
  return [header, ...dataRows].join("\r\n");
}

function tableToJson(
  columns: DisplayedColumnConfig[],
  visibleColumns: Set<string>,
  rows: Record<string, unknown>[]
): string {
  const visible = columns.filter((c) => visibleColumns.has(c.id));
  const arr = rows.map((row) => {
    const obj: Record<string, unknown> = {};
    for (const c of visible) {
      obj[c.id] = row[c.id];
    }
    return obj;
  });
  return JSON.stringify(arr, null, 2);
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export interface TableDownloadDropdownProps {
  /** Column definitions (id + label), same as Displayed Columns. */
  columns: DisplayedColumnConfig[];
  /** Currently visible column ids. */
  visibleColumns: Set<string>;
  /** Rows to export (current page as shown in the table). Each row is keyed by column id. */
  rows: Record<string, unknown>[];
  /** Filename prefix, e.g. "participants", "studies". Default "table". */
  filenamePrefix?: string;
  /** Optional id suffix for aria when multiple on page. */
  idSuffix?: string;
  /** Side to open the dropdown. Defaults to "bottom", use "top" for bottom pagination */
  side?: "top" | "bottom";
  className?: string;
}

export function TableDownloadDropdown({
  columns,
  visibleColumns,
  rows,
  filenamePrefix = "table",
  idSuffix = "",
  side = "bottom",
  className,
}: TableDownloadDropdownProps) {
  const handleCsv = React.useCallback(() => {
    const csv = tableToCsv(columns, visibleColumns, rows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    downloadBlob(blob, `${filenamePrefix}.csv`);
  }, [columns, visibleColumns, rows, filenamePrefix]);

  const handleJson = React.useCallback(() => {
    const json = tableToJson(columns, visibleColumns, rows);
    const blob = new Blob([json], { type: "application/json;charset=utf-8;" });
    downloadBlob(blob, `${filenamePrefix}.json`);
  }, [columns, visibleColumns, rows, filenamePrefix]);

  return (
    <div className={cn("relative inline-block", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger
          id={idSuffix ? `table-download-trigger${idSuffix}` : undefined}
          className={cn(
            "inline-flex items-center gap-1 rounded border border-blue-60v bg-white px-3 py-2",
            "font-public-sans text-base text-gray-90",
            "hover:bg-gray-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-60v focus-visible:ring-offset-2"
          )}
          aria-label="Download table"
        >
          <FileDownloadIcon size="sm" aria-hidden />
          <ArrowDropDownIcon size="sm" aria-hidden />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side={side} className="min-w-[8rem] p-1" sideOffset={4}>
          <DropdownMenuItem onClick={handleCsv} className="text-blue-60v">
            CSV
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleJson} className="text-blue-60v">
            JSON
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
