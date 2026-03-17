"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  ShieldCheck,
  Info,
  ChevronDown,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Search,
  Download,
  RefreshCw,
  Shield,
  Ban,
  FileWarning,
  Building,
  CreditCard,
  FileText,
  Globe,
  UserX,
  Landmark,
} from "lucide-react"

// Enforcement stages
const ENFORCEMENT_STAGES = [
  { id: "INVITE", label: "Vendor Invite" },
  { id: "RESPONSE", label: "Vendor Response" },
  { id: "SELECTION", label: "Vendor Selection" },
  { id: "PO", label: "PO Creation" },
]

// Compliance checks data
const initialComplianceChecks = [
  {
    id: "VENDOR_ACTIVE",
    name: "Vendor Active Status Check",
    description: "Ensures vendor code/status is Active. Blocks suspended, blocked, or archived vendors.",
    category: "Vendor Eligibility",
    icon: Building,
    enabled: true,
    applicableStages: ["INVITE", "SELECTION", "PO"],
    selectedStages: ["INVITE", "SELECTION", "PO"],
  },
  {
    id: "VENDOR_APPROVED",
    name: "Vendor Approved Status Check",
    description: "Ensures vendor onboarding is completed and approved.",
    category: "Vendor Eligibility",
    icon: CheckCircle2,
    enabled: true,
    applicableStages: ["SELECTION", "PO"],
    selectedStages: ["SELECTION", "PO"],
  },
  {
    id: "BLACKLIST",
    name: "Blacklist Screening",
    description: "Checks vendor against internal/external blacklists.",
    category: "Regulatory & Sanctions",
    icon: Ban,
    enabled: true,
    applicableStages: ["INVITE", "SELECTION", "PO"],
    selectedStages: ["INVITE", "SELECTION", "PO"],
  },
  {
    id: "SANCTIONS",
    name: "Sanctions / Watchlist Check",
    description: "Screens vendor against global sanctions lists.",
    category: "Regulatory & Sanctions",
    icon: FileWarning,
    enabled: true,
    applicableStages: ["INVITE", "SELECTION", "PO"],
    selectedStages: ["INVITE", "SELECTION", "PO"],
  },
  {
    id: "PEP",
    name: "PEP (Politically Exposed Person) Check",
    description: "Screens vendor ownership/key personnel against PEP lists.",
    category: "Regulatory & Sanctions",
    icon: UserX,
    enabled: false,
    applicableStages: ["INVITE", "SELECTION"],
    selectedStages: [],
  },
  {
    id: "FATCA",
    name: "FATCA Compliance Check",
    description: "Validates FATCA applicability and declarations.",
    category: "Regulatory & Sanctions",
    icon: Landmark,
    enabled: true,
    applicableStages: ["SELECTION", "PO"],
    selectedStages: ["SELECTION", "PO"],
  },
  {
    id: "RESTRICTED_COUNTRY",
    name: "Restricted Country Check",
    description: "Ensures vendor country is not restricted/sanctioned.",
    category: "Regulatory & Sanctions",
    icon: Globe,
    enabled: true,
    applicableStages: ["INVITE", "SELECTION", "PO"],
    selectedStages: ["INVITE", "SELECTION", "PO"],
  },
  {
    id: "TAX_ID",
    name: "Vendor Tax ID Available",
    description: "Ensures mandatory tax ID exists and format is valid.",
    category: "Master Data Completeness",
    icon: FileText,
    enabled: true,
    applicableStages: ["SELECTION", "PO"],
    selectedStages: ["SELECTION", "PO"],
  },
  {
    id: "BANK_VERIFIED",
    name: "Vendor Bank Details Verified",
    description: "Ensures bank details exist and are verified.",
    category: "Master Data Completeness",
    icon: CreditCard,
    enabled: true,
    applicableStages: ["PO"],
    selectedStages: ["PO"],
  },
  {
    id: "DOCUMENTS",
    name: "Mandatory Vendor Documents Uploaded",
    description: "Ensures required compliance documents are uploaded and valid.",
    category: "Master Data Completeness",
    icon: FileText,
    enabled: true,
    applicableStages: ["SELECTION", "PO"],
    selectedStages: ["SELECTION", "PO"],
  },
]

// Sample audit data
const auditData = [
  {
    id: "AUD001",
    checkName: "Blacklist Screening",
    stage: "Vendor Invite",
    result: "PASS",
    vendorId: "V-1001",
    transactionId: "RFQ-2024-0892",
    timestamp: "2024-01-15 09:23:45",
    reason: null,
  },
  {
    id: "AUD002",
    checkName: "Vendor Active Status",
    stage: "PO Creation",
    result: "FAIL",
    vendorId: "V-1042",
    transactionId: "PO-2024-1234",
    timestamp: "2024-01-15 10:15:22",
    reason: "Vendor status is SUSPENDED",
  },
  {
    id: "AUD003",
    checkName: "Sanctions Check",
    stage: "Vendor Selection",
    result: "PASS",
    vendorId: "V-1015",
    transactionId: "RFQ-2024-0893",
    timestamp: "2024-01-15 11:05:33",
    reason: null,
  },
  {
    id: "AUD004",
    checkName: "Tax ID Available",
    stage: "Vendor Selection",
    result: "FAIL",
    vendorId: "V-1088",
    transactionId: "RFQ-2024-0894",
    timestamp: "2024-01-15 11:45:10",
    reason: "Tax ID not found",
  },
  {
    id: "AUD005",
    checkName: "Bank Details Verified",
    stage: "PO Creation",
    result: "PASS",
    vendorId: "V-1022",
    transactionId: "PO-2024-1235",
    timestamp: "2024-01-15 12:30:00",
    reason: null,
  },
]

// Guardrails data
const guardrails = [
  {
    rule: "Compliance checks cannot be conditional",
    description: "All checks are binary ON/OFF with no conditional logic",
  },
  { rule: "Compliance checks cannot be overridden", description: "No approval workflows or manual bypasses allowed" },
  {
    rule: "Compliance checks cannot be triggered via SOPs",
    description: "Compliance runs independently of SOP rule engine",
  },
  {
    rule: "Compliance checks always run before SOP rules",
    description: "Compliance gates execute first at each stage",
  },
  { rule: "Disabled checks are fully skipped", description: "No partial execution or logging for disabled checks" },
  { rule: "Failed checks block immediately", description: "No retry, escalation, or deferral options" },
]

export function ComplianceContent() {
  const [complianceChecks, setComplianceChecks] = useState(initialComplianceChecks)
  const [auditSearch, setAuditSearch] = useState("")
  const [guardrailsOpen, setGuardrailsOpen] = useState(true)

  const toggleCheck = (checkId: string) => {
    setComplianceChecks((prev) =>
      prev.map((check) =>
        check.id === checkId
          ? { ...check, enabled: !check.enabled, selectedStages: !check.enabled ? check.applicableStages : [] }
          : check,
      ),
    )
  }

  const toggleStage = (checkId: string, stageId: string) => {
    setComplianceChecks((prev) =>
      prev.map((check) => {
        if (check.id !== checkId || !check.enabled) return check
        const hasStage = check.selectedStages.includes(stageId)
        return {
          ...check,
          selectedStages: hasStage
            ? check.selectedStages.filter((s) => s !== stageId)
            : [...check.selectedStages, stageId],
        }
      }),
    )
  }

  const enabledCount = complianceChecks.filter((c) => c.enabled).length
  const categories = [...new Set(complianceChecks.map((c) => c.category))]

  // Generate JSON config
  const jsonConfig = {
    compliance_checks: complianceChecks.reduce(
      (acc, check) => {
        acc[check.id] = {
          enabled: check.enabled,
          stages: check.selectedStages,
        }
        return acc
      },
      {} as Record<string, { enabled: boolean; stages: string[] }>,
    ),
  }

  const filteredAudit = auditData.filter(
    (item) =>
      item.checkName.toLowerCase().includes(auditSearch.toLowerCase()) ||
      item.vendorId.toLowerCase().includes(auditSearch.toLowerCase()) ||
      item.transactionId.toLowerCase().includes(auditSearch.toLowerCase()),
  )

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Compliance & Control</h1>
          <p className="text-muted-foreground mt-1">
            Binary compliance gates for vendor eligibility, regulatory checks, and data completeness.
          </p>
        </div>

        {/* Info Banner */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="py-3 px-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-foreground">Binary Compliance Model</p>
                <p className="text-muted-foreground">
                  Compliance checks are simple ON/OFF switches with fixed enforcement stages. No conditional logic, no
                  overrides, no workflow routing. Compliance always runs before SOP rules at each stage.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="checks" className="space-y-4">
          <TabsList>
            <TabsTrigger value="checks">Compliance Checks</TabsTrigger>
            <TabsTrigger value="audit">Audit Trail</TabsTrigger>
            <TabsTrigger value="guardrails">Guardrails</TabsTrigger>
          </TabsList>

          {/* Compliance Checks Tab */}
          <TabsContent value="checks" className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <ShieldCheck className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{enabledCount}</p>
                      <p className="text-xs text-muted-foreground">Checks Enabled</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-muted">
                      <Shield className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{complianceChecks.length - enabledCount}</p>
                      <p className="text-xs text-muted-foreground">Checks Disabled</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/10">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{ENFORCEMENT_STAGES.length}</p>
                      <p className="text-xs text-muted-foreground">Enforcement Stages</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-orange-500/10">
                      <AlertTriangle className="h-5 w-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{categories.length}</p>
                      <p className="text-xs text-muted-foreground">Check Categories</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Compliance Checks by Category */}
            <div className="space-y-6">
              {categories.map((category) => (
                <Card key={category}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                      {category === "Vendor Eligibility" && <Building className="h-4 w-4 text-primary" />}
                      {category === "Regulatory & Sanctions" && <FileWarning className="h-4 w-4 text-orange-500" />}
                      {category === "Master Data Completeness" && <FileText className="h-4 w-4 text-emerald-500" />}
                      {category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[300px]">Compliance Check</TableHead>
                          <TableHead className="w-[100px] text-center">Enabled</TableHead>
                          {ENFORCEMENT_STAGES.map((stage) => (
                            <TableHead key={stage.id} className="text-center w-[120px]">
                              <Tooltip>
                                <TooltipTrigger className="cursor-help">{stage.label}</TooltipTrigger>
                                <TooltipContent>Enforce at {stage.label} stage</TooltipContent>
                              </Tooltip>
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {complianceChecks
                          .filter((check) => check.category === category)
                          .map((check) => (
                            <TableRow key={check.id}>
                              <TableCell>
                                <div className="flex items-start gap-3">
                                  <check.icon className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                                  <div>
                                    <p className="font-medium text-sm">{check.name}</p>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <p className="text-xs text-muted-foreground line-clamp-1 cursor-help">
                                          {check.description}
                                        </p>
                                      </TooltipTrigger>
                                      <TooltipContent side="bottom" className="max-w-xs">
                                        {check.description}
                                      </TooltipContent>
                                    </Tooltip>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="text-center">
                                <Switch checked={check.enabled} onCheckedChange={() => toggleCheck(check.id)} />
                              </TableCell>
                              {ENFORCEMENT_STAGES.map((stage) => {
                                const isApplicable = check.applicableStages.includes(stage.id)
                                const isSelected = check.selectedStages.includes(stage.id)
                                return (
                                  <TableCell key={stage.id} className="text-center">
                                    {isApplicable ? (
                                      <Checkbox
                                        checked={isSelected}
                                        disabled={!check.enabled}
                                        onCheckedChange={() => toggleStage(check.id, stage.id)}
                                        className="mx-auto"
                                      />
                                    ) : (
                                      <span className="text-muted-foreground/50">—</span>
                                    )}
                                  </TableCell>
                                )
                              })}
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Enforcement Behavior */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Enforcement Behavior (System-Defined)</CardTitle>
                <CardDescription>When an enabled compliance check fails at any stage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-destructive/5 border border-destructive/20">
                    <XCircle className="h-5 w-5 text-destructive mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Block Immediately</p>
                      <p className="text-xs text-muted-foreground">Action is blocked, no progression allowed</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-orange-500/5 border border-orange-500/20">
                    <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Display Clear Error</p>
                      <p className="text-xs text-muted-foreground">User sees specific failure reason</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted border">
                    <Ban className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">No Overrides</p>
                      <p className="text-xs text-muted-foreground">No approvals, escalations, or bypasses</p>
                    </div>
                  </div>
                </div>

                {/* Example Error Modal */}
                <div className="mt-4 p-4 rounded-lg border bg-muted/30">
                  <p className="text-xs text-muted-foreground mb-2">Example Error Display:</p>
                  <div className="p-3 rounded-md bg-destructive/10 border border-destructive/30">
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-destructive" />
                      <span className="text-sm font-medium text-destructive">Compliance Check Failed</span>
                    </div>
                    <p className="text-sm mt-1 text-foreground">
                      "Vendor failed Blacklist screening. Action cannot proceed."
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* JSON Configuration Preview */}
            <Collapsible>
              <Card>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">Configuration Preview (JSON)</CardTitle>
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <pre className="p-4 rounded-lg bg-muted text-xs overflow-auto max-h-[300px]">
                      {JSON.stringify(jsonConfig, null, 2)}
                    </pre>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          </TabsContent>

          {/* Audit Trail Tab */}
          <TabsContent value="audit" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Compliance Audit Log</CardTitle>
                    <CardDescription>Immutable, read-only record of all compliance check executions</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by check, vendor, transaction..."
                        className="pl-9 w-[300px]"
                        value={auditSearch}
                        onChange={(e) => setAuditSearch(e.target.value)}
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Check Name</TableHead>
                      <TableHead>Stage</TableHead>
                      <TableHead>Result</TableHead>
                      <TableHead>Vendor ID</TableHead>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Failure Reason</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAudit.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.checkName}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-normal">
                            {item.stage}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={item.result === "PASS" ? "default" : "destructive"}
                            className={item.result === "PASS" ? "bg-emerald-500 hover:bg-emerald-600" : ""}
                          >
                            {item.result}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{item.vendorId}</TableCell>
                        <TableCell className="font-mono text-sm">{item.transactionId}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">{item.timestamp}</TableCell>
                        <TableCell className="text-sm">
                          {item.reason ? (
                            <span className="text-destructive">{item.reason}</span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Audit Info */}
            <Card className="border-muted bg-muted/30">
              <CardContent className="py-3 px-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Info className="h-4 w-4" />
                  <span>
                    Audit records are immutable and cannot be modified or deleted. All compliance check executions are
                    automatically logged.
                  </span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Guardrails Tab */}
          <TabsContent value="guardrails" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">System Guardrails (Non-Negotiable)</CardTitle>
                <CardDescription>
                  These rules are enforced by the system and cannot be changed or bypassed.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {guardrails.map((item, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg border bg-muted/30">
                      <div className="p-1.5 rounded bg-primary/10">
                        <Shield className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{item.rule}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Compliance vs SOPs */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Compliance vs SOPs</CardTitle>
                <CardDescription>Understanding the difference</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg border bg-primary/5 border-primary/20">
                    <div className="flex items-center gap-2 mb-3">
                      <ShieldCheck className="h-5 w-5 text-primary" />
                      <span className="font-semibold">Compliance Checks</span>
                    </div>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                        Binary eligibility gates
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                        Always run first
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                        No conditional logic
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                        No overrides or approvals
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                        Block immediately on failure
                      </li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-lg border bg-muted/50">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <span className="font-semibold">SOP Rules</span>
                    </div>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-muted-foreground" />
                        Business logic and workflows
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-muted-foreground" />
                        Run after compliance passes
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-muted-foreground" />
                        Conditional rule evaluation
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-muted-foreground" />
                        Escalation and approval paths
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-muted-foreground" />
                        Flexible actions and routing
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Flow Diagram */}
                <div className="mt-4 p-4 rounded-lg bg-muted/30 border">
                  <p className="text-xs text-muted-foreground mb-3">Execution Order:</p>
                  <div className="flex items-center justify-center gap-2">
                    <div className="px-3 py-2 rounded bg-primary text-primary-foreground text-sm font-medium">
                      Compliance Checks
                    </div>
                    <div className="text-muted-foreground">→</div>
                    <div className="px-3 py-2 rounded border text-sm">Pass?</div>
                    <div className="text-muted-foreground">→</div>
                    <div className="px-3 py-2 rounded bg-muted text-sm font-medium">SOP Rules</div>
                    <div className="text-muted-foreground">→</div>
                    <div className="px-3 py-2 rounded bg-emerald-500 text-white text-sm font-medium">Action</div>
                  </div>
                  <p className="text-xs text-center text-muted-foreground mt-3">
                    If compliance fails, SOP rules are never executed.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Last Updated */}
            <div className="flex items-center justify-end gap-2 text-xs text-muted-foreground">
              <RefreshCw className="h-3 w-3" />
              <span>System guardrails are enforced at runtime and cannot be modified.</span>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  )
}
