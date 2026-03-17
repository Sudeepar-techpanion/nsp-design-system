"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface Tab {
  name: string
  href: string
}

interface PageTabsProps {
  tabs: Tab[]
}

export function PageTabs({ tabs }: PageTabsProps) {
  const pathname = usePathname()

  return (
    <div className="border-b">
      <nav className="-mb-px flex gap-6">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={cn(
                "border-b-2 px-1 py-3 text-sm font-medium transition-colors",
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:border-border hover:text-foreground",
              )}
            >
              {tab.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
