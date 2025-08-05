"use client"

import type React from "react"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"
import type { Section } from "@/app/page"

interface SectionRendererProps {
  section: Section
  onNavigateToPage?: (pageId: string) => void // New prop for page navigation
}

export function SectionRenderer({ section, onNavigateToPage }: SectionRendererProps) {
  const { type, props } = section

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, link: string) => {
    if (!link || link === "#") {
      // Check for empty string or "#"
      e.preventDefault()
      e.stopPropagation() // Prevent event from bubbling up
      console.log("Link leads to nowhere (default behavior prevented).")
      return
    }

    if (link.startsWith("http://") || link.startsWith("https://")) {
      // External URL, let default behavior happen (open in new tab or navigate)
      return
    } else if (onNavigateToPage) {
      // Assume it's a page ID if it's not an external URL or anchor
      e.preventDefault()
      onNavigateToPage(link)
    }
  }

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
              {props.navigation?.map((item: { label: string; link: string }, index: number) => (
                <a
                  key={index}
                  href={item.link}
                  onClick={(e) => handleLinkClick(e, item.link)}
                  className="hover:opacity-75 transition-opacity"
                >
                  {item.label}
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
            <Button
              size="lg"
              className="bg-white text-gray-900 hover:bg-gray-100"
              onClick={(e) => {
                if (props.buttonLink) {
                  handleLinkClick(e, props.buttonLink)
                }
              }}
            >
              {props.buttonText}
            </Button>
          </div>
        </section>
      )

    case "about":
      return (
        <section className="px-6 py-16" style={{ backgroundColor: props.backgroundColor, color: props.textColor }}>
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">{props.title}</h2>
                <p className="text-xl mb-6 opacity-75">{props.subtitle}</p>
                <p className="text-lg leading-relaxed mb-8">{props.description}</p>
                <div className="grid grid-cols-3 gap-6">
                  {props.stats?.map((stat: any, index: number) => (
                    <div key={index} className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{stat.number}</div>
                      <div className="text-sm opacity-75">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <Image
                  src={props.image || "/placeholder.svg"}
                  alt="About us"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>
      )

    case "services":
      return (
        <section className="px-6 py-16" style={{ backgroundColor: props.backgroundColor, color: props.textColor }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">{props.title}</h2>
              <p className="text-xl opacity-75">{props.subtitle}</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {props.services?.map((service: any, index: number) => (
                <Card key={index} className="p-6">
                  <CardContent className="p-0">
                    <div className="text-4xl mb-4">{service.icon}</div>
                    <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <ul className="space-y-2">
                      {service.features?.map((feature: string, idx: number) => (
                        <li key={idx} className="flex items-center gap-2 text-sm">
                          <Check className="w-4 h-4 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
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

    case "pricing":
      return (
        <section className="px-6 py-16" style={{ backgroundColor: props.backgroundColor, color: props.textColor }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">{props.title}</h2>
              <p className="text-xl opacity-75">{props.subtitle}</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {props.plans?.map((plan: any, index: number) => (
                <Card key={index} className={`relative ${plan.popular ? "ring-2 ring-blue-500" : ""}`}>
                  {plan.popular && (
                    <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-blue-500">
                      Most Popular
                    </Badge>
                  )}
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                    <div className="mb-4">
                      <span className="text-3xl font-bold">{plan.price}</span>
                      <span className="text-gray-600">/{plan.period}</span>
                    </div>
                    <p className="text-gray-600 mb-6">{plan.description}</p>
                    <ul className="space-y-2 mb-6">
                      {plan.features?.map((feature: string, idx: number) => (
                        <li key={idx} className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                      Choose Plan
                    </Button>
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

    case "gallery":
      return (
        <section className="px-6 py-16" style={{ backgroundColor: props.backgroundColor, color: props.textColor }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">{props.title}</h2>
              <p className="text-xl opacity-75">{props.subtitle}</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {props.images?.map((image: any, index: number) => (
                <div key={index} className="group cursor-pointer">
                  <div className="relative overflow-hidden rounded-lg">
                    <Image
                      src={image.url || "/placeholder.svg"}
                      alt={image.alt}
                      width={400}
                      height={300}
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
                      <h3 className="text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                        {image.title}
                      </h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )

    case "faq":
      return (
        <section className="px-6 py-16" style={{ backgroundColor: props.backgroundColor, color: props.textColor }}>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">{props.title}</h2>
              <p className="text-xl opacity-75">{props.subtitle}</p>
            </div>
            <Accordion type="single" collapsible className="space-y-4">
              {props.faqs?.map((faq: any, index: number) => (
                <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-4">
                  <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-gray-600">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      )

    case "stats":
      return (
        <section className="px-6 py-16" style={{ backgroundColor: props.backgroundColor, color: props.textColor }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">{props.title}</h2>
            </div>
            <div className="grid md:grid-cols-4 gap-8">
              {props.stats?.map((stat: any, index: number) => (
                <div key={index} className="text-center">
                  <div className="text-4xl mb-2">{stat.icon}</div>
                  <div className="text-3xl font-bold mb-2">{stat.number}</div>
                  <div className="opacity-75">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )

    case "contact":
      return (
        <section className="px-6 py-16" style={{ backgroundColor: props.backgroundColor, color: props.textColor }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">{props.title}</h2>
              <p className="text-xl opacity-75">{props.subtitle}</p>
            </div>
            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <h3 className="text-xl font-semibold mb-6">Contact Information</h3>
                <div className="space-y-4">
                  <div>
                    <strong>Email:</strong> {props.contactInfo?.email}
                  </div>
                  <div>
                    <strong>Phone:</strong> {props.contactInfo?.phone}
                  </div>
                  <div>
                    <strong>Address:</strong> {props.contactInfo?.address}
                  </div>
                </div>
              </div>
              <div>
                <form className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input placeholder="Your Name" />
                    <Input placeholder="Your Email" type="email" />
                  </div>
                  <Input placeholder="Subject" />
                  <Textarea placeholder="Your Message" rows={5} />
                  <Button className="w-full">Send Message</Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      )

    case "newsletter":
      return (
        <section
          className="px-6 py-16 text-center"
          style={{ backgroundColor: props.backgroundColor, color: props.textColor }}
        >
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">{props.title}</h2>
            <p className="text-xl mb-8 opacity-90">{props.subtitle}</p>
            <div className="flex max-w-md mx-auto gap-2">
              <Input placeholder={props.placeholder} className="flex-1" />
              <Button className="bg-white text-gray-900 hover:bg-gray-100">{props.buttonText}</Button>
            </div>
          </div>
        </section>
      )

    case "blog":
      return (
        <section className="px-6 py-16" style={{ backgroundColor: props.backgroundColor, color: props.textColor }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">{props.title}</h2>
              <p className="text-xl opacity-75">{props.subtitle}</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {props.posts?.map((post: any, index: number) => (
                <Card key={index} className="overflow-hidden">
                  <Image
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <span>{post.date}</span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                    <p className="text-gray-600 mb-4">{post.excerpt}</p>
                    <div className="text-sm text-gray-600">By {post.author}</div>
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
            <Button
              size="lg"
              className="bg-white text-gray-900 hover:bg-gray-100"
              onClick={(e) => {
                if (props.buttonLink) {
                  handleLinkClick(e, props.buttonLink)
                }
              }}
            >
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
                  {props.links?.map((link: { title: string; url: string }, index: number) => (
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
