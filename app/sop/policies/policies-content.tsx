"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { StatusBadge } from "@/components/status-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Plus,
  FileText,
  Eye,
  History,
  Users,
  CheckCircle,
  Edit,
  Trash2,
  ChevronDown,
  ChevronRight,
  Bell,
  Shield,
  AlertTriangle,
  Clock,
  Search,
  Download,
  GitCompare,
  Send,
  Mail,
  Building2,
  MapPin,
  Layers,
  Info,
} from "lucide-react"

// Policy Library Data
const policies = [
  {
    id: "POL_001",
    title: "Procurement Ethics Policy",
    category: "Compliance",
    description: "Guidelines for ethical procurement practices and anti-bribery measures",
    status: "Active",
    currentVersion: "2.0",
    effectiveDate: "2026-01-01",
    expiryDate: null,
    createdBy: "Admin",
    lastUpdated: "2025-12-15",
  },
  {
    id: "POL_002",
    title: "Vendor Code of Conduct",
    category: "Commercial",
    description: "Standards and expectations for all registered vendors",
    status: "Active",
    currentVersion: "1.5",
    effectiveDate: "2025-06-01",
    expiryDate: "2027-05-31",
    createdBy: "Compliance Team",
    lastUpdated: "2025-11-20",
  },
  {
    id: "POL_003",
    title: "Sustainable Procurement Guidelines",
    category: "Procurement",
    description: "Environmental and social responsibility requirements for purchasing",
    status: "Draft",
    currentVersion: "0.9",
    effectiveDate: null,
    expiryDate: null,
    createdBy: "Sustainability Team",
    lastUpdated: "2026-01-10",
  },
  {
    id: "POL_004",
    title: "Data Privacy & Confidentiality",
    category: "Legal",
    description: "Requirements for handling sensitive procurement data",
    status: "Retired",
    currentVersion: "3.2",
    effectiveDate: "2023-01-01",
    expiryDate: "2025-12-31",
    createdBy: "Legal Team",
    lastUpdated: "2025-12-31",
  },
]

// Policy Versions
const policyVersions = [
  {
    version: "2.0",
    createdBy: "Admin",
    createdOn: "2025-12-15",
    changeSummary: "Updated anti-bribery clauses and added gift policy",
    effectiveDate: "2026-01-01",
  },
  {
    version: "1.5",
    createdBy: "Admin",
    createdOn: "2025-06-01",
    changeSummary: "Added conflict of interest section",
    effectiveDate: "2025-06-15",
  },
  {
    version: "1.0",
    createdBy: "Compliance Team",
    createdOn: "2024-01-01",
    changeSummary: "Initial policy creation",
    effectiveDate: "2024-02-01",
  },
]

// Applicability Configuration
const applicabilityConfig = {
  internalRoles: [
    { role: "Requestor", applied: true },
    { role: "Buyer", applied: true },
    { role: "Approver", applied: true },
    { role: "Finance", applied: true },
    { role: "Compliance", applied: false },
  ],
  externalRoles: [{ role: "Suppliers", applied: true }],
  scopeType: "Entity-specific",
  appliedEntities: ["JSPL Steel Division", "JSPL Power Division"],
  appliedModules: ["RFQ", "PO", "Invoice"],
}

// Consent Trigger Points - keep for backward compatibility
const triggerPoints = [
  {
    id: "TRG_001",
    action: "RFQ Creation",
    description: "When a new RFQ is created",
    enabled: true,
    policyId: "POL_001",
  },
  {
    id: "TRG_002",
    action: "Bid Submission",
    description: "When a supplier submits a bid",
    enabled: true,
    policyId: "POL_001",
  },
  {
    id: "TRG_003",
    action: "Bid Negotiation",
    description: "Before entering negotiation phase",
    enabled: false,
    policyId: "POL_001",
  },
  {
    id: "TRG_004",
    action: "PO Creation",
    description: "When a purchase order is created",
    enabled: true,
    policyId: "POL_001",
  },
  {
    id: "TRG_005",
    action: "PO Acceptance",
    description: "When supplier accepts a PO",
    enabled: true,
    policyId: "POL_002",
  },
  {
    id: "TRG_006",
    action: "Order Confirmation",
    description: "Final order confirmation step",
    enabled: false,
    policyId: "POL_002",
  },
  {
    id: "TRG_007",
    action: "Invoice Submission",
    description: "When supplier submits an invoice",
    enabled: true,
    policyId: "POL_002",
  },
]

// Consent Rules
const consentRules = [
  {
    id: "CR_001",
    policyId: "POL_001",
    policyTitle: "Procurement Ethics Policy",
    consentType: "Mandatory",
    frequency: "Recurring",
    reConsentOn: ["New Version", "Time Period Lapse"],
    validityDays: 365,
    autoExpiry: true,
  },
  {
    id: "CR_002",
    policyId: "POL_002",
    policyTitle: "Vendor Code of Conduct",
    consentType: "Mandatory",
    frequency: "One-time",
    reConsentOn: ["New Version"],
    validityDays: null,
    autoExpiry: false,
  },
]

// Policy Rules Configuration (WHEN)
const policyRules = [
  {
    id: "PR_001",
    policyId: "POL_001",
    policyVersion: "2.0",
    policyTitle: "Procurement Ethics Policy",
    triggerEvent: "BID_SUBMIT",
    appliesTo: ["Supplier"],
    consentType: "Mandatory",
    effectiveDate: "2026-01-01",
    expiryDate: null,
    reConsentRules: ["Version Change", "Time Lapse (365 days)"],
    status: "Active",
  },
  {
    id: "PR_002",
    policyId: "POL_001",
    policyVersion: "2.0",
    policyTitle: "Procurement Ethics Policy",
    triggerEvent: "PO_ACCEPT",
    appliesTo: ["Supplier"],
    consentType: "Mandatory",
    effectiveDate: "2026-01-01",
    expiryDate: null,
    reConsentRules: ["Version Change"],
    status: "Active",
  },
  {
    id: "PR_003",
    policyId: "POL_002",
    policyVersion: "1.5",
    policyTitle: "Vendor Code of Conduct",
    triggerEvent: "NEGOTIATION_FINALIZE",
    appliesTo: ["Internal", "Supplier"],
    consentType: "Optional",
    effectiveDate: "2025-06-01",
    expiryDate: "2027-05-31",
    reConsentRules: ["Version Change"],
    status: "Active",
  },
]

// Workflow Injection Mapping (WHERE)
const workflowInjections = [
  {
    id: "WI_001",
    workflowId: "WF_RFQ_BID_SUBMIT",
    workflowName: "RFQ Bid Submission Workflow",
    triggerAction: "BID_SUBMIT",
    injectionPoint: "PRE_COMPLETE",
    consentNodeId: "CONSENT_GATE_01",
    failurePath: "Block",
    linkedPolicies: ["POL_001"],
    status: "Active",
  },
  {
    id: "WI_002",
    workflowId: "WF_PO_ACCEPTANCE",
    workflowName: "PO Acceptance Workflow",
    triggerAction: "PO_ACCEPT",
    injectionPoint: "PRE_ACTION",
    consentNodeId: "CONSENT_GATE_02",
    failurePath: "Return",
    linkedPolicies: ["POL_001", "POL_002"],
    status: "Active",
  },
  {
    id: "WI_003",
    workflowId: "WF_NEGOTIATION",
    workflowName: "Negotiation Finalization Workflow",
    triggerAction: "NEGOTIATION_FINALIZE",
    injectionPoint: "MID_FLOW",
    consentNodeId: "CONSENT_GATE_03",
    failurePath: "Escalate",
    linkedPolicies: ["POL_002"],
    status: "Draft",
  },
]

// Consent Node Definitions (WHAT)
const consentNodes = [
  {
    id: "CONSENT_GATE_01",
    nodeType: "CONSENT_GATE",
    linkedPolicies: ["POL_001"],
    modalTemplateId: "MODAL_001",
    blockingBehavior: "Hard",
    timeoutMinutes: null,
    description: "Ethics policy consent before bid submission",
  },
  {
    id: "CONSENT_GATE_02",
    nodeType: "CONSENT_GATE",
    linkedPolicies: ["POL_001", "POL_002"],
    modalTemplateId: "MODAL_002",
    blockingBehavior: "Hard",
    timeoutMinutes: 30,
    description: "Multi-policy consent for PO acceptance",
  },
  {
    id: "CONSENT_GATE_03",
    nodeType: "CONSENT_GATE",
    linkedPolicies: ["POL_002"],
    modalTemplateId: "MODAL_003",
    blockingBehavior: "Soft",
    timeoutMinutes: 60,
    description: "Code of conduct consent during negotiation",
  },
]

// Consent Modal Templates (HOW)
const modalTemplates = [
  {
    id: "MODAL_001",
    title: "Procurement Ethics Acknowledgment",
    policySource: "POL_001 v2.0",
    acceptLabel: "I Accept",
    declineLabel: "I Decline",
    mandatoryCheckbox: true,
    scrollToEnd: true,
    stackedPolicies: false,
  },
  {
    id: "MODAL_002",
    title: "Policy Acknowledgment Required",
    policySource: "Multiple Policies",
    acceptLabel: "Accept All",
    declineLabel: "Decline",
    mandatoryCheckbox: true,
    scrollToEnd: true,
    stackedPolicies: true,
  },
  {
    id: "MODAL_003",
    title: "Vendor Code of Conduct",
    policySource: "POL_002 v1.5",
    acceptLabel: "I Agree",
    declineLabel: "Skip for Now",
    mandatoryCheckbox: false,
    scrollToEnd: false,
    stackedPolicies: false,
  },
]

// Consent Audit Trail
const consentAuditTrail = [
  {
    id: "CA_001",
    policyId: "POL_001",
    policyVersion: "2.0",
    userId: "USR_1001",
    userName: "Rajesh Kumar",
    userRole: "Buyer",
    actionTrigger: "PO Creation",
    consentStatus: "Accepted",
    timestamp: "2026-01-15 10:32:45",
    ipAddress: "192.168.1.105",
    source: "Web",
  },
  {
    id: "CA_002",
    policyId: "POL_002",
    policyVersion: "1.5",
    userId: "SUP_2001",
    userName: "ABC Supplies Ltd",
    userRole: "Supplier",
    actionTrigger: "Bid Submission",
    consentStatus: "Accepted",
    timestamp: "2026-01-15 09:15:22",
    ipAddress: "203.122.45.67",
    source: "Portal",
  },
  {
    id: "CA_003",
    policyId: "POL_001",
    policyVersion: "2.0",
    userId: "USR_1002",
    userName: "Priya Sharma",
    userRole: "Approver",
    actionTrigger: "RFQ Creation",
    consentStatus: "Accepted",
    timestamp: "2026-01-14 16:45:10",
    ipAddress: "192.168.1.112",
    source: "Web",
  },
  {
    id: "CA_004",
    policyId: "POL_002",
    policyVersion: "1.5",
    userId: "SUP_2005",
    userName: "XYZ Industries",
    userRole: "Supplier",
    actionTrigger: "Invoice Submission",
    consentStatus: "Declined",
    timestamp: "2026-01-14 14:22:33",
    ipAddress: "117.200.88.45",
    source: "Portal",
  },
]

// Dashboard Metrics
const dashboardMetrics = {
  activePolicies: 8,
  pendingConsents: 35,
  consentRate: 92,
  avgResponseTime: "2.4 hrs",
  byRole: [
    { role: "Buyers", total: 50, consented: 48, rate: 96 },
    { role: "Approvers", total: 25, consented: 23, rate: 92 },
    { role: "Requestors", total: 120, consented: 108, rate: 90 },
    { role: "Suppliers", total: 85, consented: 76, rate: 89 },
  ],
  byPolicy: [
    { policy: "Procurement Ethics", total: 175, consented: 168, rate: 96 },
    { policy: "Vendor Code of Conduct", total: 85, consented: 76, rate: 89 },
    { policy: "Sustainable Procurement", total: 0, consented: 0, rate: 0 },
  ],
}

const categoryColors: Record<string, string> = {
  Procurement: "bg-blue-100 text-blue-700",
  Commercial: "bg-green-100 text-green-700",
  Compliance: "bg-purple-100 text-purple-700",
  Legal: "bg-orange-100 text-orange-700",
}

export function PoliciesContent() {
  const [activeTab, setActiveTab] = useState("library")
  const [showVersionHistory, setShowVersionHistory] = useState(false)
  const [expandedTriggers, setExpandedTriggers] = useState<string[]>(["POL_001"])
  const [searchQuery, setSearchQuery] = useState("")
  const [triggersSubTab, setTriggersSubTab] = useState("rules")
  const [expandedWorkflows, setExpandedWorkflows] = useState<string[]>(["WI_001"])

  const toggleTriggerExpand = (policyId: string) => {
    setExpandedTriggers((prev) =>
      prev.includes(policyId) ? prev.filter((id) => id !== policyId) : [...prev, policyId],
    )
  }

  const toggleWorkflowExpand = (workflowId: string) => {
    setExpandedWorkflows((prev) =>
      prev.includes(workflowId) ? prev.filter((id) => id !== workflowId) : [...prev, workflowId],
    )
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col">
        <Header
          title="Policy & Consent Management"
          description="Define policies, configure consent rules, and maintain audit trails."
        />

        <div className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="library">Policy Library</TabsTrigger>
              <TabsTrigger value="content">Content & Versions</TabsTrigger>
              <TabsTrigger value="applicability">Applicability</TabsTrigger>
              <TabsTrigger value="triggers">Consent Triggers</TabsTrigger>
              <TabsTrigger value="rules">Consent Rules</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="audit">Audit Trail</TabsTrigger>
            </TabsList>

            {/* Policy Library Tab */}
            <TabsContent value="library" className="mt-6 space-y-6">
              {/* Dashboard Summary */}
              <div className="grid gap-4 md:grid-cols-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Active Policies</p>
                        <p className="text-2xl font-bold">{dashboardMetrics.activePolicies}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                        <CheckCircle className="h-5 w-5 text-success" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Consent Rate</p>
                        <p className="text-2xl font-bold">{dashboardMetrics.consentRate}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                        <AlertTriangle className="h-5 w-5 text-warning-foreground" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Pending Consent</p>
                        <p className="text-2xl font-bold">{dashboardMetrics.pendingConsents}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10">
                        <Clock className="h-5 w-5 text-info" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Avg Response</p>
                        <p className="text-2xl font-bold">{dashboardMetrics.avgResponseTime}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Policy Library Table */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Policy Library</CardTitle>
                    <CardDescription>Master list of all procurement policies</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search policies..."
                        className="pl-8 w-64"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-36">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="procurement">Procurement</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                        <SelectItem value="compliance">Compliance</SelectItem>
                        <SelectItem value="legal">Legal</SelectItem>
                      </SelectContent>
                    </Select>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="mr-2 h-4 w-4" />
                          New Policy
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                          <DialogTitle>Create New Policy</DialogTitle>
                          <DialogDescription>Define a new policy for your procurement framework.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label>
                              Policy Title <span className="text-destructive">*</span>
                            </Label>
                            <Input placeholder="e.g., Procurement Ethics Policy" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                              <Label>
                                Category <span className="text-destructive">*</span>
                              </Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="procurement">Procurement</SelectItem>
                                  <SelectItem value="commercial">Commercial</SelectItem>
                                  <SelectItem value="compliance">Compliance</SelectItem>
                                  <SelectItem value="legal">Legal</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid gap-2">
                              <Label>Initial Status</Label>
                              <Select defaultValue="draft">
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="draft">Draft</SelectItem>
                                  <SelectItem value="active">Active</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="grid gap-2">
                            <Label>Description</Label>
                            <Textarea placeholder="Brief summary of the policy..." rows={3} />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                              <Label>Effective Date</Label>
                              <Input type="date" />
                            </div>
                            <div className="grid gap-2">
                              <Label>Expiry Date (Optional)</Label>
                              <Input type="date" />
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline">Cancel</Button>
                          <Button>Create Policy</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Policy ID</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Version</TableHead>
                          <TableHead>Effective Date</TableHead>
                          <TableHead>Expiry Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="w-[120px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {policies.map((policy) => (
                          <TableRow key={policy.id}>
                            <TableCell className="font-mono text-sm">{policy.id}</TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">{policy.title}</p>
                                <p className="text-xs text-muted-foreground">{policy.description}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary" className={categoryColors[policy.category]}>
                                {policy.category}
                              </Badge>
                            </TableCell>
                            <TableCell>v{policy.currentVersion}</TableCell>
                            <TableCell>{policy.effectiveDate || "-"}</TableCell>
                            <TableCell>{policy.expiryDate || "-"}</TableCell>
                            <TableCell>
                              <StatusBadge
                                variant={
                                  policy.status === "Active"
                                    ? "success"
                                    : policy.status === "Draft"
                                      ? "warning"
                                      : "default"
                                }
                              >
                                {policy.status}
                              </StatusBadge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>View Policy</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Edit Policy</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() => setShowVersionHistory(true)}
                                    >
                                      <History className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Version History</TooltipContent>
                                </Tooltip>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Only Active policies can be enforced. Retired policies remain for audit history.
                  </p>
                </CardContent>
              </Card>

              {/* Consent Completion by Role */}
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Consent Completion by Role</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {dashboardMetrics.byRole.map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>{item.role}</span>
                          <span className="text-muted-foreground">
                            {item.consented}/{item.total} ({item.rate}%)
                          </span>
                        </div>
                        <Progress value={item.rate} className="h-2" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Consent Completion by Policy</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {dashboardMetrics.byPolicy.map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>{item.policy}</span>
                          <span className="text-muted-foreground">
                            {item.total > 0 ? `${item.consented}/${item.total} (${item.rate}%)` : "Not Active"}
                          </span>
                        </div>
                        <Progress value={item.rate} className="h-2" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Content & Versions Tab */}
            <TabsContent value="content" className="mt-6 space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Policy Content Editor</CardTitle>
                    <CardDescription>Edit policy content and manage versions</CardDescription>
                  </div>
                  <Select defaultValue="POL_001">
                    <SelectTrigger className="w-72">
                      <SelectValue placeholder="Select policy" />
                    </SelectTrigger>
                    <SelectContent>
                      {policies
                        .filter((p) => p.status !== "Retired")
                        .map((policy) => (
                          <SelectItem key={policy.id} value={policy.id}>
                            {policy.title} (v{policy.currentVersion})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Policy Content Editor Placeholder */}
                  <div className="rounded-lg border bg-muted/30 p-4">
                    <div className="mb-4 flex items-center gap-2 border-b pb-3">
                      <Button variant="ghost" size="sm">
                        Bold
                      </Button>
                      <Button variant="ghost" size="sm">
                        Italic
                      </Button>
                      <Button variant="ghost" size="sm">
                        Underline
                      </Button>
                      <div className="h-4 w-px bg-border" />
                      <Button variant="ghost" size="sm">
                        Link
                      </Button>
                      <Button variant="ghost" size="sm">
                        Table
                      </Button>
                      <Button variant="ghost" size="sm">
                        List
                      </Button>
                    </div>
                    <div className="min-h-[300px] rounded bg-background p-4">
                      <h2 className="text-xl font-semibold mb-4">Procurement Ethics Policy</h2>
                      <p className="mb-3">
                        This policy establishes the ethical standards and guidelines for all procurement activities
                        within the organization.
                      </p>
                      <h3 className="text-lg font-medium mt-4 mb-2">1. Purpose</h3>
                      <p className="mb-3">
                        To ensure all procurement decisions are made with integrity, transparency, and in the best
                        interest of the organization...
                      </p>
                      <h3 className="text-lg font-medium mt-4 mb-2">2. Scope</h3>
                      <p className="mb-3">
                        This policy applies to all employees involved in the procurement process...
                      </p>
                      <h3 className="text-lg font-medium mt-4 mb-2">3. Anti-Bribery & Corruption</h3>
                      <p>All forms of bribery and corruption are strictly prohibited...</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="grid gap-2">
                      <Label>Change Summary (for new version)</Label>
                      <Input placeholder="Describe changes made in this version..." className="w-96" />
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline">Save Draft</Button>
                      <Button>Publish New Version</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Version History */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Version History</CardTitle>
                    <CardDescription>All historical versions are read-only and maintained for audit</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <GitCompare className="mr-2 h-4 w-4" />
                    Compare Versions
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Version</TableHead>
                          <TableHead>Created By</TableHead>
                          <TableHead>Created On</TableHead>
                          <TableHead>Change Summary</TableHead>
                          <TableHead>Effective Date</TableHead>
                          <TableHead className="w-[100px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {policyVersions.map((version, index) => (
                          <TableRow key={version.version}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">v{version.version}</span>
                                {index === 0 && (
                                  <Badge variant="secondary" className="bg-success/10 text-success">
                                    Current
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>{version.createdBy}</TableCell>
                            <TableCell>{version.createdOn}</TableCell>
                            <TableCell className="max-w-xs truncate">{version.changeSummary}</TableCell>
                            <TableCell>{version.effectiveDate}</TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm">
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Applicability Tab */}
            <TabsContent value="applicability" className="mt-6 space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Applicability & Audience Configuration</CardTitle>
                    <CardDescription>Configure who the policy applies to and its scope</CardDescription>
                  </div>
                  <Select defaultValue="POL_001">
                    <SelectTrigger className="w-72">
                      <SelectValue placeholder="Select policy" />
                    </SelectTrigger>
                    <SelectContent>
                      {policies
                        .filter((p) => p.status === "Active")
                        .map((policy) => (
                          <SelectItem key={policy.id} value={policy.id}>
                            {policy.title}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Target Audience */}
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        <h3 className="font-medium">Internal Users</h3>
                      </div>
                      <div className="rounded-lg border p-4 space-y-3">
                        {applicabilityConfig.internalRoles.map((item, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <Label className="font-normal">{item.role}</Label>
                            <Switch defaultChecked={item.applied} />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-primary" />
                        <h3 className="font-medium">External Users</h3>
                      </div>
                      <div className="rounded-lg border p-4 space-y-3">
                        {applicabilityConfig.externalRoles.map((item, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <Label className="font-normal">{item.role}</Label>
                            <Switch defaultChecked={item.applied} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Scope Controls */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      <h3 className="font-medium">Scope Controls</h3>
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="grid gap-2">
                        <Label>Scope Type</Label>
                        <Select defaultValue="entity">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="company">Company-wide</SelectItem>
                            <SelectItem value="entity">Entity-specific</SelectItem>
                            <SelectItem value="location">Location-specific</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label>Applied Entities</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select entities" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="steel">JSPL Steel Division</SelectItem>
                            <SelectItem value="power">JSPL Power Division</SelectItem>
                            <SelectItem value="mining">JSPL Mining Division</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label>Current Selection</Label>
                        <div className="flex flex-wrap gap-1 rounded-md border p-2 min-h-[40px]">
                          {applicabilityConfig.appliedEntities.map((entity, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {entity}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Module-specific */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Layers className="h-5 w-5 text-primary" />
                      <h3 className="font-medium">Module-specific Application</h3>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      {["RFQ", "PO", "Invoice", "Supplier Portal"].map((module) => (
                        <div key={module} className="flex items-center gap-2">
                          <Checkbox id={module} defaultChecked={applicabilityConfig.appliedModules.includes(module)} />
                          <Label htmlFor={module} className="font-normal">
                            {module}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button>Save Configuration</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Consent Triggers Tab - Complete redesign with sub-tabs */}
            <TabsContent value="triggers" className="mt-6 space-y-6">
              <Tabs value={triggersSubTab} onValueChange={setTriggersSubTab}>
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="rules">Policy Rules (WHEN)</TabsTrigger>
                  <TabsTrigger value="workflows">Workflow Injection (WHERE)</TabsTrigger>
                  <TabsTrigger value="nodes">Consent Nodes (WHAT)</TabsTrigger>
                  <TabsTrigger value="modals">Modal Config (HOW)</TabsTrigger>
                  <TabsTrigger value="resume">Resume Logic</TabsTrigger>
                </TabsList>

                {/* Policy Rules Configuration (WHEN) */}
                <TabsContent value="rules" className="mt-6 space-y-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>Policy Rule Configuration</CardTitle>
                        <CardDescription>Define when consent is triggered during specific actions</CardDescription>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Rule
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                          <DialogHeader>
                            <DialogTitle>Add Policy Rule</DialogTitle>
                            <DialogDescription>
                              Configure when consent should be required for a policy.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="grid gap-2">
                                <Label>
                                  Policy <span className="text-destructive">*</span>
                                </Label>
                                <Select>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select policy" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {policies
                                      .filter((p) => p.status === "Active")
                                      .map((policy) => (
                                        <SelectItem key={policy.id} value={policy.id}>
                                          {policy.title}
                                        </SelectItem>
                                      ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="grid gap-2">
                                <Label>Policy Version</Label>
                                <Select defaultValue="latest">
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="latest">Latest (Auto)</SelectItem>
                                    <SelectItem value="2.0">v2.0</SelectItem>
                                    <SelectItem value="1.5">v1.5</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div className="grid gap-2">
                              <Label>
                                Trigger Event <span className="text-destructive">*</span>
                              </Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select trigger event" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="BID_SUBMIT">BID_SUBMIT</SelectItem>
                                  <SelectItem value="PO_ACCEPT">PO_ACCEPT</SelectItem>
                                  <SelectItem value="PO_CREATE">PO_CREATE</SelectItem>
                                  <SelectItem value="RFQ_CREATE">RFQ_CREATE</SelectItem>
                                  <SelectItem value="NEGOTIATION_FINALIZE">NEGOTIATION_FINALIZE</SelectItem>
                                  <SelectItem value="INVOICE_SUBMIT">INVOICE_SUBMIT</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid gap-2">
                              <Label>Applies To (Roles)</Label>
                              <div className="flex flex-wrap gap-4">
                                <div className="flex items-center gap-2">
                                  <Checkbox id="role-supplier" defaultChecked />
                                  <Label htmlFor="role-supplier" className="font-normal">
                                    Supplier
                                  </Label>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Checkbox id="role-internal" />
                                  <Label htmlFor="role-internal" className="font-normal">
                                    Internal
                                  </Label>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Checkbox id="role-buyer" />
                                  <Label htmlFor="role-buyer" className="font-normal">
                                    Buyer
                                  </Label>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Checkbox id="role-approver" />
                                  <Label htmlFor="role-approver" className="font-normal">
                                    Approver
                                  </Label>
                                </div>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="grid gap-2">
                                <Label>
                                  Consent Type <span className="text-destructive">*</span>
                                </Label>
                                <Select defaultValue="mandatory">
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="mandatory">Mandatory</SelectItem>
                                    <SelectItem value="optional">Optional</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="grid gap-2">
                                <Label>Effective Date</Label>
                                <Input type="date" />
                              </div>
                            </div>
                            <div className="grid gap-2">
                              <Label>Re-consent Rules</Label>
                              <div className="flex flex-wrap gap-4">
                                <div className="flex items-center gap-2">
                                  <Checkbox id="reconsent-version" defaultChecked />
                                  <Label htmlFor="reconsent-version" className="font-normal">
                                    On Version Change
                                  </Label>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Checkbox id="reconsent-time" />
                                  <Label htmlFor="reconsent-time" className="font-normal">
                                    Time Period Lapse
                                  </Label>
                                </div>
                              </div>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline">Cancel</Button>
                            <Button>Create Rule</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Rule ID</TableHead>
                              <TableHead>Policy</TableHead>
                              <TableHead>Trigger Event</TableHead>
                              <TableHead>Applies To</TableHead>
                              <TableHead>Consent Type</TableHead>
                              <TableHead>Re-consent</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead className="w-[100px]">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {policyRules.map((rule) => (
                              <TableRow key={rule.id}>
                                <TableCell className="font-mono text-sm">{rule.id}</TableCell>
                                <TableCell>
                                  <div>
                                    <p className="font-medium text-sm">{rule.policyTitle}</p>
                                    <p className="text-xs text-muted-foreground">v{rule.policyVersion}</p>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline" className="font-mono">
                                    {rule.triggerEvent}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex flex-wrap gap-1">
                                    {rule.appliesTo.map((role) => (
                                      <Badge key={role} variant="secondary" className="text-xs">
                                        {role}
                                      </Badge>
                                    ))}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <StatusBadge variant={rule.consentType === "Mandatory" ? "warning" : "default"}>
                                    {rule.consentType}
                                  </StatusBadge>
                                </TableCell>
                                <TableCell>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <span className="text-sm text-muted-foreground cursor-help underline decoration-dotted">
                                        {rule.reConsentRules.length} rules
                                      </span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <ul className="text-xs space-y-1">
                                        {rule.reConsentRules.map((r, i) => (
                                          <li key={i}>• {r}</li>
                                        ))}
                                      </ul>
                                    </TooltipContent>
                                  </Tooltip>
                                </TableCell>
                                <TableCell>
                                  <StatusBadge variant={rule.status === "Active" ? "success" : "default"}>
                                    {rule.status}
                                  </StatusBadge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-1">
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

                      {/* Rule Example */}
                      <div className="mt-4">
                        <Collapsible>
                          <CollapsibleTrigger asChild>
                            <Button variant="outline" className="w-full justify-between bg-transparent">
                              <span className="flex items-center gap-2">
                                <Info className="h-4 w-4" />
                                Rule Logic Example
                              </span>
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <div className="mt-2 rounded-lg bg-muted p-4">
                              <pre className="text-xs font-mono whitespace-pre-wrap">
                                {`IF Action = BID_SUBMIT
AND UserRole = SUPPLIER
AND PolicyStatus = ACTIVE
THEN RequireConsent = TRUE`}
                              </pre>
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Workflow Injection Mapping (WHERE) */}
                <TabsContent value="workflows" className="mt-6 space-y-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>Workflow Injection Mapping</CardTitle>
                        <CardDescription>Configure Policy Hooks inside workflows with injection points</CardDescription>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Injection
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                          <DialogHeader>
                            <DialogTitle>Add Workflow Injection</DialogTitle>
                            <DialogDescription>
                              Configure where consent should be injected in a workflow.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Label>
                                Workflow <span className="text-destructive">*</span>
                              </Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select workflow" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="WF_RFQ_BID_SUBMIT">RFQ Bid Submission Workflow</SelectItem>
                                  <SelectItem value="WF_PO_ACCEPTANCE">PO Acceptance Workflow</SelectItem>
                                  <SelectItem value="WF_NEGOTIATION">Negotiation Finalization Workflow</SelectItem>
                                  <SelectItem value="WF_INVOICE_PROCESS">Invoice Processing Workflow</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="grid gap-2">
                                <Label>
                                  Trigger Action <span className="text-destructive">*</span>
                                </Label>
                                <Select>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select action" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="BID_SUBMIT">BID_SUBMIT</SelectItem>
                                    <SelectItem value="PO_ACCEPT">PO_ACCEPT</SelectItem>
                                    <SelectItem value="NEGOTIATION_FINALIZE">NEGOTIATION_FINALIZE</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="grid gap-2">
                                <Label>
                                  Injection Point <span className="text-destructive">*</span>
                                </Label>
                                <Select>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select point" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="PRE_ACTION">PRE_ACTION</SelectItem>
                                    <SelectItem value="MID_FLOW">MID_FLOW</SelectItem>
                                    <SelectItem value="PRE_COMPLETE">PRE_COMPLETE</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="grid gap-2">
                                <Label>
                                  Consent Node <span className="text-destructive">*</span>
                                </Label>
                                <Select>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select node" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {consentNodes.map((node) => (
                                      <SelectItem key={node.id} value={node.id}>
                                        {node.id}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="grid gap-2">
                                <Label>
                                  Failure Path <span className="text-destructive">*</span>
                                </Label>
                                <Select>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select path" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Block">Block - Prevent action</SelectItem>
                                    <SelectItem value="Return">Return - Go back</SelectItem>
                                    <SelectItem value="Escalate">Escalate - Route to approver</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div className="grid gap-2">
                              <Label>Linked Policies</Label>
                              <div className="flex flex-wrap gap-4">
                                {policies
                                  .filter((p) => p.status === "Active")
                                  .map((policy) => (
                                    <div key={policy.id} className="flex items-center gap-2">
                                      <Checkbox id={`link-${policy.id}`} />
                                      <Label htmlFor={`link-${policy.id}`} className="font-normal text-sm">
                                        {policy.title}
                                      </Label>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline">Cancel</Button>
                            <Button>Create Injection</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {workflowInjections.map((injection) => {
                          const isExpanded = expandedWorkflows.includes(injection.id)
                          return (
                            <Collapsible
                              key={injection.id}
                              open={isExpanded}
                              onOpenChange={() => toggleWorkflowExpand(injection.id)}
                            >
                              <CollapsibleTrigger asChild>
                                <div className="flex items-center justify-between rounded-lg border p-4 cursor-pointer hover:bg-muted/50">
                                  <div className="flex items-center gap-3">
                                    {isExpanded ? (
                                      <ChevronDown className="h-4 w-4" />
                                    ) : (
                                      <ChevronRight className="h-4 w-4" />
                                    )}
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <p className="font-medium">{injection.workflowName}</p>
                                        <Badge variant="outline" className="font-mono text-xs">
                                          {injection.workflowId}
                                        </Badge>
                                      </div>
                                      <p className="text-sm text-muted-foreground">
                                        Injection at {injection.injectionPoint} • {injection.linkedPolicies.length}{" "}
                                        linked policies
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <StatusBadge variant={injection.status === "Active" ? "success" : "default"}>
                                      {injection.status}
                                    </StatusBadge>
                                  </div>
                                </div>
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                <div className="mt-2 ml-7 rounded-lg border p-4 space-y-4">
                                  <div className="grid grid-cols-4 gap-4">
                                    <div>
                                      <p className="text-xs text-muted-foreground">Trigger Action</p>
                                      <Badge variant="outline" className="mt-1 font-mono">
                                        {injection.triggerAction}
                                      </Badge>
                                    </div>
                                    <div>
                                      <p className="text-xs text-muted-foreground">Injection Point</p>
                                      <Badge className="mt-1 bg-primary/10 text-primary hover:bg-primary/20">
                                        {injection.injectionPoint}
                                      </Badge>
                                    </div>
                                    <div>
                                      <p className="text-xs text-muted-foreground">Consent Node</p>
                                      <Badge variant="secondary" className="mt-1 font-mono">
                                        {injection.consentNodeId}
                                      </Badge>
                                    </div>
                                    <div>
                                      <p className="text-xs text-muted-foreground">Failure Path</p>
                                      <Badge
                                        className={`mt-1 ${
                                          injection.failurePath === "Block"
                                            ? "bg-destructive/10 text-destructive"
                                            : injection.failurePath === "Return"
                                              ? "bg-warning/10 text-warning-foreground"
                                              : "bg-info/10 text-info"
                                        }`}
                                      >
                                        {injection.failurePath}
                                      </Badge>
                                    </div>
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground mb-2">Linked Policies</p>
                                    <div className="flex flex-wrap gap-2">
                                      {injection.linkedPolicies.map((pId) => {
                                        const policy = policies.find((p) => p.id === pId)
                                        return (
                                          <Badge key={pId} variant="secondary">
                                            {policy?.title || pId}
                                          </Badge>
                                        )
                                      })}
                                    </div>
                                  </div>
                                  <div className="flex justify-end gap-2">
                                    <Button variant="outline" size="sm">
                                      <Edit className="mr-2 h-3 w-3" />
                                      Edit
                                    </Button>
                                    <Button variant="outline" size="sm" className="text-destructive bg-transparent">
                                      <Trash2 className="mr-2 h-3 w-3" />
                                      Remove
                                    </Button>
                                  </div>
                                </div>
                              </CollapsibleContent>
                            </Collapsible>
                          )
                        })}
                      </div>

                      {/* Workflow Diagram Placeholder */}
                      <div className="mt-6 rounded-lg border-2 border-dashed p-6 text-center">
                        <Layers className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Workflow injection points support: PRE_ACTION, MID_FLOW, PRE_COMPLETE hooks
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Consent Node Definition (WHAT) */}
                <TabsContent value="nodes" className="mt-6 space-y-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>Consent Node Definitions</CardTitle>
                        <CardDescription>
                          Define CONSENT_GATE nodes that pause workflow and await user response
                        </CardDescription>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Node
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                          <DialogHeader>
                            <DialogTitle>Add Consent Node</DialogTitle>
                            <DialogDescription>
                              Define a new consent gate node for workflow injection.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Label>
                                Node ID <span className="text-destructive">*</span>
                              </Label>
                              <Input placeholder="e.g., CONSENT_GATE_04" />
                            </div>
                            <div className="grid gap-2">
                              <Label>Description</Label>
                              <Input placeholder="Brief description of this consent gate..." />
                            </div>
                            <div className="grid gap-2">
                              <Label>Linked Policies</Label>
                              <div className="flex flex-wrap gap-4">
                                {policies
                                  .filter((p) => p.status === "Active")
                                  .map((policy) => (
                                    <div key={policy.id} className="flex items-center gap-2">
                                      <Checkbox id={`node-${policy.id}`} />
                                      <Label htmlFor={`node-${policy.id}`} className="font-normal text-sm">
                                        {policy.title}
                                      </Label>
                                    </div>
                                  ))}
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="grid gap-2">
                                <Label>
                                  Modal Template <span className="text-destructive">*</span>
                                </Label>
                                <Select>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select modal" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {modalTemplates.map((modal) => (
                                      <SelectItem key={modal.id} value={modal.id}>
                                        {modal.id} - {modal.title}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="grid gap-2">
                                <Label>Blocking Behavior</Label>
                                <Select defaultValue="Hard">
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Hard">Hard (Must respond)</SelectItem>
                                    <SelectItem value="Soft">Soft (Can skip)</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div className="grid gap-2">
                              <Label>Timeout (Minutes) - Optional</Label>
                              <Input type="number" placeholder="Leave empty for no timeout" />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline">Cancel</Button>
                            <Button>Create Node</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {consentNodes.map((node) => (
                          <Card key={node.id} className="border-2">
                            <CardHeader className="pb-2">
                              <div className="flex items-center justify-between">
                                <Badge variant="outline" className="font-mono">
                                  {node.nodeType}
                                </Badge>
                                <div className="flex items-center gap-1">
                                  <Button variant="ghost" size="icon" className="h-7 w-7">
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive">
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                              <CardTitle className="text-base font-mono">{node.id}</CardTitle>
                              <CardDescription className="text-xs">{node.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">Linked Policies</p>
                                <div className="flex flex-wrap gap-1">
                                  {node.linkedPolicies.map((pId) => (
                                    <Badge key={pId} variant="secondary" className="text-xs">
                                      {pId}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div className="flex justify-between text-xs">
                                <div>
                                  <p className="text-muted-foreground">Modal</p>
                                  <p className="font-mono">{node.modalTemplateId}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-muted-foreground">Blocking</p>
                                  <Badge
                                    className={
                                      node.blockingBehavior === "Hard"
                                        ? "bg-destructive/10 text-destructive"
                                        : "bg-muted"
                                    }
                                  >
                                    {node.blockingBehavior}
                                  </Badge>
                                </div>
                              </div>
                              {node.timeoutMinutes && (
                                <div className="text-xs">
                                  <p className="text-muted-foreground">Timeout</p>
                                  <p>{node.timeoutMinutes} minutes</p>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>

                      {/* Node Behavior Info */}
                      <div className="mt-6 rounded-lg bg-info/10 p-4">
                        <div className="flex items-start gap-2">
                          <Info className="h-5 w-5 text-info mt-0.5" />
                          <div className="text-sm">
                            <p className="font-medium text-info">Consent Node Behavior</p>
                            <ul className="mt-1 text-muted-foreground list-disc list-inside space-y-1">
                              <li>Pauses workflow execution at injection point</li>
                              <li>Calls Consent Modal Service to display configured modal</li>
                              <li>Awaits user response (Accept/Decline)</li>
                              <li>Routes to success or failure path based on response</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Consent Modal Configuration (HOW) */}
                <TabsContent value="modals" className="mt-6 space-y-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>Consent Modal Configuration</CardTitle>
                        <CardDescription>
                          Configure modal templates for consent capture with dynamic policy content
                        </CardDescription>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Modal Template
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                          <DialogHeader>
                            <DialogTitle>Add Modal Template</DialogTitle>
                            <DialogDescription>Configure how the consent modal appears to users.</DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="grid gap-2">
                                <Label>
                                  Modal ID <span className="text-destructive">*</span>
                                </Label>
                                <Input placeholder="e.g., MODAL_004" />
                              </div>
                              <div className="grid gap-2">
                                <Label>
                                  Title <span className="text-destructive">*</span>
                                </Label>
                                <Input placeholder="e.g., Policy Acknowledgment" />
                              </div>
                            </div>
                            <div className="grid gap-2">
                              <Label>Policy Content Source</Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select policy source" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="POL_001">POL_001 - Procurement Ethics (v2.0)</SelectItem>
                                  <SelectItem value="POL_002">POL_002 - Vendor Code of Conduct (v1.5)</SelectItem>
                                  <SelectItem value="multiple">Multiple Policies (Stacked)</SelectItem>
                                </SelectContent>
                              </Select>
                              <p className="text-xs text-muted-foreground">
                                Modal content is dynamically pulled from policy version. No hardcoded text.
                              </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="grid gap-2">
                                <Label>Accept Button Label</Label>
                                <Input placeholder="e.g., I Accept" defaultValue="I Accept" />
                              </div>
                              <div className="grid gap-2">
                                <Label>Decline Button Label</Label>
                                <Input placeholder="e.g., I Decline" defaultValue="I Decline" />
                              </div>
                            </div>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <div>
                                  <Label>Mandatory Acknowledgement Checkbox</Label>
                                  <p className="text-xs text-muted-foreground">
                                    Require explicit checkbox before accept
                                  </p>
                                </div>
                                <Switch defaultChecked />
                              </div>
                              <div className="flex items-center justify-between">
                                <div>
                                  <Label>Scroll-to-end Enforcement</Label>
                                  <p className="text-xs text-muted-foreground">
                                    User must scroll to bottom before accepting
                                  </p>
                                </div>
                                <Switch defaultChecked />
                              </div>
                              <div className="flex items-center justify-between">
                                <div>
                                  <Label>Stacked Policies</Label>
                                  <p className="text-xs text-muted-foreground">
                                    Show multiple policies in single modal
                                  </p>
                                </div>
                                <Switch />
                              </div>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline">Cancel</Button>
                            <Button>Create Template</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Modal ID</TableHead>
                              <TableHead>Title</TableHead>
                              <TableHead>Policy Source</TableHead>
                              <TableHead>Accept / Decline</TableHead>
                              <TableHead>Options</TableHead>
                              <TableHead className="w-[100px]">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {modalTemplates.map((modal) => (
                              <TableRow key={modal.id}>
                                <TableCell className="font-mono text-sm">{modal.id}</TableCell>
                                <TableCell className="font-medium">{modal.title}</TableCell>
                                <TableCell>
                                  <Badge variant="outline">{modal.policySource}</Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Badge className="bg-success/10 text-success">{modal.acceptLabel}</Badge>
                                    <span className="text-muted-foreground">/</span>
                                    <Badge variant="secondary">{modal.declineLabel}</Badge>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex flex-wrap gap-1">
                                    {modal.mandatoryCheckbox && (
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Badge variant="secondary" className="text-xs">
                                            <CheckCircle className="mr-1 h-3 w-3" />
                                            Checkbox
                                          </Badge>
                                        </TooltipTrigger>
                                        <TooltipContent>Mandatory acknowledgement checkbox</TooltipContent>
                                      </Tooltip>
                                    )}
                                    {modal.scrollToEnd && (
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Badge variant="secondary" className="text-xs">
                                            <ChevronDown className="mr-1 h-3 w-3" />
                                            Scroll
                                          </Badge>
                                        </TooltipTrigger>
                                        <TooltipContent>Scroll-to-end enforcement</TooltipContent>
                                      </Tooltip>
                                    )}
                                    {modal.stackedPolicies && (
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Badge variant="secondary" className="text-xs">
                                            <Layers className="mr-1 h-3 w-3" />
                                            Stacked
                                          </Badge>
                                        </TooltipTrigger>
                                        <TooltipContent>Multiple policies in single modal</TooltipContent>
                                      </Tooltip>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-1">
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                          <Eye className="h-4 w-4" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>Preview Modal</TooltipContent>
                                    </Tooltip>
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

                      {/* Modal Rules */}
                      <div className="mt-4 rounded-lg bg-muted p-4">
                        <p className="text-sm font-medium mb-2">Modal Content Rules</p>
                        <ul className="text-xs text-muted-foreground list-disc list-inside space-y-1">
                          <li>Modal content is dynamically pulled from policy version</li>
                          <li>No hardcoded text allowed in modals</li>
                          <li>Supports multiple policies in a single modal (stacked display)</li>
                          <li>Scroll enforcement ensures user reads full content</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Workflow Resume Logic */}
                <TabsContent value="resume" className="mt-6 space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Accept Flow */}
                    <Card className="border-success/50">
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/10">
                            <CheckCircle className="h-4 w-4 text-success" />
                          </div>
                          <CardTitle className="text-lg">On Accept</CardTitle>
                        </div>
                        <CardDescription>Actions performed when user accepts consent</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-start gap-3 rounded-lg border p-3">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-success/10 text-xs font-medium text-success">
                              1
                            </div>
                            <div>
                              <p className="font-medium text-sm">Persist Consent Record</p>
                              <p className="text-xs text-muted-foreground">
                                Store consent with Policy ID, Version, User ID, Timestamp, IP, Channel
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 rounded-lg border p-3">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-success/10 text-xs font-medium text-success">
                              2
                            </div>
                            <div>
                              <p className="font-medium text-sm">Resume Workflow Execution</p>
                              <p className="text-xs text-muted-foreground">
                                Continue from paused state to next workflow node
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 rounded-lg border p-3">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-success/10 text-xs font-medium text-success">
                              3
                            </div>
                            <div>
                              <p className="font-medium text-sm">Allow Task Completion</p>
                              <p className="text-xs text-muted-foreground">
                                User can proceed with original action (submit bid, accept PO, etc.)
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Decline Flow */}
                    <Card className="border-destructive/50">
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive/10">
                            <AlertTriangle className="h-4 w-4 text-destructive" />
                          </div>
                          <CardTitle className="text-lg">On Decline</CardTitle>
                        </div>
                        <CardDescription>Actions performed when user declines consent</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-start gap-3 rounded-lg border p-3">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-destructive/10 text-xs font-medium text-destructive">
                              1
                            </div>
                            <div>
                              <p className="font-medium text-sm">Persist Decline Record</p>
                              <p className="text-xs text-muted-foreground">
                                Store decline with all audit fields for compliance
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 rounded-lg border border-dashed p-3">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-destructive/10 text-xs font-medium text-destructive">
                              2
                            </div>
                            <div>
                              <p className="font-medium text-sm">Execute Failure Path</p>
                              <p className="text-xs text-muted-foreground mb-2">Based on configured failure path:</p>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Badge variant="destructive" className="text-xs">
                                    Block
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">Prevent action completion</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge className="bg-warning/10 text-warning-foreground text-xs">Return</Badge>
                                  <span className="text-xs text-muted-foreground">Return to previous state</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge className="bg-info/10 text-info text-xs">Escalate</Badge>
                                  <span className="text-xs text-muted-foreground">
                                    Route to approver/escalation workflow
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Flow Diagram */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Consent Flow Diagram</CardTitle>
                      <CardDescription>Visual representation of consent workflow integration</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-center gap-2 py-6 flex-wrap">
                        <div className="rounded-lg border-2 border-primary bg-primary/5 px-4 py-2 text-sm font-medium">
                          User Action
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        <div className="rounded-lg border-2 border-dashed px-4 py-2 text-sm">Policy Rule Check</div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        <div className="rounded-lg border-2 border-warning bg-warning/5 px-4 py-2 text-sm font-medium">
                          Consent Gate
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        <div className="rounded-lg border-2 border-info bg-info/5 px-4 py-2 text-sm font-medium">
                          Modal Display
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        <div className="flex flex-col gap-2">
                          <div className="rounded-lg border-2 border-success bg-success/5 px-4 py-1 text-xs font-medium text-center">
                            Accept → Resume
                          </div>
                          <div className="rounded-lg border-2 border-destructive bg-destructive/5 px-4 py-1 text-xs font-medium text-center">
                            Decline → Failure Path
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </TabsContent>

            {/* Consent Rules Tab */}
            <TabsContent value="rules" className="mt-6 space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Consent Rules</CardTitle>
                    <CardDescription>Configure consent type, frequency, and validity rules</CardDescription>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Rule
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Add Consent Rule</DialogTitle>
                        <DialogDescription>Configure how consent should be captured for a policy.</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label>Policy</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select policy" />
                            </SelectTrigger>
                            <SelectContent>
                              {policies
                                .filter((p) => p.status === "Active")
                                .map((policy) => (
                                  <SelectItem key={policy.id} value={policy.id}>
                                    {policy.title}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label>Consent Type</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="mandatory">Mandatory</SelectItem>
                                <SelectItem value="optional">Optional</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid gap-2">
                            <Label>Frequency</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select frequency" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="onetime">One-time</SelectItem>
                                <SelectItem value="recurring">Recurring</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <Label>Re-consent Required On</Label>
                          <div className="flex flex-wrap gap-4">
                            {["New Version", "Policy Update", "Time Period Lapse"].map((item) => (
                              <div key={item} className="flex items-center gap-2">
                                <Checkbox id={item.replace(/\s/g, "-")} />
                                <Label htmlFor={item.replace(/\s/g, "-")} className="font-normal text-sm">
                                  {item}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label>Validity Period (Days)</Label>
                            <Input type="number" placeholder="e.g., 365" />
                          </div>
                          <div className="flex items-end gap-2 pb-2">
                            <Checkbox id="auto-expiry" />
                            <Label htmlFor="auto-expiry" className="font-normal">
                              Auto-expiry of consent
                            </Label>
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline">Cancel</Button>
                        <Button>Save Rule</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Rule ID</TableHead>
                          <TableHead>Policy</TableHead>
                          <TableHead>Consent Type</TableHead>
                          <TableHead>Frequency</TableHead>
                          <TableHead>Re-consent On</TableHead>
                          <TableHead>Validity</TableHead>
                          <TableHead>Auto-Expiry</TableHead>
                          <TableHead className="w-[100px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {consentRules.map((rule) => (
                          <TableRow key={rule.id}>
                            <TableCell className="font-mono text-sm">{rule.id}</TableCell>
                            <TableCell>{rule.policyTitle}</TableCell>
                            <TableCell>
                              <StatusBadge variant={rule.consentType === "Mandatory" ? "error" : "default"}>
                                {rule.consentType}
                              </StatusBadge>
                            </TableCell>
                            <TableCell>{rule.frequency}</TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {rule.reConsentOn.map((item, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {item}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell>{rule.validityDays ? `${rule.validityDays} days` : "N/A"}</TableCell>
                            <TableCell>
                              {rule.autoExpiry ? (
                                <CheckCircle className="h-4 w-4 text-success" />
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
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
                  <div className="mt-4 rounded-lg bg-warning/10 p-4">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 text-warning-foreground mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-warning-foreground">Enforcement Rules</p>
                        <ul className="mt-1 text-muted-foreground list-disc list-inside space-y-1">
                          <li>
                            <strong>Mandatory consent</strong> blocks action if not accepted
                          </li>
                          <li>
                            <strong>Optional consent</strong> logs acknowledgment only
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Example JSON Config */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Example Policy & Consent Configuration</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="rounded-lg bg-muted p-4 text-sm overflow-x-auto">
                    {`{
  "policy_id": "POL_001",
  "title": "Procurement Ethics Policy",
  "version": "2.0",
  "effective_date": "2026-01-01",
  "applies_to": ["Buyer", "Supplier"],
  "trigger_actions": ["BID_SUBMIT", "PO_ACCEPT"],
  "consent_type": "MANDATORY",
  "validity_period_days": 365
}`}
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification & Broadcast Settings</CardTitle>
                  <CardDescription>
                    Configure how users are notified about policies and consent requirements
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Notification Triggers */}
                  <div className="space-y-4">
                    <h3 className="font-medium flex items-center gap-2">
                      <Bell className="h-5 w-5 text-primary" />
                      Notify Users On
                    </h3>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                          <p className="font-medium">New Policy Published</p>
                          <p className="text-sm text-muted-foreground">When a new policy becomes active</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                          <p className="font-medium">Policy Updated</p>
                          <p className="text-sm text-muted-foreground">When a new version is published</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                          <p className="font-medium">Consent Pending</p>
                          <p className="text-sm text-muted-foreground">Reminder for pending consent</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>

                  {/* Broadcast Audience */}
                  <div className="space-y-4">
                    <h3 className="font-medium flex items-center gap-2">
                      <Send className="h-5 w-5 text-primary" />
                      Broadcast Audience
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-lg border p-4 space-y-3">
                        <Label>Default Broadcast Target</Label>
                        <Select defaultValue="applicable">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Users</SelectItem>
                            <SelectItem value="applicable">Applicable Users Only</SelectItem>
                            <SelectItem value="specific">Specific Roles/Entities</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="rounded-lg border p-4 space-y-3">
                        <Label>Specific Roles (if selected)</Label>
                        <div className="flex flex-wrap gap-2">
                          {["Buyer", "Approver", "Requestor", "Finance", "Supplier"].map((role) => (
                            <div key={role} className="flex items-center gap-2">
                              <Checkbox id={`notify-${role}`} />
                              <Label htmlFor={`notify-${role}`} className="font-normal text-sm">
                                {role}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Notification Channels */}
                  <div className="space-y-4">
                    <h3 className="font-medium flex items-center gap-2">
                      <Mail className="h-5 w-5 text-primary" />
                      Notification Channels
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <Bell className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">In-App Notification</p>
                            <p className="text-sm text-muted-foreground">Show in notification center</p>
                          </div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <Mail className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">Email Notification</p>
                            <p className="text-sm text-muted-foreground">Send email to users</p>
                          </div>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button>Save Notification Settings</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Audit Trail Tab */}
            <TabsContent value="audit" className="mt-6 space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Consent Audit Trail</CardTitle>
                    <CardDescription>Immutable records of all consent actions for audit and reporting</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filter by Policy" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Policies</SelectItem>
                        {policies.map((policy) => (
                          <SelectItem key={policy.id} value={policy.id}>
                            {policy.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-36">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="accepted">Accepted</SelectItem>
                        <SelectItem value="declined">Declined</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Policy</TableHead>
                          <TableHead>Version</TableHead>
                          <TableHead>User</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Action Trigger</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Timestamp</TableHead>
                          <TableHead>Source</TableHead>
                          <TableHead>IP Address</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {consentAuditTrail.map((record) => (
                          <TableRow key={record.id}>
                            <TableCell className="font-mono text-xs">{record.policyId}</TableCell>
                            <TableCell>v{record.policyVersion}</TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">{record.userName}</p>
                                <p className="text-xs text-muted-foreground">{record.userId}</p>
                              </div>
                            </TableCell>
                            <TableCell>{record.userRole}</TableCell>
                            <TableCell>{record.actionTrigger}</TableCell>
                            <TableCell>
                              <StatusBadge variant={record.consentStatus === "Accepted" ? "success" : "error"}>
                                {record.consentStatus}
                              </StatusBadge>
                            </TableCell>
                            <TableCell className="text-sm">{record.timestamp}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{record.source}</Badge>
                            </TableCell>
                            <TableCell className="font-mono text-xs text-muted-foreground">
                              {record.ipAddress}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                    <p>Showing 4 of 1,245 records</p>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" disabled>
                        Previous
                      </Button>
                      <Button variant="outline" size="sm">
                        Next
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="rounded-lg bg-muted/50 border p-4">
                <div className="flex items-start gap-2">
                  <Shield className="h-5 w-5 text-primary mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium">Audit Trail Integrity</p>
                    <ul className="mt-1 text-muted-foreground list-disc list-inside space-y-1">
                      <li>All consent records are immutable and cannot be modified or deleted</li>
                      <li>Records are stored per policy version for complete traceability</li>
                      <li>Available for compliance reporting and audit inquiries</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </TooltipProvider>
  )
}
