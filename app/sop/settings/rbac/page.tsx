"use client"

import { useState } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
  Shield,
  Lock,
  Eye,
  ChevronRight,
  FileText,
  ClipboardCheck,
  Inbox,
  Building2,
  Users,
  Layers,
  Zap,
  CheckCircle,
  XCircle,
} from "lucide-react"

// Shared role categories - same as role-management
const roleCategories = [
  {
    id: "finance",
    name: "Finance",
    roles: [
      {
        id: "cfo",
        name: "CFO",
        description: "Chief Financial Officer with full finance access",
        isSystem: true,
        permissions: ["invoice.view", "invoice.create", "invoice.edit", "invoice.approve", "invoice.reject", "invoice.pay", "compliance.view", "compliance.audit"],
        layouts: ["invoice-layout"],
        actions: ["Create Invoice", "Edit", "Approve", "Reject", "Process Payment", "Schedule Payment"],
      },
      {
        id: "finance-controller",
        name: "Finance Controller",
        description: "Manages financial operations and approvals",
        isSystem: true,
        permissions: ["invoice.view", "invoice.edit", "invoice.approve", "invoice.reject"],
        layouts: ["invoice-layout"],
        actions: ["Edit", "Approve", "Reject"],
      },
      {
        id: "ap-user",
        name: "AP User",
        description: "Accounts Payable user for invoice processing",
        isSystem: false,
        permissions: ["invoice.view", "invoice.create", "invoice.edit"],
        layouts: ["invoice-layout"],
        actions: ["Create Invoice", "Edit"],
      },
    ],
  },
  {
    id: "procurement",
    name: "Procurement",
    roles: [
      {
        id: "procurement-manager",
        name: "Procurement Manager",
        description: "Manages procurement operations and RFQs",
        isSystem: true,
        permissions: ["rfq.view", "rfq.create", "rfq.edit", "rfq.approve", "rfq.assign", "vendor.view", "vendor.create"],
        layouts: ["rfq-layout"],
        actions: ["Create RFQ", "Edit", "Approve", "Assign Vendor", "Send Notification"],
      },
    ],
  },
  {
    id: "governance",
    name: "Governance",
    roles: [
      {
        id: "compliance-officer",
        name: "Compliance Officer",
        description: "Oversees compliance and policy adherence",
        isSystem: true,
        permissions: ["compliance.view", "compliance.audit", "compliance.manage", "invoice.view", "rfq.view"],
        layouts: ["invoice-layout", "rfq-layout"],
        actions: [],
      },
      {
        id: "auditor",
        name: "Auditor",
        description: "Read-only access for audit purposes",
        isSystem: true,
        permissions: ["compliance.view", "compliance.audit", "invoice.view", "rfq.view", "inbox.view"],
        layouts: ["invoice-layout", "rfq-layout", "inbox-layout"],
        actions: [],
      },
    ],
  },
  {
    id: "system",
    name: "System",
    roles: [
      {
        id: "tenant-admin",
        name: "Tenant Admin",
        description: "Full system administration access",
        isSystem: true,
        permissions: [
          "invoice.view", "invoice.create", "invoice.edit", "invoice.approve", "invoice.reject", "invoice.pay",
          "rfq.view", "rfq.create", "rfq.edit", "rfq.approve", "rfq.assign",
          "inbox.view", "inbox.process", "inbox.assign",
          "vendor.view", "vendor.create", "vendor.edit", "vendor.approve",
          "compliance.view", "compliance.audit", "compliance.manage",
        ],
        layouts: ["invoice-layout", "rfq-layout", "inbox-layout"],
        actions: ["Create Invoice", "Edit", "Approve", "Reject", "Process Payment", "Schedule Payment", "Create RFQ", "Assign Vendor", "Send Notification", "Categorize", "Forward", "Assign"],
      },
    ],
  },
]

// Layout configurations
const layoutConfigs = [
  {
    id: "rfq-layout",
    name: "RFQ",
    description: "Request for Quotation management",
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
    description: "Central document processing",
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
    description: "Invoice management and payments",
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

// Permission groups for display
const permissionGroups = [
  { id: "invoice", name: "Invoice", icon: FileText, prefix: "invoice." },
  { id: "rfq", name: "RFQ", icon: ClipboardCheck, prefix: "rfq." },
  { id: "inbox", name: "Inbox", icon: Inbox, prefix: "inbox." },
  { id: "vendor", name: "Vendor", icon: Building2, prefix: "vendor." },
  { id: "compliance", name: "Compliance", icon: Shield, prefix: "compliance." },
]

// Flatten all roles for selection
const allRoles = roleCategories.flatMap((cat) => cat.roles)

export default function RBACPage() {
  const [selectedRoleId, setSelectedRoleId] = useState(allRoles[0].id)
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("overview")

  const selectedRole = allRoles.find((r) => r.id === selectedRoleId)!

  const hasPermission = (permission: string) => {
    return selectedRole.permissions.includes(permission)
  }

  const hasLayout = (layoutId: string) => {
    return selectedRole.layouts.includes(layoutId)
  }

  const getPermissionPath = (elementId: string) => {
    for (const layout of layoutConfigs) {
      for (const component of layout.components) {
        const element = component.uiElements.find((el) => el.id === elementId)
        if (element) {
          return {
            role: selectedRole.name,
            permission: element.requiredPermission,
            layout: layout.name,
            component: component.name,
            element: element.name,
            hasAccess: hasPermission(element.requiredPermission) && hasLayout(layout.id),
          }
        }
      }
    }
    return null
  }

  const permissionPath = selectedElement ? getPermissionPath(selectedElement) : null

  // Group permissions by category
  const groupedPermissions = permissionGroups.map((group) => ({
    ...group,
    permissions: selectedRole.permissions.filter((p) => p.startsWith(group.prefix)),
  })).filter((g) => g.permissions.length > 0)

return (
  <div className="h-full bg-background flex flex-col">
  <Header title="RBAC Configuration" />
  <div className="flex-1 overflow-auto p-6">
  {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/sop/settings" className="hover:text-foreground transition-colors">
            Settings
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">RBAC Configuration</span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-foreground mb-2">Role-Based Access Control</h1>
            <p className="text-sm text-muted-foreground">
              Visual demonstration of permission-driven UI rendering across layouts, components, and actions
            </p>
          </div>
          <Link href="/sop/settings/role-management">
            <Button variant="outline" className="gap-2 bg-transparent">
              <Users className="h-4 w-4" />
              Manage Roles
            </Button>
          </Link>
        </div>

        {/* Role Selector Card */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle className="text-base">Select Role to Preview</CardTitle>
                  <CardDescription>Choose a role to see its allowed layouts, permissions, and actions</CardDescription>
                </div>
              </div>
              <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
                <SelectTrigger className="w-[280px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roleCategories.map((category) => (
                    <div key={category.id}>
                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        {category.name}
                      </div>
                      {category.roles.map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                          <div className="flex items-center gap-2">
                            {role.name}
                            {role.isSystem && (
                              <Badge variant="secondary" className="text-[10px] px-1.5">
                                System
                              </Badge>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </div>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-muted-foreground">Permissions:</span>
                <span className="font-semibold">{selectedRole.permissions.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                <span className="text-muted-foreground">Layouts:</span>
                <span className="font-semibold">{selectedRole.layouts.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-purple-500" />
                <span className="text-muted-foreground">Actions:</span>
                <span className="font-semibold">{selectedRole.actions.length}</span>
              </div>
              {selectedRole.isSystem && (
                <Badge variant="outline" className="gap-1">
                  <Lock className="h-3 w-3" />
                  System Role (Read-only)
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview" className="gap-2">
              <Eye className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="permissions" className="gap-2">
              <Shield className="h-4 w-4" />
              Permissions
            </TabsTrigger>
            <TabsTrigger value="layouts" className="gap-2">
              <Layers className="h-4 w-4" />
              Layouts
            </TabsTrigger>
            <TabsTrigger value="actions" className="gap-2">
              <Zap className="h-4 w-4" />
              Actions
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-12 gap-6">
              {/* Left Panel - Permissions Summary */}
              <div className="col-span-3">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Shield className="h-4 w-4 text-green-600" />
                      Granted Permissions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {groupedPermissions.map((group) => (
                      <div key={group.id}>
                        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-1.5">
                          <group.icon className="h-3 w-3" />
                          {group.name}
                        </div>
                        <div className="space-y-1">
                          {group.permissions.map((permission) => (
                            <div
                              key={permission}
                              className="flex items-center gap-2 px-2 py-1 rounded-md bg-green-50 border border-green-200"
                            >
                              <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                              <span className="text-xs font-mono text-green-900">{permission}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    {groupedPermissions.length === 0 && (
                      <div className="text-sm text-muted-foreground text-center py-4">No permissions assigned</div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Center Panel - Layout Preview */}
              <div className="col-span-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Layers className="h-4 w-4 text-blue-600" />
                      Layout Access Preview
                    </CardTitle>
                    <CardDescription>Click on UI elements to see permission evaluation</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {layoutConfigs.map((layout) => {
                      const layoutVisible = hasLayout(layout.id)
                      const LayoutIcon = layout.icon
                      return (
                        <div
                          key={layout.id}
                          className={`border rounded-lg p-4 ${layoutVisible ? "border-border bg-card" : "border-dashed border-muted opacity-50"}`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <LayoutIcon className="h-4 w-4 text-muted-foreground" />
                              <h3 className="text-sm font-semibold">{layout.name}</h3>
                              {layoutVisible ? (
                                <Badge variant="outline" className="text-green-600 border-green-300 bg-green-50 gap-1">
                                  <CheckCircle className="h-3 w-3" />
                                  Allowed
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-red-600 border-red-300 bg-red-50 gap-1">
                                  <XCircle className="h-3 w-3" />
                                  Denied
                                </Badge>
                              )}
                            </div>
                          </div>

                          {layoutVisible && (
                            <div className="space-y-3">
                              {layout.components.map((component) => {
                                const componentVisible = hasPermission(component.requiredPermission)
                                return (
                                  <div
                                    key={component.id}
                                    className={`border rounded p-3 ${componentVisible ? "bg-slate-50" : "bg-gray-100 opacity-50"}`}
                                  >
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="text-xs font-medium">{component.name}</span>
                                      {!componentVisible && (
                                        <TooltipProvider>
                                          <Tooltip>
                                            <TooltipTrigger>
                                              <Lock className="h-3 w-3 text-red-500" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                              <p>Missing: {component.requiredPermission}</p>
                                            </TooltipContent>
                                          </Tooltip>
                                        </TooltipProvider>
                                      )}
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                      {component.uiElements.map((element) => {
                                        const elementEnabled = hasPermission(element.requiredPermission)
                                        return (
                                          <TooltipProvider key={element.id}>
                                            <Tooltip>
                                              <TooltipTrigger asChild>
                                                <Button
                                                  variant="outline"
                                                  size="sm"
                                                  disabled={!elementEnabled}
                                                  onClick={() => setSelectedElement(element.id)}
                                                  className={`h-7 text-xs ${
                                                    elementEnabled
                                                      ? "bg-transparent hover:bg-primary/10 hover:border-primary/50"
                                                      : "opacity-50 cursor-not-allowed"
                                                  } ${selectedElement === element.id ? "ring-2 ring-primary" : ""}`}
                                                >
                                                  {element.name}
                                                </Button>
                                              </TooltipTrigger>
                                              {!elementEnabled && (
                                                <TooltipContent>
                                                  <p>Missing: {element.requiredPermission}</p>
                                                </TooltipContent>
                                              )}
                                            </Tooltip>
                                          </TooltipProvider>
                                        )
                                      })}
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </CardContent>
                </Card>
              </div>

              {/* Right Panel - Evaluation Path */}
              <div className="col-span-3">
                <Card className="sticky top-6">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Eye className="h-4 w-4 text-purple-600" />
                      Evaluation Path
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {permissionPath ? (
                      <div className="space-y-4">
                        <div
                          className={`p-3 rounded-lg ${permissionPath.hasAccess ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}
                        >
                          <div className="text-xs font-semibold mb-1 text-muted-foreground">Access Status</div>
                          <div className="flex items-center gap-2">
                            {permissionPath.hasAccess ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-600" />
                            )}
                            <span className="text-sm font-semibold">
                              {permissionPath.hasAccess ? "Granted" : "Denied"}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-3">
                          {[
                            { label: "Role", value: permissionPath.role },
                            { label: "Permission", value: permissionPath.permission },
                            { label: "Layout", value: permissionPath.layout },
                            { label: "Component", value: permissionPath.component },
                            { label: "UI Element", value: permissionPath.element },
                          ].map((item, index, array) => (
                            <div key={item.label}>
                              <div className="flex items-start gap-3">
                                <div className="flex flex-col items-center">
                                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-semibold text-primary">
                                    {index + 1}
                                  </div>
                                  {index < array.length - 1 && <div className="w-0.5 h-4 bg-primary/20 my-0.5" />}
                                </div>
                                <div className="flex-1">
                                  <div className="text-[10px] font-semibold text-muted-foreground">{item.label}</div>
                                  <div className="text-xs font-medium">{item.value}</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-sm text-muted-foreground">
                        Click on any UI element to see the permission evaluation path
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Permissions Tab */}
          <TabsContent value="permissions">
            <Card>
              <CardHeader>
                <CardTitle>Assigned Permissions</CardTitle>
                <CardDescription>
                  All permissions granted to {selectedRole.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Permission</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedRole.permissions.map((permission) => {
                      const group = permissionGroups.find((g) => permission.startsWith(g.prefix))
                      const GroupIcon = group?.icon || Shield
                      return (
                        <TableRow key={permission}>
                          <TableCell className="font-mono text-sm">{permission}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <GroupIcon className="h-4 w-4 text-muted-foreground" />
                              {group?.name || "Other"}
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {permission.split(".")[1]?.charAt(0).toUpperCase() + permission.split(".")[1]?.slice(1)} access
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                              Granted
                            </Badge>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                    {selectedRole.permissions.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          No permissions assigned to this role
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Layouts Tab */}
          <TabsContent value="layouts">
            <Card>
              <CardHeader>
                <CardTitle>Layout Access</CardTitle>
                <CardDescription>
                  Layouts accessible by {selectedRole.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Layout</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Required Permissions</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {layoutConfigs.map((layout) => {
                      const hasAccess = hasLayout(layout.id)
                      const LayoutIcon = layout.icon
                      return (
                        <TableRow key={layout.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <LayoutIcon className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{layout.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{layout.description}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {layout.requiredPermissions.map((perm) => (
                                <Badge key={perm} variant="secondary" className="text-xs font-mono">
                                  {perm}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            {hasAccess ? (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300 gap-1">
                                <CheckCircle className="h-3 w-3" />
                                Allowed
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300 gap-1">
                                <XCircle className="h-3 w-3" />
                                Denied
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Actions Tab */}
          <TabsContent value="actions">
            <Card>
              <CardHeader>
                <CardTitle>Allowed Actions</CardTitle>
                <CardDescription>
                  Actions that {selectedRole.name} can perform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Action</TableHead>
                      <TableHead>Layout</TableHead>
                      <TableHead>Component</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedRole.actions.length > 0 ? (
                      selectedRole.actions.map((action, index) => {
                        // Find the action details from layouts
                        let actionLayout = ""
                        let actionComponent = ""
                        for (const layout of layoutConfigs) {
                          for (const component of layout.components) {
                            const element = component.uiElements.find((el) => el.name === action)
                            if (element) {
                              actionLayout = layout.name
                              actionComponent = component.name
                              break
                            }
                          }
                          if (actionLayout) break
                        }
                        return (
                          <TableRow key={`${action}-${index}`}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Zap className="h-4 w-4 text-purple-500" />
                                <span className="font-medium">{action}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-muted-foreground">{actionLayout || "-"}</TableCell>
                            <TableCell className="text-muted-foreground">{actionComponent || "-"}</TableCell>
                            <TableCell className="text-right">
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300 gap-1">
                                <CheckCircle className="h-3 w-3" />
                                Allowed
                              </Badge>
                            </TableCell>
                          </TableRow>
                        )
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          No actions allowed for this role (read-only access)
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Info Section */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-blue-900 mb-1">Permissions Control Everything</h3>
                <p className="text-xs text-blue-800 leading-relaxed">
                  This RBAC system demonstrates a top-down authorization flow where permissions (not roles) are the
                  source of truth for UI rendering. Each layout, component, and UI element is governed by specific
                  permissions. Try switching roles to see how the interface dynamically adapts based on granted
                  permissions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
