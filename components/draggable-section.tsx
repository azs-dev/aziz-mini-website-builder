"use client"

import { useRef } from "react"
import { useDrag, useDrop } from "react-dnd"
import { SectionRenderer } from "@/components/section-renderer"
import { Button } from "@/components/ui/button"
import { GripVertical, Settings } from "lucide-react"
import type { Section } from "@/app/page"

interface DraggableSectionProps {
  section: Section
  index: number
  isSelected: boolean
  onSelect: () => void
  onReorder: (dragIndex: number, hoverIndex: number) => void
  onNavigateToPage: (pageId: string) => void // New prop
}

export function DraggableSection({
  section,
  index,
  isSelected,
  onSelect,
  onReorder,
  onNavigateToPage, // Destructure new prop
}: DraggableSectionProps) {
  const ref = useRef<HTMLDivElement>(null)

  const [{ isDragging }, drag, preview] = useDrag({
    type: "section",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [, drop] = useDrop({
    accept: "section",
    hover: (item: { index: number }) => {
      if (!ref.current) return

      const dragIndex = item.index
      const hoverIndex = index

      if (dragIndex === hoverIndex) return

      onReorder(dragIndex, hoverIndex)
      item.index = hoverIndex
    },
  })

  preview(drop(ref))

  return (
    <div
      ref={ref}
      className={`relative group transition-all duration-200 ${isDragging ? "opacity-50" : ""} ${
        isSelected ? "ring-2 ring-blue-500 ring-offset-2" : ""
      }`}
      onClick={onSelect}
    >
      {/* Drag Handle */}
      <div
        ref={drag}
        className="absolute left-2 top-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity cursor-move"
      >
        <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
          <GripVertical className="w-4 h-4" />
        </Button>
      </div>

      {/* Edit Button */}
      <div className="absolute right-2 top-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
          <Settings className="w-4 h-4" />
        </Button>
      </div>

      {/* Section Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <SectionRenderer section={section} onNavigateToPage={onNavigateToPage} /> {/* Pass onNavigateToPage */}
      </div>

      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-br-md">
            {section.type.charAt(0).toUpperCase() + section.type.slice(1)}
          </div>
        </div>
      )}
    </div>
  )
}
