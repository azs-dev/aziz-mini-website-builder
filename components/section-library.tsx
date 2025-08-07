"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Layout, Zap, Star, MessageSquare, Target, Anchor, Users, DollarSign, ImageIcon, HelpCircle, BarChart3, Phone, Newspaper, PenTool } from 'lucide-react'

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
  color: "from-blue-500 to-blue-600",
  bgColor: "bg-blue-50",
  iconColor: "text-blue-600",
},
{
  type: "hero" as const,
  title: "Hero Section",
  description: "Eye-catching banner with call-to-action",
  icon: Zap,
  color: "from-purple-500 to-pink-500",
  bgColor: "bg-purple-50",
  iconColor: "text-purple-600",
},
{
  type: "about" as const,
  title: "About Us",
  description: "Company story with stats and image",
  icon: Users,
  color: "from-green-500 to-emerald-500",
  bgColor: "bg-green-50",
  iconColor: "text-green-600",
},
{
  type: "services" as const,
  title: "Services",
  description: "Showcase your services with features",
  icon: Star,
  color: "from-amber-500 to-orange-500",
  bgColor: "bg-amber-50",
  iconColor: "text-amber-600",
},
{
  type: "features" as const,
  title: "Features",
  description: "Highlight key features and benefits",
  icon: Star,
  color: "from-cyan-500 to-blue-500",
  bgColor: "bg-cyan-50",
  iconColor: "text-cyan-600",
},
{
  type: "pricing" as const,
  title: "Pricing",
  description: "Pricing plans and packages",
  icon: DollarSign,
  color: "from-emerald-500 to-teal-500",
  bgColor: "bg-emerald-50",
  iconColor: "text-emerald-600",
},
{
  type: "testimonials" as const,
  title: "Testimonials",
  description: "Customer reviews and social proof",
  icon: MessageSquare,
  color: "from-rose-500 to-pink-500",
  bgColor: "bg-rose-50",
  iconColor: "text-rose-600",
},
{
  type: "stats" as const,
  title: "Statistics",
  description: "Numbers and achievements showcase",
  icon: BarChart3,
  color: "from-indigo-500 to-blue-600",
  bgColor: "bg-indigo-50",
  iconColor: "text-indigo-600",
},
{
  type: "faq" as const,
  title: "FAQ",
  description: "Frequently asked questions",
  icon: HelpCircle,
  color: "from-teal-500 to-cyan-500",
  bgColor: "bg-teal-50",
  iconColor: "text-teal-600",
},
{
  type: "blog" as const,
  title: "Blog/News",
  description: "Latest articles and news posts",
  icon: PenTool,
  color: "from-orange-500 to-red-500",
  bgColor: "bg-orange-50",
  iconColor: "text-orange-600",
},
{
  type: "contact" as const,
  title: "Contact",
  description: "Contact form and information",
  icon: Phone,
  color: "from-blue-600 to-indigo-600",
  bgColor: "bg-blue-50",
  iconColor: "text-blue-600",
},
{
  type: "newsletter" as const,
  title: "Newsletter",
  description: "Email subscription signup",
  icon: Newspaper,
  color: "from-pink-500 to-rose-500",
  bgColor: "bg-pink-50",
  iconColor: "text-pink-600",
},
{
  type: "cta" as const,
  title: "Call to Action",
  description: "Encourage users to take action",
  icon: Target,
  color: "from-red-500 to-pink-500",
  bgColor: "bg-red-50",
  iconColor: "text-red-600",
},
{
  type: "footer" as const,
  title: "Footer",
  description: "Bottom section with links and info",
  icon: Anchor,
  color: "from-gray-600 to-gray-700",
  bgColor: "bg-gray-50",
  iconColor: "text-gray-600",
},
]

const SectionPreview = ({ type, color }: { type: string; color: string }) => {
const baseClasses = "w-full h-20 rounded-lg overflow-hidden shadow-inner border border-gray-100"

switch (type) {
  case "header":
    return (
      <div className={`${baseClasses} bg-white relative`}>
        <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-white"></div>
        <div className="relative h-full flex items-center justify-between px-3 border-b-2 border-gray-100">
          <div className="flex items-center gap-1 mr-4">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded"></div>
            <div className="font-semibold text-sm text-gray-700">Brand</div>
          </div>
          <div className="flex gap-4">
            {['Home', 'About', 'Contact'].map((item, i) => (
              <div key={i} className="px-2 py-1 text-xs text-gray-600 transition-colors">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  
  case "hero":
    return (
      <div className={`${baseClasses} bg-gradient-to-br ${color} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative h-full flex flex-col items-center justify-center text-white px-3">
          <div className="w-16 h-2 bg-white/90 rounded-full mb-1"></div>
          <div className="w-12 h-1.5 bg-white/70 rounded-full mb-2"></div>
          <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">
            Get Started
          </div>
        </div>
        <div className="absolute top-2 right-2 w-8 h-8 bg-white/10 rounded-full"></div>
        <div className="absolute bottom-2 left-2 w-6 h-6 bg-white/10 rounded-full"></div>
      </div>
    )
  
  case "features":
    return (
      <div className={`${baseClasses} bg-gradient-to-br from-gray-50 to-white p-2`}>
        <div className="grid grid-cols-3 gap-1.5 h-full">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-md shadow-sm border border-gray-100 p-1.5 flex flex-col items-center justify-center">
              <div className={`w-3 h-3 bg-gradient-to-br ${color} rounded-full mb-1`}></div>
              <div className="w-6 h-0.5 bg-gray-300 rounded-full mb-0.5"></div>
              <div className="w-4 h-0.5 bg-gray-200 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
    )
  
  case "about":
    return (
      <div className={`${baseClasses} bg-gradient-to-br from-gray-50 to-white p-2 flex gap-2`}>
        <div className="flex-1 space-y-1">
          <div className="w-full h-1 bg-gray-700 rounded-full"></div>
          <div className="w-4/5 h-0.5 bg-gray-400 rounded-full"></div>
          <div className="w-3/5 h-0.5 bg-gray-300 rounded-full"></div>
          <div className="flex gap-1 mt-2">
            <div className="flex-1 text-center">
              <div className="text-xs font-bold text-blue-600">500+</div>
              <div className="w-full h-0.5 bg-blue-200 rounded-full"></div>
            </div>
            <div className="flex-1 text-center">
              <div className="text-xs font-bold text-green-600">1K+</div>
              <div className="w-full h-0.5 bg-green-200 rounded-full"></div>
            </div>
          </div>
        </div>
        <div className="w-8 h-full bg-gradient-to-br from-gray-200 to-gray-300 rounded-md shadow-inner"></div>
      </div>
    )
  
  case "services":
    return (
      <div className={`${baseClasses} bg-gradient-to-br from-gray-50 to-white p-2`}>
        <div className="grid grid-cols-3 gap-1.5 h-full">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-md shadow-sm border border-gray-100 p-1 relative overflow-hidden">
              <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${color}`}></div>
              <div className={`w-2.5 h-2.5 bg-gradient-to-br ${color} rounded-full mb-1 mt-0.5`}></div>
              <div className="w-full h-0.5 bg-gray-400 rounded-full mb-0.5"></div>
              <div className="w-3/4 h-0.5 bg-gray-300 rounded-full mb-1"></div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-0.5">
                  <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                  <div className="w-4 h-0.5 bg-gray-200 rounded-full"></div>
                </div>
                <div className="flex items-center gap-0.5">
                  <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                  <div className="w-3 h-0.5 bg-gray-200 rounded-full"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  
  case "pricing":
    return (
      <div className={`${baseClasses} bg-gradient-to-br from-gray-50 to-white p-2`}>
        <div className="grid grid-cols-3 gap-1.5 h-full">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`rounded-md shadow-sm p-1 relative ${i === 2 ? 'bg-gradient-to-br ' + color + ' text-white scale-105' : 'bg-white border border-gray-100'}`}>
              {i === 2 && <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-1 bg-yellow-400 rounded-full"></div>}
              <div className={`w-full h-0.5 ${i === 2 ? 'bg-white/80' : 'bg-gray-400'} rounded-full mb-1`}></div>
              <div className={`text-xs font-bold ${i === 2 ? 'text-white' : 'text-green-600'} mb-1`}>$29</div>
              <div className="space-y-0.5">
                <div className={`w-full h-0.5 ${i === 2 ? 'bg-white/60' : 'bg-gray-200'} rounded-full`}></div>
                <div className={`w-3/4 h-0.5 ${i === 2 ? 'bg-white/60' : 'bg-gray-200'} rounded-full`}></div>
              </div>
              <div className={`w-full h-1.5 ${i === 2 ? 'bg-white/20' : 'bg-gray-100'} rounded-full mt-1`}></div>
            </div>
          ))}
        </div>
      </div>
    )
  
  case "testimonials":
    return (
      <div className={`${baseClasses} bg-gradient-to-br from-gray-50 to-white p-2`}>
        <div className="grid grid-cols-2 gap-1.5 h-full">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-md shadow-sm border border-gray-100 p-1.5 relative">
              <div className="absolute top-1 right-1 text-yellow-400 text-xs">★★★★★</div>
              <div className="w-full h-0.5 bg-gray-300 rounded-full mb-1"></div>
              <div className="w-4/5 h-0.5 bg-gray-300 rounded-full mb-2"></div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full"></div>
                <div className="space-y-0.5">
                  <div className="w-6 h-0.5 bg-gray-600 rounded-full"></div>
                  <div className="w-4 h-0.5 bg-gray-400 rounded-full"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  
  case "stats":
    return (
      <div className={`${baseClasses} bg-gradient-to-br from-gray-800 to-gray-900 p-2`}>
        <div className="grid grid-cols-4 gap-1 h-full">
          {['📊', '⚡', '🎯', '🌟'].map((icon, i) => (
            <div key={i} className="text-center flex flex-col items-center justify-center">
              <div className="text-sm mb-0.5">{icon}</div>
              <div className="text-xs font-bold text-white">1K+</div>
              <div className="w-4 h-0.5 bg-white/60 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
    )
  
  case "faq":
    return (
      <div className={`${baseClasses} bg-gradient-to-br from-gray-50 to-white p-2 space-y-1`}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white border border-gray-100 rounded-md p-1 shadow-sm flex items-center justify-between">
            <div className="w-8 h-0.5 bg-gray-600 rounded-full"></div>
            <div className="w-2 h-2 border border-gray-400 rounded-sm flex items-center justify-center">
              <div className="w-0.5 h-0.5 bg-gray-400"></div>
            </div>
          </div>
        ))}
      </div>
    )
  
  case "blog":
    return (
      <div className={`${baseClasses} bg-gradient-to-br from-gray-50 to-white p-2`}>
        <div className="grid grid-cols-3 gap-1.5 h-full">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-md shadow-sm overflow-hidden">
              <div className={`w-full h-3 bg-gradient-to-r ${color}`}></div>
              <div className="p-1 space-y-0.5">
                <div className="w-full h-0.5 bg-gray-600 rounded-full"></div>
                <div className="w-4/5 h-0.5 bg-gray-400 rounded-full"></div>
                <div className="flex items-center gap-0.5 mt-1">
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  <div className="w-3 h-0.5 bg-gray-300 rounded-full"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  
  case "contact":
    return (
      <div className={`${baseClasses} bg-gradient-to-br from-gray-50 to-white p-2 flex gap-2`}>
        <div className="flex-1 space-y-1">
          <div className="w-full h-0.5 bg-gray-600 rounded-full"></div>
          <div className="w-4/5 h-0.5 bg-gray-400 rounded-full"></div>
          <div className="space-y-0.5 mt-2">
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
              <div className="w-6 h-0.5 bg-gray-400 rounded-full"></div>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              <div className="w-5 h-0.5 bg-gray-400 rounded-full"></div>
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-0.5">
          <div className="w-full h-1 bg-white border border-gray-200 rounded-sm"></div>
          <div className="w-full h-1 bg-white border border-gray-200 rounded-sm"></div>
          <div className="w-full h-2.5 bg-white border border-gray-200 rounded-sm"></div>
          <div className={`w-full h-1 bg-gradient-to-r ${color} rounded-sm`}></div>
        </div>
      </div>
    )
  
  case "newsletter":
    return (
      <div className={`${baseClasses} bg-gradient-to-br ${color} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative h-full flex flex-col items-center justify-center text-white px-3">
          <div className="w-12 h-1.5 bg-white/90 rounded-full mb-1"></div>
          <div className="w-8 h-1 bg-white/70 rounded-full mb-2"></div>
          <div className="flex gap-1 w-full max-w-12">
            <div className="flex-1 h-1.5 bg-white/30 rounded-full"></div>
            <div className="w-3 h-1.5 bg-white rounded-full"></div>
          </div>
        </div>
        <div className="absolute top-1 right-1 w-4 h-4 bg-white/10 rounded-full"></div>
      </div>
    )
  
  case "cta":
    return (
      <div className={`${baseClasses} bg-gradient-to-br ${color} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative h-full flex flex-col items-center justify-center text-white px-3">
          <div className="w-14 h-1.5 bg-white/90 rounded-full mb-1"></div>
          <div className="w-10 h-1 bg-white/70 rounded-full mb-2"></div>
          <div className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">
            Start Now
          </div>
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-white/10 rounded-full"></div>
        <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-white/10 rounded-full"></div>
      </div>
    )
  
  case "footer":
    return (
      <div className={`${baseClasses} bg-gradient-to-br from-gray-800 to-gray-900 p-2`}>
        <div className="h-full flex justify-between items-center text-white">
          <div className="space-y-1">
            <div className="w-8 h-1 bg-white rounded-full"></div>
            <div className="w-6 h-0.5 bg-white/60 rounded-full"></div>
          </div>
          <div className="flex gap-1">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-1.5 h-0.5 bg-white/60 rounded-full"></div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-1 left-2 right-2 h-px bg-white/20"></div>
      </div>
    )
  
  default:
    return (
      <div className={`${baseClasses} bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center`}>
        <div className="w-12 h-1 bg-gray-400 rounded-full"></div>
      </div>
    )
}
}

export function SectionLibrary({ onAddSection }: SectionLibraryProps) {
return (
  <div className="h-full flex flex-col">
    <div className="p-4 border-b border-gray-200 flex-shrink-0">
      <h2 className="text-lg font-semibold text-gray-900">Section Library</h2>
      <p className="text-sm text-gray-600 mt-1">Click to add sections to your page</p>
    </div>

    <div className="flex-1 overflow-y-auto p-4">
      <div className="space-y-4">
        {sectionTypes.map((section) => {
          const IconComponent = section.icon
          return (
            <Card key={section.type} className="group hover:shadow-md transition-all duration-300 border-1 shadow-sm hover:scale-[1.02] bg-white">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <CardTitle className="text-md font-bold text-gray-900 group-hover:text-gray-700 transition-colors">
                        {section.title}
                      </CardTitle>
                      <CardDescription className="pr-2 text-[12px] text-gray-500 mt-0.5 leading-relaxed">
                        {section.description}
                      </CardDescription>
                    </div>
                  </div>
                  <Button 
                    size="lg" 
                    onClick={() => onAddSection(section.type)} 
                    className="h-12 w-12 p-0 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <Plus className="w-6 h-6" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0 pb-4">
                <div className="rounded-lg overflow-hidden">
                  <SectionPreview type={section.type} color={section.color} />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  </div>
)
}
