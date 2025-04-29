"use client"

import { useState } from "react"
import type { DataItem } from "@/types/data"
import { CanvasCard } from "./canvas-card"
import { cn } from "@/lib/utils"
import { useDroppable } from "@dnd-kit/core"
import { ArrowUpWideNarrowIcon as ArrowsHorizontal } from "lucide-react"
import type { ColumnSizeType } from "@/hooks/use-canvas-state"

interface CanvasColumnProps {
  id: string
  title: string
  items: DataItem[]
  className?: string
  size: ColumnSizeType
  onResize: (size: ColumnSizeType) => void
}

export function CanvasColumn({ id, title, items, className, size, onResize }: CanvasColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  })

  const [isResizeMenuOpen, setIsResizeMenuOpen] = useState(false)

  // Calculate column width based on size
  const getColumnWidth = () => {
    switch (size) {
      case 1:
        return "col-span-3"
      case 2:
        return "col-span-6"
      case 3:
        return "col-span-9"
      default:
        return "col-span-3"
    }
  }

  // Handle resize button click
  const handleResize = (newSize: ColumnSizeType) => {
    onResize(newSize)
    setIsResizeMenuOpen(false)
  }

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "rounded-lg border-2 p-4 h-[calc(100vh-220px)] flex flex-col transition-all duration-300",
        getColumnWidth(),
        className,
        isOver && "ring-2 ring-primary ring-inset",
      )}
    >
      <div className="flex items-center justify-between mb-4 sticky top-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-table">{title}</h3>
          <div className="bg-background text-table px-2 py-1 rounded-full text-xs font-medium">{items.length}</div>
        </div>

        <div className="relative">
          <button
            className="p-1 rounded-md hover:bg-muted/50 transition-colors"
            onClick={() => setIsResizeMenuOpen(!isResizeMenuOpen)}
            title="Resize column"
          >
            <ArrowsHorizontal className="h-4 w-4 text-muted-foreground" />
          </button>

          {isResizeMenuOpen && (
            <div className="absolute right-0 top-full mt-1 bg-background rounded-md shadow-md border p-2 z-10 flex flex-col gap-1">
              <button
                className={cn(
                  "px-3 py-1 rounded-sm text-xs text-table hover:bg-muted transition-colors",
                  size === 1 && "bg-muted font-medium",
                )}
                onClick={() => handleResize(1)}
              >
                Small
              </button>
              <button
                className={cn(
                  "px-3 py-1 rounded-sm text-xs text-table hover:bg-muted transition-colors",
                  size === 2 && "bg-muted font-medium",
                )}
                onClick={() => handleResize(2)}
              >
                Medium
              </button>
              <button
                className={cn(
                  "px-3 py-1 rounded-sm text-xs text-table hover:bg-muted transition-colors",
                  size === 3 && "bg-muted font-medium",
                )}
                onClick={() => handleResize(3)}
              >
                Large
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3 overflow-auto flex-grow">
        {items.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-table italic">No items</div>
        ) : (
          items.map((item) => <CanvasCard key={item.id} item={item} status={id} />)
        )}
      </div>
    </div>
  )
}
