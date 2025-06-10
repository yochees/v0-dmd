"use client"

import type React from "react"

import { useState, useRef, useCallback, useMemo, useEffect } from "react"
import type { DataItem } from "@/types/data"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Sidepanel } from "@/components/sidepanel"
import { ItemDetails } from "@/components/kanban/item-details"

interface CanvasCardProps {
  item: DataItem
  onPositionChange: (position: { x: number; y: number }) => void
  isSelectable: boolean
  onDragStart?: () => void
  onDragEnd?: () => void
}

export function CanvasCard({ item, onPositionChange, isSelectable, onDragStart, onDragEnd }: CanvasCardProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isSidepanelOpen, setIsSidepanelOpen] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const dragStartRef = useRef<{
    mouseX: number
    mouseY: number
    cardX: number
    cardY: number
  } | null>(null)

  const getTypeBadgeClass = useMemo(() => {
    return (type: string) => {
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
  }, [])

  // Define the mouse move handler
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragStartRef.current) return

      // Calculate mouse movement in screen coordinates
      const deltaMouseX = e.clientX - dragStartRef.current.mouseX
      const deltaMouseY = e.clientY - dragStartRef.current.mouseY

      // Calculate new position directly (no scale division needed since we're working in canvas coordinates)
      const newX = dragStartRef.current.cardX + deltaMouseX
      const newY = dragStartRef.current.cardY + deltaMouseY

      // Update the DOM directly for immediate visual feedback
      if (cardRef.current) {
        cardRef.current.style.left = `${newX}px`
        cardRef.current.style.top = `${newY}px`
      }

      // Update the state through the callback
      onPositionChange({ x: newX, y: newY })
    },
    [onPositionChange],
  )

  // Define the mouse up handler
  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    dragStartRef.current = null
    onDragEnd?.()

    document.removeEventListener("mousemove", handleMouseMove)
    document.removeEventListener("mouseup", handleMouseUp)
  }, [handleMouseMove, onDragEnd])

  // Define the mouse down handler
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!isSelectable || !item.position) return

      // Check if the click is on the external link button
      const target = e.target as HTMLElement
      if (target.closest("button")) return

      e.preventDefault()
      e.stopPropagation()

      setIsDragging(true)
      onDragStart?.()

      // Store the initial mouse position and card position
      dragStartRef.current = {
        mouseX: e.clientX,
        mouseY: e.clientY,
        cardX: item.position.x,
        cardY: item.position.y,
      }

      // Add global event listeners
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    },
    [isSelectable, item.position, handleMouseMove, handleMouseUp, onDragStart],
  )

  // Clean up event listeners when component unmounts
  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [handleMouseMove, handleMouseUp])

  const openSidepanel = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setIsSidepanelOpen(true)
  }, [])

  const closeSidepanel = useCallback(() => {
    setIsSidepanelOpen(false)
  }, [])

  if (!item.position) return null

  return (
    <>
      <div
        ref={cardRef}
        className="absolute select-none"
        style={{
          left: item.position.x,
          top: item.position.y,
          width: 280,
          zIndex: isDragging ? 1000 : 1,
          transition: isDragging ? "none" : "all 0.1s ease",
        }}
        onMouseDown={handleMouseDown}
      >
        <Card
          className={cn(
            "shadow-md hover:shadow-lg transition-shadow duration-200 bg-white",
            isSelectable && "cursor-move",
            isDragging && "shadow-xl scale-105 ring-2 ring-blue-500/50",
          )}
        >
          <CardHeader className="p-3 pb-2">
            <div className="flex items-start justify-between gap-2">
              <Badge className={cn("text-table font-medium", getTypeBadgeClass(item.type))}>{item.type}</Badge>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 opacity-60 hover:opacity-100"
                onClick={openSidepanel}
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <h3 className="font-medium text-table mb-2 line-clamp-2">{item.title}</h3>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{item.source}</span>
              <span>Score: {item.score}</span>
            </div>
            {item.step && (
              <div className="mt-2">
                <Badge variant="outline" className="text-xs">
                  {item.step}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Sidepanel isOpen={isSidepanelOpen} onClose={closeSidepanel} title="Item Details">
        <ItemDetails item={item} />
      </Sidepanel>
    </>
  )
}
