"use client"

import type React from "react"

import { useState } from "react"
import type { CanvasRectangle } from "@/types/data"
import { X, Edit2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface CanvasRectangleProps {
  rectangle: CanvasRectangle
  onUpdate: (id: string, updates: Partial<CanvasRectangle>) => void
  onDelete: (id: string) => void
  isSelected: boolean
}

export function CanvasRectangleComponent({ rectangle, onUpdate, onDelete, isSelected }: CanvasRectangleProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editLabel, setEditLabel] = useState(rectangle.label)

  const handleSaveLabel = () => {
    onUpdate(rectangle.id, { label: editLabel })
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveLabel()
    } else if (e.key === "Escape") {
      setEditLabel(rectangle.label)
      setIsEditing(false)
    }
  }

  return (
    <div
      className={cn(
        "absolute border-2 border-dashed group",
        rectangle.type === "step" ? "border-blue-500 bg-blue-100/10" : "border-green-500 bg-green-100/10",
      )}
      style={{
        left: rectangle.x,
        top: rectangle.y,
        width: rectangle.width,
        height: rectangle.height,
      }}
    >
      {/* Label */}
      <div
        className={cn(
          "absolute -top-8 left-0 px-2 py-1 rounded text-white text-sm font-medium flex items-center gap-2",
          rectangle.type === "step" ? "bg-blue-500" : "bg-green-500",
        )}
      >
        {isEditing ? (
          <Input
            value={editLabel}
            onChange={(e) => setEditLabel(e.target.value)}
            onBlur={handleSaveLabel}
            onKeyDown={handleKeyDown}
            className="h-6 text-xs bg-white text-black border-none p-1 w-24"
            autoFocus
          />
        ) : (
          <>
            <span>{rectangle.label}</span>
            {isSelected && (
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 text-white hover:bg-white/20"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit2 className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 text-white hover:bg-white/20"
                  onClick={() => onDelete(rectangle.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
