"use client"

import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { X, Trash2, Plus, Minus } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Section, Page } from "@/app/page"

interface SectionEditorProps {
  section: Section
  onUpdate: (id: string, props: Record<string, any>) => void
  onDelete: (id: string) => void
  onClose: () => void
  pages: Page[] // New prop: list of all pages
  onNavigateToPage: (pageId: string) => void // New prop: function to navigate to a page
}

export function SectionEditor({ section, onUpdate, onDelete, onClose, pages, onNavigateToPage }: SectionEditorProps) {
  const [props, setProps] = useState(section.props)

  // Effect to update internal 'props' state when 'section.props' changes
  useEffect(() => {
    setProps(section.props)
  }, [section.props])

  const handleUpdate = (key: string, value: any) => {
    const newProps = { ...props, [key]: value }
    setProps(newProps)
    onUpdate(section.id, newProps)
  }

  const handleArrayUpdate = (key: string, index: number, field: string, value: any) => {
    const array = [...(props[key] || [])]
    array[index] = { ...array[index], [field]: value }
    handleUpdate(key, array)
  }

  const handleArrayAdd = (key: string, defaultItem: any) => {
    const array = [...(props[key] || []), defaultItem]
    handleUpdate(key, array)
  }

  const handleArrayRemove = (key: string, index: number) => {
    const array = [...(props[key] || [])]
    array.splice(index, 1)
    handleUpdate(key, array)
  }

  const renderEditor = () => {
    switch (section.type) {
      case "header":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Brand Name</Label>
              <Input id="title" value={props.title || ""} onChange={(e) => handleUpdate("title", e.target.value)} />
            </div>
            <div>
              <Label>Navigation Items</Label>
              {props.navigation?.map((item: { label: string; link: string }, index: number) => (
                <div key={index} className="border rounded-lg p-3 mt-2 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Item {index + 1}</span>
                    <Button size="sm" variant="outline" onClick={() => handleArrayRemove("navigation", index)}>
                      <Minus className="w-4 h-4" />
                    </Button>
                  </div>
                  <Input
                    placeholder="Label"
                    value={item.label || ""}
                    onChange={(e) => handleArrayUpdate("navigation", index, "label", e.target.value)}
                  />
                  <Select
                    value={pages.some((p) => p.id === item.link) ? item.link : "external"} // Check if link is a page ID
                    onValueChange={(value) =>
                      handleArrayUpdate("navigation", index, "link", value === "external" ? "#" : value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Link to..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="external">External URL</SelectItem>
                      <DropdownMenuSeparator />
                      {pages.map((page) => (
                        <SelectItem key={page.id} value={page.id}>
                          Page: {page.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {(!pages.some((p) => p.id === item.link) || item.link === "#") && ( // Show input if not a page ID or is '#'
                    <Input
                      placeholder="External URL (e.g., #services or https://example.com)"
                      value={item.link || ""}
                      onChange={(e) => handleArrayUpdate("navigation", index, "link", e.target.value)}
                      className="mt-2"
                    />
                  )}
                </div>
              ))}
              <Button
                size="sm"
                variant="outline"
                className="mt-2 bg-transparent"
                onClick={() => handleArrayAdd("navigation", { label: "New Item", link: "#" })}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </div>
          </div>
        )

      case "hero":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={props.title || ""} onChange={(e) => handleUpdate("title", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="subtitle">Subtitle</Label>
              <Textarea
                id="subtitle"
                value={props.subtitle || ""}
                onChange={(e) => handleUpdate("subtitle", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="buttonText">Button Text</Label>
              <Input
                id="buttonText"
                value={props.buttonText || ""}
                onChange={(e) => handleUpdate("buttonText", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="buttonLink">Button Link</Label>
              <Select
                value={pages.some((p) => p.id === props.buttonLink) ? props.buttonLink : "external"} // Check if link is a page ID
                onValueChange={(value) => handleUpdate("buttonLink", value === "external" ? "#" : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Link to..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="external">External URL</SelectItem>
                  <DropdownMenuSeparator />
                  {pages.map((page) => (
                    <SelectItem key={page.id} value={page.id}>
                      Page: {page.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {(!pages.some((p) => p.id === props.buttonLink) || props.buttonLink === "#") && ( // Show input if not a page ID or is '#'
                <Input
                  placeholder="External URL (e.g., #contact or https://example.com)"
                  value={props.buttonLink || ""}
                  onChange={(e) => handleUpdate("buttonLink", e.target.value)}
                  className="mt-2"
                />
              )}
            </div>
            <div>
              <Label htmlFor="backgroundImage">Background Image URL</Label>
              <Input
                id="backgroundImage"
                value={props.backgroundImage || ""}
                onChange={(e) => handleUpdate("backgroundImage", e.target.value)}
              />
            </div>
          </div>
        )

      case "features":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={props.title || ""} onChange={(e) => handleUpdate("title", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                value={props.subtitle || ""}
                onChange={(e) => handleUpdate("subtitle", e.target.value)}
              />
            </div>
            <div>
              <Label>Features</Label>
              {props.features?.map((feature: any, index: number) => (
                <div key={index} className="border rounded-lg p-3 mt-2 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Feature {index + 1}</span>
                    <Button size="sm" variant="outline" onClick={() => handleArrayRemove("features", index)}>
                      <Minus className="w-4 h-4" />
                    </Button>
                  </div>
                  <Input
                    placeholder="Icon (emoji)"
                    value={feature.icon || ""}
                    onChange={(e) => handleArrayUpdate("features", index, "icon", e.target.value)}
                  />
                  <Input
                    placeholder="Title"
                    value={feature.title || ""}
                    onChange={(e) => handleArrayUpdate("features", index, "title", e.target.value)}
                  />
                  <Textarea
                    placeholder="Description"
                    value={feature.description || ""}
                    onChange={(e) => handleArrayUpdate("features", index, "description", e.target.value)}
                  />
                </div>
              ))}
              <Button
                size="sm"
                variant="outline"
                className="mt-2 bg-transparent"
                onClick={() =>
                  handleArrayAdd("features", { title: "New Feature", description: "Feature description", icon: "⭐" })
                }
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Feature
              </Button>
            </div>
          </div>
        )

      case "faq": // Added specific editor for FAQ section
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={props.title || ""} onChange={(e) => handleUpdate("title", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                value={props.subtitle || ""}
                onChange={(e) => handleUpdate("subtitle", e.target.value)}
              />
            </div>
            <div>
              <Label>FAQs</Label>
              {props.faqs?.map((faq: any, index: number) => (
                <div key={index} className="border rounded-lg p-3 mt-2 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">FAQ {index + 1}</span>
                    <Button size="sm" variant="outline" onClick={() => handleArrayRemove("faqs", index)}>
                      <Minus className="w-4 h-4" />
                    </Button>
                  </div>
                  <Input
                    placeholder="Question"
                    value={faq.question || ""}
                    onChange={(e) => handleArrayUpdate("faqs", index, "question", e.target.value)}
                  />
                  <Textarea
                    placeholder="Answer"
                    value={faq.answer || ""}
                    onChange={(e) => handleArrayUpdate("faqs", index, "answer", e.target.value)}
                  />
                </div>
              ))}
              <Button
                size="sm"
                variant="outline"
                className="mt-2 bg-transparent"
                onClick={() => handleArrayAdd("faqs", { question: "New Question", answer: "New Answer" })}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add FAQ
              </Button>
            </div>
          </div>
        )

      default:
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Editor for {section.type} section is not yet implemented.</p>
            {Object.entries(props).map(([key, value]) => (
              <div key={key}>
                <Label htmlFor={key}>{key}</Label>
                <Input
                  id={key}
                  value={typeof value === "string" ? value : JSON.stringify(value)}
                  onChange={(e) => handleUpdate(key, e.target.value)}
                />
              </div>
            ))}
          </div>
        )
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
        <h3 className="text-lg font-semibold">Edit {section.type.charAt(0).toUpperCase() + section.type.slice(1)}</h3>
        <Button size="sm" variant="ghost" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {renderEditor()}

        <Separator className="my-6" />

        <div className="space-y-4">
          <div>
            <Label htmlFor="backgroundColor">Background Color</Label>
            <Input
              id="backgroundColor"
              type="color"
              value={props.backgroundColor || "#ffffff"}
              onChange={(e) => handleUpdate("backgroundColor", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="textColor">Text Color</Label>
            <Input
              id="textColor"
              type="color"
              value={props.textColor || "#000000"}
              onChange={(e) => handleUpdate("textColor", e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-gray-200 flex-shrink-0">
        <Button variant="destructive" size="sm" onClick={() => onDelete(section.id)} className="w-full">
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Section
        </Button>
      </div>
    </div>
  )
}
