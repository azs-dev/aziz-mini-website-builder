"use client";

import type React from "react";

import { useState, useCallback, useRef } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { SectionLibrary } from "@/components/section-library";
import { PreviewArea } from "@/components/preview-area";
import { SectionEditor } from "@/components/section-editor";
import { Button } from "@/components/ui/button";
import { Download, Upload, Eye, Code } from "lucide-react";
import { toast } from "sonner";

export interface Section {
  id: string;
  type: "header" | "hero" | "features" | "testimonials" | "cta" | "footer";
  props: Record<string, any>;
  order: number;
}

export default function WebsiteBuilder() {
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addSection = useCallback(
    (type: Section["type"]) => {
      const newSection: Section = {
        id: `${type}-${Date.now()}`,
        type,
        props: getDefaultProps(type),
        order: sections.length,
      };
      setSections((prev) => [...prev, newSection]);
      toast("Section Added", {
        description: `${
          type.charAt(0).toUpperCase() + type.slice(1)
        } section has been added to your page.`,
      });
    },
    [sections.length]
  );

  const updateSection = useCallback((id: string, props: Record<string, any>) => {
    setSections((prev) =>
      prev.map((section) => (section.id === id ? { ...section, props } : section))
    );
  }, []);

  const deleteSection = useCallback((id: string) => {
    setSections((prev) => prev.filter((section) => section.id !== id));
    setSelectedSection(null);
    toast("Section Deleted", {
      description: "The section has been removed from your page.",
    });
  }, []);

  const reorderSections = useCallback((dragIndex: number, hoverIndex: number) => {
    setSections((prev) => {
      const dragSection = prev[dragIndex];
      const newSections = [...prev];
      newSections.splice(dragIndex, 1);
      newSections.splice(hoverIndex, 0, dragSection);
      return newSections.map((section, index) => ({ ...section, order: index }));
    });
  }, []);

  const exportDesign = useCallback(() => {
    if (sections.length === 0) {
      toast("Nothing to Export", {
        description: "Add some sections to your page before exporting.",
      });
      return;
    }

    const design = {
      sections,
      timestamp: new Date().toISOString(),
      version: "1.0",
    };
    const blob = new Blob([JSON.stringify(design, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `website-design-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast("Design Exported Successfully! 🎉", {
      description: `Your website design with ${sections.length} sections has been downloaded.`,
    });
  }, [sections]);

  const importDesign = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const design = JSON.parse(e.target?.result as string);
        if (design.sections && Array.isArray(design.sections)) {
          setSections(design.sections);
          setSelectedSection(null);
          toast("Design Imported", {
            description: "Your website design has been successfully loaded.",
          });
        } else {
          throw new Error("Invalid file format");
        }
      } catch (error) {
        toast("Import Failed", {
          description: "The selected file is not a valid design configuration.",
        });
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className='h-screen flex flex-col bg-gray-50'>
        {/* Header */}
        <header className='bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <div className='w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center'>
              <Code className='w-4 h-4 text-white' />
            </div>
            <h1 className='text-xl font-semibold text-gray-900'>Mini Website Builder</h1>
          </div>

          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className='flex items-center gap-2'
            >
              <Eye className='w-4 h-4' />
              {isPreviewMode ? "Edit" : "Preview"}
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => fileInputRef.current?.click()}
              className='flex items-center gap-2'
            >
              <Upload className='w-4 h-4' />
              Import
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={exportDesign}
              className='flex items-center gap-2 bg-transparent'
            >
              <Download className='w-4 h-4' />
              Save to File
            </Button>
          </div>
        </header>

        <div className='flex-1 flex overflow-hidden'>
          {!isPreviewMode && (
            <>
              {/* Section Library Sidebar */}
              <div className='w-80 bg-white border-r border-gray-200 flex flex-col'>
                <SectionLibrary onAddSection={addSection} />
              </div>

              {/* Section Editor Sidebar */}
              {selectedSection && (
                <div className='w-80 bg-white border-r border-gray-200'>
                  <SectionEditor
                    section={selectedSection}
                    onUpdate={updateSection}
                    onDelete={deleteSection}
                    onClose={() => setSelectedSection(null)}
                  />
                </div>
              )}
            </>
          )}

          {/* Preview Area */}
          <div className='flex-1 overflow-auto'>
            <PreviewArea
              sections={sections}
              selectedSection={selectedSection}
              onSelectSection={setSelectedSection}
              onReorderSections={reorderSections}
              isPreviewMode={isPreviewMode}
            />
          </div>
        </div>

        <input
          ref={fileInputRef}
          type='file'
          accept='.json'
          onChange={importDesign}
          className='hidden'
        />
      </div>
    </DndProvider>
  );
}

function getDefaultProps(type: Section["type"]): Record<string, any> {
  switch (type) {
    case "header":
      return {
        title: "Your Brand",
        navigation: ["Home", "About", "Services", "Contact"],
        backgroundColor: "#ffffff",
        textColor: "#1f2937",
      };
    case "hero":
      return {
        title: "Welcome to Our Amazing Website",
        subtitle: "We create beautiful experiences that drive results",
        buttonText: "Get Started",
        buttonLink: "#",
        backgroundImage: "/placeholder.svg?height=600&width=1200",
        backgroundColor: "#1f2937",
        textColor: "#ffffff",
      };
    case "features":
      return {
        title: "Our Features",
        subtitle: "Everything you need to succeed",
        features: [
          {
            title: "Fast Performance",
            description: "Lightning fast loading times",
            icon: "⚡",
          },
          { title: "Responsive Design", description: "Works on all devices", icon: "📱" },
          { title: "24/7 Support", description: "Always here to help", icon: "🛟" },
        ],
        backgroundColor: "#ffffff",
        textColor: "#1f2937",
      };
    case "testimonials":
      return {
        title: "What Our Customers Say",
        testimonials: [
          {
            name: "John Doe",
            role: "CEO, Company",
            content: "Amazing service and great results!",
            avatar: "/placeholder.svg?height=60&width=60",
          },
          {
            name: "Jane Smith",
            role: "Marketing Director",
            content: "Exceeded our expectations in every way.",
            avatar: "/placeholder.svg?height=60&width=60",
          },
        ],
        backgroundColor: "#f9fafb",
        textColor: "#1f2937",
      };
    case "cta":
      return {
        title: "Ready to Get Started?",
        subtitle: "Join thousands of satisfied customers today",
        buttonText: "Start Now",
        buttonLink: "#",
        backgroundColor: "#3b82f6",
        textColor: "#ffffff",
      };
    case "footer":
      return {
        companyName: "Your Company",
        description: "Building amazing experiences since 2024",
        links: [
          { title: "About", url: "#" },
          { title: "Services", url: "#" },
          { title: "Contact", url: "#" },
          { title: "Privacy", url: "#" },
        ],
        backgroundColor: "#1f2937",
        textColor: "#ffffff",
      };
    default:
      return {};
  }
}
