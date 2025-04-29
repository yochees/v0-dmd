import type { DataItem } from "@/types/data"
import { CanvasCard } from "./canvas-card"
import { cn } from "@/lib/utils"

interface CanvasColumnProps {
  title: string
  items: DataItem[]
  className?: string
}

export function CanvasColumn({ title, items, className }: CanvasColumnProps) {
  return (
    <div className={cn("rounded-lg border-2 p-4 h-full flex flex-col", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-table">{title}</h3>
        <div className="bg-background text-table px-2 py-1 rounded-full text-xs font-medium">{items.length}</div>
      </div>

      <div className="space-y-3 overflow-auto flex-grow">
        {items.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-table italic">No items</div>
        ) : (
          items.map((item) => <CanvasCard key={item.id} item={item} />)
        )}
      </div>
    </div>
  )
}
