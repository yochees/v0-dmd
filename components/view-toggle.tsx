"use client"

import { LayoutGrid, Table2, Workflow } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ViewToggleProps {
  currentView: "table" | "kanban" | "canvas"
}

export function ViewToggle({ currentView }: ViewToggleProps) {
  const router = useRouter()

  return (
    <div className="flex items-center space-x-2 bg-muted/30 p-1 rounded-md">
      <Button
        variant="ghost"
        size="sm"
        className={cn("flex items-center gap-2 text-table", currentView === "table" && "bg-background shadow-sm")}
        onClick={() => router.push("/")}
      >
        <Table2 className="h-4 w-4" />
        Table
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={cn("flex items-center gap-2 text-table", currentView === "kanban" && "bg-background shadow-sm")}
        onClick={() => router.push("/kanban")}
      >
        <LayoutGrid className="h-4 w-4" />
        Kanban
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={cn("flex items-center gap-2 text-table", currentView === "canvas" && "bg-background shadow-sm")}
        onClick={() => router.push("/canvas")}
      >
        <Workflow className="h-4 w-4" />
        Canvas
      </Button>
    </div>
  )
}
