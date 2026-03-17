"use client"

import React, { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  ChevronLeft,
  ChevronRight,
  Check,
  AlertTriangle,
  Info,
  Inbox as InboxIcon,
  FileText,
  ShoppingCart,
  Search as SearchIcon,
  Settings,
  HelpCircle,
  Eye,
  EyeOff,
} from "lucide-react"
import InboxContent from "@/app/sop/inbox/inbox-content"
import dynamic from "next/dynamic"

const InvoiceDetailPage = dynamic(() => import("@/app/sop/inbox/invoice/[id]/page"), { ssr: false })
const RFQDetailPage = dynamic(() => import("@/app/sop/inbox/rfq/[id]/page"), { ssr: false })

// Process and Stage definitions
const processes = [
  { id: "invoice-processing", label: "Invoice Processing" },
  { id: "rfq-processing", label: "RFQ Processing" },
  { id: "vendor-onboarding", label: "Vendor Onboarding" },
  { id: "purchase-order", label: "Purchase Order" },
]

const stages = [
  { id: "approval", label: "Approval", processId: "invoice-processing" },
  { id: "review", label: "Review", processId: "invoice-processing" },
  { id: "payment", label: "Payment", processId: "invoice-processing" },
  { id: "submission", label: "Submission", processId: "rfq-processing" },
  { id: "evaluation", label: "Evaluation", processId: "rfq-processing" },
  { id: "registration", label: "Registration", processId: "vendor-onboarding" },
  { id: "verification", label: "Verification", processId: "vendor-onboarding" },
  { id: "creation", label: "Creation", processId: "purchase-order" },
  { id: "fulfillment", label: "Fulfillment", processId: "purchase-order" },
]

// Layout definitions
const layouts = [
  { id: "dashboard", label: "Dashboard", component: "InboxContent" },
  { id: "inbox", label: "Inbox", component: "InboxContent" },
  { id: "task-view", label: "Task view", component: "InvoiceDetailPage" },
  { id: "rfq-view", label: "RFQ view", component: "RFQDetailPage" },
  { id: "auction-management", label: "Auction management", component: "InboxContent" },
  { id: "advanced-search", label: "Advanced search", component: "InboxContent" },
  { id: "settings", label: "Settings", component: "InboxContent" },
  { id: "query", label: "Query", component: "InboxContent" },
]

// Layout sections
const layoutSections = [
  {
    title: "NAVIGATION",
    items: [
      { id: "left-navigation", label: "Left Navigation" },
      { id: "top-navigation", label: "Top navigation" },
    ],
  },
]

// Actions configuration - All buttons from the center pane
const actionsConfig = {
  create: [
    {
      id: "invoice",
      label: "Invoice",
      checked: true,
      children: [
        { id: "standard-invoice", label: "Standard Invoice", checked: true },
        { id: "invoice-from-po", label: "Invoice from PO", checked: true },
        { id: "credit-note", label: "Credit Note", checked: true },
        { id: "debit-note", label: "Debit Note", checked: true },
      ],
    },
    {
      id: "rfq",
      label: "RFQ",
      checked: true,
      children: [
        { id: "rfq-for-goods", label: "RFQ for Goods", checked: true },
        { id: "rfq-for-services", label: "RFQ for Services", checked: true },
        { id: "rfq-for-saas", label: "RFQ for SaaS", checked: true },
      ],
    },
    {
      id: "purchase-order",
      label: "Purchase Order",
      checked: true,
      children: [
        { id: "po-from-rfq", label: "PO from Approved RFQ", checked: true },
        { id: "direct-po", label: "Direct Purchase Order", checked: true },
        { id: "recurring-po", label: "Recurring / Blanket PO", checked: true },
      ],
    },
    {
      id: "pre-screening",
      label: "Pre-Screening",
      checked: true,
      children: [
        { id: "vendor-due-diligence", label: "Vendor Due Diligence", checked: true },
        { id: "risk-assessment", label: "Risk Assessment", checked: true },
        { id: "capability-evaluation", label: "Capability Evaluation", checked: true },
      ],
    },
    {
      id: "onboarding",
      label: "Onboarding",
      checked: true,
      children: [
        { id: "vendor-onboarding", label: "Vendor Onboarding", checked: true },
        { id: "customer-onboarding", label: "Customer Onboarding", checked: true },
      ],
    },
    {
      id: "esg",
      label: "ESG",
      checked: true,
      children: [
        { id: "environmental", label: "Environmental", checked: true },
        { id: "social-compliance", label: "Social Compliance", checked: true },
        { id: "governance-review", label: "Governance Review", checked: true },
      ],
    },
  ],
  table: [
    { id: "approve", label: "Approve", checked: true },
    { id: "view", label: "View", checked: true },
    { id: "assign", label: "Assign", checked: true },
    { id: "reassign", label: "Reassign", checked: true },
  ],
}

// Components configuration - INBOX layout
const componentsConfig = [
  { id: "action-feed", label: "Action Feed", checked: true },
  { id: "operational-brief", label: "Operational Brief", checked: true },
  { id: "pending-cards", label: "Pending by Process cards", checked: true },
  { id: "my-tasks-tab", label: "My Tasks Tab", checked: true },
  { id: "urgent-tasks-tab", label: "Urgent Tasks Tab", checked: true },
  { id: "team-tasks-tab", label: "Team Tasks Tab", checked: true },
  { id: "filters", label: "Filters", checked: true },
  { id: "table-columns", label: "Table columns", checked: true },
  { id: "sla-indicators", label: "SLA indicators", checked: true },
  { id: "bulk-actions", label: "Bulk actions", checked: true },
  { id: "create-button", label: "Create button visibility", checked: true },
]

// Layout-specific configurations
const layoutConfigs = {
  "task-view": {
    permissions: [
      { id: "read", label: "Read", checked: true },
      { id: "update", label: "Update", checked: true },
      { id: "approve", label: "Approve", checked: true },
      { id: "reject", label: "Reject", checked: true },
      { id: "assign", label: "Assign", checked: true },
      { id: "download", label: "Download", checked: true },
      { id: "print", label: "Print", checked: true },
      { id: "link-documents", label: "Link Documents", checked: true },
    ],
    components: [
      { id: "document-viewer", label: "Document Viewer (Left Pane)", checked: true },
      { id: "invoice-pdf", label: "Invoice PDF Display", checked: true },
      { id: "line-items", label: "Line Items Table", checked: true },
      { id: "tax-payment-summary", label: "Tax & Payment Summary", checked: true },
      { id: "ocr-highlights", label: "OCR Highlights", checked: true },
      { id: "zoom-controls", label: "Zoom Controls", checked: true },
      { id: "navigation-arrows", label: "Previous/Next Navigation", checked: true },
      { id: "details-pane", label: "Details Pane (Right Side)", checked: true },
      { id: "invoice-details-tab", label: "Invoice Details Tab", checked: true },
      { id: "vendor-evaluation-tab", label: "Vendor Evaluation Tab", checked: true },
      { id: "checklist-tab", label: "Checklist Tab", checked: true },
      { id: "compliance-tab", label: "Compliance Tab", checked: true },
      { id: "po-details-tab", label: "PO Details Tab", checked: true },
      { id: "grn-details-tab", label: "GRN Details Tab", checked: true },
      { id: "action-history-tab", label: "Action History Tab", checked: true },
      { id: "submitter-details", label: "Submitter Details Section", checked: true },
      { id: "basic-info", label: "Basic Invoice Info Section", checked: true },
      { id: "vendor-details", label: "Vendor Details Section", checked: true },
      { id: "tax-details", label: "Tax Details Section", checked: true },
      { id: "payment-details", label: "Payment Details Section", checked: true },
      { id: "metrics-panel", label: "Metrics Panel (Bottom)", checked: true },
      { id: "status-badges", label: "Status Badges", checked: true },
      { id: "sla-timer", label: "SLA Timer", checked: true },
      { id: "split-view-resize", label: "Split View Resizing", checked: true },
      { id: "layout-config-button", label: "Layout Configuration Button", checked: true },
    ],
    actions: [
      { id: "approve", label: "Approve", checked: true },
      { id: "reject", label: "Reject", checked: true },
      { id: "send-back", label: "Send Back", checked: true },
      { id: "hold", label: "Put on Hold", checked: true },
      { id: "escalate", label: "Escalate", checked: true },
      { id: "add-note", label: "Add Note", checked: true },
      { id: "assign-user", label: "Assign to User", checked: true },
      { id: "download-pdf", label: "Download PDF", checked: true },
      { id: "print-invoice", label: "Print Invoice", checked: true },
      { id: "reset-zoom", label: "Reset Zoom", checked: true },
      { id: "link-ocr", label: "Link OCR Field", checked: true },
      { id: "edit-fields", label: "Edit Invoice Fields", checked: true },
      { id: "view-audit-trail", label: "View Audit Trail", checked: true },
      { id: "swap-panes", label: "Swap Panes", checked: true },
      { id: "save-layout", label: "Save Layout Preset", checked: true },
    ],
  },
}

export default function CreateNewRolePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  
  // Get role info from URL params or use defaults
  const roleType = searchParams.get("type")
  const [roleName, setRoleName] = useState(searchParams.get("name") || "New Role")
  const [roleDescription, setRoleDescription] = useState(searchParams.get("description") || "")
  const [selectedProcess, setSelectedProcess] = useState("")
  const [selectedStage, setSelectedStage] = useState("")
  const [isProcessStageModalOpen, setIsProcessStageModalOpen] = useState(roleType === "process-stage")
  
  const [selectedLayout, setSelectedLayout] = useState("inbox")
  const [activeTab, setActiveTab] = useState("permissions")
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isRightPanelCollapsed, setIsRightPanelCollapsed] = useState(false)
  
  // Search filters
  const [actionsSearch, setActionsSearch] = useState("")
  const [componentsSearch, setComponentsSearch] = useState("")
  
  // Preview mode state
  const [previewMode, setPreviewMode] = useState<"normal" | "highlight">("normal")

  // Track accessible layouts
  const [accessibleLayouts, setAccessibleLayouts] = useState(["inbox"])

  // State for permissions (default for inbox)
  const [permissions, setPermissions] = useState([
    { id: "read", label: "Read", checked: true },
    { id: "create", label: "Create", checked: true },
    { id: "update", label: "Update", checked: true },
    { id: "delete", label: "Delete", checked: false },
    { id: "approve", label: "Approve", checked: true },
    { id: "reject", label: "Reject", checked: true },
    { id: "export", label: "Export", checked: true },
    { id: "bulk-operations", label: "Bulk Operations", checked: false },
  ])

  // State for actions (default for inbox)
  const [createActions, setCreateActions] = useState(actionsConfig.create)
  const [tableActions, setTableActions] = useState(actionsConfig.table)
  const [taskViewActions, setTaskViewActions] = useState(layoutConfigs["task-view"]?.actions || [])

  // State for components (default for inbox)
  const [components, setComponents] = useState(componentsConfig)

  // Update configs when layout changes
  useEffect(() => {
    if (selectedLayout === "task-view" && layoutConfigs["task-view"]) {
      setPermissions(layoutConfigs["task-view"].permissions)
      setComponents(layoutConfigs["task-view"].components)
      setTaskViewActions(layoutConfigs["task-view"].actions)
    } else {
      // Reset to default inbox config
      setPermissions([
        { id: "read", label: "Read", checked: true },
        { id: "create", label: "Create", checked: true },
        { id: "update", label: "Update", checked: true },
        { id: "delete", label: "Delete", checked: false },
        { id: "approve", label: "Approve", checked: true },
        { id: "reject", label: "Reject", checked: true },
        { id: "export", label: "Export", checked: true },
        { id: "bulk-operations", label: "Bulk Operations", checked: false },
      ])
      setComponents(componentsConfig)
    }
  }, [selectedLayout])

  // Handle parent checkbox toggle
  const toggleParentAction = (parentId: string) => {
    setCreateActions((prev) =>
      prev.map((parent) => {
        if (parent.id === parentId) {
          const newChecked = !parent.checked
          return {
            ...parent,
            checked: newChecked,
            children: parent.children?.map((child) => ({ ...child, checked: newChecked })),
          }
        }
        return parent
      })
    )
  }

  // Handle child checkbox toggle
  const toggleChildAction = (parentId: string, childId: string) => {
    setCreateActions((prev) =>
      prev.map((parent) => {
        if (parent.id === parentId && parent.children) {
          const newChildren = parent.children.map((child) =>
            child.id === childId ? { ...child, checked: !child.checked } : child
          )
          const allChildrenChecked = newChildren.every((c) => c.checked)
          return {
            ...parent,
            checked: allChildrenChecked,
            children: newChildren,
          }
        }
        return parent
      })
    )
  }

  // Handle table action toggle
  const toggleTableAction = (actionId: string) => {
    setTableActions((prev) => prev.map((action) => (action.id === actionId ? { ...action, checked: !action.checked } : action)))
  }

  // Handle component toggle
  const toggleComponent = (componentId: string) => {
    setComponents((prev) => prev.map((comp) => (comp.id === componentId ? { ...comp, checked: !comp.checked } : comp)))
  }

  // Select All / Deselect All handlers
  const handleSelectAllPermissions = () => {
    setPermissions((prev) => prev.map((p) => ({ ...p, checked: true })))
  }

  const handleDeselectAllPermissions = () => {
    setPermissions((prev) => prev.map((p) => ({ ...p, checked: false })))
  }

  const handleSelectAllActions = () => {
    setCreateActions((prev) =>
      prev.map((parent) => ({
        ...parent,
        checked: true,
        children: parent.children?.map((child) => ({ ...child, checked: true })),
      }))
    )
    setTableActions((prev) => prev.map((action) => ({ ...action, checked: true })))
  }

  const handleDeselectAllActions = () => {
    setCreateActions((prev) =>
      prev.map((parent) => ({
        ...parent,
        checked: false,
        children: parent.children?.map((child) => ({ ...child, checked: false })),
      }))
    )
    setTableActions((prev) => prev.map((action) => ({ ...action, checked: false })))
  }

  const handleSelectAllComponents = () => {
    setComponents((prev) => prev.map((comp) => ({ ...comp, checked: true })))
  }

  const handleDeselectAllComponents = () => {
    setComponents((prev) => prev.map((comp) => ({ ...comp, checked: false })))
  }

  // Handle layout access toggle
  const toggleLayoutAccess = (layoutId: string) => {
    setAccessibleLayouts((prev) => {
      if (prev.includes(layoutId)) {
        // Don't allow removing the last layout
        if (prev.length === 1) {
          toast({
            title: "Validation Error",
            description: "At least one layout must be accessible",
            variant: "destructive",
          })
          return prev
        }
        return prev.filter((id) => id !== layoutId)
      }
      return [...prev, layoutId]
    })
  }

  // Save role with validation
  const handleSaveRole = () => {
    if (roleType === "process-stage") {
      if (!selectedProcess || !selectedStage) {
        toast({
          title: "Validation Error",
          description: "Please select both Process and Stage",
          variant: "destructive",
        })
        return
      }
      toast({
        title: "Role Saved Successfully",
        description: `"${roleName}" has been saved with ${selectedProcess} - ${selectedStage}`,
      })
      router.push("/sop/settings/role-management")
      return
    }

    if (accessibleLayouts.length === 0) {
      toast({
        title: "Validation Error",
        description: "At least one layout must be accessible",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Role Saved Successfully",
      description: `"${roleName}" has been saved with ${accessibleLayouts.length} accessible layouts`,
    })
    router.push("/sop/settings/role-management")
  }

  // Filter actions based on search
  const filteredCreateActions = useMemo(() => {
    if (!actionsSearch) return createActions
    const search = actionsSearch.toLowerCase()
    return createActions
      .map((parent) => ({
        ...parent,
        children: parent.children?.filter((child) => child.label.toLowerCase().includes(search)),
      }))
      .filter(
        (parent) =>
          parent.label.toLowerCase().includes(search) || (parent.children && parent.children.length > 0)
      )
  }, [createActions, actionsSearch])

  // Filter components based on search
  const filteredComponents = useMemo(() => {
    if (!componentsSearch) return components
    const search = componentsSearch.toLowerCase()
    return components.filter((comp) => comp.label.toLowerCase().includes(search))
  }, [components, componentsSearch])

  // Check for invalid combinations
  const hasApproveWithoutView = tableActions.find((a) => a.id === "approve")?.checked && !tableActions.find((a) => a.id === "view")?.checked

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <div className="border-b bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/sop/settings" className="hover:text-foreground transition-colors">
                Settings
              </Link>
              <ChevronRight className="h-4 w-4" />
              <Link href="/sop/settings/role-management" className="hover:text-foreground transition-colors">
                Role Management
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground">Create New Role</span>
            </div>
            <h1 className="text-2xl font-semibold">{roleName}</h1>
            <p className="text-sm text-muted-foreground">
              {roleDescription || "Configure role access, layouts, and permissions"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {roleType === "process-stage" ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsProcessStageModalOpen(true)}
                className="gap-2"
              >
                <Settings className="h-4 w-4" />
                Configure Process + Stage
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPreviewMode(previewMode === "normal" ? "highlight" : "normal")}
                className="gap-2 bg-transparent"
              >
                {previewMode === "normal" ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                {previewMode === "normal" ? "Highlight Mode" : "Normal View"}
              </Button>
            )}
            <Button variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button onClick={handleSaveRole}>Save Role</Button>
          </div>
        </div>
      </div>

      {/* Process + Stage Configuration Modal */}
      <Dialog open={isProcessStageModalOpen} onOpenChange={setIsProcessStageModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Configure Process + Stage</DialogTitle>
            <DialogDescription>
              Select the process and stage for this role
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Process Selection */}
            <div className="space-y-2">
              <Label htmlFor="process" className="text-base font-medium">
                Process *
              </Label>
              <Select value={selectedProcess} onValueChange={(value) => {
                setSelectedProcess(value)
                setSelectedStage("") // Reset stage when process changes
              }}>
                <SelectTrigger id="process" className="h-10">
                  <SelectValue placeholder="Select a process" />
                </SelectTrigger>
                <SelectContent>
                  {processes.map((process) => (
                    <SelectItem key={process.id} value={process.id}>
                      {process.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Stage Selection */}
            <div className="space-y-2">
              <Label htmlFor="stage" className="text-base font-medium">
                Stage *
              </Label>
              <Select 
                value={selectedStage} 
                onValueChange={setSelectedStage}
                disabled={!selectedProcess}
              >
                <SelectTrigger id="stage" className="h-10">
                  <SelectValue placeholder={selectedProcess ? "Select a stage" : "Select a process first"} />
                </SelectTrigger>
                <SelectContent>
                  {stages
                    .filter((stage) => stage.processId === selectedProcess)
                    .map((stage) => (
                      <SelectItem key={stage.id} value={stage.id}>
                        {stage.label}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {!selectedProcess && (
                <p className="text-sm text-muted-foreground">
                  Please select a process first to view available stages
                </p>
              )}
            </div>

            {/* Info Alert */}
            {selectedProcess && selectedStage && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  This role will have access to <strong>{processes.find(p => p.id === selectedProcess)?.label}</strong> process 
                  at the <strong>{stages.find(s => s.id === selectedStage)?.label}</strong> stage.
                </AlertDescription>
              </Alert>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsProcessStageModalOpen(false)
                  if (roleType === "process-stage") {
                    router.push("/sop/settings/role-management")
                  }
                }}
              >
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  if (!selectedProcess || !selectedStage) {
                    toast({
                      title: "Validation Error",
                      description: "Please select both Process and Stage",
                      variant: "destructive",
                    })
                    return
                  }
                  setIsProcessStageModalOpen(false)
                  toast({
                    title: "Configuration Saved",
                    description: `Process and Stage configured for "${roleName}"`,
                  })
                }}
                disabled={!selectedProcess || !selectedStage}
              >
                Save Configuration
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Three-column layout */}
      <div className="flex flex-1 overflow-hidden">
          {/* LEFT PANEL - Layout Selector */}
          <div
            className={`flex flex-col border-r bg-card transition-all duration-300 ${
              isSidebarCollapsed ? "w-16" : "w-72"
            }`}
          >
            <div className="border-b px-4 py-3">
              <div className="flex items-center justify-between">
                {!isSidebarCollapsed && (
                  <div className="flex-1">
                    <h2 className="font-semibold">Select Layout</h2>
                    <p className="text-xs text-muted-foreground mt-1">
                      Choose a layout to preview and configure
                    </p>
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  className="h-8 w-8 p-0 flex-shrink-0"
                >
                  {isSidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            <ScrollArea className="flex-1">
              <div className="p-2 space-y-1">
                {layouts.map((layout) => {
                  const isSelected = selectedLayout === layout.id
                  return (
                    <button
                      key={layout.id}
                      onClick={() => setSelectedLayout(layout.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 text-left rounded-md transition-colors ${
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted text-foreground"
                      }`}
                      title={isSidebarCollapsed ? layout.label : undefined}
                    >
                      {!isSidebarCollapsed && (
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">
                            {layout.label}
                          </div>
                        </div>
                      )}
                      {isSelected && <Check className="h-4 w-4 flex-shrink-0" />}
                    </button>
                  )
                })}
              </div>

              {!isSidebarCollapsed && (
                <>
                  <Separator className="my-4" />
                  <div className="px-2 pb-4">
                    {layoutSections.map((section) => (
                      <div key={section.title} className="mb-4">
                        <h3 className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          {section.title}
                        </h3>
                        <div className="space-y-1">
                          {section.items.map((item) => (
                            <button
                              key={item.id}
                              className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-muted text-foreground transition-colors"
                            >
                              <span className="flex-1 text-left">{item.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </ScrollArea>
          </div>

          {/* CENTER PANEL - Embedded Layout Preview */}
          <div className="flex-1 flex flex-col overflow-hidden bg-muted/30">
            <div className="flex h-12 items-center justify-between border-b bg-card px-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-normal">
                  Preview Mode
                </Badge>
                <Separator orientation="vertical" className="h-4" />
                <span className="text-sm text-muted-foreground">Read-only view</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {layouts.find((l) => l.id === selectedLayout)?.label}
              </Badge>
            </div>

            <div className="flex-1 overflow-auto">
              <div
                className={`pointer-events-none select-none ${
                  previewMode === "highlight" && !accessibleLayouts.includes(selectedLayout)
                    ? "opacity-30 relative"
                    : "opacity-90"
                }`}
              >
                {previewMode === "highlight" && !accessibleLayouts.includes(selectedLayout) && (
                  <div className="absolute inset-0 flex items-center justify-center z-10 bg-background/50">
                    <div className="bg-destructive text-destructive-foreground px-4 py-2 rounded-md font-semibold">
                      Layout Not Accessible
                    </div>
                  </div>
                )}
                {/* Dynamically render the selected layout */}
                {selectedLayout === "task-view" ? (
                  <InvoiceDetailPage />
                ) : selectedLayout === "rfq-view" ? (
                  <RFQDetailPage />
                ) : (
                  <InboxContent />
                )}
              </div>
            </div>
          </div>

          {/* RIGHT PANEL - Access Configuration */}
          <div
            className={`flex flex-col border-l bg-card transition-all duration-300 ${
              isRightPanelCollapsed ? "w-16" : "w-96"
            }`}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <div className="flex items-center gap-2 p-3 shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsRightPanelCollapsed(!isRightPanelCollapsed)}
                  className="h-8 w-8 p-0"
                >
                  {isRightPanelCollapsed ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
                {!isRightPanelCollapsed && (
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="permissions">
                      Permissions
                    </TabsTrigger>
                    <TabsTrigger value="components">
                      Components
                    </TabsTrigger>
                    <TabsTrigger value="actions">
                      Actions
                    </TabsTrigger>
                  </TabsList>
                )}
              </div>

              {!isRightPanelCollapsed && (
                <div className="flex-1 overflow-hidden">
                  <TabsContent value="permissions" className="m-0 flex-1 overflow-hidden">
                    <ScrollArea className="h-full">
                      <div className="p-4 space-y-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                              BASE PERMISSIONS
                            </h3>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm" onClick={handleSelectAllPermissions} className="h-7 text-xs">
                                Select All
                              </Button>
                              <Button variant="ghost" size="sm" onClick={handleDeselectAllPermissions} className="h-7 text-xs">
                                Deselect All
                              </Button>
                            </div>
                          </div>
                          <div className="space-y-2">
                            {permissions.map((permission) => (
                              <div key={permission.id} className="flex items-center gap-2 pl-1">
                                <Checkbox
                                  id={`perm-${permission.id}`}
                                  checked={permission.checked}
                                  onCheckedChange={() =>
                                    setPermissions((prev) =>
                                      prev.map((p) => (p.id === permission.id ? { ...p, checked: !p.checked } : p))
                                    )
                                  }
                                />
                                <Label htmlFor={`perm-${permission.id}`} className="text-sm cursor-pointer">
                                  {permission.label}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                        <Alert>
                          <Info className="h-4 w-4" />
                          <AlertDescription className="text-xs">
                            Permissions control backend access and data operations. These are enforced at the API level.
                          </AlertDescription>
                        </Alert>
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="components" className="m-0 flex-1 overflow-hidden">
                    <ScrollArea className="h-full">
                      <div className="p-4 space-y-6">
                        {/* Search and Controls */}
                        <div className="space-y-2">
                          <div className="relative">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Search components..."
                              value={componentsSearch}
                              onChange={(e) => setComponentsSearch(e.target.value)}
                              className="pl-9"
                            />
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" onClick={handleSelectAllComponents} className="h-7 text-xs flex-1">
                              Select All
                            </Button>
                            <Button variant="ghost" size="sm" onClick={handleDeselectAllComponents} className="h-7 text-xs flex-1">
                              Deselect All
                            </Button>
                          </div>
                        </div>

                        {/* UI Components Section */}
                        <div className="space-y-3">
                          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                            UI COMPONENTS
                          </h3>
                          <div className="space-y-2">
                            {filteredComponents.map((component) => (
                              <div key={component.id} className="flex items-center gap-2 pl-1">
                                <Checkbox
                                  id={component.id}
                                  checked={component.checked}
                                  onCheckedChange={() => toggleComponent(component.id)}
                                />
                                <Label htmlFor={component.id} className="text-sm cursor-pointer">
                                  {component.label}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="actions" className="m-0 flex-1 overflow-hidden">
                    <ScrollArea className="h-full">
                      <div className="p-4 space-y-6">
                        {/* Search and Controls */}
                        <div className="space-y-2">
                          <div className="relative">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Search actions..."
                              value={actionsSearch}
                              onChange={(e) => setActionsSearch(e.target.value)}
                              className="pl-9"
                            />
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" onClick={handleSelectAllActions} className="h-7 text-xs flex-1">
                              Select All
                            </Button>
                            <Button variant="ghost" size="sm" onClick={handleDeselectAllActions} className="h-7 text-xs flex-1">
                              Deselect All
                            </Button>
                          </div>
                        </div>

                        {/* Actions Section - Different based on layout */}
                        {selectedLayout === "task-view" ? (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                TASK VIEW ACTIONS
                              </h3>
                              <Badge variant="outline" className="text-xs">
                                Invoice Detail Page
                              </Badge>
                            </div>
                            <div className="space-y-2">
                              {taskViewActions.map((action) => (
                                <div key={action.id} className="flex items-center gap-2 pl-1">
                                  <Checkbox
                                    id={`taskaction-${action.id}`}
                                    checked={action.checked}
                                    onCheckedChange={() =>
                                      setTaskViewActions((prev) =>
                                        prev.map((a) => (a.id === action.id ? { ...a, checked: !a.checked } : a))
                                      )
                                    }
                                  />
                                  <Label htmlFor={`taskaction-${action.id}`} className="text-sm cursor-pointer">
                                    {action.label}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <>
                            {/* CREATE Section for Inbox */}
                            <div className="space-y-3">
                              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                CREATE ACTIONS
                              </h3>
                              <div className="space-y-4">
                                {filteredCreateActions.map((parent) => (
                                  <div key={parent.id} className="space-y-1">
                                    <div className="flex items-center gap-2 pl-1">
                                      <Checkbox
                                        id={`action-${parent.id}`}
                                        checked={parent.checked}
                                        onCheckedChange={() => toggleParentAction(parent.id)}
                                      />
                                      <Label htmlFor={`action-${parent.id}`} className="text-sm cursor-pointer font-medium">
                                        {parent.label}
                                      </Label>
                                    </div>
                                    {parent.children?.map((child) => (
                                      <div key={child.id} className="flex items-center gap-2 pl-7">
                                        <Checkbox
                                          id={`action-${child.id}`}
                                          checked={child.checked}
                                          onCheckedChange={() => toggleChildAction(parent.id, child.id)}
                                        />
                                        <Label htmlFor={`action-${child.id}`} className="text-sm cursor-pointer">
                                          {child.label}
                                        </Label>
                                      </div>
                                    ))}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* TABLE Section for Inbox */}
                            <div className="space-y-3">
                              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                TABLE ACTIONS
                              </h3>
                              <div className="space-y-2">
                                {tableActions.map((action) => (
                                  <div key={action.id} className="flex items-center gap-2 pl-1">
                                    <Checkbox
                                      id={`tableaction-${action.id}`}
                                      checked={action.checked}
                                      onCheckedChange={() => toggleTableAction(action.id)}
                                    />
                                    <Label htmlFor={`tableaction-${action.id}`} className="text-sm cursor-pointer">
                                      {action.label}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                </div>
              )}
            </Tabs>
          </div>
        </div>
    </div>
  )
}
