"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { toast } from "react-toastify" // Import toast from react-toastify library
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Loader2,
  ArrowLeft,
  Check,
  Save,
  MoreHorizontal,
  Trash2,
  Forward,
  Undo2,
  Copy,
  Send,
  CheckCircle,
  XCircle,
  RefreshCw,
  FileEdit,
  MessageCircle,
  UserX,
  Clock,
  FileX,
  Ban,
  FileText,
  History,
  Download,
  List,
  Table2,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

// List of RFQ IDs for navigation
const rfqIds = ["144108", "51694", "51699"]

// Vendor Onboarding steps configuration matching the reference design
const vendorOnboardingSteps = [
  {
    stage: "STAGE 1",
    stageLabel: "CONTACT & ENTITY",
    steps: [
      { id: "oe", code: "OE", label: "Onboarding Essentials", completed: true },
      { id: "id", code: "ID", label: "Company Identification", completed: true },
    ],
  },
  {
    stage: "STAGE 2",
    stageLabel: "COMPLIANCE",
    steps: [
      { id: "tc", code: "TC", label: "TDS Compliance", completed: true },
      { id: "gv", code: "GV", label: "GST Verification", completed: false },
      { id: "ms", code: "MS", label: "MSME Details", completed: false },
    ],
  },
  {
    stage: "STAGE 3",
    stageLabel: "FINANCIAL",
    steps: [
      { id: "ba", code: "BA", label: "Bank Account", completed: false },
      { id: "fs", code: "FS", label: "FSSAI Details", completed: false },
    ],
  },
  {
    stage: "STAGE 4",
    stageLabel: "REVIEW",
    steps: [
      { id: "rv", code: "RV", label: "Review & Submit", completed: false },
    ],
  },
]

// RFQ Steps configuration
const rfqSteps = [
  {
    stage: "STAGE 1",
    stageLabel: "SETUP",
    steps: [
      { id: "gi", code: "GI", label: "General Information", completed: false },
      { id: "tr", code: "TR", label: "Technical Requirements", completed: false },
      { id: "cr", code: "CR", label: "Commercial Requirements", completed: false },
    ],
  },
  {
    stage: "STAGE 2",
    stageLabel: "EVALUATION",
    steps: [
      { id: "sw", code: "SW", label: "Scoring & Weightage", completed: false },
      { id: "ci", code: "CI", label: "Committee Information", completed: false },
    ],
  },
  {
    stage: "STAGE 3",
    stageLabel: "DISTRIBUTION",
    steps: [
      { id: "is", code: "IS", label: "Invite Suppliers", completed: false },
      { id: "pr", code: "PR", label: "Preview RFQ", completed: false },
      { id: "pu", code: "PU", label: "Publish RFQ", completed: false },
    ],
  },
]

// Step content configuration
const stepContent: Record<string, {
  title: string
  description: string
  fields: { id: string; label: string; value: string; type?: string }[]
  sections?: { title: string; fields: { id: string; label: string; value: string; type?: string }[] }[]
}> = {
  oe: {
    title: "Onboarding Essentials",
    description: "Capture and verify primary contact details for this vendor.",
    sections: [
      {
        title: "Primary Contact",
        fields: [
          { id: "contactName", label: "Contact Name", value: "Rahul Mehta" },
          { id: "designation", label: "Designation", value: "Account Manager" },
          { id: "email", label: "Email Address", value: "rahul.mehta@testmail.com" },
          { id: "mobile", label: "Mobile Number", value: "+91 90876 55421" },
        ],
      },
      {
        title: "Verification Status",
        fields: [
          { id: "emailVerified", label: "Email Verified", value: "Yes" },
          { id: "phoneVerified", label: "Phone Verified", value: "Pending" },
        ],
      },
    ],
    fields: [],
  },
  id: {
    title: "Company Identification",
    description: "Enter legal entity details and registration information.",
    fields: [
      { id: "companyName", label: "Legal Company Name", value: "ABC Technologies Pvt. Ltd." },
      { id: "tradeName", label: "Trade Name", value: "ABC Tech" },
      { id: "pan", label: "PAN Number", value: "AABCA1234X" },
      { id: "cin", label: "CIN Number", value: "U72200MH2015PTC123456" },
    ],
  },
  tc: {
    title: "TDS Compliance",
    description: "Configure TDS deduction and compliance settings.",
    fields: [
      { id: "tdsCategory", label: "TDS Category", value: "194C - Contractor" },
      { id: "tdsRate", label: "TDS Rate (%)", value: "2.0" },
      { id: "tan", label: "TAN Number", value: "MUMA12345B" },
    ],
  },
  gv: {
    title: "GST Verification",
    description: "Verify GST registration and compliance details.",
    fields: [
      { id: "gstin", label: "GSTIN", value: "" },
      { id: "gstStatus", label: "GST Status", value: "" },
      { id: "registrationDate", label: "Registration Date", value: "" },
    ],
  },
  ms: {
    title: "MSME Details",
    description: "Enter MSME registration details if applicable.",
    fields: [
      { id: "msmeNumber", label: "MSME/Udyam Number", value: "" },
      { id: "msmeCategory", label: "MSME Category", value: "" },
      { id: "validUntil", label: "Valid Until", value: "" },
    ],
  },
  ba: {
    title: "Bank Account",
    description: "Add bank account details for payment processing.",
    fields: [
      { id: "bankName", label: "Bank Name", value: "" },
      { id: "accountNumber", label: "Account Number", value: "" },
      { id: "ifsc", label: "IFSC Code", value: "" },
      { id: "accountType", label: "Account Type", value: "" },
    ],
  },
  fs: {
    title: "FSSAI Details",
    description: "Enter food safety license details if applicable.",
    fields: [
      { id: "fssaiNumber", label: "FSSAI License Number", value: "" },
      { id: "fssaiCategory", label: "License Category", value: "" },
      { id: "expiryDate", label: "Expiry Date", value: "" },
    ],
  },
  rv: {
    title: "Review & Submit",
    description: "Review all entered information before final submission.",
    fields: [],
  },
  gi: {
    title: "General Information",
    description: "Define the basic scope and timeline of this RFQ.",
    fields: [
      { id: "rfqTitle", label: "RFQ Title", value: "Annual Supply Contract – General Consumables 2025" },
      { id: "rfqRefId", label: "RFQ Reference ID", value: "RFQ-2025-001" },
      { id: "prNumber", label: "Internal PR Number", value: "PR-00891" },
      { id: "department", label: "Buying Department", value: "Administration & Facilities" },
    ],
  },
  tr: {
    title: "Technical Requirements",
    description: "Specify technical specifications and requirements for the RFQ.",
    fields: [
      { id: "techSpecs", label: "Technical Specifications", value: "" },
      { id: "standards", label: "Required Standards", value: "" },
      { id: "certifications", label: "Certifications", value: "" },
    ],
  },
  cr: {
    title: "Commercial Requirements",
    description: "Define pricing, payment terms, and commercial conditions.",
    fields: [
      { id: "pricingModel", label: "Pricing Model", value: "" },
      { id: "paymentTerms", label: "Payment Terms", value: "" },
      { id: "deliveryTerms", label: "Delivery Terms", value: "" },
    ],
  },
  sw: {
    title: "Scoring & Weightage",
    description: "Set up evaluation criteria and weightage for supplier bids.",
    fields: [
      { id: "pricingWeight", label: "Pricing Weight (%)", value: "" },
      { id: "qualityWeight", label: "Quality Weight (%)", value: "" },
      { id: "deliveryWeight", label: "Delivery Weight (%)", value: "" },
    ],
  },
  ci: {
    title: "Committee Information",
    description: "Add evaluation committee members and their roles.",
    fields: [
      { id: "chairperson", label: "Committee Chairperson", value: "" },
      { id: "members", label: "Committee Members", value: "" },
    ],
  },
  is: {
    title: "Invite Suppliers",
    description: "Select and invite suppliers to participate in the RFQ.",
    fields: [
      { id: "supplierList", label: "Supplier List", value: "" },
      { id: "invitationMessage", label: "Invitation Message", value: "" },
    ],
  },
  pr: {
    title: "Preview RFQ",
    description: "Review the complete RFQ before publishing.",
    fields: [],
  },
  pu: {
    title: "Publish RFQ",
    description: "Publish the RFQ and notify invited suppliers.",
    fields: [],
  },
}

// Mock RFQ data
const rfqData: Record<string, {
  title: string
  referenceId: string
  prNumber: string
  department: string
  publishDate: string
  deadline: string
  awardDate: string
  status: string
  lastSaved: string
}> = {
  "144108": {
    title: "Annual Supply Contract – General Consumables 2025",
    referenceId: "RFQ-2025-001",
    prNumber: "PR-00891",
    department: "Administration & Facilities",
    publishDate: "25 Jan 2025",
    deadline: "05 Feb 2025, 6:00 PM",
    awardDate: "15 Feb 2025",
    status: "Draft",
    lastSaved: "2 minutes ago",
  },
  "51694": {
    title: "IT Infrastructure Upgrade – Server Equipment",
    referenceId: "RFQ-2025-043",
    prNumber: "PR-00923",
    department: "Information Technology",
    publishDate: "28 Jan 2025",
    deadline: "10 Feb 2025, 5:00 PM",
    awardDate: "20 Feb 2025",
    status: "Draft",
    lastSaved: "5 minutes ago",
  },
  "51699": {
    title: "Heavy Machinery Parts – Annual Maintenance",
    referenceId: "RFQ-2025-044",
    prNumber: "PR-00945",
    department: "Operations",
    publishDate: "30 Jan 2025",
    deadline: "15 Feb 2025, 4:00 PM",
    awardDate: "25 Feb 2025",
    status: "In Review",
    lastSaved: "10 minutes ago",
  },
}

export default function RFQDetailPage() {
  const params = useParams()
  const router = useRouter()
  const rfqId = params.id as string
  const [activeStep, setActiveStep] = useState("oe")
  const [isNavigating, setIsNavigating] = useState(false)
  const [navigatingDirection, setNavigatingDirection] = useState<"prev" | "next" | null>(null)
  const [vendorOnboardingExpanded, setVendorOnboardingExpanded] = useState(true)
  const [rfqStepsExpanded, setRfqStepsExpanded] = useState(false)
  
  // Action dialog states
  const [showPublishDialog, setShowPublishDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showForwardSheet, setShowForwardSheet] = useState(false)
  const [showSendBackSheet, setShowSendBackSheet] = useState(false)
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false)
  const [showClarificationSheet, setShowClarificationSheet] = useState(false)
  const [showDisqualifyDialog, setShowDisqualifyDialog] = useState(false)
  const [showExtendSheet, setShowExtendSheet] = useState(false)
  const [showRetenderDialog, setShowRetenderDialog] = useState(false)
  const [showScrapDialog, setShowScrapDialog] = useState(false)
  const [showCloseSheet, setShowCloseSheet] = useState(false)
  const [showActionHistorySheet, setShowActionHistorySheet] = useState(false)
  const [actionHistoryView, setActionHistoryView] = useState<"timeline" | "table">("timeline")
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)
  
  // Form states
  const [forwardEmail, setForwardEmail] = useState("")
  const [forwardComments, setForwardComments] = useState("")
  const [sendBackComments, setSendBackComments] = useState("")
  const [clarificationTab, setClarificationTab] = useState("technical")
  const [clarificationComments, setClarificationComments] = useState("")
  const [disqualifyComments, setDisqualifyComments] = useState("")
  const [newDueDate, setNewDueDate] = useState("")
  const [extendComments, setExtendComments] = useState("")
  const [scrapComments, setScrapComments] = useState("")
  const [closeOption, setCloseOption] = useState("awarded")
  const [closeComments, setCloseComments] = useState("")

  // Get RFQ data
  const data = rfqData[rfqId] || rfqData["144108"]

  // Get current step content
  const currentStepContent = stepContent[activeStep] || stepContent["oe"]

  // Calculate completed steps
  const totalSteps = vendorOnboardingSteps.reduce((acc, stage) => acc + stage.steps.length, 0)
  const completedSteps = vendorOnboardingSteps.reduce(
    (acc, stage) => acc + stage.steps.filter((s) => s.completed).length,
    0
  )

  // Get all steps in a flat array for navigation
  const allSteps = vendorOnboardingSteps.flatMap((stage) => stage.steps)
  const currentStepIndex = allSteps.findIndex((s) => s.id === activeStep)

  // Navigation helpers for RFQ list
  const currentIndex = rfqIds.indexOf(rfqId)
  const hasPrev = currentIndex > 0
  const hasNext = currentIndex < rfqIds.length - 1 && currentIndex !== -1

  const goToPrev = () => {
    if (hasPrev && !isNavigating) {
      setIsNavigating(true)
      setNavigatingDirection("prev")
      setTimeout(() => {
        router.push(`/sop/inbox/rfq/${rfqIds[currentIndex - 1]}`)
      }, 300)
    }
  }

  const goToNext = () => {
    if (hasNext && !isNavigating) {
      setIsNavigating(true)
      setNavigatingDirection("next")
      setTimeout(() => {
        router.push(`/sop/inbox/rfq/${rfqIds[currentIndex + 1]}`)
      }, 300)
    }
  }

  // Step navigation
  const goToPrevStep = () => {
    if (currentStepIndex > 0) {
      setActiveStep(allSteps[currentStepIndex - 1].id)
    }
  }

  const goToNextStep = () => {
    if (currentStepIndex < allSteps.length - 1) {
      setActiveStep(allSteps[currentStepIndex + 1].id)
    }
  }

  // Audit log helper
  const logAuditAction = (action: string, details?: string) => {
    console.log("[v0] Audit Log:", {
      rfqId,
      action,
      details,
      timestamp: new Date().toISOString(),
      user: "Current User"
    })
  }

  // Action handlers
  const handlePublish = () => {
    logAuditAction("RFQ Published")
    toast({
      title: "RFQ Published Successfully",
      description: `RFQ ${data.referenceId} has been published to suppliers.`
    })
    setShowPublishDialog(false)
  }

  const handleDelete = () => {
    logAuditAction("RFQ Deleted")
    toast({
      title: "RFQ Deleted",
      description: "The RFQ has been moved to trash."
    })
    setShowDeleteDialog(false)
    setTimeout(() => router.push("/sop/inbox"), 1000)
  }

  const handleForward = () => {
    if (!forwardEmail) {
      toast({
        title: "Email Required",
        description: "Please enter an email address.",
        variant: "destructive"
      })
      return
    }
    logAuditAction("RFQ Forwarded", `To: ${forwardEmail}`)
    toast({
      title: "RFQ Forwarded",
      description: `RFQ forwarded to ${forwardEmail}`
    })
    setShowForwardSheet(false)
    setForwardEmail("")
    setForwardComments("")
  }

  const handleSendBack = () => {
    if (!sendBackComments.trim()) {
      toast({
        title: "Comments Required",
        description: "Please provide comments for sending back.",
        variant: "destructive"
      })
      return
    }
    logAuditAction("RFQ Sent Back", sendBackComments)
    toast({
      title: "RFQ Sent Back",
      description: "RFQ has been sent back to the previous step."
    })
    setShowSendBackSheet(false)
    setSendBackComments("")
  }

  const handleDuplicate = () => {
    logAuditAction("RFQ Duplicated")
    toast({
      title: "RFQ Duplicated",
      description: `A copy of ${data.referenceId} has been created in Draft state.`
    })
    setShowDuplicateDialog(false)
  }

  const handleRequestClarification = () => {
    if (!clarificationComments.trim()) {
      toast({
        title: "Comments Required",
        description: "Please provide clarification details.",
        variant: "destructive"
      })
      return
    }
    logAuditAction("Clarification Requested", `Type: ${clarificationTab}, Comments: ${clarificationComments}`)
    toast({
      title: "Clarification Requested",
      description: `${clarificationTab === "technical" ? "Technical" : "Commercial"} clarification has been sent.`
    })
    setShowClarificationSheet(false)
    setClarificationComments("")
  }

  const handleDisqualifySupplier = () => {
    if (!disqualifyComments.trim()) {
      toast({
        title: "Comments Required",
        description: "Please provide a reason for disqualification.",
        variant: "destructive"
      })
      return
    }
    logAuditAction("Supplier Disqualified", disqualifyComments)
    toast({
      title: "Supplier Disqualified",
      description: "The supplier has been disqualified for this RFQ."
    })
    setShowDisqualifyDialog(false)
    setDisqualifyComments("")
  }

  const handleExtend = () => {
    if (!newDueDate) {
      toast({
        title: "Due Date Required",
        description: "Please select a new due date.",
        variant: "destructive"
      })
      return
    }
    logAuditAction("RFQ Extended", `New Due Date: ${newDueDate}`)
    toast({
      title: "RFQ Extended",
      description: `Due date extended to ${newDueDate}`
    })
    setShowExtendSheet(false)
    setNewDueDate("")
    setExtendComments("")
  }

  const handleRetender = () => {
    logAuditAction("RFQ Retendered")
    toast({
      title: "RFQ Retendered",
      description: "A new RFQ version has been created and linked to the current RFQ."
    })
    setShowRetenderDialog(false)
  }

  const handleScrap = () => {
    if (!scrapComments.trim()) {
      toast({
        title: "Comments Required",
        description: "Please provide a reason for scrapping.",
        variant: "destructive"
      })
      return
    }
    logAuditAction("RFQ Scrapped", scrapComments)
    toast({
      title: "RFQ Scrapped",
      description: "The RFQ has been marked as scrapped and locked."
    })
    setShowScrapDialog(false)
    setScrapComments("")
  }

  const handleClose = () => {
    if (closeOption === "not-awarded" && !closeComments.trim()) {
      toast({
        title: "Comments Required",
        description: "Please provide comments for not awarding.",
        variant: "destructive"
      })
      return
    }
    logAuditAction("RFQ Closed", `Status: ${closeOption}, Comments: ${closeComments}`)
    toast({
      title: "RFQ Closed",
      description: `RFQ has been closed as ${closeOption === "awarded" ? "Awarded" : "Not Awarded"}.`
    })
    setShowCloseSheet(false)
    setCloseOption("awarded")
    setCloseComments("")
  }

  const handleGenerateReport = () => {
    setIsGeneratingReport(true)
    logAuditAction("Evaluation Report Generated")
    
    setTimeout(() => {
      toast({
        title: "Report Generated",
        description: "Evaluation report has been downloaded successfully."
      })
      setIsGeneratingReport(false)
    }, 2000)
  }

  return (
    <div className="flex flex-col h-full bg-background relative">
      {/* Navigation Transition Overlay */}
      {isNavigating && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="h-12 w-12 rounded-full border-4 border-slate-200" />
              <div className="absolute inset-0 h-12 w-12 rounded-full border-4 border-t-purple-600 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {navigatingDirection === "prev" ? (
                <>
                  <ChevronLeft className="h-4 w-4" />
                  <span>Loading previous RFQ...</span>
                </>
              ) : (
                <>
                  <span>Loading next RFQ...</span>
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Top Header - Matching Reference Design */}
      <div className="border-b bg-background px-6 py-4 shrink-0">
        <div className="flex items-center justify-between">
          {/* Left: Task ID + Stage Badge + SLA Text */}
          <div className="flex items-center gap-4">
            <Link
              href="/sop/inbox"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold text-foreground">T{rfqId}</h1>
              <Badge 
                variant="outline" 
                className="bg-amber-50 text-amber-700 border-amber-200 font-normal"
              >
                Stage - {data.status}
              </Badge>
              <span className="text-sm text-muted-foreground">SLA: 3 hours 45 minutes</span>
            </div>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Save Icon Button */}
            <Button variant="outline" size="icon" className="bg-transparent" title="Save">
              <Save className="h-4 w-4" />
            </Button>

            {/* More Actions Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-transparent gap-2">
                  <MoreHorizontal className="h-4 w-4" />
                  More Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {/* Primary Actions */}
                <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => setShowPublishDialog(true)}>
                  <Send className="h-4 w-4" />
                  Publish
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 cursor-pointer text-destructive focus:text-destructive" onClick={() => setShowDeleteDialog(true)}>
                  <Trash2 className="h-4 w-4" />
                  Delete
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => setShowForwardSheet(true)}>
                  <Forward className="h-4 w-4" />
                  Forward
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => setShowSendBackSheet(true)}>
                  <Undo2 className="h-4 w-4" />
                  Send Back
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => setShowDuplicateDialog(true)}>
                  <Copy className="h-4 w-4" />
                  Duplicate
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Additional Actions</DropdownMenuLabel>
                
                {/* Additional Actions */}
                <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => setShowClarificationSheet(true)}>
                  <MessageCircle className="h-4 w-4" />
                  Request Clarification
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 cursor-pointer text-destructive focus:text-destructive" onClick={() => setShowDisqualifyDialog(true)}>
                  <UserX className="h-4 w-4" />
                  Disqualify Supplier
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => setShowExtendSheet(true)}>
                  <Clock className="h-4 w-4" />
                  Extend
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => setShowRetenderDialog(true)}>
                  <RefreshCw className="h-4 w-4" />
                  Retender
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 cursor-pointer text-destructive focus:text-destructive" onClick={() => setShowScrapDialog(true)}>
                  <FileX className="h-4 w-4" />
                  Scrap
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => setShowCloseSheet(true)}>
                  <Ban className="h-4 w-4" />
                  Close
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => setShowActionHistorySheet(true)}>
                  <History className="h-4 w-4" />
                  Action History
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 cursor-pointer" onClick={handleGenerateReport} disabled={isGeneratingReport}>
                  {isGeneratingReport ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <FileText className="h-4 w-4" />
                  )}
                  {isGeneratingReport ? "Generating..." : "Generate Evaluation Report"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Reject Button */}
            <Button 
              variant="outline"
              className="bg-transparent text-destructive border-destructive hover:bg-destructive hover:text-white gap-2"
            >
              <XCircle className="h-4 w-4" />
              Reject
            </Button>

            {/* Approve Primary Button */}
            <Button 
              className="bg-[#3E2C80] hover:bg-[#2F2060] text-white gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              Approve
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Matching Reference Design */}
        <div className="w-[280px] border-r bg-background overflow-y-auto">
          {/* Vendor Onboarding Header */}
          <button
            type="button"
            className="w-full flex items-center justify-between px-4 py-4 text-sm font-medium hover:bg-muted/30 border-b"
            onClick={() => setVendorOnboardingExpanded(!vendorOnboardingExpanded)}
          >
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground">Vendor Onboarding</span>
              <span className="text-muted-foreground">({completedSteps}/{totalSteps})</span>
            </div>
            <ChevronDown 
              className={`h-4 w-4 text-muted-foreground transition-transform ${
                vendorOnboardingExpanded ? "" : "-rotate-90"
              }`} 
            />
          </button>

          {vendorOnboardingExpanded && (
            <div className="py-2 border-b">
              {vendorOnboardingSteps.map((stage) => (
                <div key={stage.stage} className="mb-2">
                  {/* Stage Header */}
                  <div className="px-4 py-2 text-xs font-medium text-muted-foreground tracking-wide">
                    {stage.stage} · {stage.stageLabel}
                  </div>
                  
                  {/* Stage Steps */}
                  <div className="space-y-0.5">
                    {stage.steps.map((step) => {
                      const isActive = activeStep === step.id
                      const isCompleted = step.completed
                      return (
                        <button
                          key={step.id}
                          type="button"
                          className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors relative ${
                            isActive
                              ? "bg-purple-50"
                              : isCompleted
                                ? "bg-[#E8F5F0]"
                                : "hover:bg-muted/50"
                          }`}
                          onClick={() => setActiveStep(step.id)}
                        >
                          {/* Active indicator bar */}
                          {isActive && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-600 rounded-r" />
                          )}
                          
                          <div className="flex items-center gap-3">
                            <span 
                              className={`w-7 h-7 rounded flex items-center justify-center text-xs font-medium ${
                                isActive
                                  ? "bg-purple-100 text-purple-700"
                                  : isCompleted
                                    ? "bg-[#C8E6DD] text-[#4C5D53]"
                                    : "bg-muted text-[#4A4A4A]"
                              }`}
                            >
                              {step.code}
                            </span>
                            <span className={`${isActive ? "text-purple-900 font-medium" : isCompleted ? "text-[#4C5D53]" : "text-[#4A4A4A]"}`}>
                              {step.label}
                            </span>
                          </div>
                          
                          {/* Completed checkmark - only show if not active */}
                          {isCompleted && !isActive && (
                            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-[#5BAF8E]">
                              <Check className="h-3 w-3 text-white stroke-[3]" />
                            </div>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* RFQ Steps Header */}
          <button
            type="button"
            className="w-full flex items-center justify-between px-4 py-4 text-sm font-medium hover:bg-muted/30 border-b"
            onClick={() => setRfqStepsExpanded(!rfqStepsExpanded)}
          >
            <span className="font-medium text-foreground">RFQ Steps</span>
            <ChevronDown 
              className={`h-4 w-4 text-muted-foreground transition-transform ${
                rfqStepsExpanded ? "" : "-rotate-90"
              }`} 
            />
          </button>

          {rfqStepsExpanded && (
            <div className="py-2">
              {rfqSteps.map((stage) => (
                <div key={stage.stage} className="mb-2">
                  {/* Stage Header */}
                  <div className="px-4 py-2 text-xs font-medium text-muted-foreground tracking-wide">
                    {stage.stage} · {stage.stageLabel}
                  </div>
                  
                  {/* Stage Steps */}
                  <div className="space-y-0.5">
                    {stage.steps.map((step) => {
                      const isActive = activeStep === step.id
                      const isCompleted = step.completed
                      return (
                        <button
                          key={step.id}
                          type="button"
                          className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors relative ${
                            isActive
                              ? "bg-purple-50"
                              : isCompleted
                                ? "bg-green-50/50"
                                : "hover:bg-muted/50"
                          }`}
                          onClick={() => setActiveStep(step.id)}
                        >
                          {/* Active indicator bar */}
                          {isActive && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-600 rounded-r" />
                          )}
                          
                          <div className="flex items-center gap-3">
                            <span 
                              className={`w-7 h-7 rounded flex items-center justify-center text-xs font-medium ${
                                isActive
                                  ? "bg-purple-100 text-purple-700"
                                  : isCompleted
                                    ? "bg-green-100 text-[#4C5D53]"
                                    : "bg-muted text-[#4A4A4A]"
                              }`}
                            >
                              {isCompleted && !isActive ? (
                                <Check className="h-4 w-4" />
                              ) : (
                                step.code
                              )}
                            </span>
                            <span className={`${isActive ? "text-purple-900 font-medium" : isCompleted ? "text-[#4C5D53]" : "text-[#4A4A4A]"}`}>
                              {step.label}
                            </span>
                          </div>
                          
                          {/* Completed checkmark - only show if not active */}
                          {isCompleted && !isActive && (
                            <Check className="h-4 w-4 text-[#4C5D53]" />
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-8 bg-muted/20">
          <div className="max-w-2xl">
            {/* Step Title & Description */}
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              {currentStepContent.title}
            </h2>
            <p className="text-muted-foreground mb-8">
              {currentStepContent.description}
            </p>

            {/* Form Sections */}
            {currentStepContent.sections ? (
              currentStepContent.sections.map((section) => (
                <div key={section.title} className="mb-8">
                  <h3 className="text-sm font-semibold text-foreground mb-4">{section.title}</h3>
                  <div className="space-y-5">
                    {section.fields.map((field) => (
                      <div key={field.id}>
                        <Label 
                          htmlFor={field.id} 
                          className="text-sm font-medium text-foreground mb-2 block"
                        >
                          {field.label}
                        </Label>
                        <Input
                          id={field.id}
                          defaultValue={field.value}
                          className="bg-background border-border"
                          placeholder={field.value ? undefined : `Enter ${field.label.toLowerCase()}`}
                        />
                      </div>
                    ))}
                  </div>
                  {section !== currentStepContent.sections![currentStepContent.sections!.length - 1] && (
                    <div className="border-t mt-8" />
                  )}
                </div>
              ))
            ) : (
              <div className="space-y-5">
                {currentStepContent.fields.map((field) => (
                  <div key={field.id}>
                    <Label 
                      htmlFor={field.id} 
                      className="text-sm font-medium text-foreground mb-2 block"
                    >
                      {field.label}
                    </Label>
                    <Input
                      id={field.id}
                      defaultValue={field.value}
                      className="bg-background border-border"
                      placeholder={field.value ? undefined : `Enter ${field.label.toLowerCase()}`}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Publish Dialog */}
      <AlertDialog open={showPublishDialog} onOpenChange={setShowPublishDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Publish RFQ</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to publish this RFQ? This will notify all invited suppliers and they can start submitting bids.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handlePublish} className="bg-[#3E2C80] hover:bg-[#2F2060]">
              Publish
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete RFQ</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this RFQ? This action will move the RFQ to trash and can be recovered within 30 days.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Forward Dialog */}
      <Dialog open={showForwardSheet} onOpenChange={setShowForwardSheet}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Forward RFQ</DialogTitle>
            <DialogDescription>
              Forward this RFQ to another user or external party.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="forward-email">Email Address *</Label>
              <Input
                id="forward-email"
                type="email"
                placeholder="Enter email address"
                value={forwardEmail}
                onChange={(e) => setForwardEmail(e.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="forward-comments">Comments (Optional)</Label>
              <Textarea
                id="forward-comments"
                placeholder="Add any additional comments..."
                value={forwardComments}
                onChange={(e) => setForwardComments(e.target.value)}
                className="mt-2"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForwardSheet(false)}>
              Cancel
            </Button>
            <Button onClick={handleForward} className="bg-[#3E2C80] hover:bg-[#2F2060]">
              Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Back Dialog */}
      <Dialog open={showSendBackSheet} onOpenChange={setShowSendBackSheet}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Send Back RFQ</DialogTitle>
            <DialogDescription>
              Send this RFQ back to the previous step for revision.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Previous Step</Label>
              <Input
                value="General Information"
                readOnly
                className="mt-2 bg-muted"
              />
            </div>
            <div>
              <Label htmlFor="sendback-comments">Comments *</Label>
              <Textarea
                id="sendback-comments"
                placeholder="Provide reason for sending back..."
                value={sendBackComments}
                onChange={(e) => setSendBackComments(e.target.value)}
                className="mt-2"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSendBackSheet(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendBack} className="bg-[#3E2C80] hover:bg-[#2F2060]">
              Send Back
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Duplicate Dialog */}
      <AlertDialog open={showDuplicateDialog} onOpenChange={setShowDuplicateDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Duplicate RFQ</AlertDialogTitle>
            <AlertDialogDescription>
              This will create a copy of the current RFQ in Draft state. You can modify it before publishing.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDuplicate} className="bg-[#3E2C80] hover:bg-[#2F2060]">
              Duplicate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Request Clarification Dialog */}
      <Dialog open={showClarificationSheet} onOpenChange={setShowClarificationSheet}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Request Clarification</DialogTitle>
            <DialogDescription>
              Request technical or commercial clarification from suppliers.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Tabs value={clarificationTab} onValueChange={setClarificationTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="technical">Technical</TabsTrigger>
                <TabsTrigger value="commercial">Commercial</TabsTrigger>
              </TabsList>
              <TabsContent value="technical" className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="tech-comments">Comments *</Label>
                  <Textarea
                    id="tech-comments"
                    placeholder="Describe technical clarification needed..."
                    value={clarificationComments}
                    onChange={(e) => setClarificationComments(e.target.value)}
                    className="mt-2"
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="tech-attachment">Attachment (Optional)</Label>
                  <Input
                    id="tech-attachment"
                    type="file"
                    className="mt-2"
                  />
                </div>
              </TabsContent>
              <TabsContent value="commercial" className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="comm-comments">Comments *</Label>
                  <Textarea
                    id="comm-comments"
                    placeholder="Describe commercial clarification needed..."
                    value={clarificationComments}
                    onChange={(e) => setClarificationComments(e.target.value)}
                    className="mt-2"
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="comm-attachment">Attachment (Optional)</Label>
                  <Input
                    id="comm-attachment"
                    type="file"
                    className="mt-2"
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowClarificationSheet(false)}>
              Cancel
            </Button>
            <Button onClick={handleRequestClarification} className="bg-[#3E2C80] hover:bg-[#2F2060]">
              Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Disqualify Supplier Dialog */}
      <Dialog open={showDisqualifyDialog} onOpenChange={setShowDisqualifyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Disqualify Supplier</DialogTitle>
            <DialogDescription>
              This will disqualify the supplier from this RFQ only. Provide a reason for the disqualification.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="disqualify-comments">Reason for Disqualification *</Label>
            <Textarea
              id="disqualify-comments"
              placeholder="Provide detailed reason..."
              value={disqualifyComments}
              onChange={(e) => setDisqualifyComments(e.target.value)}
              className="mt-2"
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDisqualifyDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleDisqualifySupplier} variant="destructive">
              Disqualify
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Extend Dialog */}
      <Dialog open={showExtendSheet} onOpenChange={setShowExtendSheet}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Extend RFQ Deadline</DialogTitle>
            <DialogDescription>
              Extend the bid submission deadline for this RFQ.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Current Due Date</Label>
              <Input
                value={data.deadline}
                readOnly
                className="mt-2 bg-muted"
              />
            </div>
            <div>
              <Label htmlFor="new-due-date">New Due Date *</Label>
              <Input
                id="new-due-date"
                type="datetime-local"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="extend-comments">Comments (Optional)</Label>
              <Textarea
                id="extend-comments"
                placeholder="Reason for extension..."
                value={extendComments}
                onChange={(e) => setExtendComments(e.target.value)}
                className="mt-2"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExtendSheet(false)}>
              Cancel
            </Button>
            <Button onClick={handleExtend} className="bg-[#3E2C80] hover:bg-[#2F2060]">
              Extend
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Retender Dialog */}
      <AlertDialog open={showRetenderDialog} onOpenChange={setShowRetenderDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Retender RFQ</AlertDialogTitle>
            <AlertDialogDescription>
              This will create a new RFQ version linked to the current one. The new version will be in Draft state and inherit all settings from the current RFQ.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRetender} className="bg-[#3E2C80] hover:bg-[#2F2060]">
              Retender
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Scrap Dialog */}
      <Dialog open={showScrapDialog} onOpenChange={setShowScrapDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Scrap RFQ</DialogTitle>
            <DialogDescription>
              This action will mark the RFQ as scrapped and lock all further actions. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="scrap-comments">Reason for Scrapping *</Label>
            <Textarea
              id="scrap-comments"
              placeholder="Provide detailed reason for scrapping..."
              value={scrapComments}
              onChange={(e) => setScrapComments(e.target.value)}
              className="mt-2"
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowScrapDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleScrap} variant="destructive">
              Scrap RFQ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Close Dialog */}
      <Dialog open={showCloseSheet} onOpenChange={setShowCloseSheet}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Close RFQ</DialogTitle>
            <DialogDescription>
              Mark this RFQ as closed after the evaluation process.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Closure Status *</Label>
              <RadioGroup value={closeOption} onValueChange={setCloseOption} className="mt-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="awarded" id="awarded" />
                  <Label htmlFor="awarded" className="font-normal cursor-pointer">
                    Awarded
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="not-awarded" id="not-awarded" />
                  <Label htmlFor="not-awarded" className="font-normal cursor-pointer">
                    Not Awarded
                  </Label>
                </div>
              </RadioGroup>
            </div>
            <div>
              <Label htmlFor="close-comments">
                Comments {closeOption === "not-awarded" ? "*" : "(Optional)"}
              </Label>
              <Textarea
                id="close-comments"
                placeholder="Add closure comments..."
                value={closeComments}
                onChange={(e) => setCloseComments(e.target.value)}
                className="mt-2"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCloseSheet(false)}>
              Cancel
            </Button>
            <Button onClick={handleClose} className="bg-[#3E2C80] hover:bg-[#2F2060]">
              Close RFQ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Action History Sheet */}
      <Sheet open={showActionHistorySheet} onOpenChange={setShowActionHistorySheet}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto px-6">
          <SheetHeader className="pb-6">
            <div className="flex items-start justify-between">
              <div>
                <SheetTitle>Action History</SheetTitle>
                <SheetDescription>
                  Complete timeline of all actions performed on RFQ #{rfqId}
                </SheetDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 bg-transparent border-[#3B2D7B] text-[#3B2D7B] hover:bg-[#3B2D7B] hover:text-white transition-colors"
                onClick={() => {
                  console.log("[v0] Downloading action history for RFQ", rfqId)
                  // Handle download logic here
                }}
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
          </SheetHeader>
          
          {/* Segmented Control */}
          <div className="mb-6 flex items-center justify-center">
            <div className="inline-flex items-center rounded-lg bg-gray-100 p-1">
              <button
                type="button"
                onClick={() => setActionHistoryView("timeline")}
                className={`flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold transition-all ${
                  actionHistoryView === "timeline"
                    ? "bg-[#3B2D7B] text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <List className="h-4 w-4" />
                Timeline
              </button>
              <button
                type="button"
                onClick={() => setActionHistoryView("table")}
                className={`flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold transition-all ${
                  actionHistoryView === "table"
                    ? "bg-[#3B2D7B] text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Table2 className="h-4 w-4" />
                Table
              </button>
            </div>
          </div>

          <div className="space-y-6 pr-2">
            {actionHistoryView === "timeline" ? (
              /* Timeline View */
              <div className="relative space-y-8 pl-2">
                {/* Timeline Item 1 - Created */}
                <div className="relative flex gap-4 pb-8 border-l-2 border-gray-200">
                  <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-blue-500 ring-4 ring-white" />
                  <div className="ml-6 flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-sm text-gray-900">RFQ Created</h4>
                        <p className="text-xs text-gray-500 mt-1">Created by John Smith</p>
                      </div>
                      <time className="text-xs text-gray-500">Jan 15, 2025</time>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      RFQ #144108 was created for Office Supplies procurement
                    </p>
                  </div>
                </div>

                {/* Timeline Item 2 - Published */}
                <div className="relative flex gap-4 pb-8 border-l-2 border-gray-200">
                  <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-green-500 ring-4 ring-white" />
                  <div className="ml-6 flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-sm text-gray-900">RFQ Published</h4>
                        <p className="text-xs text-gray-500 mt-1">Published by Sarah Johnson</p>
                      </div>
                      <time className="text-xs text-gray-500">Jan 16, 2025</time>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      RFQ was published and sent to 5 suppliers
                    </p>
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs font-medium text-gray-700 mb-1">Suppliers notified:</p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        <li>• Supplier A Corp</li>
                        <li>• Supplier B Inc</li>
                        <li>• Supplier C Ltd</li>
                        <li>• Supplier D Group</li>
                        <li>• Supplier E Partners</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Timeline Item 3 - Forwarded */}
                <div className="relative flex gap-4 pb-8 border-l-2 border-gray-200">
                  <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-purple-500 ring-4 ring-white" />
                  <div className="ml-6 flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-sm text-gray-900">RFQ Forwarded</h4>
                        <p className="text-xs text-gray-500 mt-1">Forwarded by Mike Chen</p>
                      </div>
                      <time className="text-xs text-gray-500">Jan 18, 2025</time>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      Forwarded to procurement manager for review
                    </p>
                    <div className="mt-2 text-xs text-gray-500">
                      Recipient: david.wilson@company.com
                    </div>
                  </div>
                </div>

                {/* Timeline Item 4 - Clarification */}
                <div className="relative flex gap-4 pb-8 border-l-2 border-gray-200">
                  <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-amber-500 ring-4 ring-white" />
                  <div className="ml-6 flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-sm text-gray-900">Clarification Requested</h4>
                        <p className="text-xs text-gray-500 mt-1">Requested by David Wilson</p>
                      </div>
                      <time className="text-xs text-gray-500">Jan 20, 2025</time>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      Clarification requested from Supplier A Corp regarding pricing structure
                    </p>
                    <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                      <p className="text-xs text-gray-700">
                        "Please provide a detailed breakdown of the unit costs and any volume discounts applicable."
                      </p>
                    </div>
                  </div>
                </div>

                {/* Timeline Item 5 - Extended */}
                <div className="relative flex gap-4 pb-8 border-l-2 border-gray-200">
                  <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-orange-500 ring-4 ring-white" />
                  <div className="ml-6 flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-sm text-gray-900">Deadline Extended</h4>
                        <p className="text-xs text-gray-500 mt-1">Extended by Sarah Johnson</p>
                      </div>
                      <time className="text-xs text-gray-500">Jan 22, 2025</time>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      Submission deadline extended by 5 days
                    </p>
                    <div className="mt-2 space-y-1">
                      <p className="text-xs text-gray-500">
                        <span className="font-medium">Previous deadline:</span> Jan 25, 2025
                      </p>
                      <p className="text-xs text-gray-500">
                        <span className="font-medium">New deadline:</span> Jan 30, 2025
                      </p>
                    </div>
                  </div>
                </div>

                {/* Timeline Item 6 - Under Review */}
                <div className="relative flex gap-4 pb-8 border-l-2 border-gray-200">
                  <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-indigo-500 ring-4 ring-white" />
                  <div className="ml-6 flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-sm text-gray-900">Under Review</h4>
                        <p className="text-xs text-gray-500 mt-1">Updated by Procurement Team</p>
                      </div>
                      <time className="text-xs text-gray-500">Jan 31, 2025</time>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      All submissions received and under evaluation
                    </p>
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <div className="p-2 bg-gray-50 rounded text-center">
                        <p className="text-xl font-bold text-gray-900">3</p>
                        <p className="text-xs text-gray-500">Responses</p>
                      </div>
                      <div className="p-2 bg-gray-50 rounded text-center">
                        <p className="text-xl font-bold text-gray-900">2</p>
                        <p className="text-xs text-gray-500">Pending</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline Item 7 - Current Status */}
                <div className="relative flex gap-4">
                  <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-gray-300 ring-4 ring-white" />
                  <div className="ml-6 flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-sm text-gray-900">Current Status</h4>
                        <p className="text-xs text-gray-500 mt-1">In Progress</p>
                      </div>
                      <time className="text-xs text-gray-500">Now</time>
                    </div>
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-xs font-medium text-blue-900">
                        Awaiting final evaluation and approval
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Table View */
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Action
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Details
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                        Jan 15, 2025
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                          <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                          Created
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-900">John Smith</td>
                      <td className="px-4 py-3 text-xs text-gray-600">
                        RFQ #144108 was created for Office Supplies procurement
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                        Jan 16, 2025
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                          Published
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-900">Sarah Johnson</td>
                      <td className="px-4 py-3 text-xs text-gray-600">
                        RFQ was published and sent to 5 suppliers
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                        Jan 18, 2025
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                          <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                          Forwarded
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-900">Mike Chen</td>
                      <td className="px-4 py-3 text-xs text-gray-600">
                        Forwarded to procurement manager for review
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                        Jan 20, 2025
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                          <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                          Clarification
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-900">David Wilson</td>
                      <td className="px-4 py-3 text-xs text-gray-600">
                        Clarification requested from Supplier A Corp
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                        Jan 22, 2025
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                          <div className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                          Extended
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-900">Sarah Johnson</td>
                      <td className="px-4 py-3 text-xs text-gray-600">
                        Submission deadline extended by 5 days
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                        Jan 31, 2025
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
                          <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                          Under Review
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-900">Procurement Team</td>
                      <td className="px-4 py-3 text-xs text-gray-600">
                        All submissions received and under evaluation
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                        Now
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                          <div className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                          In Progress
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-900">-</td>
                      <td className="px-4 py-3 text-xs text-gray-600">
                        Awaiting final evaluation and approval
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
