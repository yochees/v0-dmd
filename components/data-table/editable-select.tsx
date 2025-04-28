"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { Row } from "@tanstack/react-table"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface EditableSelectProps {
  options: { label: string; value: string; className?: string }[]
  initialValue: string
  row: Row<any>
  column: string
  renderValue?: (value: string) => React.ReactNode
}

export function EditableSelect({ options, initialValue, row, column, renderValue }: EditableSelectProps) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  const handleSelect = (currentValue: string) => {
    setValue(currentValue)
    setOpen(false)
    // Here you would typically update the data source
    console.log(`Updated ${column} for row ${row.id} to ${currentValue}`)
  }

  const selectedOption = options.find((option) => option.value === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-start p-0 h-auto font-normal"
        >
          {renderValue ? (
            renderValue(value)
          ) : (
            <span className="text-sm leading-6">{selectedOption?.label || value}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={`Search ${column}...`} className="h-9" />
          <CommandList>
            <CommandEmpty>No option found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem key={option.value} value={option.value} onSelect={() => handleSelect(option.value)}>
                  <Check className={cn("mr-2 h-4 w-4", value === option.value ? "opacity-100" : "opacity-0")} />
                  <span className="text-sm">{option.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
