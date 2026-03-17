"use client"

import React from "react"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Header } from "@/components/header"
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Filter,
  X,
  TrendingUp,
  Users,
  Link2,
  Pin,
  PinOff,
  MousePointerClick,
  Activity,
  Calendar,
  Zap,
  FileText,
  ShoppingCart,
  UserCheck,
  Truck,
  MoreHorizontal,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Circle,
  AlertCircle,
  Plus,
  Upload,
  Ban,
  Search,
  Timer,
  CalendarClock,
  CircleDot,
  CircleAlert,
  CircleCheck,
  CirclePause,
  FileQuestion,
  ClipboardList,
  Receipt,
  FileSignature,
  Building2,
  Clock,
  Play,
  Download,
  Forward,
  Trash2,
  Eye,
  MessageSquare,
  Settings2,
  GripVertical,
  CreditCard,
  FilePlus,
  FileCheck,
  RefreshCw,
  Leaf,
  Heart,
  Shield,
  ClipboardCheck,
  SearchCheck,
  BarChart3,
  Bookmark,
  Layout,
  RotateCcw,
  UserPlus,
} from "lucide-react"

// Module definitions
const modules = [
  { id: "invoice", label: "Invoice", icon: FileText },
  { id: "rfq", label: "RFQ", icon: ShoppingCart },
  { id: "onboarding", label: "Onboarding", icon: Users },
  { id: "po", label: "Purchase Order", icon: Truck },
  { id: "prescreening", label: "Pre-Screening", icon: UserCheck },
  { id: "esg", label: "ESG", icon: Activity },
]

// Task types
const taskTypes = [
  { id: "approval", label: "Approval" },
  { id: "review", label: "Review" },
  { id: "resolution", label: "Resolution" },
  { id: "acknowledgement", label: "Acknowledgement" },
  { id: "information", label: "Information" },
]

const allTasks = [
  {
    id: "603076",
    taskId: "T001",
    taskType: "approval",
    module: "invoice",
    status: "pending",
    slaDue: "2h",
    slaUrgency: "critical",
    owner: "John Doe",
    priority: "critical",
    docType: "INV",
    processStage: "Approval · 2/3",
    companyCode: "9000",
    vendor: "Jindal Steel",
    invoiceAmount: "₹45,000",
    paymentDate: "28-02-2025",
    invoiceNumber: "INV-2025-001",
    caseId: "CHA-603076",
    vendorCode: "0000083733",
    rfqType: "Material",
    assignedDate: "17-01-2026",
    slaOverdue: "4h",
  },
  {
    id: "144108",
    taskId: "T002",
    taskType: "review",
    module: "rfq",
    status: "in-progress",
    slaDue: "4h",
    slaUrgency: "critical",
    owner: "Jane Smith",
    priority: "critical",
    docType: "RFQ",
    processStage: "Review · 1/2",
    companyCode: "9000",
    supplier: "Tech Solutions",
    rfqValue: "₹2,50,000",
    rfqNumber: "RFQ-2025-042",
    requestorName: "Amit Shah",
    budgetCode: "BUD-2025-001",
    vendorCode: "0000084521",
    rfqType: "Service",
    assignedDate: "18-01-2026",
    slaOverdue: "2h",
  },
  {
    id: "144107",
    taskId: "T003",
    taskType: "approval",
    module: "po",
    status: "pending",
    slaDue: "6h",
    slaUrgency: "high",
    owner: "John Doe",
    priority: "high",
    docType: "NFA",
    processStage: "Approval · L2",
    companyCode: "9000",
    requestValue: "₹1,20,000",
    approvalStage: "L2",
    poNumber: "PO-2025-089",
    initiator: "Rahul Verma",
    costCenter: "CC-PROC-01",
    primaryEntity: "Logistics Pro",
    vendorCode: "0000073507",
    rfqType: "Material",
    assignedDate: "16-01-2026",
    slaOverdue: "-",
  },
  {
    id: "51692",
    taskId: "T004",
    taskType: "resolution",
    module: "invoice",
    status: "in-progress",
    slaDue: "8h",
    slaUrgency: "high",
    owner: "Mike Johnson",
    priority: "high",
    docType: "INV",
    processStage: "Resolution",
    companyCode: "9000",
    vendor: "Power Corp",
    invoiceAmount: "₹78,500",
    paymentDate: "15-03-2025",
    invoiceNumber: "INV-2025-002",
    caseId: "CHA-51692",
    vendorCode: "0000922779",
    rfqType: "Material",
    assignedDate: "15-01-2026",
    slaOverdue: "-",
  },
  {
    id: "51693",
    taskId: "T005",
    taskType: "acknowledgement",
    module: "onboarding",
    status: "pending",
    slaDue: "12h",
    slaUrgency: "medium",
    owner: "Sarah Lee",
    priority: "medium",
    docType: "VND",
    processStage: "Doc Review",
    companyCode: "9000",
    entityName: "New Vendor Inc.",
    onboardingStage: "Document Review",
    requestedBy: "Priya Patel",
    inviteDate: "10-01-2025",
    vendorCode: "0000085123",
    rfqType: "-",
    assignedDate: "14-01-2026",
    slaOverdue: "-",
  },
  {
    id: "51694",
    taskId: "T006",
    taskType: "review",
    module: "rfq",
    status: "pending",
    slaDue: "1d",
    slaUrgency: "medium",
    owner: "John Doe",
    priority: "medium",
    docType: "RFQ",
    processStage: "Review · 2/2",
    companyCode: "9000",
    supplier: "Global Parts Ltd",
    rfqValue: "₹5,00,000",
    rfqNumber: "RFQ-2025-043",
    requestorName: "Vikram Singh",
    budgetCode: "BUD-2025-002",
    vendorCode: "0000086234",
    rfqType: "Material",
    assignedDate: "13-01-2026",
    slaOverdue: "-",
  },
  {
    id: "51695",
    taskId: "T007",
    taskType: "information",
    module: "invoice",
    status: "completed",
    slaDue: "—",
    slaUrgency: "low",
    owner: "Jane Smith",
    priority: "low",
    docType: "INV",
    processStage: "Complete",
    companyCode: "9000",
    vendor: "Steel Works",
    invoiceAmount: "₹32,000",
    paymentDate: "10-03-2025",
    invoiceNumber: "INV-2025-003",
    caseId: "CHA-51695",
    vendorCode: "0000063359",
    rfqType: "Material",
    assignedDate: "10-01-2026",
    slaOverdue: "-",
  },
  {
    id: "51696",
    taskId: "T008",
    taskType: "approval",
    module: "po",
    status: "pending",
    slaDue: "3h",
    slaUrgency: "critical",
    owner: "Mike Johnson",
    priority: "critical",
    docType: "NFA",
    processStage: "Approval · L3",
    companyCode: "9000",
    requestValue: "₹3,50,000",
    approvalStage: "L3",
    poNumber: "PO-2025-090",
    initiator: "Suresh Kumar",
    costCenter: "CC-PROC-02",
    primaryEntity: "Heavy Machinery",
    vendorCode: "0000087345",
    rfqType: "Service",
    assignedDate: "17-01-2026",
    slaOverdue: "1h",
  },
  {
    id: "51697",
    taskId: "T009",
    taskType: "review",
    module: "onboarding",
    status: "in-progress",
    slaDue: "5h",
    slaUrgency: "critical",
    owner: "Sarah Lee",
    priority: "critical",
    docType: "VND",
    processStage: "Compliance",
    companyCode: "9000",
    entityName: "Prime Supplies",
    onboardingStage: "Compliance Check",
    requestedBy: "Anjali Sharma",
    inviteDate: "05-01-2025",
    vendorCode: "0000088456",
    rfqType: "-",
    assignedDate: "18-01-2026",
    slaOverdue: "3h",
  },
  {
    id: "51698",
    taskId: "T010",
    taskType: "approval",
    module: "invoice",
    status: "pending",
    slaDue: "10h",
    slaUrgency: "high",
    owner: "John Doe",
    priority: "high",
    docType: "INV",
    processStage: "Approval · 1/3",
    companyCode: "9000",
    vendor: "Logistics Pro",
    invoiceAmount: "₹95,000",
    paymentDate: "20-03-2025",
    invoiceNumber: "INV-2025-004",
    caseId: "CHA-51698",
    vendorCode: "0000073507",
    rfqType: "Material",
    assignedDate: "12-01-2026",
    slaOverdue: "-",
  },
  {
    id: "51699",
    taskId: "T011",
    taskType: "resolution",
    module: "rfq",
    status: "escalated",
    slaDue: "2h",
    slaUrgency: "critical",
    owner: "Jane Smith",
    priority: "critical",
    docType: "RFQ",
    processStage: "Escalated",
    companyCode: "9000",
    supplier: "Heavy Industries",
    rfqValue: "₹8,00,000",
    rfqNumber: "RFQ-2025-044",
    requestorName: "Karan Mehta",
    budgetCode: "BUD-2025-003",
    vendorCode: "0000089567",
    rfqType: "Service",
    assignedDate: "16-01-2026",
    slaOverdue: "6h",
  },
  {
    id: "51700",
    taskId: "T012",
    taskType: "acknowledgement",
    module: "po",
    status: "pending",
    slaDue: "24h",
    slaUrgency: "low",
    owner: "Mike Johnson",
    priority: "low",
    docType: "NFA",
    processStage: "Ack Pending",
    companyCode: "9000",
    requestValue: "₹45,000",
    approvalStage: "L1",
    poNumber: "PO-2025-091",
    initiator: "Deepak Joshi",
    costCenter: "CC-ADMIN-01",
    primaryEntity: "Office Supplies Co",
    vendorCode: "0000090678",
    rfqType: "Material",
    assignedDate: "11-01-2026",
    slaOverdue: "-",
  },
]

// Action Feed items with semantic icon colors
const actionFeedItems = [
  {
    id: "critical-sla",
    icon: AlertTriangle,
    sentence: "5 approvals are critical and nearing SLA",
    filter: { slaUrgency: "critical" },
    iconColor: "text-red-600",
  },
  {
    id: "blocking",
    icon: Link2,
    sentence: "3 reviews are blocking downstream work",
    filter: { taskType: "review", status: "in-progress" },
    iconColor: "text-amber-600",
  },
  {
    id: "acknowledgement",
    icon: Pin,
    sentence: "2 items need acknowledgement today",
    filter: { taskType: "acknowledgement" },
    iconColor: "text-muted-foreground",
  },
  {
    id: "safe-defer",
    icon: CheckCircle2,
    sentence: "8 tasks can safely wait until tomorrow",
    filter: { slaUrgency: "low" },
    iconColor: "text-green-600",
  },
]

// Operational Brief items
const operationalBriefs = [
  { icon: TrendingUp, text: "15% productivity up this week" },
  { icon: Activity, text: "Team workload 23% higher today" },
  { icon: Users, text: "2 team members on leave" },
  { icon: Calendar, text: "Public holiday on Friday" },
  { icon: Zap, text: "0 escalations pending" },
]

// Module task counts for Operational Brief
const moduleTaskCounts = [
  { id: "rfq", label: "RFQ", count: 20, icon: ShoppingCart, color: "bg-blue-500" },
  { id: "prescreening", label: "Pre-Screening", count: 10, icon: UserCheck, color: "bg-purple-500" },
  { id: "invoice", label: "Invoice", count: 21, icon: FileText, color: "bg-emerald-500" },
  { id: "po", label: "Purchase Order", count: 8, icon: Truck, color: "bg-orange-500" },
  { id: "esg", label: "ESG", count: 1, icon: Activity, color: "bg-teal-500" },
  { id: "onboarding", label: "Onboarding", count: 5, icon: Users, color: "bg-pink-500" },
]

// Queues
const queues = [
  { id: "all", label: "My Tasks", count: 12 },
  { id: "urgent", label: "Urgent Tasks", count: 3 },
  { id: "team", label: "Team Tasks", count: 8 },
]

export default function InboxContent() {
  const router = useRouter()
  const [activeQueue, setActiveQueue] = useState("all")
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [selectedTasks, setSelectedTasks] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [bulkActionModal, setBulkActionModal] = useState<{
    isOpen: boolean
    action: "approve" | "reject" | "assign" | "reassign" | null
  }>({ isOpen: false, action: null })
  const [approvalComments, setApprovalComments] = useState<Record<string, string>>({})
  const [taskAssignees, setTaskAssignees] = useState<Record<string, { id: string; name: string; email: string } | null>>({})
  const [assigneeSearchQuery, setAssigneeSearchQuery] = useState<Record<string, string>>({})

  // Mock users list for assignment
  const availableUsers = [
    { id: "u1", name: "John Smith", email: "john.smith@company.com", department: "AP Team" },
    { id: "u2", name: "Sarah Johnson", email: "sarah.johnson@company.com", department: "AP Team" },
    { id: "u3", name: "Michael Kumar", email: "michael.kumar@company.com", department: "Finance" },
    { id: "u4", name: "Emily Chen", email: "emily.chen@company.com", department: "Procurement" },
    { id: "u5", name: "David Wilson", email: "david.wilson@company.com", department: "AP Team" },
    { id: "u6", name: "Lisa Anderson", email: "lisa.anderson@company.com", department: "Finance" },
    { id: "u7", name: "Robert Taylor", email: "robert.taylor@company.com", department: "Procurement" },
    { id: "u8", name: "Amanda Martinez", email: "amanda.martinez@company.com", department: "AP Team" },
  ]
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(true)

  // Filter states
  const [moduleFilter, setModuleFilter] = useState<string>("all") // All Process
  const [subTaskProcessFilter, setSubTaskProcessFilter] = useState<string>("all") // All Sub task process (was statusFilter)
  const [stageFilter, setStageFilter] = useState<string>("all") // All Stages
  const [taskTypeFilter, setTaskTypeFilter] = useState<string>("all") // Task Type filter
  const [statusFilter, setStatusFilter] = useState<string>("all") // New All Status filter
  const [itemTypeFilter, setItemTypeFilter] = useState<string>("all") // All Items filter
  const [ownerFilter, setOwnerFilter] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState<string>("")
  
  // Advanced filter states
  const [dateRangeFilter, setDateRangeFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [slaFilter, setSlaFilter] = useState<string>("all")
  const [companyCodeFilter, setCompanyCodeFilter] = useState<string>("")
  const [vendorFilter, setVendorFilter] = useState<string>("")
  const [valueMinFilter, setValueMinFilter] = useState<string>("")
  const [valueMaxFilter, setValueMaxFilter] = useState<string>("")
  
  // Saved filters
  const [savedFilters, setSavedFilters] = useState<Array<{
    id: string
    name: string
    filters: {
      moduleFilter: string
      subTaskProcessFilter: string
      stageFilter: string
      statusFilter: string
      itemTypeFilter: string
      ownerFilter: string
      dateRangeFilter: string
      priorityFilter: string
      slaFilter: string
      companyCodeFilter: string
      vendorFilter: string
      valueMinFilter: string
      valueMaxFilter: string
    }
    createdAt: string
  }>>([
    {
      id: "1",
      name: "High Priority Invoices",
      filters: {
        moduleFilter: "invoice",
        subTaskProcessFilter: "all",
        stageFilter: "all",
        statusFilter: "all",
        itemTypeFilter: "all",
        ownerFilter: "",
        dateRangeFilter: "last7days",
        priorityFilter: "high",
        slaFilter: "all",
        companyCodeFilter: "",
        vendorFilter: "",
        valueMinFilter: "",
        valueMaxFilter: "",
      },
      createdAt: "2024-01-15",
    },
    {
      id: "2",
      name: "Overdue Tasks",
      filters: {
        moduleFilter: "all",
        subTaskProcessFilter: "all",
        stageFilter: "all",
        statusFilter: "all",
        itemTypeFilter: "all",
        ownerFilter: "",
        dateRangeFilter: "all",
        priorityFilter: "all",
        slaFilter: "overdue",
        companyCodeFilter: "",
        vendorFilter: "",
        valueMinFilter: "",
        valueMaxFilter: "",
      },
      createdAt: "2024-01-10",
    },
    {
      id: "3",
      name: "RFQ Pending Approval",
      filters: {
        moduleFilter: "rfq",
        subTaskProcessFilter: "all",
        stageFilter: "pending",
        statusFilter: "all",
        itemTypeFilter: "all",
        ownerFilter: "",
        dateRangeFilter: "all",
        priorityFilter: "all",
        slaFilter: "all",
        companyCodeFilter: "",
        vendorFilter: "",
        valueMinFilter: "",
        valueMaxFilter: "",
      },
      createdAt: "2024-01-08",
    },
  ])
  const [showSaveFilterDialog, setShowSaveFilterDialog] = useState(false)
  const [newFilterName, setNewFilterName] = useState("")
  const [activeFilterTab, setActiveFilterTab] = useState<"filters" | "saved">("filters")

  // Column definitions
  type ColumnId = "criticality" | "taskId" | "docId" | "type" | "stage" | "value" | "coCode" | "vendorCode" | "vendorName" | "rfqType" | "assignedDate" | "slaOverdue" | "status"

  const columnConfig: { id: ColumnId; label: string; minWidth: string; sortable: boolean; searchable: boolean; defaultFrozen: boolean }[] = [
    { id: "criticality", label: "Criticality", minWidth: "50px", sortable: true, searchable: false, defaultFrozen: true },
    { id: "taskId", label: "Task ID", minWidth: "70px", sortable: true, searchable: true, defaultFrozen: true },
    { id: "docId", label: "Doc ID", minWidth: "90px", sortable: true, searchable: true, defaultFrozen: true },
    { id: "type", label: "Type", minWidth: "70px", sortable: true, searchable: true, defaultFrozen: true },
    { id: "stage", label: "Stage", minWidth: "100px", sortable: true, searchable: true, defaultFrozen: false },
    { id: "value", label: "Value", minWidth: "90px", sortable: true, searchable: true, defaultFrozen: false },
    { id: "coCode", label: "Co.", minWidth: "70px", sortable: true, searchable: true, defaultFrozen: false },
    { id: "vendorCode", label: "Vendor Code", minWidth: "100px", sortable: true, searchable: true, defaultFrozen: false },
    { id: "vendorName", label: "Vendor Name", minWidth: "120px", sortable: true, searchable: true, defaultFrozen: false },
    { id: "rfqType", label: "Type", minWidth: "80px", sortable: true, searchable: true, defaultFrozen: false },
    { id: "assignedDate", label: "Assigned Date", minWidth: "100px", sortable: true, searchable: true, defaultFrozen: false },
    { id: "slaOverdue", label: "SLA Overdue", minWidth: "90px", sortable: true, searchable: false, defaultFrozen: false },
    { id: "status", label: "Status", minWidth: "90px", sortable: true, searchable: true, defaultFrozen: false },
  ]

  // Column sorting state: null | "asc" | "desc"
  const [columnSort, setColumnSort] = useState<{ columnId: ColumnId; direction: "asc" | "desc" } | null>(null)

  // Column search state
  const [columnSearches, setColumnSearches] = useState<Record<ColumnId, string>>({
    criticality: "",
    taskId: "",
    docId: "",
    type: "",
    stage: "",
    value: "",
    coCode: "",
    vendorCode: "",
    vendorName: "",
    rfqType: "",
    assignedDate: "",
    slaOverdue: "",
    status: "",
  })

  // Frozen columns state
  const [frozenColumns, setFrozenColumns] = useState<ColumnId[]>(["criticality", "taskId", "docId", "type"])

  // Show column controls panel
  const [showColumnControls, setShowColumnControls] = useState(false)

  // Toggle column sort
  const toggleColumnSort = (columnId: ColumnId) => {
    setColumnSort((prev) => {
      if (prev?.columnId !== columnId) {
        return { columnId, direction: "asc" }
      }
      if (prev.direction === "asc") {
        return { columnId, direction: "desc" }
      }
      return null // Reset to no sort
    })
  }

  // Update column search
  const updateColumnSearch = (columnId: ColumnId, value: string) => {
    setColumnSearches((prev) => ({ ...prev, [columnId]: value }))
  }

  // Toggle frozen column
  const toggleFrozenColumn = (columnId: ColumnId) => {
    setFrozenColumns((prev) => {
      if (prev.includes(columnId)) {
        return prev.filter((id) => id !== columnId)
      }
      // Add to frozen columns, maintaining order
      const columnIndex = columnConfig.findIndex((c) => c.id === columnId)
      const newFrozen = [...prev, columnId].sort((a, b) => {
        const aIndex = columnConfig.findIndex((c) => c.id === a)
        const bIndex = columnConfig.findIndex((c) => c.id === b)
        return aIndex - bIndex
      })
      return newFrozen
    })
  }

  // Get column value from task
  const getColumnValue = (task: (typeof allTasks)[0], columnId: ColumnId): string => {
    switch (columnId) {
      case "criticality": return task.slaUrgency
      case "taskId": return task.taskId
      case "docId": return task.id
      case "type": return task.docType
      case "stage": return task.processStage
      case "value": return (task as any).invoiceAmount || (task as any).rfqValue || (task as any).requestValue || ""
      case "coCode": return task.companyCode
      case "vendorCode": return task.vendorCode || ""
      case "vendorName": return (task as any).vendor || (task as any).supplier || (task as any).entityName || (task as any).primaryEntity || ""
      case "rfqType": return task.rfqType
      case "assignedDate": return task.assignedDate
      case "slaOverdue": return task.slaOverdue
      case "status": return task.status
      default: return ""
    }
  }

  // Calculate frozen column left positions
  const getFrozenLeftPosition = (columnId: ColumnId): number => {
    const checkboxWidth = 40 // Checkbox column width
    let position = checkboxWidth
    for (const frozenId of frozenColumns) {
      if (frozenId === columnId) break
      const col = columnConfig.find((c) => c.id === frozenId)
      position += Number.parseInt(col?.minWidth || "0")
    }
    return position
  }

  // Check if column is frozen
  const isColumnFrozen = (columnId: ColumnId) => frozenColumns.includes(columnId)

  // Determine which modules are present in filtered tasks
  const activeModules = useMemo(() => {
    const moduleSet = new Set(allTasks.map((t) => t.module))
    return Array.from(moduleSet)
  }, [])

  const filterCounts = useMemo(() => {
    // Base tasks after Action Feed filter only (to compute counts for other filters)
    let baseTasks = [...allTasks]
    if (activeFilter) {
      const feedItem = actionFeedItems.find((item) => item.id === activeFilter)
      if (feedItem?.filter) {
        Object.entries(feedItem.filter).forEach(([key, value]) => {
          baseTasks = baseTasks.filter((t) => (t as Record<string, unknown>)[key] === value)
        })
      }
    }

    // Sub task process counts (taskType - respecting module and status filters)
    const subTaskProcessCounts: Record<string, number> = {}
    let subTaskBase = [...baseTasks]
    if (moduleFilter !== "all") subTaskBase = subTaskBase.filter((t) => t.module === moduleFilter)
    if (stageFilter !== "all") subTaskBase = subTaskBase.filter((t) => t.taskType === stageFilter)
    if (statusFilter !== "all") subTaskBase = subTaskBase.filter((t) => t.status === statusFilter)
    subTaskBase.forEach((t) => {
      subTaskProcessCounts[t.taskType] = (subTaskProcessCounts[t.taskType] || 0) + 1
    })

    // Module/Process counts (respecting other filters)
    const moduleCounts: Record<string, number> = {}
    let moduleBase = [...baseTasks]
    if (subTaskProcessFilter !== "all") moduleBase = moduleBase.filter((t) => t.taskType === subTaskProcessFilter)
    if (stageFilter !== "all") moduleBase = moduleBase.filter((t) => t.taskType === stageFilter)
    if (statusFilter !== "all") moduleBase = moduleBase.filter((t) => t.status === statusFilter)
    moduleBase.forEach((t) => {
      moduleCounts[t.module] = (moduleCounts[t.module] || 0) + 1
    })

    // Stage counts (taskType as stages - respecting module and status filters)
    const stageCounts: Record<string, number> = {}
    let stageBase = [...baseTasks]
    if (moduleFilter !== "all") stageBase = stageBase.filter((t) => t.module === moduleFilter)
    if (subTaskProcessFilter !== "all") stageBase = stageBase.filter((t) => t.taskType === subTaskProcessFilter)
    if (statusFilter !== "all") stageBase = stageBase.filter((t) => t.status === statusFilter)
    stageBase.forEach((t) => {
      stageCounts[t.taskType] = (stageCounts[t.taskType] || 0) + 1
    })

    // Status counts (respecting all other filters)
    const statusCounts: Record<string, number> = {}
    let statusBase = [...baseTasks]
    if (moduleFilter !== "all") statusBase = statusBase.filter((t) => t.module === moduleFilter)
    if (subTaskProcessFilter !== "all") statusBase = statusBase.filter((t) => t.taskType === subTaskProcessFilter)
    if (stageFilter !== "all") statusBase = statusBase.filter((t) => t.taskType === stageFilter)
    statusBase.forEach((t) => {
      statusCounts[t.status] = (statusCounts[t.status] || 0) + 1
    })

    return { subTaskProcessCounts, moduleCounts, stageCounts, statusCounts }
  }, [activeFilter, moduleFilter, subTaskProcessFilter, stageFilter, statusFilter])

  // Filter tasks based on all criteria
  const filteredTasks = useMemo(() => {
    let tasks = [...allTasks]

    // Apply Action Feed filter
    if (activeFilter) {
      const feedItem = actionFeedItems.find((item) => item.id === activeFilter)
      if (feedItem?.filter) {
        Object.entries(feedItem.filter).forEach(([key, value]) => {
          tasks = tasks.filter((t) => (t as Record<string, unknown>)[key] === value)
        })
      }
    }

    // Apply process (module) filter
    if (moduleFilter !== "all") {
      tasks = tasks.filter((t) => t.module === moduleFilter)
    }

    // Apply sub task process filter
    if (subTaskProcessFilter !== "all") {
      tasks = tasks.filter((t) => t.taskType === subTaskProcessFilter)
    }

    // Apply stage filter
    if (stageFilter !== "all") {
      tasks = tasks.filter((t) => t.taskType === stageFilter)
    }

    // Apply status filter
    if (statusFilter !== "all") {
      tasks = tasks.filter((t) => t.status === statusFilter)
    }

    // Apply owner filter
    if (ownerFilter) {
      tasks = tasks.filter((t) => t.owner.toLowerCase().includes(ownerFilter.toLowerCase()))
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      tasks = tasks.filter((t) => {
        // Search across all relevant fields
        const searchableFields = [
          t.id,
          t.taskId,
          t.taskType,
          t.module,
          t.status,
          t.slaDue,
          t.owner,
          t.docType,
          t.processStage,
          t.companyCode,
          t.vendorCode,
          t.rfqType,
          // Module-specific fields
          (t as any).vendor,
          (t as any).supplier,
          (t as any).entityName,
          (t as any).primaryEntity,
          (t as any).invoiceAmount,
          (t as any).rfqValue,
          (t as any).requestValue,
          (t as any).invoiceNumber,
          (t as any).rfqNumber,
          (t as any).poNumber,
          (t as any).caseId,
          (t as any).requestorName,
          (t as any).initiator,
          (t as any).requestedBy,
          (t as any).paymentDate,
          (t as any).inviteDate,
          (t as any).budgetCode,
          (t as any).costCenter,
          (t as any).onboardingStage,
          (t as any).approvalStage,
        ]

        // Check if any field contains the search query
        return searchableFields.some((field) => field && String(field).toLowerCase().includes(query))
      })
    }

    // Apply column-level searches
    Object.entries(columnSearches).forEach(([columnId, searchValue]) => {
      if (searchValue) {
        const query = searchValue.toLowerCase()
        tasks = tasks.filter((task) => {
          const value = getColumnValue(task, columnId as ColumnId)
          return value.toLowerCase().includes(query)
        })
      }
    })

    // Apply column sorting if set
    if (columnSort) {
      const { columnId, direction } = columnSort
      tasks.sort((a, b) => {
        const aValue = getColumnValue(a, columnId)
        const bValue = getColumnValue(b, columnId)
        
        // Handle numeric values
        const aNum = Number.parseFloat(aValue.replace(/[^0-9.-]/g, ""))
        const bNum = Number.parseFloat(bValue.replace(/[^0-9.-]/g, ""))
        
        if (!Number.isNaN(aNum) && !Number.isNaN(bNum)) {
          return direction === "asc" ? aNum - bNum : bNum - aNum
        }
        
        // String comparison
        const comparison = aValue.localeCompare(bValue)
        return direction === "asc" ? comparison : -comparison
      })
    } else {
      // Default sort by urgency
      const urgencyOrder = { critical: 0, high: 1, medium: 2, low: 3 }
      tasks.sort(
        (a, b) =>
          urgencyOrder[a.slaUrgency as keyof typeof urgencyOrder] -
          urgencyOrder[b.slaUrgency as keyof typeof urgencyOrder],
      )
    }

    return tasks
  }, [activeFilter, moduleFilter, subTaskProcessFilter, stageFilter, statusFilter, ownerFilter, searchQuery, columnSearches, columnSort])

  // Determine which dynamic columns to show based on filtered tasks
  const visibleModules = useMemo(() => {
    const moduleSet = new Set(filteredTasks.map((t) => t.module))
    return Array.from(moduleSet)
  }, [filteredTasks])

  // Handle Action Feed click - auto-filter tasks
  const handleActionFeedClick = (itemId: string) => {
    setActiveFilter(activeFilter === itemId ? null : itemId)
    // Reset other filters when using Action Feed
    setModuleFilter("all")
    setSubTaskProcessFilter("all")
    setStageFilter("all")
    setStatusFilter("all")
    setItemTypeFilter("all")
    setOwnerFilter("")
    setSearchQuery("")
  }

  // Clear all filters
  const clearFilters = () => {
    setActiveFilter(null)
    setModuleFilter("all")
    setSubTaskProcessFilter("all")
    setStageFilter("all")
    setStatusFilter("all")
    setItemTypeFilter("all")
    setOwnerFilter("")
    setSearchQuery("")
    setColumnSort(null)
    setColumnSearches({
      criticality: "",
      taskId: "",
      docId: "",
      type: "",
      stage: "",
      value: "",
      coCode: "",
      vendorCode: "",
      vendorName: "",
      rfqType: "",
      assignedDate: "",
      slaOverdue: "",
      status: "",
    })
  }

  // Toggle task selection
  const toggleTaskSelection = (taskId: string) => {
    setSelectedTasks((prev) => (prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]))
  }

  // Select all tasks
  const toggleSelectAll = () => {
    if (selectedTasks.length === filteredTasks.length && filteredTasks.length > 0) {
      setSelectedTasks([])
    } else {
      setSelectedTasks(filteredTasks.map((t) => t.id))
    }
  }

  // Clear selection
  const clearSelection = () => setSelectedTasks([])

  // Get current filter state
  const getCurrentFilterState = () => ({
    moduleFilter,
    subTaskProcessFilter,
    stageFilter,
    statusFilter,
    itemTypeFilter,
    ownerFilter,
    dateRangeFilter,
    priorityFilter,
    slaFilter,
    companyCodeFilter,
    vendorFilter,
    valueMinFilter,
    valueMaxFilter,
  })

  // Apply saved filter
  const applySavedFilter = (filter: typeof savedFilters[0]) => {
    setModuleFilter(filter.filters.moduleFilter)
    setSubTaskProcessFilter(filter.filters.subTaskProcessFilter)
    setStageFilter(filter.filters.stageFilter)
    setStatusFilter(filter.filters.statusFilter)
    setItemTypeFilter(filter.filters.itemTypeFilter)
    setOwnerFilter(filter.filters.ownerFilter)
    setDateRangeFilter(filter.filters.dateRangeFilter)
    setPriorityFilter(filter.filters.priorityFilter)
    setSlaFilter(filter.filters.slaFilter)
    setCompanyCodeFilter(filter.filters.companyCodeFilter)
    setVendorFilter(filter.filters.vendorFilter)
    setValueMinFilter(filter.filters.valueMinFilter)
    setValueMaxFilter(filter.filters.valueMaxFilter)
    setShowFilters(false)
  }

  // Save current filter
  const saveCurrentFilter = () => {
    if (!newFilterName.trim()) return
    const newFilter = {
      id: Date.now().toString(),
      name: newFilterName.trim(),
      filters: getCurrentFilterState(),
      createdAt: new Date().toISOString().split("T")[0],
    }
    setSavedFilters(prev => [newFilter, ...prev])
    setNewFilterName("")
    setShowSaveFilterDialog(false)
  }

  // Delete saved filter
  const deleteSavedFilter = (filterId: string) => {
    setSavedFilters(prev => prev.filter(f => f.id !== filterId))
  }

  // Reset all filters
  const resetAllFilters = () => {
    setModuleFilter("all")
    setSubTaskProcessFilter("all")
    setStageFilter("all")
    setStatusFilter("all")
    setItemTypeFilter("all")
    setOwnerFilter("")
    setDateRangeFilter("all")
    setPriorityFilter("all")
    setSlaFilter("all")
    setCompanyCodeFilter("")
    setVendorFilter("")
    setValueMinFilter("")
    setValueMaxFilter("")
  }

  // Check if any filter is active
  const hasActiveFilters = moduleFilter !== "all" || 
    subTaskProcessFilter !== "all" || 
    stageFilter !== "all" || 
    statusFilter !== "all" || 
    itemTypeFilter !== "all" || 
    ownerFilter !== "" || 
    dateRangeFilter !== "all" || 
    priorityFilter !== "all" || 
    slaFilter !== "all" || 
    companyCodeFilter !== "" || 
    vendorFilter !== "" || 
    valueMinFilter !== "" || 
    valueMaxFilter !== ""

// Open bulk action modal
  const openBulkActionModal = (action: "approve" | "reject" | "assign" | "reassign") => {
    setBulkActionModal({ isOpen: true, action })
    // Clear approval comments and assignees when opening
    setApprovalComments({})
    setTaskAssignees({})
    setAssigneeSearchQuery({})
  }
  
  // Close bulk action modal
  const closeBulkActionModal = () => {
    setBulkActionModal({ isOpen: false, action: null })
  }

  // Handle bulk action confirmation
  const handleBulkActionConfirm = () => {
    // In a real app, this would call an API to perform the bulk action
    console.log(`Bulk ${bulkActionModal.action} for tasks:`, selectedTasks)
    closeBulkActionModal()
    clearSelection()
  }

  // Get action label
  const getActionLabel = (action: string | null) => {
    switch (action) {
      case "approve": return "Approve"
      case "reject": return "Reject"
      case "assign": return "Assign"
      case "reassign": return "Re-assign"
      default: return ""
    }
  }

  // Get action color classes
  const getActionColorClasses = (action: string | null) => {
    switch (action) {
      case "approve": return "bg-green-600 hover:bg-green-700 text-white"
      case "reject": return "bg-red-600 hover:bg-red-700 text-white"
      case "assign": return "bg-blue-600 hover:bg-blue-700 text-white"
      case "reassign": return "bg-orange-600 hover:bg-orange-700 text-white"
      default: return ""
    }
  }

  // Analyze selected tasks for bulk actions
  const selectedTasksData = useMemo(() => {
    return selectedTasks.map((id) => filteredTasks.find((t) => t.id === id)).filter(Boolean)
  }, [selectedTasks, filteredTasks])

  // Calculate totals for selected tasks
  const selectedTasksTotals = useMemo(() => {
    let totalAmount = 0
    let invoiceCount = 0
    let rfqCount = 0
    let poCount = 0
    let otherCount = 0
    
    selectedTasksData.forEach((task) => {
      if (task?.amount) {
        const amount = Number.parseFloat(task.amount.replace(/[^0-9.-]+/g, ""))
        if (!Number.isNaN(amount)) totalAmount += amount
      }
      switch (task?.module) {
        case "invoice": invoiceCount++; break
        case "rfq": rfqCount++; break
        case "po": poCount++; break
        default: otherCount++
      }
    })
    
    return { totalAmount, invoiceCount, rfqCount, poCount, otherCount }
  }, [selectedTasksData])

  // Handle row click for navigation
  const handleRowClick = (task: (typeof allTasks)[0], e: React.MouseEvent) => {
    // Don't navigate if clicking on checkbox, buttons, or dropdown
    const target = e.target as HTMLElement
    if (
      target.closest("button") ||
      target.closest('[role="checkbox"]') ||
      target.closest('[role="menuitem"]') ||
      target.closest("[data-radix-collection-item]")
    ) {
      return
    }

    // Navigate based on module type
    if (task.module === "invoice") {
      router.push(`/sop/inbox/invoice/${task.id}`)
    } else if (task.module === "rfq") {
      router.push(`/sop/inbox/rfq/${task.id}`)
    }
    // Add other module navigations as needed
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-amber-100 text-amber-800 border-amber-200",
      "in-progress": "bg-blue-100 text-blue-800 border-blue-200",
      completed: "bg-green-100 text-green-800 border-green-200",
      escalated: "bg-red-100 text-red-800 border-red-200",
    }
    return styles[status] || "bg-muted text-muted-foreground"
  }

  const getTaskTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      approval: "Approval",
      review: "Review",
      resolution: "Resolution",
      acknowledgement: "Acknowledge",
      information: "Info",
    }
    return labels[type] || type
  }

  const getModuleIcon = (module: string) => {
    const icons: Record<string, typeof FileText> = {
      invoice: FileText,
      rfq: ShoppingCart,
      onboarding: Users,
      po: Truck,
      prescreening: UserCheck,
      esg: Activity,
    }
    const Icon = icons[module] || FileText
    return <Icon className="h-4 w-4" />
  }

  const getPriorityIndicator = (urgency: string) => {
    const colors: Record<string, string> = {
      critical: "bg-red-500",
      high: "bg-amber-500",
      medium: "bg-blue-500",
      low: "bg-green-500",
    }
    return <Circle className={`h-2.5 w-2.5 ${colors[urgency]} fill-current`} />
  }

  const getSlaColor = (urgency: string) => {
    const colors: Record<string, string> = {
      critical: "text-red-600 font-semibold",
      high: "text-amber-600 font-medium",
      medium: "text-blue-600",
      low: "text-muted-foreground",
    }
    return colors[urgency] || ""
  }

  // Check if all selected tasks are from the same module
  const selectedModule = useMemo(() => {
    if (selectedTasksData.length === 0) return null
    const firstModule = selectedTasksData[0]?.module
    const allSameModule = selectedTasksData.every((t) => t?.module === firstModule)
    return allSameModule ? firstModule : null
  }, [selectedTasksData])

  // Check if all selected tasks have the same task type
  const selectedTaskType = useMemo(() => {
    if (selectedTasksData.length === 0) return null
    const firstType = selectedTasksData[0]?.taskType
    const allSameType = selectedTasksData.every((t) => t?.taskType === firstType)
    return allSameType ? firstType : null
  }, [selectedTasksData])

  // Check if all selected tasks have the same status
  const selectedStatus = useMemo(() => {
    if (selectedTasksData.length === 0) return null
    const firstStatus = selectedTasksData[0]?.status
    const allSameStatus = selectedTasksData.every((t) => t?.status === firstStatus)
    return allSameStatus ? firstStatus : null
  }, [selectedTasksData])

  // Check if selected tasks can have bulk actions
  const canBulkApprove =
    selectedTasks.length > 0 &&
    selectedTaskType === "approval" &&
    selectedStatus === "pending"

  const canBulkAcknowledge =
    selectedTasks.length > 0 &&
    selectedTaskType === "acknowledgement" &&
    selectedStatus === "pending"

  const canBulkReview =
    selectedTasks.length > 0 &&
    selectedTaskType === "review"

  const handleModuleBadgeClick = (moduleId: string) => {
    // Clear action feed filter when clicking module badges
    setActiveFilter(null)
    // Toggle module filter
    setModuleFilter(moduleFilter === moduleId ? "all" : moduleId)
  }

  const getDocTypeIcon = (docType: string) => {
    const icons: Record<string, { icon: typeof FileText; color: string; label: string }> = {
      INV: { icon: Receipt, color: "text-emerald-600", label: "Invoice" },
      RFQ: { icon: ClipboardList, color: "text-blue-600", label: "RFQ" },
      NFA: { icon: FileSignature, color: "text-orange-600", label: "NFA" },
      VND: { icon: Users, color: "text-purple-600", label: "Vendor" },
      PR: { icon: FileQuestion, color: "text-cyan-600", label: "PR" },
    }
    const config = icons[docType] || { icon: FileText, color: "text-muted-foreground", label: docType }
    const Icon = config.icon
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1.5">
            <Icon className={`h-4 w-4 ${config.color}`} />
            <span className="text-xs font-medium">{docType}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>{config.label}</TooltipContent>
      </Tooltip>
    )
  }

  const getPriorityIcon = (urgency: string) => {
    const configs: Record<string, { color: string; bgColor: string; label: string }> = {
      critical: { color: "text-red-600", bgColor: "bg-red-500", label: "Critical" },
      high: { color: "text-amber-600", bgColor: "bg-amber-500", label: "High" },
      medium: { color: "text-blue-600", bgColor: "bg-blue-500", label: "Medium" },
      low: { color: "text-green-600", bgColor: "bg-green-500", label: "Low" },
    }
    const config = configs[urgency] || configs.medium
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`h-2.5 w-2.5 rounded-full ${config.bgColor}`} />
        </TooltipTrigger>
        <TooltipContent>{config.label} Priority</TooltipContent>
      </Tooltip>
    )
  }

  const getSlaIcon = (slaDue: string, urgency: string) => {
    const isUrgent = urgency === "critical" || urgency === "high"
    const Icon = isUrgent ? Timer : CalendarClock
    const color =
      urgency === "critical" ? "text-red-600" : urgency === "high" ? "text-amber-600" : "text-muted-foreground"
    return (
      <div className={`flex items-center gap-1.5 ${color}`}>
        <Icon className="h-3.5 w-3.5" />
        <span className={`text-xs ${urgency === "critical" ? "font-semibold" : ""}`}>{slaDue}</span>
      </div>
    )
  }

  const getStatusIcon = (status: string) => {
    const configs: Record<string, { icon: typeof CircleDot; color: string; label: string }> = {
      pending: { icon: CirclePause, color: "text-amber-600", label: "Pending" },
      "in-progress": { icon: CircleDot, color: "text-blue-600", label: "In Progress" },
      completed: { icon: CircleCheck, color: "text-green-600", label: "Completed" },
      escalated: { icon: CircleAlert, color: "text-red-600", label: "Escalated" },
    }
    const config = configs[status] || configs.pending
    const Icon = config.icon
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Icon className={`h-4 w-4 ${config.color}`} />
        </TooltipTrigger>
        <TooltipContent>{config.label}</TooltipContent>
      </Tooltip>
    )
  }

  const getVendorName = (task: (typeof allTasks)[0]) => {
    if (task.module === "invoice") return task.vendor || "-"
    if (task.module === "rfq") return task.supplier || "-"
    if (task.module === "po") return task.primaryEntity || "-"
    if (task.module === "onboarding") return task.entityName || "-"
    return "-"
  }

  const getPrimaryEntity = (task: (typeof allTasks)[0]) => {
    switch (task.module) {
      case "invoice":
        return task.vendor
      case "rfq":
        return task.supplier
      case "po":
        return task.primaryEntity || task.initiator
      case "onboarding":
        return task.entityName
      default:
        return "—"
    }
  }

  const getValueImpact = (task: (typeof allTasks)[0]) => {
    switch (task.module) {
      case "invoice":
        return task.invoiceAmount
      case "rfq":
        return task.rfqValue
      case "po":
        return task.requestValue
      default:
        return "—"
    }
  }

  const getModuleColumns = (task: (typeof allTasks)[0]) => {
    switch (task.module) {
      case "invoice":
        return {
          col10: { label: "Case ID", value: task.caseId || "—" },
          col11: { label: "Vendor Code", value: task.vendorCode || "—" },
          col12: { label: "Vendor", value: task.vendor || "—" },
        }
      case "rfq":
        return {
          col10: { label: "Requestor", value: task.requestorName || "—" },
          col11: { label: "Budget Code", value: task.budgetCode || "—" },
          col12: { label: "Company", value: task.companyCode || "—" },
        }
      case "onboarding":
        return {
          col10: { label: "Vendor", value: task.entityName || "—" },
          col11: { label: "Requested By", value: task.requestedBy || "—" },
          col12: { label: "Invite Date", value: task.inviteDate || "—" },
        }
      case "po":
        return {
          col10: { label: "Initiator", value: task.initiator || "—" },
          col11: { label: "Level", value: task.approvalStage || "—" },
          col12: { label: "Cost Center", value: task.costCenter || "—" },
        }
      default:
        return {
          col10: { label: "—", value: "—" },
          col11: { label: "—", value: "—" },
          col12: { label: "—", value: "—" },
        }
    }
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col h-screen overflow-hidden">
        <Header title="Inbox" />
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {/* Page Title */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Inbox</h1>
            <p className="text-sm text-muted-foreground">Consolidated workspace across all modules</p>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Create
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[700px] p-0">
                <div className="grid grid-cols-3 gap-0">
                  {/* Column 1 */}
                  <div className="border-r">
                    {/* Invoice Section */}
                    <div className="px-4 py-2.5 bg-gray-50 border-b">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Invoice</p>
                    </div>
                    <div className="p-2">
                      <DropdownMenuItem className="cursor-pointer px-3 py-2 rounded-md">
                        <FileText className="h-4 w-4 mr-3 text-blue-600" />
                        Standard Invoice
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer px-3 py-2 rounded-md">
                        <FilePlus className="h-4 w-4 mr-3 text-blue-600" />
                        Invoice from PO
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer px-3 py-2 rounded-md">
                        <CreditCard className="h-4 w-4 mr-3 text-blue-600" />
                        Credit Note
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer px-3 py-2 rounded-md">
                        <Receipt className="h-4 w-4 mr-3 text-blue-600" />
                        Debit Note
                      </DropdownMenuItem>
                    </div>

                    {/* RFQ Section */}
                    <div className="px-4 py-2.5 bg-gray-50 border-y">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">RFQ</p>
                    </div>
                    <div className="p-2">
                      <DropdownMenuItem className="cursor-pointer px-3 py-2 rounded-md">
                        <ShoppingCart className="h-4 w-4 mr-3 text-purple-600" />
                        RFQ for Goods
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer px-3 py-2 rounded-md">
                        <ClipboardList className="h-4 w-4 mr-3 text-purple-600" />
                        RFQ for Services
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer px-3 py-2 rounded-md">
                        <RefreshCw className="h-4 w-4 mr-3 text-purple-600" />
                        RFQ for SaaS
                      </DropdownMenuItem>
                    </div>
                  </div>

                  {/* Column 2 */}
                  <div className="border-r">
                    {/* Purchase Order Section */}
                    <div className="px-4 py-2.5 bg-gray-50 border-b">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Purchase Order</p>
                    </div>
                    <div className="p-2">
                      <DropdownMenuItem className="cursor-pointer px-3 py-2 rounded-md">
                        <FileCheck className="h-4 w-4 mr-3 text-orange-600" />
                        PO from Approved RFQ
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer px-3 py-2 rounded-md">
                        <Truck className="h-4 w-4 mr-3 text-orange-600" />
                        Direct Purchase Order
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer px-3 py-2 rounded-md">
                        <Calendar className="h-4 w-4 mr-3 text-orange-600" />
                        Recurring / Blanket PO
                      </DropdownMenuItem>
                    </div>

                    {/* Pre-Screening Section */}
                    <div className="px-4 py-2.5 bg-gray-50 border-y">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Pre-Screening</p>
                    </div>
                    <div className="p-2">
                      <DropdownMenuItem className="cursor-pointer px-3 py-2 rounded-md">
                        <ClipboardCheck className="h-4 w-4 mr-3 text-teal-600" />
                        Vendor Due Diligence
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer px-3 py-2 rounded-md">
                        <AlertTriangle className="h-4 w-4 mr-3 text-teal-600" />
                        Risk Assessment
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer px-3 py-2 rounded-md">
                        <BarChart3 className="h-4 w-4 mr-3 text-teal-600" />
                        Capability Evaluation
                      </DropdownMenuItem>
                    </div>
                  </div>

                  {/* Column 3 */}
                  <div>
                    {/* Onboarding Section */}
                    <div className="px-4 py-2.5 bg-gray-50 border-b">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Onboarding</p>
                    </div>
                    <div className="p-2">
                      <DropdownMenuItem className="cursor-pointer px-3 py-2 rounded-md">
                        <Users className="h-4 w-4 mr-3 text-emerald-600" />
                        Vendor Onboarding
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer px-3 py-2 rounded-md">
                        <UserCheck className="h-4 w-4 mr-3 text-emerald-600" />
                        Customer Onboarding
                      </DropdownMenuItem>
                    </div>

                    {/* ESG Section */}
                    <div className="px-4 py-2.5 bg-gray-50 border-y">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">ESG</p>
                    </div>
                    <div className="p-2">
                      <DropdownMenuItem className="cursor-pointer px-3 py-2 rounded-md">
                        <Leaf className="h-4 w-4 mr-3 text-green-600" />
                        Environmental
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer px-3 py-2 rounded-md">
                        <Heart className="h-4 w-4 mr-3 text-green-600" />
                        Social Compliance
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer px-3 py-2 rounded-md">
                        <Shield className="h-4 w-4 mr-3 text-green-600" />
                        Governance Review
                      </DropdownMenuItem>
                    </div>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* AI Panel - Action Feed & Operational Brief */}
        <Collapsible open={isAIPanelOpen} onOpenChange={setIsAIPanelOpen}>
          <div className="flex items-center justify-between">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground -ml-2">
                <span className="font-medium text-foreground">What needs attention</span>
                {isAIPanelOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
            {activeFilter && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs text-muted-foreground gap-1">
                <X className="h-3 w-3" />
                Clear filter
              </Button>
            )}
          </div>

          <CollapsibleContent className="mt-2">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Action Feed */}
              <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-medium text-primary uppercase tracking-wide">Action Feed</p>
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <MousePointerClick className="h-4 w-4" />
                    Click to filter tasks
                  </span>
                </div>
                <div className="space-y-1">
                  {actionFeedItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleActionFeedClick(item.id)}
                      className={`w-full flex items-center gap-3 py-2 px-2 text-left rounded transition-colors group ${
                        activeFilter === item.id
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-primary/5 hover:text-primary"
                      }`}
                    >
                      <item.icon className={`h-4 w-4 flex-shrink-0 ${item.iconColor}`} />
                      <span
                        className={`text-sm text-foreground ${activeFilter === item.id ? "font-medium" : "group-hover:font-medium"}`}
                      >
                        {item.sentence}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Operational Brief */}
              <div className="bg-amber-50 dark:bg-amber-950/20 rounded-lg p-4 border border-amber-200/50 dark:border-amber-800/30">
                <p className="text-xs font-medium text-amber-700 dark:text-amber-500 uppercase tracking-wide mb-3">
                  Operational Brief
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {operationalBriefs.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1.5 text-xs text-amber-800 dark:text-amber-400 bg-amber-100/50 dark:bg-amber-900/30 px-2.5 py-1.5 rounded-full"
                    >
                      <item.icon className="h-3 w-3" />
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>

                {/* Pending by Process */}
                <div className="pt-3 border-t border-amber-200/50 dark:border-amber-800/30">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-medium text-amber-700 dark:text-amber-500">Pending by Process</p>
                    <span className="flex items-center gap-1 text-[10px] text-amber-600/70 dark:text-amber-500/70">
                      <MousePointerClick className="h-3 w-3" />
                      Click to filter
                    </span>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {moduleTaskCounts.map((mod) => {
                      const isSelected = moduleFilter === mod.id
                      return (
                        <button
                          key={mod.id}
                          onClick={() => handleModuleBadgeClick(mod.id)}
                          className={`relative flex flex-col items-center p-2 rounded-lg transition-all ${
                            isSelected
                              ? "bg-white dark:bg-background border-2 border-primary shadow-md scale-105"
                              : "bg-white/50 dark:bg-background/50 border border-amber-200/50 dark:border-amber-800/30 hover:border-amber-300 hover:shadow-sm"
                          }`}
                        >
                          {isSelected && (
                            <div className="absolute -top-1 -right-1 bg-primary rounded-full p-0.5">
                              <CheckCircle2 className="h-3 w-3 text-white" />
                            </div>
                          )}
                          <div className={`p-1.5 rounded-full ${mod.color} mb-1`}>
                            <mod.icon className="h-3 w-3 text-white" />
                          </div>
                          <span className="text-[10px] text-muted-foreground text-center leading-tight">
                            {mod.label}
                          </span>
                          <span className="text-sm font-bold text-foreground">{mod.count}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Queues / Tabs */}
        <div className="flex items-center gap-1 border-b">
          {queues.map((queue) => (
            <button
              key={queue.id}
              onClick={() => setActiveQueue(queue.id)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                activeQueue === queue.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {queue.label}
              <span
                className={`text-xs px-1.5 py-0.5 rounded ${activeQueue === queue.id ? "bg-primary/10" : "bg-muted"}`}
              >
                {queue.count}
              </span>
            </button>
          ))}
        </div>

        {/* Filters Bar */}
        <div className="flex items-center gap-3 flex-wrap bg-muted/20 rounded-lg p-3">
          {/* Queue Tabs */}
          {/* All Process (was All Modules) */}
          <Select value={moduleFilter} onValueChange={setModuleFilter}>
            <SelectTrigger className="w-[160px] h-9">
              <SelectValue placeholder="Process" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                All Process ({Object.values(filterCounts.moduleCounts).reduce((a, b) => a + b, 0)})
              </SelectItem>
              {modules.map((mod) => (
                <SelectItem key={mod.id} value={mod.id}>
                  {mod.label} ({filterCounts.moduleCounts[mod.id] || 0})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* All Sub task process (was All Status) */}
          <Select value={subTaskProcessFilter} onValueChange={setSubTaskProcessFilter}>
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue placeholder="Sub Task Process" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                All Sub task process ({Object.values(filterCounts.subTaskProcessCounts).reduce((a, b) => a + b, 0)})
              </SelectItem>
              {taskTypes.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.label} ({filterCounts.subTaskProcessCounts[type.id] || 0})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* All Stages (was All Types) */}
          <Select value={stageFilter} onValueChange={setStageFilter}>
            <SelectTrigger className="w-[150px] h-9">
              <SelectValue placeholder="Stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                All Stages ({Object.values(filterCounts.stageCounts).reduce((a, b) => a + b, 0)})
              </SelectItem>
              {taskTypes.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.label} ({filterCounts.stageCounts[type.id] || 0})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* All Status (new filter) */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px] h-9">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                All Status ({Object.values(filterCounts.statusCounts).reduce((a, b) => a + b, 0)})
              </SelectItem>
              <SelectItem value="pending">Pending ({filterCounts.statusCounts["pending"] || 0})</SelectItem>
              <SelectItem value="in-progress">In Progress ({filterCounts.statusCounts["in-progress"] || 0})</SelectItem>
              <SelectItem value="completed">Completed ({filterCounts.statusCounts["completed"] || 0})</SelectItem>
              <SelectItem value="escalated">Escalated ({filterCounts.statusCounts["escalated"] || 0})</SelectItem>
            </SelectContent>
          </Select>

          {/* Item Type filter */}
          <Select value={itemTypeFilter} onValueChange={setItemTypeFilter}>
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue placeholder="Item Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Items</SelectItem>
              <SelectItem value="supplier-invoices">Supplier Invoices</SelectItem>
              <SelectItem value="advance">Advance</SelectItem>
              <SelectItem value="utility-bills">Utility Bills</SelectItem>
              <SelectItem value="project-wo">Project WO</SelectItem>
              <SelectItem value="non-project-wo">Non Projects WO</SelectItem>
              <SelectItem value="project-po">Projects PO</SelectItem>
              <SelectItem value="non-project-po">Non Projects PO</SelectItem>
              <SelectItem value="non-po">Non PO</SelectItem>
              <SelectItem value="contract-work-permit">Contract Work Permit</SelectItem>
              <SelectItem value="fi-reversal">FI Reversal</SelectItem>
            </SelectContent>
          </Select>

<Sheet open={showFilters} onOpenChange={setShowFilters}>
            <Button variant="outline" size="sm" onClick={() => setShowFilters(true)} className="gap-2 h-9">
              <Filter className="h-4 w-4" />
              More Filters
              {hasActiveFilters && (
                <Badge variant="secondary" className="h-5 px-1.5 text-xs bg-primary text-primary-foreground">
                  Active
                </Badge>
              )}
            </Button>
            <SheetContent side="right" className="w-[450px] sm:w-[500px] flex flex-col p-0">
              <SheetHeader className="p-6 pb-4 border-b">
                <SheetTitle className="flex items-center justify-between">
                  <span>Advanced Filters</span>
                  {hasActiveFilters && (
                    <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground" onClick={resetAllFilters}>
                      Clear All
                    </Button>
                  )}
                </SheetTitle>
                <SheetDescription>Apply filters or use saved presets to refine your task list</SheetDescription>
              </SheetHeader>

              <Tabs value={activeFilterTab} onValueChange={(v) => setActiveFilterTab(v as "filters" | "saved")} className="flex-1 flex flex-col min-h-0 overflow-hidden">
                <div className="px-6 pt-4 shrink-0">
                  <TabsList className="w-full grid grid-cols-2">
                    <TabsTrigger value="filters" className="gap-2">
                      <Filter className="h-3.5 w-3.5" />
                      Filters
                    </TabsTrigger>
                    <TabsTrigger value="saved" className="gap-2">
                      <Bookmark className="h-3.5 w-3.5" />
                      Saved ({savedFilters.length})
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="filters" className="flex-1 overflow-y-auto m-0 p-6 space-y-5 min-h-0">
                  {/* Main Filter Parameters Section */}
                  <div className="space-y-4 p-4 bg-slate-50 rounded-lg border">
                    <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <Layout className="h-4 w-4" />
                      Main Filters
                    </h4>
                    
                    {/* All Process (Module Filter) */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">All Process</label>
                      <Select value={moduleFilter} onValueChange={setModuleFilter}>
                        <SelectTrigger className="h-10 bg-background">
                          <SelectValue placeholder="All Process" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Process</SelectItem>
                          {modules.map(mod => (
                            <SelectItem key={mod.id} value={mod.id}>{mod.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* All Sub Task Process */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">All Sub Task Process</label>
                      <Select value={subTaskProcessFilter} onValueChange={setSubTaskProcessFilter}>
                        <SelectTrigger className="h-10 bg-background">
                          <SelectValue placeholder="All Sub Task Process" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Sub Task Process</SelectItem>
                          <SelectItem value="po-invoice">PO Invoice</SelectItem>
                          <SelectItem value="non-po">Non PO</SelectItem>
                          <SelectItem value="contract-work-permit">Contract Work Permit</SelectItem>
                          <SelectItem value="fi-reversal">FI Reversal</SelectItem>
                          <SelectItem value="advance-payment">Advance Payment</SelectItem>
                          <SelectItem value="credit-note">Credit Note</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* All Stages */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">All Stages</label>
                      <Select value={stageFilter} onValueChange={setStageFilter}>
                        <SelectTrigger className="h-10 bg-background">
                          <SelectValue placeholder="All Stages" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Stages</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="review">Review</SelectItem>
                          <SelectItem value="approval">Approval</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* All Status */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">All Status</label>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="h-10 bg-background">
                          <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="open">Open</SelectItem>
                          <SelectItem value="assigned">Assigned</SelectItem>
                          <SelectItem value="in-review">In Review</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                          <SelectItem value="on-hold">On Hold</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* All Items */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">All Items</label>
                      <Select value={itemTypeFilter} onValueChange={setItemTypeFilter}>
                        <SelectTrigger className="h-10 bg-background">
                          <SelectValue placeholder="All Items" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Items</SelectItem>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="service">Service</SelectItem>
                          <SelectItem value="material">Material</SelectItem>
                          <SelectItem value="asset">Asset</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator />

                  {/* Additional Filters */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-slate-700">Additional Filters</h4>

                    {/* Owner Filter */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Owner</label>
                      <Input
                        placeholder="Filter by owner"
                        value={ownerFilter}
                        onChange={(e) => setOwnerFilter(e.target.value)}
                        className="h-10"
                      />
                    </div>

                    {/* Date Range Filter */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Date Range</label>
                      <Select value={dateRangeFilter} onValueChange={setDateRangeFilter}>
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Select date range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Time</SelectItem>
                          <SelectItem value="today">Today</SelectItem>
                          <SelectItem value="yesterday">Yesterday</SelectItem>
                          <SelectItem value="last7days">Last 7 Days</SelectItem>
                          <SelectItem value="last30days">Last 30 Days</SelectItem>
                          <SelectItem value="thisMonth">This Month</SelectItem>
                          <SelectItem value="lastMonth">Last Month</SelectItem>
                          <SelectItem value="custom">Custom Range</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Priority Filter */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Priority</label>
                      <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="All Priorities" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Priorities</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* SLA Filter */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">SLA Status</label>
                      <Select value={slaFilter} onValueChange={setSlaFilter}>
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="All SLA Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All SLA Status</SelectItem>
                          <SelectItem value="overdue">Overdue</SelectItem>
                          <SelectItem value="dueSoon">Due Soon (24hrs)</SelectItem>
                          <SelectItem value="onTrack">On Track</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Vendor/Supplier Filter */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Vendor / Supplier</label>
                      <Input 
                        placeholder="Filter by vendor or supplier" 
                        className="h-10"
                        value={vendorFilter}
                        onChange={(e) => setVendorFilter(e.target.value)}
                      />
                    </div>

                    {/* Company Code Filter */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Company Code</label>
                      <Input 
                        placeholder="Filter by company code" 
                        className="h-10"
                        value={companyCodeFilter}
                        onChange={(e) => setCompanyCodeFilter(e.target.value)}
                      />
                    </div>

                    {/* Value Range Filter */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Value Range</label>
                      <div className="flex gap-2">
                        <Input 
                          placeholder="Min" 
                          type="number" 
                          className="h-10"
                          value={valueMinFilter}
                          onChange={(e) => setValueMinFilter(e.target.value)}
                        />
                        <Input 
                          placeholder="Max" 
                          type="number" 
                          className="h-10"
                          value={valueMaxFilter}
                          onChange={(e) => setValueMaxFilter(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="saved" className="flex-1 overflow-y-auto m-0 p-6 space-y-4 min-h-0">
                  {/* Save Current Filter Button */}
                  {hasActiveFilters && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-blue-800">Save Current Filters</p>
                          <p className="text-xs text-blue-600 mt-0.5">Save your active filters for quick access later</p>
                        </div>
                        <Button 
                          size="sm" 
                          className="bg-blue-600 hover:bg-blue-700"
                          onClick={() => setShowSaveFilterDialog(true)}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Save
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Save Filter Dialog */}
                  {showSaveFilterDialog && (
                    <div className="p-4 bg-slate-50 border rounded-lg space-y-3">
                      <label className="text-sm font-medium">Filter Name</label>
                      <Input
                        placeholder="e.g., High Priority Invoices"
                        value={newFilterName}
                        onChange={(e) => setNewFilterName(e.target.value)}
                        className="h-10"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 bg-transparent"
                          onClick={() => {
                            setShowSaveFilterDialog(false)
                            setNewFilterName("")
                          }}
                        >
                          Cancel
                        </Button>
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={saveCurrentFilter}
                          disabled={!newFilterName.trim()}
                        >
                          Save Filter
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Saved Filters List */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-slate-700">Saved Filters</h4>
                    {savedFilters.length === 0 ? (
                      <div className="p-8 text-center border border-dashed rounded-lg">
                        <Bookmark className="h-8 w-8 mx-auto text-slate-300 mb-2" />
                        <p className="text-sm text-slate-500">No saved filters yet</p>
                        <p className="text-xs text-slate-400 mt-1">Apply filters and save them for quick access</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {savedFilters.map((filter) => (
                          <div
                            key={filter.id}
                            className="p-3 border rounded-lg hover:border-slate-300 hover:shadow-sm transition-all group"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="font-medium text-sm text-slate-800">{filter.name}</p>
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {filter.filters.moduleFilter !== "all" && (
                                    <Badge variant="secondary" className="text-[10px]">
                                      {modules.find(m => m.id === filter.filters.moduleFilter)?.label || filter.filters.moduleFilter}
                                    </Badge>
                                  )}
                                  {filter.filters.stageFilter !== "all" && (
                                    <Badge variant="secondary" className="text-[10px]">
                                      Stage: {filter.filters.stageFilter}
                                    </Badge>
                                  )}
                                  {filter.filters.priorityFilter !== "all" && (
                                    <Badge variant="secondary" className="text-[10px]">
                                      Priority: {filter.filters.priorityFilter}
                                    </Badge>
                                  )}
                                  {filter.filters.slaFilter !== "all" && (
                                    <Badge variant="secondary" className="text-[10px]">
                                      SLA: {filter.filters.slaFilter}
                                    </Badge>
                                  )}
                                  {filter.filters.dateRangeFilter !== "all" && (
                                    <Badge variant="secondary" className="text-[10px]">
                                      {filter.filters.dateRangeFilter}
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-[10px] text-slate-400 mt-2">Created: {filter.createdAt}</p>
                              </div>
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50"
                                  onClick={() => deleteSavedFilter(filter.id)}
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full mt-3 h-8 text-xs bg-transparent"
                              onClick={() => applySavedFilter(filter)}
                            >
                              <RotateCcw className="h-3 w-3 mr-1.5" />
                              Apply This Filter
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              <SheetFooter className="border-t p-6 pt-4 gap-3 flex-row">
                <Button variant="outline" className="flex-1 bg-transparent" onClick={() => {
                  resetAllFilters()
                  setShowFilters(false)
                }}>
                  Reset Filters
                </Button>
                <SheetClose asChild>
                  <Button className="flex-1">Apply Filters</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>

          {/* Column Controls Button */}
          <Popover open={showColumnControls} onOpenChange={setShowColumnControls}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 gap-2 bg-transparent">
                <Settings2 className="h-4 w-4" />
                Columns
                {frozenColumns.length > 0 && (
                  <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                    {frozenColumns.length} frozen
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">Column Controls</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => setFrozenColumns(["criticality", "taskId", "docId", "type"])}
                  >
                    Reset Freeze
                  </Button>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Toggle columns to freeze (pin) them during horizontal scroll</p>
                  <div className="max-h-[300px] overflow-y-auto space-y-1">
                    {columnConfig.map((col) => (
                      <div
                        key={col.id}
                        className={`flex items-center justify-between p-2 rounded-md text-sm ${
                          frozenColumns.includes(col.id) ? "bg-primary/10 border border-primary/20" : "hover:bg-muted"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <GripVertical className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{col.label}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`h-7 px-2 ${frozenColumns.includes(col.id) ? "text-primary" : ""}`}
                          onClick={() => toggleFrozenColumn(col.id)}
                        >
                          {frozenColumns.includes(col.id) ? (
                            <>
                              <Pin className="h-3.5 w-3.5 mr-1" />
                              Frozen
                            </>
                          ) : (
                            <>
                              <PinOff className="h-3.5 w-3.5 mr-1" />
                              Freeze
                            </>
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                {columnSort && (
                  <div className="pt-2 border-t">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Sorted by:</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">
                          {columnConfig.find((c) => c.id === columnSort.columnId)?.label} ({columnSort.direction})
                        </Badge>
                        <Button variant="ghost" size="sm" className="h-6 px-2" onClick={() => setColumnSort(null)}>
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>

          {(activeFilter ||
            moduleFilter !== "all" ||
            subTaskProcessFilter !== "all" ||
            stageFilter !== "all" ||
            statusFilter !== "all" ||
            itemTypeFilter !== "all" ||
            ownerFilter ||
            searchQuery ||
            columnSort ||
            Object.values(columnSearches).some((v) => v)) && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground h-9">
              <X className="h-4 w-4 mr-1" />
              Clear all
            </Button>
          )}
        </div>

        

        {/* Active Filter Indicator */}
        {activeFilter && (
          <div className="flex items-center gap-2 text-sm">
            <AlertCircle className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">Showing tasks from Action Feed:</span>
            <Badge variant="secondary" className="font-normal">
              {actionFeedItems.find((item) => item.id === activeFilter)?.sentence}
            </Badge>
          </div>
        )}

        {/* Bulk Action Banner */}
        {selectedTasks.length > 0 && (
          <div className="flex items-center justify-between rounded-lg border border-primary/30 bg-primary/5 px-4 py-3">
            <div className="flex items-center gap-3">
              <Checkbox
                checked={selectedTasks.length === filteredTasks.length && filteredTasks.length > 0}
                onCheckedChange={toggleSelectAll}
                aria-label="Select all tasks"
              />
              <span className="text-sm font-medium">
                {selectedTasks.length} {selectedTasks.length === 1 ? "task" : "tasks"} selected
              </span>
              {selectedModule && (
                <Badge variant="outline" className="font-normal">
                  {modules.find((m) => m.id === selectedModule)?.label || selectedModule}
                </Badge>
              )}
              {selectedTaskType && (
                <Badge variant="secondary" className="font-normal">
                  {getTaskTypeLabel(selectedTaskType)}
                </Badge>
              )}
              {selectedTasks.length < filteredTasks.length && (
                <Button variant="link" size="sm" className="h-auto p-0 text-primary" onClick={toggleSelectAll}>
                  Select all {filteredTasks.length}
                </Button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => openBulkActionModal("approve")}>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Approve
              </Button>
              <Button size="sm" variant="outline" className="bg-transparent" onClick={() => openBulkActionModal("assign")}>
                <UserCheck className="mr-2 h-4 w-4" />
                Assign
              </Button>
              <Button size="sm" variant="outline" className="bg-transparent" onClick={() => openBulkActionModal("reassign")}>
                <Forward className="mr-2 h-4 w-4" />
                Re-assign
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 ml-1" onClick={clearSelection}>
                <X className="h-4 w-4" />
                <span className="sr-only">Clear selection</span>
              </Button>
            </div>
          </div>
        )}

        {/* Frozen Columns Visual Indicator */}
        {frozenColumns.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <Pin className="h-3.5 w-3.5" />
            <span>{frozenColumns.length} column{frozenColumns.length > 1 ? "s" : ""} frozen</span>
            <span className="text-muted-foreground/50">|</span>
            <span>Scroll horizontally to see more columns</span>
          </div>
        )}

        <div className="border rounded-lg overflow-hidden relative">
          <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
            <table className="w-full border-collapse text-sm">
              {/* Header Row with Sort Controls */}
              <thead className="sticky top-0 z-30 bg-muted">
                <tr className="border-b">
                  {/* Checkbox - Always Pinned */}
                  <th className="sticky left-0 z-40 bg-gray-100 dark:bg-zinc-900 w-10 px-3 py-2 text-left">
                    <Checkbox
                      checked={selectedTasks.length === filteredTasks.length && filteredTasks.length > 0}
                      onCheckedChange={toggleSelectAll}
                    />
                  </th>

                  {/* Dynamic Columns */}
                  {columnConfig.map((col, index) => {
                    const isFrozen = isColumnFrozen(col.id)
                    const isLastFrozen = isFrozen && !isColumnFrozen(columnConfig[index + 1]?.id)
                    const leftPos = isFrozen ? getFrozenLeftPosition(col.id) : undefined

                    return (
                      <th
                        key={col.id}
                        className={`px-2 py-2 text-left font-semibold ${
                          isFrozen ? "sticky z-40 bg-gray-100 dark:bg-zinc-900" : "bg-gray-100 dark:bg-zinc-900"
                        } ${isLastFrozen ? "after:content-[''] after:absolute after:right-0 after:top-0 after:bottom-0 after:w-px after:bg-border after:shadow-[2px_0_8px_rgba(0,0,0,0.1)] relative" : ""}`}
                        style={{
                          minWidth: col.minWidth,
                          left: isFrozen ? `${leftPos}px` : undefined,
                        }}
                      >
                        <div className="space-y-1">
                          {/* Column Label with Sort */}
                          <div className="flex items-center gap-1">
                            {col.id === "criticality" ? (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    type="button"
                                    onClick={() => col.sortable && toggleColumnSort(col.id)}
                                    className="flex items-center gap-1 hover:text-primary transition-colors"
                                  >
                                    <CircleDot className="h-4 w-4 text-muted-foreground" />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent>Criticality</TooltipContent>
                              </Tooltip>
                            ) : col.id === "coCode" ? (
                              <button
                                type="button"
                                onClick={() => col.sortable && toggleColumnSort(col.id)}
                                className="flex items-center gap-1 hover:text-primary transition-colors text-xs"
                              >
                                <Building2 className="h-3.5 w-3.5" />
                                {col.label}
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => col.sortable && toggleColumnSort(col.id)}
                                className="flex items-center gap-1 hover:text-primary transition-colors text-xs"
                              >
                                {col.label}
                              </button>
                            )}
                            {col.sortable && (
                              <button
                                type="button"
                                onClick={() => toggleColumnSort(col.id)}
                                className="p-0.5 hover:bg-primary/10 rounded"
                              >
                                {columnSort?.columnId === col.id ? (
                                  columnSort.direction === "asc" ? (
                                    <ArrowUp className="h-3 w-3 text-primary" />
                                  ) : (
                                    <ArrowDown className="h-3 w-3 text-primary" />
                                  )
                                ) : (
                                  <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                                )}
                              </button>
                            )}
                            {/* Search icon with popover */}
                            {col.searchable && (
                              <Popover>
                                <PopoverTrigger asChild>
                                  <button
                                    type="button"
                                    className={`p-0.5 hover:bg-primary/10 rounded ${columnSearches[col.id] ? "text-primary" : ""}`}
                                  >
                                    <Search className={`h-3 w-3 ${columnSearches[col.id] ? "text-primary" : "text-muted-foreground"}`} />
                                  </button>
                                </PopoverTrigger>
                                <PopoverContent className="w-56 p-2" align="start">
                                  <div className="space-y-2">
                                    <p className="text-xs font-medium text-muted-foreground">Search {col.label}</p>
                                    <div className="relative">
                                      <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                                      <Input
                                        placeholder={`Filter ${col.label.toLowerCase()}...`}
                                        value={columnSearches[col.id]}
                                        onChange={(e) => updateColumnSearch(col.id, e.target.value)}
                                        className="h-8 pl-7 text-sm"
                                        autoFocus
                                      />
                                    </div>
                                    {columnSearches[col.id] && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="w-full h-7 text-xs"
                                        onClick={() => updateColumnSearch(col.id, "")}
                                      >
                                        <X className="h-3 w-3 mr-1" />
                                        Clear
                                      </Button>
                                    )}
                                  </div>
                                </PopoverContent>
                              </Popover>
                            )}
                            {/* Freeze Toggle in header */}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button type="button" className="p-0.5 hover:bg-primary/10 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                  <MoreHorizontal className="h-3 w-3 text-muted-foreground" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="start" className="w-40">
                                <DropdownMenuItem onClick={() => toggleFrozenColumn(col.id)}>
                                  {isFrozen ? (
                                    <>
                                      <PinOff className="h-4 w-4 mr-2" />
                                      Unfreeze
                                    </>
                                  ) : (
                                    <>
                                      <Pin className="h-4 w-4 mr-2" />
                                      Freeze
                                    </>
                                  )}
                                </DropdownMenuItem>
                                {col.sortable && (
                                  <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => setColumnSort({ columnId: col.id, direction: "asc" })}>
                                      <ArrowUp className="h-4 w-4 mr-2" />
                                      Sort Ascending
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setColumnSort({ columnId: col.id, direction: "desc" })}>
                                      <ArrowDown className="h-4 w-4 mr-2" />
                                      Sort Descending
                                    </DropdownMenuItem>
                                  </>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </th>
                    )
                  })}

                  {/* Actions - Always Pinned Right */}
                  <th className="sticky right-0 z-40 bg-gray-100 dark:bg-zinc-900 px-2 py-2 text-center font-semibold w-[110px] before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-border before:shadow-[-2px_0_8px_rgba(0,0,0,0.1)] relative">
                    <span className="text-xs">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan={columnConfig.length + 2} className="text-center py-8 text-muted-foreground">
                      No tasks found matching your filters
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map((task) => {
                    const isClickable = task.module === "invoice" || task.module === "rfq"
                    return (
                      <tr
                        key={task.id}
                        className={`border-b last:border-b-0 group hover:bg-muted/30 ${isClickable ? "cursor-pointer" : ""}`}
                        onClick={(e) => isClickable && handleRowClick(task, e)}
                      >
                        {/* Checkbox - Always Pinned */}
                        <td className="sticky left-0 z-20 bg-white dark:bg-zinc-950 group-hover:bg-gray-50 dark:group-hover:bg-zinc-900 px-3 py-2.5 transition-colors">
                          <Checkbox
                            checked={selectedTasks.includes(task.id)}
                            onCheckedChange={() => toggleTaskSelection(task.id)}
                          />
                        </td>

                        {/* Dynamic Columns */}
                        {columnConfig.map((col, index) => {
                          const isFrozen = isColumnFrozen(col.id)
                          const isLastFrozen = isFrozen && !isColumnFrozen(columnConfig[index + 1]?.id)
                          const leftPos = isFrozen ? getFrozenLeftPosition(col.id) : undefined

                          // Render cell content based on column type
                          const renderCellContent = () => {
                            switch (col.id) {
                              case "criticality":
                                return getPriorityIcon(task.slaUrgency)
                              case "taskId":
                                return (
                                  <HoverCard openDelay={200} closeDelay={100}>
                                    <HoverCardTrigger asChild>
                                      <button type="button" className="font-medium text-primary hover:underline cursor-pointer">
                                        {task.taskId}
                                      </button>
                                    </HoverCardTrigger>
                                    <HoverCardContent side="right" align="start" className="w-[380px] p-0">
                                      {/* Header */}
                                      <div className="px-4 py-3 border-b bg-slate-50">
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-2">
                                            <div className={`w-2.5 h-2.5 rounded-full ${
                                              task.module === "invoice" ? "bg-blue-500" :
                                              task.module === "rfq" ? "bg-purple-500" :
                                              task.module === "po" ? "bg-green-500" : "bg-gray-500"
                                            }`} />
                                            <span className="font-semibold text-slate-900">{task.caseId || task.taskId}</span>
                                          </div>
                                          <Badge variant="outline" className="text-[10px]">
                                            {modules.find(m => m.id === task.module)?.label || task.module}
                                          </Badge>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1">{task.title || task.vendor || "-"}</p>
                                      </div>
                                      
                                      {/* Content */}
                                      <div className="p-4 space-y-3">
                                        {/* Key Metrics Row */}
                                        <div className="grid grid-cols-3 gap-2">
                                          <div className="rounded-md bg-blue-50 border border-blue-100 p-2 text-center">
                                            <p className="text-xs text-slate-500">Amount</p>
                                            <p className="text-sm font-semibold text-blue-700">
                                              {task.invoiceAmount || task.rfqValue || task.requestValue || "-"}
                                            </p>
                                          </div>
                                          <div className={`rounded-md p-2 text-center ${
                                            task.slaUrgency === "critical" ? "bg-red-50 border border-red-100" :
                                            task.slaUrgency === "high" ? "bg-orange-50 border border-orange-100" :
                                            "bg-slate-50 border border-slate-100"
                                          }`}>
                                            <p className="text-xs text-slate-500">SLA</p>
                                            <p className={`text-sm font-semibold ${
                                              task.slaUrgency === "critical" ? "text-red-700" :
                                              task.slaUrgency === "high" ? "text-orange-700" : "text-slate-700"
                                            }`}>{task.slaDue}</p>
                                          </div>
                                          <div className="rounded-md bg-slate-50 border border-slate-100 p-2 text-center">
                                            <p className="text-xs text-slate-500">Stage</p>
                                            <p className="text-sm font-medium text-slate-700 truncate">{task.processStage || "-"}</p>
                                          </div>
                                        </div>

                                        {/* Details Grid */}
                                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                                          <div>
                                            <p className="text-slate-400 uppercase tracking-wide text-[10px]">Vendor</p>
                                            <p className="font-medium text-slate-700">{task.vendor || task.supplier || "-"}</p>
                                          </div>
                                          <div>
                                            <p className="text-slate-400 uppercase tracking-wide text-[10px]">Vendor Code</p>
                                            <p className="font-medium text-slate-600 font-mono">{task.vendorCode || "-"}</p>
                                          </div>
                                          <div>
                                            <p className="text-slate-400 uppercase tracking-wide text-[10px]">
                                              {task.module === "invoice" ? "Invoice No." : task.module === "rfq" ? "RFQ No." : "PO No."}
                                            </p>
                                            <p className="font-medium text-slate-700">{task.invoiceNumber || task.rfqNumber || task.poNumber || "-"}</p>
                                          </div>
                                          <div>
                                            <p className="text-slate-400 uppercase tracking-wide text-[10px]">Company Code</p>
                                            <p className="font-medium text-slate-600">{task.companyCode || "-"}</p>
                                          </div>
                                          <div>
                                            <p className="text-slate-400 uppercase tracking-wide text-[10px]">Owner</p>
                                            <p className="font-medium text-slate-700">{task.owner || "-"}</p>
                                          </div>
                                          <div>
                                            <p className="text-slate-400 uppercase tracking-wide text-[10px]">Assigned</p>
                                            <p className="font-medium text-slate-700">{task.assignedDate || "-"}</p>
                                          </div>
                                        </div>

                                        {/* Footer Info */}
                                        {(task.paymentDate || task.requestorName || task.initiator) && (
                                          <div className="pt-2 border-t border-dashed">
                                            <div className="flex items-center justify-between text-xs">
                                              {task.module === "invoice" && task.paymentDate && (
                                                <>
                                                  <span className="text-slate-500">Payment Due</span>
                                                  <span className="font-medium text-slate-700">{task.paymentDate}</span>
                                                </>
                                              )}
                                              {task.module === "rfq" && task.requestorName && (
                                                <>
                                                  <span className="text-slate-500">Requestor</span>
                                                  <span className="font-medium text-slate-700">{task.requestorName}</span>
                                                </>
                                              )}
                                              {task.module === "po" && task.initiator && (
                                                <>
                                                  <span className="text-slate-500">Initiator</span>
                                                  <span className="font-medium text-slate-700">{task.initiator}</span>
                                                </>
                                              )}
                                            </div>
                                          </div>
                                        )}
                                      </div>

                                      {/* Action Hint */}
                                      <div className="px-4 py-2 border-t bg-slate-50 text-center">
                                        <p className="text-[10px] text-slate-400">Click to open task details</p>
                                      </div>
                                    </HoverCardContent>
                                  </HoverCard>
                                )
                              case "docId":
                                return (
                                  <HoverCard openDelay={200} closeDelay={100}>
                                    <HoverCardTrigger asChild>
                                      <button type="button" className="font-medium hover:text-primary hover:underline cursor-pointer">
                                        {task.id}
                                      </button>
                                    </HoverCardTrigger>
                                    <HoverCardContent side="right" align="start" className="w-[380px] p-0">
                                      {/* Header */}
                                      <div className="px-4 py-3 border-b bg-slate-50">
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-2">
                                            <div className={`w-2.5 h-2.5 rounded-full ${
                                              task.module === "invoice" ? "bg-blue-500" :
                                              task.module === "rfq" ? "bg-purple-500" :
                                              task.module === "po" ? "bg-green-500" : "bg-gray-500"
                                            }`} />
                                            <span className="font-semibold text-slate-900">{task.id}</span>
                                          </div>
                                          <Badge variant="outline" className="text-[10px]">
                                            {modules.find(m => m.id === task.module)?.label || task.module}
                                          </Badge>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1">{task.title || task.vendor || "-"}</p>
                                      </div>
                                      
                                      {/* Content */}
                                      <div className="p-4 space-y-3">
                                        {/* Key Metrics Row */}
                                        <div className="grid grid-cols-3 gap-2">
                                          <div className="rounded-md bg-blue-50 border border-blue-100 p-2 text-center">
                                            <p className="text-xs text-slate-500">Amount</p>
                                            <p className="text-sm font-semibold text-blue-700">
                                              {task.invoiceAmount || task.rfqValue || task.requestValue || "-"}
                                            </p>
                                          </div>
                                          <div className={`rounded-md p-2 text-center ${
                                            task.slaUrgency === "critical" ? "bg-red-50 border border-red-100" :
                                            task.slaUrgency === "high" ? "bg-orange-50 border border-orange-100" :
                                            "bg-slate-50 border border-slate-100"
                                          }`}>
                                            <p className="text-xs text-slate-500">SLA</p>
                                            <p className={`text-sm font-semibold ${
                                              task.slaUrgency === "critical" ? "text-red-700" :
                                              task.slaUrgency === "high" ? "text-orange-700" : "text-slate-700"
                                            }`}>{task.slaDue}</p>
                                          </div>
                                          <div className="rounded-md bg-slate-50 border border-slate-100 p-2 text-center">
                                            <p className="text-xs text-slate-500">Stage</p>
                                            <p className="text-sm font-medium text-slate-700 truncate">{task.processStage || "-"}</p>
                                          </div>
                                        </div>

                                        {/* Details Grid */}
                                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                                          <div>
                                            <p className="text-slate-400 uppercase tracking-wide text-[10px]">Vendor</p>
                                            <p className="font-medium text-slate-700">{task.vendor || task.supplier || "-"}</p>
                                          </div>
                                          <div>
                                            <p className="text-slate-400 uppercase tracking-wide text-[10px]">Vendor Code</p>
                                            <p className="font-medium text-slate-600 font-mono">{task.vendorCode || "-"}</p>
                                          </div>
                                          <div>
                                            <p className="text-slate-400 uppercase tracking-wide text-[10px]">
                                              {task.module === "invoice" ? "Invoice No." : task.module === "rfq" ? "RFQ No." : "PO No."}
                                            </p>
                                            <p className="font-medium text-slate-700">{task.invoiceNumber || task.rfqNumber || task.poNumber || "-"}</p>
                                          </div>
                                          <div>
                                            <p className="text-slate-400 uppercase tracking-wide text-[10px]">Company Code</p>
                                            <p className="font-medium text-slate-600">{task.companyCode || "-"}</p>
                                          </div>
                                          <div>
                                            <p className="text-slate-400 uppercase tracking-wide text-[10px]">Owner</p>
                                            <p className="font-medium text-slate-700">{task.owner || "-"}</p>
                                          </div>
                                          <div>
                                            <p className="text-slate-400 uppercase tracking-wide text-[10px]">Assigned</p>
                                            <p className="font-medium text-slate-700">{task.assignedDate || "-"}</p>
                                          </div>
                                        </div>

                                        {/* Footer Info */}
                                        {(task.paymentDate || task.requestorName || task.initiator) && (
                                          <div className="pt-2 border-t border-dashed">
                                            <div className="flex items-center justify-between text-xs">
                                              {task.module === "invoice" && task.paymentDate && (
                                                <>
                                                  <span className="text-slate-500">Payment Due</span>
                                                  <span className="font-medium text-slate-700">{task.paymentDate}</span>
                                                </>
                                              )}
                                              {task.module === "rfq" && task.requestorName && (
                                                <>
                                                  <span className="text-slate-500">Requestor</span>
                                                  <span className="font-medium text-slate-700">{task.requestorName}</span>
                                                </>
                                              )}
                                              {task.module === "po" && task.initiator && (
                                                <>
                                                  <span className="text-slate-500">Initiator</span>
                                                  <span className="font-medium text-slate-700">{task.initiator}</span>
                                                </>
                                              )}
                                            </div>
                                          </div>
                                        )}
                                      </div>

                                      {/* Action Hint */}
                                      <div className="px-4 py-2 border-t bg-slate-50 text-center">
                                        <p className="text-[10px] text-slate-400">Click to open task details</p>
                                      </div>
                                    </HoverCardContent>
                                  </HoverCard>
                                )
                              case "type":
                                return getDocTypeIcon(task.docType)
                              case "stage":
                                return <span className="text-xs text-muted-foreground">{task.processStage}</span>
                              case "value":
                                return <span className="font-medium text-right block">{getValueImpact(task)}</span>
                              case "coCode":
                                return <span className="text-muted-foreground">{task.companyCode}</span>
                              case "vendorCode":
                                return <span className="text-muted-foreground font-mono text-xs">{task.vendorCode || "-"}</span>
                              case "vendorName":
                                return (
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <span className="truncate max-w-[120px] block">{getVendorName(task)}</span>
                                    </TooltipTrigger>
                                    <TooltipContent>{getVendorName(task)}</TooltipContent>
                                  </Tooltip>
                                )
                              case "rfqType":
                                return (
                                  <span
                                    className={`text-xs px-2 py-0.5 rounded ${
                                      task.rfqType === "Material"
                                        ? "bg-blue-100 text-blue-700"
                                        : task.rfqType === "Service"
                                          ? "bg-purple-100 text-purple-700"
                                          : "text-muted-foreground"
                                    }`}
                                  >
                                    {task.rfqType}
                                  </span>
                                )
                              case "assignedDate":
                                return (
                                  <div className="flex items-center gap-1.5">
                                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                                    <span className="text-xs">{task.assignedDate}</span>
                                  </div>
                                )
                              case "slaOverdue":
                                return task.slaOverdue !== "-" ? (
                                  <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded">
                                    <AlertTriangle className="h-3 w-3" />
                                    {task.slaOverdue}
                                  </span>
                                ) : (
                                  <span className="text-xs text-muted-foreground">-</span>
                                )
                              case "status":
                                return (
                                  <span
                                    className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                                      task.status === "pending"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : task.status === "in-progress"
                                          ? "bg-blue-100 text-blue-700"
                                          : task.status === "completed"
                                            ? "bg-green-100 text-green-700"
                                            : task.status === "escalated"
                                              ? "bg-red-100 text-red-700"
                                              : "bg-gray-100 text-gray-700"
                                    }`}
                                  >
                                    {task.status === "pending" && <Clock className="h-3 w-3" />}
                                    {task.status === "in-progress" && <Play className="h-3 w-3" />}
                                    {task.status === "completed" && <CheckCircle2 className="h-3 w-3" />}
                                    {task.status === "escalated" && <AlertTriangle className="h-3 w-3" />}
                                    {task.status.charAt(0).toUpperCase() + task.status.slice(1).replace("-", " ")}
                                  </span>
                                )
                              default:
                                return null
                            }
                          }

                          return (
                            <td
                              key={col.id}
                              className={`px-2 py-2.5 transition-colors ${
                                isFrozen ? "sticky z-20 bg-white dark:bg-zinc-950 group-hover:bg-gray-50 dark:group-hover:bg-zinc-900" : "group-hover:bg-gray-50 dark:group-hover:bg-zinc-900"
                              } ${isLastFrozen ? "after:content-[''] after:absolute after:right-0 after:top-0 after:bottom-0 after:w-px after:bg-border after:shadow-[2px_0_8px_rgba(0,0,0,0.1)] relative" : ""} ${
                                col.id === "value" || col.id === "slaOverdue" || col.id === "status" ? "text-center" : ""
                              }`}
                              style={{
                                minWidth: col.minWidth,
                                left: isFrozen ? `${leftPos}px` : undefined,
                              }}
                            >
                              {renderCellContent()}
                            </td>
                          )
                        })}

                        {/* Actions - Always Pinned Right */}
                        <td className="sticky right-0 z-20 bg-white dark:bg-zinc-950 group-hover:bg-gray-50 dark:group-hover:bg-zinc-900 px-2 py-2.5 transition-colors before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-border before:shadow-[-2px_0_8px_rgba(0,0,0,0.1)] relative">
                          <div className="flex items-center gap-1 justify-center">
                            {/* Primary Action 1 - Contextual based on task type */}
                            {task.taskType === "approval" && task.status === "pending" && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button size="sm" className="h-7 px-2 bg-green-600 hover:bg-green-700">
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Approve</TooltipContent>
                              </Tooltip>
                            )}
                            {task.taskType === "acknowledgement" && task.status === "pending" && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button size="sm" className="h-7 px-2 bg-blue-600 hover:bg-blue-700">
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Acknowledge</TooltipContent>
                              </Tooltip>
                            )}
                            {task.taskType === "review" && (task.status === "pending" || task.status === "in-progress") && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button size="sm" className="h-7 px-2 bg-blue-600 hover:bg-blue-700">
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Complete Review</TooltipContent>
                              </Tooltip>
                            )}
                            {task.taskType === "resolution" && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button size="sm" className="h-7 px-2 bg-amber-600 hover:bg-amber-700">
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Resolve</TooltipContent>
                              </Tooltip>
                            )}
                            {(task.taskType === "information" || task.status === "completed") && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="outline" size="sm" className="h-7 px-2 bg-transparent">
                                    <Eye className="h-3.5 w-3.5" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>View Details</TooltipContent>
                              </Tooltip>
                            )}

                            {/* Primary Action 2 - View Details (if not already shown) */}
                            {task.taskType !== "information" && task.status !== "completed" && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="outline" size="sm" className="h-7 px-2 bg-transparent">
                                    <Eye className="h-3.5 w-3.5" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>View Details</TooltipContent>
                              </Tooltip>
                            )}

                            {/* More Actions Dropdown */}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <UserPlus className="h-4 w-4 mr-2" />
                                  Assign
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Forward className="h-4 w-4 mr-2" />
                                  Re-assign
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Showing {filteredTasks.length} of {allTasks.length} tasks
          </span>
          <span>Sorted by urgency and impact</span>
  </div>
  </div>
  </div>

      {/* Bulk Action Summary Modal */}
      <Dialog open={bulkActionModal.isOpen} onOpenChange={(open) => !open && closeBulkActionModal()}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {bulkActionModal.action === "approve" && <CheckCircle2 className="h-5 w-5 text-green-600" />}
              {bulkActionModal.action === "reject" && <X className="h-5 w-5 text-red-600" />}
              {bulkActionModal.action === "assign" && <UserCheck className="h-5 w-5 text-blue-600" />}
              {bulkActionModal.action === "reassign" && <Forward className="h-5 w-5 text-orange-600" />}
              {getActionLabel(bulkActionModal.action)} {selectedTasks.length} {selectedTasks.length === 1 ? "Task" : "Tasks"}
            </DialogTitle>
            <DialogDescription>
              Review the selected tasks before proceeding with the bulk action.
            </DialogDescription>
          </DialogHeader>

          {/* Summary Stats */}
          <div className="grid grid-cols-4 gap-3 py-3">
            <div className="rounded-lg border bg-slate-50 p-3 text-center">
              <p className="text-2xl font-bold text-slate-900">{selectedTasks.length}</p>
              <p className="text-xs text-slate-500">Total Tasks</p>
            </div>
            <div className="rounded-lg border bg-blue-50 p-3 text-center">
              <p className="text-2xl font-bold text-blue-600">{selectedTasksTotals.invoiceCount}</p>
              <p className="text-xs text-slate-500">Invoices</p>
            </div>
            <div className="rounded-lg border bg-purple-50 p-3 text-center">
              <p className="text-2xl font-bold text-purple-600">{selectedTasksTotals.rfqCount}</p>
              <p className="text-xs text-slate-500">RFQs</p>
            </div>
            <div className="rounded-lg border bg-green-50 p-3 text-center">
              <p className="text-2xl font-bold text-green-600">
                {selectedTasksTotals.totalAmount > 0 
                  ? `${(selectedTasksTotals.totalAmount / 1000).toFixed(0)}K`
                  : "0"
                }
              </p>
              <p className="text-xs text-slate-500">Total Value</p>
            </div>
          </div>

          <Separator />

          {/* Selected Tasks List with Details */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-700">Selected Tasks</p>
              <span className="text-xs text-slate-500">{selectedTasks.length} items</span>
            </div>
            <ScrollArea className="h-[280px] rounded-md border">
              <div className="p-3 space-y-3">
                {selectedTasksData.map((task) => task && (
                  <div
                    key={task.id}
                    className="rounded-lg border bg-white p-4 hover:shadow-sm transition-shadow"
                  >
                    {/* Task Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full ${
                          task.module === "invoice" ? "bg-blue-500" :
                          task.module === "rfq" ? "bg-purple-500" :
                          task.module === "po" ? "bg-green-500" :
                          "bg-gray-500"
                        }`} />
                        <span className="font-semibold text-slate-900">{task.caseId || `TASK-${task.id}`}</span>
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                          {modules.find(m => m.id === task.module)?.label || task.module}
                        </Badge>
                      </div>
                      <Badge 
                        className={`text-[10px] ${
                          task.slaUrgency === "critical" ? "bg-red-100 text-red-700 border-red-200" :
                          task.slaUrgency === "high" ? "bg-orange-100 text-orange-700 border-orange-200" :
                          "bg-slate-100 text-slate-700 border-slate-200"
                        }`}
                        variant="outline"
                      >
                        SLA: {task.slaDue}
                      </Badge>
                    </div>

                    {/* Task Details Grid */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                      {/* Vendor/Supplier Info */}
                      <div className="space-y-0.5">
                        <p className="text-slate-400 uppercase tracking-wide text-[10px]">
                          {task.module === "rfq" ? "Supplier" : "Vendor"}
                        </p>
                        <p className="font-medium text-slate-700">{task.vendor || task.supplier || task.primaryEntity || "-"}</p>
                      </div>

                      {/* Amount */}
                      <div className="space-y-0.5">
                        <p className="text-slate-400 uppercase tracking-wide text-[10px]">Amount</p>
                        <p className="font-semibold text-slate-900">
                          {task.invoiceAmount || task.rfqValue || task.requestValue || "-"}
                        </p>
                      </div>

                      {/* Document Number */}
                      <div className="space-y-0.5">
                        <p className="text-slate-400 uppercase tracking-wide text-[10px]">
                          {task.module === "invoice" ? "Invoice No." : task.module === "rfq" ? "RFQ No." : "PO No."}
                        </p>
                        <p className="font-medium text-slate-700">
                          {task.invoiceNumber || task.rfqNumber || task.poNumber || "-"}
                        </p>
                      </div>

                      {/* Process Stage */}
                      <div className="space-y-0.5">
                        <p className="text-slate-400 uppercase tracking-wide text-[10px]">Stage</p>
                        <p className="font-medium text-slate-700">{task.processStage || "-"}</p>
                      </div>

                      {/* Owner */}
                      <div className="space-y-0.5">
                        <p className="text-slate-400 uppercase tracking-wide text-[10px]">Owner</p>
                        <p className="font-medium text-slate-700">{task.owner || "-"}</p>
                      </div>

                      {/* Assigned Date */}
                      <div className="space-y-0.5">
                        <p className="text-slate-400 uppercase tracking-wide text-[10px]">Assigned</p>
                        <p className="font-medium text-slate-700">{task.assignedDate || "-"}</p>
                      </div>

                      {/* Vendor Code */}
                      <div className="space-y-0.5">
                        <p className="text-slate-400 uppercase tracking-wide text-[10px]">Vendor Code</p>
                        <p className="font-medium text-slate-600 font-mono text-[10px]">{task.vendorCode || "-"}</p>
                      </div>

                      {/* Company Code */}
                      <div className="space-y-0.5">
                        <p className="text-slate-400 uppercase tracking-wide text-[10px]">Company Code</p>
                        <p className="font-medium text-slate-600">{task.companyCode || "-"}</p>
                      </div>
                    </div>

                    {/* Additional Info for specific modules */}
                    {task.module === "invoice" && task.paymentDate && (
                      <div className="mt-3 pt-2 border-t border-dashed flex items-center justify-between text-xs">
                        <span className="text-slate-500">Payment Due</span>
                        <span className="font-medium text-slate-700">{task.paymentDate}</span>
                      </div>
                    )}
                    {task.module === "rfq" && task.requestorName && (
                      <div className="mt-3 pt-2 border-t border-dashed flex items-center justify-between text-xs">
                        <span className="text-slate-500">Requestor</span>
                        <span className="font-medium text-slate-700">{task.requestorName}</span>
                      </div>
                    )}
                    {task.module === "po" && task.initiator && (
                      <div className="mt-3 pt-2 border-t border-dashed flex items-center justify-between text-xs">
                        <span className="text-slate-500">Initiated by</span>
                        <span className="font-medium text-slate-700">{task.initiator}</span>
                      </div>
                    )}

                    {/* Comment input for approve action */}
                    {bulkActionModal.action === "approve" && (
                      <div className="mt-3 pt-3 border-t border-slate-200">
                        <label htmlFor={`comment-${task.id}`} className="block text-xs font-medium text-slate-600 mb-1.5">
                          Approval Comment <span className="text-slate-400">(optional)</span>
                        </label>
                        <Textarea
                          id={`comment-${task.id}`}
                          placeholder="Add a comment for this approval..."
                          className="h-16 text-xs resize-none"
                          value={approvalComments[task.id] || ""}
                          onChange={(e) => setApprovalComments(prev => ({
                            ...prev,
                            [task.id]: e.target.value
                          }))}
                        />
                      </div>
                    )}

                    {/* User selector for assign/reassign actions */}
                    {(bulkActionModal.action === "assign" || bulkActionModal.action === "reassign") && (
                      <div className="mt-3 pt-3 border-t border-slate-200">
                        <label htmlFor={`assignee-${task.id}`} className="block text-xs font-medium text-slate-600 mb-1.5">
                          {bulkActionModal.action === "assign" ? "Assign to" : "Reassign to"} <span className="text-red-500">*</span>
                        </label>
                        
                        {/* Selected user display */}
                        {taskAssignees[task.id] ? (
                          <div className="flex items-center justify-between bg-slate-50 rounded-md p-2 border border-slate-200">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
                                <span className="text-xs font-semibold text-blue-700">
                                  {taskAssignees[task.id]?.name.split(" ").map(n => n[0]).join("")}
                                </span>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-slate-800">{taskAssignees[task.id]?.name}</p>
                                <p className="text-[10px] text-slate-500">{taskAssignees[task.id]?.email}</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => setTaskAssignees(prev => ({ ...prev, [task.id]: null }))}
                              className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-600"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="relative">
                            <div className="relative">
                              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                              <Input
                                id={`assignee-${task.id}`}
                                placeholder="Search users by name or email..."
                                className="h-8 text-xs pl-8"
                                value={assigneeSearchQuery[task.id] || ""}
                                onChange={(e) => setAssigneeSearchQuery(prev => ({
                                  ...prev,
                                  [task.id]: e.target.value
                                }))}
                              />
                            </div>
                            
                            {/* User dropdown */}
                            {(assigneeSearchQuery[task.id]?.length > 0 || true) && (
                              <div className="absolute z-10 mt-1 w-full bg-white border border-slate-200 rounded-md shadow-lg max-h-32 overflow-y-auto">
                                {availableUsers
                                  .filter(user => 
                                    !assigneeSearchQuery[task.id] ||
                                    user.name.toLowerCase().includes(assigneeSearchQuery[task.id]?.toLowerCase() || "") ||
                                    user.email.toLowerCase().includes(assigneeSearchQuery[task.id]?.toLowerCase() || "")
                                  )
                                  .map(user => (
                                    <button
                                      key={user.id}
                                      type="button"
                                      className="w-full flex items-center gap-2 px-2.5 py-1.5 hover:bg-slate-50 text-left"
                                      onClick={() => {
                                        setTaskAssignees(prev => ({
                                          ...prev,
                                          [task.id]: { id: user.id, name: user.name, email: user.email }
                                        }))
                                        setAssigneeSearchQuery(prev => ({ ...prev, [task.id]: "" }))
                                      }}
                                    >
                                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                                        <span className="text-[10px] font-medium text-slate-600">
                                          {user.name.split(" ").map(n => n[0]).join("")}
                                        </span>
                                      </div>
                                      <div className="min-w-0 flex-1">
                                        <p className="text-xs font-medium text-slate-700 truncate">{user.name}</p>
                                        <p className="text-[10px] text-slate-500 truncate">{user.email} - {user.department}</p>
                                      </div>
                                    </button>
                                  ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Warning message for certain actions */}
          {bulkActionModal.action === "reject" && (
            <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-3">
              <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-amber-800">This action cannot be undone</p>
                <p className="text-xs text-amber-700">Rejecting these tasks will send them back to the submitter for revision.</p>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={closeBulkActionModal} className="bg-transparent">
              Cancel
            </Button>
            <Button 
              className={getActionColorClasses(bulkActionModal.action)}
              onClick={handleBulkActionConfirm}
            >
              {bulkActionModal.action === "approve" && <CheckCircle2 className="mr-2 h-4 w-4" />}
              {bulkActionModal.action === "reject" && <X className="mr-2 h-4 w-4" />}
              {bulkActionModal.action === "assign" && <UserCheck className="mr-2 h-4 w-4" />}
              {bulkActionModal.action === "reassign" && <Forward className="mr-2 h-4 w-4" />}
              {getActionLabel(bulkActionModal.action)} {selectedTasks.length} {selectedTasks.length === 1 ? "Task" : "Tasks"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
  </TooltipProvider>
  )
}
