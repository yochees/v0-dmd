"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import type { DataItem } from "@/types/data"
import { CanvasCard } from "./canvas-card"
import { CanvasRectangle } from "./canvas-rectangle"
import { CanvasToolbar } from "./canvas-toolbar"
import { useCanvasState } from "@/hooks/use-canvas-state"

interface CanvasViewProps {
  data: DataItem[]
}

export function CanvasView({ data }: CanvasViewProps) {
  const {
    scale,
    pan,
    selectedTool,
    rectangles,
    items,
    setScale,
    setPan,
    setSelectedTool,
    updateItemPosition,
    addRectangle,
    updateRectangle,
    arrangeItems,
  } = useCanvasState(data)

  const [draggingCardId, setDraggingCardId] = useState<string | null>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        const rect = canvasRef.current?.getBoundingClientRect()
        if (!rect) return

        const mouseX = e.clientX - rect.left
        const mouseY = e.clientY - rect.top

        const scaleFactor = e.deltaY > 0 ? 0.9 : 1.1
        const newScale = Math.max(0.1, Math.min(3, scale * scaleFactor))

        const scaleChange = newScale / scale
        const newPan = {
          x: mouseX - (mouseX - pan.x) * scaleChange,
          y: mouseY - (mouseY - pan.y) * scaleChange,
        }

        setScale(newScale)
        setPan(newPan)
      }
    },
    [scale, pan, setScale, setPan],
  )

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (selectedTool === "pan" && !draggingCardId) {
        const startPan = { ...pan }
        const startMouse = { x: e.clientX, y: e.clientY }

        const handleMouseMove = (e: MouseEvent) => {
          setPan({
            x: startPan.x + (e.clientX - startMouse.x),
            y: startPan.y + (e.clientY - startMouse.y),
          })
        }

        const handleMouseUp = () => {
          document.removeEventListener("mousemove", handleMouseMove)
          document.removeEventListener("mouseup", handleMouseUp)
        }

        document.addEventListener("mousemove", handleMouseMove)
        document.addEventListener("mouseup", handleMouseUp)
      }
    },
    [selectedTool, pan, setPan, draggingCardId],
  )

  return (
    <div className="h-full flex flex-col">
      <CanvasToolbar
        selectedTool={selectedTool}
        onToolChange={setSelectedTool}
        scale={scale}
        onScaleChange={setScale}
        onArrange={arrangeItems}
      />

      <div className="flex-1 overflow-hidden relative bg-gray-50">
        <div
          ref={canvasRef}
          className="w-full h-full cursor-grab active:cursor-grabbing"
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
            transformOrigin: "0 0",
          }}
        >
          {/* Grid background */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
              `,
              backgroundSize: "20px 20px",
            }}
          />

          {/* Rectangles */}
          {rectangles.map((rectangle) => (
            <CanvasRectangle key={rectangle.id} rectangle={rectangle} onUpdate={updateRectangle} />
          ))}

          {/* Cards */}
          {items.map((item) => (
            <CanvasCard
              key={item.id}
              item={item}
              scale={scale}
              onPositionChange={updateItemPosition}
              onDragStart={(id) => setDraggingCardId(id)}
              onDragEnd={() => setDraggingCardId(null)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
