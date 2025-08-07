"use client"

import { useRef } from "react"
import { useDrop } from "react-dnd"
import SectionRenderer from "@/components/section-renderer" // Updated to default import
import { DraggableSection } from "@/components/draggable-section"
import type { Section } from "@/app/page"

interface PreviewAreaProps {
  sections: Section[]
  selectedSection: Section | null
  onSelectSection: (section: Section | null) => void
  onReorderSections: (dragIndex: number, hoverIndex: number) => void
  isPreviewMode: boolean
  onNavigateToPage: (pageId: string) => void
  onDeleteSection: (sectionId: string) => void // New prop for deleting sections
}

export function PreviewArea({
  sections,
  selectedSection,
  onSelectSection,
  onReorderSections,
  isPreviewMode,
  onNavigateToPage,
  onDeleteSection, // Destructure new prop
}: PreviewAreaProps) {
  const [, drop] = useDrop({
    accept: "section",
    drop: () => ({ type: "preview-area" }),
  })

  const ref = useRef<HTMLDivElement>(null)
  drop(ref)

  if (sections.length === 0) {
    return (
      <div ref={ref} className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📄</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Start Building Your Website</h3>
          <p className="text-gray-600 max-w-sm">
            Add sections from the library to start creating your website. Drag and drop to reorder them.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div ref={ref} className={`min-h-full ${isPreviewMode ? "bg-white" : "bg-gray-50 p-4"}`}>
      <div className={`${isPreviewMode ? "" : "max-w-6xl mx-auto space-y-4"}`}>
        {sections
          .sort((a, b) => a.order - b.order)
          .map((section, index) =>
            isPreviewMode ? (
              <SectionRenderer key={section.id} section={section} onNavigateToPage={onNavigateToPage} />
            ) : (
              <DraggableSection
                key={section.id}
                section={section}
                index={index}
                isSelected={selectedSection?.id === section.id}
                onSelect={() => onSelectSection(section)}
                onReorder={onReorderSections}
                onNavigateToPage={onNavigateToPage}
                onDelete={onDeleteSection} // Pass onDeleteSection to DraggableSection
              />
            ),
          )}
      </div>
    </div>
  )
}
