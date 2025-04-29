"use client"

import type React from "react"
import type { Column } from "@tanstack/react-table"
import { SortAsc, SortDesc } from "lucide-react"
import { cn } from "@/lib/utils"

interface DataTableColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  title: string
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn("text-[13px] font-medium", className)}>{title}</div>
  }

  // Function to handle direct click on column header for sorting
  const handleSortClick = () => {
    const currentSort = column.getIsSorted()
    if (currentSort === false) {
      column.toggleSorting(false) // Sort ascending
    } else if (currentSort === "asc") {
      column.toggleSorting(true) // Toggle to descending
    } else {
      column.clearSorting() // Clear sorting
    }
  }

  return (
    <div
      className={cn("flex cursor-pointer items-center space-x-1 text-[13px] font-medium hover:text-primary", className)}
      onClick={handleSortClick}
    >
      <span>{title}</span>
      {column.getIsSorted() === "desc" ? (
        <SortDesc className="ml-1 h-4 w-4" />
      ) : column.getIsSorted() === "asc" ? (
        <SortAsc className="ml-1 h-4 w-4" />
      ) : null}
    </div>
  )
}
