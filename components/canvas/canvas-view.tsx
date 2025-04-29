"use client"

import { useState, useEffect } from "react"
import type { DataItem } from "@/types/data"
import { CanvasColumn } from "./canvas-column"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface CanvasViewProps {
  data: DataItem[]
}

export function CanvasView({ data }: CanvasViewProps) {
  const [filteredData, setFilteredData] = useState<DataItem[]>(data)
  const [searchQuery, setSearchQuery] = useState("")

  // Group data by status
  const groupedData = filteredData.reduce<Record<string, DataItem[]>>((acc, item) => {
    if (!acc[item.status]) {
      acc[item.status] = []
    }
    acc[item.status].push(item)
    return acc
  }, {})

  // Define the order of status columns
  const statusOrder = ["New", "In Progress", "Completed", "Archived"]

  // Filter data when search query changes
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredData(data)
    } else {
      const query = searchQuery.toLowerCase()
      setFilteredData(
        data.filter(
          (item) =>
            item.title.toLowerCase().includes(query) ||
            item.type.toLowerCase().includes(query) ||
            item.source.toLowerCase().includes(query),
        ),
      )
    }
  }, [searchQuery, data])

  return (
    <div className="space-y-4">
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search items..."
          className="pl-8 text-table"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {statusOrder.map((status) => (
          <CanvasColumn
            key={status}
            title={status}
            items={groupedData[status] || []}
            className={getStatusColor(status)}
          />
        ))}
      </div>
    </div>
  )
}

// Helper function to get status color classes
function getStatusColor(status: string): string {
  switch (status) {
    case "New":
      return "border-yellow-300 bg-yellow-50"
    case "In Progress":
      return "border-blue-300 bg-blue-50"
    case "Completed":
      return "border-green-300 bg-green-50"
    case "Archived":
      return "border-gray-300 bg-gray-50"
    default:
      return "border-gray-300 bg-gray-50"
  }
}
