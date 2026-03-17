"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import {
  User,
  UserCircle,
  Search,
  Shield,
  LayoutGrid,
  ChevronRight,
  Users,
  Settings2,
  Lock,
  Layers,
  Building2,
  Calendar,
  FileText,
  ShoppingCart,
  CheckCircle2,
  History,
} from "lucide-react"
import { useSearchParams } from "next/navigation"
import Loading from "./loading"
import { Suspense } from "react"
import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const settingsCards = [
  {
    id: "role-management",
    title: "Role Management",
    description: "Define and configure roles with granular permissions. Create custom roles, assign capabilities, and manage access levels across your organization.",
    icon: Users,
    href: "/sop/settings/role-management",
    badge: "Core",
    features: ["Create custom roles", "Assign permissions", "Role hierarchy"],
  },
  {
    id: "user-management",
    title: "User Management",
    description: "Manage users, groups, and organizational structure. Invite new users, assign roles, and control access through group-based permissions.",
    icon: UserCircle,
    href: "/sop/settings/user-management",
    badge: "Core",
    features: ["User invitations", "Group management", "Bulk operations"],
  },
  {
    id: "rbac",
    title: "RBAC Configuration",
    description: "Role-Based Access Control visualization and testing. Preview how roles interact with layouts, components, and actions in real-time.",
    icon: Shield,
    href: "/sop/settings/rbac",
    badge: "Security",
    features: ["Access preview", "Permission testing", "Audit trails"],
  },
  {
    id: "layout-settings",
    title: "Layout Settings",
    description: "Configure application layouts and navigation. Customize menus, table views, and workflow steps for different user experiences.",
    icon: Layers,
    href: "/sop/settings/layout-settings",
    badge: "UI/UX",
    features: ["Menu configuration", "Table columns", "Workflow steps"],
  },
  {
    id: "company-setup",
    title: "Company Setup",
    description: "Configure company profile, organizational structure, and branding. Set up departments, locations, and business unit hierarchies.",
    icon: Building2,
    href: "/sop/settings/company-setup",
    badge: "Core",
    features: ["Company profile", "Departments", "Locations"],
  },
  {
    id: "calendar",
    title: "Calendar",
    description: "Manage business calendars, holidays, and working hours. Configure fiscal year settings and regional calendar preferences.",
    icon: Calendar,
    href: "/sop/settings/calendar",
    badge: "Operations",
    features: ["Holidays", "Working hours", "Fiscal year"],
  },
  {
    id: "policies-consent",
    title: "Policies & Consent",
    description: "Define organizational policies, terms of service, and consent management. Track user acknowledgments and policy versions.",
    icon: FileText,
    href: "/sop/settings/policies-consent",
    badge: "Compliance",
    features: ["Policy documents", "Consent tracking", "Version control"],
  },
  {
    id: "procurement-sops",
    title: "Procurement SOPs",
    description: "Standard Operating Procedures for procurement workflows. Configure approval hierarchies, spending limits, and process templates.",
    icon: ShoppingCart,
    href: "/sop/settings/procurement-sops",
    badge: "Operations",
    features: ["Approval workflows", "Spending limits", "Process templates"],
  },
  {
    id: "compliance",
    title: "Compliance",
    description: "Compliance monitoring, regulatory requirements, and risk management. Set up compliance rules, automated checks, and reporting.",
    icon: CheckCircle2,
    href: "/sop/settings/compliance",
    badge: "Compliance",
    features: ["Regulatory rules", "Automated checks", "Risk management"],
  },
  {
    id: "audit-versions",
    title: "Audit & Versions",
    description: "System audit logs, change history, and version tracking. Monitor all user actions, data changes, and configuration updates.",
    icon: History,
    href: "/sop/settings/audit-versions",
    badge: "Security",
    features: ["Audit logs", "Change history", "Version tracking"],
  },
]

export default function SettingsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const searchParams = useSearchParams()

  const filteredCards = settingsCards.filter(
    (card) =>
      card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="h-full bg-background flex flex-col">
      {/* Top Navigation */}
      <Header title="Admin Settings" />
      
      <div className="flex-1 overflow-auto">
        {/* Hero Section */}
        <div className="border-b bg-gradient-to-b from-muted/50 to-background">
          <div className="px-8 py-10">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Settings2 className="h-5 w-5 text-primary" />
                  </div>
                  <h1 className="text-2xl font-semibold text-foreground tracking-tight">Admin Settings</h1>
                </div>
                <p className="text-muted-foreground max-w-xl leading-relaxed">
                  Centralized control for application settings and configurations. Manage roles, users, permissions, and layouts from one place.
                </p>
              </div>
              
              {/* Search */}
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search settings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-background"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Settings Grid */}
        <div className="px-8 py-8">
          <Suspense fallback={<Loading />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCards.map((card) => {
                const IconComponent = card.icon
                return (
                  <a
                    key={card.id}
                    href={card.href}
                    className="group block"
                  >
                    <Card className="h-full transition-all duration-200 hover:shadow-md hover:border-primary/20 group-hover:bg-muted/30">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
                            <IconComponent className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                {card.title}
                              </h3>
                              <Badge variant="secondary" className="text-[10px] font-medium px-1.5 py-0">
                                {card.badge}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                              {card.description}
                            </p>
                            <div className="flex items-center gap-4">
                              {card.features.map((feature, index) => (
                                <span key={index} className="text-xs text-muted-foreground flex items-center gap-1">
                                  <span className="h-1 w-1 rounded-full bg-primary/50" />
                                  {feature}
                                </span>
                              ))}
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                        </div>
                      </CardContent>
                    </Card>
                  </a>
                )
              })}
            </div>

            {filteredCards.length === 0 && (
              <div className="text-center py-12">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Search className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="font-medium text-foreground mb-1">No settings found</h3>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search to find what you are looking for.
                </p>
              </div>
            )}
          </Suspense>
        </div>
      </div>
    </div>
  )
}
