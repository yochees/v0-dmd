"use client"
import type { DataItem } from "@/types/data"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Calendar, Users, BarChart3, Tag, FileText, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface ItemDetailsProps {
  item: DataItem
}

export function ItemDetails({ item }: ItemDetailsProps) {
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

  // Get status badge color
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "New":
        return "bg-yellow-100 text-yellow-800"
      case "In Progress":
        return "bg-blue-100 text-blue-800"
      case "Completed":
        return "bg-green-100 text-green-800"
      case "Archived":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-medium mb-2">{item.title}</h1>
        <div className="flex flex-wrap gap-2">
          <Badge className={cn("text-table font-medium", getTypeBadgeClass(item.type))}>{item.type}</Badge>
          <Badge className={cn("text-table font-medium", getStatusBadgeClass(item.status))}>{item.status}</Badge>
        </div>
      </div>

      {/* Metadata */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <div className="text-sm text-muted-foreground">Created</div>
          <div className="flex items-center gap-1.5 text-table">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            {format(item.dateCreated, "MMM d, yyyy")}
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-sm text-muted-foreground">Updated</div>
          <div className="flex items-center gap-1.5 text-table">
            <Clock className="h-4 w-4 text-muted-foreground" />
            {format(item.dateUpdated, "MMM d, yyyy")}
          </div>
        </div>
      </div>

      {/* Score */}
      <div className="space-y-2">
        <div className="text-sm text-muted-foreground flex items-center gap-1.5">
          <BarChart3 className="h-4 w-4" />
          Score
        </div>
        <div className="bg-muted h-2 rounded-full w-full overflow-hidden">
          <div className="bg-primary h-full rounded-full" style={{ width: `${item.score}%` }} />
        </div>
        <div className="text-right text-sm">{item.score}/100</div>
      </div>

      {/* Source */}
      <div className="space-y-2">
        <div className="text-sm text-muted-foreground flex items-center gap-1.5">
          <Tag className="h-4 w-4" />
          Source
        </div>
        <div className="text-table bg-muted/50 p-2 rounded-md">{item.source}</div>
      </div>

      {/* Personas */}
      <div className="space-y-2">
        <div className="text-sm text-muted-foreground flex items-center gap-1.5">
          <Users className="h-4 w-4" />
          Personas
        </div>
        <div className="flex flex-wrap gap-2">
          {item.personas.length > 0 ? (
            item.personas.map((persona) => (
              <Badge key={persona} variant="outline" className="text-table">
                {persona}
              </Badge>
            ))
          ) : (
            <div className="text-sm text-muted-foreground italic">No personas assigned</div>
          )}
        </div>
      </div>

      {/* Journey */}
      <div className="space-y-2">
        <div className="text-sm text-muted-foreground flex items-center gap-1.5">
          <FileText className="h-4 w-4" />
          Journey
        </div>
        <div className="text-table bg-muted/50 p-2 rounded-md">{item.journey}</div>
      </div>

      {/* Opportunities */}
      <div className="space-y-2">
        <div className="text-sm text-muted-foreground flex items-center gap-1.5">
          <BarChart3 className="h-4 w-4" />
          Opportunities
        </div>
        <div className="text-table bg-muted/50 p-2 rounded-md">{item.opportunities}</div>
      </div>
    </div>
  )
}
