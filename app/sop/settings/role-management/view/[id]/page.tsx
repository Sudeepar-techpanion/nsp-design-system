"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
  Layers,
  Zap,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Settings,
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

export default function RoleViewPage() {
  const params = useParams()
  const id = params.id as string
  
  // Flatten all roles for lookup
  const allRoles = roleCategories.flatMap((cat) => cat.roles)
  const role = allRoles.find((r) => r.id === id)

if (!role) {
  return (
  <div className="h-full bg-background flex flex-col">
  <Header title="Role View" />
  <div className="flex-1 overflow-auto p-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/sop/settings" className="hover:text-foreground transition-colors">
              Settings
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/sop/settings/role-management" className="hover:text-foreground transition-colors">
              Role Management
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">Role Not Found</span>
          </div>
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Shield className="h-12 w-12 text-muted-foreground mb-4" />
              <h2 className="text-lg font-semibold mb-2">Role Not Found</h2>
              <p className="text-muted-foreground mb-4">The requested role does not exist.</p>
              <Link href="/sop/settings/role-management">
                <Button variant="outline" className="gap-2 bg-transparent">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Role Management
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const hasPermission = (permission: string) => {
    return role.permissions.includes(permission)
  }

  const hasLayout = (layoutId: string) => {
    return role.layouts.includes(layoutId)
  }

  // Group permissions by category
  const groupedPermissions = permissionGroups.map((group) => ({
    ...group,
    permissions: role.permissions.filter((p) => p.startsWith(group.prefix)),
  })).filter((g) => g.permissions.length > 0)

  // Get category for this role
  const roleCategory = roleCategories.find((cat) => cat.roles.some((r) => r.id === id))

return (
  <div className="h-full bg-background flex flex-col">
  <Header title="Role View" />
  <div className="flex-1 overflow-auto p-6">
  {/* Breadcrumb */}
  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
  <Link href="/sop/settings" className="hover:text-foreground transition-colors">
  Settings
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/sop/settings/role-management" className="hover:text-foreground transition-colors">
            Role Management
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{role.name}</span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/sop/settings/role-management">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold text-foreground">{role.name}</h1>
                {role.isSystem && (
                  <Badge variant="secondary" className="gap-1">
                    <Lock className="h-3 w-3" />
                    System Role
                  </Badge>
                )}
                {roleCategory && (
                  <Badge variant="outline">{roleCategory.name}</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">{role.description}</p>
            </div>
          </div>
          <Link href="/sop/settings/role-management">
            <Button variant="outline" className="gap-2 bg-transparent">
              <Settings className="h-4 w-4" />
              Configure Role
            </Button>
          </Link>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{role.permissions.length}</p>
                  <p className="text-sm text-muted-foreground">Permissions</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Layers className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{role.layouts.length}</p>
                  <p className="text-sm text-muted-foreground">Layouts</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{role.actions.length}</p>
                  <p className="text-sm text-muted-foreground">Actions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="permissions" className="space-y-6">
          <TabsList>
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

          {/* Permissions Tab */}
          <TabsContent value="permissions">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Granted Permissions</CardTitle>
                <CardDescription>
                  All permissions assigned to this role, grouped by category
                </CardDescription>
              </CardHeader>
              <CardContent>
                {groupedPermissions.length > 0 ? (
                  <div className="grid grid-cols-2 gap-6">
                    {groupedPermissions.map((group) => (
                      <div key={group.id} className="space-y-3">
                        <div className="flex items-center gap-2 text-sm font-semibold">
                          <group.icon className="h-4 w-4 text-muted-foreground" />
                          {group.name}
                        </div>
                        <div className="space-y-2">
                          {group.permissions.map((permission) => (
                            <div
                              key={permission}
                              className="flex items-center gap-2 px-3 py-2 rounded-md bg-green-50 border border-green-200"
                            >
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-sm font-mono text-green-900">{permission}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No permissions assigned to this role
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Layouts Tab */}
          <TabsContent value="layouts">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Layout Access</CardTitle>
                <CardDescription>
                  Layouts this role can access and their components
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {layoutConfigs.map((layout) => {
                  const layoutAllowed = hasLayout(layout.id)
                  const LayoutIcon = layout.icon
                  return (
                    <div
                      key={layout.id}
                      className={`border rounded-lg p-4 ${layoutAllowed ? "border-border bg-card" : "border-dashed border-muted opacity-50"}`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${layoutAllowed ? "bg-blue-100" : "bg-muted"}`}>
                            <LayoutIcon className={`h-5 w-5 ${layoutAllowed ? "text-blue-600" : "text-muted-foreground"}`} />
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold">{layout.name}</h3>
                            <p className="text-xs text-muted-foreground">{layout.description}</p>
                          </div>
                        </div>
                        {layoutAllowed ? (
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

                      {layoutAllowed && (
                        <div className="space-y-3">
                          {layout.components.map((component) => {
                            const componentAllowed = hasPermission(component.requiredPermission)
                            return (
                              <div
                                key={component.id}
                                className={`border rounded-md p-3 ${componentAllowed ? "bg-muted/30" : "bg-muted/10 opacity-60"}`}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-medium">{component.name}</span>
                                  {componentAllowed ? (
                                    <Badge variant="secondary" className="text-xs gap-1">
                                      <CheckCircle className="h-3 w-3 text-green-600" />
                                      Accessible
                                    </Badge>
                                  ) : (
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger>
                                          <Badge variant="secondary" className="text-xs gap-1 opacity-50">
                                            <XCircle className="h-3 w-3 text-red-500" />
                                            Restricted
                                          </Badge>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>Requires: {component.requiredPermission}</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  )}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {component.uiElements.map((element) => {
                                    const elementAllowed = hasPermission(element.requiredPermission)
                                    return (
                                      <TooltipProvider key={element.id}>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Badge
                                              variant={elementAllowed ? "outline" : "secondary"}
                                              className={`text-xs ${elementAllowed ? "border-green-300 bg-green-50 text-green-700" : "opacity-50"}`}
                                            >
                                              {element.name}
                                              {element.type === "button" && <Zap className="h-3 w-3 ml-1" />}
                                            </Badge>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p>{elementAllowed ? "Allowed" : `Requires: ${element.requiredPermission}`}</p>
                                          </TooltipContent>
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
          </TabsContent>

          {/* Actions Tab */}
          <TabsContent value="actions">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Allowed Actions</CardTitle>
                <CardDescription>
                  Actions this role can perform across all layouts
                </CardDescription>
              </CardHeader>
              <CardContent>
                {role.actions.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[200px]">Action</TableHead>
                        <TableHead>Source Layout</TableHead>
                        <TableHead>Required Permission</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {role.actions.map((actionName, index) => {
                        // Find the action details from layout configs
                        let actionDetails = null
                        for (const layout of layoutConfigs) {
                          for (const component of layout.components) {
                            const element = component.uiElements.find(
                              (el) => el.name === actionName && el.type === "button"
                            )
                            if (element) {
                              actionDetails = {
                                layout: layout.name,
                                component: component.name,
                                permission: element.requiredPermission,
                              }
                              break
                            }
                          }
                          if (actionDetails) break
                        }

                        return (
                          <TableRow key={`${actionName}-${index}`}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <Zap className="h-4 w-4 text-amber-500" />
                                {actionName}
                              </div>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {actionDetails?.layout || "—"}
                            </TableCell>
                            <TableCell>
                              {actionDetails?.permission ? (
                                <Badge variant="outline" className="font-mono text-xs">
                                  {actionDetails.permission}
                                </Badge>
                              ) : (
                                "—"
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <Badge variant="outline" className="text-green-600 border-green-300 bg-green-50 gap-1">
                                <CheckCircle className="h-3 w-3" />
                                Allowed
                              </Badge>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Eye className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>This role has read-only access with no action permissions</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
