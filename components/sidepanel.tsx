"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { X, ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface SidepanelProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
}

export function Sidepanel({ isOpen, onClose, children, title }: SidepanelProps) {
  const [isVisible, setIsVisible] = useState(false)

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      setIsVisible(true)
      document.addEventListener("keydown", handleEscape)
      // Prevent body scrolling when sidepanel is open
      document.body.style.overflow = "hidden"
    } else {
      // Add a small delay to allow for the closing animation
      const timer = setTimeout(() => {
        setIsVisible(false)
        document.body.style.overflow = ""
      }, 300)
      return () => clearTimeout(timer)
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = ""
    }
  }, [isOpen, onClose])

  if (!isVisible && !isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0",
        )}
        onClick={onClose}
      />

      {/* Sidepanel */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 flex flex-col w-full max-w-md bg-background shadow-lg border-l transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
            <h2 className="text-lg font-medium">{title || "Details"}</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">{children}</div>
      </div>
    </div>
  )
}
