"use client"

import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { X, Trash2, Plus, Minus } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Section, Page } from "@/app/page"
import Image from "next/image" // Import Image for preview

interface SectionEditorProps {
  section: Section
  onUpdate: (id: string, props: Record<string, any>) => void
  onDelete: (id: string) => void
  onClose: () => void
  pages: Page[] 
  onNavigateToPage: (pageId: string) => void
}

export function SectionEditor({ section, onUpdate, onDelete, onClose, pages, onNavigateToPage }: SectionEditorProps) {
  const [props, setProps] = useState(section.props)

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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, propKey: string, defaultPlaceholder: string) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleUpdate(propKey, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleArrayImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    arrayKey: string,
    index: number,
    field: string,
    defaultPlaceholder: string,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const array = [...(props[arrayKey] || [])];
        array[index] = { ...array[index], [field]: reader.result as string };
        handleUpdate(arrayKey, array);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleArrayImageRemove = (
    arrayKey: string,
    index: number,
    field: string,
    defaultPlaceholder: string,
  ) => {
    const array = [...(props[arrayKey] || [])];
    array[index] = { ...array[index], [field]: defaultPlaceholder };
    handleUpdate(arrayKey, array);
  };

  const renderEditor = () => {
    switch (section.type) {
      case "header":
        return (
          <div className="space-y-6">
            <div className="flex gap-2 flex-col">
              <Label htmlFor="title">Brand Name</Label>
              <Input id="title" value={props.title || ""} onChange={(e) => handleUpdate("title", e.target.value)} />
            </div>
            <div className="flex gap-2 flex-col">
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
                    value={pages.some((p) => p.id === item.link) ? item.link : "external"} 
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
          <div className="space-y-6">
            <div className="flex gap-2 flex-col">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={props.title || ""} onChange={(e) => handleUpdate("title", e.target.value)} />
            </div>
            <div className="flex gap-2 flex-col">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Textarea
                id="subtitle"
                value={props.subtitle || ""}
                onChange={(e) => handleUpdate("subtitle", e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-col">
              <Label htmlFor="buttonText">Button Text</Label>
              <Input
                id="buttonText"
                value={props.buttonText || ""}
                onChange={(e) => handleUpdate("buttonText", e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-col">
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
            {/* Replaced Background Image URL input with file upload */}
            <div className="flex gap-2 flex-col">
              <Label htmlFor="backgroundImageUpload">Background Image</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="backgroundImageUpload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, "backgroundImage", "")} // Changed default placeholder to empty string
                  className="flex-1"
                />
                {props.backgroundImage && ( // Only show remove button if image exists
                  <Button variant="outline" size="sm" onClick={() => handleUpdate("backgroundImage", "")}> {/* Changed default placeholder to empty string */}
                    Remove Image
                  </Button>
                )}
              </div>
              {props.backgroundImage && ( // Only show preview if image exists
                <div className="mt-2">
                  <Image src={props.backgroundImage || "/placeholder.svg"} alt="Current background image preview" width={100} height={60} className="rounded-md object-cover" unoptimized /> {/* Added unoptimized */}
                </div>
              )}
            </div>
            {/* Button Color Options */}
            <div className="flex gap-2 flex-col">
              <Label htmlFor="buttonBackgroundColor">Button Background Color</Label>
              <Input
                id="buttonBackgroundColor"
                type="color"
                value={props.buttonBackgroundColor || "#ffffff"}
                onChange={(e) => handleUpdate("buttonBackgroundColor", e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-col">
              <Label htmlFor="buttonTextColor">Button Text Color</Label>
              <Input
                id="buttonTextColor"
                type="color"
                value={props.buttonTextColor || "#000000"}
                onChange={(e) => handleUpdate("buttonTextColor", e.target.value)}
              />
            </div>
          </div>
        )

      case "features":
        return (
          <div className="space-y-6">
            <div className="flex gap-2 flex-col">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={props.title || ""} onChange={(e) => handleUpdate("title", e.target.value)} />
            </div>
            <div className="flex gap-2 flex-col">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                value={props.subtitle || ""}
                onChange={(e) => handleUpdate("subtitle", e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-col">
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

      case "faq": 
              return (
          <div className="space-y-6">
            <div className="flex gap-2 flex-col">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={props.title || ""} onChange={(e) => handleUpdate("title", e.target.value)} />
            </div>
            <div className="flex gap-2 flex-col">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                value={props.subtitle || ""}
                onChange={(e) => handleUpdate("subtitle", e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-col">
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

        case "about":
      return (
        <div className="space-y-6">
            <div className="flex gap-2 flex-col">
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={props.title || ""} onChange={(e) => handleUpdate("title", e.target.value)} />
          </div>
            <div className="flex gap-2 flex-col">
            <Label htmlFor="subtitle">Subtitle</Label>
            <Textarea
              id="subtitle"
              value={props.subtitle || ""}
              onChange={(e) => handleUpdate("subtitle", e.target.value)}
            />
          </div>
            <div className="flex gap-2 flex-col">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={props.description || ""}
              onChange={(e) => handleUpdate("description", e.target.value)}
            />
          </div>
          {/* Replaced Image URL input with file upload */}
          <div className="flex gap-2 flex-col">
            <Label htmlFor="imageUpload">Image</Label>
            <div className="flex items-center gap-2">
              <Input
                id="imageUpload"
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, "image", "")} // Changed default placeholder to empty string
                className="flex-1"
              />
              {props.image && ( // Only show remove button if image exists
                <Button variant="outline" size="sm" onClick={() => handleUpdate("image", "")}> // Changed default placeholder to empty string
                  Remove Image
                </Button>
              )}
            </div>
            {props.image && ( // Only show preview if image exists
              <div className="mt-2">
                <Image src={props.image || "/placeholder.svg"} alt="Current image preview" width={100} height={100} className="rounded-md object-cover" unoptimized />
              </div>
            )}
          </div>
          <div>
            <Label>Stats</Label>
            {(Array.isArray(props.stats) ? props.stats : []).map((stat: any, index: number) => (
              <div key={index} className="border rounded-lg p-3 mt-2 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Stat {index + 1}</span>
                  <Button size="sm" variant="outline" onClick={() => handleArrayRemove("stats", index)}>
                    <Minus className="w-4 h-4" />
                  </Button>
                </div>
                <Input
                  placeholder="Number"
                  value={stat.number || ""}
                  onChange={(e) => handleArrayUpdate("stats", index, "number", e.target.value)}
                />
                <Input
                  placeholder="Label"
                  value={stat.label || ""}
                  onChange={(e) => handleArrayUpdate("stats", index, "label", e.target.value)}
                />
              </div>
            ))}
            <Button
              size="sm"
              variant="outline"
              className="mt-2 bg-transparent"
              onClick={() => handleArrayAdd("stats", { number: "0", label: "New Stat" })}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Stat
            </Button>
          </div>
        </div>
      )
    case "services":
      return (
        <div className="space-y-6">
            <div className="flex gap-2 flex-col">
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={props.title || ""} onChange={(e) => handleUpdate("title", e.target.value)} />
          </div>
            <div className="flex gap-2 flex-col">
            <Label htmlFor="subtitle">Subtitle</Label>
            <Input
              id="subtitle"
              value={props.subtitle || ""}
              onChange={(e) => handleUpdate("subtitle", e.target.value)}
            />
          </div>
            <div className="flex gap-2 py-4 flex-col">
            <Label>Services</Label>
            {props.services?.map((service: any, index: number) => (
              <div key={index} className="border border-gray-300 rounded-lg p-3 mt-2 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Service {index + 1}</span>
                  <Button size="sm" variant="outline" onClick={() => handleArrayRemove("services", index)}>
                    <Minus className="w-4 h-4" />
                  </Button>
                </div>
                <Input
                  placeholder="Icon (emoji)"
                  value={service.icon || ""}
                  onChange={(e) => handleArrayUpdate("services", index, "icon", e.target.value)}
                />
                <Input
                  placeholder="Title"
                  value={service.title || ""}
                  onChange={(e) => handleArrayUpdate("services", index, "title", e.target.value)}
                />
                <Textarea
                  placeholder="Description"
                  value={service.description || ""}
                  onChange={(e) => handleArrayUpdate("services", index, "description", e.target.value)}
                />
            <div className="flex py-4 flex-col">
                  <Label>Features</Label>
                  {service.features?.map((feature: string, featureIndex: number) => (
                    <div key={featureIndex} className="flex items-center gap-2 mt-1">
                      <Input
                        placeholder="Feature"
                        value={feature || ""}
                        onChange={(e) => {
                          const newFeatures = [...(service.features || [])]
                          newFeatures[featureIndex] = e.target.value
                          handleArrayUpdate("services", index, "features", newFeatures)
                        }}
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const newFeatures = [...(service.features || [])]
                          newFeatures.splice(featureIndex, 1)
                          handleArrayUpdate("services", index, "features", newFeatures)
                        }}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-2 bg-transparent"
                    onClick={() => {
                      const newFeatures = [...(service.features || []), "New Feature"]
                      handleArrayUpdate("services", index, "features", newFeatures)
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Feature
                  </Button>
                </div>
              </div>
            ))}
            <Button
              size="sm"
              variant="outline"
              className="mt-2 bg-transparent"
              onClick={() =>
                handleArrayAdd("services", {
                  title: "New Service",
                  description: "Service description",
                  icon: "✨",
                  features: [],
                })
              }
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Service
            </Button>
          </div>
        </div>
      )
    case "pricing":
      return (
        <div className="space-y-6">
            <div className="flex gap-2 flex-col">
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={props.title || ""} onChange={(e) => handleUpdate("title", e.target.value)} />
          </div>
            <div className="flex gap-2 flex-col">
            <Label htmlFor="subtitle">Subtitle</Label>
            <Input
              id="subtitle"
              value={props.subtitle || ""}
              onChange={(e) => handleUpdate("subtitle", e.target.value)}
            />
          </div>
          <div>
            <Label>Plans</Label>
            {props.plans?.map((plan: any, index: number) => (
              <div key={index} className="border border-gray-300 shadow-xs rounded-lg p-3 my-6 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Plan {index + 1}</span>
                  <Button size="sm" variant="outline" onClick={() => handleArrayRemove("plans", index)}>
                    <Minus className="w-4 h-4" />
                  </Button>
                </div>
                <Input
                  placeholder="Name"
                  value={plan.name || ""}
                  onChange={(e) => handleArrayUpdate("plans", index, "name", e.target.value)}
                />
                <Input
                  placeholder="Price"
                  value={plan.price || ""}
                  onChange={(e) => handleArrayUpdate("plans", index, "price", e.target.value)}
                />
                <Input
                  placeholder="Period (e.g., month, year)"
                  value={plan.period || ""}
                  onChange={(e) => handleArrayUpdate("plans", index, "period", e.target.value)}
                />
                <Textarea
                  placeholder="Description"
                  value={plan.description || ""}
                  onChange={(e) => handleArrayUpdate("plans", index, "description", e.target.value)}
                />
                <div className="flex flex-col py-4">
                  <Label>Features</Label>
                  {plan.features?.map((feature: string, featureIndex: number) => (
                    <div key={featureIndex} className="flex items-center gap-2 my-2">
                      <Input
                        placeholder="Feature"
                        value={feature || ""}
                        onChange={(e) => {
                          const newFeatures = [...(plan.features || [])]
                          newFeatures[featureIndex] = e.target.value
                          handleArrayUpdate("plans", index, "features", newFeatures)
                        }}
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const newFeatures = [...(plan.features || [])]
                          newFeatures.splice(featureIndex, 1)
                          handleArrayUpdate("plans", index, "features", newFeatures)
                        }}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-2 bg-transparent"
                    onClick={() => {
                      const newFeatures = [...(plan.features || []), "New Feature"]
                      handleArrayUpdate("plans", index, "features", newFeatures)
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Feature
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`popular-${index}`}
                    checked={plan.popular || false}
                    onChange={(e) => handleArrayUpdate("plans", index, "popular", e.target.checked)}
                  />
                  <Label htmlFor={`popular-${index}`}>Most Popular</Label>
                </div>
              </div>
            ))}
            <Button
              size="sm"
              variant="outline"
              className="mt-2 bg-transparent"
              onClick={() =>
                handleArrayAdd("plans", {
                  name: "New Plan",
                  price: "$0",
                  period: "month",
                  description: "Plan description",
                  features: [],
                  popular: false,
                })
              }
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Plan
            </Button>
          </div>
        </div>
      )
    case "testimonials":
      return (
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={props.title || ""} onChange={(e) => handleUpdate("title", e.target.value)} />
          </div>
          <div>
            <Label>Testimonials</Label>
            {props.testimonials?.map((testimonial: any, index: number) => (
              <div key={index} className="border border-gray-300 shadow-xs rounded-lg py-4 my-4 p-3 mt-2 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Testimonial {index + 1}</span>
                  <Button size="sm" variant="outline" onClick={() => handleArrayRemove("testimonials", index)}>
                    <Minus className="w-4 h-4" />
                  </Button>
                </div>
                <Input
                  placeholder="Name"
                  value={testimonial.name || ""}
                  onChange={(e) => handleArrayUpdate("testimonials", index, "name", e.target.value)}
                />
                <Input
                  placeholder="Role"
                  value={testimonial.role || ""}
                  onChange={(e) => handleArrayUpdate("testimonials", index, "role", e.target.value)}
                />
                <Textarea
                  placeholder="Content"
                  value={testimonial.content || ""}
                  onChange={(e) => handleArrayUpdate("testimonials", index, "content", e.target.value)}
                />
                {/* Replaced Avatar URL input with file upload */}
                <div className="flex gap-2 flex-col">
                  <Label htmlFor={`avatarUpload-${index}`}>Avatar</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id={`avatarUpload-${index}`}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleArrayImageUpload(e, "testimonials", index, "avatar", "")} // Changed default placeholder to empty string
                      className="flex-1"
                    />
                    {testimonial.avatar && testimonial.avatar !== "" && ( // Only show remove button if image exists
                      <Button variant="outline" size="sm" onClick={() => handleArrayImageRemove("testimonials", index, "avatar", "")}> // Changed default placeholder to empty string
                        Remove Image
                      </Button>
                    )}
                  </div>
                  {testimonial.avatar && ( // Only show preview if image exists
                    <div className="mt-2">
                      <Image src={testimonial.avatar || "/placeholder.svg"} alt="Current avatar preview" width={60} height={60} className="rounded-full object-cover" unoptimized />
                    </div>
                  )}
                </div>
              </div>
            ))}
            <Button
              size="sm"
              variant="outline"
              className="mt-2 bg-transparent"
              onClick={() =>
                handleArrayAdd("testimonials", {
                  name: "New Customer",
                  role: "Role",
                  content: "Amazing product!",
                  avatar: "", // Changed to empty string
                })
              }
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Testimonial
            </Button>
          </div>
        </div>
      )
    case "contact":
      return (
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={props.title || ""} onChange={(e) => handleUpdate("title", e.target.value)} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="subtitle">Subtitle</Label>
            <Textarea
              id="subtitle"
              value={props.subtitle || ""}
              onChange={(e) => handleUpdate("subtitle", e.target.value)}
            />
          </div>
          <div className="border border-gray-300 gap-1 flex flex-col rounded-lg p-3 space-y-2">
            <span className="font-medium">Contact Information</span>
            <Input
              placeholder="Email"
              value={props.contactInfo?.email || ""}
              onChange={(e) => handleUpdate("contactInfo", { ...props.contactInfo, email: e.target.value })}
            />
            <Input
              placeholder="Phone"
              value={props.contactInfo?.phone || ""}
              onChange={(e) => handleUpdate("contactInfo", { ...props.contactInfo, phone: e.target.value })}
            />
            <Textarea
              placeholder="Address"
              value={props.contactInfo?.address || ""}
              onChange={(e) => handleUpdate("contactInfo", { ...props.contactInfo, address: e.target.value })}
            />
          </div>
        </div>
      )
    case "newsletter":
      return (
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={props.title || ""} onChange={(e) => handleUpdate("title", e.target.value)} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="subtitle">Subtitle</Label>
            <Textarea
              id="subtitle"
              value={props.subtitle || ""}
              onChange={(e) => handleUpdate("subtitle", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="placeholder">Input Placeholder</Label>
            <Input
              id="placeholder"
              value={props.placeholder || ""}
              onChange={(e) => handleUpdate("placeholder", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="buttonText">Button Text</Label>
            <Input
              id="buttonText"
              value={props.buttonText || ""}
              onChange={(e) => handleUpdate("buttonText", e.target.value)}
            />
          </div>
        </div>
      )
    case "blog":
      return (
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={props.title || ""} onChange={(e) => handleUpdate("title", e.target.value)} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="subtitle">Subtitle</Label>
            <Input
              id="subtitle"
              value={props.subtitle || ""}
              onChange={(e) => handleUpdate("subtitle", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Posts</Label>
            {props.posts?.map((post: any, index: number) => (
              <div key={index} className="border border-gray-300 shadow-xs my-2 flex flex-col gap-2 py-4 rounded-lg p-3 mt-2 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Post {index + 1}</span>
                  <Button size="sm" variant="outline" onClick={() => handleArrayRemove("posts", index)}>
                    <Minus className="w-4 h-4" />
                  </Button>
                </div>
                <Input
                  placeholder="Title"
                  value={post.title || ""}
                  onChange={(e) => handleArrayUpdate("posts", index, "title", e.target.value)}
                />
                <Textarea
                  placeholder="Excerpt"
                  value={post.excerpt || ""}
                  onChange={(e) => handleArrayUpdate("posts", index, "excerpt", e.target.value)}
                />
                {/* Image Upload for Blog Post */}
                <div className="flex gap-2 flex-col">
                  <Label htmlFor={`blogImageUpload-${index}`}>Image</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id={`blogImageUpload-${index}`}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleArrayImageUpload(e, "posts", index, "image", "")} // Changed default placeholder to empty string
                      className="flex-1"
                    />
                    {post.image && post.image !== "" && ( // Only show remove button if image exists
                      <Button variant="outline" size="sm" onClick={() => handleArrayImageRemove("posts", index, "image", "")}> // Changed default placeholder to empty string
                        Remove Image
                      </Button>
                    )}
                  </div>
                  {post.image && ( // Only show preview if image exists
                    <div className="mt-2">
                      <Image src={post.image || "/placeholder.svg"} alt="Current blog post image preview" width={100} height={60} className="rounded-md object-cover" unoptimized />
                    </div>
                  )}
                </div>
                <Input
                  placeholder="Date"
                  value={post.date || ""}
                  onChange={(e) => handleArrayUpdate("posts", index, "date", e.target.value)}
                />
                <Input
                  placeholder="Author"
                  value={post.author || ""}
                  onChange={(e) => handleArrayUpdate("posts", index, "author", e.target.value)}
                />
                <Input
                  placeholder="Read Time"
                  value={post.readTime || ""}
                  onChange={(e) => handleArrayUpdate("posts", index, "readTime", e.target.value)}
                />
              </div>
            ))}
            <Button
              size="sm"
              variant="outline"
              className="mt-2 bg-transparent"
              onClick={() =>
                handleArrayAdd("posts", {
                  title: "New Blog Post",
                  excerpt: "A short summary of the post.",
                  image: "", // Changed to empty string
                  date: "Month Day, Year",
                  author: "Author Name",
                  readTime: "X min read",
                })
              }
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Post
            </Button>
          </div>
        </div>
      )
    case "cta":
      return (
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={props.title || ""} onChange={(e) => handleUpdate("title", e.target.value)} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="subtitle">Subtitle</Label>
            <Textarea
              id="subtitle"
              value={props.subtitle || ""}
              onChange={(e) => handleUpdate("subtitle", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="buttonText">Button Text</Label>
            <Input
              id="buttonText"
              value={props.buttonText || ""}
              onChange={(e) => handleUpdate("buttonText", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="buttonLink">Button Link</Label>
            <Select
              value={pages.some((p) => p.id === props.buttonLink) ? props.buttonLink : "external"}
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
            {(!pages.some((p) => p.id === props.buttonLink) || props.buttonLink === "#") && (
              <Input
                placeholder="External URL (e.g., #contact or https://example.com)"
                value={props.buttonLink || ""}
                onChange={(e) => handleUpdate("buttonLink", e.target.value)}
                className="mt-2"
              />
            )}
          </div>
        </div>
      )
      case "footer":
        return (
          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={props.companyName || ""}
                onChange={(e) => handleUpdate("companyName", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={props.description || ""}
                onChange={(e) => handleUpdate("description", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Links</Label>
              {props.links?.map((link: any, index: number) => (
                <div key={index} className="border rounded-lg shadow-sm border-gray-300 py-4 my-2 p-3 mt-2 space-y-2">
                  <div className="flex justify-between items-center gap-2">
                    <span className="font-medium">Link {index + 1}</span>
                    <Button size="sm" variant="outline" onClick={() => handleArrayRemove("links", index)}>
                      <Minus className="w-4 h-4" />
                    </Button>
                  </div>
                  <Input
                    placeholder="Title"
                    value={link.title || ""}
                    onChange={(e) => handleArrayUpdate("links", index, "title", e.target.value)}
                  />
                  <Select
                    value={pages.some((p) => p.id === link.url) ? link.url : "external"}
                    onValueChange={(value) => handleArrayUpdate("links", index, "url", value === "external" ? "#" : value)}
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
                  {(!pages.some((p) => p.id === link.url) || link.url === "#") && (
                    <Input
                      placeholder="External URL (e.g., #contact or https://example.com)"
                      value={link.url || ""}
                      onChange={(e) => handleArrayUpdate("links", index, "url", e.target.value)}
                      className="mt-2"
                    />
                  )}
                </div>
              ))}
              <Button
                size="sm"
                variant="outline"
                className="mt-2 bg-transparent"
                onClick={() => handleArrayAdd("links", { title: "New Link", url: "#" })}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Link
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
      <div className="p-4 border-b flex items-center justify-between flex-shrink-0">
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

      <div className="p-4 border-t border-gray-300 flex-shrink-0">
        <Button variant="destructive" size="sm" onClick={() => onDelete(section.id)} className="w-full">
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Section
        </Button>
      </div>
    </div>
  )
}
