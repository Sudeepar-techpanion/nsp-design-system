"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { StatusBadge } from "@/components/status-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Plus,
  Calendar,
  Clock,
  Upload,
  Download,
  FileSpreadsheet,
  Trash2,
  Edit,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Search,
  Info,
  Headphones,
  Mail,
  MessageSquare,
  Phone,
  UserCheck,
  RefreshCw,
} from "lucide-react"

// Mock data for entities and locations
const entities = [
  { id: "ENT001", name: "Danone India Pvt Ltd", company: "Danone Dev" },
  { id: "ENT002", name: "Danone North America Inc.", company: "Danone Dev" },
  { id: "ENT003", name: "Danone France SA", company: "Danone Dev" },
]

const locations: Record<string, Array<{ id: string; name: string; timezone: string }>> = {
  ENT001: [
    { id: "LOC001", name: "Mumbai HQ", timezone: "Asia/Kolkata" },
    { id: "LOC002", name: "Delhi Office", timezone: "Asia/Kolkata" },
    { id: "LOC003", name: "Bangalore Plant", timezone: "Asia/Kolkata" },
  ],
  ENT002: [
    { id: "LOC004", name: "New York HQ", timezone: "America/New_York" },
    { id: "LOC005", name: "Chicago Office", timezone: "America/Chicago" },
  ],
  ENT003: [
    { id: "LOC006", name: "Paris HQ", timezone: "Europe/Paris" },
    { id: "LOC007", name: "Lyon Plant", timezone: "Europe/Paris" },
  ],
}

const calendars = [
  {
    id: "CAL001",
    name: "Mumbai HQ Calendar",
    company: "Danone Dev",
    entity: "Danone India Pvt Ltd",
    entityId: "ENT001",
    location: "Mumbai HQ",
    locationId: "LOC001",
    timezone: "Asia/Kolkata",
    workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    startTime: "09:00",
    endTime: "18:00",
    breakDuration: 60,
    halfDayEnd: "13:00",
    holidays: 18,
    status: "Active",
    inUse: true,
  },
  {
    id: "CAL002",
    name: "New York HQ Calendar",
    company: "Danone Dev",
    entity: "Danone North America Inc.",
    entityId: "ENT002",
    location: "New York HQ",
    locationId: "LOC004",
    timezone: "America/New_York",
    workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    startTime: "09:00",
    endTime: "17:00",
    breakDuration: 60,
    halfDayEnd: "12:30",
    holidays: 12,
    status: "Active",
    inUse: true,
  },
  {
    id: "CAL003",
    name: "Paris HQ Calendar",
    company: "Danone Dev",
    entity: "Danone France SA",
    entityId: "ENT003",
    location: "Paris HQ",
    locationId: "LOC006",
    timezone: "Europe/Paris",
    workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    startTime: "09:00",
    endTime: "18:00",
    breakDuration: 90,
    halfDayEnd: "13:00",
    holidays: 15,
    status: "Active",
    inUse: false,
  },
  {
    id: "CAL004",
    name: "Delhi Office Calendar",
    company: "Danone Dev",
    entity: "Danone India Pvt Ltd",
    entityId: "ENT001",
    location: "Delhi Office",
    locationId: "LOC002",
    timezone: "Asia/Kolkata",
    workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    startTime: "09:30",
    endTime: "18:30",
    breakDuration: 60,
    halfDayEnd: "13:30",
    holidays: 18,
    status: "Inactive",
    inUse: false,
  },
]

const holidays = [
  { id: "HOL001", date: "2026-01-26", name: "Republic Day", type: "Public", appliesTo: "All", calendarId: "CAL001" },
  { id: "HOL002", date: "2026-03-14", name: "Holi", type: "Public", appliesTo: "All", calendarId: "CAL001" },
  {
    id: "HOL003",
    date: "2026-08-15",
    name: "Independence Day",
    type: "Public",
    appliesTo: "All",
    calendarId: "CAL001",
  },
  { id: "HOL004", date: "2026-10-02", name: "Gandhi Jayanti", type: "Public", appliesTo: "All", calendarId: "CAL001" },
  { id: "HOL005", date: "2026-11-04", name: "Diwali", type: "Public", appliesTo: "All", calendarId: "CAL001" },
  { id: "HOL006", date: "2026-12-25", name: "Christmas", type: "Public", appliesTo: "All", calendarId: "CAL001" },
  { id: "HOL007", date: "2026-01-01", name: "New Year's Day", type: "Public", appliesTo: "All", calendarId: "CAL002" },
  {
    id: "HOL008",
    date: "2026-07-04",
    name: "Independence Day",
    type: "Public",
    appliesTo: "All",
    calendarId: "CAL002",
  },
  { id: "HOL009", date: "2026-11-26", name: "Thanksgiving", type: "Public", appliesTo: "All", calendarId: "CAL002" },
]

const uploadValidationResults = {
  total: 15,
  valid: 12,
  duplicates: 2,
  invalid: 1,
  errors: [
    { row: 5, field: "Holiday Date", error: "Date 2025-12-25 is in the past" },
    { row: 8, field: "Holiday Date", error: "Duplicate date - already exists" },
    { row: 12, field: "Holiday Date", error: "Duplicate date - already exists" },
  ],
}

const supportPlan = {
  planName: "Premium Support",
  coverage: "24×7",
  channels: {
    email: true,
    chat: true,
    phone: true,
    dedicatedManager: true,
  },
  slaResponseTime: "4 hours for critical issues, 24 hours for standard",
  startDate: "2025-01-01",
  endDate: "2026-12-31",
  status: "Active",
  managerName: "Sarah Johnson",
  managerEmail: "sarah.johnson@nimbles2p.com",
  lastUpdated: "2026-01-10T14:30:00Z",
}

export function CalendarContent() {
  const [activeTab, setActiveTab] = useState("master")
  const [selectedCalendar, setSelectedCalendar] = useState<string | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [showValidationResults, setShowValidationResults] = useState(false)
  const [searchValue, setSearchValue] = useState("")

  // Form state for new calendar
  const [selectedEntity, setSelectedEntity] = useState<string>("")
  const [selectedLocation, setSelectedLocation] = useState<string>("")
  const [workingDays, setWorkingDays] = useState<string[]>(["Mon", "Tue", "Wed", "Thu", "Fri"])

  const selectedCalendarData = calendars.find((c) => c.id === selectedCalendar)
  const availableLocations = selectedEntity ? locations[selectedEntity] || [] : []
  const selectedLocationData = availableLocations.find((l) => l.id === selectedLocation)

  const filteredCalendars = calendars.filter(
    (cal) =>
      cal.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      cal.entity.toLowerCase().includes(searchValue.toLowerCase()) ||
      cal.location.toLowerCase().includes(searchValue.toLowerCase()),
  )

  const calendarHolidays = selectedCalendar ? holidays.filter((h) => h.calendarId === selectedCalendar) : []

  const handleWorkingDayToggle = (day: string) => {
    setWorkingDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]))
  }

  const getWeekendDays = (days: string[]) => {
    const allDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    return allDays.filter((d) => !days.includes(d)).join(", ") || "None"
  }

  return (
    <div className="flex flex-col">
      <Header
        title="Calendar Setup"
        description="Configure location-based calendars with working days, hours, and holiday schedules."
      />

      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="master">Calendar Master</TabsTrigger>
            <TabsTrigger value="holidays">Holiday Management</TabsTrigger>
            <TabsTrigger value="support">Support Plan</TabsTrigger>
          </TabsList>

          {/* Calendar Master Tab */}
          <TabsContent value="master" className="space-y-6">
            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Calendars</p>
                      <p className="text-2xl font-bold">{calendars.length}</p>
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
                      <p className="text-sm text-muted-foreground">Active</p>
                      <p className="text-2xl font-bold">{calendars.filter((c) => c.status === "Active").length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                      <AlertCircle className="h-5 w-5 text-warning-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Inactive</p>
                      <p className="text-2xl font-bold">{calendars.filter((c) => c.status === "Inactive").length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10">
                      <Clock className="h-5 w-5 text-info" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Holidays</p>
                      <p className="text-2xl font-bold">{holidays.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {/* Calendar List */}
              <Card className="lg:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Calendars</CardTitle>
                    <CardDescription>One calendar per Entity-Location combination</CardDescription>
                  </div>
                  <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Calendar
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle>Create Calendar</DialogTitle>
                        <DialogDescription>
                          Select Entity and Location first. Each Entity-Location can have only one calendar.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        {/* Entity & Location Selection */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label>
                              Entity <span className="text-destructive">*</span>
                            </Label>
                            <Select value={selectedEntity} onValueChange={setSelectedEntity}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select entity" />
                              </SelectTrigger>
                              <SelectContent>
                                {entities.map((entity) => (
                                  <SelectItem key={entity.id} value={entity.id}>
                                    {entity.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid gap-2">
                            <Label>
                              Location <span className="text-destructive">*</span>
                            </Label>
                            <Select
                              value={selectedLocation}
                              onValueChange={setSelectedLocation}
                              disabled={!selectedEntity}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder={selectedEntity ? "Select location" : "Select entity first"} />
                              </SelectTrigger>
                              <SelectContent>
                                {availableLocations.map((loc) => (
                                  <SelectItem key={loc.id} value={loc.id}>
                                    {loc.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {/* Auto-filled timezone */}
                        {selectedLocationData && (
                          <div className="rounded-lg border bg-muted/50 p-3">
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">Time Zone:</span>
                              <span className="font-medium">{selectedLocationData.timezone}</span>
                              <span className="text-xs text-muted-foreground">(defaulted from location)</span>
                            </div>
                          </div>
                        )}

                        <div className="grid gap-2">
                          <Label>Calendar Name</Label>
                          <Input
                            placeholder="e.g., Mumbai HQ Calendar"
                            defaultValue={selectedLocationData ? `${selectedLocationData.name} Calendar` : ""}
                          />
                        </div>

                        {/* Working Days */}
                        <div className="grid gap-2">
                          <Label>Working Days</Label>
                          <div className="flex flex-wrap gap-2">
                            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                              <button
                                key={day}
                                type="button"
                                onClick={() => handleWorkingDayToggle(day)}
                                className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
                                  workingDays.includes(day)
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : "border-border bg-background hover:bg-muted"
                                }`}
                              >
                                {day}
                              </button>
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground">Weekend: {getWeekendDays(workingDays)}</p>
                        </div>

                        {/* Working Hours */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label>Workday Start Time</Label>
                            <Input type="time" defaultValue="09:00" />
                          </div>
                          <div className="grid gap-2">
                            <Label>Workday End Time</Label>
                            <Input type="time" defaultValue="18:00" />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label>Break Duration (minutes)</Label>
                            <Input type="number" placeholder="60" defaultValue={60} />
                          </div>
                          <div className="grid gap-2">
                            <Label>Half-day End Time</Label>
                            <Input type="time" defaultValue="13:00" />
                          </div>
                        </div>

                        <div className="grid gap-2">
                          <Label>Effective From Date</Label>
                          <Input type="date" />
                        </div>

                        {workingDays.length === 0 && (
                          <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>At least one working day is required.</AlertDescription>
                          </Alert>
                        )}
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                          Cancel
                        </Button>
                        <Button disabled={!selectedEntity || !selectedLocation || workingDays.length === 0}>
                          Create Calendar
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 flex items-center gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search by name, entity, or location..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Calendar Name</TableHead>
                          <TableHead>Entity</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Working Days</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="w-[80px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredCalendars.map((cal) => (
                          <TableRow
                            key={cal.id}
                            className={`cursor-pointer ${selectedCalendar === cal.id ? "bg-muted/50" : ""}`}
                            onClick={() => setSelectedCalendar(cal.id)}
                          >
                            <TableCell className="font-medium">{cal.name}</TableCell>
                            <TableCell className="text-muted-foreground">{cal.entity}</TableCell>
                            <TableCell>{cal.location}</TableCell>
                            <TableCell>{cal.workingDays.join(", ")}</TableCell>
                            <TableCell>
                              <StatusBadge variant={cal.status === "Active" ? "success" : "warning"}>
                                {cal.status}
                              </StatusBadge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Edit className="h-4 w-4" />
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

              {/* Calendar Details Panel */}
              <Card>
                <CardHeader>
                  <CardTitle>{selectedCalendarData ? selectedCalendarData.name : "Calendar Details"}</CardTitle>
                  <CardDescription>
                    {selectedCalendarData
                      ? "View and configure calendar settings"
                      : "Select a calendar to view details"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedCalendarData ? (
                    <div className="space-y-6">
                      {/* Basic Info */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-muted-foreground">Basic Information</h4>
                        <div className="grid gap-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Calendar ID</span>
                            <span className="font-mono">{selectedCalendarData.id}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Company</span>
                            <span>{selectedCalendarData.company}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Entity</span>
                            <span>{selectedCalendarData.entity}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Location</span>
                            <span>{selectedCalendarData.location}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Time Zone</span>
                            <span>{selectedCalendarData.timezone}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Status</span>
                            <StatusBadge variant={selectedCalendarData.status === "Active" ? "success" : "warning"}>
                              {selectedCalendarData.status}
                            </StatusBadge>
                          </div>
                        </div>
                      </div>

                      {/* Working Days */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-muted-foreground">Working Days</h4>
                        <div className="flex flex-wrap gap-2">
                          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                            <span
                              key={day}
                              className={`rounded-md border px-2 py-1 text-xs font-medium ${
                                selectedCalendarData.workingDays.includes(day)
                                  ? "border-primary bg-primary/10 text-primary"
                                  : "border-border bg-muted text-muted-foreground"
                              }`}
                            >
                              {day}
                            </span>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Weekend: {getWeekendDays(selectedCalendarData.workingDays)}
                        </p>
                      </div>

                      {/* Working Hours */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-muted-foreground">Working Hours</h4>
                        <div className="grid gap-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Start Time</span>
                            <span>{selectedCalendarData.startTime}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">End Time</span>
                            <span>{selectedCalendarData.endTime}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Break Duration</span>
                            <span>{selectedCalendarData.breakDuration} min</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Half-day End</span>
                            <span>{selectedCalendarData.halfDayEnd}</span>
                          </div>
                        </div>
                      </div>

                      {/* Holidays Summary */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-muted-foreground">Holidays</h4>
                          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                            {calendarHolidays.length} configured
                          </span>
                        </div>
                        <Button
                          variant="outline"
                          className="w-full bg-transparent"
                          onClick={() => setActiveTab("holidays")}
                        >
                          Manage Holidays
                        </Button>
                      </div>

                      {/* In Use Warning */}
                      {selectedCalendarData.inUse && (
                        <Alert>
                          <Info className="h-4 w-4" />
                          <AlertTitle>Calendar In Use</AlertTitle>
                          <AlertDescription>
                            This calendar is currently in use. Deactivation is not allowed.
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  ) : (
                    <div className="flex h-[300px] flex-col items-center justify-center text-center text-muted-foreground">
                      <Calendar className="mb-3 h-12 w-12 opacity-20" />
                      <p>Select a calendar from the list to view its configuration</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Calendar Rules */}
            <Card>
              <CardHeader>
                <CardTitle>Calendar Update Rules</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-lg border bg-muted/30 p-4">
                    <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <span className="text-sm font-bold text-primary">1</span>
                    </div>
                    <h4 className="font-medium">One Per Location</h4>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Only one active calendar per Entity-Location combination
                    </p>
                  </div>
                  <div className="rounded-lg border bg-muted/30 p-4">
                    <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <span className="text-sm font-bold text-primary">2</span>
                    </div>
                    <h4 className="font-medium">No Sharing</h4>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Calendars cannot be shared across different locations
                    </p>
                  </div>
                  <div className="rounded-lg border bg-muted/30 p-4">
                    <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <span className="text-sm font-bold text-primary">3</span>
                    </div>
                    <h4 className="font-medium">New Transactions Only</h4>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Changes affect new transactions only, not completed ones
                    </p>
                  </div>
                  <div className="rounded-lg border bg-muted/30 p-4">
                    <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <span className="text-sm font-bold text-primary">4</span>
                    </div>
                    <h4 className="font-medium">Audit Logged</h4>
                    <p className="mt-1 text-sm text-muted-foreground">
                      All holiday updates are logged for audit purposes
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Holiday Management Tab */}
          <TabsContent value="holidays" className="space-y-6">
            {/* Calendar Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Select Calendar</CardTitle>
                <CardDescription>Choose an Entity-Location calendar to manage its holidays</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="grid gap-2">
                    <Label>Entity</Label>
                    <Select value={selectedEntity} onValueChange={setSelectedEntity}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select entity" />
                      </SelectTrigger>
                      <SelectContent>
                        {entities.map((entity) => (
                          <SelectItem key={entity.id} value={entity.id}>
                            {entity.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Location</Label>
                    <Select
                      value={selectedLocation}
                      onValueChange={(val) => {
                        setSelectedLocation(val)
                        // Find calendar for this location
                        const cal = calendars.find((c) => c.locationId === val)
                        if (cal) setSelectedCalendar(cal.id)
                      }}
                      disabled={!selectedEntity}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={selectedEntity ? "Select location" : "Select entity first"} />
                      </SelectTrigger>
                      <SelectContent>
                        {availableLocations.map((loc) => (
                          <SelectItem key={loc.id} value={loc.id}>
                            {loc.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Calendar</Label>
                    <div className="flex h-10 items-center rounded-md border bg-muted/50 px-3 text-sm">
                      {selectedCalendarData ? (
                        <span className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-primary" />
                          {selectedCalendarData.name}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">Select entity and location</span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {selectedCalendarData ? (
              <>
                {/* Holiday Upload Panel */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Holiday Upload</CardTitle>
                      <CardDescription>Upload holidays via Excel or add them manually</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" className="bg-transparent">
                        <Download className="mr-2 h-4 w-4" />
                        Download Template
                      </Button>
                      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="bg-transparent">
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Excel
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                          <DialogHeader>
                            <DialogTitle>Upload Holiday List</DialogTitle>
                            <DialogDescription>
                              Upload an Excel file with holiday data. Download the template first for correct format.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="py-4">
                            <div className="rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 text-center">
                              <FileSpreadsheet className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
                              <p className="mb-2 text-sm text-muted-foreground">
                                Drag and drop your Excel file here, or
                              </p>
                              <Button variant="outline" className="bg-transparent">
                                Browse Files
                              </Button>
                              <p className="mt-3 text-xs text-muted-foreground">Supported format: .xlsx, .xls</p>
                            </div>

                            <div className="mt-4 rounded-lg border bg-muted/30 p-4">
                              <h4 className="mb-2 text-sm font-medium">Template Fields</h4>
                              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                                <span>• Holiday Date (required)</span>
                                <span>• Holiday Name (required)</span>
                                <span>• Holiday Type (Public/Company)</span>
                                <span>• Applies To (optional)</span>
                              </div>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
                              Cancel
                            </Button>
                            <Button onClick={() => setShowValidationResults(true)}>Validate & Import</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Holiday
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add Holiday</DialogTitle>
                            <DialogDescription>Add a new holiday to {selectedCalendarData.name}</DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Label>Holiday Date</Label>
                              <Input type="date" />
                            </div>
                            <div className="grid gap-2">
                              <Label>Holiday Name</Label>
                              <Input placeholder="e.g., Independence Day" />
                            </div>
                            <div className="grid gap-2">
                              <Label>Holiday Type</Label>
                              <Select defaultValue="public">
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="public">Public Holiday</SelectItem>
                                  <SelectItem value="company">Company Holiday</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid gap-2">
                              <Label>Applies To (Optional)</Label>
                              <Input placeholder="e.g., All departments" />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline">Cancel</Button>
                            <Button>Add Holiday</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>

                  {/* Validation Results */}
                  {showValidationResults && (
                    <CardContent className="border-t pt-4">
                      <div className="mb-4 flex items-center justify-between">
                        <h4 className="font-medium">Validation Summary</h4>
                        <Button variant="ghost" size="sm" onClick={() => setShowValidationResults(false)}>
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="mb-4 grid grid-cols-4 gap-4">
                        <div className="rounded-lg border bg-muted/30 p-3 text-center">
                          <p className="text-2xl font-bold">{uploadValidationResults.total}</p>
                          <p className="text-xs text-muted-foreground">Total Rows</p>
                        </div>
                        <div className="rounded-lg border bg-success/10 p-3 text-center">
                          <p className="text-2xl font-bold text-success">{uploadValidationResults.valid}</p>
                          <p className="text-xs text-muted-foreground">Valid</p>
                        </div>
                        <div className="rounded-lg border bg-warning/10 p-3 text-center">
                          <p className="text-2xl font-bold text-warning-foreground">
                            {uploadValidationResults.duplicates}
                          </p>
                          <p className="text-xs text-muted-foreground">Duplicates</p>
                        </div>
                        <div className="rounded-lg border bg-destructive/10 p-3 text-center">
                          <p className="text-2xl font-bold text-destructive">{uploadValidationResults.invalid}</p>
                          <p className="text-xs text-muted-foreground">Invalid</p>
                        </div>
                      </div>

                      {uploadValidationResults.errors.length > 0 && (
                        <div className="rounded-lg border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-[80px]">Row</TableHead>
                                <TableHead>Field</TableHead>
                                <TableHead>Error</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {uploadValidationResults.errors.map((err, idx) => (
                                <TableRow key={idx}>
                                  <TableCell className="font-mono">{err.row}</TableCell>
                                  <TableCell>{err.field}</TableCell>
                                  <TableCell className="text-destructive">{err.error}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}

                      <div className="mt-4 flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowValidationResults(false)}>
                          Cancel
                        </Button>
                        <Button disabled={uploadValidationResults.valid === 0}>
                          Import {uploadValidationResults.valid} Valid Rows
                        </Button>
                      </div>
                    </CardContent>
                  )}
                </Card>

                {/* Holiday List */}
                <Card>
                  <CardHeader>
                    <CardTitle>Holidays for {selectedCalendarData.name}</CardTitle>
                    <CardDescription>
                      {calendarHolidays.length} holidays configured for calendar year 2026
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Holiday Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Applies To</TableHead>
                            <TableHead className="w-[100px]">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {calendarHolidays.length > 0 ? (
                            calendarHolidays.map((holiday) => (
                              <TableRow key={holiday.id}>
                                <TableCell className="font-mono">{holiday.date}</TableCell>
                                <TableCell className="font-medium">{holiday.name}</TableCell>
                                <TableCell>
                                  <StatusBadge variant={holiday.type === "Public" ? "info" : "default"}>
                                    {holiday.type}
                                  </StatusBadge>
                                </TableCell>
                                <TableCell className="text-muted-foreground">{holiday.appliesTo}</TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-1">
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={5} className="h-24 text-center">
                                <div className="text-muted-foreground">
                                  No holidays configured. Upload an Excel file or add holidays manually.
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="flex h-[300px] flex-col items-center justify-center text-center">
                  <Calendar className="mb-4 h-16 w-16 text-muted-foreground/30" />
                  <h3 className="text-lg font-medium">No Calendar Selected</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Select an Entity and Location above to manage holidays
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="support" className="space-y-6">
            {/* Data Source Indicator */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Info className="h-4 w-4" />
                <span>Data sourced from Support / License API</span>
                <span className="text-xs">• Last refreshed: {new Date(supportPlan.lastUpdated).toLocaleString()}</span>
              </div>
              <Button variant="outline" size="sm" className="bg-transparent">
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </div>

            {/* Support Plan Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Headphones className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle>{supportPlan.planName}</CardTitle>
                      <CardDescription>Support entitlement details for your subscription</CardDescription>
                    </div>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <StatusBadge variant={supportPlan.status === "Active" ? "success" : "destructive"}>
                          {supportPlan.status}
                        </StatusBadge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Your support plan is currently {supportPlan.status.toLowerCase()}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Plan Overview */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-muted-foreground">Plan Details</h4>
                    <div className="grid gap-3 text-sm">
                      <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-3">
                        <span className="text-muted-foreground">Plan Name</span>
                        <span className="font-medium">{supportPlan.planName}</span>
                      </div>
                      <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-3">
                        <span className="text-muted-foreground">Support Coverage</span>
                        <span className="font-medium">{supportPlan.coverage}</span>
                      </div>
                      <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-3">
                        <span className="text-muted-foreground">Start Date</span>
                        <span className="font-mono">{supportPlan.startDate}</span>
                      </div>
                      <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-3">
                        <span className="text-muted-foreground">End Date</span>
                        <span className="font-mono">{supportPlan.endDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-muted-foreground">SLA Response Time</h4>
                    <div className="rounded-lg border bg-muted/30 p-4">
                      <p className="text-sm">{supportPlan.slaResponseTime}</p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        Response times are informational and based on your plan tier
                      </p>
                    </div>

                    {supportPlan.channels.dedicatedManager && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-muted-foreground">Dedicated Manager</h4>
                        <div className="rounded-lg border bg-muted/30 p-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                              <UserCheck className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{supportPlan.managerName}</p>
                              <p className="text-sm text-muted-foreground">{supportPlan.managerEmail}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Support Channels */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-muted-foreground">Support Channels</h4>
                  <div className="grid gap-4 md:grid-cols-4">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className={`flex flex-col items-center gap-2 rounded-lg border p-4 ${
                              supportPlan.channels.email
                                ? "border-success bg-success/5"
                                : "border-border bg-muted/30 opacity-50"
                            }`}
                          >
                            <div
                              className={`flex h-12 w-12 items-center justify-center rounded-full ${
                                supportPlan.channels.email ? "bg-success/10" : "bg-muted"
                              }`}
                            >
                              <Mail
                                className={`h-6 w-6 ${supportPlan.channels.email ? "text-success" : "text-muted-foreground"}`}
                              />
                            </div>
                            <span className="text-sm font-medium">Email</span>
                            <StatusBadge variant={supportPlan.channels.email ? "success" : "default"}>
                              {supportPlan.channels.email ? "Available" : "Not Included"}
                            </StatusBadge>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Submit support tickets via email</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className={`flex flex-col items-center gap-2 rounded-lg border p-4 ${
                              supportPlan.channels.chat
                                ? "border-success bg-success/5"
                                : "border-border bg-muted/30 opacity-50"
                            }`}
                          >
                            <div
                              className={`flex h-12 w-12 items-center justify-center rounded-full ${
                                supportPlan.channels.chat ? "bg-success/10" : "bg-muted"
                              }`}
                            >
                              <MessageSquare
                                className={`h-6 w-6 ${supportPlan.channels.chat ? "text-success" : "text-muted-foreground"}`}
                              />
                            </div>
                            <span className="text-sm font-medium">Chat</span>
                            <StatusBadge variant={supportPlan.channels.chat ? "success" : "default"}>
                              {supportPlan.channels.chat ? "Available" : "Not Included"}
                            </StatusBadge>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Live chat support with agents</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className={`flex flex-col items-center gap-2 rounded-lg border p-4 ${
                              supportPlan.channels.phone
                                ? "border-success bg-success/5"
                                : "border-border bg-muted/30 opacity-50"
                            }`}
                          >
                            <div
                              className={`flex h-12 w-12 items-center justify-center rounded-full ${
                                supportPlan.channels.phone ? "bg-success/10" : "bg-muted"
                              }`}
                            >
                              <Phone
                                className={`h-6 w-6 ${supportPlan.channels.phone ? "text-success" : "text-muted-foreground"}`}
                              />
                            </div>
                            <span className="text-sm font-medium">Phone</span>
                            <StatusBadge variant={supportPlan.channels.phone ? "success" : "default"}>
                              {supportPlan.channels.phone ? "Available" : "Not Included"}
                            </StatusBadge>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Direct phone support line</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className={`flex flex-col items-center gap-2 rounded-lg border p-4 ${
                              supportPlan.channels.dedicatedManager
                                ? "border-success bg-success/5"
                                : "border-border bg-muted/30 opacity-50"
                            }`}
                          >
                            <div
                              className={`flex h-12 w-12 items-center justify-center rounded-full ${
                                supportPlan.channels.dedicatedManager ? "bg-success/10" : "bg-muted"
                              }`}
                            >
                              <UserCheck
                                className={`h-6 w-6 ${supportPlan.channels.dedicatedManager ? "text-success" : "text-muted-foreground"}`}
                              />
                            </div>
                            <span className="text-sm font-medium">Dedicated Manager</span>
                            <StatusBadge variant={supportPlan.channels.dedicatedManager ? "success" : "default"}>
                              {supportPlan.channels.dedicatedManager ? "Yes" : "No"}
                            </StatusBadge>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Assigned account manager for priority support</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>

                {/* Info Alert */}
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Read-Only Information</AlertTitle>
                  <AlertDescription>
                    Support plan details are managed at the subscription level. Contact your account manager or sales
                    representative to modify your support plan.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
