"use client"

import type React from "react"

import { useState } from "react"
import type { DataItem } from "@/types/data"
import { KanbanColumn } from "./kanban-column"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useKanbanState } from "@/hooks/use-kanban-state"
import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core"
import { KanbanCard } from "./kanban-card"
import { createPortal } from "react-dom"

interface KanbanViewProps {
  data: DataItem[]
}

export function KanbanView({ data }: KanbanViewProps) {
  const { items, columnSizes, statusOrder, moveItem, resizeColumn, filterItems } = useKanbanState(data)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeItem, setActiveItem] = useState<DataItem | null>(null)

  // Configure sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Minimum distance before a drag starts
      },
    }),
  )

  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    filterItems(query)
  }

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const itemId = active.id as string
    const status = active.data.current?.status as string

    const item = items[status]?.find((item) => item.id === itemId)
    if (item) {
      setActiveItem(item)
    }
  }

  // Handle drag over
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event

    if (!over) return

    const activeId = active.id as string
    const activeStatus = active.data.current?.status as string
    const overId = over.id as string

    // If over a column
    if (statusOrder.includes(overId)) {
      const overStatus = overId

      // Don't do anything if we're already in this column
      if (activeStatus === overStatus) return

      moveItem(activeId, activeStatus, overStatus)
    }
  }

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    setActiveItem(null)
  }

  return (
    <div className="space-y-4">
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search items..."
          className="pl-8 text-table"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
        <div className="flex overflow-x-auto pb-4 -mx-6 px-6">
          <div className="flex gap-6 min-w-max">
            {statusOrder.map((status) => (
              <KanbanColumn
                key={status}
                id={status}
                title={status}
                items={items[status] || []}
                className={getStatusColor(status)}
                size={columnSizes[status]}
                onResize={(size) => resizeColumn(status, size)}
              />
            ))}
          </div>
        </div>

        {/* Drag overlay for visual feedback */}
        {typeof document !== "undefined" &&
          activeItem &&
          createPortal(
            <DragOverlay>
              {activeItem && (
                <div className="opacity-80">
                  <KanbanCard item={activeItem} isDragging />
                </div>
              )}
            </DragOverlay>,
            document.body,
          )}
      </DndContext>
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
