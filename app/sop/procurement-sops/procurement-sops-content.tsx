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
import {
  Plus,
  ClipboardList,
  GitBranch,
  Play,
  AlertTriangle,
  CheckCircle2,
  Edit,
  Eye,
  Trash2,
  Zap,
  ArrowRight,
  Copy,
  Search,
  Filter,
  Download,
  Info,
  Workflow,
  Target,
  Pause,
  Ban,
  FileText,
  RefreshCw,
  Shield,
  AlertOctagon,
  Layers,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

const sourceWorkflows = [
  {
    id: "WF_RFQ_MAIN",
    name: "RFQ Main Workflow",
    stages: [
      { id: "RFQ_DRAFT", name: "RFQ Draft" },
      { id: "RFQ_PUBLISH", name: "RFQ Publish" },
      { id: "VENDOR_INVITATION", name: "Vendor Invitation" },
      { id: "QUOTE_COLLECTION", name: "Quote Collection" },
      { id: "RFQ_CLOSE", name: "RFQ Close" },
      { id: "VENDOR_SELECTION", name: "Vendor Selection" },
      { id: "NEGOTIATION", name: "Negotiation" },
      { id: "PO_CREATION", name: "PO Creation" },
    ],
  },
  {
    id: "WF_RFQ_NO_PR",
    name: "RFQ Without PR Workflow",
    stages: [
      { id: "RFQ_ENTRY", name: "RFQ Entry" },
      { id: "PR_CHECK", name: "PR Check" },
      { id: "BUDGET_VALIDATION", name: "Budget Validation" },
      { id: "RFQ_PUBLISH", name: "RFQ Publish" },
      { id: "VENDOR_SELECTION", name: "Vendor Selection" },
    ],
  },
  {
    id: "WF_VENDOR_ONBOARD",
    name: "Vendor Onboarding Workflow",
    stages: [
      { id: "REGISTRATION", name: "Registration" },
      { id: "DOCUMENT_UPLOAD", name: "Document Upload" },
      { id: "VERIFICATION", name: "Verification" },
      { id: "APPROVAL", name: "Approval" },
      { id: "ACTIVATION", name: "Activation" },
    ],
  },
]

const triggerTimings = [
  { value: "ON_ENTRY", label: "On Entry", description: "When workflow enters this stage" },
  { value: "ON_EXIT", label: "On Exit", description: "When workflow exits this stage" },
  { value: "PRE_COMPLETION", label: "Pre-Completion", description: "Before stage completion" },
]

const targetWorkflows = [
  { id: "WF_SINGLE_VENDOR_APPROVAL", name: "Single Vendor Approval" },
  { id: "WF_BUDGET_EXCEPTION", name: "Budget Exception Approval" },
  { id: "WF_PR_CREATION", name: "PR Creation Workflow" },
  { id: "WF_NEW_VENDOR_APPROVAL", name: "New Vendor Approval" },
  { id: "WF_HIGH_VALUE_APPROVAL", name: "High Value RFQ Approval" },
  { id: "WF_COMPLIANCE_CHECK", name: "Compliance Check Workflow" },
]

const returnBehaviors = [
  { value: "RESUME", label: "Resume Original", description: "Continue original workflow after target completes" },
  { value: "TERMINATE", label: "Terminate Original", description: "End original workflow, target takes over" },
  { value: "REPLACE", label: "Replace Workflow", description: "Replace original workflow with target" },
]

const sopRules = [
  {
    id: "SOP-001",
    name: "Single Vendor RFQ",
    category: "Vendor",
    sourceWorkflow: "WF_RFQ_MAIN",
    stage: "RFQ_CLOSE",
    timing: "ON_EXIT",
    condition: "VENDOR_COUNT = 1",
    action: "TRIGGER_WORKFLOW",
    targetWorkflow: "WF_SINGLE_VENDOR_APPROVAL",
    returnBehavior: "RESUME",
    priority: 1,
    status: "Active",
    effectiveDate: "2024-01-01",
    expiryDate: null,
  },
  {
    id: "SOP-002",
    name: "Budget Overrun",
    category: "Budget",
    sourceWorkflow: "WF_RFQ_MAIN",
    stage: "VENDOR_SELECTION",
    timing: "ON_ENTRY",
    condition: "QUOTE_VS_BUDGET_VARIANCE > 10%",
    action: "REQUIRE_JUSTIFICATION",
    targetWorkflow: "WF_BUDGET_EXCEPTION",
    returnBehavior: "RESUME",
    priority: 1,
    status: "Active",
    effectiveDate: "2024-01-01",
    expiryDate: null,
  },
  {
    id: "SOP-003",
    name: "RFQ Without PR",
    category: "Process",
    sourceWorkflow: "WF_RFQ_NO_PR",
    stage: "PR_CHECK",
    timing: "ON_EXIT",
    condition: "RFQ_HAS_PR = NO",
    action: "TRIGGER_WORKFLOW",
    targetWorkflow: "WF_PR_CREATION",
    returnBehavior: "RESUME",
    priority: 2,
    status: "Active",
    effectiveDate: "2024-01-01",
    expiryDate: null,
  },
  {
    id: "SOP-004",
    name: "New Vendor Selection",
    category: "Vendor",
    sourceWorkflow: "WF_RFQ_MAIN",
    stage: "VENDOR_SELECTION",
    timing: "PRE_COMPLETION",
    condition: "VENDOR_TYPE = NEW",
    action: "TRIGGER_WORKFLOW",
    targetWorkflow: "WF_NEW_VENDOR_APPROVAL",
    returnBehavior: "RESUME",
    priority: 2,
    status: "Active",
    effectiveDate: "2024-01-15",
    expiryDate: null,
  },
  {
    id: "SOP-005",
    name: "High Value RFQ",
    category: "Budget",
    sourceWorkflow: "WF_RFQ_MAIN",
    stage: "RFQ_PUBLISH",
    timing: "ON_ENTRY",
    condition: "RFQ_VALUE > 500000",
    action: "REQUIRE_JUSTIFICATION",
    targetWorkflow: "WF_HIGH_VALUE_APPROVAL",
    returnBehavior: "RESUME",
    priority: 1,
    status: "Active",
    effectiveDate: "2024-02-01",
    expiryDate: null,
  },
  {
    id: "SOP-006",
    name: "Low Response Rate",
    category: "Compliance",
    sourceWorkflow: "WF_RFQ_MAIN",
    stage: "RFQ_CLOSE",
    timing: "ON_EXIT",
    condition: "VENDORS_RESPONDED < 3",
    action: "ALLOW_WITH_WARNING",
    targetWorkflow: null,
    returnBehavior: null,
    priority: 3,
    status: "Inactive",
    effectiveDate: "2024-01-01",
    expiryDate: "2024-06-30",
  },
]

// Escalation Rules Data
const escalationRules = [
  {
    id: "ESC-001",
    ruleName: "Single Vendor RFQ",
    escalateAfterDays: 2,
    escalateOnReject: true,
    fallbackAction: "Re-open RFQ",
    fallbackWorkflow: null,
  },
  {
    id: "ESC-002",
    ruleName: "Budget Overrun",
    escalateAfterDays: 3,
    escalateOnReject: true,
    fallbackAction: "Terminate RFQ",
    fallbackWorkflow: null,
  },
  {
    id: "ESC-003",
    ruleName: "RFQ Without PR",
    escalateAfterDays: 1,
    escalateOnReject: false,
    fallbackAction: "Block PO Creation",
    fallbackWorkflow: "WF_BUDGET_APPROVAL",
  },
]

// Audit Trail Data
const auditTrail = [
  {
    id: "AUD-001",
    timestamp: "2024-01-15 10:30:22",
    ruleId: "SOP-001",
    rfqId: "RFQ-2024-0156",
    sourceWorkflow: "WF_RFQ_MAIN",
    stage: "RFQ_CLOSE",
    conditionValues: "VENDOR_COUNT = 1",
    actionTaken: "Trigger Workflow",
    targetWorkflow: "WF_SINGLE_VENDOR_APPROVAL",
    override: false,
    user: "System",
  },
  {
    id: "AUD-002",
    timestamp: "2024-01-15 11:45:10",
    ruleId: "SOP-002",
    rfqId: "RFQ-2024-0157",
    sourceWorkflow: "WF_RFQ_MAIN",
    stage: "VENDOR_SELECTION",
    conditionValues: "VARIANCE = 15%",
    actionTaken: "Require Justification",
    targetWorkflow: "WF_BUDGET_EXCEPTION",
    override: false,
    user: "System",
  },
  {
    id: "AUD-003",
    timestamp: "2024-01-15 14:20:05",
    ruleId: "SOP-003",
    rfqId: "RFQ-2024-0158",
    sourceWorkflow: "WF_RFQ_NO_PR",
    stage: "PR_CHECK",
    conditionValues: "RFQ_HAS_PR = NO",
    actionTaken: "Trigger Workflow",
    targetWorkflow: "WF_PR_CREATION",
    override: true,
    user: "admin@company.com",
  },
]

const conditionAttributes = [
  { value: "RFQ_HAS_PR", label: "RFQ has PR", type: "boolean" },
  { value: "VENDOR_COUNT", label: "Number of Vendors Responded", type: "number" },
  { value: "L1_QUOTE_VALUE", label: "L1 Quote Value", type: "number" },
  { value: "PR_BUDGET_VALUE", label: "PR Budget Value", type: "number" },
  { value: "QUOTE_VS_BUDGET_VARIANCE", label: "Quote vs Budget Variance (%)", type: "percentage" },
  { value: "VENDOR_TYPE", label: "Vendor Type", type: "enum", options: ["NEW", "EXISTING"] },
  { value: "RFQ_VALUE", label: "RFQ Value", type: "number" },
  { value: "CATEGORY", label: "Category", type: "text" },
  { value: "ENTITY", label: "Entity", type: "text" },
  { value: "LOCATION", label: "Location", type: "text" },
  { value: "VENDORS_RESPONDED", label: "Vendors Responded Count", type: "number" },
]

const operators = [
  { value: "=", label: "=" },
  { value: "!=", label: "≠" },
  { value: ">", label: ">" },
  { value: "<", label: "<" },
  { value: ">=", label: "≥" },
  { value: "<=", label: "≤" },
]

const systemActions = [
  { value: "TRIGGER_WORKFLOW", label: "Trigger Another Workflow", icon: Workflow },
  { value: "PAUSE_WORKFLOW", label: "Pause Current Workflow", icon: Pause },
  { value: "BLOCK_PROGRESSION", label: "Block Progression", icon: Ban },
  { value: "REQUIRE_JUSTIFICATION", label: "Require Justification", icon: FileText },
  { value: "ALLOW_WITH_WARNING", label: "Continue with Warning", icon: AlertTriangle },
  { value: "REDIRECT_PATH", label: "Redirect to Alternate Path", icon: RefreshCw },
]

const endStates = [
  { value: "CONTINUE_RFQ", label: "Continue RFQ" },
  { value: "CONVERT_TO_PO", label: "Convert RFQ to PO" },
  { value: "FORCE_PR_CREATION", label: "Force PR Creation" },
  { value: "REOPEN_RFQ", label: "Re-open RFQ" },
  { value: "TERMINATE_RFQ", label: "Terminate RFQ" },
]

type WorkflowTrigger = {
  id: number
  workflowId: string
  stageId: string
  timingOverride: string | null // null means inherit from rule-level timing
}

const conditionCatalog = [
  {
    key: "RFQ_HAS_PR",
    label: "RFQ has PR",
    dataType: "Boolean",
    dataSource: "RFQ Attributes",
    operators: ["=", "!="],
    applicableModules: ["RFQ", "PO"],
    nullHandling: "Treat as FALSE",
  },
  {
    key: "VENDOR_COUNT",
    label: "Number of Vendors Responded",
    dataType: "Number",
    dataSource: "RFQ Attributes",
    operators: ["=", "!=", ">", "<", ">=", "<="],
    applicableModules: ["RFQ"],
    nullHandling: "Treat as 0",
  },
  {
    key: "L1_QUOTE_VALUE",
    label: "L1 Quote Value",
    dataType: "Number",
    dataSource: "Financial Values",
    operators: ["=", "!=", ">", "<", ">=", "<="],
    applicableModules: ["RFQ"],
    nullHandling: "Block Evaluation",
  },
  {
    key: "PR_BUDGET_VALUE",
    label: "PR Budget Value",
    dataType: "Number",
    dataSource: "Financial Values",
    operators: ["=", "!=", ">", "<", ">=", "<="],
    applicableModules: ["RFQ", "PR"],
    nullHandling: "Treat as 0",
  },
  {
    key: "QUOTE_VS_BUDGET_VARIANCE",
    label: "Quote vs Budget Variance (%)",
    dataType: "Number",
    dataSource: "Calculated",
    operators: [">", "<", ">=", "<="],
    applicableModules: ["RFQ"],
    nullHandling: "Skip Condition",
  },
  {
    key: "VENDOR_TYPE",
    label: "Vendor Type",
    dataType: "Text",
    dataSource: "Vendor Attributes",
    operators: ["=", "!=", "IN", "NOT_IN"],
    applicableModules: ["RFQ", "Vendor"],
    nullHandling: "Block Evaluation",
  },
  {
    key: "RFQ_VALUE",
    label: "Total RFQ Value",
    dataType: "Number",
    dataSource: "RFQ Attributes",
    operators: ["=", "!=", ">", "<", ">=", "<="],
    applicableModules: ["RFQ"],
    nullHandling: "Treat as 0",
  },
  {
    key: "COMPLIANCE_FLAG",
    label: "Compliance Status",
    dataType: "Boolean",
    dataSource: "Compliance Flags",
    operators: ["=", "!="],
    applicableModules: ["RFQ", "Vendor", "PO"],
    nullHandling: "Treat as FALSE",
  },
  {
    key: "USER_ROLE",
    label: "Current User Role",
    dataType: "Text",
    dataSource: "User / Role",
    operators: ["=", "!=", "IN", "NOT_IN"],
    applicableModules: ["All"],
    nullHandling: "Block Evaluation",
  },
  {
    key: "IS_WEEKEND",
    label: "Is Weekend",
    dataType: "Boolean",
    dataSource: "Calendar / Time",
    operators: ["="],
    applicableModules: ["All"],
    nullHandling: "Treat as FALSE",
  },
  {
    key: "LICENSE_ACTIVE",
    label: "License Active",
    dataType: "Boolean",
    dataSource: "License / Entitlement",
    operators: ["="],
    applicableModules: ["All"],
    nullHandling: "Treat as FALSE",
  },
]

const guardrailRules = [
  {
    id: "GR-001",
    rule: "One SOP per Workflow–Stage–Timing",
    description: "Only one active SOP allowed per Workflow + Stage + Timing combination",
    enforcement: "System Enforced",
    icon: Shield,
  },
  {
    id: "GR-002",
    rule: "No Recursive SOP Execution",
    description: "SOP-triggered workflows cannot re-trigger the same SOP. Execution depth capped at max = 3",
    enforcement: "System Enforced",
    icon: AlertOctagon,
  },
  {
    id: "GR-003",
    rule: "Single Execution per Workflow Instance",
    description: "SOP executes once per workflow instance per stage",
    enforcement: "System Enforced",
    icon: Layers,
  },
  {
    id: "GR-004",
    rule: "Safe Activation",
    description: "SOPs start in Draft. Activation allowed only after successful simulation",
    enforcement: "Process Enforced",
    icon: CheckCircle2,
  },
]

const configurationErrors = [
  {
    code: "ERR_DUPLICATE_SOP",
    message: "SOP already exists for RFQ_CLOSE (ON_EXIT) in WF_RFQ_MAIN",
    severity: "Block Save",
  },
  { code: "ERR_INVALID_STAGE", message: "Selected stage does not belong to chosen workflow", severity: "Block Save" },
  { code: "ERR_MISSING_ACTION", message: "Action configuration is required", severity: "Block Save" },
  {
    code: "ERR_RECURSIVE_REF",
    message: "Recursive SOP trigger detected — configuration blocked",
    severity: "Block Save",
  },
  { code: "ERR_INVALID_OPERATOR", message: "Operator '>' not valid for Boolean data type", severity: "Block Save" },
]

const runtimeErrors = [
  { code: "RUN_SOP_FAIL", message: "SOP failure → workflow continues with warning", behavior: "Safe Fail" },
  { code: "RUN_WF_UNAVAIL", message: "Target workflow unavailable → escalation triggered", behavior: "Escalate" },
  { code: "RUN_TIMEOUT", message: "Timeout exceeded → fallback action executed", behavior: "Fallback" },
]

export function ProcurementSOPsContent() {
  const [activeTab, setActiveTab] = useState("rules")
  const [simulationResult, setSimulationResult] = useState<any>(null)
  const [conditions, setConditions] = useState([{ id: 1, attribute: "", operator: "", value: "", logic: "AND" }])

  const [triggerType, setTriggerType] = useState<"single" | "multiple">("single")
  const [defaultTiming, setDefaultTiming] = useState("ON_ENTRY")
  const [workflowTriggers, setWorkflowTriggers] = useState<WorkflowTrigger[]>([
    { id: 1, workflowId: "", stageId: "", timingOverride: null },
  ])

  // Keep these for backward compatibility with other parts
  const [selectedSourceWorkflow, setSelectedSourceWorkflow] = useState("")
  const [selectedStage, setSelectedStage] = useState("")
  const [selectedTiming, setSelectedTiming] = useState("")
  const [selectedAction, setSelectedAction] = useState("")

  const [simWorkflow, setSimWorkflow] = useState("")
  const [simStage, setSimStage] = useState("")

  const [showConditionCatalog, setShowConditionCatalog] = useState(false)
  const [showGuardrails, setShowGuardrails] = useState(true)
  const [showErrorHandling, setShowErrorHandling] = useState(false)

  const addCondition = () => {
    setConditions([...conditions, { id: conditions.length + 1, attribute: "", operator: "", value: "", logic: "AND" }])
  }

  const removeCondition = (id: number) => {
    if (conditions.length > 1) {
      setConditions(conditions.filter((c) => c.id !== id))
    }
  }

  const getStagesForWorkflow = (workflowId: string) => {
    const workflow = sourceWorkflows.find((w) => w.id === workflowId)
    return workflow?.stages || []
  }

  const addWorkflowTrigger = () => {
    setWorkflowTriggers([
      ...workflowTriggers,
      { id: workflowTriggers.length + 1, workflowId: "", stageId: "", timingOverride: null },
    ])
  }

  const removeWorkflowTrigger = (id: number) => {
    if (workflowTriggers.length > 1) {
      setWorkflowTriggers(workflowTriggers.filter((t) => t.id !== id))
    }
  }

  const updateWorkflowTrigger = (id: number, field: keyof WorkflowTrigger, value: string | null) => {
    setWorkflowTriggers(
      workflowTriggers.map((t) => {
        if (t.id === id) {
          if (field === "workflowId") {
            // Reset stage when workflow changes
            return { ...t, workflowId: value as string, stageId: "" }
          }
          return { ...t, [field]: value }
        }
        return t
      }),
    )
  }

  const runSimulation = () => {
    setSimulationResult({
      sourceWorkflow: simWorkflow || "WF_RFQ_MAIN",
      stage: simStage || "RFQ_CLOSE",
      triggeredRules: [{ id: "SOP-001", name: "Single Vendor RFQ", priority: 1 }],
      appliedPriority: 1,
      targetWorkflowInvoked: "WF_SINGLE_VENDOR_APPROVAL",
      returnBehavior: "RESUME",
      finalOutcome: "Continue RFQ",
      ruleTrace: [
        { rule: "SOP-001", condition: "VENDOR_COUNT = 1", result: "MATCHED", action: "Trigger Workflow" },
        { rule: "SOP-002", condition: "QUOTE_VS_BUDGET_VARIANCE > 10%", result: "NOT_MATCHED", action: "-" },
        { rule: "SOP-003", condition: "RFQ_HAS_PR = NO", result: "NOT_MATCHED", action: "-" },
      ],
    })
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col">
        <Header
          title="Procurement SOPs"
          description="Configure SOP rules triggered at workflow stages with dynamic action handling."
        />

        <div className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="rules">SOP Rules</TabsTrigger>
              <TabsTrigger value="builder">Rule Builder</TabsTrigger>
              <TabsTrigger value="simulation">Simulation</TabsTrigger>
              <TabsTrigger value="audit">Audit Trail</TabsTrigger>
            </TabsList>

            {/* SOP Rules Tab */}
            <TabsContent value="rules">
              {/* Summary Cards */}
              <div className="grid gap-4 md:grid-cols-4 mb-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <ClipboardList className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Rules</p>
                        <p className="text-2xl font-bold">{sopRules.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                        <CheckCircle2 className="h-5 w-5 text-success" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Active Rules</p>
                        <p className="text-2xl font-bold">{sopRules.filter((r) => r.status === "Active").length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10">
                        <GitBranch className="h-5 w-5 text-info" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Workflows Covered</p>
                        <p className="text-2xl font-bold">{sourceWorkflows.length}</p>
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
                        <p className="text-sm text-muted-foreground">Priority 1 Rules</p>
                        <p className="text-2xl font-bold">{sopRules.filter((r) => r.priority === 1).length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Rules Table */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>SOP Rule Library</CardTitle>
                    <CardDescription>Rules triggered at specific workflow stages</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input placeholder="Search rules..." className="pl-9 w-[200px]" />
                    </div>
                    <Select>
                      <SelectTrigger className="w-[150px]">
                        <Filter className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="Workflow" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Workflows</SelectItem>
                        {sourceWorkflows.map((wf) => (
                          <SelectItem key={wf.id} value={wf.id}>
                            {wf.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button onClick={() => setActiveTab("builder")}>
                      <Plus className="mr-2 h-4 w-4" />
                      New Rule
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Rule ID</TableHead>
                          <TableHead>Rule Name</TableHead>
                          <TableHead>Source Workflow</TableHead>
                          <TableHead>Stage</TableHead>
                          <TableHead>Timing</TableHead>
                          <TableHead>Condition</TableHead>
                          <TableHead>Action</TableHead>
                          <TableHead>Priority</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="w-[100px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sopRules.map((rule) => (
                          <TableRow key={rule.id}>
                            <TableCell className="font-mono text-xs">{rule.id}</TableCell>
                            <TableCell className="font-medium">{rule.name}</TableCell>
                            <TableCell className="text-xs">
                              <Tooltip>
                                <TooltipTrigger>
                                  <StatusBadge variant="info">{rule.sourceWorkflow.replace("WF_", "")}</StatusBadge>
                                </TooltipTrigger>
                                <TooltipContent>
                                  {sourceWorkflows.find((w) => w.id === rule.sourceWorkflow)?.name}
                                </TooltipContent>
                              </Tooltip>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {rule.stage.replace(/_/g, " ")}
                            </TableCell>
                            <TableCell>
                              <StatusBadge
                                variant={
                                  rule.timing === "ON_ENTRY"
                                    ? "success"
                                    : rule.timing === "ON_EXIT"
                                      ? "warning"
                                      : "info"
                                }
                              >
                                {rule.timing.replace(/_/g, " ")}
                              </StatusBadge>
                            </TableCell>
                            <TableCell className="font-mono text-xs max-w-[120px] truncate">
                              <Tooltip>
                                <TooltipTrigger>{rule.condition}</TooltipTrigger>
                                <TooltipContent>{rule.condition}</TooltipContent>
                              </Tooltip>
                            </TableCell>
                            <TableCell className="text-xs">
                              {rule.action === "TRIGGER_WORKFLOW" && rule.targetWorkflow ? (
                                <Tooltip>
                                  <TooltipTrigger>
                                    <span className="flex items-center gap-1">
                                      <Workflow className="h-3 w-3" />
                                      {rule.targetWorkflow.replace("WF_", "").substring(0, 15)}...
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    Trigger: {rule.targetWorkflow} ({rule.returnBehavior})
                                  </TooltipContent>
                                </Tooltip>
                              ) : (
                                rule.action.replace(/_/g, " ")
                              )}
                            </TableCell>
                            <TableCell>
                              <StatusBadge
                                variant={rule.priority === 1 ? "error" : rule.priority === 2 ? "warning" : "info"}
                              >
                                P{rule.priority}
                              </StatusBadge>
                            </TableCell>
                            <TableCell>
                              <StatusBadge variant={rule.status === "Active" ? "success" : "default"}>
                                {rule.status}
                              </StatusBadge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Copy className="h-4 w-4" />
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

            <TabsContent value="builder">
              {/* Architecture Info Banner */}
              <Card className="mb-6 bg-primary/5 border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Event-Driven Architecture (Non-Configurable)</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Workflow Engine emits lifecycle events automatically → SOP Engine listens to events → Evaluates
                        rules → Triggers actions or workflows. No polling, no manual SOP signals in workflows,
                        event-driven only.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Guardrails Section */}
              <Collapsible open={showGuardrails} onOpenChange={setShowGuardrails} className="mb-6">
                <Card>
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Shield className="h-5 w-5 text-primary" />
                          <CardTitle className="text-base">Guardrails (System Enforced)</CardTitle>
                        </div>
                        {showGuardrails ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </div>
                      <CardDescription>Mandatory system rules that cannot be bypassed</CardDescription>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      <div className="grid gap-3 md:grid-cols-2">
                        {guardrailRules.map((rule) => (
                          <div key={rule.id} className="flex items-start gap-3 rounded-lg border p-3 bg-muted/20">
                            <rule.icon className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                            <div>
                              <p className="text-sm font-medium">{rule.rule}</p>
                              <p className="text-xs text-muted-foreground mt-1">{rule.description}</p>
                              <StatusBadge variant="info" className="mt-2">
                                {rule.enforcement}
                              </StatusBadge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>

              <div className="grid gap-6 lg:grid-cols-2">
                {/* Rule Metadata */}
                <Card>
                  <CardHeader>
                    <CardTitle>Rule Metadata</CardTitle>
                    <CardDescription>Basic rule information and settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>SOP Rule ID</Label>
                        <Input value="SOP-007" disabled className="bg-muted" />
                        <p className="text-xs text-muted-foreground">System generated</p>
                      </div>
                      <div className="space-y-2">
                        <Label>Rule Name *</Label>
                        <Input placeholder="e.g., Single Vendor RFQ" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Input placeholder="Brief description of rule purpose" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Category *</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="budget">Budget</SelectItem>
                            <SelectItem value="vendor">Vendor</SelectItem>
                            <SelectItem value="compliance">Compliance</SelectItem>
                            <SelectItem value="process">Process</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Priority *</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 - Critical</SelectItem>
                            <SelectItem value="2">2 - High</SelectItem>
                            <SelectItem value="3">3 - Medium</SelectItem>
                            <SelectItem value="4">4 - Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Effective Date *</Label>
                        <Input type="date" />
                      </div>
                      <div className="space-y-2">
                        <Label>Expiry Date</Label>
                        <Input type="date" />
                        <p className="text-xs text-muted-foreground">Optional</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <div>
                        <Label>Status</Label>
                        <p className="text-xs text-muted-foreground">Draft / Active / Retired</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge variant="warning">Draft</StatusBadge>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Activation requires successful simulation first</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Trigger Configuration (WHEN) - Keep existing implementation */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Trigger Configuration (WHEN)
                    </CardTitle>
                    <CardDescription>
                      Event-driven trigger at workflow lifecycle events: Stage Entry, Stage Exit, Stage Pre-Completion
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Trigger Type Selection */}
                    <div className="space-y-2">
                      <Label>Trigger Type *</Label>
                      <RadioGroup
                        value={triggerType}
                        onValueChange={(val) => setTriggerType(val as "single" | "multiple")}
                        className="flex gap-6"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="single" id="trigger-single" />
                          <Label htmlFor="trigger-single" className="text-sm font-normal cursor-pointer">
                            Single Workflow
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="multiple" id="trigger-multiple" />
                          <Label htmlFor="trigger-multiple" className="text-sm font-normal cursor-pointer">
                            Multiple Workflows (Explicit)
                          </Label>
                        </div>
                      </RadioGroup>
                      <p className="text-xs text-muted-foreground">
                        {triggerType === "single"
                          ? "Rule applies to one workflow at a specific stage"
                          : "Same rule evaluated at multiple workflow–stage pairs without duplicating logic"}
                      </p>
                    </div>

                    {/* Default Trigger Timing */}
                    <div className="space-y-2">
                      <Label>Default Trigger Timing *</Label>
                      <RadioGroup
                        value={defaultTiming}
                        onValueChange={setDefaultTiming}
                        className="grid grid-cols-3 gap-2"
                      >
                        {triggerTimings.map((timing) => (
                          <div key={timing.value} className="flex items-center space-x-2">
                            <RadioGroupItem value={timing.value} id={`default-${timing.value}`} />
                            <Label htmlFor={`default-${timing.value}`} className="text-sm font-normal cursor-pointer">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span>{timing.label}</span>
                                </TooltipTrigger>
                                <TooltipContent>{timing.description}</TooltipContent>
                              </Tooltip>
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    {/* Workflow-Stage Mappings */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>Add Workflow Trigger (Repeatable)</Label>
                        {triggerType === "multiple" && (
                          <Button variant="outline" size="sm" onClick={addWorkflowTrigger}>
                            <Plus className="h-4 w-4 mr-1" />
                            Add Trigger
                          </Button>
                        )}
                      </div>

                      <div className="space-y-3">
                        {(triggerType === "single" ? [workflowTriggers[0]] : workflowTriggers).map((trigger, index) => (
                          <div key={trigger.id} className="rounded-lg border bg-muted/20 p-4 space-y-3">
                            {triggerType === "multiple" && (
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-muted-foreground">Entry #{index + 1}</span>
                                {workflowTriggers.length > 1 && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                                    onClick={() => removeWorkflowTrigger(trigger.id)}
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </Button>
                                )}
                              </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div className="space-y-1.5">
                                <Label className="text-xs">Workflow ID *</Label>
                                <Select
                                  value={trigger.workflowId}
                                  onValueChange={(val) => updateWorkflowTrigger(trigger.id, "workflowId", val)}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select workflow" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {sourceWorkflows.map((wf) => (
                                      <SelectItem key={wf.id} value={wf.id}>
                                        {wf.id}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground">From admin workflow configurator</p>
                              </div>

                              <div className="space-y-1.5">
                                <Label className="text-xs">Stage Name *</Label>
                                <Select
                                  value={trigger.stageId}
                                  onValueChange={(val) => updateWorkflowTrigger(trigger.id, "stageId", val)}
                                  disabled={!trigger.workflowId}
                                >
                                  <SelectTrigger>
                                    <SelectValue
                                      placeholder={trigger.workflowId ? "Select stage" : "Select workflow first"}
                                    />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {getStagesForWorkflow(trigger.workflowId).map((stage) => (
                                      <SelectItem key={stage.id} value={stage.id}>
                                        {stage.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground">Dynamic dropdown from selected workflow</p>
                              </div>

                              <div className="space-y-1.5">
                                <Label className="text-xs">Trigger Timing</Label>
                                <Select
                                  value={trigger.timingOverride || "inherit"}
                                  onValueChange={(val) =>
                                    updateWorkflowTrigger(trigger.id, "timingOverride", val === "inherit" ? null : val)
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="inherit">Inherit Default</SelectItem>
                                    {triggerTimings.map((timing) => (
                                      <SelectItem key={timing.value} value={timing.value}>
                                        {timing.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground">Inherits or overridden</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Example Preview */}
                    {triggerType === "multiple" && workflowTriggers.some((t) => t.workflowId && t.stageId) && (
                      <div className="rounded-md border bg-slate-950 p-4 text-xs font-mono text-slate-300">
                        <p className="text-slate-500 mb-2"># Example Configuration</p>
                        <pre className="whitespace-pre-wrap">
                          {`WHEN:
${workflowTriggers
  .filter((t) => t.workflowId && t.stageId)
  .map((t) => `  ${t.workflowId} → ${t.stageId} (${(t.timingOverride || defaultTiming).replace("_", " ")})`)
  .join("\n")}`}
                        </pre>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Condition Builder (IF) - Enhanced with catalog */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Zap className="h-5 w-5" />
                          Condition Builder (IF)
                        </CardTitle>
                        <CardDescription>No-code IF / AND / OR builder with grouped conditions</CardDescription>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowConditionCatalog(!showConditionCatalog)}
                      >
                        {showConditionCatalog ? "Hide" : "Show"} Condition Catalog
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Condition Catalog - Collapsible */}
                    {showConditionCatalog && (
                      <div className="rounded-md border mb-4">
                        <div className="p-3 bg-muted/50 border-b">
                          <p className="text-sm font-medium">Condition Catalog (Extensible)</p>
                          <p className="text-xs text-muted-foreground">Each condition defined once with metadata</p>
                        </div>
                        <div className="max-h-[300px] overflow-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="text-xs">Key</TableHead>
                                <TableHead className="text-xs">Label</TableHead>
                                <TableHead className="text-xs">Data Type</TableHead>
                                <TableHead className="text-xs">Data Source</TableHead>
                                <TableHead className="text-xs">Operators</TableHead>
                                <TableHead className="text-xs">Null Handling</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {conditionCatalog.map((cond) => (
                                <TableRow key={cond.key}>
                                  <TableCell className="font-mono text-xs">{cond.key}</TableCell>
                                  <TableCell className="text-xs">{cond.label}</TableCell>
                                  <TableCell>
                                    <StatusBadge variant="info">{cond.dataType}</StatusBadge>
                                  </TableCell>
                                  <TableCell className="text-xs text-muted-foreground">{cond.dataSource}</TableCell>
                                  <TableCell className="text-xs font-mono">{cond.operators.join(", ")}</TableCell>
                                  <TableCell className="text-xs text-muted-foreground">{cond.nullHandling}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    )}

                    {/* Condition Builder */}
                    {conditions.map((condition, index) => (
                      <div key={condition.id} className="flex items-center gap-3">
                        {index > 0 && (
                          <Select defaultValue="AND">
                            <SelectTrigger className="w-[80px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="AND">AND</SelectItem>
                              <SelectItem value="OR">OR</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                        <div className={`flex-1 flex items-center gap-3 ${index > 0 ? "" : "ml-[92px]"}`}>
                          <Select>
                            <SelectTrigger className="flex-1">
                              <SelectValue placeholder="Select attribute" />
                            </SelectTrigger>
                            <SelectContent>
                              {conditionCatalog.map((attr) => (
                                <SelectItem key={attr.key} value={attr.key}>
                                  {attr.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Select>
                            <SelectTrigger className="w-[80px]">
                              <SelectValue placeholder="Op" />
                            </SelectTrigger>
                            <SelectContent>
                              {operators.map((op) => (
                                <SelectItem key={op.value} value={op.value}>
                                  {op.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Input placeholder="Value" className="w-[150px]" />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => removeCondition(condition.id)}
                            disabled={conditions.length === 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={addCondition}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Condition
                    </Button>

                    {/* Condition Preview */}
                    <div className="mt-4 rounded-md border bg-muted/30 p-4">
                      <p className="text-xs font-medium text-muted-foreground mb-2">Example Condition Preview:</p>
                      <code className="text-sm font-mono">
                        IF (VENDOR_COUNT = 1) AND (L1_QUOTE_VALUE {">"} PR_BUDGET_VALUE)
                      </code>
                    </div>
                  </CardContent>
                </Card>

                {/* Actions (THEN) */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ArrowRight className="h-5 w-5" />
                      Actions (THEN)
                    </CardTitle>
                    <CardDescription>Define what happens when conditions match</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Allowed Actions *</Label>
                      <Select value={selectedAction} onValueChange={setSelectedAction}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select action" />
                        </SelectTrigger>
                        <SelectContent>
                          {systemActions.map((action) => (
                            <SelectItem key={action.value} value={action.value}>
                              <div className="flex items-center gap-2">
                                <action.icon className="h-4 w-4" />
                                {action.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Action Options Grid */}
                    <div className="grid grid-cols-2 gap-2">
                      {systemActions.map((action) => (
                        <div
                          key={action.value}
                          className={`rounded-md border p-2 text-xs flex items-center gap-2 cursor-pointer transition-colors ${
                            selectedAction === action.value ? "bg-primary/10 border-primary" : "hover:bg-muted/50"
                          }`}
                          onClick={() => setSelectedAction(action.value)}
                        >
                          <action.icon className="h-4 w-4" />
                          {action.label}
                        </div>
                      ))}
                    </div>

                    {/* Workflow Chaining Fields - shown when action is TRIGGER_WORKFLOW */}
                    {selectedAction === "TRIGGER_WORKFLOW" && (
                      <div className="rounded-md border bg-info/5 p-4 space-y-4">
                        <div className="flex items-center gap-2">
                          <Workflow className="h-4 w-4 text-info" />
                          <p className="text-sm font-medium">Workflow Chaining (ASYNC ONLY)</p>
                        </div>
                        <div className="space-y-2">
                          <Label>Target Workflow ID *</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select target workflow" />
                            </SelectTrigger>
                            <SelectContent>
                              {targetWorkflows.map((wf) => (
                                <SelectItem key={wf.id} value={wf.id}>
                                  {wf.id} - {wf.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Entry Node</Label>
                          <Input placeholder="Optional - specific entry node" />
                          <p className="text-xs text-muted-foreground">Leave empty to use default entry</p>
                        </div>
                        <div className="space-y-2">
                          <Label>Return Behavior *</Label>
                          <RadioGroup defaultValue="RESUME" className="space-y-2">
                            {returnBehaviors.map((behavior) => (
                              <div key={behavior.value} className="flex items-start space-x-2">
                                <RadioGroupItem value={behavior.value} id={behavior.value} className="mt-1" />
                                <div>
                                  <Label htmlFor={behavior.value} className="text-sm font-normal cursor-pointer">
                                    {behavior.label}
                                  </Label>
                                  <p className="text-xs text-muted-foreground">{behavior.description}</p>
                                </div>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Escalation & Exception Handling (Per SOP) */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Escalation & Exception Handling
                    </CardTitle>
                    <CardDescription>Configurable per SOP rule</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Escalation Workflow on Rejection</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select escalation workflow" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="WF_PROC_HEAD">Escalate to Procurement Head</SelectItem>
                          <SelectItem value="WF_MANAGER">Escalate to Manager</SelectItem>
                          <SelectItem value="WF_DIRECTOR">Escalate to Director</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Escalate After Timeout</Label>
                      <div className="flex items-center gap-2">
                        <Input type="number" placeholder="Days" className="w-[100px]" />
                        <span className="text-sm text-muted-foreground">days pending</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Fallback Action if Escalation Fails</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select fallback" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="continue">Continue with Warning</SelectItem>
                          <SelectItem value="block">Block Progression</SelectItem>
                          <SelectItem value="terminate">Terminate Workflow</SelectItem>
                          <SelectItem value="reopen">Re-open for Retry</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Example */}
                    <div className="rounded-md bg-muted/30 p-3">
                      <p className="text-xs font-medium text-muted-foreground mb-2">Example:</p>
                      <div className="text-xs space-y-1">
                        <p>On Reject → Escalate to WF_PROC_HEAD</p>
                        <p>On Timeout (2 days) → Auto-Escalate</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Error Handling & Validation Section */}
              <Collapsible open={showErrorHandling} onOpenChange={setShowErrorHandling} className="mt-6">
                <Card>
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <AlertOctagon className="h-5 w-5 text-destructive" />
                          <CardTitle className="text-base">Error Handling & Validation</CardTitle>
                        </div>
                        {showErrorHandling ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </div>
                      <CardDescription>Configuration errors block save, runtime errors fail safely</CardDescription>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      <div className="grid gap-6 md:grid-cols-2">
                        {/* Configuration Errors */}
                        <div>
                          <p className="text-sm font-medium mb-3 flex items-center gap-2">
                            <Ban className="h-4 w-4 text-destructive" />
                            Configuration Errors (Block Save)
                          </p>
                          <div className="space-y-2">
                            {configurationErrors.map((err) => (
                              <div
                                key={err.code}
                                className="rounded-md border border-destructive/30 bg-destructive/5 p-3"
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <code className="text-xs font-mono text-destructive">{err.code}</code>
                                  <StatusBadge variant="error">{err.severity}</StatusBadge>
                                </div>
                                <p className="text-xs text-muted-foreground">"{err.message}"</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Runtime Errors */}
                        <div>
                          <p className="text-sm font-medium mb-3 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-warning-foreground" />
                            Runtime Errors (Safe Fail)
                          </p>
                          <div className="space-y-2">
                            {runtimeErrors.map((err) => (
                              <div key={err.code} className="rounded-md border border-warning/30 bg-warning/5 p-3">
                                <div className="flex items-center justify-between mb-1">
                                  <code className="text-xs font-mono text-warning-foreground">{err.code}</code>
                                  <StatusBadge variant="warning">{err.behavior}</StatusBadge>
                                </div>
                                <p className="text-xs text-muted-foreground">{err.message}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>

              {/* Actions */}
              <div className="flex justify-between items-center mt-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Info className="h-4 w-4" />
                  <span>Test → Review → Activate flow required</span>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setActiveTab("rules")}>
                    Cancel
                  </Button>
                  <Button variant="outline">Save as Draft</Button>
                  <Button variant="outline" onClick={() => setActiveTab("simulation")}>
                    <Play className="mr-2 h-4 w-4" />
                    Simulate
                  </Button>
                  <Button disabled>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Activate
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="simulation">
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Simulation Inputs */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Play className="h-5 w-5" />
                      Simulation Inputs
                    </CardTitle>
                    <CardDescription>Configure test scenario with workflow stage context</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-md border bg-primary/5 p-4 space-y-4">
                      <p className="text-sm font-medium">Workflow Stage Context</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Source Workflow *</Label>
                          <Select
                            value={simWorkflow}
                            onValueChange={(val) => {
                              setSimWorkflow(val)
                              setSimStage("")
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select workflow" />
                            </SelectTrigger>
                            <SelectContent>
                              {sourceWorkflows.map((wf) => (
                                <SelectItem key={wf.id} value={wf.id}>
                                  {wf.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Workflow Stage *</Label>
                          <Select value={simStage} onValueChange={setSimStage} disabled={!simWorkflow}>
                            <SelectTrigger>
                              <SelectValue placeholder={simWorkflow ? "Select stage" : "Select workflow first"} />
                            </SelectTrigger>
                            <SelectContent>
                              {getStagesForWorkflow(simWorkflow).map((stage) => (
                                <SelectItem key={stage.id} value={stage.id}>
                                  {stage.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm font-medium pt-2">Sample RFQ Data</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>RFQ Type</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="with_pr">With PR</SelectItem>
                            <SelectItem value="without_pr">Without PR</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Vendor Count</Label>
                        <Input type="number" placeholder="e.g., 1" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Quote Value</Label>
                        <Input type="number" placeholder="e.g., 55000" />
                      </div>
                      <div className="space-y-2">
                        <Label>Budget Value</Label>
                        <Input type="number" placeholder="e.g., 50000" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>RFQ Value</Label>
                        <Input type="number" placeholder="e.g., 100000" />
                      </div>
                      <div className="space-y-2">
                        <Label>Vendor Type</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="existing">Existing</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="rounded-md bg-muted/50 p-3">
                      <div className="flex items-start gap-2">
                        <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <p className="text-xs text-muted-foreground">
                          Simulation is non-persistent. No actual data will be modified.
                        </p>
                      </div>
                    </div>

                    <Button className="w-full" onClick={runSimulation}>
                      <Play className="mr-2 h-4 w-4" />
                      Run Simulation
                    </Button>
                  </CardContent>
                </Card>

                {/* Simulation Results */}
                <Card>
                  <CardHeader>
                    <CardTitle>Simulation Results</CardTitle>
                    <CardDescription>Visual trace of rule evaluation at selected stage</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {simulationResult ? (
                      <div className="space-y-4">
                        <div className="rounded-md border bg-primary/5 p-3">
                          <p className="text-xs text-muted-foreground mb-1">Simulation Context</p>
                          <div className="flex items-center gap-2">
                            <StatusBadge variant="info">
                              {simulationResult.sourceWorkflow.replace("WF_", "")}
                            </StatusBadge>
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                            <StatusBadge variant="warning">{simulationResult.stage.replace(/_/g, " ")}</StatusBadge>
                          </div>
                        </div>

                        {/* Summary */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="rounded-md border p-3">
                            <p className="text-xs text-muted-foreground">SOP Rules Triggered</p>
                            <p className="text-xl font-bold">{simulationResult.triggeredRules.length}</p>
                          </div>
                          <div className="rounded-md border p-3">
                            <p className="text-xs text-muted-foreground">Applied Priority</p>
                            <p className="text-xl font-bold">P{simulationResult.appliedPriority}</p>
                          </div>
                        </div>

                        {/* Target Workflow Invoked */}
                        {simulationResult.targetWorkflowInvoked && (
                          <div className="rounded-md bg-info/10 border border-info/30 p-4">
                            <p className="text-sm font-medium text-info">Target Workflow Invoked</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Workflow className="h-4 w-4" />
                              <span className="font-mono text-sm">{simulationResult.targetWorkflowInvoked}</span>
                              <StatusBadge variant="default">{simulationResult.returnBehavior}</StatusBadge>
                            </div>
                          </div>
                        )}

                        {/* Final Outcome */}
                        <div className="rounded-md bg-success/10 border border-success/30 p-4">
                          <p className="text-sm font-medium text-success">Final RFQ State</p>
                          <p className="text-lg font-semibold mt-1">{simulationResult.finalOutcome}</p>
                        </div>

                        {/* Rule Trace */}
                        <div>
                          <p className="text-sm font-medium mb-2">Rule Evaluation Trace</p>
                          <div className="rounded-md border">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Rule</TableHead>
                                  <TableHead>Condition</TableHead>
                                  <TableHead>Result</TableHead>
                                  <TableHead>Action</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {simulationResult.ruleTrace.map((trace: any, index: number) => (
                                  <TableRow key={index}>
                                    <TableCell className="font-mono text-xs">{trace.rule}</TableCell>
                                    <TableCell className="text-xs">{trace.condition}</TableCell>
                                    <TableCell>
                                      <StatusBadge variant={trace.result === "MATCHED" ? "success" : "default"}>
                                        {trace.result}
                                      </StatusBadge>
                                    </TableCell>
                                    <TableCell className="text-sm">{trace.action}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                          <Play className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <p className="mt-4 text-muted-foreground">Run a simulation to see results</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="audit">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Audit Trail</CardTitle>
                    <CardDescription>Immutable record of all SOP rule evaluations</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input placeholder="Search by RFQ ID..." className="pl-9 w-[200px]" />
                    </div>
                    <Button variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Audit ID</TableHead>
                          <TableHead>Timestamp</TableHead>
                          <TableHead>Rule ID</TableHead>
                          <TableHead>RFQ ID</TableHead>
                          <TableHead>Workflow</TableHead>
                          <TableHead>Stage</TableHead>
                          <TableHead>Condition</TableHead>
                          <TableHead>Action</TableHead>
                          <TableHead>Target WF</TableHead>
                          <TableHead>Override</TableHead>
                          <TableHead>User</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {auditTrail.map((audit) => (
                          <TableRow key={audit.id}>
                            <TableCell className="font-mono text-xs">{audit.id}</TableCell>
                            <TableCell className="text-xs text-muted-foreground">{audit.timestamp}</TableCell>
                            <TableCell className="font-mono text-xs">{audit.ruleId}</TableCell>
                            <TableCell className="font-mono text-xs">{audit.rfqId}</TableCell>
                            <TableCell className="text-xs">
                              <StatusBadge variant="info">{audit.sourceWorkflow.replace("WF_", "")}</StatusBadge>
                            </TableCell>
                            <TableCell className="text-xs">{audit.stage.replace(/_/g, " ")}</TableCell>
                            <TableCell className="text-xs max-w-[100px] truncate">
                              <Tooltip>
                                <TooltipTrigger>{audit.conditionValues}</TooltipTrigger>
                                <TooltipContent>{audit.conditionValues}</TooltipContent>
                              </Tooltip>
                            </TableCell>
                            <TableCell className="text-sm">{audit.actionTaken}</TableCell>
                            <TableCell className="font-mono text-xs">{audit.targetWorkflow || "-"}</TableCell>
                            <TableCell>
                              {audit.override ? (
                                <StatusBadge variant="warning">Yes</StatusBadge>
                              ) : (
                                <span className="text-muted-foreground">No</span>
                              )}
                            </TableCell>
                            <TableCell className="text-sm">{audit.user}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <Card className="mt-6 bg-muted/30">
                    <CardHeader>
                      <CardTitle className="text-base">Example SOP Rule Configuration (JSON)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <pre className="text-xs font-mono bg-background rounded-md p-4 overflow-x-auto">
                        {`{
  "rule_name": "Single Vendor Exception",
  "trigger": {
    "workflow_id": "WF_RFQ_MAIN",
    "stage": "RFQ_CLOSE",
    "timing": "ON_EXIT"
  },
  "condition": "VENDOR_COUNT = 1",
  "action": {
    "type": "TRIGGER_WORKFLOW",
    "workflow_id": "WF_SINGLE_VENDOR_APPROVAL",
    "return_behavior": "RESUME"
  },
  "end_state": "CONTINUE_RFQ"
}`}
                      </pre>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </TooltipProvider>
  )
}
