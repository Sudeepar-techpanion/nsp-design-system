"use client"

import type React from "react"

import { useState } from "react"
import { Header } from "@/components/header"
import { StatusBadge } from "@/components/status-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Building2,
  Plus,
  Search,
  Download,
  Edit,
  Trash2,
  MapPin,
  ChevronRight,
  ChevronDown,
  Building,
  Warehouse,
  Factory,
  Store,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Shield,
  Users,
  Globe,
  Calendar,
  CreditCard,
  FileText,
  Package,
  UserCheck,
  Receipt,
  Sparkles,
  Cpu,
  Zap,
  Eye,
  Ban,
  Bell,
  ChevronUp,
  RefreshCw,
  Info,
  Server,
  XCircle,
  X,
} from "lucide-react"

interface Company {
  companyId: string
  companyName: string
  companyCode: string
  legalEstablishmentId: string
  taxRegistrationNumber: string
  baseCurrency: string
  fiscalYearStart: string
  fiscalYearEnd: string
  defaultTimezone: string
  countryOfRegistration: string
  status: "Active" | "Suspended"
  entities: Entity[]
}

interface Entity {
  entityId: string
  entityName: string
  entityCode: string
  establishmentId: string
  taxId: string
  entityCurrency: string
  entityTimezone: string
  country: string
  status: "Active" | "Inactive"
  companyId: string
  locations: Location[]
}

interface Location {
  locationId: string
  locationName: string
  locationCode: string
  locationType: "Office" | "Plant" | "Warehouse" | "Store"
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  country: string
  postalCode: string
  locationCurrency?: string
  locationTimezone: string
  status: "Active" | "Inactive"
  entityId: string
}

interface License {
  licenseId: string
  companyId: string
  subscriptionPlan: string
  maxCompanies: number
  maxEntities: number
  maxLocations: number
  maxUsers: number
  startDate: string
  endDate: string
  billingCycle: "Monthly" | "Annual"
  status: "Active" | "Expired" | "Suspended"
}

interface SubscribedModule {
  moduleCode: string
  moduleName: string
  moduleStatus: "Active" | "Inactive" | "Expired"
  startDate: string
  endDate: string
  icon: React.ElementType
}

interface ModuleLimits {
  [key: string]: {
    label: string
    used: number
    max: number
    period?: string
  }
}

interface AIEntitlements {
  aiCredits: { used: number; max: number; period: string; resetDate: string }
  ocrCredits: { used: number; max: number; period: string; resetDate: string }
  automationRuns: { used: number; max: number; period: string; resetDate: string }
  apiCalls: { used: number; max: number; period: string; resetDate: string }
}

interface UserLimits {
  internalUsers: { used: number; max: number }
  supplierUsers: { used: number; max: number }
  approvers: { used: number; max: number }
}

const companyData: Company = {
  companyId: "COMP_001",
  companyName: "Danone Corp",
  companyCode: "DN-CORP",
  legalEstablishmentId: "EST-2024-001",
  taxRegistrationNumber: "US-TAX-12345678",
  baseCurrency: "USD",
  fiscalYearStart: "2025-01-01",
  fiscalYearEnd: "2025-12-31",
  defaultTimezone: "America/New_York",
  countryOfRegistration: "United States",
  status: "Active",
  entities: [
    {
      entityId: "ENT_001",
      entityName: "Danone North America Inc.",
      entityCode: "DNA-US",
      establishmentId: "EST-NA-001",
      taxId: "US-12345678",
      entityCurrency: "USD",
      entityTimezone: "America/New_York",
      country: "United States",
      status: "Active",
      companyId: "COMP_001",
      locations: [
        {
          locationId: "LOC_001",
          locationName: "New York HQ",
          locationCode: "NY-HQ",
          locationType: "Office",
          addressLine1: "350 5th Avenue",
          addressLine2: "Floor 45",
          city: "New York",
          state: "NY",
          country: "United States",
          postalCode: "10118",
          locationTimezone: "America/New_York",
          status: "Active",
          entityId: "ENT_001",
        },
        {
          locationId: "LOC_002",
          locationName: "Chicago Plant",
          locationCode: "CHI-PLT",
          locationType: "Plant",
          addressLine1: "1200 Industrial Blvd",
          addressLine2: "",
          city: "Chicago",
          state: "IL",
          country: "United States",
          postalCode: "60601",
          locationTimezone: "America/Chicago",
          status: "Active",
          entityId: "ENT_001",
        },
        {
          locationId: "LOC_003",
          locationName: "Dallas Warehouse",
          locationCode: "DAL-WH",
          locationType: "Warehouse",
          addressLine1: "500 Distribution Way",
          addressLine2: "",
          city: "Dallas",
          state: "TX",
          country: "United States",
          postalCode: "75201",
          locationTimezone: "America/Chicago",
          status: "Active",
          entityId: "ENT_001",
        },
      ],
    },
    {
      entityId: "ENT_002",
      entityName: "Danone India Pvt Ltd",
      entityCode: "DNA-IN",
      establishmentId: "EST-IN-001",
      taxId: "IN-GSTIN-12345",
      entityCurrency: "INR",
      entityTimezone: "Asia/Kolkata",
      country: "India",
      status: "Active",
      companyId: "COMP_001",
      locations: [
        {
          locationId: "LOC_004",
          locationName: "Mumbai Office",
          locationCode: "MUM-OFF",
          locationType: "Office",
          addressLine1: "Bandra Kurla Complex",
          addressLine2: "Tower A, Floor 12",
          city: "Mumbai",
          state: "Maharashtra",
          country: "India",
          postalCode: "400051",
          locationTimezone: "Asia/Kolkata",
          status: "Active",
          entityId: "ENT_002",
        },
        {
          locationId: "LOC_005",
          locationName: "Pune Manufacturing",
          locationCode: "PUN-MFG",
          locationType: "Plant",
          addressLine1: "MIDC Industrial Area",
          addressLine2: "Plot 45",
          city: "Pune",
          state: "Maharashtra",
          country: "India",
          postalCode: "411057",
          locationTimezone: "Asia/Kolkata",
          status: "Active",
          entityId: "ENT_002",
        },
      ],
    },
    {
      entityId: "ENT_003",
      entityName: "Danone France SA",
      entityCode: "DNA-FR",
      establishmentId: "EST-FR-001",
      taxId: "FR-VAT-12345678",
      entityCurrency: "EUR",
      entityTimezone: "Europe/Paris",
      country: "France",
      status: "Active",
      companyId: "COMP_001",
      locations: [
        {
          locationId: "LOC_006",
          locationName: "Paris Headquarters",
          locationCode: "PAR-HQ",
          locationType: "Office",
          addressLine1: "17 Boulevard Haussmann",
          addressLine2: "",
          city: "Paris",
          state: "Île-de-France",
          country: "France",
          postalCode: "75009",
          locationTimezone: "Europe/Paris",
          status: "Active",
          entityId: "ENT_003",
        },
      ],
    },
  ],
}

const licenseData: License = {
  licenseId: "LIC_001",
  companyId: "COMP_001",
  subscriptionPlan: "Enterprise",
  maxCompanies: 1,
  maxEntities: 10,
  maxLocations: 50,
  maxUsers: 200,
  startDate: "2025-01-01",
  endDate: "2027-12-31",
  billingCycle: "Annual",
  status: "Active",
}

const usageMetrics = {
  companies: { used: 1, max: licenseData.maxCompanies },
  entities: { used: companyData.entities.length, max: licenseData.maxEntities },
  locations: {
    used: companyData.entities.reduce((acc, e) => acc + e.locations.length, 0),
    max: licenseData.maxLocations,
  },
  users: { used: 156, max: licenseData.maxUsers },
}

const getLocationIcon = (type: Location["locationType"]) => {
  switch (type) {
    case "Office":
      return Building
    case "Plant":
      return Factory
    case "Warehouse":
      return Warehouse
    case "Store":
      return Store
    default:
      return MapPin
  }
}

function UsageIndicator({
  label,
  used,
  max,
  icon: Icon,
}: {
  label: string
  used: number
  max: number
  icon: React.ElementType
}) {
  const percentage = (used / max) * 100
  const isWarning = percentage >= 80
  const isCritical = percentage >= 95

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{label}</span>
        </div>
        <span
          className={`text-sm font-semibold ${isCritical ? "text-destructive" : isWarning ? "text-orange-600" : "text-foreground"}`}
        >
          {used} / {max}
        </span>
      </div>
      <Progress
        value={percentage}
        className={`h-2 ${isCritical ? "[&>div]:bg-destructive" : isWarning ? "[&>div]:bg-orange-500" : ""}`}
      />
      {isCritical && (
        <p className="flex items-center gap-1 text-xs text-destructive">
          <AlertTriangle className="h-3 w-3" />
          Limit nearly reached
        </p>
      )}
    </div>
  )
}

function HierarchyTree({ company }: { company: Company }) {
  const [expandedEntities, setExpandedEntities] = useState<string[]>(company.entities.map((e) => e.entityId))

  const toggleEntity = (entityId: string) => {
    setExpandedEntities((prev) =>
      prev.includes(entityId) ? prev.filter((id) => id !== entityId) : [...prev, entityId],
    )
  }

  return (
    <div className="space-y-2">
      {/* Company Root */}
      <div className="flex items-center gap-2 rounded-lg bg-primary/5 p-3">
        <Building2 className="h-5 w-5 text-primary" />
        <div className="flex-1">
          <p className="font-semibold">{company.companyName}</p>
          <p className="text-xs text-muted-foreground">{company.companyCode}</p>
        </div>
        <StatusBadge variant={company.status === "Active" ? "success" : "error"}>{company.status}</StatusBadge>
      </div>

      {/* Entities */}
      <div className="ml-4 space-y-2 border-l-2 border-muted pl-4">
        {company.entities.map((entity) => {
          const isExpanded = expandedEntities.includes(entity.entityId)
          return (
            <Collapsible key={entity.entityId} open={isExpanded}>
              <CollapsibleTrigger
                className="flex w-full items-center gap-2 rounded-lg p-2 hover:bg-muted/50"
                onClick={() => toggleEntity(entity.entityId)}
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
                <Building className="h-4 w-4 text-blue-600" />
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium">{entity.entityName}</p>
                  <p className="text-xs text-muted-foreground">
                    {entity.entityCode} • {entity.country} • {entity.locations.length} locations
                  </p>
                </div>
                <StatusBadge variant={entity.status === "Active" ? "success" : "warning"}>{entity.status}</StatusBadge>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="ml-6 mt-1 space-y-1 border-l-2 border-muted pl-4">
                  {entity.locations.map((location) => {
                    const LocationIcon = getLocationIcon(location.locationType)
                    return (
                      <div
                        key={location.locationId}
                        className="flex items-center gap-2 rounded-md p-2 hover:bg-muted/50"
                      >
                        <LocationIcon className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="text-sm">{location.locationName}</p>
                          <p className="text-xs text-muted-foreground">
                            {location.locationType} • {location.city}, {location.state}
                          </p>
                        </div>
                        <StatusBadge variant={location.status === "Active" ? "success" : "warning"}>
                          {location.status}
                        </StatusBadge>
                      </div>
                    )
                  })}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )
        })}
      </div>
    </div>
  )
}

const extendedLicenseData = {
  // License Summary fields
  plan: "Enterprise",
  status: "Active" as "Active" | "Expired" | "Suspended",
  validFrom: "2025-04-01",
  validTill: "2027-03-31",
  billingCycle: "Annual" as const,
  environment: "Production" as "Production" | "Sandbox",
  lastRefreshed: "2025-01-16T10:30:00Z",

  // Platform limits
  platformLimits: {
    maxCompanies: { used: 1, max: 1 },
    maxEntities: { used: 3, max: 10 },
    maxLocations: { used: 6, max: 50 },
    maxInternalUsers: { used: 156, max: 200 },
    maxSupplierUsers: { used: 380, max: 500 },
  },

  // Subscribed modules
  modules: {
    RFQ: {
      moduleName: "RFQ Management",
      active: true,
      validTill: "2027-03-31",
      icon: FileText,
      description: "Create and manage Request for Quotations with vendors",
      limits: {
        rfqsPerYear: { label: "RFQs per Year", used: 456, max: 1000 },
        vendorsPerRfq: { label: "Vendors per RFQ", used: 0, max: 10 },
        activeRfqs: { label: "Active RFQs", used: 23, max: 50 },
      },
    },
    VENDOR_ONBOARDING: {
      moduleName: "Vendor Onboarding",
      active: true,
      validTill: "2027-03-31",
      icon: UserCheck,
      description: "Onboard and verify new vendors with compliance checks",
      limits: {
        suppliersOnboarded: { label: "Suppliers Onboarded", used: 1250, max: 2000 },
        reverificationsPerYear: { label: "Re-verifications/Year", used: 45, max: 100 },
        complianceDocs: { label: "Compliance Documents", used: 3200, max: 5000 },
      },
    },
    SUPPLIER_PORTAL: {
      moduleName: "Supplier Portal",
      active: false,
      validTill: null,
      icon: Package,
      description: "Self-service portal for supplier interactions and submissions",
      limits: {
        supplierLogins: { label: "Supplier Login Users", used: 0, max: 500 },
        concurrentSessions: { label: "Concurrent Sessions", used: 0, max: 100 },
        categories: { label: "Supplier Categories", used: 0, max: 25 },
      },
    },
    INVOICE_PROCESSING: {
      moduleName: "Invoice Processing",
      active: true,
      validTill: "2027-03-31",
      icon: Receipt,
      description: "Automated invoice capture, validation, and processing",
      limits: {
        invoicesPerYear: { label: "Invoices/Year", used: 15600, max: 20000 },
        invoiceValuePerYear: { label: "Invoice Value/Year", used: 2500000, max: 5000000, isCurrency: true },
        ocrPages: { label: "OCR Pages", used: 42000, max: 50000 },
      },
    },
  } as Record<
    string,
    {
      moduleName: string
      active: boolean
      validTill: string | null
      icon: React.ElementType
      description: string
      limits: Record<string, { label: string; used: number; max: number; isCurrency?: boolean }>
    }
  >,

  // AI & Consumables (unchanged)
  aiEntitlements: {
    aiCredits: { used: 67500, max: 100000, period: "yearly", resetDate: "2026-01-01" },
    ocrCredits: { used: 42000, max: 50000, period: "yearly", resetDate: "2026-01-01" },
    automationRuns: { used: 8500, max: 10000, period: "monthly", resetDate: "2025-02-01" },
    apiCalls: { used: 450000, max: 1000000, period: "monthly", resetDate: "2025-02-01" },
  } as AIEntitlements,

  // Enforcement behavior (unchanged)
  enforcementRules: {
    overageHandling: "block" as "block" | "notify" | "bill",
    warningThreshold: 80,
    creditResetFrequency: "yearly" as "monthly" | "yearly",
  },
}

function CreditUsageIndicator({
  label,
  used,
  max,
  period,
  resetDate,
  icon: Icon,
  isCurrency = false,
}: {
  label: string
  used: number
  max: number
  period?: string
  resetDate?: string
  icon: React.ElementType
  isCurrency?: boolean
}) {
  const percentage = (used / max) * 100
  const isWarning = percentage >= 80
  const isCritical = percentage >= 95

  const formatValue = (value: number) => {
    if (isCurrency) {
      return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact" }).format(value)
    }
    return new Intl.NumberFormat("en-US", { notation: "compact" }).format(value)
  }

  return (
    <div className="space-y-2 rounded-lg border p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{label}</span>
        </div>
        <span
          className={`text-sm font-semibold ${isCritical ? "text-destructive" : isWarning ? "text-orange-600" : "text-foreground"}`}
        >
          {formatValue(used)} / {formatValue(max)}
        </span>
      </div>
      <Progress
        value={percentage}
        className={`h-2 ${isCritical ? "[&>div]:bg-destructive" : isWarning ? "[&>div]:bg-orange-500" : ""}`}
      />
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{Math.round(percentage)}% used</span>
        {resetDate && (
          <span>
            Resets: {new Date(resetDate).toLocaleDateString()} ({period})
          </span>
        )}
      </div>
      {isCritical && (
        <p className="flex items-center gap-1 text-xs text-destructive">
          <AlertTriangle className="h-3 w-3" />
          Limit nearly reached - usage may be blocked
        </p>
      )}
    </div>
  )
}

function ModuleLimitsCard({
  moduleCode,
  moduleName,
  limits,
  icon: Icon,
  isExpanded,
  onToggle,
}: {
  moduleCode: string
  moduleName: string
  limits: Record<string, { label: string; used: number; max: number; period: string | null }>
  icon: React.ElementType
  isExpanded: boolean
  onToggle: () => void
}) {
  return (
    <Collapsible open={isExpanded}>
      <CollapsibleTrigger
        onClick={onToggle}
        className="flex w-full items-center justify-between rounded-lg border p-4 hover:bg-muted/50"
      >
        <div className="flex items-center gap-3">
          <div className="rounded-md bg-primary/10 p-2">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div className="text-left">
            <p className="font-medium">{moduleName}</p>
            <p className="text-xs text-muted-foreground">{Object.keys(limits).length} limits configured</p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        )}
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2">
        <div className="grid gap-3 rounded-lg border bg-muted/30 p-4">
          {Object.entries(limits).map(([key, limit]) => {
            const percentage = (limit.used / limit.max) * 100
            const isWarning = percentage >= 80
            const isCritical = percentage >= 95
            return (
              <div key={key} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{limit.label}</span>
                  <span
                    className={`font-medium ${isCritical ? "text-destructive" : isWarning ? "text-orange-600" : ""}`}
                  >
                    {limit.period === "days"
                      ? `${limit.max} days`
                      : `${limit.used.toLocaleString()} / ${limit.max.toLocaleString()}`}
                  </span>
                </div>
                {limit.period !== "days" && (
                  <Progress
                    value={percentage}
                    className={`h-1.5 ${isCritical ? "[&>div]:bg-destructive" : isWarning ? "[&>div]:bg-orange-500" : ""}`}
                  />
                )}
              </div>
            )
          })}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

function LicenseOverview() {
  const [expandedSections, setExpandedSections] = useState<string[]>(["summary", "modules", "limits"])
  const [isRefreshing, setIsRefreshing] = useState(false)

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => (prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]))
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    // Simulate API refresh
    setTimeout(() => setIsRefreshing(false), 1500)
  }

  const formatValue = (value: number, isCurrency = false) => {
    if (isCurrency) {
      return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact" }).format(value)
    }
    return new Intl.NumberFormat("en-US", { notation: "compact" }).format(value)
  }

  const getUsageColor = (used: number, max: number) => {
    const percentage = (used / max) * 100
    if (percentage >= 95) return "text-destructive"
    if (percentage >= 80) return "text-orange-600"
    return "text-foreground"
  }

  const getProgressColor = (used: number, max: number) => {
    const percentage = (used / max) * 100
    if (percentage >= 95) return "[&>div]:bg-destructive"
    if (percentage >= 80) return "[&>div]:bg-orange-500"
    return ""
  }

  const isExpired = extendedLicenseData.status === "Expired"
  const isSuspended = extendedLicenseData.status === "Suspended"

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Expired/Suspended Warning Banner */}
        {(isExpired || isSuspended) && (
          <div
            className={`flex items-center gap-3 rounded-lg border p-4 ${
              isExpired ? "border-destructive/50 bg-destructive/10" : "border-orange-500/50 bg-orange-500/10"
            }`}
          >
            <XCircle className={`h-5 w-5 ${isExpired ? "text-destructive" : "text-orange-600"}`} />
            <div className="flex-1">
              <p className={`font-medium ${isExpired ? "text-destructive" : "text-orange-700"}`}>
                {isExpired ? "License Expired" : "License Suspended"}
              </p>
              <p className="text-sm text-muted-foreground">
                {isExpired
                  ? "Your license has expired. The system is in read-only mode. Contact your administrator to renew."
                  : "Your license has been suspended. Contact support for assistance."}
              </p>
            </div>
          </div>
        )}

        {/* Data Source Indicator & Refresh */}
        <div className="flex items-center justify-between rounded-lg border bg-muted/30 px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Server className="h-4 w-4" />
            <span>Data sourced from License API</span>
            <span className="text-xs">
              (Last refreshed: {new Date(extendedLicenseData.lastRefreshed).toLocaleString()})
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </Button>
        </div>

        {/* License Summary Section */}
        <Collapsible open={expandedSections.includes("summary")}>
          <CollapsibleTrigger
            onClick={() => toggleSection("summary")}
            className="flex w-full items-center justify-between rounded-lg border bg-card p-4 hover:bg-muted/50"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-md bg-primary/10 p-2">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-semibold">License Summary</p>
                <p className="text-sm text-muted-foreground">Subscription plan and validity details</p>
              </div>
            </div>
            {expandedSections.includes("summary") ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2">
            <Card>
              <CardContent className="pt-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Subscription Plan</p>
                    <p className="text-lg font-semibold">{extendedLicenseData.plan}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">License Status</p>
                    <StatusBadge
                      variant={
                        extendedLicenseData.status === "Active"
                          ? "success"
                          : extendedLicenseData.status === "Expired"
                            ? "error"
                            : "warning"
                      }
                    >
                      {extendedLicenseData.status}
                    </StatusBadge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Environment</p>
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex h-2 w-2 rounded-full ${
                          extendedLicenseData.environment === "Production" ? "bg-green-500" : "bg-yellow-500"
                        }`}
                      />
                      <span className="font-medium">{extendedLicenseData.environment}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">License Start Date</p>
                    <p className="font-medium">{new Date(extendedLicenseData.validFrom).toLocaleDateString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">License End Date</p>
                    <p className="font-medium">{new Date(extendedLicenseData.validTill).toLocaleDateString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Billing Cycle</p>
                    <p className="font-medium">{extendedLicenseData.billingCycle}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>

        {/* Subscribed Modules Section */}
        <Collapsible open={expandedSections.includes("modules")}>
          <CollapsibleTrigger
            onClick={() => toggleSection("modules")}
            className="flex w-full items-center justify-between rounded-lg border bg-card p-4 hover:bg-muted/50"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-md bg-primary/10 p-2">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-semibold">Subscribed Modules</p>
                <p className="text-sm text-muted-foreground">
                  {Object.values(extendedLicenseData.modules).filter((m) => m.active).length} active modules
                </p>
              </div>
            </div>
            {expandedSections.includes("modules") ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2">
            <Card>
              <CardContent className="pt-6">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Module</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Valid Till</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(extendedLicenseData.modules).map(([code, module]) => (
                        <TableRow key={code}>
                          <TableCell>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex items-center gap-3 cursor-help">
                                  <div className={`rounded-md p-2 ${module.active ? "bg-primary/10" : "bg-muted"}`}>
                                    <module.icon
                                      className={`h-4 w-4 ${module.active ? "text-primary" : "text-muted-foreground"}`}
                                    />
                                  </div>
                                  <div>
                                    <span className={`font-medium ${!module.active && "text-muted-foreground"}`}>
                                      {module.moduleName}
                                    </span>
                                    <Info className="ml-1 inline h-3 w-3 text-muted-foreground" />
                                  </div>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent side="right" className="max-w-xs">
                                <p>{module.description}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TableCell>
                          <TableCell>
                            <StatusBadge variant={module.active ? "success" : "warning"}>
                              {module.active ? "Active" : "Inactive"}
                            </StatusBadge>
                          </TableCell>
                          <TableCell className={!module.active ? "text-muted-foreground" : ""}>
                            {module.validTill ? new Date(module.validTill).toLocaleDateString() : "—"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="mt-4 rounded-lg border bg-muted/30 p-4">
                  <h4 className="mb-2 text-sm font-medium">Module Visibility Rules</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      Active modules are accessible in UI and APIs
                    </li>
                    <li className="flex items-center gap-2">
                      <Ban className="h-4 w-4 text-red-600" />
                      Inactive modules are hidden from navigation
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>

        {/* Combined Limits & Entitlements Section */}
        <Collapsible open={expandedSections.includes("limits")}>
          <CollapsibleTrigger
            onClick={() => toggleSection("limits")}
            className="flex w-full items-center justify-between rounded-lg border bg-card p-4 hover:bg-muted/50"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-md bg-primary/10 p-2">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-semibold">Limits & Usage</p>
                <p className="text-sm text-muted-foreground">Platform, module, and user entitlements</p>
              </div>
            </div>
            {expandedSections.includes("limits") ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2">
            <Card>
              <CardContent className="space-y-6 pt-6">
                {/* Platform Limits */}
                <div>
                  <h4 className="mb-4 flex items-center gap-2 font-semibold">
                    <Building2 className="h-4 w-4" />
                    Platform Limits
                  </h4>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {Object.entries(extendedLicenseData.platformLimits).map(([key, limit]) => {
                      const percentage = (limit.used / limit.max) * 100
                      const labels: Record<string, string> = {
                        maxCompanies: "Companies",
                        maxEntities: "Entities",
                        maxLocations: "Locations",
                        maxInternalUsers: "Internal Users",
                        maxSupplierUsers: "Supplier Users",
                      }
                      return (
                        <div key={key} className="rounded-lg border p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">{labels[key]}</span>
                            <span className={`text-sm font-semibold ${getUsageColor(limit.used, limit.max)}`}>
                              {limit.used} / {limit.max}
                            </span>
                          </div>
                          <Progress value={percentage} className={`h-2 ${getProgressColor(limit.used, limit.max)}`} />
                          {percentage >= 80 && (
                            <p className="mt-2 flex items-center gap-1 text-xs text-orange-600">
                              <AlertTriangle className="h-3 w-3" />
                              {percentage >= 95 ? "Limit nearly reached" : "Approaching limit"}
                            </p>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>

                <Separator />

                {/* Module-Specific Limits */}
                <div>
                  <h4 className="mb-4 flex items-center gap-2 font-semibold">
                    <FileText className="h-4 w-4" />
                    Module-Specific Limits
                  </h4>
                  <div className="space-y-4">
                    {Object.entries(extendedLicenseData.modules)
                      .filter(([_, module]) => module.active)
                      .map(([code, module]) => (
                        <div key={code} className="rounded-lg border">
                          <div className="flex items-center gap-3 border-b bg-muted/30 p-3">
                            <module.icon className="h-4 w-4 text-primary" />
                            <span className="font-medium">{module.moduleName}</span>
                          </div>
                          <div className="grid gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
                            {Object.entries(module.limits).map(([limitKey, limit]) => {
                              const percentage = (limit.used / limit.max) * 100
                              return (
                                <div key={limitKey} className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">{limit.label}</span>
                                    <span className={`text-sm font-semibold ${getUsageColor(limit.used, limit.max)}`}>
                                      {formatValue(limit.used, limit.isCurrency)} /{" "}
                                      {formatValue(limit.max, limit.isCurrency)}
                                    </span>
                                  </div>
                                  <Progress
                                    value={percentage}
                                    className={`h-1.5 ${getProgressColor(limit.used, limit.max)}`}
                                  />
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                <Separator />

                {/* AI & Consumables */}
                <div>
                  <h4 className="mb-4 flex items-center gap-2 font-semibold">
                    <Sparkles className="h-4 w-4" />
                    AI & Consumables
                  </h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    {[
                      { key: "aiCredits", label: "AI Credits", icon: Sparkles },
                      { key: "ocrCredits", label: "OCR Credits", icon: Eye },
                      { key: "automationRuns", label: "Automation Runs", icon: Zap },
                      { key: "apiCalls", label: "API Calls", icon: Cpu },
                    ].map(({ key, label, icon: Icon }) => {
                      const data = extendedLicenseData.aiEntitlements[key as keyof AIEntitlements]
                      const percentage = (data.used / data.max) * 100
                      return (
                        <div key={key} className="rounded-lg border p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm font-medium">{label}</span>
                            </div>
                            <span className={`text-sm font-semibold ${getUsageColor(data.used, data.max)}`}>
                              {formatValue(data.used)} / {formatValue(data.max)}
                            </span>
                          </div>
                          <Progress value={percentage} className={`h-2 ${getProgressColor(data.used, data.max)}`} />
                          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                            <span>{Math.round(percentage)}% used</span>
                            <span>
                              Resets: {new Date(data.resetDate).toLocaleDateString()} ({data.period})
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>

        {/* Enforcement Behavior Section */}
        <Collapsible open={expandedSections.includes("enforcement")}>
          <CollapsibleTrigger
            onClick={() => toggleSection("enforcement")}
            className="flex w-full items-center justify-between rounded-lg border bg-card p-4 hover:bg-muted/50"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-md bg-primary/10 p-2">
                <Ban className="h-5 w-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-semibold">Enforcement Behavior</p>
                <p className="text-sm text-muted-foreground">System-enforced limits and restrictions</p>
              </div>
            </div>
            {expandedSections.includes("enforcement") ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2">
            <Card>
              <CardContent className="pt-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-start gap-3 rounded-lg border p-4">
                    <Ban className="mt-0.5 h-5 w-5 text-red-600" />
                    <div>
                      <p className="font-medium">Hard Limit Enforcement</p>
                      <p className="text-sm text-muted-foreground">
                        Creation blocked when hard limit is exceeded for any resource
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-lg border p-4">
                    <Bell className="mt-0.5 h-5 w-5 text-orange-600" />
                    <div>
                      <p className="font-medium">Threshold Warnings</p>
                      <p className="text-sm text-muted-foreground">
                        Warnings displayed at {extendedLicenseData.enforcementRules.warningThreshold}% usage
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-lg border p-4">
                    <Eye className="mt-0.5 h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Read-Only Mode</p>
                      <p className="text-sm text-muted-foreground">System enters read-only mode on license expiry</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-lg border p-4">
                    <Clock className="mt-0.5 h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-medium">Module Auto-Disable</p>
                      <p className="text-sm text-muted-foreground">Modules automatically disabled on expiry</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-lg border p-4">
                    <Shield className="mt-0.5 h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">Cascading Deactivation</p>
                      <p className="text-sm text-muted-foreground">Company deactivation disables all child resources</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-lg border p-4">
                    <Globe className="mt-0.5 h-5 w-5 text-cyan-600" />
                    <div>
                      <p className="font-medium">API Rate Limiting</p>
                      <p className="text-sm text-muted-foreground">API calls throttled based on remaining quota</p>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="rounded-lg bg-muted/30 p-4">
                  <h4 className="mb-3 text-sm font-medium">Example API Response (Display Only)</h4>
                  <pre className="overflow-x-auto rounded-md bg-background p-4 text-xs">
                    {JSON.stringify(
                      {
                        plan: extendedLicenseData.plan,
                        status: extendedLicenseData.status,
                        valid_from: extendedLicenseData.validFrom,
                        valid_till: extendedLicenseData.validTill,
                        modules: {
                          RFQ: { active: true, rfq_limit: 1000 },
                          INVOICE: { active: true, invoice_limit: 20000 },
                          SUPPLIER_PORTAL: { active: false },
                        },
                        users: {
                          internal: 200,
                          supplier: 500,
                        },
                        ai_credits: {
                          total: 100000,
                          used: 45000,
                        },
                      },
                      null,
                      2,
                    )}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </TooltipProvider>
  )
}

export default function CompanySetupPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedEntities, setExpandedEntities] = useState<string[]>(companyData.entities.map((e) => e.entityId))
  const [expandedModules, setExpandedModules] = useState<string[]>([])
  const [activeLicenseTab, setActiveLicenseTab] = useState("overview")
  const [selectedEntities, setSelectedEntities] = useState<string[]>([])
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])

  const allEntities = companyData.entities
  const allLocations = companyData.entities.flatMap((e) => e.locations.map((l) => ({ ...l, entityName: e.entityName })))

  // Entity selection helpers
  const toggleEntitySelection = (entityId: string) => {
    setSelectedEntities((prev) =>
      prev.includes(entityId) ? prev.filter((id) => id !== entityId) : [...prev, entityId]
    )
  }

  const toggleAllEntities = () => {
    if (selectedEntities.length === allEntities.length) {
      setSelectedEntities([])
    } else {
      setSelectedEntities(allEntities.map((e) => e.entityId))
    }
  }

  const clearEntitySelection = () => setSelectedEntities([])

  // Location selection helpers
  const toggleLocationSelection = (locationId: string) => {
    setSelectedLocations((prev) =>
      prev.includes(locationId) ? prev.filter((id) => id !== locationId) : [...prev, locationId]
    )
  }

  const toggleAllLocations = () => {
    if (selectedLocations.length === allLocations.length) {
      setSelectedLocations([])
    } else {
      setSelectedLocations(allLocations.map((l) => l.locationId))
    }
  }

  const clearLocationSelection = () => setSelectedLocations([])

  return (
    <div className="flex flex-col">
      <Header
        title="Company Setup"
        description="Configure your organization structure, entities, locations, and subscription."
      />

      <div className="p-6">
        <Tabs value={activeLicenseTab} onValueChange={setActiveLicenseTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="company">Company</TabsTrigger>
            <TabsTrigger value="entities">Entities</TabsTrigger>
            <TabsTrigger value="locations">Locations</TabsTrigger>
            <TabsTrigger value="license">License</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Left: License & Usage */}
              <div className="space-y-6">
                {/* License Card */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">Subscription</CardTitle>
                      <StatusBadge variant={licenseData.status === "Active" ? "success" : "error"}>
                        {licenseData.status}
                      </StatusBadge>
                    </div>
                    <CardDescription>{licenseData.subscriptionPlan} Plan</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Valid until:</span>
                      <span className="font-medium">{new Date(licenseData.endDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Billing:</span>
                      <span className="font-medium">{licenseData.billingCycle}</span>
                    </div>
                    <Separator />
                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      Manage Subscription
                    </Button>
                  </CardContent>
                </Card>

                {/* Usage Metrics Card */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Usage & Limits</CardTitle>
                    <CardDescription>Current usage against license limits</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <UsageIndicator
                      label="Companies"
                      used={usageMetrics.companies.used}
                      max={usageMetrics.companies.max}
                      icon={Building2}
                    />
                    <UsageIndicator
                      label="Entities"
                      used={usageMetrics.entities.used}
                      max={usageMetrics.entities.max}
                      icon={Building}
                    />
                    <UsageIndicator
                      label="Locations"
                      used={usageMetrics.locations.used}
                      max={usageMetrics.locations.max}
                      icon={MapPin}
                    />
                    <UsageIndicator
                      label="Users"
                      used={usageMetrics.users.used}
                      max={usageMetrics.users.max}
                      icon={Users}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Right: Hierarchy Tree */}
              <Card className="lg:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <div>
                    <CardTitle className="text-base">Organization Hierarchy</CardTitle>
                    <CardDescription>Company → Entity → Location structure</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <HierarchyTree company={companyData} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="company" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Company (Tenant) Configuration</CardTitle>
                  <CardDescription>Primary company configuration. One company per tenant.</CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Company
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Edit Company Details</DialogTitle>
                      <DialogDescription>
                        Update your company configuration. Changes will affect all entities and locations.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="company-name">Company Name *</Label>
                          <Input id="company-name" defaultValue={companyData.companyName} />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="company-code">Company Code *</Label>
                          <Input id="company-code" defaultValue={companyData.companyCode} />
                          <p className="text-xs text-muted-foreground">Must be unique</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="legal-id">Legal / Establishment ID</Label>
                          <Input id="legal-id" defaultValue={companyData.legalEstablishmentId} />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="tax-reg">Tax Registration Number</Label>
                          <Input id="tax-reg" defaultValue={companyData.taxRegistrationNumber} />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="base-currency">Base Currency *</Label>
                          <Select defaultValue={companyData.baseCurrency}>
                            <SelectTrigger id="base-currency">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="USD">USD - US Dollar</SelectItem>
                              <SelectItem value="EUR">EUR - Euro</SelectItem>
                              <SelectItem value="GBP">GBP - British Pound</SelectItem>
                              <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="timezone">Default Timezone *</Label>
                          <Select defaultValue={companyData.defaultTimezone}>
                            <SelectTrigger id="timezone">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="America/New_York">America/New_York</SelectItem>
                              <SelectItem value="America/Chicago">America/Chicago</SelectItem>
                              <SelectItem value="America/Los_Angeles">America/Los_Angeles</SelectItem>
                              <SelectItem value="Europe/London">Europe/London</SelectItem>
                              <SelectItem value="Europe/Paris">Europe/Paris</SelectItem>
                              <SelectItem value="Asia/Kolkata">Asia/Kolkata</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="fiscal-start">Fiscal Year Start *</Label>
                          <Input id="fiscal-start" type="date" defaultValue={companyData.fiscalYearStart} />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="fiscal-end">Fiscal Year End *</Label>
                          <Input id="fiscal-end" type="date" defaultValue={companyData.fiscalYearEnd} />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="country">Country of Registration *</Label>
                        <Select defaultValue={companyData.countryOfRegistration}>
                          <SelectTrigger id="country">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="United States">United States</SelectItem>
                            <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                            <SelectItem value="Germany">Germany</SelectItem>
                            <SelectItem value="France">France</SelectItem>
                            <SelectItem value="India">India</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" className="bg-transparent">
                        Cancel
                      </Button>
                      <Button>Save Changes</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="grid gap-1">
                      <Label className="text-muted-foreground">Company ID</Label>
                      <p className="font-mono text-sm">{companyData.companyId}</p>
                    </div>
                    <div className="grid gap-1">
                      <Label className="text-muted-foreground">Company Name</Label>
                      <p className="font-medium">{companyData.companyName}</p>
                    </div>
                    <div className="grid gap-1">
                      <Label className="text-muted-foreground">Company Code</Label>
                      <p className="font-mono text-sm">{companyData.companyCode}</p>
                    </div>
                    <div className="grid gap-1">
                      <Label className="text-muted-foreground">Legal / Establishment ID</Label>
                      <p className="text-sm">{companyData.legalEstablishmentId}</p>
                    </div>
                    <div className="grid gap-1">
                      <Label className="text-muted-foreground">Tax Registration Number</Label>
                      <p className="text-sm">{companyData.taxRegistrationNumber}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="grid gap-1">
                      <Label className="text-muted-foreground">Base Currency</Label>
                      <p className="text-sm">{companyData.baseCurrency}</p>
                    </div>
                    <div className="grid gap-1">
                      <Label className="text-muted-foreground">Fiscal Year</Label>
                      <p className="text-sm">
                        {new Date(companyData.fiscalYearStart).toLocaleDateString()} -{" "}
                        {new Date(companyData.fiscalYearEnd).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="grid gap-1">
                      <Label className="text-muted-foreground">Default Timezone</Label>
                      <p className="text-sm">{companyData.defaultTimezone}</p>
                    </div>
                    <div className="grid gap-1">
                      <Label className="text-muted-foreground">Country of Registration</Label>
                      <p className="text-sm">{companyData.countryOfRegistration}</p>
                    </div>
                    <div className="grid gap-1">
                      <Label className="text-muted-foreground">Status</Label>
                      <StatusBadge variant={companyData.status === "Active" ? "success" : "error"}>
                        {companyData.status}
                      </StatusBadge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="entities" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Legal Entities</CardTitle>
                  <CardDescription>Manage legal entities under your company.</CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button disabled={usageMetrics.entities.used >= usageMetrics.entities.max}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Entity
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Add New Entity</DialogTitle>
                      <DialogDescription>Create a new legal entity under your company.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="entity-name">Entity Name *</Label>
                          <Input id="entity-name" placeholder="Enter entity name" />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="entity-code">Entity Code *</Label>
                          <Input id="entity-code" placeholder="e.g., DNA-US" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="est-id">Establishment ID</Label>
                          <Input id="est-id" placeholder="Enter establishment ID" />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="tax-id">Tax ID</Label>
                          <Input id="tax-id" placeholder="Enter tax ID" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="entity-currency">Entity Currency *</Label>
                          <Select>
                            <SelectTrigger id="entity-currency">
                              <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="USD">USD - US Dollar</SelectItem>
                              <SelectItem value="EUR">EUR - Euro</SelectItem>
                              <SelectItem value="GBP">GBP - British Pound</SelectItem>
                              <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="entity-timezone">Entity Timezone *</Label>
                          <Select>
                            <SelectTrigger id="entity-timezone">
                              <SelectValue placeholder="Select timezone" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="America/New_York">America/New_York</SelectItem>
                              <SelectItem value="Europe/London">Europe/London</SelectItem>
                              <SelectItem value="Asia/Kolkata">Asia/Kolkata</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="entity-country">Country *</Label>
                        <Select>
                          <SelectTrigger id="entity-country">
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="United States">United States</SelectItem>
                            <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                            <SelectItem value="Germany">Germany</SelectItem>
                            <SelectItem value="France">France</SelectItem>
                            <SelectItem value="India">India</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" className="bg-transparent">
                        Cancel
                      </Button>
                      <Button>Create Entity</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {usageMetrics.entities.used >= usageMetrics.entities.max * 0.8 && (
                  <div className="mb-4 flex items-center gap-2 rounded-lg border border-orange-200 bg-orange-50 p-3 text-orange-800 dark:border-orange-900 dark:bg-orange-950 dark:text-orange-200">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm">
                      {usageMetrics.entities.used >= usageMetrics.entities.max
                        ? "Entity limit reached. Upgrade your plan to add more entities."
                        : `Approaching entity limit (${usageMetrics.entities.used}/${usageMetrics.entities.max}). Consider upgrading your plan.`}
                    </span>
                  </div>
                )}

                {/* Bulk Action Banner for Entities */}
                {selectedEntities.length > 0 && (
                  <div className="mb-4 flex items-center justify-between rounded-lg border border-primary/30 bg-primary/5 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium">
                        {selectedEntities.length} {selectedEntities.length === 1 ? "entity" : "entities"} selected
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="bg-transparent">
                        <Download className="mr-2 h-4 w-4" />
                        Export Selected
                      </Button>
                      <Button variant="outline" size="sm" className="bg-transparent">
                        <Edit className="mr-2 h-4 w-4" />
                        Bulk Edit
                      </Button>
                      <Button variant="outline" size="sm" className="bg-transparent text-destructive hover:bg-destructive hover:text-destructive-foreground">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Selected
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 ml-2" onClick={clearEntitySelection}>
                        <X className="h-4 w-4" />
                        <span className="sr-only">Clear selection</span>
                      </Button>
                    </div>
                  </div>
                )}

                <div className="mb-6 flex flex-wrap items-center gap-4">
                  <div className="flex-1">
                    <div className="relative max-w-sm">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input placeholder="Search entities..." className="pl-9" />
                    </div>
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">
                          <Checkbox
                            checked={selectedEntities.length === allEntities.length && allEntities.length > 0}
                            onCheckedChange={toggleAllEntities}
                            aria-label="Select all entities"
                          />
                        </TableHead>
                        <TableHead>Entity ID</TableHead>
                        <TableHead>Entity Name</TableHead>
                        <TableHead>Code</TableHead>
                        <TableHead>Country</TableHead>
                        <TableHead>Currency</TableHead>
                        <TableHead>Locations</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allEntities.map((entity) => (
                        <TableRow 
                          key={entity.entityId}
                          className={selectedEntities.includes(entity.entityId) ? "bg-primary/5" : ""}
                        >
                          <TableCell>
                            <Checkbox
                              checked={selectedEntities.includes(entity.entityId)}
                              onCheckedChange={() => toggleEntitySelection(entity.entityId)}
                              aria-label={`Select ${entity.entityName}`}
                            />
                          </TableCell>
                          <TableCell className="font-mono text-xs">{entity.entityId}</TableCell>
                          <TableCell className="font-medium">{entity.entityName}</TableCell>
                          <TableCell className="text-muted-foreground">{entity.entityCode}</TableCell>
                          <TableCell>{entity.country}</TableCell>
                          <TableCell>{entity.entityCurrency}</TableCell>
                          <TableCell>{entity.locations.length}</TableCell>
                          <TableCell>
                            <StatusBadge variant={entity.status === "Active" ? "success" : "warning"}>
                              {entity.status}
                            </StatusBadge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="locations" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Locations</CardTitle>
                  <CardDescription>Manage physical locations across all entities.</CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button disabled={usageMetrics.locations.used >= usageMetrics.locations.max}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Location
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Add New Location</DialogTitle>
                      <DialogDescription>Create a new location under an entity.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="loc-name">Location Name *</Label>
                          <Input id="loc-name" placeholder="Enter location name" />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="loc-code">Location Code *</Label>
                          <Input id="loc-code" placeholder="e.g., NY-HQ" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="loc-type">Location Type *</Label>
                          <Select>
                            <SelectTrigger id="loc-type">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Office">Office</SelectItem>
                              <SelectItem value="Plant">Plant</SelectItem>
                              <SelectItem value="Warehouse">Warehouse</SelectItem>
                              <SelectItem value="Store">Store</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="loc-entity">Entity *</Label>
                          <Select>
                            <SelectTrigger id="loc-entity">
                              <SelectValue placeholder="Select entity" />
                            </SelectTrigger>
                            <SelectContent>
                              {allEntities.map((e) => (
                                <SelectItem key={e.entityId} value={e.entityId}>
                                  {e.entityName}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="addr1">Address Line 1 *</Label>
                        <Input id="addr1" placeholder="Street address" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="addr2">Address Line 2</Label>
                        <Input id="addr2" placeholder="Suite, floor, building (optional)" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="city">City *</Label>
                          <Input id="city" placeholder="City" />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="state">State / Province *</Label>
                          <Input id="state" placeholder="State" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="loc-country">Country *</Label>
                          <Select>
                            <SelectTrigger id="loc-country">
                              <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="United States">United States</SelectItem>
                              <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                              <SelectItem value="Germany">Germany</SelectItem>
                              <SelectItem value="France">France</SelectItem>
                              <SelectItem value="India">India</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="postal">Postal Code *</Label>
                          <Input id="postal" placeholder="Postal code" />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="loc-tz">Location Timezone *</Label>
                        <Select>
                          <SelectTrigger id="loc-tz">
                            <SelectValue placeholder="Select timezone" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="America/New_York">America/New_York</SelectItem>
                            <SelectItem value="America/Chicago">America/Chicago</SelectItem>
                            <SelectItem value="America/Los_Angeles">America/Los_Angeles</SelectItem>
                            <SelectItem value="Europe/London">Europe/London</SelectItem>
                            <SelectItem value="Europe/Paris">Europe/Paris</SelectItem>
                            <SelectItem value="Asia/Kolkata">Asia/Kolkata</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" className="bg-transparent">
                        Cancel
                      </Button>
                      <Button>Create Location</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {/* Bulk Action Banner for Locations */}
                {selectedLocations.length > 0 && (
                  <div className="mb-4 flex items-center justify-between rounded-lg border border-primary/30 bg-primary/5 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium">
                        {selectedLocations.length} {selectedLocations.length === 1 ? "location" : "locations"} selected
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="bg-transparent">
                        <Download className="mr-2 h-4 w-4" />
                        Export Selected
                      </Button>
                      <Button variant="outline" size="sm" className="bg-transparent">
                        <Edit className="mr-2 h-4 w-4" />
                        Bulk Edit
                      </Button>
                      <Button variant="outline" size="sm" className="bg-transparent text-destructive hover:bg-destructive hover:text-destructive-foreground">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Selected
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 ml-2" onClick={clearLocationSelection}>
                        <X className="h-4 w-4" />
                        <span className="sr-only">Clear selection</span>
                      </Button>
                    </div>
                  </div>
                )}

                <div className="mb-6 flex flex-wrap items-center gap-4">
                  <div className="flex-1">
                    <div className="relative max-w-sm">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input placeholder="Search locations..." className="pl-9" />
                    </div>
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="Office">Office</SelectItem>
                      <SelectItem value="Plant">Plant</SelectItem>
                      <SelectItem value="Warehouse">Warehouse</SelectItem>
                      <SelectItem value="Store">Store</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Entity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Entities</SelectItem>
                      {allEntities.map((e) => (
                        <SelectItem key={e.entityId} value={e.entityId}>
                          {e.entityName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">
                          <Checkbox
                            checked={selectedLocations.length === allLocations.length && allLocations.length > 0}
                            onCheckedChange={toggleAllLocations}
                            aria-label="Select all locations"
                          />
                        </TableHead>
                        <TableHead>Location ID</TableHead>
                        <TableHead>Location Name</TableHead>
                        <TableHead>Code</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Entity</TableHead>
                        <TableHead>City</TableHead>
                        <TableHead>Country</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allLocations.map((location) => {
                        const LocationIcon = getLocationIcon(location.locationType)
                        return (
                          <TableRow 
                            key={location.locationId}
                            className={selectedLocations.includes(location.locationId) ? "bg-primary/5" : ""}
                          >
                            <TableCell>
                              <Checkbox
                                checked={selectedLocations.includes(location.locationId)}
                                onCheckedChange={() => toggleLocationSelection(location.locationId)}
                                aria-label={`Select ${location.locationName}`}
                              />
                            </TableCell>
                            <TableCell className="font-mono text-xs">{location.locationId}</TableCell>
                            <TableCell className="font-medium">{location.locationName}</TableCell>
                            <TableCell className="text-muted-foreground">{location.locationCode}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <LocationIcon className="h-4 w-4 text-muted-foreground" />
                                <span>{location.locationType}</span>
                              </div>
                            </TableCell>
                            <TableCell className="max-w-[150px] truncate text-muted-foreground">
                              {location.entityName}
                            </TableCell>
                            <TableCell>{location.city}</TableCell>
                            <TableCell>{location.country}</TableCell>
                            <TableCell>
                              <StatusBadge variant={location.status === "Active" ? "success" : "warning"}>
                                {location.status}
                              </StatusBadge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* License Tab - Replaced with new read-only LicenseOverview component */}
          <TabsContent value="license" className="space-y-6">
            <LicenseOverview />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
