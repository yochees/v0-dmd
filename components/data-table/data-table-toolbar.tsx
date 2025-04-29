"use client"

import { useState } from "react"
import { Cross2Icon } from "@radix-ui/react-icons"
import type { Table } from "@tanstack/react-table"
import { SlidersHorizontal, RotateCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "./data-table-view-options"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import { AdvancedFilter } from "./advanced-filter"
import { setLocalStorageItem } from "@/lib/local-storage"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

// Default sorting state - sort by title in ascending order
const defaultSorting = [
  {
    id: "title",
    desc: false,
  },
]

export function DataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false)

  const resetTableState = () => {
    // Reset filters and visibility
    table.resetColumnFilters()
    table.resetColumnVisibility()
    table.resetRowSelection()

    // Set default sorting (title ascending)
    table.setSorting(defaultSorting)

    // Reset pagination
    table.setPageIndex(0)
    table.setPageSize(10)

    // Clear localStorage with default values
    setLocalStorageItem(
      "data-management-table-state",
      JSON.stringify({
        sorting: defaultSorting,
        columnFilters: [],
        columnVisibility: {},
        pagination: {
          pageIndex: 0,
          pageSize: 10,
        },
      }),
    )
  }

  return (
    <div className="flex items-center justify-between text-[13px]">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter by title..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("title")?.setFilterValue(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px] text-[13px]"
        />
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={[
              { value: "New", label: "New" },
              { value: "In Progress", label: "In Progress" },
              { value: "Completed", label: "Completed" },
              { value: "Archived", label: "Archived" },
            ]}
          />
        )}
        {table.getColumn("type") && (
          <DataTableFacetedFilter
            column={table.getColumn("type")}
            title="Type"
            options={[
              { value: "Research", label: "Research" },
              { value: "Feature", label: "Feature" },
              { value: "Bug", label: "Bug" },
              { value: "Enhancement", label: "Enhancement" },
              { value: "Documentation", label: "Documentation" },
            ]}
          />
        )}
        {table.getColumn("journey") && (
          <DataTableFacetedFilter
            column={table.getColumn("journey")}
            title="Journey"
            options={[
              { value: "Awareness", label: "Awareness" },
              { value: "Consideration", label: "Consideration" },
              { value: "Decision", label: "Decision" },
              { value: "Retention", label: "Retention" },
              { value: "Advocacy", label: "Advocacy" },
            ]}
          />
        )}
        {isFiltered && (
          <Button variant="ghost" onClick={() => table.resetColumnFilters()} className="h-8 px-2 lg:px-3 text-[13px]">
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-[13px]"
          onClick={resetTableState}
          title="Reset all table preferences"
        >
          <RotateCcw className="mr-2 h-3.5 w-3.5" />
          Reset All
        </Button>
        <Button variant="outline" size="sm" className="h-8 text-[13px]" onClick={() => setShowAdvancedFilter(true)}>
          <SlidersHorizontal className="mr-2 h-3.5 w-3.5" />
          Advanced Filters
        </Button>
        <DataTableViewOptions table={table} />
      </div>
      <AdvancedFilter isOpen={showAdvancedFilter} onClose={() => setShowAdvancedFilter(false)} table={table} />
    </div>
  )
}
