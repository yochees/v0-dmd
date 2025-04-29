"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { Table } from "@tanstack/react-table"

interface SelectAllDropdownProps<TData> {
  table: Table<TData>
}

export function SelectAllDropdown<TData>({ table }: SelectAllDropdownProps<TData>) {
  const [open, setOpen] = useState(false)
  
  // Get the current page's rows
  const currentPageRows = table.getPaginationRowModel().rows
  const visibleRowsCount = currentPageRows.length
  const allRowsCount = table.getCoreRowModel().rows.length

  const handleCheckboxClick = (e: React.MouseEvent) => {
    if (table.getIsAllPageRowsSelected() || table.getIsSomePageRowsSelected()) {
      e.preventDefault()
      e.stopPropagation()
      table.toggleAllPageRowsSelected(false)
      table.toggleAllRowsSelected(false)
      setOpen(false)
    } else {
      setOpen(true)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="flex items-center">
          <Checkbox
            checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
            onClick={handleCheckboxClick}
            aria-label="Select all"
            className="h-4 w-4"
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-0" align="start">
        <div className="flex flex-col">
          <button
            className="px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground text-left"
            onClick={() => {
              table.toggleAllPageRowsSelected(true)
              setOpen(false)
            }}
          >
            Select {visibleRowsCount} visible rows
          </button>
          <button
            className="px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground text-left"
            onClick={() => {
              table.toggleAllRowsSelected(true)
              setOpen(false)
            }}
          >
            Select all {allRowsCount} rows
          </button>
        </div>
      </PopoverContent>
    </Popover>
  )
} 