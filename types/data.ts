export type Status = "New" | "In Progress" | "Completed" | "Archived"
export type ItemType = "Research" | "Feature" | "Bug" | "Enhancement" | "Documentation"
export type Source = "Customer Feedback" | "Internal" | "Market Research" | "User Testing" | "Analytics"
export type Journey = "Awareness" | "Consideration" | "Decision" | "Retention" | "Advocacy"

export interface DataItem {
  id: string
  title: string
  source: Source
  type: ItemType
  status: Status
  score: number
  personas: string[]
  opportunities: number
  dateCreated: Date
  dateUpdated: Date
  journey: Journey
  step?: string
  position?: { x: number; y: number }
}

export interface CanvasRectangle {
  id: string
  x: number
  y: number
  width: number
  height: number
  type: "step" | "lane"
  label: string
  color: string
}
