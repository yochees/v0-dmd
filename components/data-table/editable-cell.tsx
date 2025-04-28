"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import type { Row } from "@tanstack/react-table"
import { Input } from "@/components/ui/input"

interface EditableCellProps {
  initialValue: string
  row: Row<any>
  column: string
  type?: "text" | "number"
}

export function EditableCell({ initialValue, row, column, type = "text" }: EditableCellProps) {
  const [value, setValue] = useState(initialValue)
  const [isEditing, setIsEditing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  const onBlur = () => {
    setIsEditing(false)
    // Here you would typically update the data source
    console.log(`Updated ${column} for row ${row.id} to ${value}`)
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsEditing(false)
      // Here you would typically update the data source
      console.log(`Updated ${column} for row ${row.id} to ${value}`)
    } else if (e.key === "Escape") {
      setIsEditing(false)
      setValue(initialValue)
    }
  }

  if (isEditing) {
    return (
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        type={type}
        className="h-8 w-full text-sm"
      />
    )
  }

  return (
    <div className="w-full cursor-pointer truncate text-sm leading-6" onClick={() => setIsEditing(true)}>
      {value}
    </div>
  )
}
