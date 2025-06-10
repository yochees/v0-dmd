"use client"

import type React from "react"

import { useState, useRef, useCallback, useEffect, useMemo } from "react"
import type { DataItem } from "@/types/data"
import { CanvasCard } from "./canvas-card"
import { CanvasRectangleComponent } from "./canvas-rectangle"
import { CanvasToolbar } from "./canvas-toolbar"
import { useCanvasState } from "@/hooks/use-canvas-state"
import { throttle } from "@/lib/utils"

interface CanvasViewProps {
  data: DataItem[]
}

export function CanvasView({ data }: CanvasViewProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const {
    items,
    rectangles,
    selectedTool,
    isDrawing,
    currentRect,
    updateItemPosition,
    addRectangle,
    updateRectangle,
    deleteRectangle,
    setSelectedTool,
    startDrawing,
    updateDrawing,
    finishDrawing,
    calculateSteps,
    arrangeCards,
  } = useCanvasState(data)

  const [scale, setScale] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 })
  const [draggingCardId, setDraggingCardId] = useState<string | null>(null)

  // Throttled mouse move handler for better performance
  const throttledMouseMove = useMemo(
    () =>
      throttle((e: React.MouseEvent) => {
        const rect = canvasRef.current?.getBoundingClientRect()
        if (!rect) return

        if (isPanning) {
          const deltaX = e.clientX - lastPanPoint.x
          const deltaY = e.clientY - lastPanPoint.y
          setPan((prev) => ({ x: prev.x + deltaX, y: prev.y + deltaY }))
          setLastPanPoint({ x: e.clientX, y: e.clientY })
        } else if (isDrawing) {
          const x = (e.clientX - rect.left - pan.x) / scale
          const y = (e.clientY - rect.top - pan.y) / scale
          updateDrawing(x, y)
        }
      }, 16), // ~60fps
    [isPanning, isDrawing, lastPanPoint, pan, scale, updateDrawing],
  )

  // Handle mouse events for drawing rectangles
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // Don't handle canvas events if we're dragging a card or if the tool is select
      if (draggingCardId || selectedTool === "select") return

      const rect = canvasRef.current?.getBoundingClientRect()
      if (!rect) return

      const x = (e.clientX - rect.left - pan.x) / scale
      const y = (e.clientY - rect.top - pan.y) / scale

      if (selectedTool === "pan") {
        setIsPanning(true)
        setLastPanPoint({ x: e.clientX, y: e.clientY })
      } else if (selectedTool === "step" || selectedTool === "lane") {
        startDrawing(x, y, selectedTool)
      }
    },
    [selectedTool, pan, scale, startDrawing, draggingCardId],
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      // Don't handle canvas mouse move if we're dragging a card
      if (draggingCardId) return
      throttledMouseMove(e)
    },
    [throttledMouseMove, draggingCardId],
  )

  const handleMouseUp = useCallback(() => {
    if (isPanning) {
      setIsPanning(false)
    } else if (isDrawing) {
      finishDrawing()
    }
  }, [isPanning, isDrawing, finishDrawing])

  // Handle zoom with mouse cursor as pivot point
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault()

      const rect = canvasRef.current?.getBoundingClientRect()
      if (!rect) return

      // Get mouse position relative to canvas
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top

      // Calculate zoom delta
      const delta = e.deltaY > 0 ? 0.9 : 1.1
      const newScale = Math.max(0.1, Math.min(3, scale * delta))

      // Calculate the point in canvas coordinates before zoom
      const canvasPointBeforeZoom = {
        x: (mouseX - pan.x) / scale,
        y: (mouseY - pan.y) / scale,
      }

      // Calculate the point in canvas coordinates after zoom
      const canvasPointAfterZoom = {
        x: (mouseX - pan.x) / newScale,
        y: (mouseY - pan.y) / newScale,
      }

      // Calculate the difference and adjust pan to keep the mouse point fixed
      const deltaCanvasX = canvasPointAfterZoom.x - canvasPointBeforeZoom.x
      const deltaCanvasY = canvasPointAfterZoom.y - canvasPointBeforeZoom.y

      setPan((prev) => ({
        x: prev.x + deltaCanvasX * newScale,
        y: prev.y + deltaCanvasY * newScale,
      }))

      setScale(newScale)
    },
    [scale, pan],
  )

  // Add this function after the handleWheel function
  const handleZoomToCenter = useCallback(
    (delta: number) => {
      const rect = canvasRef.current?.getBoundingClientRect()
      if (!rect) return

      // Use center of viewport as zoom point
      const centerX = rect.width / 2
      const centerY = rect.height / 2

      const newScale = Math.max(0.1, Math.min(3, scale * delta))

      // Calculate the point in canvas coordinates before zoom
      const canvasPointBeforeZoom = {
        x: (centerX - pan.x) / scale,
        y: (centerY - pan.y) / scale,
      }

      // Calculate the point in canvas coordinates after zoom
      const canvasPointAfterZoom = {
        x: (centerX - pan.x) / newScale,
        y: (centerY - pan.y) / newScale,
      }

      // Calculate the difference and adjust pan to keep the center point fixed
      const deltaCanvasX = canvasPointAfterZoom.x - canvasPointBeforeZoom.x
      const deltaCanvasY = canvasPointAfterZoom.y - canvasPointBeforeZoom.y

      setPan((prev) => ({
        x: prev.x + deltaCanvasX * newScale,
        y: prev.y + deltaCanvasY * newScale,
      }))

      setScale(newScale)
    },
    [scale, pan],
  )

  // Calculate steps when rectangles change (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      calculateSteps()
    }, 100)
    return () => clearTimeout(timer)
  }, [rectangles, calculateSteps])

  // Memoize grid style to prevent recalculation
  const gridStyle = useMemo(
    () => ({
      backgroundImage: `
        linear-gradient(to right, #e5e7eb 1px, transparent 1px),
        linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
      `,
      backgroundSize: "20px 20px",
    }),
    [],
  )

  // Handle card drag start
  const handleCardDragStart = useCallback((cardId: string) => {
    setDraggingCardId(cardId)
  }, [])

  // Handle card drag end
  const handleCardDragEnd = useCallback(() => {
    setDraggingCardId(null)
  }, [])

  return (
    <div className="h-full flex flex-col">
      <CanvasToolbar
        selectedTool={selectedTool}
        onToolChange={setSelectedTool}
        scale={scale}
        onScaleChange={setScale}
        onResetView={() => {
          setScale(1)
          setPan({ x: 0, y: 0 })
        }}
        onArrangeCards={arrangeCards}
        onZoomToCenter={handleZoomToCenter}
      />

      <div
        ref={canvasRef}
        className="flex-1 relative overflow-hidden bg-gray-50"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        style={{
          cursor:
            selectedTool === "pan"
              ? isPanning
                ? "grabbing"
                : "grab"
              : selectedTool === "select"
                ? "default"
                : "crosshair",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
            transformOrigin: "0 0",
            willChange: "transform",
          }}
        >
          {/* Grid */}
          <div className="absolute inset-0 opacity-20" style={gridStyle} />

          {/* Rectangles */}
          {rectangles.map((rectangle) => (
            <CanvasRectangleComponent
              key={rectangle.id}
              rectangle={rectangle}
              onUpdate={updateRectangle}
              onDelete={deleteRectangle}
              isSelected={selectedTool === "select"}
            />
          ))}

          {/* Current drawing rectangle */}
          {currentRect && (
            <div
              className="absolute border-2 border-dashed border-blue-500 bg-blue-100/20"
              style={{
                left: currentRect.x,
                top: currentRect.y,
                width: currentRect.width,
                height: currentRect.height,
              }}
            />
          )}

          {/* Cards */}
          {items.map((item) => (
            <CanvasCard
              key={item.id}
              item={item}
              onPositionChange={(position) => updateItemPosition(item.id, position)}
              isSelectable={selectedTool === "select"}
              onDragStart={() => handleCardDragStart(item.id)}
              onDragEnd={handleCardDragEnd}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
