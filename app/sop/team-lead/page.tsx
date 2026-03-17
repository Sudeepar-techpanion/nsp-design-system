"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ArrowUpDown,
  Search as SearchIcon,
  Filter,
  Columns3,
  Eye,
  MoreHorizontal,
  CheckCircle,
  RotateCw,
  AlertCircle,
  FileText,
  ClipboardList,
  FileSignature,
  Users,
} from "lucide-react"

interface TaskData {
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

const mockTasks: TaskData[] = [
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
    vendorCode: "0000088456",
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
  NFA: { icon: FileSignature, color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200" },
  VND: { icon: Users, color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-200" },
}

const statusColors = {
  red: "bg-red-500",
  orange: "bg-orange-500",
  blue: "bg-blue-500",
  green: "bg-green-500",
}

const actionColors = {
  check: "bg-green-500 hover:bg-green-600",
  sync: "bg-blue-500 hover:bg-blue-600",
  alert: "bg-orange-500 hover:bg-orange-600",
}

const ActionIcon = ({ action }: { action: "check" | "sync" | "alert" }) => {
  if (action === "check") return <CheckCircle className="h-4 w-4" />
  if (action === "sync") return <RotateCw className="h-4 w-4" />
  return <AlertCircle className="h-4 w-4" />
}

export default function TeamLeadPage() {
  const [processFilter, setProcessFilter] = useState("all")
  const [subTaskFilter, setSubTaskFilter] = useState("all")
  const [stageFilter, setStageFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [itemsFilter, setItemsFilter] = useState("all")

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gray-50">
        <Sidebar />
        <main className="flex-1 overflow-auto bg-white">
          <Header />
          <div className="p-6">
            <div className="space-y-6">
              {/* Page Header */}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Team Lead Dashboard</h1>
                <p className="text-sm text-gray-600 mt-1">Manage and monitor team tasks and approvals</p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3">
                <Select value={processFilter} onValueChange={setProcessFilter}>
                  <SelectTrigger className="w-[180px] bg-white">
                    <SelectValue placeholder="All Process (12)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Process (12)</SelectItem>
                    <SelectItem value="approval">Approval Process</SelectItem>
                    <SelectItem value="review">Review Process</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={subTaskFilter} onValueChange={setSubTaskFilter}>
                  <SelectTrigger className="w-[200px] bg-white">
                    <SelectValue placeholder="All Sub task process" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sub task process</SelectItem>
                    <SelectItem value="l1">Level 1</SelectItem>
                    <SelectItem value="l2">Level 2</SelectItem>
                    <SelectItem value="l3">Level 3</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={stageFilter} onValueChange={setStageFilter}>
                  <SelectTrigger className="w-[180px] bg-white">
                    <SelectValue placeholder="All Stages (12)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stages (12)</SelectItem>
                    <SelectItem value="approval">Approval</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="compliance">Compliance</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px] bg-white">
                    <SelectValue placeholder="All Status (12)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status (12)</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="complete">Complete</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={itemsFilter} onValueChange={setItemsFilter}>
                  <SelectTrigger className="w-[160px] bg-white">
                    <SelectValue placeholder="All Items" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Items</SelectItem>
                    <SelectItem value="invoice">Invoice</SelectItem>
                    <SelectItem value="rfq">RFQ</SelectItem>
                    <SelectItem value="vendor">Vendor</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" className="bg-white">
                  <Filter className="h-4 w-4 mr-2" />
                  More Filters
                </Button>

                <Button variant="outline" className="bg-white ml-auto">
                  <Columns3 className="h-4 w-4 mr-2" />
                  Columns
                  <span className="ml-2 text-xs text-gray-500">4 frozen</span>
                </Button>
              </div>

              {/* Frozen Columns Notice */}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <ArrowUpDown className="h-4 w-4" />
                <span className="font-medium">4 columns frozen</span>
                <span className="text-gray-400">|</span>
                <span>Scroll horizontally to see more columns</span>
              </div>

              {/* Table */}
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
                            <SearchIcon className="h-3 w-3 text-gray-400" />
                          </div>
                        </th>
                        <th className="px-4 py-3 text-left">
                          <div className="flex items-center gap-1 font-semibold text-gray-700">
                            Doc ID
                            <ArrowUpDown className="h-3 w-3" />
                            <SearchIcon className="h-3 w-3 text-gray-400" />
                          </div>
                        </th>
                        <th className="px-4 py-3 text-left">
                          <div className="flex items-center gap-1 font-semibold text-gray-700">
                            Type
                            <ArrowUpDown className="h-3 w-3" />
                            <SearchIcon className="h-3 w-3 text-gray-400" />
                          </div>
                        </th>
                        <th className="px-4 py-3 text-left">
                          <div className="flex items-center gap-1 font-semibold text-gray-700">
                            Stage
                            <ArrowUpDown className="h-3 w-3" />
                            <SearchIcon className="h-3 w-3 text-gray-400" />
                          </div>
                        </th>
                        <th className="px-4 py-3 text-left">
                          <div className="flex items-center gap-1 font-semibold text-gray-700">
                            Value
                            <ArrowUpDown className="h-3 w-3" />
                            <SearchIcon className="h-3 w-3 text-gray-400" />
                          </div>
                        </th>
                        <th className="px-4 py-3 text-left">
                          <div className="flex items-center gap-1 font-semibold text-gray-700">
                            Co.
                            <ArrowUpDown className="h-3 w-3" />
                            <SearchIcon className="h-3 w-3 text-gray-400" />
                          </div>
                        </th>
                        <th className="px-4 py-3 text-left">
                          <div className="flex items-center gap-1 font-semibold text-gray-700">
                            Vendor Code
                            <ArrowUpDown className="h-3 w-3" />
                            <SearchIcon className="h-3 w-3 text-gray-400" />
                          </div>
                        </th>
                        <th className="px-4 py-3 text-left">
                          <div className="flex items-center gap-1 font-semibold text-gray-700">
                            Vendor Name
                            <ArrowUpDown className="h-3 w-3" />
                            <SearchIcon className="h-3 w-3 text-gray-400" />
                          </div>
                        </th>
                        <th className="px-4 py-3 text-left">
                          <div className="flex items-center gap-1 font-semibold text-gray-700">
                            Type
                            <ArrowUpDown className="h-3 w-3" />
                            <SearchIcon className="h-3 w-3 text-gray-400" />
                          </div>
                        </th>
                        <th className="px-4 py-3 text-left">
                          <div className="flex items-center gap-1 font-semibold text-gray-700">
                            Assigned Date
                            <ArrowUpDown className="h-3 w-3" />
                            <SearchIcon className="h-3 w-3 text-gray-400" />
                          </div>
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {mockTasks.map((task) => {
                        const TypeIcon = typeIcons[task.type].icon
                        return (
                          <tr key={task.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <Checkbox />
                            </td>
                            <td className="px-4 py-3">
                              <div className={`h-2 w-2 rounded-full ${statusColors[task.status]}`} />
                            </td>
                            <td className="px-4 py-3">
                              <span className="font-medium text-blue-600">{task.taskId}</span>
                            </td>
                            <td className="px-4 py-3 text-gray-900">{task.docId}</td>
                            <td className="px-4 py-3">
                              <div
                                className={`inline-flex items-center gap-1.5 px-2 py-1 rounded border ${typeIcons[task.type].bg} ${typeIcons[task.type].border}`}
                              >
                                <TypeIcon className={`h-3.5 w-3.5 ${typeIcons[task.type].color}`} />
                                <span className={`text-xs font-medium ${typeIcons[task.type].color}`}>
                                  {task.type}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-gray-700">{task.stage}</td>
                            <td className="px-4 py-3 font-medium text-gray-900">
                              {task.value || "—"}
                            </td>
                            <td className="px-4 py-3 text-gray-700">{task.companyCode}</td>
                            <td className="px-4 py-3 text-gray-700 font-mono text-xs">{task.vendorCode}</td>
                            <td className="px-4 py-3 text-gray-900">{task.vendorName}</td>
                            <td className="px-4 py-3">
                              {task.category ? (
                                <span
                                  className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                                    task.category === "Material"
                                      ? "bg-blue-100 text-blue-700"
                                      : "bg-purple-100 text-purple-700"
                                  }`}
                                >
                                  {task.category}
                                </span>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-gray-700 text-xs">
                              <div className="flex items-center gap-1">
                                <span>📅</span>
                                {task.assignedDate}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  className={`h-8 w-8 p-0 rounded-full ${actionColors[task.statusAction]} text-white`}
                                >
                                  <ActionIcon action={task.statusAction} />
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
                <span>Showing {mockTasks.length} of {mockTasks.length} tasks</span>
                <span>Sorted by urgency and impact</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
