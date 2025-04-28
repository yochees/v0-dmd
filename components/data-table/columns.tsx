"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { DataItem } from "@/types/data"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"
import { format } from "date-fns"
import { EditableCell } from "./editable-cell"
import { EditableSelect } from "./editable-select"
import { EditablePersonas } from "./editable-personas"
import { cn } from "@/lib/utils"

export const columns: ColumnDef<DataItem>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="h-4 w-4"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="h-4 w-4"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
    cell: ({ row }) => {
      return <EditableCell initialValue={row.original.title} row={row} column="title" />
    },
  },
  {
    accessorKey: "source",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Source" />,
    cell: ({ row }) => <div className="truncate text-sm leading-6">{row.getValue("source")}</div>,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
    cell: ({ row }) => {
      const typeOptions = [
        { value: "Research", label: "Research", className: "bg-purple-100 text-purple-800 hover:bg-purple-200" },
        { value: "Feature", label: "Feature", className: "bg-green-100 text-green-800 hover:bg-green-200" },
        { value: "Bug", label: "Bug", className: "bg-red-100 text-red-800 hover:bg-red-200" },
        { value: "Enhancement", label: "Enhancement", className: "bg-blue-100 text-blue-800 hover:bg-blue-200" },
        {
          value: "Documentation",
          label: "Documentation",
          className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
        },
      ]

      return (
        <EditableSelect
          options={typeOptions}
          initialValue={row.getValue("type")}
          row={row}
          column="type"
          renderValue={(value) => {
            const option = typeOptions.find((opt) => opt.value === value)
            return (
              <Badge
                className={cn(
                  "whitespace-nowrap transition-colors text-sm h-6 px-2 font-medium leading-none",
                  option?.className,
                )}
              >
                {value}
              </Badge>
            )
          }}
        />
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const statusOptions = [
        { value: "New", label: "New", className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200" },
        { value: "In Progress", label: "In Progress", className: "bg-blue-100 text-blue-800 hover:bg-blue-200" },
        { value: "Completed", label: "Completed", className: "bg-green-100 text-green-800 hover:bg-green-200" },
        { value: "Archived", label: "Archived", className: "bg-gray-100 text-gray-800 hover:bg-gray-200" },
      ]

      return (
        <EditableSelect
          options={statusOptions}
          initialValue={row.getValue("status")}
          row={row}
          column="status"
          renderValue={(value) => {
            const option = statusOptions.find((opt) => opt.value === value)
            return (
              <Badge
                className={cn(
                  "whitespace-nowrap transition-colors text-sm h-6 px-2 font-medium leading-none",
                  option?.className,
                )}
              >
                {value}
              </Badge>
            )
          }}
        />
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "score",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Score" />,
    cell: ({ row }) => {
      return <EditableCell initialValue={row.original.score.toString()} row={row} column="score" type="number" />
    },
  },
  {
    accessorKey: "personas",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Personas" />,
    cell: ({ row }) => {
      const personas = row.getValue("personas") as string[]
      return <EditablePersonas initialValue={personas} row={row} column="personas" />
    },
  },
  {
    accessorKey: "opportunities",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Opportunities" />,
    cell: ({ row }) => {
      return <div className="truncate text-sm leading-6">{row.getValue("opportunities")}</div>
    },
  },
  {
    accessorKey: "dateCreated",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Date Created" />,
    cell: ({ row }) => {
      return <div className="truncate text-sm leading-6">{format(row.getValue("dateCreated"), "MM/dd/yyyy")}</div>
    },
  },
  {
    accessorKey: "dateUpdated",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Date Updated" />,
    cell: ({ row }) => {
      return <div className="truncate text-sm leading-6">{format(row.getValue("dateUpdated"), "MM/dd/yyyy")}</div>
    },
  },
  {
    accessorKey: "journey",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Journey" />,
    cell: ({ row }) => <div className="truncate text-sm leading-6">{row.getValue("journey")}</div>,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
