"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { Section } from "@/app/page"

interface SectionRendererProps {
  section: Section
}

export function SectionRenderer({ section }: SectionRendererProps) {
  const { type, props } = section

  switch (type) {
    case "header":
      return (
        <header
          className="px-6 py-4 border-b"
          style={{ backgroundColor: props.backgroundColor, color: props.textColor }}
        >
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <h1 className="text-xl font-bold">{props.title}</h1>
            <nav className="hidden md:flex items-center space-x-6">
              {props.navigation?.map((item: string, index: number) => (
                <a key={index} href="#" className="hover:opacity-75 transition-opacity">
                  {item}
                </a>
              ))}
            </nav>
          </div>
        </header>
      )

    case "hero":
      return (
        <section
          className="relative px-6 py-20 text-center"
          style={{ backgroundColor: props.backgroundColor, color: props.textColor }}
        >
          {props.backgroundImage && (
            <div className="absolute inset-0 z-0">
              <Image
                src={props.backgroundImage || "/placeholder.svg"}
                alt="Hero background"
                fill
                className="object-cover opacity-20"
              />
            </div>
          )}
          <div className="relative z-10 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">{props.title}</h1>
            <p className="text-xl mb-8 opacity-90">{props.subtitle}</p>
            <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
              {props.buttonText}
            </Button>
          </div>
        </section>
      )

    case "features":
      return (
        <section className="px-6 py-16" style={{ backgroundColor: props.backgroundColor, color: props.textColor }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">{props.title}</h2>
              <p className="text-xl opacity-75">{props.subtitle}</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {props.features?.map((feature: any, index: number) => (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <div className="text-4xl mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )

    case "testimonials":
      return (
        <section className="px-6 py-16" style={{ backgroundColor: props.backgroundColor, color: props.textColor }}>
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">{props.title}</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {props.testimonials?.map((testimonial: any, index: number) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <p className="mb-4 italic">"{testimonial.content}"</p>
                    <div className="flex items-center gap-3">
                      <Image
                        src={testimonial.avatar || "/placeholder.svg"}
                        alt={testimonial.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <div>
                        <div className="font-semibold">{testimonial.name}</div>
                        <div className="text-sm text-gray-600">{testimonial.role}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )

    case "cta":
      return (
        <section
          className="px-6 py-16 text-center"
          style={{ backgroundColor: props.backgroundColor, color: props.textColor }}
        >
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">{props.title}</h2>
            <p className="text-xl mb-8 opacity-90">{props.subtitle}</p>
            <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
              {props.buttonText}
            </Button>
          </div>
        </section>
      )

    case "footer":
      return (
        <footer className="px-6 py-12" style={{ backgroundColor: props.backgroundColor, color: props.textColor }}>
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-bold mb-2">{props.companyName}</h3>
                <p className="opacity-75">{props.description}</p>
              </div>
              <div>
                <div className="flex flex-wrap gap-6">
                  {props.links?.map((link: any, index: number) => (
                    <a key={index} href={link.url} className="hover:opacity-75 transition-opacity">
                      {link.title}
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <div className="border-t border-gray-600 pt-8 text-center opacity-75">
              <p>&copy; 2024 {props.companyName}. All rights reserved.</p>
            </div>
          </div>
        </footer>
      )

    default:
      return <div>Unknown section type</div>
  }
}
