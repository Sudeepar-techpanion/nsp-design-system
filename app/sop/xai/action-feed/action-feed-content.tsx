"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import {
  ArrowLeft,
  Sparkles,
  ChevronRight,
  Check,
  AlertCircle,
  Info,
  Layers,
  Users,
  Shield,
  Target,
  Clock,
  Brain,
  Bell,
  Save,
  Eye,
  UserCog,
  BellRing,
  AlertTriangle,
} from "lucide-react"
import { TooltipProvider } from "@/components/ui/tooltip"

// Configuration steps
const configSteps = [
  { id: "module", label: "Module Selection", icon: Layers, description: "Select modules and criticality" },
  { id: "user", label: "User / Group", icon: Users, description: "User context and delegation" },
  { id: "authority", label: "Authority & Scope", icon: Shield, description: "Decision limits and permissions" },
  { id: "goals", label: "Goals & Metrics", icon: Target, description: "Optimization objectives" },
  { id: "sla", label: "Target SLAs", icon: Clock, description: "SLA types and breach severity" },
  { id: "behavior", label: "Behavior Preferences", icon: Brain, description: "Work style and focus" },
  { id: "notifications", label: "Notifications", icon: Bell, description: "Alert channels and thresholds" },
]

// Available modules
const availableModules = [
  { id: "rfq", name: "RFQ Management", criticality: "high" },
  { id: "vendor-onboarding", name: "Vendor Onboarding", criticality: "medium" },
  { id: "supplier-portal", name: "Supplier Portal", criticality: "medium" },
  { id: "invoice-processing", name: "Invoice Processing", criticality: "high" },
  { id: "purchase-orders", name: "Purchase Orders", criticality: "critical" },
  { id: "contracts", name: "Contract Management", criticality: "high" },
]

// User groups
const userGroups = [
  { id: "procurement-managers", name: "Procurement Managers", count: 12 },
  { id: "buyers", name: "Buyers", count: 45 },
  { id: "approvers", name: "Approvers", count: 8 },
  { id: "finance-team", name: "Finance Team", count: 15 },
]

export function ActionFeedContent() {
  const [activeStep, setActiveStep] = useState("module")
  const [completedSteps, setCompletedSteps] = useState<string[]>([])

  // Module selection state
  const [selectedModules, setSelectedModules] = useState<string[]>(["purchase-orders", "invoice-processing"])
  const [moduleCriticality, setModuleCriticality] = useState<Record<string, string>>({
    "purchase-orders": "critical",
    "invoice-processing": "high",
  })
  const [crossModuleDeps, setCrossModuleDeps] = useState(true)

  // User context state
  const [userSelectionType, setUserSelectionType] = useState<"user" | "group">("group")
  const [selectedUserGroup, setSelectedUserGroup] = useState("procurement-managers")
  const [personaLabel, setPersonaLabel] = useState("Procurement Manager")
  const [workloadRange, setWorkloadRange] = useState([30, 60])
  const [delegationEnabled, setDelegationEnabled] = useState(true)

  // Authority state
  const [decisionLevel, setDecisionLevel] = useState("manager")
  const [financialLimit, setFinancialLimit] = useState("50000")
  const [canEscalate, setCanEscalate] = useState(true)
  const [canOverrideSLA, setCanOverrideSLA] = useState(false)
  const [riskTolerance, setRiskTolerance] = useState("medium")

  // Goals state
  const [primaryGoal, setPrimaryGoal] = useState("minimize-sla-breach")
  const [secondaryGoals, setSecondaryGoals] = useState<string[]>(["reduce-processing-time", "improve-vendor-response"])
  const [costOfDelay, setCostOfDelay] = useState("high")
  const [speedVsQuality, setSpeedVsQuality] = useState([50])

  const [selectedWorkTypes, setSelectedWorkTypes] = useState<string[]>(["approval"])
  const [activeWorkType, setActiveWorkType] = useState("approval")
  const [workTypeSlaConfigs, setWorkTypeSlaConfigs] = useState<
    Record<
      string,
      {
        enforcement: string
        slaType: string
        // Time-based fields
        targetDuration: number
        targetUnit: string
        businessHours: boolean
        workingHoursOnly: boolean
        gracePeriod: number
        // Outcome-based fields
        requiredOutcome: string
        acceptableIntermediateStates: string[]
        maxDurationWithoutOutcome: number
        // Severity & Impact
        severity: string
        downstreamImpact: string
        penaltyMagnitude: string
        // Visibility & Escalation
        visibility: string
        escalationPreference: string
        gracePeriodTolerance: number
      }
    >
  >({
    approval: {
      enforcement: "enforced",
      slaType: "time-based",
      targetDuration: 4,
      targetUnit: "hours",
      businessHours: true,
      workingHoursOnly: true,
      gracePeriod: 1,
      requiredOutcome: "decision-recorded",
      acceptableIntermediateStates: [],
      maxDurationWithoutOutcome: 0,
      severity: "critical",
      downstreamImpact: "Blocks downstream workflow",
      penaltyMagnitude: "high",
      visibility: "user-manager",
      escalationPreference: "auto-escalate",
      gracePeriodTolerance: 1,
    },
    review: {
      enforcement: "soft",
      slaType: "outcome-based",
      targetDuration: 1,
      targetUnit: "days",
      businessHours: true,
      workingHoursOnly: true,
      gracePeriod: 2,
      requiredOutcome: "comments-added",
      acceptableIntermediateStates: ["in-progress"],
      maxDurationWithoutOutcome: 24,
      severity: "standard",
      downstreamImpact: "May delay approvals",
      penaltyMagnitude: "medium",
      visibility: "user-only",
      escalationPreference: "notify-only",
      gracePeriodTolerance: 2,
    },
    resolution: {
      enforcement: "enforced",
      slaType: "time-based",
      targetDuration: 8,
      targetUnit: "hours",
      businessHours: false,
      workingHoursOnly: false,
      gracePeriod: 0,
      requiredOutcome: "status-resolved",
      acceptableIntermediateStates: [],
      maxDurationWithoutOutcome: 0,
      severity: "critical",
      downstreamImpact: "Operations blocked",
      penaltyMagnitude: "high",
      visibility: "org-wide",
      escalationPreference: "auto-escalate",
      gracePeriodTolerance: 0,
    },
    "furnish-info": {
      enforcement: "soft",
      slaType: "outcome-based",
      targetDuration: 2,
      targetUnit: "days",
      businessHours: true,
      workingHoursOnly: true,
      gracePeriod: 4,
      requiredOutcome: "response-sent",
      acceptableIntermediateStates: ["draft-saved"],
      maxDurationWithoutOutcome: 48,
      severity: "standard",
      downstreamImpact: "Requestor waiting",
      penaltyMagnitude: "low",
      visibility: "user-only",
      escalationPreference: "notify-only",
      gracePeriodTolerance: 4,
    },
    acknowledgement: {
      enforcement: "not-enforced",
      slaType: "time-based",
      targetDuration: 30,
      targetUnit: "minutes",
      businessHours: false,
      workingHoursOnly: false,
      gracePeriod: 0,
      requiredOutcome: "acknowledged",
      acceptableIntermediateStates: [],
      maxDurationWithoutOutcome: 0,
      severity: "low",
      downstreamImpact: "Minimal",
      penaltyMagnitude: "low",
      visibility: "user-only",
      escalationPreference: "silent",
      gracePeriodTolerance: 0,
    },
  })

  const workTypes = [
    { id: "approval", label: "Approval", description: "Decision to approve or reject" },
    { id: "review", label: "Review", description: "Examine and provide feedback" },
    { id: "resolution", label: "Resolution", description: "Resolve issues or queries" },
    { id: "furnish-info", label: "Forwarded / Furnish Information", description: "Provide requested information" },
    { id: "acknowledgement", label: "Acknowledgement", description: "Confirm receipt or awareness" },
  ]

  const toggleWorkType = (workTypeId: string) => {
    if (selectedWorkTypes.includes(workTypeId)) {
      const newSelected = selectedWorkTypes.filter((wt) => wt !== workTypeId)
      setSelectedWorkTypes(newSelected)
      if (activeWorkType === workTypeId && newSelected.length > 0) {
        setActiveWorkType(newSelected[0])
      }
    } else {
      setSelectedWorkTypes([...selectedWorkTypes, workTypeId])
      setActiveWorkType(workTypeId)
    }
  }

  const updateWorkTypeSlaConfig = (workTypeId: string, field: string, value: unknown) => {
    setWorkTypeSlaConfigs((prev) => ({
      ...prev,
      [workTypeId]: {
        ...prev[workTypeId],
        [field]: value,
      },
    }))
  }

  const toggleIntermediateState = (workTypeId: string, state: string) => {
    const current = workTypeSlaConfigs[workTypeId]?.acceptableIntermediateStates || []
    const newStates = current.includes(state) ? current.filter((s) => s !== state) : [...current, state]
    updateWorkTypeSlaConfig(workTypeId, "acceptableIntermediateStates", newStates)
  }
  // END NEW SLA STATE VARIABLES

  // Behavior state
  const [workStyle, setWorkStyle] = useState("planned")
  const [focusTolerance, setFocusTolerance] = useState("medium")
  const [peakHoursStart, setPeakHoursStart] = useState("09:00")
  const [peakHoursEnd, setPeakHoursEnd] = useState("12:00")
  const [taskGrouping, setTaskGrouping] = useState("by-module")

  // Notification state
  const [notificationChannels, setNotificationChannels] = useState<string[]>(["in-app", "email"])
  const [alertThreshold, setAlertThreshold] = useState("high-priority")
  const [escalationTiming, setEscalationTiming] = useState("after-1-hour")
  const [summaryPreference, setSummaryPreference] = useState("daily-digest")

  const handleStepComplete = (step: string) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps([...completedSteps, step])
    }
    const currentIndex = configSteps.findIndex((s) => s.id === step)
    if (currentIndex < configSteps.length - 1) {
      setActiveStep(configSteps[currentIndex + 1].id)
    }
  }

  const getStepStatus = (stepId: string) => {
    if (completedSteps.includes(stepId)) return "completed"
    if (activeStep === stepId) return "active"
    return "pending"
  }

  const toggleModule = (moduleId: string) => {
    setSelectedModules((prev) => (prev.includes(moduleId) ? prev.filter((m) => m !== moduleId) : [...prev, moduleId]))
  }

  const toggleSecondaryGoal = (goal: string) => {
    setSecondaryGoals((prev) => (prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]))
  }

  const toggleNotificationChannel = (channel: string) => {
    setNotificationChannels((prev) => (prev.includes(channel) ? prev.filter((c) => c !== channel) : [...prev, channel]))
  }

  return (
    <TooltipProvider>
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/sop/xai">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to xAI
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">AI Action Feed Configuration</h1>
              <p className="text-muted-foreground mt-1">Configure how the AI prioritizes and surfaces actions</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              <Sparkles className="h-3 w-3 mr-1" />
              Configuration Interpreter
            </Badge>
          </div>
        </div>

        {/* Info Banner */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="py-3">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm text-blue-900">
                  <strong>Configuration Flow:</strong> Each step adds constraints and intent, not logic. The AI
                  interprets your inputs to understand what to optimize for, what it&apos;s allowed to surface, and how
                  to weight urgency, risk, and impact.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-4 gap-6">
          {/* Step Navigator */}
          <div className="col-span-1">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Configuration Steps</CardTitle>
                <CardDescription className="text-xs">Complete all steps to save</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {configSteps.map((step, index) => {
                    const status = getStepStatus(step.id)
                    const Icon = step.icon
                    return (
                      <button
                        key={step.id}
                        onClick={() => setActiveStep(step.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                          status === "active"
                            ? "bg-primary/10 border-l-2 border-primary"
                            : status === "completed"
                              ? "bg-green-50 border-l-2 border-green-500"
                              : "hover:bg-muted/50 border-l-2 border-transparent"
                        }`}
                      >
                        <div
                          className={`flex items-center justify-center w-8 h-8 rounded-full ${
                            status === "completed"
                              ? "bg-green-100 text-green-600"
                              : status === "active"
                                ? "bg-primary/20 text-primary"
                                : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {status === "completed" ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <span className="text-sm font-medium">{index + 1}</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${status === "active" ? "text-primary" : ""}`}>
                            {step.label}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">{step.description}</p>
                        </div>
                        <Icon className={`h-4 w-4 ${status === "active" ? "text-primary" : "text-muted-foreground"}`} />
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* AI Interpretation Preview */}
            <Card className="mt-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Brain className="h-4 w-4 text-purple-600" />
                  AI Interpretation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-xs">
                  <div>
                    <p className="font-medium text-muted-foreground">Action Universe</p>
                    <p className="text-foreground">{selectedModules.length} modules selected</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Optimization Target</p>
                    <p className="text-foreground">
                      {primaryGoal === "minimize-sla-breach"
                        ? "Minimize SLA Breaches"
                        : primaryGoal === "reduce-cost"
                          ? "Reduce Costs"
                          : primaryGoal === "maximize-throughput"
                            ? "Maximize Throughput"
                            : "Custom"}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Authority Ceiling</p>
                    <p className="text-foreground">${Number.parseInt(financialLimit).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Risk Sensitivity</p>
                    <Badge variant="outline" className="text-xs">
                      {riskTolerance}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Step Content */}
          <div className="col-span-3">
            <Card>
              <CardContent className="p-6">
                {/* Step 1: Module Selection */}
                {activeStep === "module" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-semibold flex items-center gap-2">
                        <Layers className="h-5 w-5 text-primary" />
                        Module Selection
                      </h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        Select which modules the AI should monitor and their criticality levels
                      </p>
                    </div>

                    <div className="space-y-4">
                      <Label className="text-sm font-medium">Select Modules</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {availableModules.map((module) => (
                          <div
                            key={module.id}
                            className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                              selectedModules.includes(module.id)
                                ? "border-primary bg-primary/5"
                                : "hover:border-muted-foreground/50"
                            }`}
                            onClick={() => toggleModule(module.id)}
                          >
                            <div className="flex items-center gap-3">
                              <Checkbox
                                checked={selectedModules.includes(module.id)}
                                onCheckedChange={() => toggleModule(module.id)}
                              />
                              <div>
                                <p className="font-medium text-sm">{module.name}</p>
                                <Badge
                                  variant="outline"
                                  className={`text-xs mt-1 ${
                                    module.criticality === "critical"
                                      ? "bg-red-50 text-red-700 border-red-200"
                                      : module.criticality === "high"
                                        ? "bg-orange-50 text-orange-700 border-orange-200"
                                        : "bg-blue-50 text-blue-700 border-blue-200"
                                  }`}
                                >
                                  {module.criticality}
                                </Badge>
                              </div>
                            </div>
                            {selectedModules.includes(module.id) && (
                              <Select
                                value={moduleCriticality[module.id] || module.criticality}
                                onValueChange={(value) =>
                                  setModuleCriticality((prev) => ({ ...prev, [module.id]: value }))
                                }
                              >
                                <SelectTrigger className="w-28">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="critical">Critical</SelectItem>
                                  <SelectItem value="high">High</SelectItem>
                                  <SelectItem value="medium">Medium</SelectItem>
                                  <SelectItem value="low">Low</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <Label className="text-sm font-medium">Cross-Module Dependencies</Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Allow AI to consider dependencies between selected modules
                        </p>
                      </div>
                      <Switch checked={crossModuleDeps} onCheckedChange={setCrossModuleDeps} />
                    </div>

                    {/* AI Interpretation */}
                    <Card className="bg-purple-50 border-purple-200">
                      <CardContent className="py-3">
                        <div className="flex items-start gap-2">
                          <Brain className="h-4 w-4 text-purple-600 mt-0.5" />
                          <div>
                            <p className="text-xs font-medium text-purple-900">AI Interprets As:</p>
                            <ul className="text-xs text-purple-800 mt-1 space-y-1">
                              <li>• Action universe boundary: {selectedModules.length} modules</li>
                              <li>
                                • Baseline urgency bias:{" "}
                                {Object.values(moduleCriticality).filter((c) => c === "critical").length} critical
                                modules
                              </li>
                              <li>• Dependency awareness: {crossModuleDeps ? "Enabled" : "Disabled"}</li>
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="flex justify-end">
                      <Button onClick={() => handleStepComplete("module")}>
                        Continue to User Selection
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 2: User / User Group */}
                {activeStep === "user" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-semibold flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        User / User Group Selection
                      </h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        Define the user context for personalization and workload normalization
                      </p>
                    </div>

                    <div className="space-y-4">
                      <Label className="text-sm font-medium">Selection Type</Label>
                      <RadioGroup
                        value={userSelectionType}
                        onValueChange={(v) => setUserSelectionType(v as "user" | "group")}
                      >
                        <div className="flex gap-4">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="user" id="user" />
                            <Label htmlFor="user">Individual User</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="group" id="group" />
                            <Label htmlFor="group">User Group</Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>

                    {userSelectionType === "group" && (
                      <div className="space-y-4">
                        <Label className="text-sm font-medium">Select User Group</Label>
                        <div className="grid grid-cols-2 gap-3">
                          {userGroups.map((group) => (
                            <div
                              key={group.id}
                              className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                                selectedUserGroup === group.id
                                  ? "border-primary bg-primary/5"
                                  : "hover:border-muted-foreground/50"
                              }`}
                              onClick={() => setSelectedUserGroup(group.id)}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                  <UserCog className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                  <p className="font-medium text-sm">{group.name}</p>
                                  <p className="text-xs text-muted-foreground">{group.count} users</p>
                                </div>
                              </div>
                              {selectedUserGroup === group.id && <Check className="h-5 w-5 text-primary" />}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Persona Label (Optional)</Label>
                        <Input
                          value={personaLabel}
                          onChange={(e) => setPersonaLabel(e.target.value)}
                          placeholder="e.g., Procurement Manager"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Typical Workload Range</Label>
                        <div className="pt-2">
                          <Slider
                            value={workloadRange}
                            onValueChange={setWorkloadRange}
                            max={100}
                            step={5}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>{workloadRange[0]} items</span>
                            <span>{workloadRange[1]} items</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <Label className="text-sm font-medium">Delegation Permission</Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Allow AI to suggest delegation to team members
                        </p>
                      </div>
                      <Switch checked={delegationEnabled} onCheckedChange={setDelegationEnabled} />
                    </div>

                    {/* AI Interpretation */}
                    <Card className="bg-purple-50 border-purple-200">
                      <CardContent className="py-3">
                        <div className="flex items-start gap-2">
                          <Brain className="h-4 w-4 text-purple-600 mt-0.5" />
                          <div>
                            <p className="text-xs font-medium text-purple-900">AI Interprets As:</p>
                            <ul className="text-xs text-purple-800 mt-1 space-y-1">
                              <li>
                                • Personalization scope:{" "}
                                {userSelectionType === "group"
                                  ? userGroups.find((g) => g.id === selectedUserGroup)?.name
                                  : "Individual"}
                              </li>
                              <li>
                                • Urgency normalization baseline: {workloadRange[0]}-{workloadRange[1]} items
                              </li>
                              <li>• Allowed handling modes: {delegationEnabled ? "Act & Delegate" : "Act only"}</li>
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="flex justify-end">
                      <Button onClick={() => handleStepComplete("user")}>
                        Continue to Authority
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 3: Authority & Scope */}
                {activeStep === "authority" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-semibold flex items-center gap-2">
                        <Shield className="h-5 w-5 text-primary" />
                        Authority & Scope
                      </h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        Define hard boundaries the AI must never exceed
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Decision Authority Level</Label>
                        <Select value={decisionLevel} onValueChange={setDecisionLevel}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="individual">Individual Contributor</SelectItem>
                            <SelectItem value="team-lead">Team Lead</SelectItem>
                            <SelectItem value="manager">Manager</SelectItem>
                            <SelectItem value="director">Director</SelectItem>
                            <SelectItem value="executive">Executive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Financial Limit ($)</Label>
                        <Input
                          type="number"
                          value={financialLimit}
                          onChange={(e) => setFinancialLimit(e.target.value)}
                          placeholder="50000"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Risk Tolerance</Label>
                      <RadioGroup value={riskTolerance} onValueChange={setRiskTolerance}>
                        <div className="grid grid-cols-3 gap-3">
                          {["low", "medium", "high"].map((level) => (
                            <div
                              key={level}
                              className={`flex items-center space-x-2 p-4 border rounded-lg cursor-pointer ${
                                riskTolerance === level ? "border-primary bg-primary/5" : ""
                              }`}
                              onClick={() => setRiskTolerance(level)}
                            >
                              <RadioGroupItem value={level} id={`risk-${level}`} />
                              <Label htmlFor={`risk-${level}`} className="capitalize cursor-pointer">
                                {level}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <Label className="text-sm font-medium">Escalation Permission</Label>
                          <p className="text-xs text-muted-foreground mt-1">Can escalate to higher authority</p>
                        </div>
                        <Switch checked={canEscalate} onCheckedChange={setCanEscalate} />
                      </div>
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <Label className="text-sm font-medium">SLA Override Permission</Label>
                          <p className="text-xs text-muted-foreground mt-1">Can override SLA deadlines</p>
                        </div>
                        <Switch checked={canOverrideSLA} onCheckedChange={setCanOverrideSLA} />
                      </div>
                    </div>

                    {/* AI Interpretation */}
                    <Card className="bg-purple-50 border-purple-200">
                      <CardContent className="py-3">
                        <div className="flex items-start gap-2">
                          <Brain className="h-4 w-4 text-purple-600 mt-0.5" />
                          <div>
                            <p className="text-xs font-medium text-purple-900">AI Interprets As:</p>
                            <ul className="text-xs text-purple-800 mt-1 space-y-1">
                              <li>
                                • Hard boundaries for surfaced actions: $
                                {Number.parseInt(financialLimit).toLocaleString()}$ max
                              </li>
                              <li>• Escalation ceiling: {canEscalate ? "Allowed" : "Not allowed"}</li>
                              <li>• Risk tolerance limits: {riskTolerance}</li>
                              <li className="text-purple-900 font-medium">Never exceed this scope downstream.</li>
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="flex justify-end">
                      <Button onClick={() => handleStepComplete("authority")}>
                        Continue to Goals
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 4: Goals & Success Metrics */}
                {activeStep === "goals" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-semibold flex items-center gap-2">
                        <Target className="h-5 w-5 text-primary" />
                        Goals & Success Metrics
                      </h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        Define what the AI should optimize for — this has the highest influence
                      </p>
                    </div>

                    <Card className="bg-amber-50 border-amber-200">
                      <CardContent className="py-3">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-amber-600" />
                          <p className="text-xs text-amber-900">
                            <strong>Highest Influence:</strong> This section has the greatest impact on how the AI
                            prioritizes actions.
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Primary Goal</Label>
                      <Select value={primaryGoal} onValueChange={setPrimaryGoal}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="minimize-sla-breach">Minimize SLA Breaches</SelectItem>
                          <SelectItem value="reduce-cost">Reduce Costs</SelectItem>
                          <SelectItem value="maximize-throughput">Maximize Throughput</SelectItem>
                          <SelectItem value="improve-vendor-relations">Improve Vendor Relations</SelectItem>
                          <SelectItem value="ensure-compliance">Ensure Compliance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Secondary Goals (Ranked)</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { id: "reduce-processing-time", label: "Reduce Processing Time" },
                          { id: "improve-vendor-response", label: "Improve Vendor Response Rates" },
                          { id: "optimize-spend", label: "Optimize Spend" },
                          { id: "reduce-manual-work", label: "Reduce Manual Work" },
                        ].map((goal) => (
                          <div
                            key={goal.id}
                            className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer ${
                              secondaryGoals.includes(goal.id) ? "border-primary bg-primary/5" : ""
                            }`}
                            onClick={() => toggleSecondaryGoal(goal.id)}
                          >
                            <Checkbox
                              checked={secondaryGoals.includes(goal.id)}
                              onCheckedChange={() => toggleSecondaryGoal(goal.id)}
                            />
                            <span className="text-sm">{goal.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Cost of Delay</Label>
                        <Select value={costOfDelay} onValueChange={setCostOfDelay}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low — delays are acceptable</SelectItem>
                            <SelectItem value="medium">Medium — prefer timeliness</SelectItem>
                            <SelectItem value="high">High — delays are costly</SelectItem>
                            <SelectItem value="critical">Critical — delays are unacceptable</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Speed vs Quality</Label>
                        <div className="pt-2">
                          <Slider
                            value={speedVsQuality}
                            onValueChange={setSpeedVsQuality}
                            max={100}
                            step={10}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>Quality First</span>
                            <span>Speed First</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* AI Interpretation */}
                    <Card className="bg-purple-50 border-purple-200">
                      <CardContent className="py-3">
                        <div className="flex items-start gap-2">
                          <Brain className="h-4 w-4 text-purple-600 mt-0.5" />
                          <div>
                            <p className="text-xs font-medium text-purple-900">AI Interprets As:</p>
                            <ul className="text-xs text-purple-800 mt-1 space-y-1">
                              <li>• Primary optimization objective: {primaryGoal.replace(/-/g, " ")}</li>
                              <li>• Priority tie-break guidance: {secondaryGoals.length} secondary goals</li>
                              <li>• Impact weighting bias: Cost of delay is {costOfDelay}</li>
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="flex justify-end">
                      <Button onClick={() => handleStepComplete("goals")}>
                        Continue to SLAs
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 5: Target SLAs - Complete redesign for work-type driven SLAs */}
                {activeStep === "sla" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-semibold flex items-center gap-2">
                        <Clock className="h-5 w-5 text-primary" />
                        Target SLA Definitions
                      </h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        Define SLAs per work type — clear, configurable, and comparable across work types
                      </p>
                    </div>

                    {/* Role Context Banner */}
                    <Card className="bg-blue-50 border-blue-200">
                      <CardContent className="py-3">
                        <div className="flex items-start gap-2">
                          <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                          <div>
                            <p className="text-xs font-medium text-blue-900">AI Configuration Interpreter</p>
                            <p className="text-xs text-blue-800 mt-1">
                              This section defines how different types of work are expected to be completed. You do not
                              generate actions or priorities — only translate SLA intent into structured guidance for
                              downstream AI.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* 5.1 Work Type Definition */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          5.1 Work Type Definition
                          <Badge variant="destructive" className="text-[10px]">
                            Required
                          </Badge>
                        </CardTitle>
                        <p className="text-xs text-muted-foreground">
                          Select work types to configure SLAs — each work type has its own SLA definition
                        </p>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 gap-2">
                          {workTypes.map((wt) => (
                            <div
                              key={wt.id}
                              className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                                selectedWorkTypes.includes(wt.id) ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                              }`}
                              onClick={() => toggleWorkType(wt.id)}
                            >
                              <div className="flex items-center gap-3">
                                <Checkbox
                                  checked={selectedWorkTypes.includes(wt.id)}
                                  onCheckedChange={() => toggleWorkType(wt.id)}
                                />
                                <div>
                                  <p className="text-sm font-medium">{wt.label}</p>
                                  <p className="text-xs text-muted-foreground">{wt.description}</p>
                                </div>
                              </div>
                              {selectedWorkTypes.includes(wt.id) && (
                                <Badge variant="outline" className="text-xs">
                                  {workTypeSlaConfigs[wt.id]?.slaType === "time-based" ? "Time" : "Outcome"}
                                </Badge>
                              )}
                            </div>
                          ))}
                        </div>

                        {selectedWorkTypes.length === 0 && (
                          <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg">
                            <p className="text-xs text-amber-800">
                              <AlertTriangle className="h-3 w-3 inline mr-1" />
                              Select at least one work type to configure SLAs
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Work Type Configuration Tabs */}
                    {selectedWorkTypes.length > 0 && (
                      <>
                        {/* Work Type Selector Tabs */}
                        <div className="flex gap-2 flex-wrap">
                          {selectedWorkTypes.map((wtId) => {
                            const wt = workTypes.find((w) => w.id === wtId)
                            return (
                              <Button
                                key={wtId}
                                variant={activeWorkType === wtId ? "default" : "outline"}
                                size="sm"
                                onClick={() => setActiveWorkType(wtId)}
                              >
                                {wt?.label}
                              </Button>
                            )
                          })}
                        </div>

                        {/* Active Work Type Configuration */}
                        {workTypeSlaConfigs[activeWorkType] && (
                          <div className="space-y-4 border-l-4 border-primary pl-4">
                            <p className="text-sm font-medium text-primary">
                              Configuring: {workTypes.find((w) => w.id === activeWorkType)?.label}
                            </p>

                            {/* 5.2 SLA Enforcement Mode */}
                            <Card>
                              <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium">5.2 SLA Enforcement Mode</CardTitle>
                                <p className="text-xs text-muted-foreground">
                                  Whether SLA must materially influence prioritization for this work type
                                </p>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <RadioGroup
                                  value={workTypeSlaConfigs[activeWorkType].enforcement}
                                  onValueChange={(v) => updateWorkTypeSlaConfig(activeWorkType, "enforcement", v)}
                                >
                                  <div className="grid grid-cols-3 gap-3">
                                    <div
                                      className={`flex items-start space-x-2 p-4 border rounded-lg cursor-pointer ${
                                        workTypeSlaConfigs[activeWorkType].enforcement === "enforced"
                                          ? "border-primary bg-primary/5"
                                          : ""
                                      }`}
                                      onClick={() => updateWorkTypeSlaConfig(activeWorkType, "enforcement", "enforced")}
                                    >
                                      <RadioGroupItem value="enforced" className="mt-1" />
                                      <div>
                                        <Label className="cursor-pointer font-medium">Enforced</Label>
                                        <p className="text-xs text-muted-foreground mt-1">
                                          Must materially influence prioritization
                                        </p>
                                      </div>
                                    </div>
                                    <div
                                      className={`flex items-start space-x-2 p-4 border rounded-lg cursor-pointer ${
                                        workTypeSlaConfigs[activeWorkType].enforcement === "soft"
                                          ? "border-primary bg-primary/5"
                                          : ""
                                      }`}
                                      onClick={() => updateWorkTypeSlaConfig(activeWorkType, "enforcement", "soft")}
                                    >
                                      <RadioGroupItem value="soft" className="mt-1" />
                                      <div>
                                        <Label className="cursor-pointer font-medium">Soft (Advisory)</Label>
                                        <p className="text-xs text-muted-foreground mt-1">
                                          Guidance only, can be deprioritized
                                        </p>
                                      </div>
                                    </div>
                                    <div
                                      className={`flex items-start space-x-2 p-4 border rounded-lg cursor-pointer ${
                                        workTypeSlaConfigs[activeWorkType].enforcement === "not-enforced"
                                          ? "border-primary bg-primary/5"
                                          : ""
                                      }`}
                                      onClick={() =>
                                        updateWorkTypeSlaConfig(activeWorkType, "enforcement", "not-enforced")
                                      }
                                    >
                                      <RadioGroupItem value="not-enforced" className="mt-1" />
                                      <div>
                                        <Label className="cursor-pointer font-medium">Not Enforced</Label>
                                        <p className="text-xs text-muted-foreground mt-1">Ignored by prioritization</p>
                                      </div>
                                    </div>
                                  </div>
                                </RadioGroup>
                                <div className="bg-muted/50 p-3 rounded-lg">
                                  <p className="text-xs text-muted-foreground">
                                    <span className="font-medium">AI Interprets:</span>{" "}
                                    {workTypeSlaConfigs[activeWorkType].enforcement === "enforced" &&
                                      "SLA risk is dominant — must materially influence prioritization"}
                                    {workTypeSlaConfigs[activeWorkType].enforcement === "soft" &&
                                      "SLA risk is contributory — can be deprioritized in favor of higher goals"}
                                    {workTypeSlaConfigs[activeWorkType].enforcement === "not-enforced" &&
                                      "SLA risk is ignored — not factored into prioritization"}
                                  </p>
                                </div>
                              </CardContent>
                            </Card>

                            {/* 5.3 SLA Type */}
                            <Card>
                              <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium">5.3 SLA Type</CardTitle>
                                <p className="text-xs text-muted-foreground">
                                  Select measurement model — determines how targets are defined
                                </p>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <RadioGroup
                                  value={workTypeSlaConfigs[activeWorkType].slaType}
                                  onValueChange={(v) => updateWorkTypeSlaConfig(activeWorkType, "slaType", v)}
                                >
                                  <div className="grid grid-cols-2 gap-3">
                                    <div
                                      className={`flex items-start space-x-2 p-4 border rounded-lg cursor-pointer ${
                                        workTypeSlaConfigs[activeWorkType].slaType === "time-based"
                                          ? "border-primary bg-primary/5"
                                          : ""
                                      }`}
                                      onClick={() => updateWorkTypeSlaConfig(activeWorkType, "slaType", "time-based")}
                                    >
                                      <RadioGroupItem value="time-based" className="mt-1" />
                                      <div>
                                        <Label className="cursor-pointer font-medium">Time-Based</Label>
                                        <p className="text-xs text-muted-foreground mt-1">
                                          Hours or days to completion — predictable completion window
                                        </p>
                                      </div>
                                    </div>
                                    <div
                                      className={`flex items-start space-x-2 p-4 border rounded-lg cursor-pointer ${
                                        workTypeSlaConfigs[activeWorkType].slaType === "outcome-based"
                                          ? "border-primary bg-primary/5"
                                          : ""
                                      }`}
                                      onClick={() =>
                                        updateWorkTypeSlaConfig(activeWorkType, "slaType", "outcome-based")
                                      }
                                    >
                                      <RadioGroupItem value="outcome-based" className="mt-1" />
                                      <div>
                                        <Label className="cursor-pointer font-medium">Outcome-Based</Label>
                                        <p className="text-xs text-muted-foreground mt-1">
                                          Decision completion — emphasizes outcome, not elapsed time alone
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </RadioGroup>
                              </CardContent>
                            </Card>

                            {/* 5.4 Time-Based SLA Definition (Conditional) */}
                            {workTypeSlaConfigs[activeWorkType].slaType === "time-based" && (
                              <Card>
                                <CardHeader className="pb-3">
                                  <CardTitle className="text-sm font-medium">5.4 Time-Based SLA Definition</CardTitle>
                                  <p className="text-xs text-muted-foreground">
                                    Target time, business hours, and grace period
                                  </p>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label className="text-sm">Target Time</Label>
                                      <div className="flex gap-2">
                                        <Input
                                          type="number"
                                          value={workTypeSlaConfigs[activeWorkType].targetDuration}
                                          onChange={(e) =>
                                            updateWorkTypeSlaConfig(
                                              activeWorkType,
                                              "targetDuration",
                                              Number.parseInt(e.target.value) || 0,
                                            )
                                          }
                                          className="w-24"
                                        />
                                        <Select
                                          value={workTypeSlaConfigs[activeWorkType].targetUnit}
                                          onValueChange={(v) =>
                                            updateWorkTypeSlaConfig(activeWorkType, "targetUnit", v)
                                          }
                                        >
                                          <SelectTrigger className="w-32">
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="minutes">Minutes</SelectItem>
                                            <SelectItem value="hours">Hours</SelectItem>
                                            <SelectItem value="days">Business Days</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="text-sm">Grace Period (optional)</Label>
                                      <div className="flex gap-2 items-center">
                                        <Input
                                          type="number"
                                          value={workTypeSlaConfigs[activeWorkType].gracePeriod}
                                          onChange={(e) =>
                                            updateWorkTypeSlaConfig(
                                              activeWorkType,
                                              "gracePeriod",
                                              Number.parseInt(e.target.value) || 0,
                                            )
                                          }
                                          className="w-24"
                                        />
                                        <span className="text-sm text-muted-foreground">hours</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="text-sm">Time Calculation</Label>
                                    <div className="flex gap-6">
                                      <div className="flex items-center gap-2">
                                        <Checkbox
                                          checked={workTypeSlaConfigs[activeWorkType].businessHours}
                                          onCheckedChange={(checked) =>
                                            updateWorkTypeSlaConfig(activeWorkType, "businessHours", checked)
                                          }
                                        />
                                        <Label className="text-sm cursor-pointer">Business hours only</Label>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Checkbox
                                          checked={workTypeSlaConfigs[activeWorkType].workingHoursOnly}
                                          onCheckedChange={(checked) =>
                                            updateWorkTypeSlaConfig(activeWorkType, "workingHoursOnly", checked)
                                          }
                                        />
                                        <Label className="text-sm cursor-pointer">Exclude holidays/weekends</Label>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="bg-muted/50 p-3 rounded-lg">
                                    <p className="text-xs text-muted-foreground">
                                      <span className="font-medium">AI Interprets:</span> Expected completion in{" "}
                                      {workTypeSlaConfigs[activeWorkType].targetDuration}{" "}
                                      {workTypeSlaConfigs[activeWorkType].targetUnit}
                                      {workTypeSlaConfigs[activeWorkType].businessHours && " (business hours)"}
                                      {workTypeSlaConfigs[activeWorkType].workingHoursOnly && ", excluding holidays"}
                                      {workTypeSlaConfigs[activeWorkType].gracePeriod > 0 &&
                                        ` with ${workTypeSlaConfigs[activeWorkType].gracePeriod}h grace period`}
                                      . Breach risk acceleration curve applies.
                                      {workTypeSlaConfigs[activeWorkType].enforcement !== "enforced" &&
                                        " Not treated as hard cutoff."}
                                    </p>
                                  </div>

                                  {/* Example display */}
                                  <div className="bg-slate-50 border rounded-lg p-3">
                                    <p className="text-xs font-medium text-slate-700 mb-2">Example SLA Targets:</p>
                                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                                      <div>Approval → 4 business hours</div>
                                      <div>Review → 1 business day</div>
                                      <div>Resolution → 8 calendar hours</div>
                                      <div>Acknowledgement → 30 minutes</div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            )}

                            {/* 5.5 Outcome-Based SLA Definition (Conditional) */}
                            {workTypeSlaConfigs[activeWorkType].slaType === "outcome-based" && (
                              <Card>
                                <CardHeader className="pb-3">
                                  <CardTitle className="text-sm font-medium">
                                    5.5 Outcome-Based SLA Definition
                                  </CardTitle>
                                  <p className="text-xs text-muted-foreground">
                                    Required outcome, intermediate states, and maximum duration
                                  </p>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                  <div className="space-y-2">
                                    <Label className="text-sm">Required Outcome</Label>
                                    <Select
                                      value={workTypeSlaConfigs[activeWorkType].requiredOutcome}
                                      onValueChange={(v) =>
                                        updateWorkTypeSlaConfig(activeWorkType, "requiredOutcome", v)
                                      }
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="decision-recorded">
                                          Decision recorded (approve or reject)
                                        </SelectItem>
                                        <SelectItem value="comments-added">
                                          Comments added or marked reviewed
                                        </SelectItem>
                                        <SelectItem value="status-resolved">Status changed to resolved</SelectItem>
                                        <SelectItem value="response-sent">Response sent</SelectItem>
                                        <SelectItem value="acknowledged">Explicit acknowledgment logged</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div className="space-y-2">
                                    <Label className="text-sm">Acceptable Intermediate States (optional)</Label>
                                    <div className="flex flex-wrap gap-2">
                                      {["in-progress", "draft-saved", "pending-info", "under-review"].map((state) => (
                                        <Badge
                                          key={state}
                                          variant={
                                            workTypeSlaConfigs[activeWorkType].acceptableIntermediateStates?.includes(
                                              state,
                                            )
                                              ? "default"
                                              : "outline"
                                          }
                                          className="cursor-pointer capitalize"
                                          onClick={() => toggleIntermediateState(activeWorkType, state)}
                                        >
                                          {state.replace(/-/g, " ")}
                                        </Badge>
                                      ))}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                      States that count as progress toward completion
                                    </p>
                                  </div>

                                  <div className="space-y-2">
                                    <Label className="text-sm">Maximum Duration Without Outcome (optional)</Label>
                                    <div className="flex gap-2 items-center">
                                      <Input
                                        type="number"
                                        value={workTypeSlaConfigs[activeWorkType].maxDurationWithoutOutcome}
                                        onChange={(e) =>
                                          updateWorkTypeSlaConfig(
                                            activeWorkType,
                                            "maxDurationWithoutOutcome",
                                            Number.parseInt(e.target.value) || 0,
                                          )
                                        }
                                        className="w-24"
                                      />
                                      <span className="text-sm text-muted-foreground">hours (0 = no limit)</span>
                                    </div>
                                  </div>

                                  <div className="bg-muted/50 p-3 rounded-lg">
                                    <p className="text-xs text-muted-foreground">
                                      <span className="font-medium">AI Interprets:</span> SLA completed when{" "}
                                      {workTypeSlaConfigs[activeWorkType].requiredOutcome.replace(/-/g, " ")} is
                                      achieved.
                                      {workTypeSlaConfigs[activeWorkType].acceptableIntermediateStates?.length > 0
                                        ? " Partial progress reduces risk."
                                        : " Outcome ambiguity increases uncertainty."}
                                      {workTypeSlaConfigs[activeWorkType].maxDurationWithoutOutcome > 0 &&
                                        ` Risk increases after ${workTypeSlaConfigs[activeWorkType].maxDurationWithoutOutcome}h without outcome.`}
                                    </p>
                                  </div>

                                  {/* Example display */}
                                  <div className="bg-slate-50 border rounded-lg p-3">
                                    <p className="text-xs font-medium text-slate-700 mb-2">Example Outcome SLAs:</p>
                                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                                      <div>Approval → Decision recorded</div>
                                      <div>Review → Comments added</div>
                                      <div>Resolution → Status resolved</div>
                                      <div>Furnish Info → Response sent</div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            )}

                            {/* 5.6 SLA Severity & Impact */}
                            <Card>
                              <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium">5.6 SLA Severity & Impact</CardTitle>
                                <p className="text-xs text-muted-foreground">Urgency inflation and risk weighting</p>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <div className="grid grid-cols-3 gap-4">
                                  <div className="space-y-2">
                                    <Label className="text-sm">Severity Level</Label>
                                    <Select
                                      value={workTypeSlaConfigs[activeWorkType].severity}
                                      onValueChange={(v) => updateWorkTypeSlaConfig(activeWorkType, "severity", v)}
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="critical">Critical</SelectItem>
                                        <SelectItem value="standard">Standard</SelectItem>
                                        <SelectItem value="low">Low</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="text-sm">Penalty Magnitude</Label>
                                    <Select
                                      value={workTypeSlaConfigs[activeWorkType].penaltyMagnitude}
                                      onValueChange={(v) =>
                                        updateWorkTypeSlaConfig(activeWorkType, "penaltyMagnitude", v)
                                      }
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="high">High</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="low">Low</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="text-sm">Downstream Impact</Label>
                                    <Input
                                      value={workTypeSlaConfigs[activeWorkType].downstreamImpact}
                                      onChange={(e) =>
                                        updateWorkTypeSlaConfig(activeWorkType, "downstreamImpact", e.target.value)
                                      }
                                      placeholder="Impact if breached"
                                    />
                                  </div>
                                </div>
                                <div className="bg-muted/50 p-3 rounded-lg">
                                  <p className="text-xs text-muted-foreground">
                                    <span className="font-medium">AI Interprets:</span>{" "}
                                    {workTypeSlaConfigs[activeWorkType].severity} severity with{" "}
                                    {workTypeSlaConfigs[activeWorkType].penaltyMagnitude} risk magnitude —
                                    {workTypeSlaConfigs[activeWorkType].severity === "critical" &&
                                      " urgency inflation applied, escalation importance high"}
                                    {workTypeSlaConfigs[activeWorkType].severity === "standard" &&
                                      " balanced urgency weighting"}
                                    {workTypeSlaConfigs[activeWorkType].severity === "low" &&
                                      " minimal urgency inflation"}
                                  </p>
                                </div>
                              </CardContent>
                            </Card>

                            {/* 5.7 SLA Visibility & Escalation */}
                            <Card>
                              <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium">5.7 SLA Visibility & Escalation</CardTitle>
                                <p className="text-xs text-muted-foreground">
                                  Who sees SLA risk and escalation behavior
                                </p>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <div className="grid grid-cols-3 gap-4">
                                  <div className="space-y-2">
                                    <Label className="text-sm">Visibility</Label>
                                    <Select
                                      value={workTypeSlaConfigs[activeWorkType].visibility}
                                      onValueChange={(v) => updateWorkTypeSlaConfig(activeWorkType, "visibility", v)}
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="user-only">User Only</SelectItem>
                                        <SelectItem value="user-manager">User + Manager</SelectItem>
                                        <SelectItem value="org-wide">Organization-wide</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="text-sm">Escalation Preference</Label>
                                    <Select
                                      value={workTypeSlaConfigs[activeWorkType].escalationPreference}
                                      onValueChange={(v) =>
                                        updateWorkTypeSlaConfig(activeWorkType, "escalationPreference", v)
                                      }
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="auto-escalate">Auto-escalate on breach</SelectItem>
                                        <SelectItem value="notify-only">Notify only</SelectItem>
                                        <SelectItem value="silent">Silent tracking</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="text-sm">Grace Period Tolerance</Label>
                                    <div className="flex gap-2 items-center">
                                      <Input
                                        type="number"
                                        value={workTypeSlaConfigs[activeWorkType].gracePeriodTolerance}
                                        onChange={(e) =>
                                          updateWorkTypeSlaConfig(
                                            activeWorkType,
                                            "gracePeriodTolerance",
                                            Number.parseInt(e.target.value) || 0,
                                          )
                                        }
                                        className="w-20"
                                      />
                                      <span className="text-sm text-muted-foreground">hours</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="bg-muted/50 p-3 rounded-lg">
                                  <p className="text-xs text-muted-foreground">
                                    <span className="font-medium">AI Interprets:</span> Alert routing to{" "}
                                    {workTypeSlaConfigs[activeWorkType].visibility.replace(/-/g, " ")},
                                    {workTypeSlaConfigs[activeWorkType].escalationPreference === "auto-escalate" &&
                                      " auto-escalation enabled on breach"}
                                    {workTypeSlaConfigs[activeWorkType].escalationPreference === "notify-only" &&
                                      " notifications only"}
                                    {workTypeSlaConfigs[activeWorkType].escalationPreference === "silent" &&
                                      " silent tracking"}
                                    {workTypeSlaConfigs[activeWorkType].gracePeriodTolerance > 0 &&
                                      `, ${workTypeSlaConfigs[activeWorkType].gracePeriodTolerance}h escalation delay allowance`}
                                  </p>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        )}
                      </>
                    )}

                    {/* Configuration Summary */}
                    {selectedWorkTypes.length > 0 && (
                      <Card className="bg-slate-50 border-slate-200">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Configuration Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="overflow-x-auto">
                            <table className="w-full text-xs">
                              <thead>
                                <tr className="border-b">
                                  <th className="text-left py-2 pr-4">Work Type</th>
                                  <th className="text-left py-2 pr-4">SLA Type</th>
                                  <th className="text-left py-2 pr-4">Target</th>
                                  <th className="text-left py-2 pr-4">Enforcement</th>
                                  <th className="text-left py-2">Severity</th>
                                </tr>
                              </thead>
                              <tbody>
                                {selectedWorkTypes.map((wtId) => {
                                  const wt = workTypes.find((w) => w.id === wtId)
                                  const config = workTypeSlaConfigs[wtId]
                                  return (
                                    <tr key={wtId} className="border-b last:border-0">
                                      <td className="py-2 pr-4 font-medium">{wt?.label}</td>
                                      <td className="py-2 pr-4 capitalize">{config.slaType.replace("-", " ")}</td>
                                      <td className="py-2 pr-4">
                                        {config.slaType === "time-based"
                                          ? `${config.targetDuration} ${config.targetUnit}`
                                          : config.requiredOutcome.replace(/-/g, " ")}
                                      </td>
                                      <td className="py-2 pr-4">
                                        <Badge
                                          variant={
                                            config.enforcement === "enforced"
                                              ? "default"
                                              : config.enforcement === "soft"
                                                ? "secondary"
                                                : "outline"
                                          }
                                          className="text-[10px]"
                                        >
                                          {config.enforcement}
                                        </Badge>
                                      </td>
                                      <td className="py-2">
                                        <Badge
                                          variant={
                                            config.severity === "critical"
                                              ? "destructive"
                                              : config.severity === "standard"
                                                ? "secondary"
                                                : "outline"
                                          }
                                          className="text-[10px]"
                                        >
                                          {config.severity}
                                        </Badge>
                                      </td>
                                    </tr>
                                  )
                                })}
                              </tbody>
                            </table>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* SLA Interpretation Principles */}
                    <Card className="bg-purple-50 border-purple-200">
                      <CardContent className="py-4">
                        <div className="flex items-start gap-3">
                          <Brain className="h-5 w-5 text-purple-600 mt-0.5" />
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-purple-900">SLA Interpretation Principles</p>
                            <ul className="text-xs text-purple-800 space-y-1">
                              <li>• SLAs are defined by work type — each work type can have different targets</li>
                              <li>
                                • Time-based SLAs focus on duration; Outcome-based SLAs focus on decision completion
                              </li>
                              <li>• Enforcement mode determines how strongly SLA affects prioritization</li>
                              <li>• SLAs are treated as predictive risk signals, not timers</li>
                              <li>• Never assume enforcement by default</li>
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Guardrails */}
                    <Card className="border-amber-200 bg-amber-50">
                      <CardContent className="py-4">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-amber-900">Guardrails</p>
                            <ul className="text-xs text-amber-800 space-y-1">
                              <li>• Do not generate actions or alerts at this stage</li>
                              <li>• Do not infer SLA targets — use only admin-defined values</li>
                              <li>• Do not mix time-based and outcome-based logic within same work type</li>
                              <li>• Do not override admin-defined enforcement mode</li>
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="flex justify-end">
                      <Button onClick={() => handleStepComplete("sla")} disabled={selectedWorkTypes.length === 0}>
                        Continue to Behavior
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 6: Behavior Preferences */}
                {activeStep === "behavior" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-semibold flex items-center gap-2">
                        <Brain className="h-5 w-5 text-primary" />
                        Behavior Preferences
                      </h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        Configure work style and cognitive load — influences when and how much, not what
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Work Style</Label>
                      <RadioGroup value={workStyle} onValueChange={setWorkStyle}>
                        <div className="grid grid-cols-2 gap-3">
                          <div
                            className={`flex items-center space-x-2 p-4 border rounded-lg cursor-pointer ${
                              workStyle === "reactive" ? "border-primary bg-primary/5" : ""
                            }`}
                            onClick={() => setWorkStyle("reactive")}
                          >
                            <RadioGroupItem value="reactive" id="reactive" />
                            <div>
                              <Label htmlFor="reactive" className="cursor-pointer">
                                Reactive
                              </Label>
                              <p className="text-xs text-muted-foreground">Respond as items arrive</p>
                            </div>
                          </div>
                          <div
                            className={`flex items-center space-x-2 p-4 border rounded-lg cursor-pointer ${
                              workStyle === "planned" ? "border-primary bg-primary/5" : ""
                            }`}
                            onClick={() => setWorkStyle("planned")}
                          >
                            <RadioGroupItem value="planned" id="planned" />
                            <div>
                              <Label htmlFor="planned" className="cursor-pointer">
                                Planned
                              </Label>
                              <p className="text-xs text-muted-foreground">Batch and schedule work</p>
                            </div>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Focus Tolerance</Label>
                        <Select value={focusTolerance} onValueChange={setFocusTolerance}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low — minimize interruptions</SelectItem>
                            <SelectItem value="medium">Medium — balanced</SelectItem>
                            <SelectItem value="high">High — can handle frequent switches</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Task Grouping</Label>
                        <Select value={taskGrouping} onValueChange={setTaskGrouping}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="by-module">By Module</SelectItem>
                            <SelectItem value="by-priority">By Priority</SelectItem>
                            <SelectItem value="by-vendor">By Vendor</SelectItem>
                            <SelectItem value="by-deadline">By Deadline</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Peak Productivity Window</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Start Time</Label>
                          <Input
                            type="time"
                            value={peakHoursStart}
                            onChange={(e) => setPeakHoursStart(e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">End Time</Label>
                          <Input type="time" value={peakHoursEnd} onChange={(e) => setPeakHoursEnd(e.target.value)} />
                        </div>
                      </div>
                    </div>

                    {/* AI Interpretation */}
                    <Card className="bg-purple-50 border-purple-200">
                      <CardContent className="py-3">
                        <div className="flex items-start gap-2">
                          <Brain className="h-4 w-4 text-purple-600 mt-0.5" />
                          <div>
                            <p className="text-xs font-medium text-purple-900">AI Interprets As:</p>
                            <ul className="text-xs text-purple-800 mt-1 space-y-1">
                              <li>• Feed ordering preference: {workStyle}</li>
                              <li>• Interruption sensitivity: {focusTolerance}</li>
                              <li>• Cognitive load limits: Group by {taskGrouping.replace(/-/g, " ")}</li>
                              <li className="text-purple-900 font-medium">
                                These influence when and how much, not what.
                              </li>
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="flex justify-end">
                      <Button onClick={() => handleStepComplete("behavior")}>
                        Continue to Notifications
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 7: Notification Preferences */}
                {activeStep === "notifications" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-semibold flex items-center gap-2">
                        <Bell className="h-5 w-5 text-primary" />
                        Notification Preferences
                      </h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        Configure alert channels and thresholds — the Action Feed is the primary surface
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Allowed Notification Channels</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { id: "in-app", label: "In-App Notifications", icon: BellRing },
                          { id: "email", label: "Email", icon: Bell },
                          { id: "sms", label: "SMS", icon: Bell },
                          { id: "slack", label: "Slack", icon: Bell },
                        ].map((channel) => (
                          <div
                            key={channel.id}
                            className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer ${
                              notificationChannels.includes(channel.id) ? "border-primary bg-primary/5" : ""
                            }`}
                            onClick={() => toggleNotificationChannel(channel.id)}
                          >
                            <Checkbox
                              checked={notificationChannels.includes(channel.id)}
                              onCheckedChange={() => toggleNotificationChannel(channel.id)}
                            />
                            <channel.icon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{channel.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Alert Threshold</Label>
                        <Select value={alertThreshold} onValueChange={setAlertThreshold}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Actions</SelectItem>
                            <SelectItem value="high-priority">High Priority Only</SelectItem>
                            <SelectItem value="urgent-only">Urgent Only</SelectItem>
                            <SelectItem value="sla-breach">SLA Breach Only</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Escalation Timing</Label>
                        <Select value={escalationTiming} onValueChange={setEscalationTiming}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="immediate">Immediate</SelectItem>
                            <SelectItem value="after-30-min">After 30 minutes</SelectItem>
                            <SelectItem value="after-1-hour">After 1 hour</SelectItem>
                            <SelectItem value="after-4-hours">After 4 hours</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Summary Preference</Label>
                      <RadioGroup value={summaryPreference} onValueChange={setSummaryPreference}>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { id: "real-time", label: "Real-Time" },
                            { id: "daily-digest", label: "Daily Digest" },
                            { id: "weekly-summary", label: "Weekly Summary" },
                          ].map((pref) => (
                            <div
                              key={pref.id}
                              className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer ${
                                summaryPreference === pref.id ? "border-primary bg-primary/5" : ""
                              }`}
                              onClick={() => setSummaryPreference(pref.id)}
                            >
                              <RadioGroupItem value={pref.id} id={pref.id} />
                              <Label htmlFor={pref.id} className="cursor-pointer text-sm">
                                {pref.label}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>

                    {/* AI Interpretation */}
                    <Card className="bg-purple-50 border-purple-200">
                      <CardContent className="py-3">
                        <div className="flex items-start gap-2">
                          <Brain className="h-4 w-4 text-purple-600 mt-0.5" />
                          <div>
                            <p className="text-xs font-medium text-purple-900">AI Interprets As:</p>
                            <ul className="text-xs text-purple-800 mt-1 space-y-1">
                              <li>• Attention budget: {notificationChannels.length} channels</li>
                              <li>• Alert suppression boundaries: {alertThreshold.replace(/-/g, " ")}</li>
                              <li>• Escalation delay tolerance: {escalationTiming.replace(/-/g, " ")}</li>
                              <li className="text-purple-900 font-medium">The Action Feed is the primary surface.</li>
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="flex justify-between pt-4 border-t">
                      <Button variant="outline" onClick={() => setActiveStep("behavior")}>
                        Back
                      </Button>
                      <div className="flex gap-2">
                        <Button variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          Preview Feed
                        </Button>
                        <Button onClick={() => handleStepComplete("notifications")}>
                          <Save className="h-4 w-4 mr-1" />
                          Save Configuration
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
