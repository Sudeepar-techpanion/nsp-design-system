"use client"

import Link from "next/link"
import { ArrowLeft, Copy, Check, Package, Layers, LayoutGrid } from "lucide-react"
import { useState } from "react"

const components = [
  {
    name: "nimble-sidebar",
    description: "Collapsible sidebar with hover expansion and purple theme",
    type: "component",
  },
  {
    name: "nimble-header",
    description: "Header with user profile, notifications, and delegate modal",
    type: "component",
  },
  {
    name: "status-badge",
    description: "Status badges for success, warning, info, error, and pending states",
    type: "component",
  },
  {
    name: "stat-card",
    description: "Statistics card with breakdown items and trend indicators",
    type: "component",
  },
  {
    name: "page-tabs",
    description: "Navigation tabs for page sections",
    type: "component",
  },
  {
    name: "data-table",
    description: "Data table with sorting, filtering, and pagination",
    type: "component",
  },
]

const blocks = [
  {
    name: "blank",
    description: "Blank page template with sidebar and header layout",
    type: "block",
  },
  {
    name: "dashboard",
    description: "Dashboard page with stat cards and data table",
    type: "block",
  },
]

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={copy}
      className="p-2 rounded-md hover:bg-muted transition-colors"
      title="Copy command"
    >
      {copied ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <Copy className="h-4 w-4 text-muted-foreground" />
      )}
    </button>
  )
}

function ComponentCard({ name, description, type }: { name: string; description: string; type: string }) {
  const command = `npx shadcn@latest add "https://your-registry-url.vercel.app/r/${name}.json"`

  return (
    <div className="border rounded-lg p-4 hover:border-primary/50 transition-colors">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          {type === "block" ? (
            <LayoutGrid className="h-4 w-4 text-primary" />
          ) : (
            <Package className="h-4 w-4 text-primary" />
          )}
          <h3 className="font-medium">{name}</h3>
        </div>
        <span className="text-xs bg-muted px-2 py-1 rounded">{type}</span>
      </div>
      <p className="text-sm text-muted-foreground mb-3">{description}</p>
      <div className="bg-muted rounded-md p-2 flex items-center justify-between gap-2">
        <code className="text-xs truncate flex-1">npx shadcn add {name}</code>
        <CopyButton text={command} />
      </div>
    </div>
  )
}

export default function StorePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Component Store</h1>
          <p className="text-muted-foreground">
            Browse and install Nimble S2P design system components
          </p>
        </div>

        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Package className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Components</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {components.map((component) => (
              <ComponentCard key={component.name} {...component} />
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-4">
            <Layers className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Blocks</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {blocks.map((block) => (
              <ComponentCard key={block.name} {...block} />
            ))}
          </div>
        </section>

        <section className="mt-10 p-6 bg-muted/50 rounded-lg">
          <h2 className="text-lg font-semibold mb-3">Quick Setup</h2>
          <p className="text-sm text-muted-foreground mb-4">
            First, install the theme to get the Nimble S2P color palette and CSS variables:
          </p>
          <div className="bg-background rounded-md p-3 flex items-center justify-between">
            <code className="text-sm">npx shadcn@latest add "https://your-registry-url.vercel.app/r/theme.json"</code>
            <CopyButton text='npx shadcn@latest add "https://your-registry-url.vercel.app/r/theme.json"' />
          </div>
        </section>
      </div>
    </div>
  )
}
