import { getData } from "@/lib/data"
import { KanbanView } from "@/components/kanban/kanban-view"
import { ViewToggle } from "@/components/view-toggle"

export default async function KanbanPage() {
  const data = await getData()

  return (
    <div className="max-w-[1800px] mx-auto px-6 py-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Data Management Dashboard</h1>
        <ViewToggle currentView="kanban" />
      </div>
      <KanbanView data={data} />
    </div>
  )
}
