"use client"

import React from "react"

import { useState } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Shield,
  Lock,
  Plus,
  ChevronRight,
  Check,
  Users,
  FileText,
  Inbox,
  Building2,
  ClipboardCheck,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Eye,
  Layers,
  Component,
  MousePointer,
  Zap,
  CheckCircle,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"

// Types
interface Permission {
  id: string
  name: string
  description: string
}

interface PermissionGroup {
  id: string
  name: string
  icon: React.ElementType
  permissions: Permission[]
}

interface UIElement {
  id: string
  name: string
  requiredPermission: string
  type: "button" | "tab" | "field"
}

interface ComponentConfig {
  id: string
  name: string
  requiredPermission: string
  uiElements: UIElement[]
}

interface LayoutConfig {
  id: string
  name: string
  description: string
  icon: React.ElementType
  requiredPermissions: string[]
  components: ComponentConfig[]
}

interface Action {
  id: string
  name: string
  requiredPermission: string
  parentElement: string
  parentComponent: string
  parentLayout: string
}

interface Role {
  id: string
  name: string
  description: string
  category: string
  process: string
  stage: string
  location: string
  companyCode: string
  plantCode: string
  isSystem: boolean
  permissions: string[]
  selectedLayouts: string[]
  selectedComponents: string[]
  selectedUIElements: string[]
  selectedActions: string[]
}

// Mock Data
const allRoles: Role[] = [
  {
    id: "cfo",
    name: "CFO",
    description: "Chief Financial Officer with full finance access",
    category: "Finance",
    process: "Invoice Processing",
    stage: "Approval",
    location: "New York",
    companyCode: "1000",
    plantCode: "P001",
    isSystem: true,
    permissions: [],
    selectedLayouts: [],
    selectedComponents: [],
    selectedUIElements: [],
    selectedActions: [],
  },
  {
    id: "finance-controller",
    name: "Finance Controller",
    description: "Manages financial operations and approvals",
    category: "Finance",
    process: "Invoice Processing",
    stage: "Approval",
    location: "New York",
    companyCode: "1000",
    plantCode: "P001",
    isSystem: true,
    permissions: [],
    selectedLayouts: [],
    selectedComponents: [],
    selectedUIElements: [],
    selectedActions: [],
  },
  {
    id: "ap-user",
    name: "AP User",
    description: "Accounts Payable user for invoice processing",
    category: "Finance",
    process: "Invoice Processing",
    stage: "Approval",
    location: "New York",
    companyCode: "1000",
    plantCode: "P001",
    isSystem: false,
    permissions: [],
    selectedLayouts: [],
    selectedComponents: [],
    selectedUIElements: [],
    selectedActions: [],
  },
  {
    id: "procurement-manager",
    name: "Procurement Manager",
    description: "Manages procurement operations and RFQs",
    category: "Procurement",
    process: "Invoice Processing",
    stage: "Approval",
    location: "New York",
    companyCode: "1000",
    plantCode: "P001",
    isSystem: true,
    permissions: [],
    selectedLayouts: [],
    selectedComponents: [],
    selectedUIElements: [],
    selectedActions: [],
  },
  {
    id: "compliance-officer",
    name: "Compliance Officer",
    description: "Oversees compliance and policy adherence",
    category: "Governance",
    process: "Invoice Processing",
    stage: "Approval",
    location: "New York",
    companyCode: "1000",
    plantCode: "P001",
    isSystem: true,
    permissions: [],
    selectedLayouts: [],
    selectedComponents: [],
    selectedUIElements: [],
    selectedActions: [],
  },
  {
    id: "auditor",
    name: "Auditor",
    description: "Read-only access for audit purposes",
    category: "Governance",
    process: "Invoice Processing",
    stage: "Approval",
    location: "New York",
    companyCode: "1000",
    plantCode: "P001",
    isSystem: true,
    permissions: [],
    selectedLayouts: [],
    selectedComponents: [],
    selectedUIElements: [],
    selectedActions: [],
  },
  {
    id: "tenant-admin",
    name: "Tenant Admin",
    description: "Full system administration access",
    category: "System",
    process: "Invoice Processing",
    stage: "Approval",
    location: "New York",
    companyCode: "1000",
    plantCode: "P001",
    isSystem: true,
    permissions: [],
    selectedLayouts: [],
    selectedComponents: [],
    selectedUIElements: [],
    selectedActions: [],
  },
]

const roleCategories: Array<{
  id: string
  name: string
  roles: Array<{ id: string; name: string; description: string; isSystem: boolean }>
}> = []

const permissionGroups: PermissionGroup[] = [
  {
    id: "invoice",
    name: "Invoice",
    icon: FileText,
    permissions: [
      { id: "invoice.view", name: "View Invoices", description: "View invoice list and details" },
      { id: "invoice.create", name: "Create Invoices", description: "Create new invoices" },
      { id: "invoice.edit", name: "Edit Invoices", description: "Modify existing invoices" },
      { id: "invoice.approve", name: "Approve Invoices", description: "Approve invoices for payment" },
      { id: "invoice.reject", name: "Reject Invoices", description: "Reject invoices" },
      { id: "invoice.pay", name: "Process Payments", description: "Process invoice payments" },
    ],
  },
  {
    id: "rfq",
    name: "RFQ",
    icon: ClipboardCheck,
    permissions: [
      { id: "rfq.view", name: "View RFQs", description: "View RFQ list and details" },
      { id: "rfq.create", name: "Create RFQs", description: "Create new RFQs" },
      { id: "rfq.edit", name: "Edit RFQs", description: "Modify existing RFQs" },
      { id: "rfq.approve", name: "Approve RFQs", description: "Approve RFQs" },
      { id: "rfq.assign", name: "Assign RFQs", description: "Assign RFQs to vendors" },
    ],
  },
  {
    id: "inbox",
    name: "Inbox",
    icon: Inbox,
    permissions: [
      { id: "inbox.view", name: "View Inbox", description: "View inbox items" },
      { id: "inbox.process", name: "Process Items", description: "Process inbox items" },
      { id: "inbox.assign", name: "Assign Items", description: "Assign items to users" },
    ],
  },
  {
    id: "vendor",
    name: "Vendor",
    icon: Building2,
    permissions: [
      { id: "vendor.view", name: "View Vendors", description: "View vendor list and details" },
      { id: "vendor.create", name: "Create Vendors", description: "Create new vendors" },
      { id: "vendor.edit", name: "Edit Vendors", description: "Modify vendor information" },
      { id: "vendor.approve", name: "Approve Vendors", description: "Approve vendor registrations" },
    ],
  },
  {
    id: "compliance",
    name: "Compliance",
    icon: Shield,
    permissions: [
      { id: "compliance.view", name: "View Compliance", description: "View compliance reports" },
      { id: "compliance.audit", name: "Audit Access", description: "Access audit trails" },
      { id: "compliance.manage", name: "Manage Policies", description: "Manage compliance policies" },
    ],
  },
]

const layoutConfigs: LayoutConfig[] = [
  {
    id: "rfq-layout",
    name: "RFQ",
    description: "Request for Quotation management interface",
    icon: ClipboardCheck,
    requiredPermissions: ["rfq.view"],
    components: [
      {
        id: "rfq-list",
        name: "RFQ List",
        requiredPermission: "rfq.view",
        uiElements: [
          { id: "rfq-search", name: "Search", requiredPermission: "rfq.view", type: "field" },
          { id: "rfq-filter", name: "Filters", requiredPermission: "rfq.view", type: "button" },
          { id: "rfq-create-btn", name: "Create RFQ", requiredPermission: "rfq.create", type: "button" },
        ],
      },
      {
        id: "rfq-details",
        name: "RFQ Details Panel",
        requiredPermission: "rfq.view",
        uiElements: [
          { id: "rfq-info-tab", name: "Info Tab", requiredPermission: "rfq.view", type: "tab" },
          { id: "rfq-vendors-tab", name: "Vendors Tab", requiredPermission: "rfq.view", type: "tab" },
          { id: "rfq-edit-btn", name: "Edit", requiredPermission: "rfq.edit", type: "button" },
          { id: "rfq-approve-btn", name: "Approve", requiredPermission: "rfq.approve", type: "button" },
        ],
      },
      {
        id: "rfq-assignment",
        name: "Assignment Panel",
        requiredPermission: "rfq.assign",
        uiElements: [
          { id: "rfq-assign-vendor", name: "Assign Vendor", requiredPermission: "rfq.assign", type: "button" },
          { id: "rfq-notify", name: "Send Notification", requiredPermission: "rfq.assign", type: "button" },
        ],
      },
    ],
  },
  {
    id: "inbox-layout",
    name: "Inbox",
    description: "Central inbox for processing documents",
    icon: Inbox,
    requiredPermissions: ["inbox.view"],
    components: [
      {
        id: "inbox-list",
        name: "Inbox List",
        requiredPermission: "inbox.view",
        uiElements: [
          { id: "inbox-search", name: "Search", requiredPermission: "inbox.view", type: "field" },
          { id: "inbox-sort", name: "Sort", requiredPermission: "inbox.view", type: "button" },
        ],
      },
      {
        id: "inbox-processing",
        name: "Processing Panel",
        requiredPermission: "inbox.process",
        uiElements: [
          { id: "inbox-categorize", name: "Categorize", requiredPermission: "inbox.process", type: "button" },
          { id: "inbox-forward", name: "Forward", requiredPermission: "inbox.process", type: "button" },
          { id: "inbox-assign", name: "Assign", requiredPermission: "inbox.assign", type: "button" },
        ],
      },
    ],
  },
  {
    id: "invoice-layout",
    name: "Invoice Processing",
    description: "Invoice management and payment processing",
    icon: FileText,
    requiredPermissions: ["invoice.view"],
    components: [
      {
        id: "invoice-list",
        name: "Invoice List",
        requiredPermission: "invoice.view",
        uiElements: [
          { id: "invoice-search", name: "Search", requiredPermission: "invoice.view", type: "field" },
          { id: "invoice-filter", name: "Filters", requiredPermission: "invoice.view", type: "button" },
          { id: "invoice-create-btn", name: "Create Invoice", requiredPermission: "invoice.create", type: "button" },
        ],
      },
      {
        id: "invoice-details",
        name: "Invoice Details",
        requiredPermission: "invoice.view",
        uiElements: [
          { id: "invoice-view-tab", name: "Details Tab", requiredPermission: "invoice.view", type: "tab" },
          { id: "invoice-history-tab", name: "History Tab", requiredPermission: "invoice.view", type: "tab" },
          { id: "invoice-edit-btn", name: "Edit", requiredPermission: "invoice.edit", type: "button" },
        ],
      },
      {
        id: "invoice-approval",
        name: "Approval Panel",
        requiredPermission: "invoice.approve",
        uiElements: [
          { id: "invoice-approve-btn", name: "Approve", requiredPermission: "invoice.approve", type: "button" },
          { id: "invoice-reject-btn", name: "Reject", requiredPermission: "invoice.reject", type: "button" },
        ],
      },
      {
        id: "invoice-payment",
        name: "Payment Panel",
        requiredPermission: "invoice.pay",
        uiElements: [
          { id: "invoice-pay-btn", name: "Process Payment", requiredPermission: "invoice.pay", type: "button" },
          { id: "invoice-schedule-btn", name: "Schedule Payment", requiredPermission: "invoice.pay", type: "button" },
        ],
      },
    ],
  },
]

// Generate actions from layouts
const generateActions = (): Action[] => {
  const actions: Action[] = []
  layoutConfigs.forEach((layout) => {
    layout.components.forEach((component) => {
      component.uiElements
        .filter((el) => el.type === "button")
        .forEach((element) => {
          actions.push({
            id: `action-${element.id}`,
            name: element.name,
            requiredPermission: element.requiredPermission,
            parentElement: element.name,
            parentComponent: component.name,
            parentLayout: layout.name,
          })
        })
    })
  })
  return actions
}

const allActions = generateActions()

const steps = [
  { id: 1, name: "Role Definition", icon: Users, description: "Define role name and description" },
  { id: 2, name: "Permissions", icon: Shield, description: "Select permissions from catalog" },
  { id: 3, name: "Layouts", icon: Layers, description: "Choose accessible layouts" },
  { id: 4, name: "Components", icon: Component, description: "Configure component access" },
  { id: 5, name: "UI Elements", icon: MousePointer, description: "Fine-tune UI element visibility" },
  { id: 6, name: "Actions", icon: Zap, description: "Configure last-mile action control" },
]

export default function RoleManagementPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [isCreatingNew, setIsCreatingNew] = useState(false)
  const [advancedMode, setAdvancedMode] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [replicateRoleId, setReplicateRoleId] = useState<string>("")

  // Role state
  const [roleName, setRoleName] = useState("")
  const [roleDescription, setRoleDescription] = useState("")
  const [company, setCompany] = useState("Acme Corporation") // Auto-prefilled from Company Setup
  const [selectedProcess, setSelectedProcess] = useState("")
  const [selectedStage, setSelectedStage] = useState("")
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])
  const [selectedCompanyCodes, setSelectedCompanyCodes] = useState<string[]>([])

  // Mock data for processes and stages
  const processes = [
    { id: "procure-to-pay", label: "Procure to Pay" },
    { id: "order-to-cash", label: "Order to Cash" },
    { id: "hire-to-retire", label: "Hire to Retire" },
    { id: "record-to-report", label: "Record to Report" },
  ]

  const stagesByProcess: Record<string, { id: string; label: string }[]> = {
    "procure-to-pay": [
      { id: "requisition", label: "Requisition" },
      { id: "purchase-order", label: "Purchase Order" },
      { id: "goods-receipt", label: "Goods Receipt" },
      { id: "invoice-processing", label: "Invoice Processing" },
      { id: "payment", label: "Payment" },
    ],
    "order-to-cash": [
      { id: "order-entry", label: "Order Entry" },
      { id: "order-fulfillment", label: "Order Fulfillment" },
      { id: "shipping", label: "Shipping" },
      { id: "invoicing", label: "Invoicing" },
      { id: "cash-collection", label: "Cash Collection" },
    ],
    "hire-to-retire": [
      { id: "recruitment", label: "Recruitment" },
      { id: "onboarding", label: "Onboarding" },
      { id: "performance-mgmt", label: "Performance Management" },
      { id: "compensation", label: "Compensation" },
      { id: "offboarding", label: "Offboarding" },
    ],
    "record-to-report": [
      { id: "data-collection", label: "Data Collection" },
      { id: "journal-entry", label: "Journal Entry" },
      { id: "reconciliation", label: "Reconciliation" },
      { id: "consolidation", label: "Consolidation" },
      { id: "reporting", label: "Reporting" },
    ],
  }

  const availableStages = selectedProcess ? stagesByProcess[selectedProcess] || [] : []

  // Mock data for locations and company codes
  const locations = [
    { id: "us-east", label: "US East" },
    { id: "us-west", label: "US West" },
    { id: "eu-central", label: "EU Central" },
    { id: "asia-pacific", label: "Asia Pacific" },
    { id: "uk", label: "United Kingdom" },
  ]

  const companyCodes = [
    { id: "ACC-001", label: "ACC-001 - Headquarters" },
    { id: "ACC-002", label: "ACC-002 - Manufacturing" },
    { id: "ACC-003", label: "ACC-003 - Retail" },
    { id: "ACC-004", label: "ACC-004 - Distribution" },
    { id: "ACC-005", label: "ACC-005 - Services" },
  ]
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
  const [selectedLayouts, setSelectedLayouts] = useState<string[]>([])
  const [selectedComponents, setSelectedComponents] = useState<string[]>([])
  const [selectedUIElements, setSelectedUIElements] = useState<string[]>([])
  const [selectedActions, setSelectedActions] = useState<string[]>([])

  const selectedRole = roleCategories
    .flatMap((c) => c.roles)
    .find((r) => r.id === selectedRoleId)

  const handleSelectRole = (roleId: string) => {
    const role = roleCategories.flatMap((c) => c.roles).find((r) => r.id === roleId)
    if (role) {
      setSelectedRoleId(roleId)
      setRoleName(role.name)
      setRoleDescription(role.description)
      setCurrentStep(1)
      // Reset selections for demo
      setSelectedPermissions([])
      setSelectedLayouts([])
      setSelectedComponents([])
      setSelectedUIElements([])
      setSelectedActions([])
      setIsCreatingNew(false)
    }
  }

  const handleCreateNew = () => {
    // Reset form state
    setRoleName("")
    setRoleDescription("")
    setReplicateRoleId("")
    setSelectedProcess("")
    setSelectedStage("")
    setSelectedLocations([])
    setSelectedCompanyCodes([])
    setIsCreateModalOpen(true)
  }

  // Handle Process change - reset Stage when Process changes
  const handleProcessChange = (processId: string) => {
    setSelectedProcess(processId)
    setSelectedStage("") // Reset stage when process changes
  }

  // Handle role replication - prefill process, stage, locations and company codes
  const handleReplicateRoleChange = (roleId: string) => {
    setReplicateRoleId(roleId)
    
    if (roleId) {
      const roleToReplicate = roleCategories.flatMap((c) => c.roles).find((r) => r.id === roleId)
      
      if (roleToReplicate) {
        // Prefill Process and Stage (mock data - in real app, fetch from role)
        setSelectedProcess(processes[0].id) // Default to first process
        setSelectedStage(stagesByProcess[processes[0].id][0].id) // Default to first stage
        
        // Check if it's Tenant Admin - select all
        if (roleToReplicate.name === "Tenant Admin" || roleId === "tenant-admin") {
          setSelectedLocations(locations.map((l) => l.id))
          setSelectedCompanyCodes(companyCodes.map((c) => c.id))
        } else {
          // Otherwise, prefill with mock data (in real app, fetch from role)
          setSelectedLocations([locations[0].id, locations[1].id])
          setSelectedCompanyCodes([companyCodes[0].id, companyCodes[1].id])
        }
      }
    } else {
      // Clear selections if no role selected
      setSelectedProcess("")
      setSelectedStage("")
      setSelectedLocations([])
      setSelectedCompanyCodes([])
    }
  }

  const handleProceedToCreate = () => {
    // Validation
    if (!roleName.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a role name",
        variant: "destructive",
      })
      return
    }

    if (!selectedProcess) {
      toast({
        title: "Validation Error",
        description: "Please select a process",
        variant: "destructive",
      })
      return
    }

    if (!selectedStage) {
      toast({
        title: "Validation Error",
        description: "Please select a stage",
        variant: "destructive",
      })
      return
    }

    if (selectedLocations.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select at least one location",
        variant: "destructive",
      })
      return
    }

    if (selectedCompanyCodes.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select at least one company code",
        variant: "destructive",
      })
      return
    }
    
    setIsCreateModalOpen(false)
    const params = new URLSearchParams({
      name: roleName,
      description: roleDescription || "",
      company: company,
      process: selectedProcess,
      stage: selectedStage,
      locations: selectedLocations.join(","),
      companyCodes: selectedCompanyCodes.join(","),
    })
    if (replicateRoleId) {
      params.append("replicateFrom", replicateRoleId)
    }
    router.push(`/sop/settings/role-management/new?${params.toString()}`)
  }

  // Check if form is valid
  const isFormValid = 
    roleName.trim() !== "" && 
    selectedProcess !== "" && 
    selectedStage !== "" && 
    selectedLocations.length > 0 && 
    selectedCompanyCodes.length > 0

const handleBack = () => {
  setSelectedRoleId(null)
  setIsCreatingNew(false)
  setCurrentStep(1)
  }

  const handleSaveRole = () => {
    // Simulate save operation
    const roleNameToSave = roleName || selectedRole?.name || "Role"
    toast({
      title: (
        <div className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <span>Role Saved Successfully</span>
        </div>
      ),
      description: `"${roleNameToSave}" has been saved with ${selectedPermissions.length} permissions, ${selectedLayouts.length} layouts, ${selectedComponents.length} components, ${selectedUIElements.length} UI elements, and ${selectedActions.length} actions.`,
    })
    // Navigate back to role list
    setSelectedRoleId(null)
    setIsCreatingNew(false)
    setCurrentStep(1)
  }

  const handleNextStep = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const togglePermission = (permissionId: string) => {
    if (selectedRole?.isSystem) return
    setSelectedPermissions((prev) =>
      prev.includes(permissionId) ? prev.filter((p) => p !== permissionId) : [...prev, permissionId]
    )
    // Reset downstream selections when permissions change
    setSelectedLayouts([])
    setSelectedComponents([])
    setSelectedUIElements([])
    setSelectedActions([])
  }

  const toggleLayout = (layoutId: string) => {
    if (selectedRole?.isSystem) return
    setSelectedLayouts((prev) =>
      prev.includes(layoutId) ? prev.filter((l) => l !== layoutId) : [...prev, layoutId]
    )
    // Reset downstream selections when layouts change
    setSelectedComponents([])
    setSelectedUIElements([])
    setSelectedActions([])
  }

  const toggleComponent = (componentId: string) => {
    if (selectedRole?.isSystem) return
    setSelectedComponents((prev) =>
      prev.includes(componentId) ? prev.filter((c) => c !== componentId) : [...prev, componentId]
    )
    setSelectedUIElements([])
    setSelectedActions([])
  }

  const toggleUIElement = (elementId: string) => {
    if (selectedRole?.isSystem) return
    setSelectedUIElements((prev) =>
      prev.includes(elementId) ? prev.filter((e) => e !== elementId) : [...prev, elementId]
    )
  }

  const toggleAction = (actionId: string) => {
    if (selectedRole?.isSystem) return
    setSelectedActions((prev) =>
      prev.includes(actionId) ? prev.filter((a) => a !== actionId) : [...prev, actionId]
    )
  }

  const hasPermission = (permissionId: string) => selectedPermissions.includes(permissionId)

  const isLayoutAvailable = (layout: LayoutConfig) => {
    return layout.requiredPermissions.every((p) => hasPermission(p))
  }

  const isComponentAvailable = (component: ComponentConfig) => {
    return hasPermission(component.requiredPermission)
  }

  const isUIElementAvailable = (element: UIElement) => {
    return hasPermission(element.requiredPermission)
  }

  const enableAllPermittedComponents = () => {
    const available: string[] = []
    layoutConfigs.forEach((layout) => {
      if (selectedLayouts.includes(layout.id)) {
        layout.components.forEach((component) => {
          if (isComponentAvailable(component)) {
            available.push(component.id)
          }
        })
      }
    })
    setSelectedComponents(available)
  }

  const enableAllPermittedUIElements = () => {
    const available: string[] = []
    layoutConfigs.forEach((layout) => {
      if (selectedLayouts.includes(layout.id)) {
        layout.components.forEach((component) => {
          if (selectedComponents.includes(component.id)) {
            component.uiElements.forEach((element) => {
              if (isUIElementAvailable(element)) {
                available.push(element.id)
              }
            })
          }
        })
      }
    })
    setSelectedUIElements(available)
  }

  const enableAllPermittedActions = () => {
    const available: string[] = []
    allActions.forEach((action) => {
      if (hasPermission(action.requiredPermission)) {
        const layout = layoutConfigs.find((l) => l.name === action.parentLayout)
        if (layout && selectedLayouts.includes(layout.id)) {
          const component = layout.components.find((c) => c.name === action.parentComponent)
          if (component && selectedComponents.includes(component.id)) {
            available.push(action.id)
          }
        }
      }
    })
    setSelectedActions(available)
  }

// Role List View
  if (!selectedRoleId && !isCreatingNew) {
  return (
  <div className="h-full bg-background flex flex-col">
  <Header title="Role Management" />
  <div className="flex-1 overflow-auto p-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/sop/settings" className="hover:text-foreground transition-colors">
              Settings
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">Role Management</span>
          </div>

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-semibold text-foreground mb-2">Role Management</h1>
              <p className="text-sm text-muted-foreground">
                Configure roles with fine-grained access control from layouts to actions
              </p>
            </div>
            <Button onClick={handleCreateNew} className="gap-2">
              <Plus className="h-4 w-4" />
              Create New Role
            </Button>
          </div>

          {/* Create Role Modal */}
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogContent className="sm:max-w-[1000px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-semibold">Create New Role</DialogTitle>
                <DialogDescription className="text-base">
                  Enter role name and select how you want to create your role
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                {/* Role Name */}
                <div className="space-y-2">
                  <Label htmlFor="role-name" className="text-base font-semibold">Role Name *</Label>
                  <Input
                    id="role-name"
                    placeholder="Enter role name"
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                    className="h-12 text-base"
                  />
                </div>

                {/* Role Creation Type */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Role Creation Type *</Label>
                  <p className="text-sm text-muted-foreground">
                    Select how you want to configure this role
                  </p>
                  
                  <div className="space-y-3 pt-2">
                    {/* Process + Stage Flow */}
                    <button
                      onClick={() => {
                        if (!roleName.trim()) {
                          toast({
                            title: "Validation Error",
                            description: "Please enter a role name first",
                            variant: "destructive",
                          })
                          return
                        }
                        setIsCreateModalOpen(false)
                        router.push(`/sop/settings/role-management/new?name=${encodeURIComponent(roleName)}&type=process-stage`)
                      }}
                      className="w-full border rounded-lg p-6 flex items-center gap-4 hover:bg-accent/50 transition-colors text-left group"
                    >
                      <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <Layers className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-base mb-1">Workflow Stages (Resource)</h3>
                        <p className="text-sm text-muted-foreground">
                          Create roles based on workflow processes and stages
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </button>

                    {/* Feature-Based Flow */}
                    <button
                      onClick={() => {
                        setIsCreateModalOpen(false)
                        router.push("/sop/settings/role-management/new")
                      }}
                      className="w-full border rounded-lg p-6 flex items-center gap-4 hover:bg-accent/50 transition-colors text-left group"
                    >
                      <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-base mb-1">App Resource ( Inbox, Dashboard)</h3>
                        <p className="text-sm text-muted-foreground">
                          Build custom roles with granular feature control
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </button>
                  </div>
                </div>
              </div>
              
              <DialogFooter className="flex justify-end">
                <Button variant="outline" onClick={() => setIsCreateModalOpen(false)} className="bg-transparent">
                  Cancel
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* All Roles Table */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">All Roles</CardTitle>
              <CardDescription>
                Manage all roles and permissions across the organization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">Role Name</TableHead>
                    <TableHead className="w-[120px]">Category</TableHead>
                    <TableHead className="w-[150px]">Process</TableHead>
                    <TableHead className="w-[120px]">Stage</TableHead>
                    <TableHead className="w-[120px]">Location</TableHead>
                    <TableHead className="w-[130px]">Company Code</TableHead>
                    <TableHead className="w-[110px]">Plant Code</TableHead>
                    <TableHead className="w-[100px]">Type</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allRoles.map((role) => (
                    <TableRow
                      key={role.id}
                      className="hover:bg-muted/50"
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full border-2 border-gray-400" />
                          {role.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs font-normal">
                          {role.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {role.process}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {role.stage}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {role.location}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {role.companyCode}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {role.plantCode}
                      </TableCell>
                      <TableCell>
                        {role.isSystem ? (
                          <div className="flex items-center gap-1 text-sm">
                            <Lock className="h-3 w-3" />
                            System
                          </div>
                        ) : (
                          <span className="text-sm">Custom</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/sop/settings/role-management/view/${role.id}`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="gap-1 h-8 bg-transparent"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Eye className="h-4 w-4" />
                              View
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1 h-8 bg-transparent"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleSelectRole(role.id)
                            }}
                          >
                            Configure
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

// Stepper View
  return (
  <div className="h-full bg-background flex flex-col">
  <Header title="Role Management" />
  <div className="flex-1 overflow-auto p-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/sop/settings" className="hover:text-foreground transition-colors">
            Settings
          </Link>
          <ChevronRight className="h-4 w-4" />
          <button onClick={handleBack} className="hover:text-foreground transition-colors">
            Role Management
          </button>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{isCreatingNew ? "New Role" : roleName}</span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold text-foreground">
                  {isCreatingNew ? "Create New Role" : roleName}
                </h1>
                {selectedRole?.isSystem && (
                  <Badge variant="secondary" className="gap-1">
                    <Lock className="h-3 w-3" />
                    Read-Only
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {isCreatingNew ? "Define a new role with custom permissions" : roleDescription}
              </p>
            </div>
          </div>
        </div>

        {/* Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const StepIcon = step.icon
              const isActive = step.id === currentStep
              const isCompleted = step.id < currentStep
              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center transition-colors ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : isCompleted
                            ? "bg-green-100 text-green-700 border-2 border-green-500"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {isCompleted ? <Check className="h-5 w-5" /> : <StepIcon className="h-5 w-5" />}
                    </div>
                    <span
                      className={`text-xs mt-2 text-center max-w-[80px] ${isActive ? "font-semibold text-foreground" : "text-muted-foreground"}`}
                    >
                      {step.name}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 mx-2 mt-[-20px] ${isCompleted ? "bg-green-500" : "bg-muted"}`}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="grid grid-cols-12 gap-6">
          {/* Main Content */}
          <div className="col-span-9">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {(() => {
                    const StepIcon = steps[currentStep - 1].icon
                    return <StepIcon className="h-5 w-5" />
                  })()}
                  {steps[currentStep - 1].name}
                </CardTitle>
                <CardDescription>{steps[currentStep - 1].description}</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Step 1: Role Definition */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="roleName">Role Name</Label>
                      <Input
                        id="roleName"
                        value={roleName}
                        onChange={(e) => setRoleName(e.target.value)}
                        placeholder="Enter role name"
                        disabled={selectedRole?.isSystem}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="roleDescription">Description</Label>
                      <Textarea
                        id="roleDescription"
                        value={roleDescription}
                        onChange={(e) => setRoleDescription(e.target.value)}
                        placeholder="Describe the role's purpose and responsibilities"
                        disabled={selectedRole?.isSystem}
                        className="mt-2"
                        rows={4}
                      />
                    </div>
                    {selectedRole?.isSystem && (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <div className="flex gap-3">
                          <Lock className="h-5 w-5 text-amber-600 flex-shrink-0" />
                          <div>
                            <h4 className="text-sm font-semibold text-amber-900">System Role</h4>
                            <p className="text-xs text-amber-800 mt-1">
                              This is a system-defined role and cannot be edited. You can view its configuration but
                              changes are not permitted.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 2: Permission Selection */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    {permissionGroups.map((group) => {
                      const GroupIcon = group.icon
                      return (
                        <div key={group.id} className="border border-border rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-4">
                            <GroupIcon className="h-5 w-5 text-muted-foreground" />
                            <h3 className="font-semibold">{group.name}</h3>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            {group.permissions.map((permission) => (
                              <div
                                key={permission.id}
                                className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                                  selectedPermissions.includes(permission.id)
                                    ? "border-primary bg-primary/5"
                                    : "border-border hover:border-muted-foreground/30"
                                }`}
                              >
                                <Checkbox
                                  id={permission.id}
                                  checked={selectedPermissions.includes(permission.id)}
                                  onCheckedChange={() => togglePermission(permission.id)}
                                  disabled={selectedRole?.isSystem}
                                />
                                <div className="flex-1">
                                  <Label
                                    htmlFor={permission.id}
                                    className="text-sm font-medium cursor-pointer"
                                  >
                                    {permission.name}
                                  </Label>
                                  <p className="text-xs text-muted-foreground mt-0.5">
                                    {permission.description}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* Step 3: Layout Selection */}
                {currentStep === 3 && (
                  <div className="space-y-4">
                    {selectedPermissions.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Shield className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>No permissions selected. Go back to Step 2 to select permissions first.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {layoutConfigs.map((layout) => {
                          const LayoutIcon = layout.icon
                          const available = isLayoutAvailable(layout)
                          const isSelected = selectedLayouts.includes(layout.id)
                          return (
                            <TooltipProvider key={layout.id}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Card
                                    className={`cursor-pointer transition-all ${
                                      !available
                                        ? "opacity-50 cursor-not-allowed"
                                        : isSelected
                                          ? "border-primary ring-2 ring-primary/20"
                                          : "hover:border-primary/50"
                                    }`}
                                    onClick={() => available && !selectedRole?.isSystem && toggleLayout(layout.id)}
                                  >
                                    <CardHeader>
                                      <div className="flex items-start justify-between">
                                        <LayoutIcon className="h-8 w-8 text-muted-foreground" />
                                        {!available && <Lock className="h-4 w-4 text-red-500" />}
                                        {isSelected && <Check className="h-5 w-5 text-primary" />}
                                      </div>
                                      <CardTitle className="text-base">{layout.name}</CardTitle>
                                      <CardDescription className="text-xs">{layout.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                      <div className="flex flex-wrap gap-1">
                                        {layout.requiredPermissions.map((perm) => (
                                          <Badge
                                            key={perm}
                                            variant={hasPermission(perm) ? "default" : "secondary"}
                                            className="text-[10px]"
                                          >
                                            {perm}
                                          </Badge>
                                        ))}
                                      </div>
                                    </CardContent>
                                  </Card>
                                </TooltipTrigger>
                                {!available && (
                                  <TooltipContent>
                                    <p>Missing required permissions: {layout.requiredPermissions.filter((p) => !hasPermission(p)).join(", ")}</p>
                                  </TooltipContent>
                                )}
                              </Tooltip>
                            </TooltipProvider>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Step 4: Component Configuration */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="advancedMode" className="text-sm">Advanced Mode</Label>
                          <Switch
                            id="advancedMode"
                            checked={advancedMode}
                            onCheckedChange={setAdvancedMode}
                            disabled={selectedRole?.isSystem}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {advancedMode ? "Manual component selection" : "Auto-enable all permitted components"}
                        </span>
                      </div>
                      {!advancedMode && (
                        <Button variant="outline" size="sm" onClick={enableAllPermittedComponents} disabled={selectedRole?.isSystem}>
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Apply Grouped Mode
                        </Button>
                      )}
                    </div>

                    {selectedLayouts.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Layers className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>No layouts selected. Go back to Step 3 to select layouts first.</p>
                      </div>
                    ) : (
                      layoutConfigs
                        .filter((layout) => selectedLayouts.includes(layout.id))
                        .map((layout) => (
                          <div key={layout.id} className="border border-border rounded-lg p-4">
                            <h3 className="font-semibold mb-4 flex items-center gap-2">
                              <layout.icon className="h-5 w-5" />
                              {layout.name} Components
                            </h3>
                            <div className="space-y-3">
                              {layout.components.map((component) => {
                                const available = isComponentAvailable(component)
                                const isSelected = selectedComponents.includes(component.id)
                                return (
                                  <TooltipProvider key={component.id}>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <div
                                          className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                                            !available
                                              ? "opacity-50 cursor-not-allowed bg-muted"
                                              : isSelected
                                                ? "border-primary bg-primary/5"
                                                : "hover:border-muted-foreground/30 cursor-pointer"
                                          }`}
                                          onClick={() => available && advancedMode && !selectedRole?.isSystem && toggleComponent(component.id)}
                                        >
                                          <div className="flex items-center gap-3">
                                            {advancedMode && (
                                              <Checkbox
                                                checked={isSelected}
                                                disabled={!available || selectedRole?.isSystem}
                                                onCheckedChange={() => toggleComponent(component.id)}
                                              />
                                            )}
                                            <div>
                                              <span className="font-medium text-sm">{component.name}</span>
                                              <Badge variant="outline" className="ml-2 text-[10px] font-mono">
                                                {component.requiredPermission}
                                              </Badge>
                                            </div>
                                          </div>
                                          {!available && <Lock className="h-4 w-4 text-red-500" />}
                                          {available && isSelected && !advancedMode && (
                                            <Check className="h-4 w-4 text-green-600" />
                                          )}
                                        </div>
                                      </TooltipTrigger>
                                      {!available && (
                                        <TooltipContent>
                                          <p>Missing permission: {component.requiredPermission}</p>
                                        </TooltipContent>
                                      )}
                                    </Tooltip>
                                  </TooltipProvider>
                                )
                              })}
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                )}

                {/* Step 5: UI Element Configuration */}
                {currentStep === 5 && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-end pb-4 border-b">
                      <Button variant="outline" size="sm" onClick={enableAllPermittedUIElements} disabled={selectedRole?.isSystem}>
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Enable All Permitted
                      </Button>
                    </div>

                    {selectedComponents.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Component className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>No components selected. Go back to Step 4 to select components first.</p>
                      </div>
                    ) : (
                      layoutConfigs
                        .filter((layout) => selectedLayouts.includes(layout.id))
                        .map((layout) => (
                          <div key={layout.id}>
                            {layout.components
                              .filter((component) => selectedComponents.includes(component.id))
                              .map((component) => (
                                <div key={component.id} className="border border-border rounded-lg p-4 mb-4">
                                  <h3 className="font-semibold mb-4 text-sm">
                                    {layout.name} / {component.name}
                                  </h3>
                                  <div className="flex flex-wrap gap-2">
                                    {component.uiElements.map((element) => {
                                      const available = isUIElementAvailable(element)
                                      const isSelected = selectedUIElements.includes(element.id)
                                      return (
                                        <TooltipProvider key={element.id}>
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <Button
                                                variant={isSelected ? "default" : "outline"}
                                                size="sm"
                                                disabled={!available || selectedRole?.isSystem}
                                                onClick={() => toggleUIElement(element.id)}
                                                className={`${!available ? "opacity-50" : ""}`}
                                              >
                                                {element.name}
                                                <Badge
                                                  variant={isSelected ? "secondary" : "outline"}
                                                  className="ml-2 text-[10px]"
                                                >
                                                  {element.type}
                                                </Badge>
                                              </Button>
                                            </TooltipTrigger>
                                            {!available && (
                                              <TooltipContent>
                                                <p>Missing permission: {element.requiredPermission}</p>
                                              </TooltipContent>
                                            )}
                                          </Tooltip>
                                        </TooltipProvider>
                                      )
                                    })}
                                  </div>
                                </div>
                              ))}
                          </div>
                        ))
                    )}
                  </div>
                )}

                {/* Step 6: Action Configuration */}
                {currentStep === 6 && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-end pb-4 border-b">
                      <Button variant="outline" size="sm" onClick={enableAllPermittedActions} disabled={selectedRole?.isSystem}>
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Enable All Permitted
                      </Button>
                    </div>

                    {selectedUIElements.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <MousePointer className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>No UI elements selected. Go back to Step 5 to select UI elements first.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {allActions
                          .filter((action) => {
                            const layout = layoutConfigs.find((l) => l.name === action.parentLayout)
                            if (!layout || !selectedLayouts.includes(layout.id)) return false
                            const component = layout.components.find((c) => c.name === action.parentComponent)
                            return component && selectedComponents.includes(component.id)
                          })
                          .map((action) => {
                            const available = hasPermission(action.requiredPermission)
                            const isSelected = selectedActions.includes(action.id)
                            return (
                              <TooltipProvider key={action.id}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div
                                      className={`flex items-center justify-between p-4 rounded-lg border transition-colors cursor-pointer ${
                                        !available
                                          ? "opacity-50 cursor-not-allowed bg-muted"
                                          : isSelected
                                            ? "border-primary bg-primary/5"
                                            : "hover:border-muted-foreground/30"
                                      }`}
                                      onClick={() => available && !selectedRole?.isSystem && toggleAction(action.id)}
                                    >
                                      <div className="flex items-center gap-4">
                                        <Checkbox
                                          checked={isSelected}
                                          disabled={!available || selectedRole?.isSystem}
                                        />
                                        <div>
                                          <div className="flex items-center gap-2">
                                            <Zap className="h-4 w-4 text-amber-500" />
                                            <span className="font-medium">{action.name}</span>
                                          </div>
                                          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                            <span>{action.parentLayout}</span>
                                            <ChevronRight className="h-3 w-3" />
                                            <span>{action.parentComponent}</span>
                                            <ChevronRight className="h-3 w-3" />
                                            <span>{action.parentElement}</span>
                                          </div>
                                        </div>
                                      </div>
                                      <Badge variant="outline" className="font-mono text-[10px]">
                                        {action.requiredPermission}
                                      </Badge>
                                    </div>
                                  </TooltipTrigger>
                                  {!available && (
                                    <TooltipContent>
                                      <p>Missing permission: {action.requiredPermission}</p>
                                    </TooltipContent>
                                  )}
                                </Tooltip>
                              </TooltipProvider>
                            )
                          })}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-6">
              <Button variant="outline" onClick={handlePrevStep} disabled={currentStep === 1}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <div className="flex items-center gap-3">
{currentStep === 6 && !selectedRole?.isSystem && (
  <Button variant="default" onClick={handleSaveRole}>
  Save Role
  </Button>
  )}
                <Button onClick={handleNextStep} disabled={currentStep === 6}>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>

          {/* Right Panel - Effective Access Preview */}
          <div className="col-span-3">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Eye className="h-5 w-5" />
                  Effective Access Preview
                </CardTitle>
                <CardDescription className="text-xs">Real-time view of configured access</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Permissions ({selectedPermissions.length})
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedPermissions.slice(0, 6).map((p) => (
                      <Badge key={p} variant="secondary" className="text-[10px]">
                        {p.split(".")[1]}
                      </Badge>
                    ))}
                    {selectedPermissions.length > 6 && (
                      <Badge variant="outline" className="text-[10px]">
                        +{selectedPermissions.length - 6} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Layouts ({selectedLayouts.length})
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedLayouts.map((layoutId) => {
                      const layout = layoutConfigs.find((l) => l.id === layoutId)
                      return layout ? (
                        <Badge key={layoutId} className="text-[10px]">
                          {layout.name}
                        </Badge>
                      ) : null
                    })}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Components ({selectedComponents.length})
                  </h4>
                  <div className="text-xs text-muted-foreground">
                    {selectedComponents.length} component(s) configured
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    UI Elements ({selectedUIElements.length})
                  </h4>
                  <div className="text-xs text-muted-foreground">
                    {selectedUIElements.length} element(s) visible
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Actions ({selectedActions.length})
                  </h4>
                  <div className="text-xs text-muted-foreground">
                    {selectedActions.length} action(s) permitted
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-xs text-blue-800">
                      <strong>Note:</strong> Permissions are the single source of truth. Changing permissions will reset all downstream selections.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
