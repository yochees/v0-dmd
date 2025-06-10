"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { MousePointer2, Hand, Square, Minus, ZoomIn, ZoomOut, LayoutGrid } from "lucide-react"

interface CanvasToolbarProps {
  selectedTool: string
  onToolChange: (tool: string) => void
  scale: number
  onScaleChange: (scale: number) => void
  onArrange: () => void
}

export function CanvasToolbar({ selectedTool, onToolChange, scale, onScaleChange, onArrange }: CanvasToolbarProps) {
  const tools = [
    { id: "select", icon: MousePointer2, label: "Select" },
    { id: "pan", icon: Hand, label: "Pan" },
    { id: "step", icon: Square, label: "Add Step" },
    { id: "lane", icon: Minus, label: "Add Lane" },
  ]

  return (
    <div className="flex items-center gap-2 p-2 border-b bg-white">
      <div className="flex items-center gap-1">
        {tools.map((tool) => (
          <Button
            key={tool.id}
            variant={selectedTool === tool.id ? "default" : "ghost"}
            size="sm"
            onClick={() => onToolChange(tool.id)}
            className="h-8 w-8 p-0"
          >
            <tool.icon className="h-4 w-4" />
          </Button>
        ))}
      </div>

      <Separator orientation="vertical" className="h-6" />

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onScaleChange(Math.max(0.1, scale - 0.1))}
          className="h-8 w-8 p-0"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>

        <span className="text-sm font-mono w-12 text-center">{Math.round(scale * 100)}%</span>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onScaleChange(Math.min(3, scale + 0.1))}
          className="h-8 w-8 p-0"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      <Button variant="ghost" size="sm" onClick={onArrange} className="h-8 px-3">
        <LayoutGrid className="h-4 w-4 mr-1" />
        Arrange
      </Button>
    </div>
  )
}
