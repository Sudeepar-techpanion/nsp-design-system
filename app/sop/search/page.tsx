"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Search as SearchIcon,
  Save,
  Star,
  FileText,
  ClipboardList,
  FileX,
  Users,
  Eye,
  MoreHorizontal,
  CheckCircle,
  ArrowUpDown,
  Calendar as CalendarIcon,
  Search,
  X, // Declaring the X variable
} from "lucide-react"

interface SearchResult {
  id: string
  taskId: string
  docId: string
  type: "INV" | "RFQ" | "NFA" | "VND"
  stage: string
  value: string | null
  companyCode: string
  vendorCode: string
  vendorName: string
  category: "Material" | "Service" | null
  assignedDate: string
  status: "red" | "orange" | "green" | "blue"
  statusAction: "check" | "sync" | "alert"
}

const mockResults: SearchResult[] = [
  {
    id: "1",
    taskId: "T001",
    docId: "603076",
    type: "INV",
    stage: "Approval - 2/3",
    value: "₹45,000",
    companyCode: "9000",
    vendorCode: "0000083733",
    vendorName: "Jindal Steel",
    category: "Material",
    assignedDate: "17-01-2025",
    status: "red",
    statusAction: "check",
  },
  {
    id: "2",
    taskId: "T002",
    docId: "144108",
    type: "RFQ",
    stage: "Review - 1/2",
    value: "₹2,50,000",
    companyCode: "9000",
    vendorCode: "0000084521",
    vendorName: "Tech Solutions",
    category: "Service",
    assignedDate: "18-01-2025",
    status: "red",
    statusAction: "sync",
  },
  {
    id: "3",
    taskId: "T008",
    docId: "51696",
    type: "NFA",
    stage: "Approval - L3",
    value: "₹3,50,000",
    companyCode: "9000",
    vendorCode: "0000087345",
    vendorName: "Heavy Machinery",
    category: "Service",
    assignedDate: "17-01-2025",
    status: "red",
    statusAction: "check",
  },
  {
    id: "4",
    taskId: "T009",
    docId: "51697",
    type: "VND",
    stage: "Compliance",
    value: null,
    companyCode: "9000",
    vendorCode: "0000084456",
    vendorName: "Prime Supplies",
    category: null,
    assignedDate: "18-01-2025",
    status: "red",
    statusAction: "sync",
  },
  {
    id: "5",
    taskId: "T011",
    docId: "51699",
    type: "RFQ",
    stage: "Escalated",
    value: "₹8,00,000",
    companyCode: "9000",
    vendorCode: "0000089567",
    vendorName: "Heavy Industries",
    category: "Service",
    assignedDate: "16-01-2025",
    status: "red",
    statusAction: "alert",
  },
  {
    id: "6",
    taskId: "T003",
    docId: "144107",
    type: "NFA",
    stage: "Approval - L2",
    value: "₹1,20,000",
    companyCode: "9000",
    vendorCode: "0000073507",
    vendorName: "Logistics Pro",
    category: "Material",
    assignedDate: "16-01-2025",
    status: "orange",
    statusAction: "check",
  },
  {
    id: "7",
    taskId: "T004",
    docId: "51692",
    type: "INV",
    stage: "Resolution",
    value: "₹78,500",
    companyCode: "9000",
    vendorCode: "0000922779",
    vendorName: "Power Corp",
    category: "Material",
    assignedDate: "15-01-2025",
    status: "orange",
    statusAction: "alert",
  },
  {
    id: "8",
    taskId: "T010",
    docId: "51698",
    type: "INV",
    stage: "Approval - 1/3",
    value: "₹95,000",
    companyCode: "9000",
    vendorCode: "0000073507",
    vendorName: "Logistics Pro",
    category: "Material",
    assignedDate: "12-01-2025",
    status: "orange",
    statusAction: "check",
  },
  {
    id: "9",
    taskId: "T005",
    docId: "51693",
    type: "VND",
    stage: "Doc Review",
    value: null,
    companyCode: "9000",
    vendorCode: "0000085123",
    vendorName: "New Vendor Inc.",
    category: null,
    assignedDate: "14-01-2025",
    status: "blue",
    statusAction: "sync",
  },
  {
    id: "10",
    taskId: "T006",
    docId: "51694",
    type: "RFQ",
    stage: "Review - 2/2",
    value: "₹5,00,000",
    companyCode: "9000",
    vendorCode: "0000086234",
    vendorName: "Global Parts Ltd",
    category: "Material",
    assignedDate: "13-01-2025",
    status: "blue",
    statusAction: "sync",
  },
  {
    id: "11",
    taskId: "T007",
    docId: "51695",
    type: "INV",
    stage: "Complete",
    value: "₹32,000",
    companyCode: "9000",
    vendorCode: "0000063359",
    vendorName: "Steel Works",
    category: "Material",
    assignedDate: "10-01-2025",
    status: "green",
    statusAction: "check",
  },
]

const typeIcons = {
  INV: { icon: FileText, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
  RFQ: { icon: ClipboardList, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
  NFA: { icon: FileX, color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200" },
  VND: { icon: Users, color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-200" },
}

const statusColors = {
  red: "bg-red-500",
  orange: "bg-orange-500",
  green: "bg-emerald-500",
  blue: "bg-blue-500",
}

const actionColors = {
  check: "bg-emerald-500 hover:bg-emerald-600",
  sync: "bg-blue-500 hover:bg-blue-600",
  alert: "bg-orange-500 hover:bg-orange-600",
}

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [documentType, setDocumentType] = useState("all")
  const [dateRange, setDateRange] = useState("")
  const [status, setStatus] = useState("all")
  const [vendor, setVendor] = useState("")
  const [selectedTab, setSelectedTab] = useState("user")

  const handleSearch = () => {
    console.log("[v0] Search query:", { searchQuery, documentType, dateRange, status, vendor })
  }

  const handleClear = () => {
    setSearchQuery("")
    setDocumentType("all")
    setDateRange("")
    setStatus("all")
    setVendor("")
    console.log("[v0] Cleared all filters")
  }

  const handleSaveSearch = () => {
    console.log("[v0] Saving search")
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gray-50">
        <AppSidebar />
        <main className="flex-1 overflow-auto bg-white">
          <Header />
          <div className="p-6">
            {/* Tabs */}
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="user">User Search</TabsTrigger>
                <TabsTrigger value="auditor">Auditor Search</TabsTrigger>
              </TabsList>

              <TabsContent value="user" className="space-y-6">
                {/* Saved Searches */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="h-4 w-4 text-gray-600" />
                    <Label className="text-sm font-semibold text-gray-700">Saved Searches</Label>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" className="rounded-full bg-transparent">
                      Vendor Onboarding 2024
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-full bg-transparent">
                      Recent Invoice Approvals
                    </Button>
                  </div>
                </div>

                {/* Search Bar with Action Buttons */}
                <div className="flex gap-3 items-center">
                  <Input
                    type="text"
                    placeholder="Search by vendor name, invoice number, document type..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 h-12"
                  />
                  <Button
                    onClick={handleSearch}
                    className="h-12 px-6 bg-[#3B2D7B] hover:bg-[#2f2461] text-white"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleSaveSearch}
                    className="h-12 px-6 bg-transparent"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleClear}
                    className="h-12 px-6 bg-transparent"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                  <div className="space-y-2">
                    <Label htmlFor="document-type" className="text-sm font-medium text-gray-700">
                      Document Type
                    </Label>
                    <Select value={documentType} onValueChange={setDocumentType}>
                      <SelectTrigger id="document-type" className="bg-white w-full">
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="invoice">Invoice</SelectItem>
                        <SelectItem value="rfq">RFQ</SelectItem>
                        <SelectItem value="nfa">NFA</SelectItem>
                        <SelectItem value="vendor">Vendor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date-range" className="text-sm font-medium text-gray-700">
                      Date Range
                    </Label>
                    <div className="relative">
                      <Input
                        id="date-range"
                        type="text"
                        placeholder="mm / dd / yyyy"
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="bg-white w-full"
                      />
                      <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-sm font-medium text-gray-700">
                      Status
                    </Label>
                    <Select value={status} onValueChange={setStatus}>
                      <SelectTrigger id="status" className="bg-white w-full">
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                        <SelectItem value="review">Under Review</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vendor" className="text-sm font-medium text-gray-700">
                      Vendor
                    </Label>
                    <Input
                      id="vendor"
                      type="text"
                      placeholder="Vendor name"
                      value={vendor}
                      onChange={(e) => setVendor(e.target.value)}
                      className="bg-white w-full"
                    />
                  </div>
                </div>

                {/* Frozen Columns Notice */}
                <div className="flex items-center gap-2 text-sm text-gray-600 border-t pt-4">
                  <ArrowUpDown className="h-4 w-4" />
                  <span className="font-medium">4 columns frozen</span>
                  <span className="text-gray-400">|</span>
                  <span>Scroll horizontally to see more columns</span>
                </div>

                {/* Results Table */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="px-4 py-3 text-left">
                            <Checkbox />
                          </th>
                          <th className="px-4 py-3 text-left">
                            <div className="flex items-center gap-1">
                              <ArrowUpDown className="h-3 w-3" />
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left">
                            <div className="flex items-center gap-1 font-semibold text-gray-700">
                              Task ID
                              <ArrowUpDown className="h-3 w-3" />
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left">
                            <div className="flex items-center gap-1 font-semibold text-gray-700">
                              Doc ID
                              <ArrowUpDown className="h-3 w-3" />
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left">
                            <div className="flex items-center gap-1 font-semibold text-gray-700">
                              Type
                              <ArrowUpDown className="h-3 w-3" />
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left">
                            <div className="flex items-center gap-1 font-semibold text-gray-700">
                              Stage
                              <ArrowUpDown className="h-3 w-3" />
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left">
                            <div className="flex items-center gap-1 font-semibold text-gray-700">
                              Value
                              <ArrowUpDown className="h-3 w-3" />
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left">
                            <div className="flex items-center gap-1 font-semibold text-gray-700">
                              Co. Code
                              <ArrowUpDown className="h-3 w-3" />
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left">
                            <div className="flex items-center gap-1 font-semibold text-gray-700">
                              Vendor Code
                              <ArrowUpDown className="h-3 w-3" />
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left">
                            <div className="flex items-center gap-1 font-semibold text-gray-700">
                              Vendor Name
                              <ArrowUpDown className="h-3 w-3" />
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left">
                            <div className="flex items-center gap-1 font-semibold text-gray-700">
                              Type
                              <ArrowUpDown className="h-3 w-3" />
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left">
                            <div className="flex items-center gap-1 font-semibold text-gray-700">
                              Assigned Date
                              <ArrowUpDown className="h-3 w-3" />
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {mockResults.map((result) => {
                          const TypeIcon = typeIcons[result.type].icon
                          return (
                            <tr key={result.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3">
                                <Checkbox />
                              </td>
                              <td className="px-4 py-3">
                                <div className={`h-2 w-2 rounded-full ${statusColors[result.status]}`} />
                              </td>
                              <td className="px-4 py-3 font-medium text-gray-900">{result.taskId}</td>
                              <td className="px-4 py-3 text-gray-900">{result.docId}</td>
                              <td className="px-4 py-3">
                                <div
                                  className={`inline-flex items-center gap-1.5 px-2 py-1 rounded border ${typeIcons[result.type].bg} ${typeIcons[result.type].border}`}
                                >
                                  <TypeIcon className={`h-3.5 w-3.5 ${typeIcons[result.type].color}`} />
                                  <span className={`text-xs font-semibold ${typeIcons[result.type].color}`}>
                                    {result.type}
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-gray-700">{result.stage}</td>
                              <td className="px-4 py-3 font-medium text-gray-900">{result.value || "—"}</td>
                              <td className="px-4 py-3 text-gray-700">{result.companyCode}</td>
                              <td className="px-4 py-3 text-gray-600 text-xs">{result.vendorCode}</td>
                              <td className="px-4 py-3 text-gray-900">{result.vendorName}</td>
                              <td className="px-4 py-3">
                                {result.category ? (
                                  <span
                                    className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                                      result.category === "Material"
                                        ? "bg-blue-100 text-blue-700"
                                        : "bg-purple-100 text-purple-700"
                                    }`}
                                  >
                                    {result.category}
                                  </span>
                                ) : (
                                  <span className="text-gray-400">-</span>
                                )}
                              </td>
                              <td className="px-4 py-3 text-gray-700 text-xs">
                                <div className="flex items-center gap-1">
                                  <CalendarIcon className="h-3 w-3" />
                                  {result.assignedDate}
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <Button
                                    size="sm"
                                    className={`h-8 w-8 p-0 rounded-full ${actionColors[result.statusAction]} text-white`}
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 w-8 p-0 hover:bg-gray-100 bg-transparent"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 w-8 p-0 hover:bg-gray-100 bg-transparent"
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Showing 12 of 12 tasks</span>
                  <span>Sorted by urgency and impact</span>
                </div>
              </TabsContent>

              <TabsContent value="auditor" className="space-y-6">
                <div className="text-center py-12 text-gray-500">
                  <SearchIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-lg font-medium">Auditor Search</p>
                  <p className="text-sm mt-1">Advanced search functionality for auditors coming soon</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
