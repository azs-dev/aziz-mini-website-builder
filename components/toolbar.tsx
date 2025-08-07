"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Undo, Redo, Save, Eye, Code, Smartphone, Tablet, Monitor } from "lucide-react"

interface ToolbarProps {
  onPreviewToggle: () => void
  isPreviewMode: boolean
}

export function Toolbar({ onPreviewToggle, isPreviewMode }: ToolbarProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center gap-2">
      <div className="flex items-center gap-1">
        <Button size="sm" variant="ghost" disabled>
          <Undo className="w-4 h-4" />
        </Button>
        <Button size="sm" variant="ghost" disabled>
          <Redo className="w-4 h-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      <div className="flex items-center gap-1">
        <Button size="sm" variant="ghost">
          <Save className="w-4 h-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      <div className="flex items-center gap-1">
        <Button size="sm" variant={isPreviewMode ? "default" : "ghost"} onClick={onPreviewToggle}>
          {isPreviewMode ? <Code className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      <div className="flex items-center gap-1">
        <Button size="sm" variant="ghost">
          <Smartphone className="w-4 h-4" />
        </Button>
        <Button size="sm" variant="ghost">
          <Tablet className="w-4 h-4" />
        </Button>
        <Button size="sm" variant="ghost">
          <Monitor className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
