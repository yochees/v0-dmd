"use client"

import { MousePointer, Hand, Square, Minus, ZoomIn, ZoomOut, RotateCcw, LayoutGrid } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import type { CanvasTool } from "@/hooks/use-canvas-state"
import { cn } from "@/lib/utils"

interface CanvasToolbarProps {
  selectedTool: CanvasTool
  onToolChange: (tool: CanvasTool) => void
  scale: number
  onScaleChange: (scale: number) => void
  onResetView: () => void
  onArrangeCards: () => void
  onZoomToCenter?: (delta: number) => void
}

export function CanvasToolbar({
  selectedTool,
  onToolChange,
  scale,
  onScaleChange,
  onResetView,
  onArrangeCards,
  onZoomToCenter,
}: CanvasToolbarProps) {
  const handleZoomIn = () => {
    if (onZoomToCenter) {
      onZoomToCenter(1.25)
    } else {
      onScaleChange(scale * 1.25)
    }
  }

  const handleZoomOut = () => {
    if (onZoomToCenter) {
      onZoomToCenter(0.8)
    } else {
      onScaleChange(scale * 0.8)
    }
  }

  return (
    <div className="flex items-center gap-2 p-4 border-b bg-background">
      <div className="flex items-center gap-1">
        <Button
          variant={selectedTool === "select" ? "default" : "outline"}
          size="sm"
          onClick={() => onToolChange("select")}
          className={cn("flex items-center gap-2")}
        >
          <MousePointer className="h-4 w-4" />
          Select
        </Button>
        <Button
          variant={selectedTool === "pan" ? "default" : "outline"}
          size="sm"
          onClick={() => onToolChange("pan")}
          className={cn("flex items-center gap-2")}
        >
          <Hand className="h-4 w-4" />
          Pan
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      <div className="flex items-center gap-1">
        <Button
          variant={selectedTool === "step" ? "default" : "outline"}
          size="sm"
          onClick={() => onToolChange("step")}
          className={cn("flex items-center gap-2")}
        >
          <Square className="h-4 w-4" />
          Step
        </Button>
        <Button
          variant={selectedTool === "lane" ? "default" : "outline"}
          size="sm"
          onClick={() => onToolChange("lane")}
          className={cn("flex items-center gap-2")}
        >
          <Minus className="h-4 w-4" />
          Lane
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      <div className="flex items-center gap-1">
        <Button variant="outline" size="sm" onClick={onArrangeCards} className={cn("flex items-center gap-2")}>
          <LayoutGrid className="h-4 w-4" />
          Arrange
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      <div className="flex items-center gap-1">
        <Button variant="outline" size="sm" onClick={handleZoomOut} disabled={scale <= 0.2}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium min-w-[60px] text-center">{Math.round(scale * 100)}%</span>
        <Button variant="outline" size="sm" onClick={handleZoomIn} disabled={scale >= 3}>
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={onResetView}>
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
