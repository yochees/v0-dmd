"use client"

import { useState } from "react"
import type { DataItem } from "@/types/data"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { format } from "date-fns"
import { MoreHorizontal, Calendar, Users, GripVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useDraggable } from "@dnd-kit/core"

interface KanbanCardProps {
  item: DataItem
  status?: string
  isDragging?: boolean
}

export function KanbanCard({ item, status, isDragging = false }: KanbanCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const {
    attributes,
    listeners,
    setNodeRef,
    isDragging: isCurrentlyDragging,
  } = useDraggable({
    id: item.id,
    data: {
      item,
      status,
    },
  })

  // Get type badge color
  const getTypeBadgeClass = (type: string) => {
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

  return (
    <Card
      ref={setNodeRef}
      className={cn(
        "shadow-sm hover:shadow transition-shadow duration-200",
        (isDragging || isCurrentlyDragging) && "opacity-50 cursor-grabbing",
        !isDragging && !isCurrentlyDragging && "cursor-grab",
      )}
    >
      <CardHeader className="p-3 pb-0 flex flex-row justify-between items-start">
        <div className="flex items-center gap-2">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab p-1 rounded-md hover:bg-muted/50 transition-colors"
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
          <Badge className={cn("text-table font-medium", getTypeBadgeClass(item.type))}>{item.type}</Badge>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <DropdownMenuItem className="text-table">Edit</DropdownMenuItem>
            <DropdownMenuItem className="text-table">Duplicate</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600 text-table">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="p-3">
        <h3
          className={cn(
            "font-medium text-table mb-2 cursor-pointer hover:text-primary transition-colors",
            isExpanded ? "" : "line-clamp-2",
          )}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {item.title}
        </h3>
        <div className="text-muted-foreground text-table">
          <div className="flex items-center gap-1 mb-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>Updated: {format(item.dateUpdated, "MMM d, yyyy")}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            <span>
              {item.personas.length > 0
                ? item.personas.length > 1
                  ? `${item.personas[0]} +${item.personas.length - 1}`
                  : item.personas[0]
                : "No personas"}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-3 pt-0 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-table">
            {item.source}
          </Badge>
        </div>
        <div className="text-table font-medium">Score: {item.score}</div>
      </CardFooter>
    </Card>
  )
}
