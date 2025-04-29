"use client"

import { useState } from "react"
import type { DataItem } from "@/types/data"

export type ColumnSizeType = 1 | 2 | 3

interface CanvasState {
  items: Record<string, DataItem[]>
  columnSizes: Record<string, ColumnSizeType>
}

export function useCanvasState(initialData: DataItem[]) {
  // Group data by status
  const initialGroupedData = initialData.reduce<Record<string, DataItem[]>>((acc, item) => {
    if (!acc[item.status]) {
      acc[item.status] = []
    }
    acc[item.status].push(item)
    return acc
  }, {})

  // Define the order of status columns
  const statusOrder = ["New", "In Progress", "Completed", "Archived"]

  // Initialize column sizes (all columns start at size 1)
  const initialColumnSizes = statusOrder.reduce<Record<string, ColumnSizeType>>((acc, status) => {
    acc[status] = 1
    return acc
  }, {})

  const [state, setState] = useState<CanvasState>({
    items: initialGroupedData,
    columnSizes: initialColumnSizes,
  })

  // Function to move an item between columns
  const moveItem = (itemId: string, fromStatus: string, toStatus: string) => {
    setState((prev) => {
      // Find the item in the source column
      const item = prev.items[fromStatus].find((i) => i.id === itemId)
      if (!item) return prev

      // Create a new item with updated status
      const updatedItem = { ...item, status: toStatus }

      // Remove item from source column and add to destination column
      return {
        ...prev,
        items: {
          ...prev.items,
          [fromStatus]: prev.items[fromStatus].filter((i) => i.id !== itemId),
          [toStatus]: [...prev.items[toStatus], updatedItem],
        },
      }
    })
  }

  // Function to resize a column
  const resizeColumn = (status: string, size: ColumnSizeType) => {
    setState((prev) => ({
      ...prev,
      columnSizes: {
        ...prev.columnSizes,
        [status]: size,
      },
    }))
  }

  // Function to filter items
  const filterItems = (query: string) => {
    if (query.trim() === "") {
      // Reset to initial grouped data
      setState((prev) => ({
        ...prev,
        items: initialGroupedData,
      }))
      return
    }

    const lowercaseQuery = query.toLowerCase()
    const filteredGroupedData = Object.entries(initialGroupedData).reduce<Record<string, DataItem[]>>(
      (acc, [status, items]) => {
        acc[status] = items.filter(
          (item) =>
            item.title.toLowerCase().includes(lowercaseQuery) ||
            item.type.toLowerCase().includes(lowercaseQuery) ||
            item.source.toLowerCase().includes(lowercaseQuery),
        )
        return acc
      },
      {},
    )

    setState((prev) => ({
      ...prev,
      items: filteredGroupedData,
    }))
  }

  return {
    items: state.items,
    columnSizes: state.columnSizes,
    statusOrder,
    moveItem,
    resizeColumn,
    filterItems,
  }
}
