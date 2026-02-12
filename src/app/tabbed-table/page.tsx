"use client"

import { TabbedTableComponent } from "@/components/blocks/tabbed-table-component"

export default function TabbedTablePage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Tabbed Table Component Demo</h1>
      <p className="text-gray-700 mb-6">
        This component demonstrates how USWDS components from the uswds-demo repository 
        can be easily imported and used in other projects. It includes sortable tables 
        with pagination, column visibility controls, and data export features.
      </p>
      <TabbedTableComponent />
    </div>
  )
}
