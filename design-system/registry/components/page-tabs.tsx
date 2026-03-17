"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface Tab {
  /** Display name for the tab */
  name: string
  /** URL path for the tab */
  href: string
}

interface PageTabsProps {
  /** Array of tabs to display */
  tabs: Tab[]
  /** Additional CSS classes */
  className?: string
}

/**
 * Navigation tabs for page sections with active state indication.
 * 
 * @example
 * <PageTabs
 *   tabs={[
 *     { name: "Overview", href: "/dashboard" },
 *     { name: "Analytics", href: "/dashboard/analytics" },
 *     { name: "Reports", href: "/dashboard/reports" }
 *   ]}
 * />
 */
export function PageTabs({ tabs, className }: PageTabsProps) {
  const pathname = usePathname()

  return (
    <div className={cn("border-b", className)}>
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
                  : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
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

export { type Tab, type PageTabsProps }
