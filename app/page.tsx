import { DataTable } from "@/components/data-table/data-table"
import { columns } from "@/components/data-table/columns"
import { getData } from "@/lib/data"

export default async function Home() {
  const data = await getData()

  return (
    <div className="max-w-[1800px] mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">Data Management Dashboard</h1>
      <DataTable columns={columns} data={data} />
    </div>
  )
}
