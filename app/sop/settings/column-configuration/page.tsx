"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react"

const columnData = [
  { id: 1, title: "PO Number", dataType: "STRING", viewFor: "Purchase Order", filterable: true, sortable: false },
  { id: 2, title: "Invoice Number", dataType: "STRING", viewFor: "Purchase Order", filterable: true, sortable: false },
  { id: 3, title: "Location", dataType: "STRING", viewFor: "Purchase Order", filterable: true, sortable: false },
  { id: 4, title: "Document Type", dataType: "STRING", viewFor: "Purchase Order", filterable: true, sortable: false },
  { id: 5, title: "Company Code", dataType: "STRING", viewFor: "Purchase Order", filterable: true, sortable: false },
  { id: 6, title: "Company Code", dataType: "STRING", viewFor: "Purchase Order", filterable: true, sortable: false },
]

export default function ColumnConfigurationPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedUser, setSelectedUser] = useState("user")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    apiFieldName: "",
    dataType: "",
    viewFor: "",
    width: "",
    sequence: "",
    operator: "",
    isSortable: false,
    isFilterable: false,
    forReport: false,
  })
  const totalPages = 5

  const handleFormChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleCreate = () => {
    // Handle form submission
    console.log("Creating column:", formData)
    setIsModalOpen(false)
    // Reset form
    setFormData({
      title: "",
      apiFieldName: "",
      dataType: "",
      viewFor: "",
      width: "",
      sequence: "",
      operator: "",
      isSortable: false,
      isFilterable: false,
      forReport: false,
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/sop/settings" className="hover:text-foreground transition-colors">
            Settings
          </Link>
          <span>/</span>
          <span className="text-foreground">Column Configuration</span>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-lg border border-border p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-lg font-semibold text-foreground">Column Configuration</h1>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={() => setIsModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Column
            </Button>
          </div>

          {/* User Select */}
          <div className="mb-6">
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger className="w-[200px] border-0 border-b border-border rounded-none bg-transparent focus:ring-0">
                <SelectValue placeholder="Select user type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="font-semibold text-foreground w-[120px]">User Id</TableHead>
                  <TableHead className="font-semibold text-foreground">Title</TableHead>
                  <TableHead className="font-semibold text-foreground">Data Type</TableHead>
                  <TableHead className="font-semibold text-foreground">View For</TableHead>
                  <TableHead className="font-semibold text-foreground">Filterable</TableHead>
                  <TableHead className="font-semibold text-foreground">Sortable</TableHead>
                  <TableHead className="font-semibold text-foreground text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {columnData.map((row) => (
                  <TableRow key={row.id} className="border-b">
                    <TableCell className="text-muted-foreground">{row.id}</TableCell>
                    <TableCell className="font-medium">{row.title}</TableCell>
                    <TableCell className="text-muted-foreground">{row.dataType}</TableCell>
                    <TableCell className="text-muted-foreground">{row.viewFor}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-green-500" />
                        <span className="text-sm">Enable</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted text-sm">
                        <span className="h-2 w-2 rounded-full bg-gray-400" />
                        Disabled
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-purple-600 hover:text-purple-700 hover:bg-purple-50">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-end gap-1 mt-6">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {[1, 2, 3, 4, 5].map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "outline" : "ghost"}
                size="icon"
                className={`h-8 w-8 ${currentPage === page ? "border-purple-600 text-purple-600" : ""}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Add New Column Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Column</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            {/* Title */}
            <div className="grid grid-cols-[140px_1fr] items-center gap-4">
              <Label htmlFor="title" className="text-right">
                <span className="text-red-500">*</span> Title :
              </Label>
              <Input
                id="title"
                placeholder="Title"
                value={formData.title}
                onChange={(e) => handleFormChange("title", e.target.value)}
              />
            </div>

            {/* API Field Name */}
            <div className="grid grid-cols-[140px_1fr] items-center gap-4">
              <Label htmlFor="apiFieldName" className="text-right">
                <span className="text-red-500">*</span> API Field Name :
              </Label>
              <Input
                id="apiFieldName"
                placeholder="API Field Name"
                value={formData.apiFieldName}
                onChange={(e) => handleFormChange("apiFieldName", e.target.value)}
              />
            </div>

            {/* Data Type */}
            <div className="grid grid-cols-[140px_1fr] items-center gap-4">
              <Label htmlFor="dataType" className="text-right">
                Data Type :
              </Label>
              <Select value={formData.dataType} onValueChange={(value) => handleFormChange("dataType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Data Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="STRING">STRING</SelectItem>
                  <SelectItem value="NUMBER">NUMBER</SelectItem>
                  <SelectItem value="DATE">DATE</SelectItem>
                  <SelectItem value="BOOLEAN">BOOLEAN</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* View For */}
            <div className="grid grid-cols-[140px_1fr] items-center gap-4">
              <Label htmlFor="viewFor" className="text-right">
                <span className="text-red-500">*</span> View For :
              </Label>
              <Select value={formData.viewFor} onValueChange={(value) => handleFormChange("viewFor", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Purchase Order">Purchase Order</SelectItem>
                  <SelectItem value="Invoice">Invoice</SelectItem>
                  <SelectItem value="Vendor">Vendor</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Width */}
            <div className="grid grid-cols-[140px_1fr] items-center gap-4">
              <Label htmlFor="width" className="text-right">
                Width :
              </Label>
              <Input
                id="width"
                placeholder="Width"
                value={formData.width}
                onChange={(e) => handleFormChange("width", e.target.value)}
              />
            </div>

            {/* Sequence */}
            <div className="grid grid-cols-[140px_1fr] items-center gap-4">
              <Label htmlFor="sequence" className="text-right">
                Sequence :
              </Label>
              <Input
                id="sequence"
                placeholder="Sequence"
                value={formData.sequence}
                onChange={(e) => handleFormChange("sequence", e.target.value)}
              />
            </div>

            {/* Operator */}
            <div className="grid grid-cols-[140px_1fr] items-center gap-4">
              <Label htmlFor="operator" className="text-right">
                Operator :
              </Label>
              <Input
                id="operator"
                placeholder="Operator"
                value={formData.operator}
                onChange={(e) => handleFormChange("operator", e.target.value)}
              />
            </div>

            {/* Toggle Switches */}
            <div className="grid grid-cols-[140px_1fr] items-center gap-4">
              <Label className="text-right">Is Sortable</Label>
              <Switch
                checked={formData.isSortable}
                onCheckedChange={(checked) => handleFormChange("isSortable", checked)}
              />
            </div>

            <div className="grid grid-cols-[140px_1fr] items-center gap-4">
              <Label className="text-right">Is Filterable</Label>
              <Switch
                checked={formData.isFilterable}
                onCheckedChange={(checked) => handleFormChange("isFilterable", checked)}
              />
            </div>

            <div className="grid grid-cols-[140px_1fr] items-center gap-4">
              <Label className="text-right">For Report</Label>
              <Switch
                checked={formData.forReport}
                onCheckedChange={(checked) => handleFormChange("forReport", checked)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)} className="bg-transparent">
              Cancel
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={handleCreate}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
