import { DataTable } from "@/components/data-table/data-table"
import { columns } from "@/components/data-table/columns"
import { getData } from "@/lib/data"
import { ViewToggle } from "@/components/view-toggle"

export default async function Home() {
  const data = await getData()

  return (
    <div className="max-w-[1800px] mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Data Management Dashboard</h1>
        <ViewToggle currentView="table" />
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  )
}
