"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { StatusBadge } from "@/components/status-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Search,
  Download,
  History,
  FileText,
  Shield,
  Eye,
  Clock,
  User,
  ChevronDown,
  ChevronRight,
  GitCompare,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Play,
  FileCheck,
  Lock,
  Database,
  Filter,
  Info,
} from "lucide-react"

// Configuration Versions Data
const configVersions = [
  {
    id: "VER_001",
    objectType: "SOP_RULE",
    objectId: "SOP_001",
    version: "2.0",
    status: "Active",
    effectiveFrom: "2026-01-01",
    effectiveTo: null,
    createdBy: "admin_user",
    createdOn: "2025-12-28 14:30:00",
    changeSummary: "Added budget variance condition",
  },
  {
    id: "VER_002",
    objectType: "SOP_RULE",
    objectId: "SOP_001",
    version: "1.0",
    status: "Retired",
    effectiveFrom: "2025-06-01",
    effectiveTo: "2025-12-31",
    createdBy: "admin_user",
    createdOn: "2025-05-15 10:00:00",
    changeSummary: "Initial rule creation",
  },
  {
    id: "VER_003",
    objectType: "COMPLIANCE_SETTING",
    objectId: "COMP_GST",
    version: "1.1",
    status: "Active",
    effectiveFrom: "2026-01-10",
    effectiveTo: null,
    createdBy: "compliance_admin",
    createdOn: "2026-01-08 09:15:00",
    changeSummary: "Enabled PO Creation stage enforcement",
  },
  {
    id: "VER_004",
    objectType: "POLICY",
    objectId: "POL_NDA",
    version: "3.0",
    status: "Active",
    effectiveFrom: "2026-01-01",
    effectiveTo: null,
    createdBy: "legal_admin",
    createdOn: "2025-12-20 16:45:00",
    changeSummary: "Updated NDA terms for GDPR compliance",
  },
  {
    id: "VER_005",
    objectType: "CALENDAR",
    objectId: "CAL_IN_MUM",
    version: "2.0",
    status: "Active",
    effectiveFrom: "2026-01-01",
    effectiveTo: null,
    createdBy: "hr_admin",
    createdOn: "2025-12-15 11:30:00",
    changeSummary: "Added 2026 public holidays",
  },
  {
    id: "VER_006",
    objectType: "ENTITY",
    objectId: "ENT_APAC",
    version: "1.2",
    status: "Active",
    effectiveFrom: "2025-11-01",
    effectiveTo: null,
    createdBy: "admin_user",
    createdOn: "2025-10-28 14:00:00",
    changeSummary: "Updated tax registration number",
  },
]

// Change Audit Logs
const changeAuditLogs = [
  {
    auditId: "AUD_001",
    objectType: "SOP_RULE",
    objectId: "SOP_001",
    fieldName: "conditions",
    oldValue: "amount > 50000",
    newValue: "amount > 50000 AND budget_variance > 10%",
    actionType: "Update",
    userId: "admin_user",
    userRole: "System Admin",
    timestamp: "2025-12-28 14:30:00",
    source: "UI",
  },
  {
    auditId: "AUD_002",
    objectType: "COMPLIANCE_SETTING",
    objectId: "COMP_GST",
    fieldName: "po_creation_enabled",
    oldValue: "false",
    newValue: "true",
    actionType: "Update",
    userId: "compliance_admin",
    userRole: "Compliance Admin",
    timestamp: "2026-01-08 09:15:00",
    source: "UI",
  },
  {
    auditId: "AUD_003",
    objectType: "POLICY",
    objectId: "POL_NDA",
    fieldName: "status",
    oldValue: "Draft",
    newValue: "Active",
    actionType: "Activate",
    userId: "legal_admin",
    userRole: "Legal Admin",
    timestamp: "2025-12-20 16:45:00",
    source: "UI",
  },
  {
    auditId: "AUD_004",
    objectType: "CALENDAR",
    objectId: "CAL_IN_MUM",
    fieldName: "holidays",
    oldValue: "[2025 holidays list]",
    newValue: "[2026 holidays list]",
    actionType: "Update",
    userId: "hr_admin",
    userRole: "HR Admin",
    timestamp: "2025-12-15 11:30:00",
    source: "API",
  },
  {
    auditId: "AUD_005",
    objectType: "SOP_RULE",
    objectId: "SOP_002",
    fieldName: "status",
    oldValue: "Active",
    newValue: "Retired",
    actionType: "Retire",
    userId: "admin_user",
    userRole: "System Admin",
    timestamp: "2026-01-10 08:00:00",
    source: "UI",
  },
]

// Execution Logs
const executionLogs = [
  {
    executionId: "EXEC_001",
    ruleId: "SOP_001",
    ruleType: "SOP",
    workflowId: "WF_RFQ_APPROVAL",
    stageName: "Manager Approval",
    transactionId: "RFQ-2026-001234",
    decisionTaken: "Route to CFO",
    executionResult: "Workflow",
    timestamp: "2026-01-16 10:32:15",
    executionDuration: "45ms",
  },
  {
    executionId: "EXEC_002",
    ruleId: "COMP_GST",
    ruleType: "Compliance",
    workflowId: "WF_VENDOR_ONBOARD",
    stageName: "Document Verification",
    transactionId: "VEND-2026-000892",
    decisionTaken: "GST validation required",
    executionResult: "Block",
    timestamp: "2026-01-16 09:45:22",
    executionDuration: "120ms",
  },
  {
    executionId: "EXEC_003",
    ruleId: "SOP_003",
    ruleType: "SOP",
    workflowId: "WF_PO_CREATION",
    stageName: "Budget Check",
    transactionId: "PO-2026-005678",
    decisionTaken: "Within budget",
    executionResult: "Pass",
    timestamp: "2026-01-16 08:15:00",
    executionDuration: "32ms",
  },
  {
    executionId: "EXEC_004",
    ruleId: "SOP_001",
    ruleType: "SOP",
    workflowId: "WF_RFQ_APPROVAL",
    stageName: "Manager Approval",
    transactionId: "RFQ-2026-001235",
    decisionTaken: "Auto-approved",
    executionResult: "Pass",
    timestamp: "2026-01-15 16:20:45",
    executionDuration: "28ms",
  },
  {
    executionId: "EXEC_005",
    ruleId: "COMP_SANCTION",
    ruleType: "Compliance",
    workflowId: "WF_VENDOR_INVITE",
    stageName: "Vendor Eligibility",
    transactionId: "RFQ-2026-001236",
    decisionTaken: "Sanctions check failed",
    executionResult: "Block",
    timestamp: "2026-01-15 14:10:30",
    executionDuration: "250ms",
  },
]

// Consent Logs
const consentLogs = [
  {
    id: "CON_001",
    policyId: "POL_NDA",
    policyVersion: "3.0",
    userId: "supplier_user_001",
    userRole: "Supplier",
    triggerAction: "Bid Submit",
    consentDecision: "Accepted",
    timestamp: "2026-01-16 11:45:00",
    channel: "Supplier Portal",
    ipAddress: "192.168.1.100",
  },
  {
    id: "CON_002",
    policyId: "POL_TERMS",
    policyVersion: "2.1",
    userId: "supplier_user_002",
    userRole: "Supplier",
    triggerAction: "PO Accept",
    consentDecision: "Accepted",
    timestamp: "2026-01-16 10:30:15",
    channel: "Supplier Portal",
    ipAddress: "10.0.0.55",
  },
  {
    id: "CON_003",
    policyId: "POL_NDA",
    policyVersion: "3.0",
    userId: "internal_user_005",
    userRole: "Buyer",
    triggerAction: "RFQ Create",
    consentDecision: "Accepted",
    timestamp: "2026-01-15 14:22:00",
    channel: "Internal UI",
    ipAddress: "172.16.0.25",
  },
  {
    id: "CON_004",
    policyId: "POL_PRIVACY",
    policyVersion: "1.5",
    userId: "supplier_user_003",
    userRole: "Supplier",
    triggerAction: "Registration",
    consentDecision: "Declined",
    timestamp: "2026-01-15 09:15:30",
    channel: "Supplier Portal",
    ipAddress: "203.45.67.89",
  },
]

// Override Logs
const overrideLogs = [
  {
    id: "OVR_001",
    ruleId: "SOP_001",
    ruleName: "High Value Approval",
    overrideReason: "Urgent procurement for production line breakdown",
    requestedBy: "procurement_manager",
    approvedBy: "cfo_user",
    approvalTimestamp: "2026-01-14 16:30:00",
    validityPeriod: "Single Transaction",
    transactionId: "PO-2026-005500",
  },
  {
    id: "OVR_002",
    ruleId: "COMP_MIN_VENDORS",
    ruleName: "Minimum 3 Vendors",
    overrideReason: "Sole source vendor for proprietary equipment",
    requestedBy: "buyer_user",
    approvedBy: "procurement_head",
    approvalTimestamp: "2026-01-10 11:00:00",
    validityPeriod: "Until 2026-03-31",
    transactionId: "RFQ-2026-001100",
  },
]

const objectTypeColors: Record<string, "success" | "info" | "warning" | "error"> = {
  SOP_RULE: "info",
  COMPLIANCE_SETTING: "warning",
  POLICY: "success",
  CALENDAR: "info",
  ENTITY: "success",
  LOCATION: "info",
  COMPANY: "success",
}

const statusColors: Record<string, "success" | "info" | "warning" | "error"> = {
  Active: "success",
  Draft: "warning",
  Retired: "error",
}

const actionColors: Record<string, "success" | "info" | "warning" | "error"> = {
  Create: "success",
  Update: "info",
  Activate: "success",
  Deactivate: "warning",
  Retire: "error",
}

const resultColors: Record<string, "success" | "info" | "warning" | "error"> = {
  Pass: "success",
  Block: "error",
  Workflow: "info",
}

const consentColors: Record<string, "success" | "error"> = {
  Accepted: "success",
  Declined: "error",
}

export default function AuditContent() {
  const [activeTab, setActiveTab] = useState("versions")
  const [searchValue, setSearchValue] = useState("")
  const [filterObjectType, setFilterObjectType] = useState("all")
  const [filterDateRange, setFilterDateRange] = useState("all")
  const [guardrailsOpen, setGuardrailsOpen] = useState(false)
  const [selectedVersion, setSelectedVersion] = useState<(typeof configVersions)[0] | null>(null)
  const [compareDialogOpen, setCompareDialogOpen] = useState(false)

  const guardrails = [
    {
      icon: Lock,
      title: "Audit logs cannot be modified or deleted",
      description: "All audit records are immutable once created",
    },
    {
      icon: GitCompare,
      title: "Version rollback creates a new version",
      description: "Restoring old configurations creates v(n+1), never overwrites",
    },
    {
      icon: Clock,
      title: "Timestamps must be system-generated",
      description: "No manual timestamp entry allowed",
    },
    {
      icon: Database,
      title: "Audit data survives tenant suspension",
      description: "Logs are retained even if tenant is deactivated",
    },
    {
      icon: Shield,
      title: "All governance modules must emit audit events",
      description: "No silent changes allowed in any module",
    },
    {
      icon: FileCheck,
      title: "Versions explain what should happen",
      description: "Audit logs prove what actually happened",
    },
  ]

  return (
    <div className="flex flex-col">
      <Header
        title="Audit & Version Management"
        description="Immutable audit trail and version history for all governance configurations."
      />

      <div className="p-6">
        {/* Info Banner */}
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-info/30 bg-info/5 p-4">
          <Info className="mt-0.5 h-5 w-5 text-info" />
          <div>
            <p className="font-medium text-foreground">Read-Only Audit Module</p>
            <p className="text-sm text-muted-foreground">
              This module provides immutable audit records and version history. Data cannot be modified or deleted.
              Auditors have read-only access with full export capabilities.
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="mb-6 grid gap-4 md:grid-cols-5">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <History className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Config Versions</p>
                  <p className="text-2xl font-bold">{configVersions.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10">
                  <FileText className="h-5 w-5 text-info" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Change Logs</p>
                  <p className="text-2xl font-bold">{changeAuditLogs.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                  <Play className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Executions</p>
                  <p className="text-2xl font-bold">{executionLogs.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                  <CheckCircle2 className="h-5 w-5 text-warning-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Consents</p>
                  <p className="text-2xl font-bold">{consentLogs.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-error/10">
                  <AlertTriangle className="h-5 w-5 text-error" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Overrides</p>
                  <p className="text-2xl font-bold">{overrideLogs.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Guardrails */}
        <Collapsible open={guardrailsOpen} onOpenChange={setGuardrailsOpen} className="mb-6">
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base">Audit Guardrails (Non-Negotiable)</CardTitle>
                  </div>
                  {guardrailsOpen ? (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0">
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {guardrails.map((rule, index) => (
                    <div key={index} className="flex items-start gap-3 rounded-lg border bg-muted/30 p-3">
                      <rule.icon className="mt-0.5 h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium">{rule.title}</p>
                        <p className="text-xs text-muted-foreground">{rule.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 grid w-full grid-cols-6">
            <TabsTrigger value="versions">Config Versions</TabsTrigger>
            <TabsTrigger value="changes">Change Audit</TabsTrigger>
            <TabsTrigger value="execution">Execution Logs</TabsTrigger>
            <TabsTrigger value="consent">Consent Logs</TabsTrigger>
            <TabsTrigger value="overrides">Overrides</TabsTrigger>
            <TabsTrigger value="export">Reports & Export</TabsTrigger>
          </TabsList>

          {/* Configuration Versions Tab */}
          <TabsContent value="versions">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Configuration Versioning</CardTitle>
                    <CardDescription>
                      Version history for all governance objects. Only one Active version per object.
                    </CardDescription>
                  </div>
                  <Button variant="outline" onClick={() => setCompareDialogOpen(true)}>
                    <GitCompare className="mr-2 h-4 w-4" />
                    Compare Versions
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="mb-4 flex flex-wrap items-center gap-4">
                  <div className="flex-1">
                    <div className="relative max-w-sm">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search by Object ID..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <Select value={filterObjectType} onValueChange={setFilterObjectType}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Object Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="SOP_RULE">SOP Rules</SelectItem>
                      <SelectItem value="COMPLIANCE_SETTING">Compliance</SelectItem>
                      <SelectItem value="POLICY">Policies</SelectItem>
                      <SelectItem value="CALENDAR">Calendars</SelectItem>
                      <SelectItem value="ENTITY">Entities</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Versions Table */}
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Object Type</TableHead>
                        <TableHead>Object ID</TableHead>
                        <TableHead>Version</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Effective From</TableHead>
                        <TableHead>Effective To</TableHead>
                        <TableHead>Created By</TableHead>
                        <TableHead>Change Summary</TableHead>
                        <TableHead className="w-[80px]">View</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {configVersions.map((version) => (
                        <TableRow key={version.id}>
                          <TableCell>
                            <StatusBadge variant={objectTypeColors[version.objectType] || "info"}>
                              {version.objectType.replace("_", " ")}
                            </StatusBadge>
                          </TableCell>
                          <TableCell className="font-mono text-sm">{version.objectId}</TableCell>
                          <TableCell className="font-medium">v{version.version}</TableCell>
                          <TableCell>
                            <StatusBadge variant={statusColors[version.status]}>{version.status}</StatusBadge>
                          </TableCell>
                          <TableCell className="text-sm">{version.effectiveFrom}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{version.effectiveTo || "—"}</TableCell>
                          <TableCell className="text-sm">{version.createdBy}</TableCell>
                          <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">
                            {version.changeSummary}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => setSelectedVersion(version)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Example JSON */}
                <div className="mt-6">
                  <p className="mb-2 text-sm font-medium">Example Version Record (JSON)</p>
                  <pre className="rounded-lg bg-muted p-4 text-xs overflow-x-auto">
                    {JSON.stringify(
                      {
                        object_type: "SOP_RULE",
                        object_id: "SOP_001",
                        version: "2.0",
                        status: "ACTIVE",
                        effective_from: "2026-01-01",
                        created_by: "admin_user",
                        change_summary: "Added budget variance condition",
                      },
                      null,
                      2,
                    )}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Change Audit Log Tab */}
          <TabsContent value="changes">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Change Audit Log</CardTitle>
                    <CardDescription>
                      Field-level granularity for all configuration changes. Logs cannot be edited or deleted.
                    </CardDescription>
                  </div>
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export Logs
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="mb-4 flex flex-wrap items-center gap-4">
                  <div className="flex-1">
                    <div className="relative max-w-sm">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input placeholder="Search audit logs..." className="pl-9" />
                    </div>
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Action Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Actions</SelectItem>
                      <SelectItem value="Create">Create</SelectItem>
                      <SelectItem value="Update">Update</SelectItem>
                      <SelectItem value="Activate">Activate</SelectItem>
                      <SelectItem value="Deactivate">Deactivate</SelectItem>
                      <SelectItem value="Retire">Retire</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sources</SelectItem>
                      <SelectItem value="UI">UI</SelectItem>
                      <SelectItem value="API">API</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Change Logs Table */}
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Audit ID</TableHead>
                        <TableHead>Object</TableHead>
                        <TableHead>Field</TableHead>
                        <TableHead>Old Value</TableHead>
                        <TableHead>New Value</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Source</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {changeAuditLogs.map((log) => (
                        <TableRow key={log.auditId}>
                          <TableCell className="font-mono text-xs">{log.auditId}</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="text-xs text-muted-foreground">{log.objectType}</span>
                              <span className="font-mono text-sm">{log.objectId}</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-sm">{log.fieldName}</TableCell>
                          <TableCell className="max-w-[120px] truncate text-sm text-muted-foreground">
                            {log.oldValue}
                          </TableCell>
                          <TableCell className="max-w-[120px] truncate text-sm">{log.newValue}</TableCell>
                          <TableCell>
                            <StatusBadge variant={actionColors[log.actionType]}>{log.actionType}</StatusBadge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                                <User className="h-3 w-3 text-primary" />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm">{log.userId}</span>
                                <span className="text-xs text-muted-foreground">{log.userRole}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">{log.timestamp}</TableCell>
                          <TableCell>
                            <span
                              className={`rounded px-2 py-0.5 text-xs ${log.source === "UI" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}
                            >
                              {log.source}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Execution & Enforcement Logs Tab */}
          <TabsContent value="execution">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Execution & Enforcement Logs</CardTitle>
                    <CardDescription>
                      Runtime logs for SOP rule execution, compliance checks, and workflow interjections.
                    </CardDescription>
                  </div>
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export Logs
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="mb-4 flex flex-wrap items-center gap-4">
                  <div className="flex-1">
                    <div className="relative max-w-sm">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input placeholder="Search by Transaction ID..." className="pl-9" />
                    </div>
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Rule Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="SOP">SOP</SelectItem>
                      <SelectItem value="Compliance">Compliance</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Result" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Results</SelectItem>
                      <SelectItem value="Pass">Pass</SelectItem>
                      <SelectItem value="Block">Block</SelectItem>
                      <SelectItem value="Workflow">Workflow</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Execution Logs Table */}
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Execution ID</TableHead>
                        <TableHead>Rule</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Workflow / Stage</TableHead>
                        <TableHead>Transaction ID</TableHead>
                        <TableHead>Decision</TableHead>
                        <TableHead>Result</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Timestamp</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {executionLogs.map((log) => (
                        <TableRow key={log.executionId}>
                          <TableCell className="font-mono text-xs">{log.executionId}</TableCell>
                          <TableCell className="font-mono text-sm">{log.ruleId}</TableCell>
                          <TableCell>
                            <StatusBadge variant={log.ruleType === "SOP" ? "info" : "warning"}>
                              {log.ruleType}
                            </StatusBadge>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="text-sm">{log.workflowId}</span>
                              <span className="text-xs text-muted-foreground">{log.stageName}</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-sm">{log.transactionId}</TableCell>
                          <TableCell className="max-w-[150px] truncate text-sm">{log.decisionTaken}</TableCell>
                          <TableCell>
                            <StatusBadge variant={resultColors[log.executionResult]}>{log.executionResult}</StatusBadge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">{log.executionDuration}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">{log.timestamp}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Consent & Acknowledgement Logs Tab */}
          <TabsContent value="consent">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Consent & Acknowledgement Logs</CardTitle>
                    <CardDescription>
                      Immutable consent records stored per policy version. Linked to transactions where applicable.
                    </CardDescription>
                  </div>
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export Logs
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="mb-4 flex flex-wrap items-center gap-4">
                  <div className="flex-1">
                    <div className="relative max-w-sm">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input placeholder="Search by User ID..." className="pl-9" />
                    </div>
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Policy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Policies</SelectItem>
                      <SelectItem value="POL_NDA">NDA</SelectItem>
                      <SelectItem value="POL_TERMS">Terms</SelectItem>
                      <SelectItem value="POL_PRIVACY">Privacy</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Decision" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Decisions</SelectItem>
                      <SelectItem value="Accepted">Accepted</SelectItem>
                      <SelectItem value="Declined">Declined</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Consent Logs Table */}
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Policy</TableHead>
                        <TableHead>Version</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Trigger Action</TableHead>
                        <TableHead>Decision</TableHead>
                        <TableHead>Channel</TableHead>
                        <TableHead>IP Address</TableHead>
                        <TableHead>Timestamp</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {consentLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="font-mono text-sm">{log.policyId}</TableCell>
                          <TableCell className="font-medium">v{log.policyVersion}</TableCell>
                          <TableCell className="text-sm">{log.userId}</TableCell>
                          <TableCell>
                            <StatusBadge variant={log.userRole === "Supplier" ? "info" : "success"}>
                              {log.userRole}
                            </StatusBadge>
                          </TableCell>
                          <TableCell className="text-sm">{log.triggerAction}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1.5">
                              {log.consentDecision === "Accepted" ? (
                                <CheckCircle2 className="h-4 w-4 text-success" />
                              ) : (
                                <XCircle className="h-4 w-4 text-error" />
                              )}
                              <StatusBadge variant={consentColors[log.consentDecision]}>
                                {log.consentDecision}
                              </StatusBadge>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">{log.channel}</TableCell>
                          <TableCell className="font-mono text-xs text-muted-foreground">{log.ipAddress}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">{log.timestamp}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Override & Exception Logs Tab */}
          <TabsContent value="overrides">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Override & Exception Logs</CardTitle>
                    <CardDescription>All overrides are audited. No silent bypass allowed.</CardDescription>
                  </div>
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export Logs
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {overrideLogs.length > 0 ? (
                  <div className="space-y-4">
                    {overrideLogs.map((log) => (
                      <div key={log.id} className="rounded-lg border bg-warning/5 p-4">
                        <div className="mb-3 flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/20">
                              <AlertTriangle className="h-5 w-5 text-warning-foreground" />
                            </div>
                            <div>
                              <p className="font-medium">{log.ruleName}</p>
                              <p className="font-mono text-xs text-muted-foreground">{log.ruleId}</p>
                            </div>
                          </div>
                          <StatusBadge variant="warning">Override</StatusBadge>
                        </div>

                        <div className="mb-3 rounded-lg bg-background p-3">
                          <p className="text-sm font-medium text-muted-foreground">Override Reason</p>
                          <p className="text-sm">{log.overrideReason}</p>
                        </div>

                        <div className="grid gap-4 md:grid-cols-4">
                          <div>
                            <p className="text-xs text-muted-foreground">Requested By</p>
                            <p className="text-sm font-medium">{log.requestedBy}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Approved By</p>
                            <p className="text-sm font-medium">{log.approvedBy}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Approval Timestamp</p>
                            <p className="text-sm">{log.approvalTimestamp}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Validity Period</p>
                            <p className="text-sm">{log.validityPeriod}</p>
                          </div>
                        </div>

                        {log.transactionId && (
                          <div className="mt-3 flex items-center gap-2 text-sm">
                            <span className="text-muted-foreground">Transaction:</span>
                            <span className="font-mono">{log.transactionId}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <CheckCircle2 className="mb-3 h-12 w-12 text-success" />
                    <p className="font-medium">No Overrides Recorded</p>
                    <p className="text-sm text-muted-foreground">
                      All transactions have followed standard governance rules.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports & Export Tab */}
          <TabsContent value="export">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Standard Reports */}
              <Card>
                <CardHeader>
                  <CardTitle>Standard Reports</CardTitle>
                  <CardDescription>Pre-configured audit-ready reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      {
                        name: "Configuration Change History",
                        icon: History,
                        description: "All config changes with timestamps",
                      },
                      {
                        name: "SOP Execution History",
                        icon: Play,
                        description: "Rule execution results and decisions",
                      },
                      { name: "Compliance Violations", icon: XCircle, description: "Blocked transactions and reasons" },
                      { name: "Consent Completion Status", icon: CheckCircle2, description: "Consent rates by policy" },
                      { name: "Overrides & Exceptions", icon: AlertTriangle, description: "All approved overrides" },
                    ].map((report, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                            <report.icon className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{report.name}</p>
                            <p className="text-xs text-muted-foreground">{report.description}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <FileText className="mr-1.5 h-3 w-3" />
                            PDF
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="mr-1.5 h-3 w-3" />
                            CSV
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Custom Export */}
              <Card>
                <CardHeader>
                  <CardTitle>Custom Export</CardTitle>
                  <CardDescription>Build a custom export with filters</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Date Range</Label>
                        <Select defaultValue="30days">
                          <SelectTrigger>
                            <SelectValue placeholder="Select range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="7days">Last 7 Days</SelectItem>
                            <SelectItem value="30days">Last 30 Days</SelectItem>
                            <SelectItem value="90days">Last 90 Days</SelectItem>
                            <SelectItem value="custom">Custom Range</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Object Type</Label>
                        <Select defaultValue="all">
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="SOP_RULE">SOP Rules</SelectItem>
                            <SelectItem value="COMPLIANCE">Compliance</SelectItem>
                            <SelectItem value="POLICY">Policies</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Log Type</Label>
                        <Select defaultValue="all">
                          <SelectTrigger>
                            <SelectValue placeholder="Select log type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Logs</SelectItem>
                            <SelectItem value="changes">Change Audit</SelectItem>
                            <SelectItem value="execution">Execution Logs</SelectItem>
                            <SelectItem value="consent">Consent Logs</SelectItem>
                            <SelectItem value="overrides">Overrides</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Export Format</Label>
                        <Select defaultValue="csv">
                          <SelectTrigger>
                            <SelectValue placeholder="Select format" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pdf">PDF (Audit-Ready)</SelectItem>
                            <SelectItem value="csv">CSV</SelectItem>
                            <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Generate Export
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Auditor Quick Access */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-primary" />
                    <CardTitle>Auditor View</CardTitle>
                  </div>
                  <CardDescription>Read-only access with immutable data and full export capabilities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-lg border bg-muted/30 p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <History className="h-4 w-4 text-primary" />
                        <p className="font-medium">Timeline View</p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Chronological view of all changes per object with drill-down capability.
                      </p>
                    </div>
                    <div className="rounded-lg border bg-muted/30 p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <GitCompare className="h-4 w-4 text-primary" />
                        <p className="font-medium">Version Comparison</p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Side-by-side comparison of any two versions of the same object.
                      </p>
                    </div>
                    <div className="rounded-lg border bg-muted/30 p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <Filter className="h-4 w-4 text-primary" />
                        <p className="font-medium">Advanced Filters</p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Filter by object, user, date, action type for targeted audits.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Version Detail Dialog */}
        <Dialog open={!!selectedVersion} onOpenChange={() => setSelectedVersion(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Version Details</DialogTitle>
            </DialogHeader>
            {selectedVersion && (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Object Type</p>
                    <StatusBadge variant={objectTypeColors[selectedVersion.objectType] || "info"}>
                      {selectedVersion.objectType.replace("_", " ")}
                    </StatusBadge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Object ID</p>
                    <p className="font-mono font-medium">{selectedVersion.objectId}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Version</p>
                    <p className="font-medium">v{selectedVersion.version}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Status</p>
                    <StatusBadge variant={statusColors[selectedVersion.status]}>{selectedVersion.status}</StatusBadge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Effective From</p>
                    <p className="font-medium">{selectedVersion.effectiveFrom}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Effective To</p>
                    <p className="font-medium">{selectedVersion.effectiveTo || "—"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Created By</p>
                    <p className="font-medium">{selectedVersion.createdBy}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Created On</p>
                    <p className="font-medium">{selectedVersion.createdOn}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Change Summary</p>
                  <p className="rounded-lg bg-muted p-3 text-sm">{selectedVersion.changeSummary}</p>
                </div>
                <pre className="rounded-lg bg-muted p-4 text-xs overflow-x-auto">
                  {JSON.stringify(
                    {
                      object_type: selectedVersion.objectType,
                      object_id: selectedVersion.objectId,
                      version: selectedVersion.version,
                      status: selectedVersion.status.toUpperCase(),
                      effective_from: selectedVersion.effectiveFrom,
                      effective_to: selectedVersion.effectiveTo,
                      created_by: selectedVersion.createdBy,
                      change_summary: selectedVersion.changeSummary,
                    },
                    null,
                    2,
                  )}
                </pre>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Compare Versions Dialog */}
        <Dialog open={compareDialogOpen} onOpenChange={setCompareDialogOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Compare Versions</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Version A (Older)</Label>
                  <Select defaultValue="SOP_001_v1">
                    <SelectTrigger>
                      <SelectValue placeholder="Select version" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SOP_001_v1">SOP_001 v1.0 (Retired)</SelectItem>
                      <SelectItem value="POL_NDA_v2">POL_NDA v2.0 (Retired)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Version B (Newer)</Label>
                  <Select defaultValue="SOP_001_v2">
                    <SelectTrigger>
                      <SelectValue placeholder="Select version" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SOP_001_v2">SOP_001 v2.0 (Active)</SelectItem>
                      <SelectItem value="POL_NDA_v3">POL_NDA v3.0 (Active)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Comparison View */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="font-medium">SOP_001 v1.0</p>
                    <StatusBadge variant="error">Retired</StatusBadge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="rounded bg-error/10 p-2">
                      <p className="text-xs text-muted-foreground">conditions</p>
                      <p className="font-mono">amount {">"} 50000</p>
                    </div>
                    <div className="rounded bg-muted p-2">
                      <p className="text-xs text-muted-foreground">effective_from</p>
                      <p>2025-06-01</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="font-medium">SOP_001 v2.0</p>
                    <StatusBadge variant="success">Active</StatusBadge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="rounded bg-success/10 p-2">
                      <p className="text-xs text-muted-foreground">conditions</p>
                      <p className="font-mono">
                        amount {">"} 50000 AND budget_variance {">"} 10%
                      </p>
                    </div>
                    <div className="rounded bg-muted p-2">
                      <p className="text-xs text-muted-foreground">effective_from</p>
                      <p>2026-01-01</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export Comparison
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
