"use client";

import type React from "react";

import { useState, useCallback, useRef, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { SectionLibrary } from "@/components/section-library";
import { PreviewArea } from "@/components/preview-area";
import { SectionEditor } from "@/components/section-editor";
import { Button } from "@/components/ui/button";
import {
  Download,
  Upload,
  Eye,
  Code,
  Plus,
  Trash2,
  FileText,
  Copy,
  Pencil,
  BookOpen,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import Joyride, { type CallBackProps, STATUS, type Step } from "react-joyride";

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
    | "gallery"
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
  const [pages, setPages] = useState<Page[]>([
    {
      id: "home",
      name: "Home",
      sections: [],
    },
  ]);
  const [currentPageId, setCurrentPageId] = useState<string>("home");
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Joyride state
  const [runTour, setRunTour] = useState(false);
  const [isClient, setIsClient] = useState(false); // Add this state variable
  const [tourSteps] = useState<Step[]>([
    {
      target: "body",
      content: "Welcome to the Mini Website Builder! Let's take a quick tour.",
      placement: "center",
      disableBeacon: true,
    },
    {
      target: '[data-tut="add-page-button"]',
      content: "Click here to add a new page to your website.",
      placement: "bottom",
    },
    {
      target: '[data-tut="page-management-dropdown"]',
      content:
        "Manage your pages here: switch between them, rename, duplicate, or delete.",
      placement: "bottom",
    },
    {
      target: '[data-tut="section-library-sidebar"]',
      content:
        "This is your Section Library. Drag and drop sections from here onto your page.",
      placement: "right",
    },
    {
      target: '[data-tut="preview-area"]',
      content: "This is your main canvas. See your website come to life here!",
      placement: "left",
    },
    {
      target: '[data-tut="preview-toggle-button"]',
      content: "Toggle between Edit mode and Preview mode to see your live site.",
      placement: "bottom",
    },
    {
      target: '[data-tut="import-button"]',
      content: "Import existing website designs from a JSON file.",
      placement: "bottom",
    },
    {
      target: '[data-tut="export-button"]',
      content: "Export your current website design as a JSON file for backup or sharing.",
      placement: "bottom",
    },
    {
      target: "body",
      content: "That's it for the tour! Start building your amazing website now.",
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
  }, []);

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

  const renamePage = useCallback(
    (pageId: string) => {
      const pageToRename = pages.find((p) => p.id === pageId);
      if (pageToRename) {
        const newName = prompt(
          `Enter new name for "${pageToRename.name}":`,
          pageToRename.name
        );
        if (newName && newName.trim() !== "") {
          setPages((prevPages) =>
            prevPages.map((page) =>
              page.id === pageId ? { ...page, name: newName.trim() } : page
            )
          );
          toast.success("Page Renamed", {
            description: `Page "${pageToRename.name}" renamed to "${newName.trim()}".`,
          });
        } else if (newName !== null) {
          toast.error("Rename Failed", {
            description: "Page name cannot be empty.",
          });
        }
      }
    },
    [pages]
  );

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
        setCurrentPageId(pages[0].id);
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
    return <div>Loading...</div>;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      {isClient && (
        <Joyride
          run={runTour}
          steps={tourSteps}
          continuous
          showProgress
          showSkipButton
          callback={handleJoyrideCallback}
          disableOverlayClose={true}
          styles={{
            options: {
              zIndex: 10000,
            },
          }}
        />
      )}
      <div className='h-screen flex flex-col bg-gray-50'>
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
              onClick={() => setRunTour(true)}
              className='flex items-center gap-2 bg-transparent'
            >
              <BookOpen className='w-4 h-4' />
              Tour
            </Button>

            <Button
              variant='outline'
              size='sm'
              onClick={addPage}
              className='flex items-center gap-2 bg-transparent'
              data-tut='add-page-button' // Joyride target
            >
              <Plus className='w-4 h-4' />
              Add Page
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='outline'
                  size='sm'
                  className='flex items-center gap-2 bg-transparent'
                  data-tut='page-management-dropdown' // Joyride target
                >
                  <FileText className='w-4 h-4' />
                  {currentPage.name}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                {pages.map((page) => (
                  <DropdownMenuItem
                    key={page.id}
                    onClick={() => setCurrentPageId(page.id)}
                  >
                    {page.name} {page.id === currentPageId && "(Current)"}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => renamePage(currentPageId)}>
                  <Pencil className='w-4 h-4 mr-2' />
                  Rename Current Page
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => duplicatePage(currentPageId)}>
                  <Copy className='w-4 h-4 mr-2' />
                  Duplicate Current Page
                </DropdownMenuItem>
                {pages.length > 1 && (
                  <DropdownMenuItem
                    onClick={() => deletePage(currentPageId)}
                    className='text-red-600'
                  >
                    <Trash2 className='w-4 h-4 mr-2' />
                    Delete Current Page
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant='outline'
              size='sm'
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className='flex items-center gap-2'
              data-tut='preview-toggle-button' // Joyride target
            >
              <Eye className='w-4 h-4' />
              {isPreviewMode ? "Edit" : "Preview"}
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => fileInputRef.current?.click()}
              className='flex items-center gap-2'
              data-tut='import-button' // Joyride target
            >
              <Upload className='w-4 h-4' />
              Import
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={exportDesign}
              className='flex items-center gap-2 bg-transparent'
              data-tut='export-button' // Joyride target
            >
              <Download className='w-4 h-4' />
              Export
            </Button>
          </div>
        </header>

        <div className='flex-1 flex overflow-hidden'>
          <div
            className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out ${
              isPreviewMode ? "w-0 overflow-hidden" : "w-80"
            }`}
            data-tut='section-library-sidebar' // Joyride target
          >
            <SectionLibrary onAddSection={addSection} />
          </div>

          <div
            className={`bg-white border-r border-gray-200 transition-all duration-300 ease-in-out ${
              selectedSection && !isPreviewMode ? "w-80" : "w-0 overflow-hidden"
            }`}
            data-tut='section-editor-sidebar' // Joyride target (will only show if a section is selected)
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

          <div className='flex-1 overflow-auto' data-tut='preview-area'>
            {" "}
            {/*Joyride target */}
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
        title: "Welcome to Our Amazing Website",
        subtitle: "We create beautiful experiences that drive results",
        buttonText: "Get Started",
        buttonLink: "#",
        backgroundImage: "/placeholder.svg?height=600&width=1200",
        ...commonProps,
      };
    case "about":
      return {
        title: "About Our Company",
        subtitle: "We're passionate about creating amazing experiences",
        description:
          "Founded in 2020, we've been dedicated to delivering exceptional results for our clients. Our team of experts combines creativity with technical expertise to bring your vision to life.",
        image: "/placeholder.svg?height=400&width=600",
        stats: [
          { number: "500+", label: "Happy Clients" },
          { number: "1000+", label: "Projects Completed" },
          { number: "50+", label: "Team Members" },
        ],
        ...commonProps,
      };
    case "services":
      return {
        title: "Our Services",
        subtitle: "Everything you need to grow your business",
        services: [
          {
            title: "Web Development",
            description: "Custom websites built with modern technologies",
            icon: "💻",
            features: ["Responsive Design", "Fast Performance", "SEO Optimized"],
          },
          {
            title: "Digital Marketing",
            description: "Grow your online presence and reach more customers",
            icon: "📈",
            features: ["Social Media", "Content Marketing", "PPC Advertising"],
          },
          {
            title: "Consulting",
            description: "Strategic guidance to help your business succeed",
            icon: "🎯",
            features: ["Business Strategy", "Process Optimization", "Growth Planning"],
          },
        ],
        backgroundColor: "#f9fafb",
        textColor: "#1f2937",
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
        ...commonProps,
      };
    case "pricing":
      return {
        title: "Choose Your Plan",
        subtitle: "Simple, transparent pricing that grows with you",
        plans: [
          {
            name: "Starter",
            price: "$29",
            period: "month",
            description: "Perfect for small businesses",
            features: ["Up to 5 projects", "Basic support", "1GB storage"],
            popular: false,
          },
          {
            name: "Professional",
            price: "$79",
            period: "month",
            description: "Best for growing companies",
            features: [
              "Unlimited projects",
              "Priority support",
              "10GB storage",
              "Advanced analytics",
            ],
            popular: true,
          },
          {
            name: "Enterprise",
            price: "$199",
            period: "month",
            description: "For large organizations",
            features: [
              "Everything in Pro",
              "Custom integrations",
              "Unlimited storage",
              "Dedicated manager",
            ],
            popular: false,
          },
        ],
        ...commonProps,
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
    case "gallery":
      return {
        title: "Our Work",
        subtitle: "Take a look at some of our recent projects",
        images: [
          {
            url: "/placeholder.svg?height=300&width=400",
            alt: "Project 1",
            title: "Modern Website Design",
          },
          {
            url: "/placeholder.svg?height=300&width=400",
            alt: "Project 2",
            title: "E-commerce Platform",
          },
          {
            url: "/placeholder.svg?height=300&width=400",
            alt: "Project 3",
            title: "Mobile App Design",
          },
          {
            url: "/placeholder.svg?height=300&width=400",
            alt: "Project 4",
            title: "Brand Identity",
          },
          {
            url: "/placeholder.svg?height=300&width=400",
            alt: "Project 5",
            title: "Digital Marketing",
          },
          {
            url: "/placeholder.svg?height=300&width=400",
            alt: "Project 6",
            title: "Web Application",
          },
        ],
        ...commonProps,
      };
    case "faq":
      return {
        title: "Frequently Asked Questions",
        subtitle: "Everything you need to know about our services",
        faqs: [
          {
            question: "How long does it take to complete a project?",
            answer:
              "Project timelines vary depending on complexity, but most projects are completed within 2-6 weeks.",
          },
          {
            question: "Do you provide ongoing support?",
            answer:
              "Yes, we offer various support packages to ensure your website continues to perform optimally.",
          },
          {
            question: "Can you work with my existing brand?",
            answer:
              "We can work with your existing brand guidelines or help you develop new ones.",
          },
          {
            question: "What technologies do you use?",
            answer:
              "We use modern technologies like React, Next.js, and other cutting-edge tools to build fast, reliable websites.",
          },
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
        backgroundColor: "#3b82f6",
        textColor: "#ffffff",
      };
    case "blog":
      return {
        title: "Latest News & Updates",
        subtitle: "Stay informed with our latest articles and insights",
        posts: [
          {
            title: "10 Tips for Better Web Design",
            excerpt:
              "Learn the essential principles that make websites both beautiful and functional.",
            image: "/placeholder.svg?height=200&width=300",
            date: "March 15, 2024",
            author: "John Smith",
            readTime: "5 min read",
          },
          {
            title: "The Future of Digital Marketing",
            excerpt:
              "Explore emerging trends and technologies shaping the digital marketing landscape.",
            image: "/placeholder.svg?height=200&width=300",
            date: "March 10, 2024",
            author: "Sarah Johnson",
            readTime: "8 min read",
          },
          {
            title: "Building Scalable Web Applications",
            excerpt:
              "Best practices for creating web applications that can grow with your business.",
            image: "/placeholder.svg?height=200&width=300",
            date: "March 5, 2024",
            author: "Mike Davis",
            readTime: "12 min read",
          },
        ],
        ...commonProps,
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
      return commonProps;
  }
}
