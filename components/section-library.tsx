"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Layout, Zap, Star, MessageSquare, Target, Anchor } from "lucide-react"

interface SectionLibraryProps {
  onAddSection: (type: "header" | "hero" | "features" | "testimonials" | "cta" | "footer") => void
}

const sectionTypes = [
  {
    type: "header" as const,
    title: "Header",
    description: "Navigation bar with logo and menu items",
    icon: Layout,
    preview: "Logo + Navigation",
  },
  {
    type: "hero" as const,
    title: "Hero Section",
    description: "Eye-catching banner with call-to-action",
    icon: Zap,
    preview: "Title + Subtitle + Button",
  },
  {
    type: "features" as const,
    title: "Features",
    description: "Showcase your key features and benefits",
    icon: Star,
    preview: "Feature Grid Layout",
  },
  {
    type: "testimonials" as const,
    title: "Testimonials",
    description: "Customer reviews and social proof",
    icon: MessageSquare,
    preview: "Customer Reviews",
  },
  {
    type: "cta" as const,
    title: "Call to Action",
    description: "Encourage users to take action",
    icon: Target,
    preview: "Action Button Section",
  },
  {
    type: "footer" as const,
    title: "Footer",
    description: "Bottom section with links and info",
    icon: Anchor,
    preview: "Links + Copyright",
  },
]

export function SectionLibrary({ onAddSection }: SectionLibraryProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <h2 className="text-lg font-semibold text-gray-900">Section Library</h2>
        <p className="text-sm text-gray-600 mt-1">Click to add sections to your page</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {sectionTypes.map((section) => {
            const IconComponent = section.icon
            return (
              <Card key={section.type} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-sm">{section.title}</CardTitle>
                        <CardDescription className="text-xs">{section.description}</CardDescription>
                      </div>
                    </div>
                    <Button size="sm" onClick={() => onAddSection(section.type)} className="h-8 w-8 p-0">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="bg-gray-50 rounded-md p-2 text-xs text-gray-600 text-center">{section.preview}</div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
