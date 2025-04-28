"use client"

import { useState } from "react"
import type { Table } from "@tanstack/react-table"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

interface AdvancedFilterProps<TData> {
  isOpen: boolean
  onClose: () => void
  table: Table<TData>
}

type FilterCondition = "equals" | "contains" | "startsWith" | "endsWith" | "greaterThan" | "lessThan"

interface FilterRule {
  column: string
  condition: FilterCondition
  value: string
}

export function AdvancedFilter<TData>({ isOpen, onClose, table }: AdvancedFilterProps<TData>) {
  const [filters, setFilters] = useState<FilterRule[]>([{ column: "title", condition: "contains", value: "" }])

  const columns = table
    .getAllColumns()
    .filter((column) => typeof column.accessorFn !== "undefined")
    .map((column) => ({
      id: column.id,
      label: column.id.charAt(0).toUpperCase() + column.id.slice(1),
    }))

  const conditions: { value: FilterCondition; label: string }[] = [
    { value: "equals", label: "Equals" },
    { value: "contains", label: "Contains" },
    { value: "startsWith", label: "Starts with" },
    { value: "endsWith", label: "Ends with" },
    { value: "greaterThan", label: "Greater than" },
    { value: "lessThan", label: "Less than" },
  ]

  const addFilter = () => {
    setFilters([...filters, { column: "title", condition: "contains", value: "" }])
  }

  const removeFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index))
  }

  const updateFilter = (index: number, field: keyof FilterRule, value: string) => {
    const newFilters = [...filters]
    newFilters[index] = { ...newFilters[index], [field]: value }
    setFilters(newFilters)
  }

  const applyFilters = () => {
    // Clear existing filters
    table.resetColumnFilters()

    // Apply each filter
    filters.forEach((filter) => {
      const column = table.getColumn(filter.column)
      if (!column) return

      if (filter.condition === "equals") {
        column.setFilterValue(filter.value)
      } else if (filter.condition === "contains") {
        column.setFilterValue(filter.value)
      } else if (filter.condition === "startsWith") {
        column.setFilterValue((value) => {
          if (typeof value === "string") {
            return value.startsWith(filter.value)
          }
          return false
        })
      } else if (filter.condition === "endsWith") {
        column.setFilterValue((value) => {
          if (typeof value === "string") {
            return value.endsWith(filter.value)
          }
          return false
        })
      } else if (filter.condition === "greaterThan" || filter.condition === "lessThan") {
        const numValue = Number.parseFloat(filter.value)
        if (!isNaN(numValue)) {
          column.setFilterValue((value) => {
            const numColumnValue = typeof value === "number" ? value : Number.parseFloat(String(value))
            if (!isNaN(numColumnValue)) {
              return filter.condition === "greaterThan" ? numColumnValue > numValue : numColumnValue < numValue
            }
            return false
          })
        }
      }
    })

    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Advanced Filters</DialogTitle>
          <DialogDescription>Create complex filter rules to find exactly what you're looking for.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {filters.map((filter, index) => (
            <div key={index} className="flex items-center gap-2">
              <Select value={filter.column} onValueChange={(value) => updateFilter(index, "column", value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select column" />
                </SelectTrigger>
                <SelectContent>
                  {columns.map((column) => (
                    <SelectItem key={column.id} value={column.id}>
                      {column.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={filter.condition}
                onValueChange={(value) => updateFilter(index, "condition", value as FilterCondition)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  {conditions.map((condition) => (
                    <SelectItem key={condition.value} value={condition.value}>
                      {condition.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                value={filter.value}
                onChange={(e) => updateFilter(index, "value", e.target.value)}
                className="flex-1"
                placeholder="Value"
              />
              <Button variant="ghost" size="icon" onClick={() => removeFilter(index)} disabled={filters.length === 1}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button variant="outline" onClick={addFilter} className="mt-2">
            Add Filter
          </Button>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={applyFilters}>Apply Filters</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
