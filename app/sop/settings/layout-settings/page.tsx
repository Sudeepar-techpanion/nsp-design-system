"use client"

import React from "react"

import { useState } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  ChevronRight,
  Plus,
  FileText,
  ClipboardList,
  GripVertical,
  Trash2,
  Edit,
  Eye,
  Save,
  RotateCcw,
  LayoutGrid,
  Table,
  CreditCard,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Settings,
  List,
  FormInput,
  CheckCircle,
  AlertTriangle,
  Info,
  LogIn,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Types
interface MenuItem {
  id: string
  name: string
  enabled: boolean
  order: number
}

interface TableColumn {
  id: string
  name: string
  visible: boolean
  order: number
}

interface ContentConfig {
  type: "table" | "card" | "metrics"
  columns?: TableColumn[]
  defaultSort?: string
  sortDirection?: "asc" | "desc"
  pageSize?: number
  showMetrics?: boolean
}

interface StepConfig {
  id: string
  name: string
  enabled: boolean
  order: number
}

interface FormSection {
  id: string
  name: string
  order: number
}

interface LayoutConfig {
  id: string
  name: string
  description: string
  icon: React.ElementType
  type: "invoice" | "rfq" | "login"
  menuItems: MenuItem[]
  contentConfigs: Record<string, ContentConfig>
  // RFQ specific
  steps?: StepConfig[]
  formSections?: Record<string, FormSection[]>
}

// Initial Layout Configurations
const initialLayouts: LayoutConfig[] = [
  {
    id: "invoice-processing",
    name: "Invoice Processing",
    description: "Configure navigation and content structure for invoice processing workflow",
    icon: FileText,
    type: "invoice",
    menuItems: [
      { id: "all-invoices", name: "All Invoices", enabled: true, order: 1 },
      { id: "pending-approval", name: "Pending Approval", enabled: true, order: 2 },
      { id: "approved", name: "Approved", enabled: true, order: 3 },
      { id: "rejected", name: "Rejected", enabled: true, order: 4 },
      { id: "paid", name: "Paid", enabled: true, order: 5 },
      { id: "on-hold", name: "On Hold", enabled: false, order: 6 },
    ],
    contentConfigs: {
      "all-invoices": {
        type: "table",
        columns: [
          { id: "invoice-no", name: "Invoice No", visible: true, order: 1 },
          { id: "vendor", name: "Vendor", visible: true, order: 2 },
          { id: "amount", name: "Amount", visible: true, order: 3 },
          { id: "due-date", name: "Due Date", visible: true, order: 4 },
          { id: "status", name: "Status", visible: true, order: 5 },
          { id: "created-at", name: "Created At", visible: false, order: 6 },
          { id: "po-number", name: "PO Number", visible: false, order: 7 },
        ],
        defaultSort: "due-date",
        sortDirection: "asc",
        pageSize: 25,
        showMetrics: true,
      },
      "pending-approval": {
        type: "table",
        columns: [
          { id: "invoice-no", name: "Invoice No", visible: true, order: 1 },
          { id: "vendor", name: "Vendor", visible: true, order: 2 },
          { id: "amount", name: "Amount", visible: true, order: 3 },
          { id: "due-date", name: "Due Date", visible: true, order: 4 },
          { id: "submitted-by", name: "Submitted By", visible: true, order: 5 },
        ],
        defaultSort: "due-date",
        sortDirection: "asc",
        pageSize: 25,
        showMetrics: false,
      },
    },
  },
  {
    id: "rfq",
    name: "RFQ",
    description: "Configure navigation, stepper, and form layout for RFQ workflow",
    icon: ClipboardList,
    type: "rfq",
    menuItems: [
      { id: "all-rfqs", name: "All RFQs", enabled: true, order: 1 },
      { id: "draft", name: "Draft", enabled: true, order: 2 },
      { id: "pending-quotes", name: "Pending Quotes", enabled: true, order: 3 },
      { id: "evaluation", name: "Evaluation", enabled: true, order: 4 },
      { id: "awarded", name: "Awarded", enabled: true, order: 5 },
      { id: "closed", name: "Closed", enabled: true, order: 6 },
    ],
    contentConfigs: {},
    steps: [
      { id: "basic-info", name: "Basic Information", enabled: true, order: 1 },
      { id: "items", name: "Line Items", enabled: true, order: 2 },
      { id: "vendors", name: "Select Vendors", enabled: true, order: 3 },
      { id: "terms", name: "Terms & Conditions", enabled: true, order: 4 },
      { id: "review", name: "Review & Submit", enabled: true, order: 5 },
    ],
    formSections: {
      "basic-info": [
        { id: "general", name: "General Information", order: 1 },
        { id: "timeline", name: "Timeline", order: 2 },
        { id: "budget", name: "Budget", order: 3 },
      ],
      "items": [
        { id: "item-list", name: "Item List", order: 1 },
        { id: "specifications", name: "Specifications", order: 2 },
      ],
      "vendors": [
        { id: "vendor-selection", name: "Vendor Selection", order: 1 },
        { id: "invite-new", name: "Invite New Vendors", order: 2 },
      ],
      "terms": [
        { id: "payment-terms", name: "Payment Terms", order: 1 },
        { id: "delivery-terms", name: "Delivery Terms", order: 2 },
        { id: "special-conditions", name: "Special Conditions", order: 3 },
      ],
      "review": [
        { id: "summary", name: "Summary", order: 1 },
        { id: "attachments", name: "Attachments", order: 2 },
      ],
    },
  },
  {
    id: "login-screen",
    name: "Login Screen",
    description: "Configure login page layout, branding, and authentication options",
    icon: LogIn,
    type: "login",
    menuItems: [
      { id: "microsoft-sso", name: "Microsoft SSO", enabled: true, order: 1 },
      { id: "google-sso", name: "Google SSO", enabled: true, order: 2 },
      { id: "email-auth", name: "Email Authentication", enabled: true, order: 3 },
      { id: "saml-sso", name: "SAML SSO", enabled: false, order: 4 },
      { id: "ldap", name: "LDAP/AD", enabled: false, order: 5 },
    ],
    contentConfigs: {},
  },
]

export default function LayoutSettingsPage() {
  const { toast } = useToast()
  const [layouts, setLayouts] = useState<LayoutConfig[]>(initialLayouts)
  const [selectedLayoutId, setSelectedLayoutId] = useState<string | null>(null)
  const [selectedMenuItem, setSelectedMenuItem] = useState<string | null>(null)
  const [selectedStep, setSelectedStep] = useState<string | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  
  // Dialogs
  const [isAddMenuItemDialogOpen, setIsAddMenuItemDialogOpen] = useState(false)
  const [isAddStepDialogOpen, setIsAddStepDialogOpen] = useState(false)
  const [isAddSectionDialogOpen, setIsAddSectionDialogOpen] = useState(false)
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false)
  const [renameTarget, setRenameTarget] = useState<{ type: "menu" | "step" | "section", id: string, currentName: string } | null>(null)
  
  // Form states
  const [newMenuItemName, setNewMenuItemName] = useState("")
  const [newStepName, setNewStepName] = useState("")
  const [newSectionName, setNewSectionName] = useState("")
  const [renameName, setRenameName] = useState("")
  
  // Login screen config state
  const [loginConfig, setLoginConfig] = useState({
    logo: "",
    title: "Standardize.\nAutomate.\nOperate.",
    subtitle: "Enterprise-grade automation, compliance controls, and intelligent workflows that drive efficiency across your shared services operations.",
    features: [
      { id: "feature-1", enabled: true, title: "Invoice Processing", description: "Automated invoice capture, validation, and approval workflows" },
      { id: "feature-2", enabled: true, title: "Compliance & Risk", description: "Built-in controls and real-time monitoring for regulatory compliance" },
      { id: "feature-3", enabled: true, title: "Unified Platform", description: "Single source of truth for all stakeholders across the organization" },
    ],
  })
  
  // Drag state
  const [draggedItem, setDraggedItem] = useState<{ type: string, id: string } | null>(null)

  const selectedLayout = layouts.find(l => l.id === selectedLayoutId)
  
  // Handlers
  const handleSelectLayout = (layoutId: string) => {
    setSelectedLayoutId(layoutId)
    setSelectedMenuItem(null)
    setSelectedStep(null)
  }
  
  const handleBackToList = () => {
    if (hasUnsavedChanges) {
      // In real app, show confirmation dialog
    }
    setSelectedLayoutId(null)
    setSelectedMenuItem(null)
    setSelectedStep(null)
    setHasUnsavedChanges(false)
  }
  
  const handleSaveChanges = () => {
    setHasUnsavedChanges(false)
    toast({
      title: (
        <div className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <span>Layout Saved</span>
        </div>
      ),
      description: `${selectedLayout?.name} configuration has been saved. Changes will affect all users with access.`,
    })
  }
  
  const handleResetChanges = () => {
    setLayouts(initialLayouts)
    setHasUnsavedChanges(false)
    toast({
      title: "Changes Reset",
      description: "All changes have been reverted to the last saved state.",
    })
  }
  
  // Menu Item Handlers
  const handleToggleMenuItem = (menuId: string) => {
    if (!selectedLayout) return
    setLayouts(layouts.map(l => 
      l.id === selectedLayoutId 
        ? { ...l, menuItems: l.menuItems.map(m => m.id === menuId ? { ...m, enabled: !m.enabled } : m) }
        : l
    ))
    setHasUnsavedChanges(true)
  }
  
  const handleAddMenuItem = () => {
    if (!selectedLayout || !newMenuItemName.trim()) return
    const newItem: MenuItem = {
      id: newMenuItemName.toLowerCase().replace(/\s+/g, "-"),
      name: newMenuItemName,
      enabled: true,
      order: selectedLayout.menuItems.length + 1,
    }
    setLayouts(layouts.map(l => 
      l.id === selectedLayoutId 
        ? { ...l, menuItems: [...l.menuItems, newItem] }
        : l
    ))
    setNewMenuItemName("")
    setIsAddMenuItemDialogOpen(false)
    setHasUnsavedChanges(true)
  }
  
  const handleDeleteMenuItem = (menuId: string) => {
    if (!selectedLayout) return
    setLayouts(layouts.map(l => 
      l.id === selectedLayoutId 
        ? { ...l, menuItems: l.menuItems.filter(m => m.id !== menuId) }
        : l
    ))
    if (selectedMenuItem === menuId) {
      setSelectedMenuItem(null)
    }
    setHasUnsavedChanges(true)
  }
  
  const handleMoveMenuItem = (menuId: string, direction: "up" | "down") => {
    if (!selectedLayout) return
    const items = [...selectedLayout.menuItems].sort((a, b) => a.order - b.order)
    const index = items.findIndex(m => m.id === menuId)
    if (direction === "up" && index > 0) {
      [items[index].order, items[index - 1].order] = [items[index - 1].order, items[index].order]
    } else if (direction === "down" && index < items.length - 1) {
      [items[index].order, items[index + 1].order] = [items[index + 1].order, items[index].order]
    }
    setLayouts(layouts.map(l => l.id === selectedLayoutId ? { ...l, menuItems: items } : l))
    setHasUnsavedChanges(true)
  }
  
  // Step Handlers (RFQ)
  const handleToggleStep = (stepId: string) => {
    if (!selectedLayout?.steps) return
    setLayouts(layouts.map(l => 
      l.id === selectedLayoutId 
        ? { ...l, steps: l.steps?.map(s => s.id === stepId ? { ...s, enabled: !s.enabled } : s) }
        : l
    ))
    setHasUnsavedChanges(true)
  }
  
  const handleAddStep = () => {
    if (!selectedLayout?.steps || !newStepName.trim()) return
    const newStep: StepConfig = {
      id: newStepName.toLowerCase().replace(/\s+/g, "-"),
      name: newStepName,
      enabled: true,
      order: selectedLayout.steps.length + 1,
    }
    setLayouts(layouts.map(l => 
      l.id === selectedLayoutId 
        ? { ...l, steps: [...(l.steps || []), newStep] }
        : l
    ))
    setNewStepName("")
    setIsAddStepDialogOpen(false)
    setHasUnsavedChanges(true)
  }
  
  const handleMoveStep = (stepId: string, direction: "up" | "down") => {
    if (!selectedLayout?.steps) return
    const steps = [...selectedLayout.steps].sort((a, b) => a.order - b.order)
    const index = steps.findIndex(s => s.id === stepId)
    if (direction === "up" && index > 0) {
      [steps[index].order, steps[index - 1].order] = [steps[index - 1].order, steps[index].order]
    } else if (direction === "down" && index < steps.length - 1) {
      [steps[index].order, steps[index + 1].order] = [steps[index + 1].order, steps[index].order]
    }
    setLayouts(layouts.map(l => l.id === selectedLayoutId ? { ...l, steps } : l))
    setHasUnsavedChanges(true)
  }
  
  // Content Config Handlers
  const handleUpdateContentType = (menuId: string, type: "table" | "card" | "metrics") => {
    if (!selectedLayout) return
    const currentConfig = selectedLayout.contentConfigs[menuId] || { type: "table" }
    setLayouts(layouts.map(l => 
      l.id === selectedLayoutId 
        ? { ...l, contentConfigs: { ...l.contentConfigs, [menuId]: { ...currentConfig, type } } }
        : l
    ))
    setHasUnsavedChanges(true)
  }
  
  const handleToggleColumn = (menuId: string, columnId: string) => {
    if (!selectedLayout) return
    const config = selectedLayout.contentConfigs[menuId]
    if (!config?.columns) return
    setLayouts(layouts.map(l => 
      l.id === selectedLayoutId 
        ? { 
            ...l, 
            contentConfigs: { 
              ...l.contentConfigs, 
              [menuId]: { 
                ...config, 
                columns: config.columns.map(c => c.id === columnId ? { ...c, visible: !c.visible } : c) 
              } 
            } 
          }
        : l
    ))
    setHasUnsavedChanges(true)
  }
  
  const handleUpdatePageSize = (menuId: string, pageSize: number) => {
    if (!selectedLayout) return
    const config = selectedLayout.contentConfigs[menuId] || { type: "table" }
    setLayouts(layouts.map(l => 
      l.id === selectedLayoutId 
        ? { ...l, contentConfigs: { ...l.contentConfigs, [menuId]: { ...config, pageSize } } }
        : l
    ))
    setHasUnsavedChanges(true)
  }
  
  const handleToggleMetrics = (menuId: string) => {
    if (!selectedLayout) return
    const config = selectedLayout.contentConfigs[menuId] || { type: "table" }
    setLayouts(layouts.map(l => 
      l.id === selectedLayoutId 
        ? { ...l, contentConfigs: { ...l.contentConfigs, [menuId]: { ...config, showMetrics: !config.showMetrics } } }
        : l
    ))
    setHasUnsavedChanges(true)
  }
  
  // Rename Handler
  const handleRename = () => {
    if (!selectedLayout || !renameTarget || !renameName.trim()) return
    
    if (renameTarget.type === "menu") {
      setLayouts(layouts.map(l => 
        l.id === selectedLayoutId 
          ? { ...l, menuItems: l.menuItems.map(m => m.id === renameTarget.id ? { ...m, name: renameName } : m) }
          : l
      ))
    } else if (renameTarget.type === "step") {
      setLayouts(layouts.map(l => 
        l.id === selectedLayoutId 
          ? { ...l, steps: l.steps?.map(s => s.id === renameTarget.id ? { ...s, name: renameName } : s) }
          : l
      ))
    }
    
    setIsRenameDialogOpen(false)
    setRenameTarget(null)
    setRenameName("")
    setHasUnsavedChanges(true)
  }
  
  const openRenameDialog = (type: "menu" | "step" | "section", id: string, currentName: string) => {
    setRenameTarget({ type, id, currentName })
    setRenameName(currentName)
    setIsRenameDialogOpen(true)
  }
  
  // Validation
  const validateConfiguration = () => {
    if (!selectedLayout) return { valid: true, errors: [] }
    const errors: string[] = []
    
    const enabledMenuItems = selectedLayout.menuItems.filter(m => m.enabled)
    if (enabledMenuItems.length === 0) {
      errors.push("At least one navigation menu item must be enabled")
    }
    
    if (selectedLayout.type === "rfq" && selectedLayout.steps) {
      const enabledSteps = selectedLayout.steps.filter(s => s.enabled)
      if (enabledSteps.length === 0) {
        errors.push("At least one step must be enabled")
      }
    }
    
    return { valid: errors.length === 0, errors }
  }
  
  const validation = validateConfiguration()

// Layout List View
  if (!selectedLayoutId) {
  return (
  <div className="h-full bg-background flex flex-col">
  <Header title="Layout Settings" />
  <div className="flex-1 overflow-auto p-6">
  {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/sop/settings" className="hover:text-foreground transition-colors">
              Settings
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">Layout Settings</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-foreground mb-2">Layout Settings</h1>
            <p className="text-sm text-muted-foreground">
              Configure navigation structure and screen layouts for different workflows
            </p>
          </div>

          {/* Layout Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {layouts.map((layout) => {
              const IconComponent = layout.icon
              return (
                <Card
                  key={layout.id}
                  className="cursor-pointer hover:border-primary/50 hover:shadow-md transition-all"
                  onClick={() => handleSelectLayout(layout.id)}
                >
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <IconComponent className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-base">{layout.name}</CardTitle>
                        <CardDescription className="text-xs mt-1">
                          {layout.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{layout.menuItems.filter(m => m.enabled).length} menu items</span>
                        {layout.type === "rfq" && layout.steps && (
                          <span>{layout.steps.filter(s => s.enabled).length} steps</span>
                        )}
                      </div>
                      <Button variant="ghost" size="sm" className="gap-1">
                        Configure
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
          
          {/* Info Card */}
          <Card className="mt-6 border-blue-200 bg-blue-50/50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-blue-900 mb-1">About Layout Settings</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>- Layout settings define UI structure only, not access control</li>
                    <li>- Changes affect all users with access to that layout</li>
                    <li>- Use Role Management for permission-based access control</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

// Layout Configuration View
  return (
  <div className="h-full bg-background flex flex-col">
  <Header title="Layout Settings" />
  <div className="flex-1 overflow-auto p-6">
  {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/sop/settings" className="hover:text-foreground transition-colors">
            Settings
          </Link>
          <ChevronRight className="h-4 w-4" />
          <button 
            onClick={handleBackToList}
            className="hover:text-foreground transition-colors"
          >
            Layout Settings
          </button>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{selectedLayout?.name}</span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-foreground mb-2">
              {selectedLayout?.name} Configuration
            </h1>
            <p className="text-sm text-muted-foreground">
              {selectedLayout?.description}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {hasUnsavedChanges && (
              <Badge variant="outline" className="text-orange-600 border-orange-300">
                Unsaved Changes
              </Badge>
            )}
            <Button variant="outline" onClick={handleResetChanges} disabled={!hasUnsavedChanges}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button onClick={handleSaveChanges} disabled={!hasUnsavedChanges || !validation.valid}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
        
        {/* Validation Errors */}
        {!validation.valid && (
          <Card className="mb-4 border-red-200 bg-red-50">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800">Configuration Errors</p>
                  <ul className="text-xs text-red-700 mt-1">
                    {validation.errors.map((error, i) => (
                      <li key={i}>- {error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Configuration Area */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Panel: Navigation Settings / Login Methods */}
          <div className="col-span-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <List className="h-4 w-4" />
                    {selectedLayout?.type === "login" ? "Authentication Methods" : "Navigation Menus"}
                  </CardTitle>
                  {selectedLayout?.type !== "login" && (
                    <Button size="sm" variant="outline" onClick={() => setIsAddMenuItemDialogOpen(true)}>
                      <Plus className="h-3 w-3 mr-1" />
                      Add
                    </Button>
                  )}
                </div>
                <CardDescription className="text-xs">
                  {selectedLayout?.type === "login" 
                    ? "Configure available login methods on the right pane"
                    : "Configure left navigation menu items"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {selectedLayout?.menuItems
                    .sort((a, b) => a.order - b.order)
                    .map((item, index) => (
                      <div
                        key={item.id}
                        className={`flex items-center gap-2 p-2 rounded-lg border transition-colors cursor-pointer ${
                          selectedMenuItem === item.id 
                            ? "border-primary bg-primary/5" 
                            : "border-border hover:border-primary/30"
                        } ${!item.enabled ? "opacity-50" : ""}`}
                        onClick={() => setSelectedMenuItem(item.id)}
                      >
                        <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                        <span className="flex-1 text-sm font-medium truncate">{item.name}</span>
                        <div className="flex items-center gap-1">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleMoveMenuItem(item.id, "up")
                                  }}
                                  disabled={index === 0}
                                >
                                  <ChevronUp className="h-3 w-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Move Up</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleMoveMenuItem(item.id, "down")
                                  }}
                                  disabled={index === selectedLayout.menuItems.length - 1}
                                >
                                  <ChevronDown className="h-3 w-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Move Down</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    openRenameDialog("menu", item.id, item.name)
                                  }}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Rename</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <Switch
                            checked={item.enabled}
                            onCheckedChange={() => handleToggleMenuItem(item.id)}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 text-destructive hover:text-destructive"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleDeleteMenuItem(item.id)
                                  }}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Delete</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
            
            {/* RFQ Stepper Configuration */}
            {selectedLayout?.type === "rfq" && selectedLayout.steps && (
              <Card className="mt-4">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Stepper Configuration
                    </CardTitle>
                    <Button size="sm" variant="outline" onClick={() => setIsAddStepDialogOpen(true)}>
                      <Plus className="h-3 w-3 mr-1" />
                      Add
                    </Button>
                  </div>
                  <CardDescription className="text-xs">
                    Configure RFQ creation steps
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {selectedLayout.steps
                      .sort((a, b) => a.order - b.order)
                      .map((step, index) => (
                        <div
                          key={step.id}
                          className={`flex items-center gap-2 p-2 rounded-lg border transition-colors cursor-pointer ${
                            selectedStep === step.id 
                              ? "border-primary bg-primary/5" 
                              : "border-border hover:border-primary/30"
                          } ${!step.enabled ? "opacity-50" : ""}`}
                          onClick={() => setSelectedStep(step.id)}
                        >
                          <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                            {index + 1}
                          </div>
                          <span className="flex-1 text-sm font-medium truncate">{step.name}</span>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleMoveStep(step.id, "up")
                              }}
                              disabled={index === 0}
                            >
                              <ChevronUp className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleMoveStep(step.id, "down")
                              }}
                              disabled={index === selectedLayout.steps!.length - 1}
                            >
                              <ChevronDown className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={(e) => {
                                e.stopPropagation()
                                openRenameDialog("step", step.id, step.name)
                              }}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Switch
                              checked={step.enabled}
                              onCheckedChange={() => handleToggleStep(step.id)}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Panel: Content Configuration & Preview */}
          <div className="col-span-8">
            <Tabs defaultValue="config">
              <TabsList>
                <TabsTrigger value="config" className="gap-2">
                  <Settings className="h-4 w-4" />
                  Configuration
                </TabsTrigger>
                <TabsTrigger value="preview" className="gap-2">
                  <Eye className="h-4 w-4" />
                  Preview
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="config" className="mt-4">
                {selectedLayout?.type === "invoice" && selectedMenuItem && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">
                        Content Configuration: {selectedLayout.menuItems.find(m => m.id === selectedMenuItem)?.name}
                      </CardTitle>
                      <CardDescription>
                        Configure how content is displayed for this navigation item
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Content Type */}
                      <div>
                        <Label className="text-sm font-medium mb-3 block">Content Type</Label>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { type: "table" as const, icon: Table, label: "Table View" },
                            { type: "card" as const, icon: CreditCard, label: "Card View" },
                            { type: "metrics" as const, icon: BarChart3, label: "Metrics Panel" },
                          ].map(({ type, icon: Icon, label }) => (
                            <button
                              key={type}
                              className={`p-4 rounded-lg border-2 transition-all ${
                                (selectedLayout.contentConfigs[selectedMenuItem]?.type || "table") === type
                                  ? "border-primary bg-primary/5"
                                  : "border-border hover:border-primary/30"
                              }`}
                              onClick={() => handleUpdateContentType(selectedMenuItem, type)}
                            >
                              <Icon className="h-6 w-6 mx-auto mb-2" />
                              <p className="text-sm font-medium">{label}</p>
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      {/* Table Configuration */}
                      {(selectedLayout.contentConfigs[selectedMenuItem]?.type || "table") === "table" && (
                        <>
                          <div>
                            <Label className="text-sm font-medium mb-3 block">Visible Columns</Label>
                            <div className="grid grid-cols-2 gap-2">
                              {(selectedLayout.contentConfigs[selectedMenuItem]?.columns || []).map(col => (
                                <div
                                  key={col.id}
                                  className="flex items-center justify-between p-2 border rounded-lg"
                                >
                                  <span className="text-sm">{col.name}</span>
                                  <Switch
                                    checked={col.visible}
                                    onCheckedChange={() => handleToggleColumn(selectedMenuItem, col.id)}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium mb-2 block">Default Sort</Label>
                              <Select
                                value={selectedLayout.contentConfigs[selectedMenuItem]?.defaultSort || ""}
                                onValueChange={(value) => {
                                  const config = selectedLayout.contentConfigs[selectedMenuItem] || { type: "table" }
                                  setLayouts(layouts.map(l => 
                                    l.id === selectedLayoutId 
                                      ? { ...l, contentConfigs: { ...l.contentConfigs, [selectedMenuItem]: { ...config, defaultSort: value } } }
                                      : l
                                  ))
                                  setHasUnsavedChanges(true)
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select column" />
                                </SelectTrigger>
                                <SelectContent>
                                  {(selectedLayout.contentConfigs[selectedMenuItem]?.columns || [])
                                    .filter(c => c.visible)
                                    .map(col => (
                                      <SelectItem key={col.id} value={col.id}>{col.name}</SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label className="text-sm font-medium mb-2 block">Page Size</Label>
                              <Select
                                value={String(selectedLayout.contentConfigs[selectedMenuItem]?.pageSize || 25)}
                                onValueChange={(value) => handleUpdatePageSize(selectedMenuItem, parseInt(value))}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="10">10 rows</SelectItem>
                                  <SelectItem value="25">25 rows</SelectItem>
                                  <SelectItem value="50">50 rows</SelectItem>
                                  <SelectItem value="100">100 rows</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <p className="text-sm font-medium">Show Metrics Panel</p>
                              <p className="text-xs text-muted-foreground">Display summary metrics above the table</p>
                            </div>
                            <Switch
                              checked={selectedLayout.contentConfigs[selectedMenuItem]?.showMetrics || false}
                              onCheckedChange={() => handleToggleMetrics(selectedMenuItem)}
                            />
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                )}
                
                {selectedLayout?.type === "rfq" && selectedStep && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">
                        Form Configuration: {selectedLayout.steps?.find(s => s.id === selectedStep)?.name}
                      </CardTitle>
                      <CardDescription>
                        Configure form sections for this step
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {(selectedLayout.formSections?.[selectedStep] || [])
                          .sort((a, b) => a.order - b.order)
                          .map((section, index) => (
                            <div
                              key={section.id}
                              className="flex items-center gap-2 p-3 border rounded-lg"
                            >
                              <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                              <FormInput className="h-4 w-4 text-muted-foreground" />
                              <span className="flex-1 text-sm font-medium">{section.name}</span>
                              <Badge variant="secondary" className="text-xs">Section {index + 1}</Badge>
                            </div>
                          ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-4">
                        Note: Field-level configuration is managed separately
                      </p>
                    </CardContent>
                  </Card>
                )}
                
                {/* Login Screen Configuration */}
                {selectedLayout?.type === "login" && (
                  <div className="space-y-6">
                    {/* Logo Upload */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Brand Logo</CardTitle>
                        <CardDescription>Upload your company logo for the login screen</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center gap-4">
                            {loginConfig.logo ? (
                              <div className="h-16 w-32 border rounded-lg overflow-hidden bg-white flex items-center justify-center">
                                <img src={loginConfig.logo || "/placeholder.svg"} alt="Logo" className="max-h-full max-w-full object-contain" />
                              </div>
                            ) : (
                              <div className="h-16 w-32 border-2 border-dashed rounded-lg flex items-center justify-center text-muted-foreground">
                                <span className="text-xs">No logo</span>
                              </div>
                            )}
                            <div className="flex-1">
                              <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0]
                                  if (file) {
                                    const reader = new FileReader()
                                    reader.onloadend = () => {
                                      setLoginConfig(prev => ({ ...prev, logo: reader.result as string }))
                                      setHasUnsavedChanges(true)
                                    }
                                    reader.readAsDataURL(file)
                                  }
                                }}
                                className="text-sm"
                              />
                              <p className="text-xs text-muted-foreground mt-1">PNG, JPG or SVG (recommended: 200x60px)</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Left Pane Content */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Left Pane Content</CardTitle>
                        <CardDescription>Configure the branding section on the left side</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Title */}
                        <div>
                          <Label htmlFor="login-title" className="text-sm font-medium">Main Title</Label>
                          <textarea
                            id="login-title"
                            value={loginConfig.title}
                            onChange={(e) => {
                              setLoginConfig(prev => ({ ...prev, title: e.target.value }))
                              setHasUnsavedChanges(true)
                            }}
                            className="w-full mt-2 px-3 py-2 border rounded-md text-sm resize-none h-20"
                            placeholder="Enter main title (use \n for line breaks)"
                          />
                        </div>

                        {/* Subtitle */}
                        <div>
                          <Label htmlFor="login-subtitle" className="text-sm font-medium">Subtitle/Description</Label>
                          <textarea
                            id="login-subtitle"
                            value={loginConfig.subtitle}
                            onChange={(e) => {
                              setLoginConfig(prev => ({ ...prev, subtitle: e.target.value }))
                              setHasUnsavedChanges(true)
                            }}
                            className="w-full mt-2 px-3 py-2 border rounded-md text-sm resize-none h-24"
                            placeholder="Enter subtitle or description"
                          />
                        </div>

                        {/* Features */}
                        <div>
                          <Label className="text-sm font-medium mb-3 block">Feature Highlights</Label>
                          <div className="space-y-4">
                            {loginConfig.features.map((feature, index) => (
                              <div key={feature.id} className="border rounded-lg p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                  <Label className="text-sm font-medium">Feature {index + 1}</Label>
                                  <Switch
                                    checked={feature.enabled}
                                    onCheckedChange={(checked) => {
                                      setLoginConfig(prev => ({
                                        ...prev,
                                        features: prev.features.map(f => 
                                          f.id === feature.id ? { ...f, enabled: checked } : f
                                        )
                                      }))
                                      setHasUnsavedChanges(true)
                                    }}
                                  />
                                </div>
                                {feature.enabled && (
                                  <>
                                    <div>
                                      <Label htmlFor={`feature-title-${index}`} className="text-xs text-muted-foreground">Title</Label>
                                      <Input
                                        id={`feature-title-${index}`}
                                        value={feature.title}
                                        onChange={(e) => {
                                          setLoginConfig(prev => ({
                                            ...prev,
                                            features: prev.features.map(f => 
                                              f.id === feature.id ? { ...f, title: e.target.value } : f
                                            )
                                          }))
                                          setHasUnsavedChanges(true)
                                        }}
                                        className="mt-1"
                                        placeholder="Feature title"
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor={`feature-desc-${index}`} className="text-xs text-muted-foreground">Description</Label>
                                      <Input
                                        id={`feature-desc-${index}`}
                                        value={feature.description}
                                        onChange={(e) => {
                                          setLoginConfig(prev => ({
                                            ...prev,
                                            features: prev.features.map(f => 
                                              f.id === feature.id ? { ...f, description: e.target.value } : f
                                            )
                                          }))
                                          setHasUnsavedChanges(true)
                                        }}
                                        className="mt-1"
                                        placeholder="Feature description"
                                      />
                                    </div>
                                  </>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
                
                {!selectedMenuItem && !selectedStep && selectedLayout?.type !== "login" && (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center py-8 text-muted-foreground">
                        <Settings className="h-10 w-10 mx-auto mb-3 opacity-50" />
                        <p className="text-sm">Select a menu item{selectedLayout?.type === "rfq" ? " or step" : ""} to configure its content</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="preview" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Live Preview
                    </CardTitle>
                    <CardDescription>
                      Preview how the layout will appear to users
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="border rounded-lg overflow-hidden">
                      {/* Mock Layout Preview */}
                      <div className="flex h-[400px]">
                        {selectedLayout?.type === "login" ? (
                          <>
                            {/* Left Pane - Brand */}
                            <div className="w-1/2 bg-gradient-to-br from-[#3B2D7B] to-[#4a3680] text-white p-6 flex flex-col justify-center">
                              <div className="max-w-md mx-auto">
                                <h2 className="text-2xl font-bold mb-3" style={{ whiteSpace: 'pre-line' }}>
                                  {loginConfig.title}
                                </h2>
                                <p className="text-sm text-white/90 mb-4">
                                  {loginConfig.subtitle}
                                </p>
                                <div className="space-y-2">
                                  {loginConfig.features.filter(f => f.enabled).map((feature) => (
                                    <div key={feature.id} className="flex items-start gap-2">
                                      <div className="h-4 w-4 rounded bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <CheckCircle className="h-2.5 w-2.5 text-white" />
                                      </div>
                                      <div>
                                        <p className="text-xs font-semibold">{feature.title}</p>
                                        <p className="text-xs text-white/70">{feature.description}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                            {/* Right Pane - Login Methods */}
                            <div className="w-1/2 bg-white p-6 flex flex-col justify-center">
                              <div className="max-w-sm mx-auto w-full">
                                {loginConfig.logo && (
                                  <div className="flex justify-center mb-4">
                                    <img src={loginConfig.logo || "/placeholder.svg"} alt="Logo" className="h-8 w-auto" />
                                  </div>
                                )}
                                <h3 className="text-lg font-bold text-center mb-1">Choose login method</h3>
                                <p className="text-xs text-muted-foreground text-center mb-4">Secure access to your platform</p>
                                <div className="space-y-2">
                                  {selectedLayout?.menuItems
                                    .filter(m => m.enabled)
                                    .sort((a, b) => a.order - b.order)
                                    .map((method) => (
                                      <button
                                        key={method.id}
                                        className="w-full flex items-center gap-2 px-3 py-2 border rounded-md text-xs hover:bg-muted/50 transition-colors"
                                      >
                                        <LogIn className="h-3 w-3" />
                                        {method.name}
                                      </button>
                                    ))}
                                </div>
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            {/* Left Navigation Preview */}
                            <div className="w-48 bg-muted/30 border-r p-3">
                              <p className="text-xs font-medium text-muted-foreground mb-3 px-2">NAVIGATION</p>
                              <div className="space-y-1">
                                {selectedLayout?.menuItems
                                  .filter(m => m.enabled)
                                  .sort((a, b) => a.order - b.order)
                                  .map((item, index) => (
                                    <div
                                      key={item.id}
                                      className={`px-3 py-2 rounded-md text-sm ${
                                        index === 0 ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                                      }`}
                                    >
                                      {item.name}
                                    </div>
                                  ))}
                              </div>
                            </div>
                            
                            {/* Content Preview */}
                            <div className="flex-1 p-4">
                              {selectedLayout?.type === "invoice" ? (
                                <div className="space-y-4">
                                  {/* Metrics Preview */}
                                  {selectedLayout.contentConfigs[selectedLayout.menuItems[0]?.id]?.showMetrics && (
                                    <div className="grid grid-cols-4 gap-3">
                                      {["Total", "Pending", "Approved", "Paid"].map(label => (
                                        <div key={label} className="p-3 bg-muted/30 rounded-lg text-center">
                                          <p className="text-lg font-semibold">--</p>
                                          <p className="text-xs text-muted-foreground">{label}</p>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                  {/* Table Preview */}
                                  <div className="border rounded-lg">
                                    <div className="flex items-center gap-4 p-3 bg-muted/30 border-b">
                                      {(selectedLayout.contentConfigs[selectedLayout.menuItems[0]?.id]?.columns || [])
                                        .filter(c => c.visible)
                                        .sort((a, b) => a.order - b.order)
                                        .map(col => (
                                          <div key={col.id} className="text-xs font-medium text-muted-foreground">
                                            {col.name}
                                          </div>
                                        ))}
                                    </div>
                                    <div className="p-8 text-center text-muted-foreground text-sm">
                                      Table data will appear here
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex gap-4 h-full">
                                  {/* Stepper Preview */}
                                  <div className="w-48 border-r pr-4">
                                    <p className="text-xs font-medium text-muted-foreground mb-3">STEPS</p>
                                    <div className="space-y-3">
                                      {selectedLayout?.steps
                                        ?.filter(s => s.enabled)
                                        .sort((a, b) => a.order - b.order)
                                        .map((step, index) => (
                                          <div key={step.id} className="flex items-center gap-2">
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                                              index === 0 ? "bg-primary text-primary-foreground" : "bg-muted"
                                            }`}>
                                              {index + 1}
                                            </div>
                                            <span className="text-sm">{step.name}</span>
                                          </div>
                                        ))}
                                    </div>
                                  </div>
                                  {/* Form Preview */}
                                  <div className="flex-1">
                                    <p className="text-xs font-medium text-muted-foreground mb-3">FORM SECTIONS</p>
                                    <div className="space-y-3">
                                      {(selectedLayout?.formSections?.[selectedLayout.steps?.[0]?.id || ""] || [])
                                        .sort((a, b) => a.order - b.order)
                                        .map(section => (
                                          <div key={section.id} className="p-4 border rounded-lg bg-muted/20">
                                            <p className="text-sm font-medium">{section.name}</p>
                                            <p className="text-xs text-muted-foreground mt-1">Form fields will appear here</p>
                                          </div>
                                        ))}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      {/* Add Menu Item Dialog */}
      <Dialog open={isAddMenuItemDialogOpen} onOpenChange={setIsAddMenuItemDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Menu Item</DialogTitle>
            <DialogDescription>
              Add a new navigation menu item
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="menu-name">Menu Name</Label>
            <Input
              id="menu-name"
              value={newMenuItemName}
              onChange={(e) => setNewMenuItemName(e.target.value)}
              placeholder="Enter menu name"
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddMenuItemDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddMenuItem} disabled={!newMenuItemName.trim()}>
              Add Menu Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Step Dialog */}
      <Dialog open={isAddStepDialogOpen} onOpenChange={setIsAddStepDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Step</DialogTitle>
            <DialogDescription>
              Add a new step to the RFQ workflow
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="step-name">Step Name</Label>
            <Input
              id="step-name"
              value={newStepName}
              onChange={(e) => setNewStepName(e.target.value)}
              placeholder="Enter step name"
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddStepDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddStep} disabled={!newStepName.trim()}>
              Add Step
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Rename Dialog */}
      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename {renameTarget?.type === "menu" ? "Menu Item" : "Step"}</DialogTitle>
            <DialogDescription>
              Enter a new name for this {renameTarget?.type === "menu" ? "menu item" : "step"}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="rename">New Name</Label>
            <Input
              id="rename"
              value={renameName}
              onChange={(e) => setRenameName(e.target.value)}
              placeholder="Enter new name"
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRenameDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRename} disabled={!renameName.trim()}>
              Rename
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
