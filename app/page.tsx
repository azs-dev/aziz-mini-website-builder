"use client";

import type React from "react";

import { useState, useCallback, useRef, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { SectionLibrary } from "@/components/section-library";
import { PreviewArea } from "@/components/preview-area";
import { SectionEditor } from "@/components/section-editor";
import { Button } from "@/components/ui/button";
import { Download, Upload, Eye, Code, Plus, Trash2, Pencil, Copy, BookOpen, Loader2, Eraser } from 'lucide-react';
import { toast } from "sonner";
import Joyride, { type CallBackProps, STATUS, type Step } from "react-joyride";
import {
Dialog,
DialogContent,
DialogHeader,
DialogTitle,
DialogDescription,
DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SectionRenderer from "@/components/section-renderer";

export interface Section {
id: string;
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
  | "faq"
  | "newsletter"
  | "services"
  | "stats"
  | "blog";
props: Record<string, any>;
order: number;
}

export interface Page {
id: string;
name: string;
sections: Section[];
}

export default function WebsiteBuilder() {
const [pages, setPages] = useState<Page[]>([]);
const [currentPageId, setCurrentPageId] = useState<string>("");
const [selectedSection, setSelectedSection] = useState<Section | null>(null);
const [isPreviewMode, setIsPreviewMode] = useState(false);
const fileInputRef = useRef<HTMLInputElement>(null);
const [isPageManagementOpen, setIsPageManagementOpen] = useState(false);
const [pageToRename, setPageToRename] = useState<Page | null>(null);
const [newPageName, setNewPageName] = useState("");
const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);

const [runTour, setRunTour] = useState(false);
const [isClient, setIsClient] = useState(false);

const [tourSteps] = useState<Step[]>([
  {
    target: "body",
    title: "Hi, Welcome to Aziz's Mini Website Builder! Let's take a tour.",
    content: "This serves as my take home exam for the Frontend Engineer position @ Rekaz, Riyadh. 🤞",
    placement: "center",
    disableBeacon: true,
  },
  {
    target: '[data-tut="add-page-button"]',
    title: "Click here to add a new page to your website.",
    content: '',
    placement: "bottom",
  },
  {
    target: '[data-tut="page-select"]',
    title: "Use this dropdown to switch between your website pages.",
    content: '',
    placement: "bottom",
  },
  {
    target: '[data-tut="manage-pages-button"]',
    title: "Open the page management dialog to rename, duplicate, or delete pages.",
    content: '',
    placement: "bottom",
  },
  {
    target: '[data-tut="section-library-sidebar"]',
    title:
      "This is your Section Library. Drag and drop sections from here onto your page.",
      content: '',
    placement: "right",
  },
  {
    target: '[data-tut="preview-area"]',
    title: "This is your main canvas. See your website come to life here!",
    content: '',
    placement: "left",
  },
  {
    target: '[data-tut="preview-toggle-button"]',
    title: "Toggle between Edit mode and Preview mode to see your live site.",
    content: '',
    placement: "bottom",
  },
  {
    target: '[data-tut="import-button"]',
    title: "Import existing website designs from a JSON file.",
    content: '',
    placement: "bottom",
  },
  {
    target: '[data-tut="export-button"]',
    title: "Export your current website design as a JSON file for backup or sharing.",
    content: '',
    placement: "bottom",
  },
  {
    target: "body",
    title: "That's it for the tour! Start building your amazing website now.",
    content: '',
    placement: "center",
  },
]);

useEffect(() => {
  setIsClient(true);
  const hasVisitedBefore = localStorage.getItem("first-time-visit");
  if (hasVisitedBefore === null || hasVisitedBefore === "true") {
    setRunTour(true);
    localStorage.setItem("first-time-visit", "true");
  } else {
    setRunTour(false);
  }

  const savedPages = localStorage.getItem("websiteBuilderPages");
  const savedCurrentPageId = localStorage.getItem("websiteBuilderCurrentPageId");

  if (savedPages) {
    try {
      const parsedPages: Page[] = JSON.parse(savedPages);
      setPages(parsedPages);
      if (savedCurrentPageId && parsedPages.some(p => p.id === savedCurrentPageId)) {
        setCurrentPageId(savedCurrentPageId);
      } else if (parsedPages.length > 0) {
        setCurrentPageId(parsedPages[0].id);
      } else {
        setPages([{ id: "home", name: "Home", sections: [] }]);
        setCurrentPageId("home");
      }
    } catch (error) {
      console.error("Failed to parse saved pages from localStorage", error);
      setPages([{ id: "home", name: "Home", sections: [] }]);
      setCurrentPageId("home");
    }
  } else {
    setPages([{ id: "home", name: "Home", sections: [] }]);
    setCurrentPageId("home");
  }
}, []);

useEffect(() => {
  if (isClient) {
    localStorage.setItem("websiteBuilderPages", JSON.stringify(pages));
  }
}, [pages, isClient]);

useEffect(() => {
  if (isClient && currentPageId) {
    localStorage.setItem("websiteBuilderCurrentPageId", currentPageId);
  }
}, [currentPageId, isClient]);


const handleJoyrideCallback = (data: CallBackProps) => {
  const { status }: any = data;
  if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
    setRunTour(false);
    localStorage.setItem("first-time-visit", "false");
  }
};

const currentPage = pages.find((p) => p.id === currentPageId);

useEffect(() => {
  if (
    selectedSection &&
    !currentPage?.sections.some((s) => s.id === selectedSection.id)
  ) {
    setSelectedSection(null);
  }
}, [currentPage, selectedSection]);

const addSection = useCallback(
  (type: Section["type"]) => {
    setPages((prevPages) =>
      prevPages.map((page) => {
        if (page.id === currentPageId) {
          const newSection: Section = {
            id: `${type}-${Date.now()}`,
            type,
            props: getDefaultProps(type),
            order: page.sections.length,
          };
          return { ...page, sections: [...page.sections, newSection] };
        }
        return page;
      })
    );
    toast.success(
      `${
        type.charAt(0).toUpperCase() + type.slice(1)
      } section has been added to your page.`,
      {
        description: "Section Added",
      }
    );
  },
  [currentPageId]
);

const updateSection = useCallback(
  (id: string, props: Record<string, any>) => {
    setPages((prevPages) =>
      prevPages.map((page) => {
        if (page.id === currentPageId) {
          return {
            ...page,
            sections: page.sections.map((section) =>
              section.id === id ? { ...section, props } : section
            ),
          };
        }
        return page;
      })
    );
    toast.info("Section Updated", {
      description: "The section properties have been saved.",
    });
  },
  [currentPageId]
);

const deleteSection = useCallback(
  (id: string) => {
    setPages((prevPages) =>
      prevPages.map((page) => {
        if (page.id === currentPageId) {
          return {
            ...page,
            sections: page.sections.filter((section) => section.id !== id),
          };
        }
        return page;
      })
    );
    setSelectedSection(null);
    toast.error("Section Deleted", {
      description: "The section has been removed from your page.",
    });
  },
  [currentPageId]
);

const clearAllSections = useCallback(() => {
  setPages((prevPages) =>
    prevPages.map((page) => {
      if (page.id === currentPageId) {
        return {
          ...page,
          sections: [],
        };
      }
      return page;
    })
  );
  setSelectedSection(null);
  setIsClearConfirmOpen(false);
  toast.error("All Sections Cleared", {
    description: "All sections have been removed from the current page.",
  });
}, [currentPageId]);

const reorderSections = useCallback(
  (dragIndex: number, hoverIndex: number) => {
    setPages((prevPages) =>
      prevPages.map((page) => {
        if (page.id === currentPageId) {
          const dragSection = page.sections[dragIndex];
          const newSections = [...page.sections];
          newSections.splice(dragIndex, 1);
          newSections.splice(hoverIndex, 0, dragSection);
          return {
            ...page,
            sections: newSections.map((section, index) => ({
              ...section,
              order: index,
            })),
          };
        }
        return page;
      })
    );
  },
  [currentPageId]
);

const addPage = useCallback(() => {
  const newPageId = `page-${Date.now()}`;
  const newPage: Page = {
    id: newPageId,
    name: `Page ${pages.length + 1}`,
    sections: [],
  };
  setPages((prevPages) => [...prevPages, newPage]);
  setCurrentPageId(newPageId);
  toast.success("Page Added", {
    description: `New page "${newPage.name}" created.`,
  });
}, [pages.length]);

const handleRenamePage = useCallback(() => {
  if (pageToRename && newPageName.trim() !== "") {
    setPages((prevPages) =>
      prevPages.map((page) =>
        page.id === pageToRename.id ? { ...page, name: newPageName.trim() } : page
      )
    );
    toast.success("Page Renamed", {
      description: `Page "${pageToRename.name}" renamed to "${newPageName.trim()}".`,
    });
    setIsPageManagementOpen(false);
    setPageToRename(null);
    setNewPageName("");
  } else if (newPageName.trim() === "") {
    toast.error("Rename Failed", {
      description: "Page name cannot be empty.",
    });
  }
}, [pageToRename, newPageName]);

const duplicatePage = useCallback(
  (pageId: string) => {
    const pageToDuplicate = pages.find((p) => p.id === pageId);
    if (pageToDuplicate) {
      const newPageId = `page-${Date.now()}-copy`;
      const duplicatedPage: Page = {
        ...pageToDuplicate,
        id: newPageId,
        name: `${pageToDuplicate.name} (Copy)`,
        sections: pageToDuplicate.sections.map((section) => ({
          ...section,
          id: `${section.type}-${Date.now()}-${Math.random()
            .toString(36)
            .substring(7)}`,
        })),
      };
      setPages((prevPages) => [...prevPages, duplicatedPage]);
      setCurrentPageId(newPageId);
      toast.success("Page Duplicated", {
        description: `Page "${pageToDuplicate.name}" duplicated as "${duplicatedPage.name}".`,
      });
    }
  },
  [pages]
);

const deletePage = useCallback(
  (pageId: string) => {
    if (pages.length === 1) {
      toast.error("Cannot Delete Page", {
        description: "You must have at least one page in your project.",
      });
      return;
    }
    setPages((prevPages) => prevPages.filter((page) => page.id !== pageId));
    if (currentPageId === pageId) {
      setCurrentPageId(pages.filter((p) => p.id !== pageId)[0]?.id || "home");
    }
    toast.error("Page Deleted", {
      description: "The page has been removed from your project.",
    });
  },
  [pages, currentPageId]
);

const exportDesign = useCallback(() => {
  const design = {
    pages,
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
  toast.success("Design Exported", {
    description: "Your website design has been downloaded as a JSON file.",
  });
}, [pages]);

const importDesign = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const design = JSON.parse(e.target?.result as string);
      if (design.pages && Array.isArray(design.pages)) {
        setPages(design.pages);
        setCurrentPageId(design.pages[0]?.id || "home");
        setSelectedSection(null);
        toast.success("Design Imported", {
          description: "Your website design has been successfully loaded.",
        });
      } else {
        throw new Error("Invalid file format");
      }
    } catch (error) {
      toast.error("Import Failed", {
        description: "The selected file is not a valid design configuration.",
      });
    }
  };
  reader.readAsText(file);
  event.target.value = "";
}, []);

if (!currentPage) {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-gray-700">
      <Loader2 className="h-12 w-12 animate-spin text-blue-500 mb-4" />
      <p className="text-lg font-medium">Loading your website builder...</p>
      <p className="text-sm text-gray-500">Please wait a moment.</p>
    </div>
  );
}

return (
  <DndProvider backend={HTML5Backend}>
    {isClient && (
      <Joyride
        run={runTour}
        steps={tourSteps}
        continuous
        showProgress
        callback={handleJoyrideCallback}
        disableOverlayClose={true}
        locale={{
          last: 'End Tour',
        }}
        styles={{
          tooltipTitle: {
            fontSize: '20px',
            fontWeight: 'bold',
          },
          tooltipContent: {
            fontSize: '16px',
            lineHeight: '25px'
          },
          tooltip: {
            paddingTop: '40px',
            padding: '25px',
            borderRadius: '10px',
          },
          buttonNext: {
            padding: '10px',
            borderRadius: '10px'
          },
          options: {
            width: 500,
            primaryColor: "#3721b5",
            zIndex: 10000,
            beaconSize: 50,
          },
        }}
      />
    )}
    <div className='h-screen flex flex-col bg-gray-50'>
      <header className={`bg-white border-b border-gray-200 px-4 py-3 items-center justify-between ${isPreviewMode ? 'hidden' : 'flex'}`}>
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
            onClick={addPage}
            className='flex items-center gap-2 bg-transparent'
            data-tut='add-page-button'
          >
            <Plus className='w-4 h-4' />
            Add Page
          </Button>

          <Select value={currentPageId} onValueChange={setCurrentPageId}>
            <SelectTrigger className="w-[180px]" data-tut="page-select">
              <SelectValue placeholder="Select a page" />
            </SelectTrigger>
            <SelectContent>
              {pages.map((page) => (
                <SelectItem key={page.id} value={page.id}>
                  {page.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant='outline'
            size='sm'
            onClick={() => setIsPageManagementOpen(true)}
            className='flex items-center gap-2 bg-transparent'
            data-tut='manage-pages-button'
          >
            <BookOpen className='w-4 h-4' />
            Manage Pages
          </Button>
          
          <Button
            variant='outline'
            size='sm'
            onClick={() => fileInputRef.current?.click()}
            className='flex items-center gap-2'
            data-tut='import-button'
          >
            <Upload className='w-4 h-4' />
            Import
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={exportDesign}
            className='flex items-center gap-2 bg-transparent'
            data-tut='export-button'
          >
            <Download className='w-4 h-4' />
            Export
          </Button>
          
          <Button
            variant='destructive'
            size='sm'
            onClick={() => setIsClearConfirmOpen(true)}
            className='flex items-center gap-2 ml-2'
            data-tut='clear-all-button'
          >
            <Eraser className='w-4 h-4' />
            Clear All
          </Button>
        </div>
      </header>

      <div className='flex-1 flex overflow-hidden'>
        <div
          className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out ${
            isPreviewMode ? "w-0 overflow-hidden" : "w-80"
          }`}
          data-tut='section-library-sidebar'
        >
          <SectionLibrary onAddSection={addSection} />
        </div>

        <div
          className={`bg-white border-r border-gray-200 transition-all duration-300 ease-in-out ${
            selectedSection && !isPreviewMode ? "w-80" : "w-0 overflow-hidden"
          }`}
          data-tut='section-editor-sidebar'
        >
          {selectedSection && (
            <SectionEditor
              section={selectedSection}
              onUpdate={updateSection}
              onDelete={deleteSection}
              onClose={() => setSelectedSection(null)}
              pages={pages}
              onNavigateToPage={setCurrentPageId}
            />
          )}
        </div>

        <div className='flex-1 overflow-auto' >
          {" "}
          <PreviewArea
            sections={currentPage.sections}
            selectedSection={selectedSection}
            onSelectSection={setSelectedSection}
            onReorderSections={reorderSections}
            isPreviewMode={isPreviewMode}
            onNavigateToPage={setCurrentPageId}
            onDeleteSection={deleteSection}
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

    <div className="fixed bottom-4 right-4 z-50">
      <Button
        variant='default'
        size='lg'
        onClick={() => setIsPreviewMode(!isPreviewMode)}
        className='flex items-center gap-2 shadow-lg'
        data-tut='preview-toggle-button'
      >
        {isPreviewMode ? <Code className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
        {isPreviewMode ? "Edit" : "Preview"}
      </Button>
    </div>

    <Dialog open={isPageManagementOpen} onOpenChange={setIsPageManagementOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manage Pages</DialogTitle>
          <DialogDescription>
            Rename, duplicate, or delete your website pages.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {pages.map((page) => (
            <div key={page.id} className="flex items-center gap-2">
              <Label htmlFor={`page-name-${page.id}`} className="sr-only">
                Page Name
              </Label>
              <Input
                id={`page-name-${page.id}`}
                value={page.name}
                onChange={(e) => {
                  setPages((prev) =>
                    prev.map((p) =>
                      p.id === page.id ? { ...p, name: e.target.value } : p
                    )
                  );
                  setPageToRename(page);
                  setNewPageName(e.target.value);
                }}
                onBlur={() => {
                  if (pageToRename && newPageName.trim() !== pageToRename.name) {
                    handleRenamePage();
                  }
                }}
                className="flex-1"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => duplicatePage(page.id)}
                title="Duplicate Page"
              >
                <Copy className="w-4 h-4" />
              </Button>
              {pages.length > 1 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deletePage(page.id)}
                  title="Delete Page"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button onClick={() => setIsPageManagementOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <Dialog open={isClearConfirmOpen} onOpenChange={setIsClearConfirmOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Clear All Sections</DialogTitle>
          <DialogDescription>
            Are you sure you want to remove all sections from this page? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-4">
          <Button variant="outline" onClick={() => setIsClearConfirmOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={clearAllSections}>
            Clear All Sections
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </DndProvider>
);
}

function getDefaultProps(type: Section["type"]): Record<string, any> {
const commonProps = {
  backgroundColor: "#ffffff",
  textColor: "#1f2937",
};

switch (type) {
  case "header":
    return {
      title: "Your Brand",
      navigation: [
        { label: "Home", link: "#" },
        { label: "About", link: "#" },
        { label: "Services", link: "#" },
        { label: "Contact", link: "#" },
      ],
      ...commonProps,
    };
  case "hero":
    return {
      title: "Hello from Mini Website Builder",
      subtitle: "Build your dream website in minutes",
      buttonText: "Get Started",
      buttonLink: "#",
      backgroundImage: "",
      buttonBackgroundColor: "#ffffff",
      buttonTextColor: "#1f2937",
      ...commonProps,
    };
  case "about":
    return {
      title: "About Me",
      subtitle: "I am Aziz, passionate about creating amazing experiences through technology",
      description:
        "Graduated in 2020, I've been dedicated to delivering exceptional results with my work. I love combining creativity with technical expertise to help bring visions to life.",
      image: "",
      stats: [
        { number: "500+", label: "Happy Clients" },
        { number: "1000+", label: "Projects Completed" },
        { number: "50+", label: "Team Members" },
      ],
      ...commonProps,
    };
  case "services":
    return {
      title: "Services",
      subtitle: "Everything you need to in web technology",
      services: [
        {
          title: "Web Development",
          description: "Custom websites built with modern technologies",
          icon: "💻",
          features: ["Responsive Design", "Fast Performance", "SEO Optimized"],
        },
        {
          title: "UX Design",
          description: "Craft intuitive and beautiful experiences that delight your users.",
          icon: "✨",
          features: ["User Research", "Wireframing & Prototyping", "Usability Testing"],
        },
        {
          title: "Technology Consulting",
          description: "Gain a competitive edge with expert guidance on your technology strategy.",
          icon: "🧠",
          features: ["Tech Stack Evaluation", "Product Roadmap", "Digital Transformation"],
        },
      ],
      backgroundColor: "#f9fafb",
      textColor: "#1f2937",
    };
  case "features":
    return {
      title: "Features",
      subtitle: "Everything you need to bring your ideas to life",
      features: [
        {
          title: "Fast Performance",
          description: "Lightning fast loading times",
          icon: "⚡",
        },
        { title: "Responsive Design", description: "Works on all devices", icon: "📱" },
        { title: "24/7 Support", description: "Always here to help", icon: "🛟" },
      ],
      ...commonProps,
    };
  case "pricing":
    return {
        "title": "Choose the Perfect Plan",
        "subtitle": "Simple, transparent pricing designed to grow with your business.",
        "plans": [
          {
            "name": "Hobby",
            "price": "0",
            "period": "month",
            "description": "Ideal for individuals and side projects just getting started.",
            "features": ["Up to 5 projects", "Community support", "1GB secure storage"],
            "popular": false
          },
          {
            "name": "Professional",
            "price": "$79",
            "period": "month",
            "description": "The best choice for growing teams and serious projects.",
            "features": [
              "Unlimited projects",
              "Priority support",
              "10GB secure storage",
              "Advanced analytics & reporting"
            ],
            "popular": true
          },
          {
            "name": "Enterprise",
            "price": "$199",
            "period": "month",
            "description": "Tailored for large organizations with complex needs.",
            "features": [
              "All features from Professional",
              "Custom integrations & SSO",
              "Unlimited scalable storage",
              "Dedicated account manager"
            ],
            "popular": false,
          },
        ],
      ...commonProps,
    };
  case "testimonials":
    return {
      title: "What Our Customers Say",
      testimonials: [
        {
          name: "Tim Cook",
          role: "CEO, Apple",
          content: "Amazing service and great results!",
          avatar: "",
        },
        {
          name: "Bill Gates",
          role: "COO, Microsoft",
          content: "Exceeded our expectations in every way.",
          avatar: "",
        },
      ],
      backgroundColor: "#f9fafb",
      textColor: "#1f2937",
    };
  case "faq":
    return {
      title: "Frequently Asked Questions",
      subtitle: "Everything you need to know about our services",
      faqs: 
      [
        {
          "question": "How long does a typical project take?",
          "answer": "While timelines can vary by scope, most projects are completed within a efficient 2-6 week timeframe."
        },
        {
          "question": "Do you offer ongoing support after launch?",
          "answer": "Yes, we provide flexible support and maintenance plans to ensure your website remains secure, fast, and up-to-date."
        },
        {
          "question": "What technologies do you specialize in?",
          "answer": "We build fast and reliable websites using modern technologies, including React, Next.js, and a suite of other cutting-edge tools."
        }
      ],
      backgroundColor: "#f9fafb",
      textColor: "#1f2937",
    };
  case "stats":
    return {
      title: "Our Impact in Numbers",
      stats: [
        { number: "10,000+", label: "Happy Customers", icon: "😊" },
        { number: "99.9%", label: "Uptime Guarantee", icon: "⚡" },
        { number: "24/7", label: "Support Available", icon: "🛟" },
        { number: "50+", label: "Countries Served", icon: "🌍" },
      ],
      backgroundColor: "#1f2937",
      textColor: "#ffffff",
    };
  case "contact":
    return {
      title: "Get in Touch",
      subtitle:
        "We'd love to hear from you. Send us a message and we'll respond as soon as possible.",
      contactInfo: {
        email: "hello@company.com",
        phone: "+1 (555) 123-4567",
        address: "123 Business St, Suite 100, City, State 12345",
      },
      formFields: ["name", "email", "subject", "message"],
      ...commonProps,
    };
  case "newsletter":
    return {
      title: "Stay Updated",
      subtitle:
        "Subscribe to our newsletter and get the latest updates delivered to your inbox",
      placeholder: "Enter your email address",
      buttonText: "Subscribe",
      backgroundColor: "#11353c",
      textColor: "#ffffff",
    };
  case "blog":
  return {
    "title": "Latest News & Updates",
    "subtitle": "Stay informed with our latest articles and insights.",
    "posts": [
      {
        "title": "Mastering Responsive Design: A Guide for Modern Web Development",
        "excerpt": "Learn how to create websites that look stunning and perform flawlessly on any device, from desktops to mobile phones.",
        "image": "",
        "date": "May 20, 2024",
        "author": "Jen Simmons",
        "readTime": "7 min read"
      },
      {
        "title": "Unlocking Performance: The Power of Next.js and Server-Side Rendering",
        "excerpt": "Dive into the benefits of using Next.js to build lightning-fast web applications with superior user experience and SEO.",
        "image": "",
        "date": "May 15, 2024",
        "author": "Guillermo Rauch",
        "readTime": "10 min read"
      },
      {
        "title": "The Rise of AI in UX: Designing for Intelligent Interfaces",
        "excerpt": "Explore how artificial intelligence is transforming user experience design and what it means for the future of digital products.",
        "image": "",
        "date": "May 10, 2024",
        "author": "Don Norman",
        "readTime": "9 min read"
      }
    ]
  }
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
    return commonProps;
}
}
