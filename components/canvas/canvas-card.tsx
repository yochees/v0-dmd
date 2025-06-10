"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import type { DataItem } from "@/types/data"

interface CanvasCardProps {
  item: DataItem
  scale: number
  onPositionChange: (id: string, position: { x: number; y: number }) => void
  onDragStart: (id: string) => void
  onDragEnd: () => void
}

export function CanvasCard({ item, scale, onPositionChange, onDragStart, onDragEnd }: CanvasCardProps) {
  const [isDragging, setIsDragging] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.target instanceof HTMLButtonElement) return

      e.preventDefault()
      setIsDragging(true)
      onDragStart(item.id)

      const startMouseX = e.clientX
      const startMouseY = e.clientY
      const startX = item.position?.x || 0
      const startY = item.position?.y || 0

      const handleMouseMove = (e: MouseEvent) => {
        const deltaX = e.clientX - startMouseX
        const deltaY = e.clientY - startMouseY

        const newPosition = {
          x: startX + deltaX,
          y: startY + deltaY,
        }

        if (cardRef.current) {
          cardRef.current.style.left = `${newPosition.x}px`
          cardRef.current.style.top = `${newPosition.y}px`
        }

        onPositionChange(item.id, newPosition)
      }

      const handleMouseUp = () => {
        setIsDragging(false)
        onDragEnd()
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }

      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    },
    [item.id, item.position, onPositionChange, onDragStart, onDragEnd],
  )

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Research":
        return "bg-purple-100 text-purple-800"
      case "Feature":
        return "bg-green-100 text-green-800"
      case "Bug":
        return "bg-red-100 text-red-800"
      case "Enhancement":
        return "bg-blue-100 text-blue-800"
      case "Documentation":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New":
        return "bg-yellow-100 text-yellow-800"
      case "In Progress":
        return "bg-blue-100 text-blue-800"
      case "Completed":
        return "bg-green-100 text-green-800"
      case "Archived":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card
      ref={cardRef}
      className={`absolute w-64 cursor-move select-none transition-shadow ${
        isDragging ? "shadow-lg ring-2 ring-blue-500 z-50" : "shadow-sm hover:shadow-md"
      }`}
      style={{
        left: item.position?.x || 0,
        top: item.position?.y || 0,
        zIndex: isDragging ? 50 : 1,
      }}
      onMouseDown={handleMouseDown}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <h3 className="text-sm font-medium leading-tight">{item.title}</h3>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100">
            <ExternalLink className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1">
            <Badge variant="secondary" className={getTypeColor(item.type)}>
              {item.type}
            </Badge>
            <Badge variant="secondary" className={getStatusColor(item.status)}>
              {item.status}
            </Badge>
          </div>
          <div className="text-xs text-muted-foreground">
            <div>Source: {item.source}</div>
            <div>Score: {item.score}</div>
          </div>
          {item.step && <div className="text-xs text-muted-foreground">Step: {item.step}</div>}
        </div>
      </CardContent>
    </Card>
  )
}
