"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Plus,
  Layout,
  Zap,
  Star,
  MessageSquare,
  Target,
  Anchor,
  Users,
  DollarSign,
  ImageIcon,
  HelpCircle,
  BarChart3,
  Phone,
  Newspaper,
  PenTool,
} from "lucide-react"

interface SectionLibraryProps {
  onAddSection: (
    type:
      | "header"
      | "hero"
      | "features"
      | "testimonials"
      | "cta"
      | "footer"
      | "about"
      | "pricing"
      | "contact"
      | "gallery"
      | "faq"
      | "newsletter"
      | "services"
      | "stats"
      | "blog",
  ) => void
}

const sectionTypes = [
  {
    type: "header" as const,
    title: "Header",
    description: "Navigation bar with logo and menu items",
    icon: Layout,
    preview: "Logo + Navigation",
    category: "Navigation",
  },
  {
    type: "hero" as const,
    title: "Hero Section",
    description: "Eye-catching banner with call-to-action",
    icon: Zap,
    preview: "Title + Subtitle + Button",
    category: "Hero",
  },
  {
    type: "about" as const,
    title: "About Us",
    description: "Company story with stats and image",
    icon: Users,
    preview: "Story + Stats + Image",
    category: "Content",
  },
  {
    type: "services" as const,
    title: "Services",
    description: "Showcase your services with features",
    icon: Star,
    preview: "Service Cards + Features",
    category: "Content",
  },
  {
    type: "features" as const,
    title: "Features",
    description: "Highlight key features and benefits",
    icon: Star,
    preview: "Feature Grid Layout",
    category: "Content",
  },
  {
    type: "pricing" as const,
    title: "Pricing",
    description: "Pricing plans and packages",
    icon: DollarSign,
    preview: "Pricing Cards",
    category: "Commerce",
  },
  {
    type: "testimonials" as const,
    title: "Testimonials",
    description: "Customer reviews and social proof",
    icon: MessageSquare,
    preview: "Customer Reviews",
    category: "Social Proof",
  },
  {
    type: "gallery" as const,
    title: "Gallery",
    description: "Image gallery or portfolio showcase",
    icon: ImageIcon,
    preview: "Image Grid",
    category: "Media",
  },
  {
    type: "stats" as const,
    title: "Statistics",
    description: "Numbers and achievements showcase",
    icon: BarChart3,
    preview: "Number Counters",
    category: "Social Proof",
  },
  {
    type: "faq" as const,
    title: "FAQ",
    description: "Frequently asked questions",
    icon: HelpCircle,
    preview: "Q&A Accordion",
    category: "Support",
  },
  {
    type: "blog" as const,
    title: "Blog/News",
    description: "Latest articles and news posts",
    icon: PenTool,
    preview: "Article Cards",
    category: "Content",
  },
  {
    type: "contact" as const,
    title: "Contact",
    description: "Contact form and information",
    icon: Phone,
    preview: "Form + Contact Info",
    category: "Contact",
  },
  {
    type: "newsletter" as const,
    title: "Newsletter",
    description: "Email subscription signup",
    icon: Newspaper,
    preview: "Email Signup Form",
    category: "Marketing",
  },
  {
    type: "cta" as const,
    title: "Call to Action",
    description: "Encourage users to take action",
    icon: Target,
    preview: "Action Button Section",
    category: "Marketing",
  },
  {
    type: "footer" as const,
    title: "Footer",
    description: "Bottom section with links and info",
    icon: Anchor,
    preview: "Links + Copyright",
    category: "Navigation",
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
                  <div className="mt-1 text-xs text-blue-600 font-medium">{section.category}</div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
