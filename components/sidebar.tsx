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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const navigation = [
  { name: "Inbox", href: "/sop/inbox", icon: Inbox }, // Added Inbox as first item
  { name: "Search", href: "/sop/search", icon: Search },
  { name: "Team lead", href: "/sop/team-lead", icon: UserCheck },
  { name: "Company Setup", href: "/sop/company", icon: Building2 },
  { name: "Calendar", href: "/sop/calendar", icon: Calendar },
  { name: "Policies & Consent", href: "/sop/policies", icon: FileText },
  { name: "Procurement SOPs", href: "/sop/procurement-sops", icon: ClipboardList },
  { name: "Compliance", href: "/sop/compliance", icon: ShieldCheck },
  { name: "Audit & Versions", href: "/sop/audit", icon: History },
  { name: "Orchestrator", href: "/sop/orchestrator", icon: Cpu },
  { name: "xAI", href: "/sop/xai", icon: Sparkles },
  { name: "Settings", href: "/sop/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isHovered, setIsHovered] = useState(false)

  return (
    <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out",
        isHovered ? "w-64" : "w-16",
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-4 border-b border-sidebar-border overflow-hidden">
        <div className="flex items-center gap-3 w-full">
          {!isHovered ? (
            <Image
              src="/images/Logo_Collapsed.svg"
              alt="Nimble logo"
              width={32}
              height={32}
              className="h-8 w-8 shrink-0"
            />
          ) : (
            <Image
              src="/images/Nimble_White_Large.svg"
              alt="Nimble logo"
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
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  <span
                    className={cn(
                      "whitespace-nowrap transition-opacity duration-200",
                      isHovered ? "opacity-100" : "opacity-0 w-0 overflow-hidden",
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
        <Button
          variant="secondary"
          title={!isHovered ? "Switch to User View" : undefined}
          className={cn(
            "w-full bg-sidebar-accent hover:bg-sidebar-accent/80 text-sidebar-foreground",
            isHovered ? "justify-start" : "justify-center px-0",
          )}
        >
          <Settings className={cn("h-4 w-4 shrink-0", isHovered && "mr-2")} />
          <span
            className={cn(
              "whitespace-nowrap transition-opacity duration-200",
              isHovered ? "opacity-100" : "opacity-0 w-0 overflow-hidden",
            )}
          >
            Switch to User View
          </span>
        </Button>
        <Button
          variant="ghost"
          title={!isHovered ? "Sign Out" : undefined}
          className={cn(
            "w-full text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/50",
            isHovered ? "justify-start" : "justify-center px-0",
          )}
        >
          <LogOut className={cn("h-4 w-4 shrink-0", isHovered && "mr-2")} />
          <span
            className={cn(
              "whitespace-nowrap transition-opacity duration-200",
              isHovered ? "opacity-100" : "opacity-0 w-0 overflow-hidden",
            )}
          >
            Sign Out
          </span>
        </Button>
      </div>
    </aside>
  )
}

export const AppSidebar = Sidebar
