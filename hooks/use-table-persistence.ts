"use client"

import { useEffect, useState } from "react"
import type { ColumnFiltersState, SortingState, VisibilityState } from "@tanstack/react-table"
import { getLocalStorageItem, setLocalStorageItem } from "@/lib/local-storage"

interface TablePersistenceOptions {
  storageKey: string
}

interface TableState {
  sorting: SortingState
  columnFilters: ColumnFiltersState
  columnVisibility: VisibilityState
  pagination: {
    pageIndex: number
    pageSize: number
  }
}

// Default sorting state - sort by title in ascending order
const defaultSorting: SortingState = [
  {
    id: "title",
    desc: false,
  },
]

const defaultTableState: TableState = {
  sorting: defaultSorting,
  columnFilters: [],
  columnVisibility: {},
  pagination: {
    pageIndex: 0,
    pageSize: 10,
  },
}

export function useTablePersistence({ storageKey }: TablePersistenceOptions) {
  // Initialize with default states
  const [tableState, setTableState] = useState<TableState>(defaultTableState)
  const [isInitialized, setIsInitialized] = useState(false)

  // Load state from localStorage on component mount
  useEffect(() => {
    const storedState = getLocalStorageItem(storageKey)

    if (storedState) {
      try {
        const parsedState = JSON.parse(storedState)
        setTableState(parsedState)
      } catch (error) {
        console.error("Failed to parse table state from localStorage:", error)
        // If parsing fails, use default state
        setTableState(defaultTableState)
      }
    } else {
      // If no stored state, use default state
      setTableState(defaultTableState)
    }

    setIsInitialized(true)
  }, [storageKey])

  // Save state to localStorage whenever it changes
  const persistState = (newState: Partial<TableState>) => {
    const updatedState = { ...tableState, ...newState }
    setTableState(updatedState)
    setLocalStorageItem(storageKey, JSON.stringify(updatedState))
  }

  return {
    tableState,
    persistState,
    isInitialized,
  }
}
