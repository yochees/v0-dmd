"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import type { CanvasRectangle as Rectangle } from "@/types/data"

interface CanvasRectangleProps {
  rectangle: Rectangle
  onUpdate: (id: string, updates: Partial<Rectangle>) => void
}

export function CanvasRectangle({ rectangle, onUpdate }: CanvasRectangleProps) {
  const [isResizing, setIsResizing] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const rectRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      setIsDragging(true)

      const startMouseX = e.clientX
      const startMouseY = e.clientY
      const startX = rectangle.x
      const startY = rectangle.y

      const handleMouseMove = (e: MouseEvent) => {
        const deltaX = e.clientX - startMouseX
        const deltaY = e.clientY - startMouseY

        onUpdate(rectangle.id, {
          x: startX + deltaX,
          y: startY + deltaY,
        })
      }

      const handleMouseUp = () => {
        setIsDragging(false)
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }

      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    },
    [rectangle.id, rectangle.x, rectangle.y, onUpdate],
  )

  const handleResizeMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsResizing(true)

      const startMouseX = e.clientX
      const startMouseY = e.clientY
      const startWidth = rectangle.width
      const startHeight = rectangle.height

      const handleMouseMove = (e: MouseEvent) => {
        const deltaX = e.clientX - startMouseX
        const deltaY = e.clientY - startMouseY

        onUpdate(rectangle.id, {
          width: Math.max(100, startWidth + deltaX),
          height: Math.max(60, startHeight + deltaY),
        })
      }

      const handleMouseUp = () => {
        setIsResizing(false)
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }

      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    },
    [rectangle.id, rectangle.width, rectangle.height, onUpdate],
  )

  return (
    <div
      ref={rectRef}
      className={`absolute border-2 border-dashed border-gray-400 bg-gray-100/50 cursor-move ${
        isDragging || isResizing ? "border-blue-500 bg-blue-100/50" : ""
      }`}
      style={{
        left: rectangle.x,
        top: rectangle.y,
        width: rectangle.width,
        height: rectangle.height,
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="absolute top-1 left-2 text-xs font-medium text-gray-600">{rectangle.label}</div>

      {/* Resize handle */}
      <div
        className="absolute bottom-0 right-0 w-3 h-3 bg-blue-500 cursor-se-resize opacity-0 hover:opacity-100"
        onMouseDown={handleResizeMouseDown}
      />
    </div>
  )
}
