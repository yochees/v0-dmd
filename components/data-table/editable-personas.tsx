"use client"

import { useState, useEffect } from "react"
import type { Row } from "@tanstack/react-table"
import { Check, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface EditablePersonasProps {
  initialValue: string[]
  row: Row<any>
  column: string
}

export function EditablePersonas({ initialValue, row, column }: EditablePersonasProps) {
  const [open, setOpen] = useState(false)
  const [selectedPersonas, setSelectedPersonas] = useState<string[]>(initialValue)

  const allPersonas = [
    "Developer",
    "Designer",
    "Manager",
    "Executive",
    "Customer",
    "Support",
    "Marketing",
    "Sales",
    "Product Owner",
  ]

  useEffect(() => {
    setSelectedPersonas(initialValue)
  }, [initialValue])

  const togglePersona = (persona: string) => {
    let newPersonas: string[]

    if (selectedPersonas.includes(persona)) {
      newPersonas = selectedPersonas.filter((p) => p !== persona)
    } else {
      newPersonas = [...selectedPersonas, persona]
    }

    setSelectedPersonas(newPersonas)

    // Here you would typically update the data source
    console.log(`Updated ${column} for row ${row.id} to ${newPersonas.join(", ")}`)
  }

  // Render only the first persona and a count badge if there are more
  const renderPersonas = () => {
    if (selectedPersonas.length === 0) {
      return <span className="text-sm text-muted-foreground">Select personas</span>
    }

    return (
      <div className="flex items-center gap-1">
        <Badge variant="outline" className="text-sm h-6 px-2">
          {selectedPersonas[0]}
        </Badge>

        {selectedPersonas.length > 1 && (
          <Badge variant="secondary" className="text-sm h-6 px-2 ml-1">
            +{selectedPersonas.length - 1}
          </Badge>
        )}
      </div>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-start p-0 h-auto font-normal leading-6"
        >
          {renderPersonas()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandInput placeholder="Search personas..." className="h-9" />
          <CommandList>
            {selectedPersonas.length > 0 && (
              <>
                <CommandGroup heading="Selected">
                  <div className="flex flex-wrap gap-1 p-2">
                    {selectedPersonas.map((persona) => (
                      <Badge key={persona} variant="outline" className="text-sm px-2 py-1 flex items-center gap-1">
                        {persona}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation()
                            togglePersona(persona)
                          }}
                        />
                      </Badge>
                    ))}
                  </div>
                </CommandGroup>
                <CommandSeparator />
              </>
            )}
            <CommandEmpty>No persona found.</CommandEmpty>
            <CommandGroup heading="All Personas">
              {allPersonas.map((persona) => (
                <CommandItem key={persona} value={persona} onSelect={() => togglePersona(persona)}>
                  <Check
                    className={cn("mr-2 h-4 w-4", selectedPersonas.includes(persona) ? "opacity-100" : "opacity-0")}
                  />
                  <span className="text-sm">{persona}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
