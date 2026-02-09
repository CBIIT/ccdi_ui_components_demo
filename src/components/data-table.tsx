"use client";

/**
 * Config-driven DataTable: one component for any table. Define columns + data;
 * no new component file needed.
 *
 * @example
 * const columns: DataTableColumn<MyRow>[] = [
 *   { id: "name", label: "Name", fixed: true },
 *   { id: "count", label: "Count", numeric: true },
 *   { id: "date", label: "Date", render: (v) => formatDate(v) },
 * ];
 * <DataTable columns={columns} data={rows} getRowId={(r) => r.id} filenamePrefix="my-table" />
 */

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Select } from "@/components/ui/select";
import { ArrowUpwardIcon, ArrowDownwardIcon, NavigateBeforeIcon, NavigateNextIcon } from "@/components/ui/icon";
import { DisplayedColumnsDropdown, type DisplayedColumnConfig } from "@/components/ui/displayed-columns-dropdown";
import { TableDownloadDropdown } from "@/components/ui/table-download-dropdown";

export const PAGE_SIZE_OPTIONS = [50, 100] as const;
export type PageSizeOption = (typeof PAGE_SIZE_OPTIONS)[number];
export type SortDirection = "asc" | "desc" | null;

/** Column definition for DataTable. Extends DisplayedColumnConfig with sort and render options. */
export interface DataTableColumn<TRow = Record<string, unknown>> extends DisplayedColumnConfig {
  /** Use numeric comparison when sorting. Default false. */
  numeric?: boolean;
  /** Whether this column is sortable. Default true. */
  sortable?: boolean;
  /** Optional header label override (e.g. with units). */
  headerLabel?: string | React.ReactNode;
  /** Min width class, e.g. "min-w-[120px]". */
  minWidth?: string;
  /** Get value from row for sort/export. Default: row[id]. */
  accessor?: (row: TRow) => unknown;
  /** Custom cell render. Default: String(value). */
  render?: (value: unknown, row: TRow) => React.ReactNode;
}

export interface DataTableProps<TRow> {
  /** Column definitions: id, label, fixed, optional sortable, numeric, accessor, render. */
  columns: DataTableColumn<TRow>[];
  data: TRow[];
  /** Returns unique id for selection and keys. */
  getRowId: (row: TRow) => string;
  /** Filename prefix for CSV/JSON download (e.g. "participants"). Default "table". */
  filenamePrefix?: string;
  onSelectionChange?: (selectedIds: string[]) => void;
  sortColumn?: string | null;
  sortDirection?: SortDirection;
  onSortChange?: (column: string | null, direction: SortDirection) => void;
  pageSize?: PageSizeOption;
  onPageSizeChange?: (pageSize: PageSizeOption) => void;
  /** Optional suffix for pagination/aria ids when multiple tables on page. */
  idSuffix?: string;
  className?: string;
}

const defaultCellClass = "font-public-sans text-gray-90 border-gray-30 border-b border-l-0 border-r-0 border-t-0";

export function DataTable<TRow>({
  columns,
  data,
  getRowId,
  filenamePrefix = "table",
  onSelectionChange,
  sortColumn: controlledSortColumn,
  sortDirection: controlledSortDirection,
  onSortChange,
  pageSize: controlledPageSize,
  onPageSizeChange,
  idSuffix = "",
  className,
}: DataTableProps<TRow>) {
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [internalSortColumn, setInternalSortColumn] = React.useState<string | null>(null);
  const [internalSortDirection, setInternalSortDirection] = React.useState<SortDirection>(null);
  const [internalPageSize, setInternalPageSize] = React.useState<PageSizeOption>(50);
  const [page, setPage] = React.useState(1);
  const [visibleColumns, setVisibleColumns] = React.useState<Set<string>>(() =>
    new Set(columns.map((c) => c.id))
  );

  const isControlled = controlledSortColumn !== undefined || controlledSortDirection !== undefined;
  const sortColumn = isControlled ? (controlledSortColumn ?? null) : internalSortColumn;
  const sortDirection = isControlled ? (controlledSortDirection ?? null) : internalSortDirection;
  const pageSize = controlledPageSize ?? internalPageSize;

  React.useEffect(() => {
    setPage(1);
  }, [pageSize, data.length]);

  const getValue = React.useCallback(
    (row: TRow, col: DataTableColumn<TRow>): unknown =>
      col.accessor ? col.accessor(row) : (row as Record<string, unknown>)[col.id],
    []
  );

  const handleSort = React.useCallback(
    (columnId: string) => {
      const col = columns.find((c) => c.id === columnId);
      if (col?.sortable === false) return;

      let nextDirection: SortDirection;
      if (sortColumn === columnId) {
        if (sortDirection === null) nextDirection = "asc";
        else if (sortDirection === "asc") nextDirection = "desc";
        else nextDirection = null;
      } else {
        nextDirection = "asc";
      }
      const nextColumn = nextDirection === null ? null : columnId;
      if (isControlled) {
        onSortChange?.(nextColumn, nextDirection);
      } else {
        setInternalSortColumn(nextColumn);
        setInternalSortDirection(nextDirection);
      }
    },
    [columns, isControlled, onSortChange, sortColumn, sortDirection]
  );

  const sortedData = React.useMemo(() => {
    if (!sortColumn || !sortDirection) return data;
    const col = columns.find((c) => c.id === sortColumn);
    if (!col || col.sortable === false) return data;

    const numeric = col.numeric === true;
    const sorted = [...data].sort((a, b) => {
      const aVal = getValue(a, col);
      const bVal = getValue(b, col);
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      if (numeric) {
        const aNum = Number(aVal);
        const bNum = Number(bVal);
        const cmp = aNum - bNum;
        return sortDirection === "asc" ? cmp : -cmp;
      }
      const cmp = String(aVal).localeCompare(String(bVal), undefined, {
        numeric: true,
        sensitivity: "base",
      });
      return sortDirection === "asc" ? cmp : -cmp;
    });
    return sorted;
  }, [data, columns, sortColumn, sortDirection, getValue]);

  const totalRows = sortedData.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
  const clampedPage = Math.min(Math.max(1, page), totalPages);
  const startRow = (clampedPage - 1) * pageSize;
  const endRow = Math.min(startRow + pageSize, totalRows);
  const paginatedData = sortedData.slice(startRow, endRow);

  const allSelected =
    paginatedData.length > 0 && paginatedData.every((row) => selectedIds.has(getRowId(row)));
  const someSelected = selectedIds.size > 0;

  const handleSelectRow = React.useCallback(
    (rowId: string, checked: boolean) => {
      const next = new Set(selectedIds);
      if (checked) next.add(rowId);
      else next.delete(rowId);
      setSelectedIds(next);
      onSelectionChange?.(Array.from(next));
    },
    [selectedIds, onSelectionChange]
  );

  const handleSelectAll = React.useCallback(
    (checked: boolean) => {
      const pageIds = paginatedData.map(getRowId);
      const next = new Set(selectedIds);
      if (checked) pageIds.forEach((id) => next.add(id));
      else pageIds.forEach((id) => next.delete(id));
      setSelectedIds(next);
      onSelectionChange?.(Array.from(next));
    },
    [paginatedData, selectedIds, getRowId, onSelectionChange]
  );

  const handlePageSizeChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = Number(e.target.value) as PageSizeOption;
      if (PAGE_SIZE_OPTIONS.includes(value)) {
        if (controlledPageSize === undefined) setInternalPageSize(value);
        onPageSizeChange?.(value);
      }
    },
    [controlledPageSize, onPageSizeChange]
  );

  const displayColumnConfig: DisplayedColumnConfig[] = columns.map((c) => ({
    id: c.id,
    label: c.label,
    fixed: c.fixed,
  }));

  const exportRows: Record<string, unknown>[] = paginatedData.map((row) => {
    const obj: Record<string, unknown> = {};
    columns.forEach((col) => {
      if (visibleColumns.has(col.id)) obj[col.id] = getValue(row, col);
    });
    return obj;
  });

  const renderPaginationPanel = (panelSuffix: string) => (
    <div className="flex flex-wrap items-center justify-end gap-4 font-public-sans text-base text-gray-90">
      <button
        type="button"
        className="px-4 py-2 bg-[#3d4551] text-white font-public-sans font-normal rounded hover:bg-[#2d3441] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-60v focus-visible:ring-offset-2"
        onClick={() => {
          // Sample button action - customize as needed
          console.log('Sample button clicked');
        }}
        aria-label="Sample action button"
      >
        Sample
      </button>
      <label htmlFor={`data-table-page-size${idSuffix}${panelSuffix}`} className="text-gray-90">
        Results per Page:
      </label>
      <Select
        id={`data-table-page-size${idSuffix}${panelSuffix}`}
        value={pageSize}
        onChange={handlePageSizeChange}
        aria-label="Results per page"
        compact
        className="w-auto min-w-[3.5rem]"
      >
        {PAGE_SIZE_OPTIONS.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </Select>
      <span className="text-gray-90">
        {totalRows === 0 ? "0-0 of 0" : `${startRow + 1}-${endRow} of ${totalRows.toLocaleString()}`}
      </span>
      <div className="flex items-center gap-0">
        <button
          type="button"
          onClick={() => clampedPage > 1 && setPage(clampedPage - 1)}
          disabled={clampedPage <= 1}
          aria-label="Previous page"
          className={cn(
            "p-2 inline-flex items-center justify-center text-gray-90",
            "hover:text-blue-60v focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-60v focus-visible:ring-inset",
            clampedPage <= 1 && "text-gray-50 cursor-not-allowed opacity-60"
          )}
        >
          <NavigateBeforeIcon size="sm" aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => clampedPage < totalPages && setPage(clampedPage + 1)}
          disabled={clampedPage >= totalPages}
          aria-label="Next page"
          className={cn(
            "p-2 inline-flex items-center justify-center text-gray-90",
            "hover:text-blue-60v focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-60v focus-visible:ring-inset",
            clampedPage >= totalPages && "text-gray-50 cursor-not-allowed opacity-60"
          )}
        >
          <NavigateNextIcon size="sm" aria-hidden />
        </button>
      </div>
      <DisplayedColumnsDropdown
        idSuffix={idSuffix}
        columns={displayColumnConfig}
        visibleColumns={visibleColumns}
        onVisibleChange={setVisibleColumns}
        side={panelSuffix === "-bottom" ? "top" : "bottom"}
      />
      <TableDownloadDropdown
        idSuffix={idSuffix}
        columns={displayColumnConfig}
        visibleColumns={visibleColumns}
        rows={exportRows}
        filenamePrefix={filenamePrefix}
        side={panelSuffix === "-bottom" ? "top" : "bottom"}
      />
    </div>
  );

  const visibleCols = columns.filter((c) => visibleColumns.has(c.id));

  return (
    <div className={cn("w-full", className)}>
      <div className="pb-3 mb-0 border-b border-gray-30">
        {renderPaginationPanel("")}
      </div>
      <div className="overflow-auto">
        <Table>
          <TableHeader className="[&_tr_th]:bg-gray-10 [&_tr_th]:border-gray-30 [&_tr_th]:border-b">
            <TableRow className="border-0 hover:bg-transparent">
              <TableHead className="w-[52px] border-gray-30 border-b border-l-0 border-r-0 border-t-0 pr-2">
                <Checkbox
                  checked={allSelected}
                  aria-checked={allSelected ? true : someSelected ? "mixed" : false}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all rows"
                />
              </TableHead>
              {visibleCols.map((col) => {
                const sortable = col.sortable !== false;
                const isActive = sortColumn === col.id;
                const label = col.headerLabel ?? col.label;
                const labelText = typeof label === "string" ? label : col.label;

                return (
                  <TableHead
                    key={col.id}
                    className={cn(
                      "border-gray-30 border-b border-l-0 border-r-0 border-t-0",
                      col.minWidth ?? "min-w-[100px]"
                    )}
                  >
                    {sortable ? (
                      <button
                        type="button"
                        onClick={() => handleSort(col.id)}
                        className={cn(
                          "inline-flex gap-1 font-public-sans text-left text-gray-90 hover:text-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-40 focus:ring-offset-1",
                          typeof label !== "string" ? "items-start" : "items-center"
                        )}
                        aria-label={`Sort by ${labelText}${isActive ? ` (${sortDirection === "asc" ? "ascending" : "descending"})` : ""}`}
                      >
                        <span className={cn("flex", typeof label !== "string" ? "flex-col items-start" : "")}>
                          {label}
                        </span>
                        {isActive && sortDirection === "asc" && (
                          <ArrowUpwardIcon size="sm" className="shrink-0" aria-hidden />
                        )}
                        {isActive && sortDirection === "desc" && (
                          <ArrowDownwardIcon size="sm" className="shrink-0" aria-hidden />
                        )}
                      </button>
                    ) : (
                      <span className="font-public-sans text-gray-90">{label}</span>
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody striped className="[&_tr_td]:border-gray-30 [&_tr_td]:border-b [&_tr_td]:border-l-0 [&_tr_td]:border-r-0">
            {paginatedData.map((row) => {
              const rowId = getRowId(row);
              return (
                <TableRow key={rowId} className="border-0 hover:bg-gray-5/50">
                  <TableCell className="w-[52px] border-gray-30 border-b border-l-0 border-r-0 border-t-0 pr-2">
                    <Checkbox
                      checked={selectedIds.has(rowId)}
                      onCheckedChange={(checked) => handleSelectRow(rowId, !!checked)}
                      aria-label={`Select row ${rowId}`}
                    />
                  </TableCell>
                  {visibleCols.map((col) => {
                    const value = getValue(row, col);
                    const content = col.render ? col.render(value, row) : (value == null ? "" : String(value));
                    return (
                      <TableCell
                        key={col.id}
                        className={cn(defaultCellClass, col.minWidth ?? "", "whitespace-normal")}
                      >
                        {content}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <div className="pt-3 mt-0 border-t border-gray-30">
        {renderPaginationPanel("-bottom")}
      </div>
    </div>
  );
}
