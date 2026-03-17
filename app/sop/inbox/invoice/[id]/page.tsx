"use client"

import { AvatarFallback } from "@/components/ui/avatar"

import { Avatar } from "@/components/ui/avatar"

import { Badge } from "@/components/ui/badge"

import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu"

import { DropdownMenuItem } from "@/components/ui/dropdown-menu"

import { DropdownMenuContent } from "@/components/ui/dropdown-menu"

import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import { DropdownMenu } from "@/components/ui/dropdown-menu"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertCircle,
  CheckCircle,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Minus,
  Plus,
  RotateCcw,
  Download,
  Printer,
  FileText,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Loader2,
  Clock,
  Send,
  X,
  Settings2,
  ScanSearch,
  Link2,
  Crosshair,
  Maximize2,
  Minimize2,
  PinOff,
  ArrowUpToLine,
  ArrowDownToLine,
  ArrowLeftRight,
  Save,
  SlidersHorizontal,
  Eye,
  EyeOff,
  Layout,
  PanelLeft,
  PanelRight,
  PanelBottom,
  Keyboard,
  RotateCw,
  Bookmark,
  Upload,
  Truck,
  List,
  Table2,
} from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

// Mock invoice data
const invoiceData: Record<string, {
  taskId: string
  poNumber: string
  vendor: string
  vendorCode: string
  invoiceNumber: string
  invoiceDate: string
  fiscalYear: string
  baseAmount: string
  baseAmountNum: number
  taxAmount: string
  taxAmountNum: number
  tdsAmount: string
  tdsAmountNum: number
  totalAmount: string
  totalAmountNum: number
  netPayableAmount: string
  netPayableAmountNum: number
  currency: string
  organization: string
  status: "New" | "In Review" | "Posting Error" | "Waiting for Clarification" | "Approved" | "Rejected"
  erpStatus: "Success" | "Failed" | "Not Attempted"
  timeInState: string
  slaDue?: string
  systemMessage?: string
  billToGST: string
  shipToGST: string
  locationOfSupply: string
  department: string
  costCenter: string
  baseAmtDiff?: string
  errors?: Array<{ field: string; message: string }>
}> = {
  "603076": {
    taskId: "TASK-12345",
    poNumber: "PO 4511096443",
    vendor: "Jindal Steel",
    vendorCode: "0000083733",
    invoiceNumber: "020",
    invoiceDate: "06.05.2025",
    fiscalYear: "2025",
    baseAmount: "54,230.00",
    baseAmountNum: 54230,
    taxAmount: "86.40",
    taxAmountNum: 86.40,
    tdsAmount: "1,000.00",
    tdsAmountNum: 1000,
    totalAmount: "55,316.40",
    totalAmountNum: 55316.40,
    netPayableAmount: "54,316.40",
    netPayableAmountNum: 54316.40,
    currency: "INR",
    organization: "JSPL",
    status: "In Review",
    erpStatus: "Not Attempted",
    timeInState: "2 hours 15 minutes",
    slaDue: "3 hours 45 minutes",
    billToGST: "27AAFCU5055K1Z0",
    shipToGST: "27AAFCU5055K1Z0",
    locationOfSupply: "New Delhi",
    department: "Operations",
    costCenter: "CC-2024-001",
    baseAmtDiff: "NA",
    // Document data for viewer
    document: {
      companyName: "JINDAL STEEL",
      companyTagline: "STEEL MANUFACTURER",
      color: "blue",
      customerName: "Ravi Kumar",
      customerPhone: "91-9876543210",
      customerEmail: "ravi@jindalsteel.com",
      customerAddress: "Industrial Area, New Delhi",
      invoiceDisplayNo: "JS-2025-020",
      invoiceDisplayDate: "06 May 2025",
      lineItems: [
        { description: "Steel Plates - Grade A", qty: 100, price: 350, total: 35000 },
        { description: "Steel Rods - 12mm", qty: 50, price: 280, total: 14000 },
        { description: "Fabrication Work", qty: 1, price: 5230, total: 5230 },
      ],
      subTotal: "54,230.00",
      taxRate: "0.16%",
      tax: "86.40",
      grandTotal: "55,316.40",
    },
  },
  "51692": {
    taskId: "TASK-12346",
    poNumber: "PO 4511096444",
    vendor: "Power Corp",
    vendorCode: "0000922779",
    invoiceNumber: "021",
    invoiceDate: "15.03.2025",
    fiscalYear: "2025",
    baseAmount: "78,500.00",
    baseAmountNum: 78500,
    taxAmount: "125.60",
    taxAmountNum: 125.60,
    tdsAmount: "1,200.00",
    tdsAmountNum: 1200,
    totalAmount: "79,825.60",
    totalAmountNum: 79825.60,
    netPayableAmount: "78,625.60",
    netPayableAmountNum: 78625.60,
    currency: "INR",
    organization: "JSPL",
    status: "New",
    erpStatus: "Not Attempted",
    timeInState: "30 minutes",
    slaDue: "5 hours 30 minutes",
    billToGST: "27AAFCU5055K1Z0",
    shipToGST: "27AAFCU5055K1Z0",
    locationOfSupply: "Bangalore",
    department: "Finance",
    costCenter: "CC-2024-002",
    baseAmtDiff: "NA",
    // Document data for viewer
    document: {
      companyName: "POWER CORP",
      companyTagline: "ENERGY SOLUTIONS",
      color: "emerald",
      customerName: "Anita Sharma",
      customerPhone: "91-8765432109",
      customerEmail: "anita@powercorp.in",
      customerAddress: "Tech Park, Bangalore",
      invoiceDisplayNo: "PC-2025-021",
      invoiceDisplayDate: "15 March 2025",
      lineItems: [
        { description: "Electrical Panel Installation", qty: 2, price: 25000, total: 50000 },
        { description: "Cable Wiring - Industrial", qty: 500, price: 45, total: 22500 },
        { description: "Transformer Maintenance", qty: 1, price: 6000, total: 6000 },
      ],
      subTotal: "78,500.00",
      taxRate: "0.16%",
      tax: "125.60",
      grandTotal: "79,825.60",
    },
  },
  "51695": {
    taskId: "TASK-12347",
    poNumber: "PO 4511096445",
    vendor: "Steel Works",
    vendorCode: "0000063359",
    invoiceNumber: "022",
    invoiceDate: "10.03.2025",
    fiscalYear: "2025",
    baseAmount: "32,000.00",
    baseAmountNum: 32000,
    taxAmount: "51.20",
    taxAmountNum: 51.20,
    tdsAmount: "500.00",
    tdsAmountNum: 500,
    totalAmount: "32,551.20",
    totalAmountNum: 32551.20,
    netPayableAmount: "32,051.20",
    netPayableAmountNum: 32051.20,
    currency: "INR",
    organization: "JSPL",
    status: "Posting Error",
    erpStatus: "Failed",
    timeInState: "1 hour 20 minutes",
    systemMessage: "Posting failed: Account 20200000 cannot be directly posted",
    billToGST: "27AAFCU5055K1Z0",
    shipToGST: "27AAFCU5055K1Z0",
    locationOfSupply: "Mumbai",
    department: "Procurement",
    costCenter: "CC-2024-003",
    baseAmtDiff: "-500.00",
    errors: [{ field: "costCenter", message: "Invalid cost center account mapping" }],
    // Document data for viewer
    document: {
      companyName: "STEEL WORKS",
      companyTagline: "METAL FABRICATION",
      color: "orange",
      customerName: "Vikram Patel",
      customerPhone: "91-7654321098",
      customerEmail: "vikram@steelworks.co.in",
      customerAddress: "MIDC, Mumbai",
      invoiceDisplayNo: "SW-2025-022",
      invoiceDisplayDate: "10 March 2025",
      lineItems: [
        { description: "MS Angles - 50x50mm", qty: 200, price: 85, total: 17000 },
        { description: "MS Channels - 100mm", qty: 100, price: 120, total: 12000 },
        { description: "Cutting & Welding", qty: 1, price: 3000, total: 3000 },
      ],
      subTotal: "32,000.00",
      taxRate: "0.16%",
      tax: "51.20",
      grandTotal: "32,551.20",
    },
  },
  "51698": {
    taskId: "TASK-12348",
    poNumber: "PO 4511096446",
    vendor: "Logistics Pro",
    vendorCode: "0000073507",
    invoiceNumber: "023",
    invoiceDate: "20.03.2025",
    fiscalYear: "2025",
    baseAmount: "95,000.00",
    baseAmountNum: 95000,
    taxAmount: "152.00",
    taxAmountNum: 152,
    tdsAmount: "1,500.00",
    tdsAmountNum: 1500,
    totalAmount: "96,652.00",
    totalAmountNum: 96652,
    netPayableAmount: "95,152.00",
    netPayableAmountNum: 95152,
    currency: "INR",
    organization: "JSPL",
    status: "Approved",
    erpStatus: "Success",
    timeInState: "5 minutes",
    billToGST: "27AAFCU5055K1Z0",
    shipToGST: "27AAFCU5055K1Z0",
    locationOfSupply: "Hyderabad",
    department: "Logistics",
    costCenter: "CC-2024-004",
    baseAmtDiff: "NA",
    // Document data for viewer
    document: {
      companyName: "LOGISTICS PRO",
      companyTagline: "TRANSPORT & WAREHOUSING",
      color: "purple",
      customerName: "Suresh Reddy",
      customerPhone: "91-6543210987",
      customerEmail: "suresh@logisticspro.in",
      customerAddress: "Hi-Tech City, Hyderabad",
      invoiceDisplayNo: "LP-2025-023",
      invoiceDisplayDate: "20 March 2025",
      lineItems: [
        { description: "Heavy Cargo Transport", qty: 5, price: 12000, total: 60000 },
        { description: "Warehousing - Monthly", qty: 1, price: 25000, total: 25000 },
        { description: "Loading/Unloading", qty: 10, price: 1000, total: 10000 },
      ],
      subTotal: "95,000.00",
      taxRate: "0.16%",
      tax: "152.00",
      grandTotal: "96,652.00",
    },
  },
}

// List of invoice IDs for navigation
const invoiceIds = ["603076", "51692", "51695", "51698"]

export default function InvoiceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const invoiceId = params.id as string
  const [zoom, setZoom] = useState(100)
  const [activeTab, setActiveTab] = useState("invoice-details")
  const [isNavigating, setIsNavigating] = useState(false)
  const [navigatingDirection, setNavigatingDirection] = useState<"prev" | "next" | null>(null)
  const [dividerPos, setDividerPos] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const [currentDocIndex, setCurrentDocIndex] = useState(0)
  const [ocrLinkingMode, setOcrLinkingMode] = useState(false)
  const [selectedOcrField, setSelectedOcrField] = useState<string | null>(null)
  const [isGrnTableExpanded, setIsGrnTableExpanded] = useState(false)
  const [metricsPanelPosition, setMetricsPanelPosition] = useState<"top" | "bottom">("bottom")
  const [isPanesSwapped, setIsPanesSwapped] = useState(false)
  const [isConfigOpen, setIsConfigOpen] = useState(false)
  
  // Configuration state
  const [config, setConfig] = useState({
    // Layout Controls
    showLeftPane: true,
    showRightPane: true,
    showMetricsPanel: true,
    enableSplitResize: true,
    enablePaneSwap: true,
    
    // Left Pane - Document Viewer
    showInvoicePDF: true,
    showLineItems: true,
    showTaxPaymentSummary: true,
    showOcrHighlights: true,
    autoScrollToMatchedFields: true,
    
    // Right Pane - Tabs visibility
    tabs: {
      invoiceDetails: true,
      vendorEvaluation: true,
      checklist: true,
      compliance: true,
      poDetails: true,
      grnDetails: true,
      actionHistory: true,
    },
    
    // Right Pane - Section blocks
    sections: {
      submitterDetails: true,
      basicInfo: true,
      vendorDetails: true,
      taxDetails: true,
      paymentDetails: true,
    },
    
    // Metrics Panel
    metrics: {
      invoiceAmount: true,
      taxAmount: true,
      netPayable: true,
      tds: true,
      variance: true,
    },
    metricsCompactMode: false,
    metricsStickyBehavior: true,
    
    // Navigation
    showNavigationArrows: true,
    enableKeyboardNavigation: true,
    
    // Current preset
    activePreset: "default" as "default" | "ap-executive" | "manager" | "auditor" | "custom",
  })

  // Preset configurations
  const presets = {
    default: {
      name: "Default View",
      description: "Standard layout with all features enabled",
    },
    "ap-executive": {
      name: "AP Executive",
      description: "Focused on approval workflow and key metrics",
    },
    manager: {
      name: "Manager",
      description: "High-level overview with compliance focus",
    },
    auditor: {
      name: "Auditor",
      description: "Detailed view with full audit trail",
    },
  }

  const applyPreset = (presetId: string) => {
    if (presetId === "default") {
      setConfig(prev => ({
        ...prev,
        showLeftPane: true,
        showRightPane: true,
        showMetricsPanel: true,
        enableSplitResize: true,
        enablePaneSwap: true,
        showInvoicePDF: true,
        showLineItems: true,
        showTaxPaymentSummary: true,
        showOcrHighlights: true,
        tabs: { invoiceDetails: true, vendorEvaluation: true, checklist: true, compliance: true, poDetails: true, grnDetails: true, actionHistory: true },
        sections: { submitterDetails: true, basicInfo: true, vendorDetails: true, taxDetails: true, paymentDetails: true },
        metrics: { invoiceAmount: true, taxAmount: true, netPayable: true, tds: true, variance: true },
        activePreset: "default",
      }))
    } else if (presetId === "ap-executive") {
      setConfig(prev => ({
        ...prev,
        showLeftPane: true,
        showRightPane: true,
        showMetricsPanel: true,
        tabs: { invoiceDetails: true, vendorEvaluation: false, checklist: true, compliance: false, poDetails: true, grnDetails: false, actionHistory: true },
        sections: { submitterDetails: false, basicInfo: true, vendorDetails: true, taxDetails: true, paymentDetails: true },
        activePreset: "ap-executive",
      }))
    } else if (presetId === "manager") {
      setConfig(prev => ({
        ...prev,
        showLeftPane: false,
        showRightPane: true,
        showMetricsPanel: true,
        metricsCompactMode: true,
        tabs: { invoiceDetails: true, vendorEvaluation: true, checklist: false, compliance: true, poDetails: false, grnDetails: false, actionHistory: true },
        activePreset: "manager",
      }))
    } else if (presetId === "auditor") {
      setConfig(prev => ({
        ...prev,
        showLeftPane: true,
        showRightPane: true,
        showMetricsPanel: true,
        showOcrHighlights: true,
        tabs: { invoiceDetails: true, vendorEvaluation: true, checklist: true, compliance: true, poDetails: true, grnDetails: true, actionHistory: true },
        sections: { submitterDetails: true, basicInfo: true, vendorDetails: true, taxDetails: true, paymentDetails: true },
        activePreset: "auditor",
      }))
    }
  }

  const resetToDefault = () => {
    applyPreset("default")
  }

  const updateConfig = (key: string, value: boolean | string) => {
    setConfig(prev => ({ ...prev, [key]: value, activePreset: "custom" }))
  }

  const updateNestedConfig = (parent: "tabs" | "sections" | "metrics", key: string, value: boolean) => {
    setConfig(prev => ({
      ...prev,
      [parent]: { ...prev[parent], [key]: value },
      activePreset: "custom",
    }))
  }

  // Color classes for dynamic invoice documents
  const getColorClasses = (color: string) => {
    const colorMap: Record<string, { text: string; bg: string; gradient: string }> = {
      blue: { text: "text-blue-500", bg: "bg-blue-500", gradient: "from-blue-500 to-blue-300" },
      emerald: { text: "text-emerald-500", bg: "bg-emerald-500", gradient: "from-emerald-500 to-emerald-300" },
      orange: { text: "text-orange-500", bg: "bg-orange-500", gradient: "from-orange-500 to-orange-300" },
      purple: { text: "text-purple-500", bg: "bg-purple-500", gradient: "from-purple-500 to-purple-300" },
    }
    return colorMap[color] || colorMap.blue
  }

  // GRN Details table data
  const grnTableData = [
    {
      id: 1,
      vendorName: "Studio Shodwe",
      grnDate: "15.01.2026",
      grnRate: 2550.00,
      taxPercent: 18,
      grnTotalAmt: 3009.00,
      gateEntry: "GE-2026-001",
      sgstAmt: 229.50,
      cgstAmt: 229.50,
      igstAmt: 0,
      taxAmt: 459.00,
      cessAmt: 0,
      weighmentType: "Standard",
      deliveryNote: "DN-2026-0045",
      vehicleNo: "KA-01-AB-1234",
      comments: "Delivered on time",
    },
    {
      id: 2,
      vendorName: "Studio Shodwe",
      grnDate: "16.01.2026",
      grnRate: 3200.00,
      taxPercent: 18,
      grnTotalAmt: 3776.00,
      gateEntry: "GE-2026-002",
      sgstAmt: 288.00,
      cgstAmt: 288.00,
      igstAmt: 0,
      taxAmt: 576.00,
      cessAmt: 0,
      weighmentType: "Standard",
      deliveryNote: "DN-2026-0046",
      vehicleNo: "KA-01-CD-5678",
      comments: "Quality verified",
    },
    {
      id: 3,
      vendorName: "Studio Shodwe",
      grnDate: "17.01.2026",
      grnRate: 1900.00,
      taxPercent: 12,
      grnTotalAmt: 2128.00,
      gateEntry: "GE-2026-003",
      sgstAmt: 114.00,
      cgstAmt: 114.00,
      igstAmt: 0,
      taxAmt: 228.00,
      cessAmt: 0,
      weighmentType: "Partial",
      deliveryNote: "DN-2026-0047",
      vehicleNo: "KA-02-EF-9012",
      comments: "Pending final inspection",
    },
  ]

  // PO Details table data
  const poTableData = [
    {
      id: 1,
      poNumber: "PO-2025-001234",
      poLineItem: "10",
      grnItem: "GRN-2026-001",
      materialDescription: "Design Services - UI/UX Consultation",
      challanQty: 100,
      receiptQty: 100,
      acceptedQty: 98,
      rejectedQty: 2,
    },
    {
      id: 2,
      poNumber: "PO-2025-001234",
      poLineItem: "20",
      grnItem: "GRN-2026-002",
      materialDescription: "Graphic Design - Brand Identity Package",
      challanQty: 50,
      receiptQty: 50,
      acceptedQty: 50,
      rejectedQty: 0,
    },
    {
      id: 3,
      poNumber: "PO-2025-001234",
      poLineItem: "30",
      grnItem: "GRN-2026-003",
      materialDescription: "Print Materials - Marketing Collateral",
      challanQty: 200,
      receiptQty: 195,
      acceptedQty: 190,
      rejectedQty: 5,
    },
    {
      id: 4,
      poNumber: "PO-2025-001234",
      poLineItem: "40",
      grnItem: "GRN-2026-004",
      materialDescription: "Digital Assets - Social Media Templates",
      challanQty: 75,
      receiptQty: 75,
      acceptedQty: 75,
      rejectedQty: 0,
    },
  ]

  // State for PO table expansion
  const [isPoTableExpanded, setIsPoTableExpanded] = useState(false)
  
  // State for workflow section collapse
  const [isWorkflowExpanded, setIsWorkflowExpanded] = useState(true)
  
  // State for field action log drawer
  const [fieldActionLogOpen, setFieldActionLogOpen] = useState<string | null>(null)
  
  // State for action history view toggle
  const [actionHistoryView, setActionHistoryView] = useState<"timeline" | "table">("timeline")
  
  // Field labels for action log drawer
  const fieldLabels: Record<string, string> = {
    "submitter-email": "Submitter Email",
    "submission-date": "Submission Date",
    "po-invoice": "PO Invoice",
    "downpayment": "Downpayment (DP) Applicable",
    "company-code": "Organization",
    "vendor-code": "Vendor Code",
    "invoice-number": "Invoice Number",
    "invoice-date": "Invoice Date",
    "currency": "Currency",
    "base-amount": "Base Amount",
  }

  // Field action log data
  const fieldActionLogs: Record<string, Array<{
    id: number
    action: string
    previousValue: string
    newValue: string
    changedBy: string
    changedAt: string
    reason: string
  }>> = {
    "submitter-email": [
      { id: 1, action: "Created", previousValue: "-", newValue: "kmahalingpur@techpanion.com", changedBy: "System (OCR)", changedAt: "Jan 21, 2026 10:20 AM", reason: "Initial extraction from document" },
      { id: 2, action: "Verified", previousValue: "kmahalingpur@techpanion.com", newValue: "kmahalingpur@techpanion.com", changedBy: "AI Validation", changedAt: "Jan 21, 2026 10:21 AM", reason: "Email format validated" },
    ],
    "submission-date": [
      { id: 1, action: "Created", previousValue: "-", newValue: "20.01.2026", changedBy: "System (OCR)", changedAt: "Jan 21, 2026 10:20 AM", reason: "Initial extraction from document" },
    ],
    "po-invoice": [
      { id: 1, action: "Created", previousValue: "-", newValue: "Yes", changedBy: "System (OCR)", changedAt: "Jan 21, 2026 10:20 AM", reason: "PO reference detected in document" },
      { id: 2, action: "Confirmed", previousValue: "Yes", newValue: "Yes", changedBy: "John Smith", changedAt: "Jan 21, 2026 10:45 AM", reason: "Manual verification completed" },
    ],
    "downpayment": [
      { id: 1, action: "Created", previousValue: "-", newValue: "No", changedBy: "System", changedAt: "Jan 21, 2026 10:20 AM", reason: "Default value applied" },
    ],
    "company-code": [
      { id: 1, action: "Created", previousValue: "-", newValue: "1000", changedBy: "System (OCR)", changedAt: "Jan 21, 2026 10:20 AM", reason: "Extracted from document header" },
      { id: 2, action: "Modified", previousValue: "1000", newValue: "2000", changedBy: "Sarah Johnson", changedAt: "Jan 21, 2026 11:30 AM", reason: "Corrected based on vendor master" },
      { id: 3, action: "Approved", previousValue: "2000", newValue: "2000", changedBy: "AP Manager", changedAt: "Jan 21, 2026 02:15 PM", reason: "Change approved" },
    ],
    "vendor-code": [
      { id: 1, action: "Created", previousValue: "-", newValue: "VND-001234", changedBy: "System (OCR)", changedAt: "Jan 21, 2026 10:20 AM", reason: "Extracted from invoice" },
      { id: 2, action: "Matched", previousValue: "VND-001234", newValue: "VND-001234", changedBy: "Vendor Matching Engine", changedAt: "Jan 21, 2026 10:22 AM", reason: "Matched with vendor master record" },
    ],
    "invoice-number": [
      { id: 1, action: "Created", previousValue: "-", newValue: "INV-2026-001234", changedBy: "System (OCR)", changedAt: "Jan 21, 2026 10:20 AM", reason: "Extracted from document" },
    ],
    "invoice-date": [
      { id: 1, action: "Created", previousValue: "-", newValue: "15.01.2026", changedBy: "System (OCR)", changedAt: "Jan 21, 2026 10:20 AM", reason: "Extracted from document" },
    ],
    "currency": [
      { id: 1, action: "Created", previousValue: "-", newValue: "USD", changedBy: "System (OCR)", changedAt: "Jan 21, 2026 10:20 AM", reason: "Detected from invoice amount format" },
    ],
    "base-amount": [
      { id: 1, action: "Created", previousValue: "-", newValue: "$7,650.00", changedBy: "System (OCR)", changedAt: "Jan 21, 2026 10:20 AM", reason: "Extracted from invoice total" },
      { id: 2, action: "Verified", previousValue: "$7,650.00", newValue: "$7,650.00", changedBy: "3-Way Match Engine", changedAt: "Jan 21, 2026 10:28 AM", reason: "Amount matches PO line items" },
    ],
  }

  // OCR field mappings - maps PDF regions to form fields
  const ocrFields = [
    { id: "invoice-no", label: "Invoice No", value: "12345", pdfRegion: "header", formField: "invoice-info" },
    { id: "invoice-date", label: "Invoice Date", value: "25 June 2022", pdfRegion: "header", formField: "invoice-info" },
    { id: "customer-name", label: "Customer Name", value: "Ketut Susilo", pdfRegion: "customer", formField: "submitter" },
    { id: "subtotal", label: "Sub Total", value: "$7,650", pdfRegion: "totals", formField: "invoice-info" },
    { id: "tax", label: "Tax", value: "$1,148", pdfRegion: "totals", formField: "invoice-info" },
    { id: "grand-total", label: "Grand Total", value: "$8,798", pdfRegion: "totals", formField: "invoice-info" },
  ]

  // Available documents for this invoice
  const documents = [
    { id: "inv", name: "Invoice", type: "PDF", pages: 1 },
    { id: "po", name: "Purchase Order", type: "PDF", pages: 2 },
    { id: "grn", name: "GRN Document", type: "PDF", pages: 1 },
    { id: "support", name: "Supporting Docs", type: "PDF", pages: 3 },
  ]
  const currentDoc = documents[currentDocIndex]

  const handleOcrFieldClick = (fieldId: string) => {
    if (ocrLinkingMode) {
      setSelectedOcrField(selectedOcrField === fieldId ? null : fieldId)
    }
  }
  const containerRef = useRef<HTMLDivElement>(null)

  // Navigation helpers
  const invoiceIds = ["603076", "51692", "51695", "51698"]
  const currentIndex = invoiceIds.indexOf(invoiceId)
  const hasPrev = currentIndex > 0
  const hasNext = currentIndex < invoiceIds.length - 1 && currentIndex !== -1

  // Reset navigation state when invoiceId changes (navigation completed)
  useEffect(() => {
    setIsNavigating(false)
    setNavigatingDirection(null)
  }, [invoiceId])

  const goToPrev = () => {
    if (hasPrev && !isNavigating) {
      setIsNavigating(true)
      setNavigatingDirection("prev")
      setTimeout(() => {
        router.push(`/sop/inbox/invoice/${invoiceIds[currentIndex - 1]}`)
      }, 200)
    }
  }

  const goToNext = () => {
    if (hasNext && !isNavigating) {
      setIsNavigating(true)
      setNavigatingDirection("next")
      setTimeout(() => {
        router.push(`/sop/inbox/invoice/${invoiceIds[currentIndex + 1]}`)
      }, 200)
    }
  }

  const invoice = invoiceData[invoiceId] || invoiceData["603076"]
  const docColors = invoice.document ? getColorClasses(invoice.document.color) : getColorClasses("blue")

  // Handle resizable divider
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return
      const container = containerRef.current
      const newPos = ((e.clientX - container.getBoundingClientRect().left) / container.clientWidth) * 100
      setDividerPos(Math.max(30, Math.min(70, newPos)))
    }

    const handleMouseUp = () => setIsDragging(false)

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging])

  const getStatusIcon = (status: typeof invoice.status) => {
    switch (status) {
      case "Approved":
        return <CheckCircle className="h-5 w-5 text-emerald-600" />
      case "Rejected":
        return <X className="h-5 w-5 text-red-600" />
      case "Posting Error":
        return <AlertCircle className="h-5 w-5 text-red-600" />
      case "Waiting for Clarification":
        return <AlertTriangle className="h-5 w-5 text-amber-600" />
      default:
        return <Clock className="h-5 w-5 text-blue-600" />
    }
  }

  const getStatusColor = (status: typeof invoice.status) => {
    switch (status) {
      case "Approved":
        return "bg-emerald-50 border-emerald-200"
      case "Rejected":
        return "bg-red-50 border-red-200"
      case "Posting Error":
        return "bg-red-50 border-red-200"
      case "Waiting for Clarification":
        return "bg-amber-50 border-amber-200"
      default:
        return "bg-blue-50 border-blue-200"
    }
  }

  const getStatusBadgeColor = (status: typeof invoice.status) => {
    switch (status) {
      case "Approved":
        return "bg-emerald-100 text-emerald-800"
      case "Rejected":
        return "bg-red-100 text-red-800"
      case "Posting Error":
        return "bg-red-100 text-red-800"
      case "Waiting for Clarification":
        return "bg-amber-100 text-amber-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  return (
    <div className="flex flex-col h-full min-h-0 bg-background relative">
      {/* Navigation Transition Overlay */}
      {isNavigating && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="h-12 w-12 rounded-full border-4 border-slate-200" />
              <div className="absolute inset-0 h-12 w-12 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin" />
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {navigatingDirection === "prev" ? (
                <>
                  <ChevronLeft className="h-4 w-4" />
                  <span>Loading previous invoice...</span>
                </>
              ) : (
                <>
                  <span>Loading next invoice...</span>
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Top Navigation */}
      <div className="border-b bg-background px-4 h-16 shrink-0 flex items-center">
        <div className="flex items-center justify-between w-full">
          {/* Left: Back + Task Info + Navigation */}
          <div className="flex items-center gap-3">
            <Link
              href="/sop/inbox"
              className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="font-medium">Task {invoice.taskId.replace("TASK-", "")}</span>
            </Link>
            {/* Stage Pill and SLA */}
            <div className="w-px h-6 bg-border" />
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200 font-medium">
              Stage: AP Team
            </Badge>
            <span className="text-sm text-muted-foreground">SLA: 3 hours 45 minutes</span>
            {/* Prev/Next Navigation */}
            {config.showNavigationArrows && (
              <>
                <div className="w-px h-6 bg-border" />
                <div className="flex items-center border rounded-md">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-r-none border-r"
                    onClick={goToPrev}
                    disabled={!hasPrev || isNavigating}
                    title="Previous invoice"
                  >
                    {isNavigating && navigatingDirection === "prev" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ChevronLeft className="h-4 w-4" />
                    )}
                  </Button>
                  <span className="px-2 text-xs text-muted-foreground min-w-[50px] text-center">
                    {currentIndex !== -1 ? `${currentIndex + 1} / ${invoiceIds.length}` : "-"}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-l-none border-l"
                    onClick={goToNext}
                    disabled={!hasNext || isNavigating}
                    title="Next invoice"
                  >
                    {isNavigating && navigatingDirection === "next" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </>
            )}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 ${isPanesSwapped ? "bg-blue-100 text-blue-600" : ""}`}
              onClick={() => setIsPanesSwapped(!isPanesSwapped)}
              disabled={!config.enablePaneSwap}
              title={isPanesSwapped ? "Reset pane positions" : "Swap panes"}
            >
              <ArrowLeftRight className="h-4 w-4" />
            </Button>
{/* Field Action Log Drawer */}
              <Sheet open={!!fieldActionLogOpen} onOpenChange={(open) => !open && setFieldActionLogOpen(null)}>
                <SheetContent side="right" className="w-[500px] p-0">
                  <SheetHeader className="px-4 py-3 border-b bg-slate-50">
                    <div className="flex items-center justify-between">
                      <SheetTitle className="flex items-center gap-2 text-base">
                        <Clock className="h-4 w-4 text-slate-600" />
                        Action Log - {fieldActionLogOpen ? fieldLabels[fieldActionLogOpen] : ""}
                      </SheetTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 bg-transparent gap-1.5"
                        onClick={() => {
                          if (fieldActionLogOpen && fieldActionLogs[fieldActionLogOpen]) {
                            const logs = fieldActionLogs[fieldActionLogOpen]
                            const csvContent = [
                              ["Action", "Previous Value", "New Value", "Changed By", "Date", "Reason"].join(","),
                              ...logs.map(log => [
                                log.action,
                                `"${log.previousValue}"`,
                                `"${log.newValue}"`,
                                `"${log.changedBy}"`,
                                `"${log.changedAt}"`,
                                `"${log.reason}"`
                              ].join(","))
                            ].join("\n")
                            const blob = new Blob([csvContent], { type: "text/csv" })
                            const url = URL.createObjectURL(blob)
                            const a = document.createElement("a")
                            a.href = url
                            a.download = `action-log-${fieldActionLogOpen}.csv`
                            a.click()
                            URL.revokeObjectURL(url)
                          }
                        }}
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </SheetHeader>
                  <div className="p-4 overflow-auto max-h-[calc(100vh-80px)]">
                    {fieldActionLogOpen && fieldActionLogs[fieldActionLogOpen] && (
                      <div className="border border-slate-200 rounded-lg overflow-x-auto">
                        <table className="w-full text-sm min-w-[600px]">
                          <thead className="bg-slate-100">
                            <tr>
                              <th className="text-left py-3 px-3 font-semibold text-slate-700 border-b border-slate-200">Action</th>
                              <th className="text-left py-3 px-3 font-semibold text-slate-700 border-b border-slate-200">Previous Value</th>
                              <th className="text-left py-3 px-3 font-semibold text-slate-700 border-b border-slate-200">New Value</th>
                              <th className="text-left py-3 px-3 font-semibold text-slate-700 border-b border-slate-200">Changed By</th>
                              <th className="text-left py-3 px-3 font-semibold text-slate-700 border-b border-slate-200">Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {fieldActionLogs[fieldActionLogOpen]?.map((log, idx) => (
                              <tr key={log.id} className={`border-b border-slate-100 ${idx % 2 === 1 ? "bg-slate-50/50" : ""}`}>
                                <td className="py-3 px-3 text-slate-700">
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                    log.action === "Created" ? "bg-blue-100 text-blue-700" :
                                    log.action === "Modified" ? "bg-amber-100 text-amber-700" :
                                    log.action === "Verified" || log.action === "Approved" || log.action === "Confirmed" ? "bg-emerald-100 text-emerald-700" :
                                    log.action === "Matched" ? "bg-purple-100 text-purple-700" :
                                    "bg-slate-100 text-slate-700"
                                  }`}>
                                    {log.action}
                                  </span>
                                </td>
                                <td className="py-3 px-3 text-slate-500 text-xs max-w-[100px] truncate" title={log.previousValue}>{log.previousValue}</td>
                                <td className="py-3 px-3 text-slate-700 text-xs max-w-[100px] truncate" title={log.newValue}>{log.newValue}</td>
                                <td className="py-3 px-3 text-slate-600 text-xs">{log.changedBy}</td>
                                <td className="py-3 px-3 text-slate-500 text-xs whitespace-nowrap">{log.changedAt}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                    {fieldActionLogOpen && fieldActionLogs[fieldActionLogOpen] && (
                      <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <p className="text-xs text-slate-500">
                          <span className="font-medium text-slate-600">Reason for last change:</span>{" "}
                          {fieldActionLogs[fieldActionLogOpen]?.[fieldActionLogs[fieldActionLogOpen].length - 1]?.reason}
                        </p>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>

              {/* Save to Drafts Button */}
              <Button
                variant="outline"
                size="sm"
                className="h-8 bg-transparent gap-1.5"
              >
                <Save className="h-4 w-4" />
                Save to Drafts
              </Button>

              {/* Configure View Button */}
              <Sheet open={isConfigOpen} onOpenChange={setIsConfigOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  title="Configure View"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[380px] sm:w-[420px] p-0">
                <SheetHeader className="px-4 py-3 border-b bg-slate-50">
                  <SheetTitle className="flex items-center gap-2 text-base">
                    <SlidersHorizontal className="h-4 w-4" />
                    Configure View
                  </SheetTitle>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-60px)]">
                  <div className="p-4 space-y-6">
                    {/* Presets */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold flex items-center gap-2">
                          <Bookmark className="h-4 w-4 text-slate-500" />
                          Presets
                        </h3>
                        <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={resetToDefault}>
                          <RotateCw className="h-3 w-3 mr-1" />
                          Reset
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(presets).map(([id, preset]) => (
                          <button
                            key={id}
                            type="button"
                            onClick={() => applyPreset(id)}
                            className={`p-2.5 rounded-lg border text-left transition-all ${
                              config.activePreset === id
                                ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                                : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                            }`}
                          >
                            <p className={`text-xs font-medium ${config.activePreset === id ? "text-blue-700" : "text-slate-700"}`}>
                              {preset.name}
                            </p>
                            <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{preset.description}</p>
                          </button>
                        ))}
                      </div>
                      {config.activePreset === "custom" && (
                        <div className="flex items-center justify-between p-2 bg-amber-50 border border-amber-200 rounded-lg">
                          <span className="text-xs text-amber-700">Custom configuration active</span>
                          <Button variant="outline" size="sm" className="h-6 text-[10px] bg-transparent border-amber-300 text-amber-700 hover:bg-amber-100">
                            Save as Preset
                          </Button>
                        </div>
                      )}
                    </div>

                    <Separator />

                    {/* Layout Controls */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold flex items-center gap-2">
                        <Layout className="h-4 w-4 text-slate-500" />
                        Layout Controls
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between py-1.5">
                          <div className="flex items-center gap-2">
                            <PanelLeft className="h-4 w-4 text-slate-400" />
                            <span className="text-sm">Left Pane (Document Viewer)</span>
                          </div>
                          <Switch
                            checked={config.showLeftPane}
                            onCheckedChange={(v) => updateConfig("showLeftPane", v)}
                          />
                        </div>
                        <div className="flex items-center justify-between py-1.5">
                          <div className="flex items-center gap-2">
                            <PanelRight className="h-4 w-4 text-slate-400" />
                            <span className="text-sm">Right Pane (Details Panel)</span>
                          </div>
                          <Switch
                            checked={config.showRightPane}
                            onCheckedChange={(v) => updateConfig("showRightPane", v)}
                          />
                        </div>
                        <div className="flex items-center justify-between py-1.5">
                          <div className="flex items-center gap-2">
                            <PanelBottom className="h-4 w-4 text-slate-400" />
                            <span className="text-sm">Bottom Metrics Panel</span>
                          </div>
                          <Switch
                            checked={config.showMetricsPanel}
                            onCheckedChange={(v) => updateConfig("showMetricsPanel", v)}
                          />
                        </div>
                        <div className="flex items-center justify-between py-1.5">
                          <span className="text-sm text-slate-600">Enable split resize</span>
                          <Switch
                            checked={config.enableSplitResize}
                            onCheckedChange={(v) => updateConfig("enableSplitResize", v)}
                          />
                        </div>
                        <div className="flex items-center justify-between py-1.5">
                          <span className="text-sm text-slate-600">Enable pane swap</span>
                          <Switch
                            checked={config.enablePaneSwap}
                            onCheckedChange={(v) => updateConfig("enablePaneSwap", v)}
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Left Pane - Document Viewer */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold flex items-center gap-2">
                        <PanelLeft className="h-4 w-4 text-slate-500" />
                        Left Pane – Document Viewer
                      </h3>
                      <div className="space-y-2 pl-1">
                        <div className="flex items-center justify-between py-1.5">
                          <span className="text-sm text-slate-600">Invoice PDF</span>
                          <Switch
                            checked={config.showInvoicePDF}
                            onCheckedChange={(v) => updateConfig("showInvoicePDF", v)}
                          />
                        </div>
                        <div className="flex items-center justify-between py-1.5">
                          <span className="text-sm text-slate-600">Line Items</span>
                          <Switch
                            checked={config.showLineItems}
                            onCheckedChange={(v) => updateConfig("showLineItems", v)}
                          />
                        </div>
                        <div className="flex items-center justify-between py-1.5">
                          <span className="text-sm text-slate-600">Tax & Payment Summary</span>
                          <Switch
                            checked={config.showTaxPaymentSummary}
                            onCheckedChange={(v) => updateConfig("showTaxPaymentSummary", v)}
                          />
                        </div>
                        <div className="flex items-center justify-between py-1.5">
                          <span className="text-sm text-slate-600">OCR / Extracted field highlights</span>
                          <Switch
                            checked={config.showOcrHighlights}
                            onCheckedChange={(v) => updateConfig("showOcrHighlights", v)}
                          />
                        </div>
                        <div className="flex items-center justify-between py-1.5">
                          <span className="text-sm text-slate-600">Auto-scroll to matched fields</span>
                          <Switch
                            checked={config.autoScrollToMatchedFields}
                            onCheckedChange={(v) => updateConfig("autoScrollToMatchedFields", v)}
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Right Pane - Tabs */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold flex items-center gap-2">
                        <PanelRight className="h-4 w-4 text-slate-500" />
                        Right Pane – Tab Visibility
                      </h3>
                      <div className="space-y-2 pl-1">
                        {[
                          { key: "invoiceDetails", label: "Invoice Details" },
                          { key: "vendorEvaluation", label: "Vendor Evaluation" },
                          { key: "checklist", label: "Checklist" },
                          { key: "compliance", label: "Compliance" },
                          { key: "poDetails", label: "PO Details" },
                          { key: "grnDetails", label: "GRN Details" },
                          { key: "actionHistory", label: "Action History" },
                        ].map((tab) => (
                          <div key={tab.key} className="flex items-center justify-between py-1.5">
                            <span className="text-sm text-slate-600">{tab.label}</span>
                            <Switch
                              checked={config.tabs[tab.key as keyof typeof config.tabs]}
                              onCheckedChange={(v) => updateNestedConfig("tabs", tab.key, v)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Right Pane - Sections */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold flex items-center gap-2">
                        <Eye className="h-4 w-4 text-slate-500" />
                        Right Pane – Section Blocks
                      </h3>
                      <div className="space-y-2 pl-1">
                        {[
                          { key: "submitterDetails", label: "Submitter Details" },
                          { key: "basicInfo", label: "Basic Info" },
                          { key: "vendorDetails", label: "Vendor Details" },
                          { key: "taxDetails", label: "Tax Details" },
                          { key: "paymentDetails", label: "Payment Details" },
                        ].map((section) => (
                          <div key={section.key} className="flex items-center justify-between py-1.5">
                            <span className="text-sm text-slate-600">{section.label}</span>
                            <Switch
                              checked={config.sections[section.key as keyof typeof config.sections]}
                              onCheckedChange={(v) => updateNestedConfig("sections", section.key, v)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Metrics Panel */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold flex items-center gap-2">
                        <PanelBottom className="h-4 w-4 text-slate-500" />
                        Metrics Panel
                      </h3>
                      <div className="space-y-2 pl-1">
                        {[
                          { key: "invoiceAmount", label: "Invoice Amount" },
                          { key: "taxAmount", label: "Tax Amount" },
                          { key: "netPayable", label: "Net Payable" },
                          { key: "tds", label: "TDS Amount" },
                          { key: "variance", label: "Variance" },
                        ].map((metric) => (
                          <div key={metric.key} className="flex items-center justify-between py-1.5">
                            <span className="text-sm text-slate-600">{metric.label}</span>
                            <Switch
                              checked={config.metrics[metric.key as keyof typeof config.metrics]}
                              onCheckedChange={(v) => updateNestedConfig("metrics", metric.key, v)}
                            />
                          </div>
                        ))}
                        <Separator className="my-2" />
                        <div className="flex items-center justify-between py-1.5">
                          <span className="text-sm text-slate-600">Compact mode</span>
                          <Switch
                            checked={config.metricsCompactMode}
                            onCheckedChange={(v) => updateConfig("metricsCompactMode", v)}
                          />
                        </div>
                        <div className="flex items-center justify-between py-1.5">
                          <span className="text-sm text-slate-600">Sticky behavior</span>
                          <Switch
                            checked={config.metricsStickyBehavior}
                            onCheckedChange={(v) => updateConfig("metricsStickyBehavior", v)}
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Navigation */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold flex items-center gap-2">
                        <Keyboard className="h-4 w-4 text-slate-500" />
                        Navigation
                      </h3>
                      <div className="space-y-2 pl-1">
                        <div className="flex items-center justify-between py-1.5">
                          <span className="text-sm text-slate-600">Show navigation arrows</span>
                          <Switch
                            checked={config.showNavigationArrows}
                            onCheckedChange={(v) => updateConfig("showNavigationArrows", v)}
                          />
                        </div>
                        <div className="flex items-center justify-between py-1.5">
                          <span className="text-sm text-slate-600">Enable keyboard navigation</span>
                          <Switch
                            checked={config.enableKeyboardNavigation}
                            onCheckedChange={(v) => updateConfig("enableKeyboardNavigation", v)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="h-4" />
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Top Bar - Financial Metrics Row (Conditional - Pinned to Top) */}
      {config.showMetricsPanel && metricsPanelPosition === "top" && (
        <div className="border-b bg-gradient-to-r from-slate-50 to-slate-100 shrink-0 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
          <div className="flex items-stretch">
            {/* Pin Toggle Button */}
            <button
              type="button"
              onClick={() => setMetricsPanelPosition("bottom")}
              className="flex items-center justify-center px-2 border-r border-slate-200 hover:bg-slate-100 transition-colors group"
              title="Pin to bottom"
            >
              <ArrowDownToLine className="h-4 w-4 text-slate-400 group-hover:text-slate-600" />
            </button>

            {/* Metrics Section - Spread across available space */}
            <div className="flex-1 min-w-0">
              <div className="flex items-stretch h-full">
                {/* Currency Badge */}
                <div className="flex items-center justify-center px-4 py-2.5 bg-blue-50/50 border-r border-slate-200">
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] uppercase tracking-wider text-blue-600 font-medium">Currency</span>
                    <span className="text-sm font-bold text-blue-700">{invoice.currency}</span>
                  </div>
                </div>

                {/* Metric Items - Evenly distributed */}
                <div className="flex-1 flex items-center justify-center px-3 py-2.5 border-r border-slate-200">
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] uppercase tracking-wider text-slate-500">Inv Basic Amt</span>
                    <span className="text-sm font-semibold text-slate-800 font-mono">{invoice.baseAmount}</span>
                  </div>
                </div>

                <div className="flex-1 flex items-center justify-center px-3 py-2.5 border-r border-slate-200">
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] uppercase tracking-wider text-slate-500">Tax Amt</span>
                    <span className="text-sm font-semibold text-orange-600 font-mono">{invoice.taxAmount}</span>
                  </div>
                </div>

                <div className="flex-1 flex items-center justify-center px-3 py-2.5 border-r border-slate-200">
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] uppercase tracking-wider text-slate-500">Total Amt</span>
                    <span className="text-sm font-semibold text-slate-800 font-mono">{invoice.totalAmount}</span>
                  </div>
                </div>

                <div className="flex-1 flex items-center justify-center px-3 py-2.5 border-r border-slate-200">
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] uppercase tracking-wider text-slate-500">TDS Amt</span>
                    <span className="text-sm font-semibold text-slate-600 font-mono">{invoice.tdsAmount}</span>
                  </div>
                </div>

                <div className="flex-1 flex items-center justify-center px-3 py-2.5 bg-emerald-50/50 border-r border-slate-200">
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] uppercase tracking-wider text-emerald-600 font-medium">Net Payable</span>
                    <span className="text-sm font-bold text-emerald-700 font-mono">{invoice.netPayableAmount}</span>
                  </div>
                </div>

                <div className="flex-1 flex items-center justify-center px-3 py-2.5 border-r border-slate-200">
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] uppercase tracking-wider text-slate-500">Basic Amt Diff</span>
                    <span className={`text-sm font-semibold font-mono ${invoice.baseAmtDiff === "NA" ? "text-red-600" : invoice.baseAmtDiff?.startsWith("-") ? "text-red-600" : "text-emerald-600"}`}>
                      {invoice.baseAmtDiff}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Section - Fixed width, won't be affected by metrics */}
            <div className="flex items-center gap-2 px-4 py-2.5 shrink-0 bg-white/50">
              <Select defaultValue="">
                <SelectTrigger className="w-[130px] h-9 text-xs bg-white border-slate-200 shadow-sm">
                  <SelectValue placeholder="More Actions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="send-back">Send Back</SelectItem>
                  <SelectItem value="hold">Put on Hold</SelectItem>
                  <SelectItem value="escalate">Escalate</SelectItem>
                  <SelectItem value="add-note">Add Note</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-4 bg-white border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 hover:text-red-700 shadow-sm"
              >
                <X className="h-4 w-4 mr-1.5" />
                Reject
              </Button>
              <Button
                size="sm"
                className="h-9 px-5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                disabled={invoice.status === "Posting Error" || invoice.status === "Rejected"}
              >
                <CheckCircle className="h-4 w-4 mr-1.5" />
                Approve
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content - Two Pane Split */}
      <div className="flex flex-1 min-h-0 overflow-hidden" ref={containerRef}>
        {/* Left Pane - Document Viewer (swappable) */}
        {config.showLeftPane && (
        <div 
          style={{ 
            width: !config.showRightPane ? "100%" : (isPanesSwapped ? `${100 - dividerPos}%` : `${dividerPos}%`),
            order: isPanesSwapped ? 2 : 0 
          }} 
          className={`flex flex-col bg-slate-700 ${isPanesSwapped ? "border-l" : "border-r"}`}
        >
          {/* Viewer Toolbar */}
          <div className="flex items-center justify-between px-3 py-2 bg-slate-800 text-white shrink-0">
            <div className="flex items-center gap-3">
              {/* Document Selector */}
              <Select 
                value={currentDocIndex.toString()} 
                onValueChange={(val) => setCurrentDocIndex(Number(val))}
              >
                <SelectTrigger className="w-[200px] h-8 bg-slate-700 border-slate-600 text-white text-sm [&>svg]:text-white">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <FileText className="h-4 w-4 shrink-0 text-white" />
                    <span className="truncate">{currentDoc.name}</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {documents.map((doc, idx) => (
                    <SelectItem key={doc.id} value={idx.toString()}>
                      <span>{doc.name}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {/* Page indicator */}
              <div className="flex items-center gap-1 border border-slate-600 rounded px-2 py-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 text-white hover:bg-slate-600 p-0"
                  disabled={true}
                >
                  <ChevronLeft className="h-3 w-3" />
                </Button>
                <span className="text-xs min-w-[40px] text-center">1 / {currentDoc.pages}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 text-white hover:bg-slate-600 p-0"
                  disabled={currentDoc.pages <= 1}
                >
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* OCR Field Linking Toggle */}
              <Button
                variant={ocrLinkingMode ? "default" : "ghost"}
                size="sm"
                className={`h-8 gap-1.5 text-xs ${ocrLinkingMode ? "bg-blue-500 hover:bg-blue-600 text-white" : "text-white hover:bg-slate-600"}`}
                onClick={() => {
                  setOcrLinkingMode(!ocrLinkingMode)
                  if (ocrLinkingMode) setSelectedOcrField(null)
                }}
              >
                <Crosshair className="h-3.5 w-3.5" />
                <span>{ocrLinkingMode ? "Linking On" : "Field Link"}</span>
              </Button>
              <div className="w-px h-5 bg-slate-600 mx-1" />
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-slate-600"
                onClick={() => setZoom((prev) => Math.max(prev - 10, 50))}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-sm min-w-[50px] text-center">{zoom}%</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-slate-600"
                onClick={() => setZoom((prev) => Math.min(prev + 10, 200))}
              >
                <Plus className="h-4 w-4" />
              </Button>
              <div className="w-px h-5 bg-slate-600 mx-1" />
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-slate-600"
                onClick={() => setZoom(100)}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-slate-600"
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-slate-600"
              >
                <Printer className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Document Preview */}
          <div className="flex-1 min-h-0 overflow-auto p-4 flex items-start justify-center bg-slate-600 relative">
            {/* OCR Mode Indicator */}
            {ocrLinkingMode && (
              <div className="absolute top-2 left-2 right-2 z-10 bg-blue-500/90 text-white text-xs px-3 py-1.5 rounded-md flex items-center gap-2">
                <Crosshair className="h-3.5 w-3.5" />
                <span>Field Linking Mode: Click on highlighted fields to link with form</span>
                {selectedOcrField && (
                  <span className="ml-auto bg-white/20 px-2 py-0.5 rounded">
                    Selected: {ocrFields.find(f => f.id === selectedOcrField)?.label}
                  </span>
                )}
              </div>
            )}
            <div
              className={`bg-white shadow-xl overflow-hidden relative ${ocrLinkingMode ? "mt-8" : ""}`}
              style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}
            >
              {/* Invoice Document Preview - Dynamic based on invoice data */}
              <div className="w-[595px] p-10 text-slate-800 relative">
                {/* Invoice Header */}
                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center gap-3">
                    <div className={docColors.text}>
                      <svg width="40" height="40" viewBox="0 0 40 40" fill="currentColor">
                        <path d="M20 4C11.163 4 4 11.163 4 20s7.163 16 16 16 16-7.163 16-16S28.837 4 20 4zm0 28c-6.627 0-12-5.373-12-12S13.373 8 20 8s12 5.373 12 12-5.373 12-12 12z"/>
                        <path d="M20 12c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zm0 12c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4z"/>
                      </svg>
                    </div>
                    <div>
                      <h2 className={`text-lg font-bold ${docColors.text} tracking-wide`}>{invoice.document?.companyName || invoice.vendor.toUpperCase()}</h2>
                      <p className="text-xs text-slate-400 tracking-widest">{invoice.document?.companyTagline || "VENDOR"}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <h1 className={`text-3xl font-bold italic ${docColors.text} mb-1`}>INVOICE</h1>
                    <p className="text-xs text-slate-400">{invoice.vendor.toUpperCase().replace(" ", "")}.COM</p>
                  </div>
                </div>

                {/* Divider */}
                <div className={`h-0.5 bg-gradient-to-r ${docColors.gradient} mb-6`} />

                {/* Invoice To & Invoice Details */}
                <div className="flex justify-between mb-6 text-sm">
                  <div>
                    <p className="text-slate-500 mb-1">Invoice to :</p>
                    {/* OCR Clickable: Customer Name */}
                    <button
                      type="button"
                      onClick={() => handleOcrFieldClick("customer-name")}
                      className={`font-bold text-lg text-left transition-all ${
                        ocrLinkingMode 
                          ? `cursor-crosshair rounded px-1 -mx-1 ${selectedOcrField === "customer-name" ? "bg-blue-500 text-white ring-2 ring-blue-500" : "bg-yellow-100 hover:bg-yellow-200"}`
                          : ""
                      }`}
                    >
                      {invoice.document?.customerName || "Customer"}
                      {ocrLinkingMode && selectedOcrField === "customer-name" && (
                        <Link2 className="inline-block h-3 w-3 ml-1" />
                      )}
                    </button>
                    <p className="text-slate-500 text-xs mt-2">{invoice.document?.customerPhone || "N/A"}</p>
                    <p className="text-slate-500 text-xs">{invoice.document?.customerEmail || "N/A"}</p>
                    <p className="text-slate-500 text-xs">{invoice.document?.customerAddress || "N/A"}</p>
                  </div>
                  <div className="text-right">
                    {/* OCR Clickable: Invoice No */}
                    <button
                      type="button"
                      onClick={() => handleOcrFieldClick("invoice-no")}
                      className={`text-slate-600 text-left transition-all ${
                        ocrLinkingMode 
                          ? `cursor-crosshair rounded px-1 -mx-1 ${selectedOcrField === "invoice-no" ? "bg-blue-500 text-white ring-2 ring-blue-500" : "bg-yellow-100 hover:bg-yellow-200"}`
                          : ""
                      }`}
                    >
                      Invoice no : <span className="font-semibold">{invoice.document?.invoiceDisplayNo || invoice.invoiceNumber}</span>
                      {ocrLinkingMode && selectedOcrField === "invoice-no" && (
                        <Link2 className="inline-block h-3 w-3 ml-1" />
                      )}
                    </button>
                    {/* OCR Clickable: Invoice Date */}
                    <button
                      type="button"
                      onClick={() => handleOcrFieldClick("invoice-date")}
                      className={`text-slate-600 mt-1 block text-left transition-all ${
                        ocrLinkingMode 
                          ? `cursor-crosshair rounded px-1 -mx-1 ${selectedOcrField === "invoice-date" ? "bg-blue-500 text-white ring-2 ring-blue-500" : "bg-yellow-100 hover:bg-yellow-200"}`
                          : ""
                      }`}
                    >
                      {invoice.document?.invoiceDisplayDate || invoice.invoiceDate}
                      {ocrLinkingMode && selectedOcrField === "invoice-date" && (
                        <Link2 className="inline-block h-3 w-3 ml-1" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Line Items Table */}
                <table className="w-full mb-4 text-sm">
                  <thead>
                    <tr className={`${docColors.bg} text-white`}>
                      <th className="py-2 px-3 text-left font-medium w-12">NO</th>
                      <th className="py-2 px-3 text-left font-medium">DESCRIPTION</th>
                      <th className="py-2 px-3 text-center font-medium w-16">QTY</th>
                      <th className="py-2 px-3 text-center font-medium w-24">PRICE</th>
                      <th className="py-2 px-3 text-right font-medium w-24">TOTAL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.document?.lineItems.map((item, idx) => (
                      <tr key={idx} className="border-b border-slate-200">
                        <td className="py-2 px-3">{idx + 1}</td>
                        <td className="py-2 px-3">{item.description}</td>
                        <td className="py-2 px-3 text-center">{item.qty}</td>
                        <td className={`py-2 px-3 text-center ${docColors.text}`}>₹{item.price.toLocaleString("en-IN")}</td>
                        <td className="py-2 px-3 text-right">₹{item.total.toLocaleString("en-IN")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Totals */}
                <div className="flex justify-end mb-4">
                  <div className="w-56 text-sm">
                    {/* OCR Clickable: Sub Total */}
                    <button
                      type="button"
                      onClick={() => handleOcrFieldClick("subtotal")}
                      className={`flex justify-between py-1 w-full text-left transition-all ${
                        ocrLinkingMode 
                          ? `cursor-crosshair rounded px-1 ${selectedOcrField === "subtotal" ? "bg-blue-500 text-white ring-2 ring-blue-500" : "bg-yellow-100 hover:bg-yellow-200"}`
                          : ""
                      }`}
                    >
                      <span className={selectedOcrField === "subtotal" && ocrLinkingMode ? "text-white/80" : "text-slate-500"}>Sub Total :</span>
                      <span className="flex items-center gap-1">
                        ₹{invoice.document?.subTotal || invoice.baseAmount}
                        {ocrLinkingMode && selectedOcrField === "subtotal" && <Link2 className="h-3 w-3" />}
                      </span>
                    </button>
                    {/* OCR Clickable: Tax */}
                    <button
                      type="button"
                      onClick={() => handleOcrFieldClick("tax")}
                      className={`flex justify-between py-1 w-full text-left transition-all ${
                        ocrLinkingMode 
                          ? `cursor-crosshair rounded px-1 ${selectedOcrField === "tax" ? "bg-blue-500 text-white ring-2 ring-blue-500" : "bg-yellow-100 hover:bg-yellow-200"}`
                          : ""
                      }`}
                    >
                      <span className={selectedOcrField === "tax" && ocrLinkingMode ? "text-white/80" : "text-slate-500"}>Tax ({invoice.document?.taxRate || "0.16%"}) :</span>
                      <span className="flex items-center gap-1">
                        ₹{invoice.document?.tax || invoice.taxAmount}
                        {ocrLinkingMode && selectedOcrField === "tax" && <Link2 className="h-3 w-3" />}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Payment Method & Grand Total */}
                <div className="flex justify-between items-stretch mb-6">
                  <div className={`${docColors.bg} text-white px-4 py-2 font-semibold text-sm`}>
                    PAYMENT METHOD :
                  </div>
                  {/* OCR Clickable: Grand Total */}
                  <button
                    type="button"
                    onClick={() => handleOcrFieldClick("grand-total")}
                    className={`px-6 py-2 flex items-center gap-4 transition-all ${
                      ocrLinkingMode 
                        ? `cursor-crosshair ${selectedOcrField === "grand-total" ? "bg-green-500 ring-2 ring-green-400" : `${docColors.bg} ring-2 ring-yellow-400`}`
                        : docColors.bg
                    } text-white`}
                  >
                    <span className="font-semibold text-sm">GRAND TOTAL :</span>
                    <span className="font-bold text-lg flex items-center gap-1">
                      ₹{invoice.document?.grandTotal || invoice.totalAmount}
                      {ocrLinkingMode && selectedOcrField === "grand-total" && <Link2 className="h-4 w-4" />}
                    </span>
                  </button>
                </div>

                {/* Bank Details */}
                <div className="text-sm mb-6">
                  <p>Bank Name : {invoice.vendor} Bank</p>
                  <p>Account Number : XXXX-XXXX-{invoice.vendorCode.slice(-4)}</p>
                </div>

                {/* Divider */}
                <div className="h-px bg-slate-300 mb-4" />

                {/* Thank You */}
                <p className="font-semibold mb-4">Thank you for your business!</p>

                {/* Terms & Signature */}
                <div className="flex justify-between items-end">
                  <div className="text-xs text-slate-500 max-w-[200px]">
                    <p className="font-semibold text-slate-700 mb-1">Term and Conditions :</p>
                    <p>Please send payment within 30 days of receiving this invoice. There will be 10% interest charge per month on late invoice.</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-script text-xl ${docColors.text} italic mb-1`}>{invoice.document?.customerName || "Authorized Signatory"}</p>
                    <p className="font-semibold text-sm">{invoice.document?.customerName || "Authorized Signatory"}</p>
                    <p className="text-xs text-slate-500">Administrator</p>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center mt-6 pt-4 border-t text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>123-456-7890</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>hello@reallygreatsite.com</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>123 Anywhere St., Any City</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Resizable Divider */}
        {config.showLeftPane && config.showRightPane && config.enableSplitResize && (
          <div
            className="w-1 bg-border hover:bg-primary cursor-col-resize transition-colors"
            style={{ order: 1 }}
            onMouseDown={() => setIsDragging(true)}
            role="separator"
            aria-orientation="vertical"
          />
        )}

        {/* Right Pane - Status, Metrics, Details (swappable) */}
        {config.showRightPane && (
        <div 
          style={{ 
            width: !config.showLeftPane ? "100%" : (isPanesSwapped ? `${dividerPos}%` : `${100 - dividerPos}%`),
            order: isPanesSwapped ? 0 : 2 
          }} 
          className="flex flex-col min-h-0 overflow-hidden bg-background"
        >
          {/* Scrollable Content */}
          <div className="flex-1 min-h-0 overflow-auto">

            {/* Tabs - Invoice Details, Vendor Evaluation, Checklist, Compliance, PO Details, Action History */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col">
              <TabsList className="w-full justify-start !rounded-none border-b bg-transparent h-auto p-0 px-4 overflow-x-auto">
                <TabsTrigger
                  value="invoice-details"
                  className="!rounded-none !border-transparent border-b-2 data-[state=active]:!border-b-primary data-[state=active]:!border-t-transparent data-[state=active]:!border-l-transparent data-[state=active]:!border-r-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none focus-visible:border-transparent px-2 py-3 flex-none text-xs"
                >
                  Invoice Details
                </TabsTrigger>
                <TabsTrigger
                  value="vendor-evaluation"
                  className="!rounded-none !border-transparent border-b-2 data-[state=active]:!border-b-primary data-[state=active]:!border-t-transparent data-[state=active]:!border-l-transparent data-[state=active]:!border-r-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none focus-visible:border-transparent px-2 py-3 flex-none text-xs"
                >
                  Vendor Evaluation
                </TabsTrigger>
                <TabsTrigger
                  value="checklist"
                  className="!rounded-none !border-transparent border-b-2 data-[state=active]:!border-b-primary data-[state=active]:!border-t-transparent data-[state=active]:!border-l-transparent data-[state=active]:!border-r-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none focus-visible:border-transparent px-2 py-3 flex-none text-xs"
                >
                  Checklist
                </TabsTrigger>
                <TabsTrigger
                  value="compliance"
                  className="!rounded-none !border-transparent border-b-2 data-[state=active]:!border-b-primary data-[state=active]:!border-t-transparent data-[state=active]:!border-l-transparent data-[state=active]:!border-r-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none focus-visible:border-transparent px-2 py-3 flex-none text-xs"
                >
                  Compliance
                </TabsTrigger>
                <TabsTrigger
                  value="po-details"
                  className="!rounded-none !border-transparent border-b-2 data-[state=active]:!border-b-primary data-[state=active]:!border-t-transparent data-[state=active]:!border-l-transparent data-[state=active]:!border-r-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none focus-visible:border-transparent px-2 py-3 flex-none text-xs"
                >
                  PO Details
                </TabsTrigger>
                <TabsTrigger
                  value="grn-details"
                  className="!rounded-none !border-transparent border-b-2 data-[state=active]:!border-b-primary data-[state=active]:!border-t-transparent data-[state=active]:!border-l-transparent data-[state=active]:!border-r-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none focus-visible:border-transparent px-2 py-3 flex-none text-xs"
                >
                  GRN Details
                </TabsTrigger>
                <TabsTrigger
                  value="action-history"
                  className="!rounded-none !border-transparent border-b-2 data-[state=active]:!border-b-primary data-[state=active]:!border-t-transparent data-[state=active]:!border-l-transparent data-[state=active]:!border-r-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none focus-visible:border-transparent px-2 py-3 flex-none text-xs"
                >
                  Action History
                </TabsTrigger>
              </TabsList>

              {/* Invoice Details Tab */}
              <TabsContent value="invoice-details" className="flex-1 overflow-auto mt-0">
                <div className="p-4 space-y-4">
                  {/* Accordion - New Design with Purple Left Border */}
                  <Accordion type="multiple" className="space-y-4" defaultValue={["submitter", "basic-info", "vendor"]}>
                    
                    {/* Submitter Details */}
                    <AccordionItem 
                      value="submitter" 
                      className={`border bg-white shadow-sm rounded-lg overflow-hidden transition-all ${
                        selectedOcrField === "customer-name" 
                          ? "border-blue-500 ring-2 ring-blue-200" 
                          : "border-slate-200"
                      }`}
                    >
                      <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-transparent [&[data-state=open]>svg]:rotate-180">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm tracking-wide text-slate-800">SUBMITTER DETAILS</span>
                          {selectedOcrField === "customer-name" && (
                            <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded flex items-center gap-1">
                              <Link2 className="h-3 w-3" /> Linked
                            </span>
                          )}
                        </div>
                      </AccordionTrigger>
                      <div className="border-t border-slate-100" />
                      <AccordionContent className="px-0 pt-0 pb-0">
                        <div className="bg-slate-50 rounded-lg m-4 p-4 space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <span>decodedData</span>
                              <span>:</span>
                              <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
                                <path strokeLinecap="round" d="M12 16v-4M12 8h.01" strokeWidth="1.5" />
                              </svg>
                            </div>
                            <Input className="w-[280px] h-9 bg-white" defaultValue="" />
                          </div>
                          <div className="flex items-center justify-between group">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-slate-600">Submitter Email</span>
                              <button
                                type="button"
                                onClick={() => setFieldActionLogOpen("submitter-email")}
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-slate-200 rounded"
                                title="View action log"
                              >
                                <Clock className="h-3.5 w-3.5 text-slate-500" />
                              </button>
                            </div>
                            <span className="text-sm font-medium">kmahalingpur@techpanion.com</span>
                          </div>
                          <div className="flex items-center justify-between group">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-slate-600">Submission Date :</span>
                              <button
                                type="button"
                                onClick={() => setFieldActionLogOpen("submission-date")}
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-slate-200 rounded"
                                title="View action log"
                              >
                                <Clock className="h-3.5 w-3.5 text-slate-500" />
                              </button>
                            </div>
                            <span className="text-sm font-medium">20.01.2026</span>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Basic Information */}
                    <AccordionItem value="basic-info" className="border border-slate-200 bg-white shadow-sm rounded-lg overflow-hidden">
                      <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-transparent [&[data-state=open]>svg]:rotate-180">
                        <span className="font-bold text-sm tracking-wide text-slate-800">BASIC INFORMATION</span>
                      </AccordionTrigger>
                      <div className="border-t border-slate-100" />
                      <AccordionContent className="px-0 pt-0 pb-0">
                        <div className="bg-slate-50 rounded-lg m-4 p-4 space-y-4">
                          <div className="flex items-center justify-between group">
                            <div className="flex items-center gap-1 text-sm text-slate-600">
                              <span>PO Invoice ?</span>
                              <span className="text-red-500">*</span>
                              <span>:</span>
                              <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
                                <path strokeLinecap="round" d="M12 16v-4M12 8h.01" strokeWidth="1.5" />
                              </svg>
                              <button
                                type="button"
                                onClick={() => setFieldActionLogOpen("po-invoice")}
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-slate-200 rounded"
                                title="View action log"
                              >
                                <Clock className="h-3.5 w-3.5 text-slate-500" />
                              </button>
                            </div>
                            <div className="flex items-center gap-4">
                              <label className="flex items-center gap-2 text-sm">
                                <input type="radio" name="poInvoice" className="h-4 w-4 border-slate-300" />
                                <span>Yes</span>
                              </label>
                              <label className="flex items-center gap-2 text-sm">
                                <input type="radio" name="poInvoice" className="h-4 w-4 border-slate-300" />
                                <span>No</span>
                              </label>
                            </div>
                          </div>
                          <div className="flex items-center justify-between group">
                            <div className="flex items-center gap-1 text-sm text-slate-600">
                              <span>Downpayment (DP)<br />Applicable?</span>
                              <span className="text-red-500">*</span>
                              <span>:</span>
                              <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
                                <path strokeLinecap="round" d="M12 16v-4M12 8h.01" strokeWidth="1.5" />
                              </svg>
                              <button
                                type="button"
                                onClick={() => setFieldActionLogOpen("downpayment")}
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-slate-200 rounded"
                                title="View action log"
                              >
                                <Clock className="h-3.5 w-3.5 text-slate-500" />
                              </button>
                            </div>
                            <div className="flex items-center gap-4">
                              <label className="flex items-center gap-2 text-sm">
                                <input type="radio" name="dpApplicable" className="h-4 w-4 border-slate-300" />
                                <span>Yes</span>
                              </label>
                              <label className="flex items-center gap-2 text-sm">
                                <input type="radio" name="dpApplicable" className="h-4 w-4 border-slate-300" />
                                <span>No</span>
                              </label>
                            </div>
                          </div>
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-1 text-sm text-slate-600 pt-2">
                              <span>Invoice Description</span>
                              <span className="text-red-500">*</span>
                              <span>:</span>
                              <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
                                <path strokeLinecap="round" d="M12 16v-4M12 8h.01" strokeWidth="1.5" />
                              </svg>
                            </div>
                            <Input className="w-[280px] h-9 bg-white" defaultValue="" />
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Vendor Details */}
                    <AccordionItem value="vendor" className="border border-slate-200 bg-white shadow-sm rounded-lg overflow-hidden">
                      <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-transparent [&[data-state=open]>svg]:rotate-180">
                        <span className="font-bold text-sm tracking-wide text-slate-800">VENDOR DETAILS</span>
                      </AccordionTrigger>
                      <div className="border-t border-slate-100" />
                      <AccordionContent className="px-0 pt-0 pb-0">
                        <div className="bg-slate-50 rounded-lg m-4 p-4 space-y-4">
                          <div className="flex items-center justify-between group">
                            <div className="flex items-center gap-1 text-sm text-slate-600">
                              <span>Vendor Code</span>
                              <span className="text-red-500">*</span>
                              <span>:</span>
                              <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
                                <path strokeLinecap="round" d="M12 16v-4M12 8h.01" strokeWidth="1.5" />
                              </svg>
                              <button
                                type="button"
                                onClick={() => setFieldActionLogOpen("vendor-code")}
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-slate-200 rounded"
                                title="View action log"
                              >
                                <Clock className="h-3.5 w-3.5 text-slate-500" />
                              </button>
                            </div>
                            <span className="text-sm font-medium">{invoice.vendorCode}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 text-sm text-slate-600">
                              <span>Vendor Name</span>
                              <span className="text-red-500">*</span>
                              <span>:</span>
                              <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
                                <path strokeLinecap="round" d="M12 16v-4M12 8h.01" strokeWidth="1.5" />
                              </svg>
                            </div>
                            <span className="text-sm font-medium">{invoice.vendor}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 text-sm text-slate-600">
                              <span>Vendor GST</span>
                              <span>:</span>
                              <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
                                <path strokeLinecap="round" d="M12 16v-4M12 8h.01" strokeWidth="1.5" />
                              </svg>
                            </div>
                            <span className="text-sm font-medium">{invoice.billToGST}</span>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Company Details */}
                    <AccordionItem value="company" className="border border-slate-200 bg-white shadow-sm rounded-lg overflow-hidden">
                      <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-transparent [&[data-state=open]>svg]:rotate-180">
                        <span className="font-bold text-sm tracking-wide text-slate-800">COMPANY DETAILS</span>
                      </AccordionTrigger>
                      <div className="border-t border-slate-100" />
                      <AccordionContent className="px-0 pt-0 pb-0">
                        <div className="bg-slate-50 rounded-lg m-4 p-4 space-y-4">
                          <div className="flex items-center justify-between group">
                            <div className="flex items-center gap-1 text-sm text-slate-600">
                              <span>Organization</span>
                              <span className="text-red-500">*</span>
                              <span>:</span>
                              <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
                                <path strokeLinecap="round" d="M12 16v-4M12 8h.01" strokeWidth="1.5" />
                              </svg>
                              <button
                                type="button"
                                onClick={() => setFieldActionLogOpen("company-code")}
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-slate-200 rounded"
                                title="View action log"
                              >
                                <Clock className="h-3.5 w-3.5 text-slate-500" />
                              </button>
                            </div>
                            <span className="text-sm font-medium">{invoice.organization}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 text-sm text-slate-600">
                              <span>Department</span>
                              <span className="text-red-500">*</span>
                              <span>:</span>
                              <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
                                <path strokeLinecap="round" d="M12 16v-4M12 8h.01" strokeWidth="1.5" />
                              </svg>
                            </div>
                            <span className="text-sm font-medium">{invoice.department}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 text-sm text-slate-600">
                              <span>Cost Center</span>
                              <span className="text-red-500">*</span>
                              <span>:</span>
                              <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
                                <path strokeLinecap="round" d="M12 16v-4M12 8h.01" strokeWidth="1.5" />
                              </svg>
                            </div>
                            <span className="text-sm font-medium">{invoice.costCenter}</span>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Invoice Details */}
                    <AccordionItem 
                      value="invoice-info" 
                      className={`border bg-white shadow-sm rounded-lg overflow-hidden transition-all ${
                        ["invoice-no", "invoice-date", "subtotal", "tax", "grand-total"].includes(selectedOcrField || "")
                          ? "border-blue-500 ring-2 ring-blue-200" 
                          : "border-slate-200"
                      }`}
                    >
                      <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-transparent [&[data-state=open]>svg]:rotate-180">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm tracking-wide text-slate-800">INVOICE DETAILS</span>
                          {["invoice-no", "invoice-date", "subtotal", "tax", "grand-total"].includes(selectedOcrField || "") && (
                            <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded flex items-center gap-1">
                              <Link2 className="h-3 w-3" /> Linked: {ocrFields.find(f => f.id === selectedOcrField)?.label}
                            </span>
                          )}
                        </div>
                      </AccordionTrigger>
                      <div className="border-t border-slate-100" />
                      <AccordionContent className="px-0 pt-0 pb-0">
                        <div className="bg-slate-50 rounded-lg m-4 p-4 space-y-4">
                          {/* Invoice Number - OCR Linked */}
                          <div className={`flex items-center justify-between p-2 -m-2 rounded transition-all ${
                            selectedOcrField === "invoice-no" ? "bg-blue-100 ring-2 ring-blue-400" : ""
                          }`}>
                            <div className="flex items-center gap-1 text-sm text-slate-600">
                              <span>Invoice Number</span>
                              <span className="text-red-500">*</span>
                              <span>:</span>
                              <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
                                <path strokeLinecap="round" d="M12 16v-4M12 8h.01" strokeWidth="1.5" />
                              </svg>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{invoice.invoiceNumber}</span>
                              {selectedOcrField === "invoice-no" && (
                                <span className="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded flex items-center gap-1">
                                  <Link2 className="h-3 w-3" />
                                </span>
                              )}
                            </div>
                          </div>
                          {/* Invoice Date - OCR Linked */}
                          <div className={`flex items-center justify-between p-2 -m-2 rounded transition-all ${
                            selectedOcrField === "invoice-date" ? "bg-blue-100 ring-2 ring-blue-400" : ""
                          }`}>
                            <div className="flex items-center gap-1 text-sm text-slate-600">
                              <span>Invoice Date</span>
                              <span className="text-red-500">*</span>
                              <span>:</span>
                              <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
                                <path strokeLinecap="round" d="M12 16v-4M12 8h.01" strokeWidth="1.5" />
                              </svg>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{invoice.invoiceDate}</span>
                              {selectedOcrField === "invoice-date" && (
                                <span className="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded flex items-center gap-1">
                                  <Link2 className="h-3 w-3" />
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 text-sm text-slate-600">
                              <span>Fiscal Year</span>
                              <span>:</span>
                              <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
                                <path strokeLinecap="round" d="M12 16v-4M12 8h.01" strokeWidth="1.5" />
                              </svg>
                            </div>
                            <span className="text-sm font-medium">{invoice.fiscalYear}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 text-sm text-slate-600">
                              <span>PO Number</span>
                              <span>:</span>
                              <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
                                <path strokeLinecap="round" d="M12 16v-4M12 8h.01" strokeWidth="1.5" />
                              </svg>
                            </div>
                            <span className="text-sm font-medium">{invoice.poNumber}</span>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                  </Accordion>
                </div>
              </TabsContent>

              {/* Vendor Evaluation Tab */}
              <TabsContent value="vendor-evaluation" className="flex-1 overflow-auto mt-0 p-4">
                <div className="space-y-4">
                  <div className="border border-slate-200 bg-white shadow-sm rounded-lg p-4">
                    <h3 className="font-bold text-sm tracking-wide text-slate-800 mb-4">VENDOR PERFORMANCE</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Overall Rating</span>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg key={star} className={`h-4 w-4 ${star <= 4 ? "text-yellow-400 fill-yellow-400" : "text-slate-300"}`} viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                          <span className="text-sm font-medium ml-2">4.0 / 5.0</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Delivery Timeliness</span>
                        <span className="text-sm font-medium text-emerald-600">95%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Quality Score</span>
                        <span className="text-sm font-medium text-emerald-600">92%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Invoice Accuracy</span>
                        <span className="text-sm font-medium text-amber-600">87%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Total Transactions</span>
                        <span className="text-sm font-medium">156</span>
                      </div>
                    </div>
                  </div>
                  <div className="border border-slate-200 bg-white shadow-sm rounded-lg p-4">
                    <h3 className="font-bold text-sm tracking-wide text-slate-800 mb-4">VENDOR NOTES</h3>
                    <p className="text-sm text-slate-600">Preferred vendor for design services. Consistent quality and reliable delivery.</p>
                  </div>
                </div>
              </TabsContent>

              {/* Checklist Tab */}
              <TabsContent value="checklist" className="flex-1 overflow-auto mt-0 p-4">
                <div className="border border-slate-200 bg-white shadow-sm rounded-lg p-4">
                  <h3 className="font-bold text-sm tracking-wide text-slate-800 mb-4">APPROVAL CHECKLIST</h3>
                  <div className="space-y-3">
                    {[
                      { label: "Invoice amount matches PO", checked: true },
                      { label: "Goods/Services received confirmed", checked: true },
                      { label: "Tax calculations verified", checked: true },
                      { label: "Vendor bank details verified", checked: false },
                      { label: "Budget availability confirmed", checked: false },
                      { label: "Manager approval obtained", checked: false },
                    ].map((item, idx) => (
                      <label key={idx} className="flex items-center gap-3 cursor-pointer">
                        <input 
                          type="checkbox" 
                          defaultChecked={item.checked}
                          className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                        />
                        <span className={`text-sm ${item.checked ? "text-slate-800" : "text-slate-600"}`}>
                          {item.label}
                        </span>
                      </label>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t flex items-center justify-between">
                    <span className="text-sm text-slate-600">Completion</span>
                    <span className="text-sm font-medium">3 / 6 items</span>
                  </div>
                </div>
              </TabsContent>

              {/* Compliance Tab */}
              <TabsContent value="compliance" className="flex-1 overflow-auto mt-0 p-4">
                <div className="space-y-4">
                  <div className="border border-slate-200 bg-white shadow-sm rounded-lg p-4">
                    <h3 className="font-bold text-sm tracking-wide text-slate-800 mb-4">GST COMPLIANCE</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">GSTIN Validation</span>
                        <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">Valid</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">E-Invoice Status</span>
                        <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">Generated</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">IRN Number</span>
                        <span className="text-sm font-medium font-mono">a1b2c3d4e5f6g7h8</span>
                      </div>
                    </div>
                  </div>
                  <div className="border border-slate-200 bg-white shadow-sm rounded-lg p-4">
                    <h3 className="font-bold text-sm tracking-wide text-slate-800 mb-4">TDS COMPLIANCE</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">TDS Applicable</span>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">Yes - 194C</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">TDS Rate</span>
                        <span className="text-sm font-medium">2%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">TDS Amount</span>
                        <span className="text-sm font-medium">{invoice.tdsAmount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* PO Details Tab */}
              <TabsContent value="po-details" className="flex-1 overflow-hidden mt-0 flex flex-col">
                {/* Expanded Table Drawer */}
                {isPoTableExpanded && (
                  <div className="absolute inset-0 z-40 bg-background flex flex-col">
                    <div className="flex items-center justify-between px-4 py-3 border-b bg-slate-50">
                      <h3 className="font-bold text-sm tracking-wide text-slate-800">PO LINE ITEMS - EXPANDED VIEW</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsPoTableExpanded(false)}
                        className="gap-1.5 bg-transparent"
                      >
                        <Minimize2 className="h-4 w-4" />
                        Collapse
                      </Button>
                    </div>
                    <div className="flex-1 overflow-auto p-4">
                      <div className="border border-slate-200 rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs">
                            <thead className="bg-slate-100 sticky top-0">
                              <tr className="border-b border-slate-200">
                                <th className="text-left py-3 px-3 font-semibold text-slate-700 whitespace-nowrap border-r border-slate-200">PO Number</th>
                                <th className="text-left py-3 px-3 font-semibold text-slate-700 whitespace-nowrap border-r border-slate-200">PO Line Item</th>
                                <th className="text-left py-3 px-3 font-semibold text-slate-700 whitespace-nowrap border-r border-slate-200">GRN Item</th>
                                <th className="text-left py-3 px-3 font-semibold text-slate-700 whitespace-nowrap border-r border-slate-200">Material Description</th>
                                <th className="text-right py-3 px-3 font-semibold text-slate-700 whitespace-nowrap border-r border-slate-200">Challan Qty</th>
                                <th className="text-right py-3 px-3 font-semibold text-slate-700 whitespace-nowrap border-r border-slate-200">Receipt Qty</th>
                                <th className="text-right py-3 px-3 font-semibold text-slate-700 whitespace-nowrap border-r border-slate-200">Accepted Qty</th>
                                <th className="text-right py-3 px-3 font-semibold text-slate-700 whitespace-nowrap">Rejected Qty</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white">
                              {poTableData.map((row, idx) => (
                                <tr key={row.id} className={`border-b border-slate-100 ${idx % 2 === 1 ? "bg-slate-50/50" : ""}`}>
                                  <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap border-r border-slate-100 font-medium">{row.poNumber}</td>
                                  <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap border-r border-slate-100 text-center">{row.poLineItem}</td>
                                  <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap border-r border-slate-100">{row.grnItem}</td>
                                  <td className="py-2.5 px-3 text-slate-700 border-r border-slate-100 max-w-[250px] truncate" title={row.materialDescription}>{row.materialDescription}</td>
                                  <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap border-r border-slate-100 text-right font-mono">{row.challanQty}</td>
                                  <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap border-r border-slate-100 text-right font-mono">{row.receiptQty}</td>
                                  <td className="py-2.5 px-3 text-emerald-700 whitespace-nowrap border-r border-slate-100 text-right font-mono font-medium">{row.acceptedQty}</td>
                                  <td className={`py-2.5 px-3 whitespace-nowrap text-right font-mono font-medium ${row.rejectedQty > 0 ? "text-red-600" : "text-slate-400"}`}>{row.rejectedQty}</td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot className="bg-slate-50 border-t-2 border-slate-200">
                              <tr>
                                <td colSpan={4} className="py-2.5 px-3 text-slate-700 font-semibold text-right border-r border-slate-200">Total:</td>
                                <td className="py-2.5 px-3 text-slate-800 whitespace-nowrap border-r border-slate-200 text-right font-mono font-semibold">
                                  {poTableData.reduce((sum, row) => sum + row.challanQty, 0)}
                                </td>
                                <td className="py-2.5 px-3 text-slate-800 whitespace-nowrap border-r border-slate-200 text-right font-mono font-semibold">
                                  {poTableData.reduce((sum, row) => sum + row.receiptQty, 0)}
                                </td>
                                <td className="py-2.5 px-3 text-emerald-700 whitespace-nowrap border-r border-slate-200 text-right font-mono font-semibold">
                                  {poTableData.reduce((sum, row) => sum + row.acceptedQty, 0)}
                                </td>
                                <td className="py-2.5 px-3 text-red-600 whitespace-nowrap text-right font-mono font-semibold">
                                  {poTableData.reduce((sum, row) => sum + row.rejectedQty, 0)}
                                </td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Compact View */}
                <div className="p-4 flex flex-col h-full overflow-auto">
                  {/* PO Summary Card */}
                  <div className="border border-slate-200 bg-white shadow-sm rounded-lg p-4 mb-4">
                    <h3 className="font-bold text-sm tracking-wide text-slate-800 mb-4">PURCHASE ORDER</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">PO Number</span>
                        <span className="text-sm font-medium">{invoice.poNumber}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">PO Date</span>
                        <span className="text-sm font-medium">01.05.2025</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">PO Amount</span>
                        <span className="text-sm font-medium">{invoice.baseAmount}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">PO Status</span>
                        <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">Approved</span>
                      </div>
                    </div>
                  </div>

                  {/* PO Line Items Table */}
                  <div className="flex-1 flex flex-col min-h-0">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-sm tracking-wide text-slate-800">PO LINE ITEMS</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsPoTableExpanded(true)}
                        className="gap-1.5 bg-transparent"
                      >
                        <Maximize2 className="h-4 w-4" />
                        Expand
                      </Button>
                    </div>
                    <div className="border border-slate-200 rounded-lg overflow-hidden flex-1 min-h-0">
                      <div className="overflow-auto h-full">
                        <table className="w-full text-xs">
                          <thead className="bg-slate-100 sticky top-0">
                            <tr className="border-b border-slate-200">
                              <th className="text-left py-2.5 px-3 font-semibold text-slate-700 whitespace-nowrap border-r border-slate-200">PO Number</th>
                              <th className="text-left py-2.5 px-3 font-semibold text-slate-700 whitespace-nowrap border-r border-slate-200">Line</th>
                              <th className="text-left py-2.5 px-3 font-semibold text-slate-700 whitespace-nowrap border-r border-slate-200">GRN Item</th>
                              <th className="text-left py-2.5 px-3 font-semibold text-slate-700 whitespace-nowrap border-r border-slate-200">Material Description</th>
                              <th className="text-right py-2.5 px-3 font-semibold text-slate-700 whitespace-nowrap border-r border-slate-200">Challan</th>
                              <th className="text-right py-2.5 px-3 font-semibold text-slate-700 whitespace-nowrap border-r border-slate-200">Receipt</th>
                              <th className="text-right py-2.5 px-3 font-semibold text-slate-700 whitespace-nowrap border-r border-slate-200">Accepted</th>
                              <th className="text-right py-2.5 px-3 font-semibold text-slate-700 whitespace-nowrap">Rejected</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white">
                            {poTableData.map((row, idx) => (
                              <tr key={row.id} className={`border-b border-slate-100 ${idx % 2 === 1 ? "bg-slate-50/50" : ""}`}>
                                <td className="py-2 px-3 text-slate-700 whitespace-nowrap border-r border-slate-100 font-medium">{row.poNumber}</td>
                                <td className="py-2 px-3 text-slate-700 whitespace-nowrap border-r border-slate-100 text-center">{row.poLineItem}</td>
                                <td className="py-2 px-3 text-slate-700 whitespace-nowrap border-r border-slate-100">{row.grnItem}</td>
                                <td className="py-2 px-3 text-slate-700 border-r border-slate-100 max-w-[150px] truncate" title={row.materialDescription}>{row.materialDescription}</td>
                                <td className="py-2 px-3 text-slate-700 whitespace-nowrap border-r border-slate-100 text-right font-mono">{row.challanQty}</td>
                                <td className="py-2 px-3 text-slate-700 whitespace-nowrap border-r border-slate-100 text-right font-mono">{row.receiptQty}</td>
                                <td className="py-2 px-3 text-emerald-700 whitespace-nowrap border-r border-slate-100 text-right font-mono font-medium">{row.acceptedQty}</td>
                                <td className={`py-2 px-3 whitespace-nowrap text-right font-mono font-medium ${row.rejectedQty > 0 ? "text-red-600" : "text-slate-400"}`}>{row.rejectedQty}</td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot className="bg-slate-50 border-t-2 border-slate-200">
                            <tr>
                              <td colSpan={4} className="py-2 px-3 text-slate-700 font-semibold text-right border-r border-slate-200">Total:</td>
                              <td className="py-2 px-3 text-slate-800 whitespace-nowrap border-r border-slate-200 text-right font-mono font-semibold">
                                {poTableData.reduce((sum, row) => sum + row.challanQty, 0)}
                              </td>
                              <td className="py-2 px-3 text-slate-800 whitespace-nowrap border-r border-slate-200 text-right font-mono font-semibold">
                                {poTableData.reduce((sum, row) => sum + row.receiptQty, 0)}
                              </td>
                              <td className="py-2 px-3 text-emerald-700 whitespace-nowrap border-r border-slate-200 text-right font-mono font-semibold">
                                {poTableData.reduce((sum, row) => sum + row.acceptedQty, 0)}
                              </td>
                              <td className="py-2 px-3 text-red-600 whitespace-nowrap text-right font-mono font-semibold">
                                {poTableData.reduce((sum, row) => sum + row.rejectedQty, 0)}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* GRN Details Tab */}
              <TabsContent value="grn-details" className="flex-1 overflow-hidden mt-0 flex flex-col">
                {/* Expanded Table Drawer */}
                {isGrnTableExpanded && (
                  <div className="absolute inset-0 z-40 bg-background flex flex-col">
                    <div className="flex items-center justify-between px-4 py-3 border-b bg-slate-50">
                      <h3 className="font-bold text-sm tracking-wide text-slate-800">GRN DETAILS - EXPANDED VIEW</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsGrnTableExpanded(false)}
                        className="gap-1.5 bg-transparent"
                      >
                        <Minimize2 className="h-4 w-4" />
                        Collapse
                      </Button>
                    </div>
                    <div className="flex-1 overflow-auto p-4">
                      <div className="border border-slate-200 rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs">
                            <thead className="bg-slate-100 sticky top-0">
                              <tr className="border-b border-slate-200">
                                <th className="text-left py-3 px-3 font-semibold text-slate-700 whitespace-nowrap border-r border-slate-200">Vendor Name</th>
                                <th className="text-left py-3 px-3 font-semibold text-slate-700 whitespace-nowrap border-r border-slate-200">GRN Date</th>
                                <th className="text-right py-3 px-3 font-semibold text-slate-700 whitespace-nowrap border-r border-slate-200">GRN Rate</th>
                                <th className="text-right py-3 px-3 font-semibold text-slate-700 whitespace-nowrap border-r border-slate-200">Tax %</th>
                                <th className="text-right py-3 px-3 font-semibold text-slate-700 whitespace-nowrap border-r border-slate-200">GRN Total Amt</th>
                                <th className="text-left py-3 px-3 font-semibold text-slate-700 whitespace-nowrap border-r border-slate-200">Gate Entry</th>
                                <th className="text-right py-3 px-3 font-semibold text-slate-700 whitespace-nowrap border-r border-slate-200">SGST Amt</th>
                                <th className="text-right py-3 px-3 font-semibold text-slate-700 whitespace-nowrap border-r border-slate-200">CGST Amt</th>
                                <th className="text-right py-3 px-3 font-semibold text-slate-700 whitespace-nowrap border-r border-slate-200">IGST Amt</th>
                                <th className="text-right py-3 px-3 font-semibold text-slate-700 whitespace-nowrap border-r border-slate-200">Tax Amt</th>
                                <th className="text-right py-3 px-3 font-semibold text-slate-700 whitespace-nowrap border-r border-slate-200">CESS Amt</th>
                                <th className="text-left py-3 px-3 font-semibold text-slate-700 whitespace-nowrap border-r border-slate-200">Weighment Type</th>
                                <th className="text-left py-3 px-3 font-semibold text-slate-700 whitespace-nowrap border-r border-slate-200">Delivery Note</th>
                                <th className="text-left py-3 px-3 font-semibold text-slate-700 whitespace-nowrap border-r border-slate-200">Vehicle No</th>
                                <th className="text-left py-3 px-3 font-semibold text-slate-700 whitespace-nowrap">Comments</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white">
                              {grnTableData.map((row, idx) => (
                                <tr key={row.id} className={`border-b border-slate-100 ${idx % 2 === 1 ? "bg-slate-50/50" : ""}`}>
                                  <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap border-r border-slate-100">{row.vendorName}</td>
                                  <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap border-r border-slate-100">{row.grnDate}</td>
                                  <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap border-r border-slate-100 text-right font-mono">{row.grnRate.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                                  <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap border-r border-slate-100 text-right">{row.taxPercent}%</td>
                                  <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap border-r border-slate-100 text-right font-mono font-medium">{row.grnTotalAmt.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                                  <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap border-r border-slate-100">{row.gateEntry}</td>
                                  <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap border-r border-slate-100 text-right font-mono">{row.sgstAmt.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                                  <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap border-r border-slate-100 text-right font-mono">{row.cgstAmt.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                                  <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap border-r border-slate-100 text-right font-mono">{row.igstAmt.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                                  <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap border-r border-slate-100 text-right font-mono">{row.taxAmt.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                                  <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap border-r border-slate-100 text-right font-mono">{row.cessAmt.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                                  <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap border-r border-slate-100">{row.weighmentType}</td>
                                  <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap border-r border-slate-100">{row.deliveryNote}</td>
                                  <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap border-r border-slate-100">{row.vehicleNo}</td>
                                  <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">{row.comments}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Compact Table View */}
                <div className="p-4 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-sm tracking-wide text-slate-800">GRN DETAILS</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsGrnTableExpanded(true)}
                      className="gap-1.5 text-xs bg-transparent"
                    >
                      <Maximize2 className="h-3.5 w-3.5" />
                      Expand Table
                    </Button>
                  </div>
                  
                  <div className="border border-slate-200 rounded-lg overflow-hidden flex-1">
                    <div className="overflow-x-auto h-full">
                      <table className="w-full text-xs min-w-[600px]">
                        <thead className="bg-slate-100 sticky top-0 z-10">
                          <tr className="border-b border-slate-200">
                            <th className="text-left py-2.5 px-2 font-semibold text-slate-700 whitespace-nowrap border-r border-slate-200">Vendor Name</th>
                            <th className="text-left py-2.5 px-2 font-semibold text-slate-700 whitespace-nowrap border-r border-slate-200">GRN Date</th>
                            <th className="text-right py-2.5 px-2 font-semibold text-slate-700 whitespace-nowrap border-r border-slate-200">GRN Rate</th>
                            <th className="text-right py-2.5 px-2 font-semibold text-slate-700 whitespace-nowrap border-r border-slate-200">Tax %</th>
                            <th className="text-right py-2.5 px-2 font-semibold text-slate-700 whitespace-nowrap border-r border-slate-200">GRN Total Amt</th>
                            <th className="text-left py-2.5 px-2 font-semibold text-slate-700 whitespace-nowrap border-r border-slate-200">Gate Entry</th>
                            {/* Extended columns - visible on scroll */}
                            <th className="text-right py-2.5 px-2 font-semibold text-slate-700 whitespace-nowrap border-r border-slate-200 bg-slate-50">SGST Amt</th>
                            <th className="text-right py-2.5 px-2 font-semibold text-slate-700 whitespace-nowrap border-r border-slate-200 bg-slate-50">CGST Amt</th>
                            <th className="text-right py-2.5 px-2 font-semibold text-slate-700 whitespace-nowrap border-r border-slate-200 bg-slate-50">IGST Amt</th>
                            <th className="text-right py-2.5 px-2 font-semibold text-slate-700 whitespace-nowrap border-r border-slate-200 bg-slate-50">Tax Amt</th>
                            <th className="text-right py-2.5 px-2 font-semibold text-slate-700 whitespace-nowrap border-r border-slate-200 bg-slate-50">CESS Amt</th>
                            <th className="text-left py-2.5 px-2 font-semibold text-slate-700 whitespace-nowrap border-r border-slate-200 bg-slate-50">Weighment</th>
                            <th className="text-left py-2.5 px-2 font-semibold text-slate-700 whitespace-nowrap border-r border-slate-200 bg-slate-50">Delivery Note</th>
                            <th className="text-left py-2.5 px-2 font-semibold text-slate-700 whitespace-nowrap border-r border-slate-200 bg-slate-50">Vehicle No</th>
                            <th className="text-left py-2.5 px-2 font-semibold text-slate-700 whitespace-nowrap bg-slate-50">Comments</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white">
                          {grnTableData.map((row, idx) => (
                            <tr key={row.id} className={`border-b border-slate-100 hover:bg-slate-50/80 ${idx % 2 === 1 ? "bg-slate-50/30" : ""}`}>
                              <td className="py-2 px-2 text-slate-700 whitespace-nowrap border-r border-slate-100 max-w-[100px] truncate" title={row.vendorName}>{row.vendorName}</td>
                              <td className="py-2 px-2 text-slate-700 whitespace-nowrap border-r border-slate-100">{row.grnDate}</td>
                              <td className="py-2 px-2 text-slate-700 whitespace-nowrap border-r border-slate-100 text-right font-mono">{row.grnRate.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                              <td className="py-2 px-2 text-slate-700 whitespace-nowrap border-r border-slate-100 text-right">{row.taxPercent}%</td>
                              <td className="py-2 px-2 text-slate-700 whitespace-nowrap border-r border-slate-100 text-right font-mono font-medium">{row.grnTotalAmt.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                              <td className="py-2 px-2 text-slate-700 whitespace-nowrap border-r border-slate-100">{row.gateEntry}</td>
                              {/* Extended columns */}
                              <td className="py-2 px-2 text-slate-600 whitespace-nowrap border-r border-slate-100 text-right font-mono bg-slate-50/30">{row.sgstAmt.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                              <td className="py-2 px-2 text-slate-600 whitespace-nowrap border-r border-slate-100 text-right font-mono bg-slate-50/30">{row.cgstAmt.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                              <td className="py-2 px-2 text-slate-600 whitespace-nowrap border-r border-slate-100 text-right font-mono bg-slate-50/30">{row.igstAmt.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                              <td className="py-2 px-2 text-slate-600 whitespace-nowrap border-r border-slate-100 text-right font-mono bg-slate-50/30">{row.taxAmt.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                              <td className="py-2 px-2 text-slate-600 whitespace-nowrap border-r border-slate-100 text-right font-mono bg-slate-50/30">{row.cessAmt.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                              <td className="py-2 px-2 text-slate-600 whitespace-nowrap border-r border-slate-100 bg-slate-50/30">{row.weighmentType}</td>
                              <td className="py-2 px-2 text-slate-600 whitespace-nowrap border-r border-slate-100 bg-slate-50/30">{row.deliveryNote}</td>
                              <td className="py-2 px-2 text-slate-600 whitespace-nowrap border-r border-slate-100 bg-slate-50/30">{row.vehicleNo}</td>
                              <td className="py-2 px-2 text-slate-500 whitespace-nowrap bg-slate-50/30">{row.comments}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                    <span>Showing {grnTableData.length} records</span>
                    <span className="text-slate-400">Scroll horizontally for more columns</span>
                  </div>
                </div>
              </TabsContent>

              {/* Action History Tab */}
              <TabsContent value="action-history" className="flex-1 overflow-auto mt-0 p-4">
                {/* View Toggle */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-slate-700">Action History</span>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 bg-transparent border-[#3B2D7B] text-[#3B2D7B] hover:bg-[#3B2D7B] hover:text-white transition-colors h-8"
                      onClick={() => {
                        console.log("[v0] Downloading action history for invoice", invoiceId)
                        // Handle download logic here
                      }}
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download
                    </Button>
                    <div className="flex items-center border border-[#3B2D7B]/20 rounded-md bg-[#3B2D7B]/5">
                    <button
                      type="button"
                      onClick={() => setActionHistoryView("timeline")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${
                        actionHistoryView === "timeline"
                          ? "bg-[#3B2D7B] text-white shadow-sm"
                          : "text-[#3B2D7B] hover:bg-[#3B2D7B]/10"
                      } rounded-l-md`}
                    >
                      <List className="h-3.5 w-3.5" />
                      Timeline
                    </button>
                    <button
                      type="button"
                      onClick={() => setActionHistoryView("table")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${
                        actionHistoryView === "table"
                          ? "bg-[#3B2D7B] text-white shadow-sm"
                          : "text-[#3B2D7B] hover:bg-[#3B2D7B]/10"
                      } rounded-r-md`}
                    >
                      <Table2 className="h-3.5 w-3.5" />
                      Table
                    </button>
                  </div>
                  </div>
                </div>

                {/* Table View */}
                {actionHistoryView === "table" && (
                  <div className="border border-slate-200 rounded-lg overflow-x-auto">
                    <table className="w-full text-sm min-w-[700px]">
                      <thead className="bg-slate-100">
                        <tr>
                          <th className="text-left py-3 px-3 font-semibold text-slate-700 border-b border-slate-200">Status</th>
                          <th className="text-left py-3 px-3 font-semibold text-slate-700 border-b border-slate-200">Action</th>
                          <th className="text-left py-3 px-3 font-semibold text-slate-700 border-b border-slate-200">Date & Time</th>
                          <th className="text-left py-3 px-3 font-semibold text-slate-700 border-b border-slate-200">Description</th>
                          <th className="text-left py-3 px-3 font-semibold text-slate-700 border-b border-slate-200">Performed By</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-slate-100 bg-blue-50/50">
                          <td className="py-3 px-3"><Badge className="bg-blue-100 text-blue-700 text-[10px]">Current</Badge></td>
                          <td className="py-3 px-3 font-medium text-slate-800">Pending AP Team Review</td>
                          <td className="py-3 px-3 text-slate-500 whitespace-nowrap">Jan 21, 2026 10:30 AM</td>
                          <td className="py-3 px-3 text-slate-600 text-xs">Task assigned to AP Team for invoice verification and approval.</td>
                          <td className="py-3 px-3 text-slate-600 text-xs">System Auto-Assignment</td>
                        </tr>
                        <tr className="border-b border-slate-100">
                          <td className="py-3 px-3"><span className="text-[10px] text-emerald-600 font-medium">Success</span></td>
                          <td className="py-3 px-3 font-medium text-slate-800">3-Way Match Completed</td>
                          <td className="py-3 px-3 text-slate-500 whitespace-nowrap">Jan 21, 2026 10:28 AM</td>
                          <td className="py-3 px-3 text-slate-600 text-xs">Invoice matched with PO-2025-001234 and GRN-2026-001. All line items verified.</td>
                          <td className="py-3 px-3 text-slate-600 text-xs">Automated Matching Engine</td>
                        </tr>
                        <tr className="border-b border-slate-100 bg-slate-50/50">
                          <td className="py-3 px-3"><span className="text-[10px] text-amber-600 font-medium">Warning</span></td>
                          <td className="py-3 px-3 font-medium text-slate-800">Variance Detected</td>
                          <td className="py-3 px-3 text-slate-500 whitespace-nowrap">Jan 21, 2026 10:25 AM</td>
                          <td className="py-3 px-3 text-slate-600 text-xs">Minor quantity variance detected: Invoice shows 98 units, GRN shows 100 units. Variance: 2%</td>
                          <td className="py-3 px-3 text-slate-600 text-xs">Validation Engine</td>
                        </tr>
                        <tr className="border-b border-slate-100">
                          <td className="py-3 px-3"><span className="text-[10px] text-purple-600 font-medium">Processed</span></td>
                          <td className="py-3 px-3 font-medium text-slate-800">Data Extraction Completed</td>
                          <td className="py-3 px-3 text-slate-500 whitespace-nowrap">Jan 21, 2026 10:20 AM</td>
                          <td className="py-3 px-3 text-slate-600 text-xs">OCR extracted 12 fields with 98% confidence. Invoice number, date, amounts, and line items captured.</td>
                          <td className="py-3 px-3 text-slate-600 text-xs">OCR Processing Engine</td>
                        </tr>
                        <tr className="border-b border-slate-100 bg-slate-50/50">
                          <td className="py-3 px-3"><span className="text-[10px] text-slate-600 font-medium">Received</span></td>
                          <td className="py-3 px-3 font-medium text-slate-800">Invoice Document Uploaded</td>
                          <td className="py-3 px-3 text-slate-500 whitespace-nowrap">Jan 21, 2026 10:15 AM</td>
                          <td className="py-3 px-3 text-slate-600 text-xs">Invoice PDF received via Vendor Portal. File size: 245 KB, Pages: 2</td>
                          <td className="py-3 px-3 text-slate-600 text-xs">Vendor Portal Integration</td>
                        </tr>
                        <tr className="border-b border-slate-100">
                          <td className="py-3 px-3"><span className="text-[10px] text-emerald-600 font-medium">Approved</span></td>
                          <td className="py-3 px-3 font-medium text-slate-800">GRN Approved</td>
                          <td className="py-3 px-3 text-slate-500 whitespace-nowrap">Jan 20, 2026 04:45 PM</td>
                          <td className="py-3 px-3 text-slate-600 text-xs">Goods Receipt Note GRN-2026-001 approved after quality inspection.</td>
                          <td className="py-3 px-3 text-slate-600 text-xs">Michael Kumar - Warehouse Manager</td>
                        </tr>
                        <tr className="border-b border-slate-100 bg-slate-50/50">
                          <td className="py-3 px-3"><span className="text-[10px] text-slate-600 font-medium">Delivered</span></td>
                          <td className="py-3 px-3 font-medium text-slate-800">Goods Received</td>
                          <td className="py-3 px-3 text-slate-500 whitespace-nowrap">Jan 20, 2026 02:30 PM</td>
                          <td className="py-3 px-3 text-slate-600 text-xs">Shipment received at Warehouse A. Delivery challan verified and signed.</td>
                          <td className="py-3 px-3 text-slate-600 text-xs">Warehouse Receiving Dock</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-3"><span className="text-[10px] text-emerald-600 font-medium">Created</span></td>
                          <td className="py-3 px-3 font-medium text-slate-800">Purchase Order Created</td>
                          <td className="py-3 px-3 text-slate-500 whitespace-nowrap">Jan 15, 2026 11:00 AM</td>
                          <td className="py-3 px-3 text-slate-600 text-xs">PO-2025-001234 created and sent to vendor Creative Design Studio for confirmation.</td>
                          <td className="py-3 px-3 text-slate-600 text-xs">John Smith - Procurement Lead</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Timeline View */}
                {actionHistoryView === "timeline" && (
                <div className="space-y-1">
                  {/* Current/Active Action */}
                  <div className="flex gap-3 text-sm p-3 bg-blue-50 border border-blue-100 rounded-lg">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <Clock className="h-4 w-4 text-white" />
                      </div>
                      <div className="w-0.5 h-full bg-blue-200 mt-2" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-blue-800">Pending AP Team Review</p>
                        <Badge className="bg-blue-100 text-blue-700 text-[10px]">Current</Badge>
                      </div>
                      <p className="text-xs text-blue-600 mt-0.5">Jan 21, 2026 at 10:30 AM</p>
                      <p className="text-xs text-slate-600 mt-2">Task assigned to AP Team for invoice verification and approval.</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Avatar className="h-5 w-5">
                          <AvatarFallback className="text-[10px] bg-blue-200 text-blue-700">SY</AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-slate-500">System Auto-Assignment</span>
                      </div>
                    </div>
                  </div>

                  {/* Completed Actions */}
                  <div className="flex gap-3 text-sm p-3 hover:bg-slate-50 rounded-lg transition-colors">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="h-4 w-4 text-white" />
                      </div>
                      <div className="w-0.5 h-full bg-slate-200 mt-2" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-slate-800">3-Way Match Completed</p>
                        <span className="text-[10px] text-emerald-600 font-medium">Success</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">Jan 21, 2026 at 10:28 AM</p>
                      <p className="text-xs text-slate-600 mt-2">Invoice matched with PO-2025-001234 and GRN-2026-001. All line items verified.</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Avatar className="h-5 w-5">
                          <AvatarFallback className="text-[10px] bg-slate-200">AI</AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-slate-500">Automated Matching Engine</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 text-sm p-3 hover:bg-slate-50 rounded-lg transition-colors">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                        <AlertTriangle className="h-4 w-4 text-white" />
                      </div>
                      <div className="w-0.5 h-full bg-slate-200 mt-2" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-slate-800">Variance Detected</p>
                        <span className="text-[10px] text-amber-600 font-medium">Warning</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">Jan 21, 2026 at 10:25 AM</p>
                      <p className="text-xs text-slate-600 mt-2">Minor quantity variance detected: Invoice shows 98 units, GRN shows 100 units. Variance: 2%</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Avatar className="h-5 w-5">
                          <AvatarFallback className="text-[10px] bg-slate-200">AI</AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-slate-500">Validation Engine</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 text-sm p-3 hover:bg-slate-50 rounded-lg transition-colors">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                        <FileText className="h-4 w-4 text-white" />
                      </div>
                      <div className="w-0.5 h-full bg-slate-200 mt-2" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-slate-800">Data Extraction Completed</p>
                        <span className="text-[10px] text-purple-600 font-medium">Processed</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">Jan 21, 2026 at 10:20 AM</p>
                      <p className="text-xs text-slate-600 mt-2">OCR extracted 12 fields with 98% confidence. Invoice number, date, amounts, and line items captured.</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Avatar className="h-5 w-5">
                          <AvatarFallback className="text-[10px] bg-slate-200">AI</AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-slate-500">OCR Processing Engine</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 text-sm p-3 hover:bg-slate-50 rounded-lg transition-colors">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 bg-slate-400 rounded-full flex items-center justify-center">
                        <Upload className="h-4 w-4 text-white" />
                      </div>
                      <div className="w-0.5 h-full bg-slate-200 mt-2" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-slate-800">Invoice Document Uploaded</p>
                        <span className="text-[10px] text-slate-600 font-medium">Received</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">Jan 21, 2026 at 10:15 AM</p>
                      <p className="text-xs text-slate-600 mt-2">Invoice PDF received via Vendor Portal. File size: 245 KB, Pages: 2</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Avatar className="h-5 w-5">
                          <AvatarFallback className="text-[10px] bg-slate-200">VP</AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-slate-500">Vendor Portal Integration</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 text-sm p-3 hover:bg-slate-50 rounded-lg transition-colors">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="h-4 w-4 text-white" />
                      </div>
                      <div className="w-0.5 h-full bg-slate-200 mt-2" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-slate-800">GRN Approved</p>
                        <span className="text-[10px] text-emerald-600 font-medium">Approved</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">Jan 20, 2026 at 04:45 PM</p>
                      <p className="text-xs text-slate-600 mt-2">Goods Receipt Note GRN-2026-001 approved after quality inspection.</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Avatar className="h-5 w-5">
                          <AvatarFallback className="text-[10px] bg-emerald-200 text-emerald-700">MK</AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-slate-500">Michael Kumar - Warehouse Manager</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 text-sm p-3 hover:bg-slate-50 rounded-lg transition-colors">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 bg-slate-400 rounded-full flex items-center justify-center">
                        <Truck className="h-4 w-4 text-white" />
                      </div>
                      <div className="w-0.5 h-full bg-slate-200 mt-2" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-slate-800">Goods Received</p>
                        <span className="text-[10px] text-slate-600 font-medium">Delivered</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">Jan 20, 2026 at 02:30 PM</p>
                      <p className="text-xs text-slate-600 mt-2">Shipment received at Warehouse A. Delivery challan verified and signed.</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Avatar className="h-5 w-5">
                          <AvatarFallback className="text-[10px] bg-slate-200">WH</AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-slate-500">Warehouse Receiving Dock</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 text-sm p-3 hover:bg-slate-50 rounded-lg transition-colors">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-slate-800">Purchase Order Created</p>
                        <span className="text-[10px] text-emerald-600 font-medium">Created</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">Jan 15, 2026 at 11:00 AM</p>
                      <p className="text-xs text-slate-600 mt-2">PO-2025-001234 created and sent to vendor Creative Design Studio for confirmation.</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Avatar className="h-5 w-5">
                          <AvatarFallback className="text-[10px] bg-emerald-200 text-emerald-700">JS</AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-slate-500">John Smith - Procurement Lead</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              </TabsContent>
            </Tabs>
          </div>

        </div>
        )}
      </div>

      {/* Bottom Bar - Financial Metrics Row (Conditional) */}
      {config.showMetricsPanel && metricsPanelPosition === "bottom" && (
        <div className="border-t bg-gradient-to-r from-slate-50 to-slate-100 shrink-0 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
          <div className="flex items-stretch">
            {/* Pin Toggle Button */}
            <button
              type="button"
              onClick={() => setMetricsPanelPosition("top")}
              className="flex items-center justify-center px-2 border-r border-slate-200 hover:bg-slate-100 transition-colors group"
              title="Pin to top"
            >
              <ArrowUpToLine className="h-4 w-4 text-slate-400 group-hover:text-slate-600" />
            </button>

            {/* Metrics Section - Spread across available space */}
            <div className="flex-1 min-w-0">
              <div className="flex items-stretch h-full">
                {/* Currency Badge */}
                <div className="flex items-center justify-center px-4 py-2.5 bg-blue-50/50 border-r border-slate-200">
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] uppercase tracking-wider text-blue-600 font-medium">Currency</span>
                    <span className="text-sm font-bold text-blue-700">{invoice.currency}</span>
                  </div>
                </div>

                {/* Metric Items - Evenly distributed */}
                <div className="flex-1 flex items-center justify-center px-3 py-2.5 border-r border-slate-200">
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] uppercase tracking-wider text-slate-500">Inv Basic Amt</span>
                    <span className="text-sm font-semibold text-slate-800 font-mono">{invoice.baseAmount}</span>
                  </div>
                </div>

                <div className="flex-1 flex items-center justify-center px-3 py-2.5 border-r border-slate-200">
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] uppercase tracking-wider text-slate-500">Tax Amt</span>
                    <span className="text-sm font-semibold text-orange-600 font-mono">{invoice.taxAmount}</span>
                  </div>
                </div>

                <div className="flex-1 flex items-center justify-center px-3 py-2.5 border-r border-slate-200">
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] uppercase tracking-wider text-slate-500">Total Amt</span>
                    <span className="text-sm font-semibold text-slate-800 font-mono">{invoice.totalAmount}</span>
                  </div>
                </div>

                <div className="flex-1 flex items-center justify-center px-3 py-2.5 border-r border-slate-200">
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] uppercase tracking-wider text-slate-500">TDS Amt</span>
                    <span className="text-sm font-semibold text-slate-600 font-mono">{invoice.tdsAmount}</span>
                  </div>
                </div>

                <div className="flex-1 flex items-center justify-center px-3 py-2.5 bg-emerald-50/50 border-r border-slate-200">
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] uppercase tracking-wider text-emerald-600 font-medium">Net Payable</span>
                    <span className="text-sm font-bold text-emerald-700 font-mono">{invoice.netPayableAmount}</span>
                  </div>
                </div>

                <div className="flex-1 flex items-center justify-center px-3 py-2.5 border-r border-slate-200">
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] uppercase tracking-wider text-slate-500">Basic Amt Diff</span>
                    <span className={`text-sm font-semibold font-mono ${invoice.baseAmtDiff === "NA" ? "text-red-600" : invoice.baseAmtDiff?.startsWith("-") ? "text-red-600" : "text-emerald-600"}`}>
                      {invoice.baseAmtDiff}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Section - Fixed width, won't be affected by metrics */}
            <div className="flex items-center gap-2 px-4 py-2.5 shrink-0 bg-white/50">
              <Select defaultValue="">
                <SelectTrigger className="w-[130px] h-9 text-xs bg-white border-slate-200 shadow-sm">
                  <SelectValue placeholder="More Actions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="send-back">Send Back</SelectItem>
                  <SelectItem value="hold">Put on Hold</SelectItem>
                  <SelectItem value="escalate">Escalate</SelectItem>
                  <SelectItem value="add-note">Add Note</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-4 bg-white border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 hover:text-red-700 shadow-sm"
              >
                <X className="h-4 w-4 mr-1.5" />
                Reject
              </Button>
              <Button
                size="sm"
                className="h-9 px-5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                disabled={invoice.status === "Posting Error" || invoice.status === "Rejected"}
              >
                <CheckCircle className="h-4 w-4 mr-1.5" />
                Approve
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
