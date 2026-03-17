"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Building2,
  Calendar,
  FileText,
  ClipboardList,
  ShieldCheck,
  History,
  Settings,
  LogOut,
  Cpu,
  Sparkles,
  Inbox,
  Search,
  UserCheck,
  type LucideIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface NavigationItem {
  name: string
  href: string
  icon: LucideIcon
}

interface NimbleSidebarProps {
  /** Navigation items to display in the sidebar */
  navigation?: NavigationItem[]
  /** URL for the full-width logo (shown when expanded) */
  logoSrc?: string
  /** URL for the collapsed logo icon */
  logoCollapsedSrc?: string
  /** Alt text for the logo */
  logoAlt?: string
  /** Callback for switch view button click */
  onSwitchView?: () => void
  /** Callback for sign out button click */
  onSignOut?: () => void
  /** Label for switch view button */
  switchViewLabel?: string
  /** Show switch view button */
  showSwitchView?: boolean
}

const defaultNavigation: NavigationItem[] = [
  { name: "Inbox", href: "/inbox", icon: Inbox },
  { name: "Search", href: "/search", icon: Search },
  { name: "Team Lead", href: "/team-lead", icon: UserCheck },
  { name: "Company Setup", href: "/company", icon: Building2 },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "Policies & Consent", href: "/policies", icon: FileText },
  { name: "Procurement SOPs", href: "/procurement-sops", icon: ClipboardList },
  { name: "Compliance", href: "/compliance", icon: ShieldCheck },
  { name: "Audit & Versions", href: "/audit", icon: History },
  { name: "Orchestrator", href: "/orchestrator", icon: Cpu },
  { name: "xAI", href: "/xai", icon: Sparkles },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function NimbleSidebar({
  navigation = defaultNavigation,
  logoSrc = "/images/logo-full.svg",
  logoCollapsedSrc = "/images/logo-collapsed.svg",
  logoAlt = "Logo",
  onSwitchView,
  onSignOut,
  switchViewLabel = "Switch to User View",
  showSwitchView = true,
}: NimbleSidebarProps) {
  const pathname = usePathname()
  const [isHovered, setIsHovered] = useState(false)

  return (
    <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out",
        isHovered ? "w-64" : "w-16"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-4 border-b border-sidebar-border overflow-hidden">
        <div className="flex items-center gap-3 w-full">
          {!isHovered ? (
            <Image
              src={logoCollapsedSrc}
              alt={logoAlt}
              width={32}
              height={32}
              className="h-8 w-8 shrink-0"
            />
          ) : (
            <Image
              src={logoSrc}
              alt={logoAlt}
              width={120}
              height={24}
              className="h-6 shrink-0 transition-opacity duration-200"
            />
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  title={!isHovered ? item.name : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  <span
                    className={cn(
                      "whitespace-nowrap transition-opacity duration-200",
                      isHovered ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
                    )}
                  >
                    {item.name}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Bottom section */}
      <div className="border-t border-sidebar-border p-2 space-y-2">
        {showSwitchView && (
          <Button
            variant="secondary"
            title={!isHovered ? switchViewLabel : undefined}
            onClick={onSwitchView}
            className={cn(
              "w-full bg-sidebar-accent hover:bg-sidebar-accent/80 text-sidebar-foreground",
              isHovered ? "justify-start" : "justify-center px-0"
            )}
          >
            <Settings className={cn("h-4 w-4 shrink-0", isHovered && "mr-2")} />
            <span
              className={cn(
                "whitespace-nowrap transition-opacity duration-200",
                isHovered ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
              )}
            >
              {switchViewLabel}
            </span>
          </Button>
        )}
        <Button
          variant="ghost"
          title={!isHovered ? "Sign Out" : undefined}
          onClick={onSignOut}
          className={cn(
            "w-full text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/50",
            isHovered ? "justify-start" : "justify-center px-0"
          )}
        >
          <LogOut className={cn("h-4 w-4 shrink-0", isHovered && "mr-2")} />
          <span
            className={cn(
              "whitespace-nowrap transition-opacity duration-200",
              isHovered ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
            )}
          >
            Sign Out
          </span>
        </Button>
      </div>
    </aside>
  )
}

export { type NavigationItem }
