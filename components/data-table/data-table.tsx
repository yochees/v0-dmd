"use client"

import { useState, useEffect } from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { DataTablePagination } from "./data-table-pagination"
import { DataTableToolbar } from "./data-table-toolbar"
import { useTablePersistence } from "@/hooks/use-table-persistence"
import { ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sidepanel } from "@/components/sidepanel"
import { ItemDetails } from "@/components/kanban/item-details"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

// Default sorting state - sort by title in ascending order
const defaultSorting: SortingState = [
  {
    id: "title",
    desc: false,
  },
]

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
  // Use our custom hook for persistence
  const { tableState, persistState, isInitialized } = useTablePersistence({
    storageKey: "data-management-table-state",
  })

  // Initialize state from persisted values or defaults
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>(defaultSorting)
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const [selectedItem, setSelectedItem] = useState<TData | null>(null)
  const [isSidepanelOpen, setIsSidepanelOpen] = useState(false)

  // Update state when persisted values are loaded
  useEffect(() => {
    if (isInitialized) {
      setColumnVisibility(tableState.columnVisibility)
      setColumnFilters(tableState.columnFilters)
      // Use the persisted sorting state if it exists, otherwise use the default
      setSorting(tableState.sorting && tableState.sorting.length > 0 ? tableState.sorting : defaultSorting)
      setPagination(tableState.pagination)
    }
  }, [isInitialized, tableState])

  // Create the table instance
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: (updater) => {
      const newSorting = typeof updater === "function" ? updater(sorting) : updater
      setSorting(newSorting)
      persistState({ sorting: newSorting })
    },
    onColumnFiltersChange: (updater) => {
      const newFilters = typeof updater === "function" ? updater(columnFilters) : updater
      setColumnFilters(newFilters)
      persistState({ columnFilters: newFilters })
    },
    onColumnVisibilityChange: (updater) => {
      const newVisibility = typeof updater === "function" ? updater(columnVisibility) : updater
      setColumnVisibility(newVisibility)
      persistState({ columnVisibility: newVisibility })
    },
    onPaginationChange: (updater) => {
      const newPagination = typeof updater === "function" ? updater(pagination) : updater
      setPagination(newPagination)
      persistState({ pagination: newPagination })
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <div className="space-y-2 text-table">
      <DataTableToolbar table={table} />
      <div className="rounded-md border">
        <Table className="[&_th]:py-2 [&_td]:py-2">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="font-medium">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="h-12 hover:bg-muted/30 group"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3">
                      <div className="flex items-center justify-between">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        {cell.column.id === "title" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => {
                              setSelectedItem(row.original)
                              setIsSidepanelOpen(true)
                            }}
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            <span className="sr-only">View details</span>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-16 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
      {/* Sidepanel for item details */}
      {selectedItem && (
        <Sidepanel isOpen={isSidepanelOpen} onClose={() => setIsSidepanelOpen(false)} title="Item Details">
          <ItemDetails item={selectedItem as any} />
        </Sidepanel>
      )}
    </div>
  )
}
