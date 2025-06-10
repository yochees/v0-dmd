"use client"

import { useState, useCallback } from "react"
import type { DataItem, CanvasRectangle } from "@/types/data"

export function useCanvasState(initialData: DataItem[]) {
  const [scale, setScale] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [selectedTool, setSelectedTool] = useState("select")
  const [rectangles, setRectangles] = useState<CanvasRectangle[]>([])
  const [items, setItems] = useState<DataItem[]>(
    initialData.map((item, index) => ({
      ...item,
      position: item.position || {
        x: 50 + (index % 5) * 280,
        y: 50 + Math.floor(index / 5) * 200,
      },
    })),
  )

  const updateItemPosition = useCallback((id: string, position: { x: number; y: number }) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, position } : item)))
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

  const arrangeItems = useCallback(() => {
    const steps = [...new Set(items.map((item) => item.step).filter(Boolean))]
    const cardSpacing = 20
    const startX = 50
    const startY = 50
    const cardWidth = 280
    const cardHeight = 200

    setItems((prev) =>
      prev.map((item, index) => {
        const stepIndex = item.step ? steps.indexOf(item.step) : 0
        const itemsInStep = prev.filter((i) => i.step === item.step)
        const itemIndex = itemsInStep.findIndex((i) => i.id === item.id)

        return {
          ...item,
          position: {
            x: startX + stepIndex * (cardWidth + cardSpacing),
            y: startY + itemIndex * (cardHeight + cardSpacing),
          },
        }
      }),
    )
  }, [items])

  return {
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
  }
}
