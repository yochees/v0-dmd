import { getData } from "@/lib/data"
import { CanvasView } from "@/components/canvas/canvas-view"
import { ViewToggle } from "@/components/view-toggle"

export default async function CanvasPage() {
  const data = await getData()

  return (
    <div className="h-screen flex flex-col">
      <div className="flex justify-between items-center p-6 border-b">
        <h1 className="text-3xl font-bold">Data Management Dashboard</h1>
        <ViewToggle currentView="canvas" />
      </div>
      <div className="flex-1 overflow-hidden">
        <CanvasView data={data} />
      </div>
    </div>
  )
}
