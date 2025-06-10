"use client"

import { useState, useCallback } from "react"
import type { DataItem, CanvasRectangle } from "@/types/data"

export type CanvasTool = "select" | "pan" | "step" | "lane"

const CARD_WIDTH = 280
const CARD_HEIGHT = 140
const CARD_MARGIN = 20
const GRID_PADDING = 40

export function useCanvasState(initialData: DataItem[]) {
  const [items, setItems] = useState<DataItem[]>(initialData)
  const [rectangles, setRectangles] = useState<CanvasRectangle[]>([])
  const [selectedTool, setSelectedTool] = useState<CanvasTool>("select")
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentRect, setCurrentRect] = useState<{
    x: number
    y: number
    width: number
    height: number
  } | null>(null)
  const [drawingStart, setDrawingStart] = useState<{ x: number; y: number } | null>(null)

  // Direct position update without throttling for immediate response
  const updateItemPosition = useCallback((itemId: string, position: { x: number; y: number }) => {
    setItems((prev) => {
      // Find the item and update its position
      const itemIndex = prev.findIndex((item) => item.id === itemId)
      if (itemIndex === -1) return prev

      // Create a new array with the updated item
      const newItems = [...prev]
      newItems[itemIndex] = { ...newItems[itemIndex], position }
      return newItems
    })
  }, [])

  const addRectangle = useCallback((rectangle: Omit<CanvasRectangle, "id">) => {
    const newRectangle: CanvasRectangle = {
      ...rectangle,
      id: `rect-${Date.now()}`,
    }
    setRectangles((prev) => [...prev, newRectangle])
  }, [])

  const updateRectangle = useCallback((id: string, updates: Partial<CanvasRectangle>) => {
    setRectangles((prev) => prev.map((rect) => (rect.id === id ? { ...rect, ...updates } : rect)))
  }, [])

  const deleteRectangle = useCallback((id: string) => {
    setRectangles((prev) => prev.filter((rect) => rect.id !== id))
  }, [])

  const startDrawing = useCallback((x: number, y: number, type: "step" | "lane") => {
    setIsDrawing(true)
    setDrawingStart({ x, y })
    setCurrentRect({ x, y, width: 0, height: 0 })
  }, [])

  const updateDrawing = useCallback(
    (x: number, y: number) => {
      if (!drawingStart) return

      const width = x - drawingStart.x
      const height = y - drawingStart.y

      setCurrentRect({
        x: width < 0 ? x : drawingStart.x,
        y: height < 0 ? y : drawingStart.y,
        width: Math.abs(width),
        height: Math.abs(height),
      })
    },
    [drawingStart],
  )

  const finishDrawing = useCallback(() => {
    if (!currentRect || !drawingStart) return

    if (currentRect.width > 20 && currentRect.height > 20) {
      const type = selectedTool as "step" | "lane"
      addRectangle({
        x: currentRect.x,
        y: currentRect.y,
        width: currentRect.width,
        height: currentRect.height,
        type,
        label: `${type.charAt(0).toUpperCase() + type.slice(1)} ${rectangles.filter((r) => r.type === type).length + 1}`,
        color: type === "step" ? "#3b82f6" : "#10b981",
      })
    }

    setIsDrawing(false)
    setCurrentRect(null)
    setDrawingStart(null)
  }, [currentRect, drawingStart, selectedTool, addRectangle, rectangles])

  // Memoized step calculation for better performance
  const calculateSteps = useCallback(() => {
    const steps = rectangles.filter((r) => r.type === "step")

    setItems((prev) =>
      prev.map((item) => {
        if (!item.position) return item

        // Find which step this item belongs to
        const step = steps.find(
          (s) =>
            item.position!.x >= s.x &&
            item.position!.x <= s.x + s.width &&
            item.position!.y >= s.y &&
            item.position!.y <= s.y + s.height,
        )

        return {
          ...item,
          step: step?.label,
        }
      }),
    )
  }, [rectangles])

  const arrangeCards = useCallback(() => {
    const steps = rectangles.filter((r) => r.type === "step")
    const lanes = rectangles.filter((r) => r.type === "lane")

    // Create a copy of items to modify
    const newItems = [...items]
    const newRectangles = [...rectangles]

    // Group items by their current step/lane assignments
    const itemGroups: { [key: string]: DataItem[] } = {}

    items.forEach((item) => {
      if (!item.position) return

      // Find which step and lane this item belongs to
      const step = steps.find(
        (s) =>
          item.position!.x >= s.x &&
          item.position!.x <= s.x + s.width &&
          item.position!.y >= s.y &&
          item.position!.y <= s.y + s.height,
      )

      const lane = lanes.find(
        (l) =>
          item.position!.x >= l.x &&
          item.position!.x <= l.x + l.width &&
          item.position!.y >= l.y &&
          item.position!.y <= l.y + l.height,
      )

      const groupKey = `${step?.id || "no-step"}-${lane?.id || "no-lane"}`

      if (!itemGroups[groupKey]) {
        itemGroups[groupKey] = []
      }
      itemGroups[groupKey].push(item)
    })

    // Arrange items within each group
    Object.entries(itemGroups).forEach(([groupKey, groupItems]) => {
      if (groupItems.length === 0) return

      const [stepId, laneId] = groupKey.split("-")
      const step = stepId !== "no-step" ? steps.find((s) => s.id === stepId) : null
      const lane = laneId !== "no-lane" ? lanes.find((l) => l.id === laneId) : null

      // Calculate grid dimensions for this group
      const itemsPerRow = Math.ceil(Math.sqrt(groupItems.length))
      const rows = Math.ceil(groupItems.length / itemsPerRow)

      // Calculate required space
      const requiredWidth = itemsPerRow * (CARD_WIDTH + CARD_MARGIN) - CARD_MARGIN + 2 * GRID_PADDING
      const requiredHeight = rows * (CARD_HEIGHT + CARD_MARGIN) - CARD_MARGIN + 2 * GRID_PADDING

      // Determine the container bounds and position
      let containerX = 0
      let containerY = 0
      let containerWidth = requiredWidth
      let containerHeight = requiredHeight

      if (step && lane) {
        // Item is in both step and lane - use intersection
        containerX = Math.max(step.x, lane.x)
        containerY = Math.max(step.y, lane.y)
        containerWidth = Math.min(step.x + step.width, lane.x + lane.width) - containerX
        containerHeight = Math.min(step.y + step.height, lane.y + lane.height) - containerY

        // Expand rectangles if needed
        if (requiredWidth > containerWidth) {
          const expansion = requiredWidth - containerWidth
          const stepIndex = newRectangles.findIndex((r) => r.id === step.id)
          if (stepIndex !== -1) {
            newRectangles[stepIndex] = { ...step, width: step.width + expansion }
          }
          const laneIndex = newRectangles.findIndex((r) => r.id === lane.id)
          if (laneIndex !== -1) {
            newRectangles[laneIndex] = { ...lane, width: lane.width + expansion }
          }
          containerWidth = requiredWidth
        }

        if (requiredHeight > containerHeight) {
          const expansion = requiredHeight - containerHeight
          const stepIndex = newRectangles.findIndex((r) => r.id === step.id)
          if (stepIndex !== -1) {
            newRectangles[stepIndex] = { ...step, height: step.height + expansion }
          }
          const laneIndex = newRectangles.findIndex((r) => r.id === lane.id)
          if (laneIndex !== -1) {
            newRectangles[laneIndex] = { ...lane, height: lane.height + expansion }
          }
          containerHeight = requiredHeight
        }
      } else if (step) {
        // Item is only in a step
        containerX = step.x
        containerY = step.y
        containerWidth = step.width
        containerHeight = step.height

        // Expand step if needed
        if (requiredWidth > containerWidth || requiredHeight > containerHeight) {
          const stepIndex = newRectangles.findIndex((r) => r.id === step.id)
          if (stepIndex !== -1) {
            newRectangles[stepIndex] = {
              ...step,
              width: Math.max(step.width, requiredWidth),
              height: Math.max(step.height, requiredHeight),
            }
            containerWidth = Math.max(containerWidth, requiredWidth)
            containerHeight = Math.max(containerHeight, requiredHeight)
          }
        }
      } else if (lane) {
        // Item is only in a lane
        containerX = lane.x
        containerY = lane.y
        containerWidth = lane.width
        containerHeight = lane.height

        // Expand lane if needed
        if (requiredWidth > containerWidth || requiredHeight > containerHeight) {
          const laneIndex = newRectangles.findIndex((r) => r.id === lane.id)
          if (laneIndex !== -1) {
            newRectangles[laneIndex] = {
              ...lane,
              width: Math.max(lane.width, requiredWidth),
              height: Math.max(lane.height, requiredHeight),
            }
            containerWidth = Math.max(containerWidth, requiredWidth)
            containerHeight = Math.max(containerHeight, requiredHeight)
          }
        }
      } else {
        // Unassigned items - place them in a free area
        containerX = 100
        containerY = 100
        // Find a free area by checking existing rectangles
        const maxX = Math.max(...rectangles.map((r) => r.x + r.width), 0)
        if (maxX > 0) {
          containerX = maxX + 50
        }
      }

      // Position items in a grid within the container
      groupItems.forEach((item, index) => {
        const row = Math.floor(index / itemsPerRow)
        const col = index % itemsPerRow

        const x = containerX + GRID_PADDING + col * (CARD_WIDTH + CARD_MARGIN)
        const y = containerY + GRID_PADDING + row * (CARD_HEIGHT + CARD_MARGIN)

        // Find the item in newItems and update its position
        const itemIndex = newItems.findIndex((i) => i.id === item.id)
        if (itemIndex !== -1) {
          newItems[itemIndex] = {
            ...newItems[itemIndex],
            position: { x, y },
          }
        }
      })
    })

    // Update state with the new positions
    setItems(newItems)
    setRectangles(newRectangles)
  }, [items, rectangles])

  return {
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
  }
}
