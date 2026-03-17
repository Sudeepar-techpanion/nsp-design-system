"use client"

import React from "react"
import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ChevronRight,
  Plus,
  Search,
  MoreHorizontal,
  Mail,
  Shield,
  Lock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Eye,
  UserX,
  UserCheck,
  Trash2,
  Users,
  Layers,
  Zap,
  Info,
  Send,
  FolderTree,
  Folder,
  UserPlus,
  UserMinus,
  Pencil,
  GitBranch,
  MapPin,
  Building2,
  Factory,
  ClipboardList,
  Upload,
  Download,
  FileText,
  CheckCircle2,
  X,
  Filter,
  ListFilter,
  Cloud,
  Database,
  Globe,
  Building,
} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"

// Types
interface Role {
  id: string
  name: string
  description: string
  isSystem: boolean
  category: string
  permissions: string[]
  layouts: string[]
  actions: string[]
}

interface Group {
  id: string
  name: string
  parentId: string | null
  roles: string[]
  children: Group[]
  tasks?: string[]
}

interface DataScope {
  companyCodes: string[]
  locations: string[]
  plants: string[]
}

interface User {
  id: string
  name: string
  email: string
  status: "invited" | "active" | "suspended"
  directRoles: string[]
  groupIds: string[]
  lastActive: string | null
  invitedAt?: string
  createdAt: string
  scope?: DataScope
  directorySource?: "manual" | "azure" | "zoho"
  externalId?: string
  department?: string
}

// Mock Roles
const availableRoles: Role[] = [
  {
    id: "cfo", name: "CFO", description: "Chief Financial Officer with full finance access", isSystem: true, category: "Finance",
    permissions: ["invoice.view", "invoice.create", "invoice.edit", "invoice.approve", "invoice.pay", "rfq.view", "rfq.approve"],
    layouts: ["Invoice Processing", "RFQ", "Inbox"], actions: ["Approve Invoice", "Process Payment", "Approve RFQ"],
  },
  {
    id: "finance-controller", name: "Finance Controller", description: "Manages financial operations and approvals", isSystem: true, category: "Finance",
    permissions: ["invoice.view", "invoice.edit", "invoice.approve", "rfq.view"],
    layouts: ["Invoice Processing", "RFQ"], actions: ["Approve Invoice", "Edit Invoice"],
  },
  {
    id: "ap-user", name: "AP User", description: "Accounts Payable user for invoice processing", isSystem: false, category: "Finance",
    permissions: ["invoice.view", "invoice.create", "invoice.edit"],
    layouts: ["Invoice Processing", "Inbox"], actions: ["Create Invoice", "Edit Invoice"],
  },
  {
    id: "procurement-manager", name: "Procurement Manager", description: "Manages procurement operations and RFQs", isSystem: true, category: "Procurement",
    permissions: ["rfq.view", "rfq.create", "rfq.edit", "rfq.approve", "rfq.assign", "vendor.view", "vendor.approve"],
    layouts: ["RFQ", "Inbox"], actions: ["Create RFQ", "Approve RFQ", "Assign Vendor"],
  },
  {
    id: "compliance-officer", name: "Compliance Officer", description: "Oversees compliance and policy adherence", isSystem: true, category: "Governance",
    permissions: ["compliance.view", "compliance.audit", "compliance.manage"],
    layouts: ["Compliance Dashboard"], actions: ["View Audit Trail", "Manage Policies"],
  },
  {
    id: "auditor", name: "Auditor", description: "Read-only access for audit purposes", isSystem: true, category: "Governance",
    permissions: ["invoice.view", "rfq.view", "compliance.view", "compliance.audit"],
    layouts: ["Invoice Processing", "RFQ", "Compliance Dashboard"], actions: ["View Audit Trail"],
  },
  {
    id: "tenant-admin", name: "Tenant Admin", description: "Full system administration access", isSystem: true, category: "System",
    permissions: ["*"], layouts: ["All Layouts"], actions: ["All Actions"],
  },
]

// Role conflict rules
const roleConflicts: Record<string, string[]> = {
  "auditor": ["ap-user", "finance-controller"],
  "ap-user": ["auditor"],
  "finance-controller": ["auditor"],
}

// Available tasks/modules
const availableTasks = [
  "Invoice Processing", "RFQ Management", "Vendor Management", "Compliance Audit",
  "Policy Management", "Financial Reporting", "Procurement Planning", "Budget Management",
]

// Mock Groups (hierarchical)
const initialGroups: Group[] = [
  {
    id: "finance", name: "Finance", parentId: null, roles: [],
    tasks: ["Invoice Processing", "Financial Reporting", "Budget Management"],
    children: [
      { id: "ap-team", name: "AP Team", parentId: "finance", roles: ["ap-user"], tasks: ["Invoice Processing"], children: [] },
      { id: "ar-team", name: "AR Team", parentId: "finance", roles: ["finance-controller"], tasks: ["Financial Reporting"], children: [] },
    ],
  },
  {
    id: "procurement", name: "Procurement", parentId: null, roles: ["procurement-manager"],
    tasks: ["RFQ Management", "Vendor Management", "Procurement Planning"],
    children: [
      { id: "sourcing", name: "Sourcing", parentId: "procurement", roles: [], tasks: ["RFQ Management"], children: [] },
    ],
  },
  {
    id: "governance", name: "Governance", parentId: null, roles: ["compliance-officer"],
    tasks: ["Compliance Audit", "Policy Management"],
    children: [
      { id: "audit", name: "Audit", parentId: "governance", roles: ["auditor"], tasks: ["Compliance Audit"], children: [] },
    ],
  },
]

// Mock Users
const initialUsers: User[] = [
  { id: "user-1", name: "John Smith", email: "john.smith@company.com", status: "active", directRoles: ["cfo"], groupIds: ["finance"], lastActive: "2024-01-15T10:30:00Z", createdAt: "2023-06-01T00:00:00Z", scope: { companyCodes: ["1000", "2000"], locations: ["New York", "London"], plants: ["Plant A"] } },
  { id: "user-2", name: "Sarah Johnson", email: "sarah.johnson@company.com", status: "active", directRoles: ["finance-controller"], groupIds: ["ap-team"], lastActive: "2024-01-15T09:45:00Z", createdAt: "2023-07-15T00:00:00Z", scope: { companyCodes: ["1000"], locations: ["New York"], plants: ["Plant A"] } },
  { id: "user-3", name: "Michael Chen", email: "michael.chen@company.com", status: "active", directRoles: [], groupIds: ["ap-team"], lastActive: "2024-01-14T16:20:00Z", createdAt: "2023-09-01T00:00:00Z", scope: { companyCodes: ["1000"], locations: ["New York"], plants: [] } },
  { id: "user-4", name: "Emily Davis", email: "emily.davis@company.com", status: "invited", directRoles: [], groupIds: ["sourcing"], lastActive: null, invitedAt: "2024-01-10T00:00:00Z", createdAt: "2024-01-10T00:00:00Z", scope: { companyCodes: ["2000"], locations: ["Chicago"], plants: ["Plant B"] } },
  { id: "user-5", name: "Robert Wilson", email: "robert.wilson@company.com", status: "suspended", directRoles: [], groupIds: ["audit"], lastActive: "2023-12-20T14:00:00Z", createdAt: "2023-03-01T00:00:00Z", scope: { companyCodes: ["1000"], locations: ["New York"], plants: [] } },
  { id: "user-6", name: "Lisa Anderson", email: "lisa.anderson@company.com", status: "active", directRoles: ["tenant-admin"], groupIds: ["governance"], lastActive: "2024-01-15T11:00:00Z", createdAt: "2023-01-01T00:00:00Z", scope: { companyCodes: ["1000", "2000", "3000"], locations: ["New York", "London", "Chicago"], plants: ["Plant A", "Plant B"] } },
  { id: "user-7", name: "David Kim", email: "david.kim@company.com", status: "active", directRoles: [], groupIds: ["ap-team", "audit"], lastActive: "2024-01-15T08:00:00Z", createdAt: "2023-08-01T00:00:00Z", scope: { companyCodes: ["1000"], locations: ["New York"], plants: ["Plant A"] } },
]

// Helpers
function flattenGroups(groups: Group[]): Group[] {
  const result: Group[] = []
  function traverse(g: Group) { result.push(g); g.children.forEach(traverse) }
  groups.forEach(traverse)
  return result
}

function getGroupPath(groupId: string, groups: Group[]): string[] {
  const path: string[] = []
  const allGroups = flattenGroups(groups)
  let current = allGroups.find(g => g.id === groupId)
  while (current) {
    path.unshift(current.name)
    current = current.parentId ? allGroups.find(g => g.id === current!.parentId) : undefined
  }
  return path
}

function getInheritedRoles(groupIds: string[], groups: Group[]): { roleId: string; source: string }[] {
  const allGroups = flattenGroups(groups)
  const inherited: { roleId: string; source: string }[] = []
  groupIds.forEach(groupId => {
    let current = allGroups.find(g => g.id === groupId)
    while (current) {
      current.roles.forEach(roleId => {
        if (!inherited.some(r => r.roleId === roleId)) {
          inherited.push({ roleId, source: current!.name })
        }
      })
      current = current.parentId ? allGroups.find(g => g.id === current!.parentId) : undefined
    }
  })
  return inherited
}

function getInheritedTasks(groupIds: string[], groups: Group[]): string[] {
  const allGroups = flattenGroups(groups)
  const tasks = new Set<string>()
  groupIds.forEach(groupId => {
    let current = allGroups.find(g => g.id === groupId)
    while (current) {
      current.tasks?.forEach(t => tasks.add(t))
      current = current.parentId ? allGroups.find(g => g.id === current!.parentId) : undefined
    }
  })
  return Array.from(tasks)
}

function getPrivilegeLevel(role: Role): string {
  if (role.permissions.includes("*")) return "Full Access"
  if (role.permissions.some(p => p.includes("approve") || p.includes("pay"))) return "Approve"
  if (role.permissions.some(p => p.includes("edit") || p.includes("create"))) return "Edit"
  return "View Only"
}

function getPrivilegeBadgeClasses(level: string): string {
  switch (level) {
    case "Full Access": return "bg-red-100 text-red-700 border-red-200"
    case "Approve": return "bg-amber-100 text-amber-700 border-amber-200"
    case "Edit": return "bg-blue-100 text-blue-700 border-blue-200"
    default: return "bg-emerald-100 text-emerald-700 border-emerald-200"
  }
}

export default function UserManagementPage() {
  const { toast } = useToast()
  const [groups, setGroups] = useState<Group[]>(initialGroups)
  const [users, setUsers] = useState<User[]>(initialUsers)

  // Top-level tab: users | groups | roles
  const [activeTab, setActiveTab] = useState<"users" | "groups" | "roles">("users")

  // Selected entity per tab
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null)
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null)
  
  // Right panel visibility
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false)

  // Mock directory users
  const mockAzureUsers = [
    { id: "az-1", name: "Alice Johnson", email: "alice.johnson@company.com", department: "Finance", externalId: "az-ext-1" },
    { id: "az-2", name: "Bob Williams", email: "bob.williams@company.com", department: "Operations", externalId: "az-ext-2" },
    { id: "az-3", name: "Carol Martinez", email: "carol.martinez@company.com", department: "HR", externalId: "az-ext-3" },
    { id: "az-4", name: "David Lee", email: "david.lee@company.com", department: "IT", externalId: "az-ext-4" },
    { id: "az-5", name: "Emma Davis", email: "emma.davis@company.com", department: "Finance", externalId: "az-ext-5" },
  ]

  const mockZohoUsers = [
    { id: "zh-1", name: "Frank Miller", email: "frank.miller@company.com", department: "Sales", externalId: "zh-ext-1" },
    { id: "zh-2", name: "Grace Wilson", email: "grace.wilson@company.com", department: "Marketing", externalId: "zh-ext-2" },
    { id: "zh-3", name: "Henry Moore", email: "henry.moore@company.com", department: "Operations", externalId: "zh-ext-3" },
    { id: "zh-4", name: "Isabel Taylor", email: "isabel.taylor@company.com", department: "Finance", externalId: "zh-ext-4" },
    { id: "zh-5", name: "Jack Anderson", email: "jack.anderson@company.com", department: "IT", externalId: "zh-ext-5" },
  ]

  // Search
  const [searchQuery, setSearchQuery] = useState("")

  // User filters
  const [filterGroup, setFilterGroup] = useState<string>("all")
  const [filterRole, setFilterRole] = useState<string>("all")
  const [filterLocation, setFilterLocation] = useState<string>("all")
  const [filterCompanyCode, setFilterCompanyCode] = useState<string>("all")
  const [filterPlant, setFilterPlant] = useState<string>("all")

  // Bulk mode (users tab only)
  const [bulkMode, setBulkMode] = useState(false)
  const [bulkSelectedUserIds, setBulkSelectedUserIds] = useState<Set<string>>(new Set())

  // Dialogs
  const [isCreateUserDialogOpen, setIsCreateUserDialogOpen] = useState(false)
  const [isCreateGroupDialogOpen, setIsCreateGroupDialogOpen] = useState(false)
  const [isAssignRoleDialogOpen, setIsAssignRoleDialogOpen] = useState(false)
  const [isBulkAssignDialogOpen, setIsBulkAssignDialogOpen] = useState(false)
  const [isEditScopeDialogOpen, setIsEditScopeDialogOpen] = useState(false)
  const [isAddUserToGroupDialogOpen, setIsAddUserToGroupDialogOpen] = useState(false)
  const [isAddRoleToGroupDialogOpen, setIsAddRoleToGroupDialogOpen] = useState(false)
  const [isRenameGroupDialogOpen, setIsRenameGroupDialogOpen] = useState(false)
  const [isDeleteGroupDialogOpen, setIsDeleteGroupDialogOpen] = useState(false)
  const [isBulkUploadDialogOpen, setIsBulkUploadDialogOpen] = useState(false)

  // Bulk upload state
  const [bulkUploadStep, setBulkUploadStep] = useState<"upload" | "preview" | "done">("upload")
  const [bulkUploadFile, setBulkUploadFile] = useState<File | null>(null)
  const [bulkUploadParsed, setBulkUploadParsed] = useState<Array<{ name: string; email: string; groups: string[]; roles: string[]; status: "valid" | "duplicate" | "invalid" }>>([])
  const [bulkUploadError, setBulkUploadError] = useState<string | null>(null)
  const [bulkUploadImportedCount, setBulkUploadImportedCount] = useState(0)

  // Form states
  const [createUserName, setCreateUserName] = useState("")
  const [createUserEmail, setCreateUserEmail] = useState("")
  const [createUserGroups, setCreateUserGroups] = useState<string[]>([])
  const [createUserDirectRoles, setCreateUserDirectRoles] = useState<string[]>([])
  const [createUserScope, setCreateUserScope] = useState<DataScope>({ companyCodes: [], locations: [], plants: [] })
  
  // Add user source
  const [addUserSource, setAddUserSource] = useState<"manual" | "azure" | "zoho">("manual")
  const [directorySearchQuery, setDirectorySearchQuery] = useState("")
  const [selectedDirectoryUsers, setSelectedDirectoryUsers] = useState<string[]>([])
  const [directoryAssignGroups, setDirectoryAssignGroups] = useState<string[]>([])
  const [directoryAssignRoles, setDirectoryAssignRoles] = useState<string[]>([])
  const [directoryAssignScope, setDirectoryAssignScope] = useState<DataScope>({ companyCodes: [], locations: [], plants: [] })

  const [assignRoleId, setAssignRoleId] = useState("")
  const [assignRoleConflict, setAssignRoleConflict] = useState<string | null>(null)

  const [bulkAssignGroups, setBulkAssignGroups] = useState<string[]>([])
  const [bulkAssignRoles, setBulkAssignRoles] = useState<string[]>([])
  const [bulkAssignScope, setBulkAssignScope] = useState<DataScope>({ companyCodes: [], locations: [], plants: [] })

  const [newGroupName, setNewGroupName] = useState("")
  const [newGroupRoles, setNewGroupRoles] = useState<string[]>([])
  const [newGroupTasks, setNewGroupTasks] = useState<string[]>([])

  const [editScope, setEditScope] = useState<DataScope>({ companyCodes: [], locations: [], plants: [] })

  const allGroups = useMemo(() => flattenGroups(groups), [groups])

  // Compute unique filter options from users data
  const uniqueLocations = useMemo(() => Array.from(new Set(users.flatMap(u => u.scope?.locations || []))).sort(), [users])
  const uniqueCompanyCodes = useMemo(() => Array.from(new Set(users.flatMap(u => u.scope?.companyCodes || []))).sort(), [users])
  const uniquePlants = useMemo(() => Array.from(new Set(users.flatMap(u => u.scope?.plants || []))).filter(Boolean).sort(), [users])

  const activeFilterCount = [filterGroup, filterRole, filterLocation, filterCompanyCode, filterPlant].filter(f => f !== "all").length

  const filteredDirectoryUsers = useMemo(() => {
    const source = addUserSource === "azure" ? mockAzureUsers : mockZohoUsers
    if (!directorySearchQuery.trim()) return source
    const query = directorySearchQuery.toLowerCase()
    return source.filter(u => 
      u.name.toLowerCase().includes(query) || 
      u.email.toLowerCase().includes(query) ||
      u.department.toLowerCase().includes(query)
    )
  }, [addUserSource, directorySearchQuery])

  const selectedUser = users.find(u => u.id === selectedUserId)
  const selectedGroup = allGroups.find(g => g.id === selectedGroupId)
  const selectedRole = availableRoles.find(r => r.id === selectedRoleId)

  // Filtered lists
  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesGroup = filterGroup === "all" || u.groupIds.includes(filterGroup)
    const inherited = getInheritedRoles(u.groupIds, groups)
    const allUserRoleIds = new Set([...u.directRoles, ...inherited.map(r => r.roleId)])
    const matchesRole = filterRole === "all" || allUserRoleIds.has(filterRole)
    const matchesLocation = filterLocation === "all" || (u.scope?.locations || []).includes(filterLocation)
    const matchesCompanyCode = filterCompanyCode === "all" || (u.scope?.companyCodes || []).includes(filterCompanyCode)
    const matchesPlant = filterPlant === "all" || (u.scope?.plants || []).includes(filterPlant)
    return matchesSearch && matchesGroup && matchesRole && matchesLocation && matchesCompanyCode && matchesPlant
  })
  const filteredGroupsList = allGroups.filter(g =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase())
  )
  const filteredRoles = availableRoles.filter(r =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.category.toLowerCase().includes(searchQuery.toLowerCase())
  )



  // User detail computations
  const userInheritedRoles = selectedUser ? getInheritedRoles(selectedUser.groupIds, groups) : []
  const userDirectRoles = selectedUser?.directRoles.map(id => availableRoles.find(r => r.id === id)).filter(Boolean) as Role[] || []

  const getEffectiveAccess = (user: User) => {
    const permissions = new Set<string>()
    const layouts = new Set<string>()
    const actions = new Set<string>()
    user.directRoles.forEach(roleId => {
      const role = availableRoles.find(r => r.id === roleId)
      if (role) { role.permissions.forEach(p => permissions.add(p)); role.layouts.forEach(l => layouts.add(l)); role.actions.forEach(a => actions.add(a)) }
    })
    const inherited = getInheritedRoles(user.groupIds, groups)
    inherited.forEach(({ roleId }) => {
      const role = availableRoles.find(r => r.id === roleId)
      if (role) { role.permissions.forEach(p => permissions.add(p)); role.layouts.forEach(l => layouts.add(l)); role.actions.forEach(a => actions.add(a)) }
    })
    return { permissions: Array.from(permissions), layouts: Array.from(layouts), actions: Array.from(actions) }
  }

  // Group detail: users in group
  const usersInSelectedGroup = selectedGroupId ? users.filter(u => u.groupIds.includes(selectedGroupId)) : []

  // Role detail: users with role, groups with role
  const usersWithSelectedRole = selectedRole ? users.filter(u => u.directRoles.includes(selectedRole.id)) : []
  const groupsWithSelectedRole = selectedRole ? allGroups.filter(g => g.roles.includes(selectedRole.id)) : []

  const getStatusBadge = (status: User["status"]) => {
    switch (status) {
      case "active": return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200"><CheckCircle className="h-3 w-3 mr-1" />Active</Badge>
      case "invited": return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200"><Mail className="h-3 w-3 mr-1" />Invited</Badge>
      case "suspended": return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-orange-200"><XCircle className="h-3 w-3 mr-1" />Suspended</Badge>
    }
  }

  const getScopeSummary = (user: User) => {
    if (!user.scope) return "No scope"
    const parts: string[] = []
    if (user.scope.companyCodes.length) parts.push(`${user.scope.companyCodes.length} CC`)
    if (user.scope.locations.length) parts.push(`${user.scope.locations.length} Loc`)
    if (user.scope.plants.length) parts.push(`${user.scope.plants.length} Plant`)
    return parts.join(", ") || "No scope"
  }

  // Handlers
  const handleCreateUser = () => {
    if (addUserSource === "manual") {
      // Manual entry validation
      if (!createUserName || !createUserEmail) {
        toast({ title: "Validation Error", description: "Please fill in all required fields.", variant: "destructive" })
        return
      }
      for (const roleId of createUserDirectRoles) {
        const conflicts = roleConflicts[roleId]
        if (conflicts) {
          const conflicting = createUserDirectRoles.find(r => conflicts.includes(r))
          if (conflicting) {
            toast({ title: "Role Conflict", description: `Conflicting roles selected. Remove one before saving.`, variant: "destructive" })
            return
          }
        }
      }
      const newUser: User = {
        id: `user-${Date.now()}`, name: createUserName, email: createUserEmail, status: "invited",
        directRoles: createUserDirectRoles, groupIds: createUserGroups, lastActive: null,
        invitedAt: new Date().toISOString(), createdAt: new Date().toISOString(), scope: createUserScope,
        directorySource: "manual",
      }
      setUsers([...users, newUser])
      setIsCreateUserDialogOpen(false)
      setCreateUserName(""); setCreateUserEmail(""); setCreateUserGroups([]); setCreateUserDirectRoles([])
      setCreateUserScope({ companyCodes: [], locations: [], plants: [] })
      toast({ title: "Invitation Sent", description: `Invitation sent to ${createUserEmail}.` })
    } else {
      // Directory import validation
      if (selectedDirectoryUsers.length === 0) {
        toast({ title: "Validation Error", description: "Please select at least one user to import.", variant: "destructive" })
        return
      }
      for (const roleId of directoryAssignRoles) {
        const conflicts = roleConflicts[roleId]
        if (conflicts) {
          const conflicting = directoryAssignRoles.find(r => conflicts.includes(r))
          if (conflicting) {
            toast({ title: "Role Conflict", description: `Conflicting roles selected. Remove one before saving.`, variant: "destructive" })
            return
          }
        }
      }
      const source = addUserSource === "azure" ? mockAzureUsers : mockZohoUsers
      const newUsers: User[] = selectedDirectoryUsers.map(userId => {
        const dirUser = source.find(u => u.id === userId)!
        return {
          id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          name: dirUser.name,
          email: dirUser.email,
          status: "invited" as const,
          directRoles: directoryAssignRoles,
          groupIds: directoryAssignGroups,
          lastActive: null,
          invitedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          scope: directoryAssignScope,
          directorySource: addUserSource,
          externalId: dirUser.externalId,
          department: dirUser.department,
        }
      })
      setUsers([...users, ...newUsers])
      setIsCreateUserDialogOpen(false)
      setSelectedDirectoryUsers([])
      setDirectoryAssignGroups([])
      setDirectoryAssignRoles([])
      setDirectoryAssignScope({ companyCodes: [], locations: [], plants: [] })
      setDirectorySearchQuery("")
      toast({ title: "Users Imported", description: `${newUsers.length} user(s) imported from ${addUserSource === "azure" ? "Azure AD" : "Zoho Directory"}.` })
    }
  }

  const handleAssignRole = () => {
    if (!assignRoleId || !selectedUserId) return
    const user = users.find(u => u.id === selectedUserId)
    if (user) {
      const existingRoles = [...user.directRoles, ...getInheritedRoles(user.groupIds, groups).map(r => r.roleId)]
      const conflicts = roleConflicts[assignRoleId]
      if (conflicts) {
        const conflicting = existingRoles.find(r => conflicts.includes(r))
        if (conflicting) {
          const conflictRoleName = availableRoles.find(r => r.id === conflicting)?.name
          const roleName = availableRoles.find(r => r.id === assignRoleId)?.name
          setAssignRoleConflict(`Role "${roleName}" conflicts with "${conflictRoleName}"`)
          return
        }
      }
    }
    setUsers(users.map(u => u.id === selectedUserId ? { ...u, directRoles: [...new Set([...u.directRoles, assignRoleId])] } : u))
    setIsAssignRoleDialogOpen(false); setAssignRoleId(""); setAssignRoleConflict(null)
    toast({ title: "Role Assigned", description: `Role assigned to ${user?.name}.` })
  }

  const handleRemoveDirectRole = (userId: string, roleId: string) => {
    setUsers(users.map(u => u.id === userId ? { ...u, directRoles: u.directRoles.filter(r => r !== roleId) } : u))
    toast({ title: "Role Removed", description: "Direct role removed." })
  }

  const handleRemoveUserFromGroup = (userId: string, groupId: string) => {
    setUsers(users.map(u => u.id === userId ? { ...u, groupIds: u.groupIds.filter(gId => gId !== groupId) } : u))
    toast({ title: "User Removed", description: "User removed from group." })
  }

  const handleStatusChange = (userId: string, newStatus: "active" | "suspended") => {
    setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus } : u))
    toast({ title: `User ${newStatus === "active" ? "Activated" : "Suspended"}` })
  }

  const handleSaveScope = () => {
    if (!selectedUserId) return
    setUsers(users.map(u => u.id === selectedUserId ? { ...u, scope: editScope } : u))
    setIsEditScopeDialogOpen(false)
    toast({ title: "Scope Updated", description: "User data scope has been updated." })
  }

  const handleCreateGroup = () => {
    if (!newGroupName) {
      toast({ title: "Validation Error", description: "Please enter a group name.", variant: "destructive" })
      return
    }
  const newGroup: Group = {
  id: `group-${Date.now()}`, name: newGroupName, parentId: null,
  roles: newGroupRoles, children: [], tasks: newGroupTasks,
  }
  setGroups([...groups, newGroup])
    setSelectedGroupId(newGroup.id)
    setIsCreateGroupDialogOpen(false)
  setNewGroupName(""); setNewGroupRoles([]); setNewGroupTasks([])
  toast({ title: "Group Created", description: `"${newGroupName}" has been created.` })
  }

  const handleRenameGroup = () => {
    if (!newGroupName || !selectedGroupId) return
    const updateName = (list: Group[]): Group[] =>
      list.map(g => g.id === selectedGroupId ? { ...g, name: newGroupName } : { ...g, children: updateName(g.children) })
    setGroups(updateName(groups))
    setIsRenameGroupDialogOpen(false); setNewGroupName("")
    toast({ title: "Group Renamed", description: `Group renamed to "${newGroupName}".` })
  }

  const handleDeleteGroup = () => {
    if (!selectedGroupId) return
    const removeGroup = (list: Group[]): Group[] =>
      list.filter(g => g.id !== selectedGroupId).map(g => ({ ...g, children: removeGroup(g.children) }))
    setGroups(removeGroup(groups))
    setUsers(users.map(u => ({ ...u, groupIds: u.groupIds.filter(gId => gId !== selectedGroupId) })))
    setSelectedGroupId(null)
    setIsDeleteGroupDialogOpen(false)
    toast({ title: "Group Deleted" })
  }

  const handleAddUserToGroup = (userId: string) => {
    if (!selectedGroupId) return
    setUsers(users.map(u => u.id === userId ? { ...u, groupIds: [...new Set([...u.groupIds, selectedGroupId])] } : u))
    toast({ title: "User Added", description: "User added to group." })
  }

  const handleAddRoleToGroup = (roleId: string) => {
    if (!selectedGroupId) return
    const updateRoles = (list: Group[]): Group[] =>
      list.map(g => g.id === selectedGroupId ? { ...g, roles: [...new Set([...g.roles, roleId])] } : { ...g, children: updateRoles(g.children) })
    setGroups(updateRoles(groups))
    toast({ title: "Role Added", description: "Role added to group." })
  }

  const handleRemoveRoleFromGroup = (roleId: string) => {
    if (!selectedGroupId) return
    const updateRoles = (list: Group[]): Group[] =>
      list.map(g => g.id === selectedGroupId ? { ...g, roles: g.roles.filter(r => r !== roleId) } : { ...g, children: updateRoles(g.children) })
    setGroups(updateRoles(groups))
    toast({ title: "Role Removed", description: "Role removed from group." })
  }

  const handleBulkAssign = () => {
    const selectedIds = Array.from(bulkSelectedUserIds)
    setUsers(users.map(u => {
      if (!bulkSelectedUserIds.has(u.id)) return u
      return {
        ...u,
        groupIds: [...new Set([...u.groupIds, ...bulkAssignGroups])],
        directRoles: [...new Set([...u.directRoles, ...bulkAssignRoles])],
        scope: bulkAssignScope.companyCodes.length || bulkAssignScope.locations.length || bulkAssignScope.plants.length
          ? { companyCodes: [...new Set([...(u.scope?.companyCodes || []), ...bulkAssignScope.companyCodes])], locations: [...new Set([...(u.scope?.locations || []), ...bulkAssignScope.locations])], plants: [...new Set([...(u.scope?.plants || []), ...bulkAssignScope.plants])] }
          : u.scope,
      }
    }))
    setIsBulkAssignDialogOpen(false)
    setBulkAssignGroups([]); setBulkAssignRoles([]); setBulkAssignScope({ companyCodes: [], locations: [], plants: [] })
    setBulkMode(false); setBulkSelectedUserIds(new Set())
    toast({ title: "Bulk Assignment Complete", description: `Updated ${selectedIds.length} user(s).` })
  }

  const parseCSVLine = (line: string): string[] => {
    const result: string[] = []
    let current = ""
    let inQuotes = false
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      const nextChar = line[i + 1]
      
      if (char === '"' && inQuotes && nextChar === '"') {
        current += '"'
        i++
      } else if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim())
        current = ""
      } else {
        current += char
      }
    }
    result.push(current.trim())
    return result
  }

  const handleBulkUploadFileChange = (file: File | null) => {
    if (!file) return
    setBulkUploadFile(file)
    setBulkUploadError(null)
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        let text = e.target?.result as string
        
        // Remove BOM if present
        if (text.charCodeAt(0) === 0xFEFF) {
          text = text.slice(1)
        }
        
        const lines = text.split(/\r?\n/).filter(l => l.trim())
        if (lines.length < 2) {
          setBulkUploadError("CSV must have a header row and at least one data row.")
          return
        }
        
        const header = parseCSVLine(lines[0]).map(h => h.toLowerCase().trim())
        const nameIdx = header.findIndex(h => h === "name" || h === "full name" || h === "user" || h === "username")
        const emailIdx = header.findIndex(h => h === "email" || h === "email address" || h === "e-mail")
        const groupsIdx = header.findIndex(h => h === "groups" || h === "group")
        const rolesIdx = header.findIndex(h => h === "roles" || h === "role")
        const existingEmails = new Set(users.map(u => u.email.toLowerCase()))
        const seenEmails = new Set<string>()
        
        const parsed = lines.slice(1).map((line, idx) => {
          const cols = parseCSVLine(line)
          const name = nameIdx !== -1 ? (cols[nameIdx] || "") : (cols[0] || `User ${idx + 1}`)
          const email = emailIdx !== -1 ? (cols[emailIdx] || "") : (cols[1] || `user${idx + 1}@example.com`)
          const groups = groupsIdx !== -1 && cols[groupsIdx] ? cols[groupsIdx].split(";").map(s => s.trim()).filter(Boolean) : []
          const roles = rolesIdx !== -1 && cols[rolesIdx] ? cols[rolesIdx].split(";").map(s => s.trim()).filter(Boolean) : []
          const emailLower = email.toLowerCase()
          let status: "valid" | "duplicate" | "invalid" = "valid"
          if (!name || !email || !email.includes("@")) status = "invalid"
          else if (existingEmails.has(emailLower) || seenEmails.has(emailLower)) status = "duplicate"
          seenEmails.add(emailLower)
          return { name, email, groups, roles, status }
        })
        setBulkUploadParsed(parsed)
        setBulkUploadStep("preview")
      } catch (err) {
        console.error("[v0] CSV parse error:", err)
        setBulkUploadError("Failed to parse CSV file. Please check the format.")
      }
    }
    reader.readAsText(file, "UTF-8")
  }

  const handleBulkUploadImport = () => {
    const validRows = bulkUploadParsed.filter(r => r.status === "valid")
    const newUsers: User[] = validRows.map(row => {
      const groupIds = row.groups
        .map(gName => allGroups.find(g => g.name.toLowerCase() === gName.toLowerCase())?.id)
        .filter(Boolean) as string[]
      const directRoles = row.roles
        .map(rName => availableRoles.find(r => r.name.toLowerCase() === rName.toLowerCase())?.id)
        .filter(Boolean) as string[]
      return {
        id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        name: row.name,
        email: row.email,
        status: "invited" as const,
        directRoles,
        groupIds,
        lastActive: null,
        invitedAt: new Date().toISOString().split("T")[0],
        createdAt: new Date().toISOString().split("T")[0],
      }
    })
    setUsers(prev => [...prev, ...newUsers])
    setBulkUploadImportedCount(newUsers.length)
    setBulkUploadStep("done")
    toast({ title: "Users Imported", description: `${newUsers.length} user(s) added successfully.` })
  }

  const resetBulkUpload = () => {
    setBulkUploadStep("upload")
    setBulkUploadFile(null)
    setBulkUploadParsed([])
    setBulkUploadError(null)
    setBulkUploadImportedCount(0)
  }

  const downloadCsvTemplate = () => {
    const csvContent = "Name,Email,Groups,Roles\nJohn Doe,john@example.com,Procurement Team,AP Clerk\nJane Smith,jane@example.com,Finance Group;Procurement Team,CFO"
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "user-upload-template.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as "users" | "groups" | "roles")
    setSearchQuery("")
    setSelectedUserId(null)
    setSelectedGroupId(null)
    setSelectedRoleId(null)
    setBulkMode(false)
    setBulkSelectedUserIds(new Set())
    setIsDetailPanelOpen(false)
  }

  // Right Panel content renderers

  const renderUserDetailPanel = () => {
    if (!selectedUser) return renderEmptyPanel("Select a user to view details", Users)
    const inheritedRoles = getInheritedRoles(selectedUser.groupIds, groups)
    const uniqueInherited = inheritedRoles.filter(r => !selectedUser.directRoles.includes(r.roleId))
    const effectiveAccess = getEffectiveAccess(selectedUser)
    const userTasks = getInheritedTasks(selectedUser.groupIds, groups)

    return (
      <div className="h-full flex flex-col">
        {/* Panel header */}
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-semibold text-primary">{selectedUser.name.split(" ").map(n => n[0]).join("")}</span>
            </div>
            <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground truncate">{selectedUser.name}</h3>
                  {getStatusBadge(selectedUser.status)}
                  {selectedUser.directorySource && selectedUser.directorySource !== "manual" && (
                    <Badge variant="outline" className="text-[9px] px-1.5 py-0 gap-1">
                      {selectedUser.directorySource === "azure" && <><Cloud className="h-2.5 w-2.5" />Azure AD</>}
                      {selectedUser.directorySource === "zoho" && <><Database className="h-2.5 w-2.5" />Zoho</>}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate">{selectedUser.email}</p>
                {selectedUser.department && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Building className="h-3 w-3" />{selectedUser.department}
                  </p>
                )}
            </div>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {selectedUser.status === "active" && (
                  <DropdownMenuItem onClick={() => handleStatusChange(selectedUser.id, "suspended")} className="text-orange-600">
                    <UserX className="h-4 w-4 mr-2" />Suspend
                  </DropdownMenuItem>
                )}
                {selectedUser.status === "suspended" && (
                  <DropdownMenuItem onClick={() => handleStatusChange(selectedUser.id, "active")} className="text-green-600">
                    <UserCheck className="h-4 w-4 mr-2" />Activate
                  </DropdownMenuItem>
                )}
                {selectedUser.status === "invited" && (
                  <DropdownMenuItem className="text-blue-600">
                    <Send className="h-4 w-4 mr-2" />Resend Invite
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsDetailPanelOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-5">
            {/* Groups */}
            <section>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <FolderTree className="h-3.5 w-3.5" />Groups
                </h4>
                <Button variant="ghost" size="sm" className="h-6 text-xs px-2" onClick={() => {
                  setAssignRoleId(""); setIsAssignRoleDialogOpen(false)
                  // Re-use group assignment through the add user groups dialog approach
                }}>
                  <Plus className="h-3 w-3 mr-1" />Add
                </Button>
              </div>
              {selectedUser.groupIds.length > 0 ? (
                <div className="space-y-1">
                  {selectedUser.groupIds.map(gId => {
                    const g = allGroups.find(gr => gr.id === gId)
                    return g ? (
                      <div key={gId} className="flex items-center justify-between p-2 bg-muted/50 rounded-md group">
                        <span className="text-sm">{getGroupPath(gId, groups).join(" / ")}</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleRemoveUserFromGroup(selectedUser.id, gId)}>
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : null
                  })}
                </div>
              ) : <p className="text-sm text-muted-foreground">No groups</p>}
            </section>

            {/* Direct Roles */}
            <section>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5" />Direct Roles
                </h4>
                <Button variant="ghost" size="sm" className="h-6 text-xs px-2" onClick={() => {
                  setAssignRoleId(""); setAssignRoleConflict(null); setIsAssignRoleDialogOpen(true)
                }}>
                  <Plus className="h-3 w-3 mr-1" />Add
                </Button>
              </div>
              {userDirectRoles.length > 0 ? (
                <div className="space-y-1">
                  {userDirectRoles.map(role => (
                    <div key={role.id} className="flex items-center justify-between p-2 border rounded-md group">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{role.name}</span>
                        <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${getPrivilegeBadgeClasses(getPrivilegeLevel(role))}`}>
                          {getPrivilegeLevel(role)}
                        </Badge>
                      </div>
                      <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-red-500" onClick={() => handleRemoveDirectRole(selectedUser.id, role.id)}>
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : <p className="text-sm text-muted-foreground">No direct roles</p>}
            </section>

            {/* Inherited Roles */}
            <section>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-2">
                <GitBranch className="h-3.5 w-3.5" />Inherited Roles
              </h4>
              {uniqueInherited.length > 0 ? (
                <div className="space-y-1">
                  {uniqueInherited.map(({ roleId, source }) => {
                    const role = availableRoles.find(r => r.id === roleId)
                    if (!role) return null
                    return (
                      <div key={`${roleId}-${source}`} className="flex items-center justify-between p-2 border border-dashed rounded-md">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{role.name}</span>
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                            <GitBranch className="h-2.5 w-2.5 mr-0.5" />{source}
                          </Badge>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : <p className="text-sm text-muted-foreground">No inherited roles</p>}
            </section>

            {/* Data Scope */}
            <section>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />Data Scope
                </h4>
                <Button variant="ghost" size="sm" className="h-6 text-xs px-2" onClick={() => {
                  setEditScope(selectedUser.scope || { companyCodes: [], locations: [], plants: [] })
                  setIsEditScopeDialogOpen(true)
                }}>
                  <Pencil className="h-3 w-3 mr-1" />Edit
                </Button>
              </div>
              {selectedUser.scope ? (
                <div className="space-y-2">
                  {selectedUser.scope.companyCodes.length > 0 && (
                    <div>
                      <p className="text-[10px] font-medium text-muted-foreground mb-1">COMPANY CODES</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedUser.scope.companyCodes.map(c => <Badge key={c} variant="outline" className="text-xs"><Building2 className="h-3 w-3 mr-1" />{c}</Badge>)}
                      </div>
                    </div>
                  )}
                  {selectedUser.scope.locations.length > 0 && (
                    <div>
                      <p className="text-[10px] font-medium text-muted-foreground mb-1">LOCATIONS</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedUser.scope.locations.map(l => <Badge key={l} variant="outline" className="text-xs"><MapPin className="h-3 w-3 mr-1" />{l}</Badge>)}
                      </div>
                    </div>
                  )}
                  {selectedUser.scope.plants.length > 0 && (
                    <div>
                      <p className="text-[10px] font-medium text-muted-foreground mb-1">PLANTS</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedUser.scope.plants.map(p => <Badge key={p} variant="outline" className="text-xs"><Factory className="h-3 w-3 mr-1" />{p}</Badge>)}
                      </div>
                    </div>
                  )}
                  {!selectedUser.scope.companyCodes.length && !selectedUser.scope.locations.length && !selectedUser.scope.plants.length && (
                    <p className="text-sm text-muted-foreground">No scope defined</p>
                  )}
                </div>
              ) : <p className="text-sm text-muted-foreground">No scope defined</p>}
            </section>

            {/* Tasks */}
            <section>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-2">
                <ClipboardList className="h-3.5 w-3.5" />Tasks (from Groups)
              </h4>
              {userTasks.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {userTasks.map(t => <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>)}
                </div>
              ) : <p className="text-sm text-muted-foreground">No tasks inherited</p>}
            </section>

            {/* Effective Access */}
            <section>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-2">
                <Eye className="h-3.5 w-3.5" />Effective Access
              </h4>
              <Card>
                <CardContent className="p-3 space-y-3">
                  <div>
                    <p className="text-[10px] font-medium text-muted-foreground mb-1">LAYOUTS</p>
                    <div className="flex flex-wrap gap-1">
                      {effectiveAccess.layouts.map(l => <Badge key={l} variant="outline" className="text-xs"><Layers className="h-3 w-3 mr-1" />{l}</Badge>)}
                      {effectiveAccess.layouts.length === 0 && <span className="text-xs text-muted-foreground">None</span>}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-medium text-muted-foreground mb-1">ACTIONS</p>
                    <div className="flex flex-wrap gap-1">
                      {effectiveAccess.actions.map(a => <Badge key={a} variant="outline" className="text-xs"><Zap className="h-3 w-3 mr-1" />{a}</Badge>)}
                      {effectiveAccess.actions.length === 0 && <span className="text-xs text-muted-foreground">None</span>}
                    </div>
                  </div>
                </CardContent>
              </Card>
              <p className="text-[10px] text-muted-foreground mt-1.5 flex items-center gap-1"><Info className="h-3 w-3" />Computed from direct + inherited roles</p>
            </section>
          </div>
        </ScrollArea>
      </div>
    )
  }

  const renderGroupDetailPanel = () => {
    if (!selectedGroup) return renderEmptyPanel("Select a group to view details", Folder)

    return (
      <div className="h-full flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="min-w-0">
            <h3 className="font-semibold text-foreground truncate">{selectedGroup.name}</h3>
            <p className="text-xs text-muted-foreground">{getGroupPath(selectedGroupId!, groups).join(" / ")}</p>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setNewGroupName(selectedGroup.name); setIsRenameGroupDialogOpen(true) }}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Rename</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => setIsDeleteGroupDialogOpen(true)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Delete</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsDetailPanelOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-5">
            {/* Users */}
            <section>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5" />Users ({usersInSelectedGroup.length})
                </h4>
                <Button variant="ghost" size="sm" className="h-6 text-xs px-2" onClick={() => setIsCreateUserDialogOpen(true)}>
                  <Plus className="h-3 w-3 mr-1" />Add
                </Button>
              </div>
              {usersInSelectedGroup.length > 0 ? (
                <div className="space-y-1">
                  {usersInSelectedGroup.map(u => (
                    <div key={u.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-md group">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-[10px] font-semibold text-primary">{u.name.split(" ").map(n => n[0]).join("")}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{u.name}</p>
                          <p className="text-[10px] text-muted-foreground truncate">{u.email}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" onClick={() => handleRemoveUserFromGroup(u.id, selectedGroupId!)}>
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : <p className="text-sm text-muted-foreground">No users in this group</p>}
            </section>

            {/* Roles */}
            <section>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5" />Roles ({selectedGroup.roles.length})
                </h4>
                <Button variant="ghost" size="sm" className="h-6 text-xs px-2" onClick={() => setIsAddRoleToGroupDialogOpen(true)}>
                  <Plus className="h-3 w-3 mr-1" />Add
                </Button>
              </div>
              {selectedGroup.roles.length > 0 ? (
                <div className="space-y-1">
                  {selectedGroup.roles.map(roleId => {
                    const role = availableRoles.find(r => r.id === roleId)
                    if (!role) return null
                    return (
                      <div key={roleId} className="flex items-center justify-between p-2 border rounded-md group">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{role.name}</span>
                          <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${getPrivilegeBadgeClasses(getPrivilegeLevel(role))}`}>
                            {getPrivilegeLevel(role)}
                          </Badge>
                        </div>
                        <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-red-500" onClick={() => handleRemoveRoleFromGroup(roleId)}>
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    )
                  })}
                </div>
              ) : <p className="text-sm text-muted-foreground">No roles assigned</p>}
            </section>

            {/* Tasks */}
            <section>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-2">
                <ClipboardList className="h-3.5 w-3.5" />Tasks
              </h4>
              {selectedGroup.tasks && selectedGroup.tasks.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {selectedGroup.tasks.map(t => <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>)}
                </div>
              ) : <p className="text-sm text-muted-foreground">No tasks assigned</p>}
            </section>
          </div>
        </ScrollArea>
      </div>
    )
  }

  const renderRoleDetailPanel = () => {
    if (!selectedRole) return renderEmptyPanel("Select a role to view details", Shield)

    return (
      <div className="h-full flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground truncate">{selectedRole.name}</h3>
              {selectedRole.isSystem && <Badge variant="outline" className="text-[10px] px-1.5 py-0"><Lock className="h-2.5 w-2.5 mr-0.5" />System</Badge>}
            </div>
            <p className="text-xs text-muted-foreground">{selectedRole.description}</p>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0" onClick={() => setSelectedRoleId(null)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-5">
            {/* Users */}
            <section>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-2">
                <Users className="h-3.5 w-3.5" />Users ({usersWithSelectedRole.length})
              </h4>
              {usersWithSelectedRole.length > 0 ? (
                <div className="space-y-1">
                  {usersWithSelectedRole.map(u => (
                    <div key={u.id} className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-[10px] font-semibold text-primary">{u.name.split(" ").map(n => n[0]).join("")}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{u.name}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{u.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : <p className="text-sm text-muted-foreground">No users with this role</p>}
            </section>

            {/* Groups */}
            <section>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-2">
                <Users className="h-3.5 w-3.5" />Groups ({groupsWithSelectedRole.length})
              </h4>
              {groupsWithSelectedRole.length > 0 ? (
                <div className="space-y-1">
                  {groupsWithSelectedRole.map(g => (
                    <div key={g.id} className="p-2 bg-muted/50 rounded-md text-sm">{getGroupPath(g.id, groups).join(" / ")}</div>
                  ))}
                </div>
              ) : <p className="text-sm text-muted-foreground">No groups with this role</p>}
            </section>

            {/* Privileges */}
            <section>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-2">
                <Zap className="h-3.5 w-3.5" />Privileges
              </h4>
              <div className="mb-2">
                <Badge className={`${getPrivilegeBadgeClasses(getPrivilegeLevel(selectedRole))}`}>
                  {getPrivilegeLevel(selectedRole)}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-medium text-muted-foreground mb-1">ACTIONS</p>
                {selectedRole.actions.map(a => (
                  <div key={a} className="p-2 bg-muted/50 rounded-md text-sm flex items-center gap-2">
                    <Zap className="h-3 w-3 text-muted-foreground" />{a}
                  </div>
                ))}
              </div>
              <div className="mt-3 space-y-1">
                <p className="text-[10px] font-medium text-muted-foreground mb-1">LAYOUTS</p>
                <div className="flex flex-wrap gap-1">
                  {selectedRole.layouts.map(l => <Badge key={l} variant="outline" className="text-xs"><Layers className="h-3 w-3 mr-1" />{l}</Badge>)}
                </div>
              </div>
            </section>

            {/* Conflicts */}
            {roleConflicts[selectedRole.id] && (
              <section>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-orange-600 flex items-center gap-1.5 mb-2">
                  <AlertTriangle className="h-3.5 w-3.5" />Conflicts
                </h4>
                <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="text-sm text-orange-700">
                    Conflicts with: {roleConflicts[selectedRole.id].map(id => availableRoles.find(r => r.id === id)?.name).join(", ")}
                  </p>
                </div>
              </section>
            )}
          </div>
        </ScrollArea>
      </div>
    )
  }

  const renderEmptyPanel = (message: string, Icon: React.ElementType) => (
    <div className="h-full flex items-center justify-center text-muted-foreground">
      <div className="text-center">
        <Icon className="h-10 w-10 mx-auto mb-3 opacity-30" />
        <p className="text-sm">{message}</p>
      </div>
    </div>
  )

  return (
    <div className="h-full bg-background overflow-hidden flex flex-col">
      <Header title="Access Management" />

      {/* Breadcrumb + Title */}
      <div className="px-6 pt-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Link href="/sop/settings" className="hover:text-foreground transition-colors">Settings</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">Access Management</span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground mb-1">Access Management</h1>
            <p className="text-sm text-muted-foreground">Manage users, groups, roles, and permissions in one place</p>
          </div>
        </div>

        {/* Top Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList>
            <TabsTrigger value="users" className="gap-1.5"><Users className="h-3.5 w-3.5" />Users</TabsTrigger>
            <TabsTrigger value="groups" className="gap-1.5"><Folder className="h-3.5 w-3.5" />Groups</TabsTrigger>
            <TabsTrigger value="roles" className="gap-1.5"><Shield className="h-3.5 w-3.5" />Roles</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Main Content: two-panel layout */}
      <div className="flex-1 flex overflow-hidden px-6 pb-6 pt-4 gap-4">
        {/* LEFT PANEL: Entity list */}
        <div className="flex-1 min-w-0 flex flex-col border rounded-lg bg-card overflow-hidden">
          {/* List header with search + actions */}
          <div className="p-3 border-b">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-semibold text-sm text-foreground">
                {activeTab === "users" && `Users (${filteredUsers.length})`}
                {activeTab === "groups" && `Groups (${filteredGroupsList.length})`}
                {activeTab === "roles" && `Roles (${filteredRoles.length})`}
              </h2>
              <div className="flex items-center gap-1.5">
                {activeTab === "users" && bulkMode && bulkSelectedUserIds.size > 0 && (
                  <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setIsBulkAssignDialogOpen(true)}>
                    Bulk Assign ({bulkSelectedUserIds.size})
                  </Button>
                )}
                {activeTab === "users" && (
                  <>
                    <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => { setBulkMode(!bulkMode); setBulkSelectedUserIds(new Set()) }}>
                      {bulkMode ? "Cancel" : "Select"}
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => { resetBulkUpload(); setIsBulkUploadDialogOpen(true) }}>
                      <Upload className="h-3.5 w-3.5 mr-1" />Bulk Upload
                    </Button>
                    <Button size="sm" className="h-7 text-xs" onClick={() => setIsCreateUserDialogOpen(true)}>
                      <Plus className="h-3.5 w-3.5 mr-1" />Add User
                    </Button>
                  </>
                )}
                {activeTab === "groups" && (
                  <Button size="sm" className="h-7 text-xs" onClick={() => setIsCreateGroupDialogOpen(true)}>
                    <Plus className="h-3.5 w-3.5 mr-1" />Add Group
                  </Button>
                )}
              </div>
            </div>
            {/* Search and Filters in one row */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative w-[240px]">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder={`Search ${activeTab}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 h-8 text-xs"
                />
              </div>

              {/* User filters */}
              {activeTab === "users" && (
                <>
                  <Select value={filterGroup} onValueChange={setFilterGroup}>
                    <SelectTrigger className="h-8 w-[140px] text-xs border-input">
                      <SelectValue placeholder="All Groups" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Groups</SelectItem>
                      {allGroups.map(g => (
                        <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={filterRole} onValueChange={setFilterRole}>
                    <SelectTrigger className="h-8 w-[140px] text-xs border-input">
                      <SelectValue placeholder="All Roles" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      {availableRoles.map(r => (
                        <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={filterLocation} onValueChange={setFilterLocation}>
                    <SelectTrigger className="h-8 w-[140px] text-xs border-input">
                      <SelectValue placeholder="All Locations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      {uniqueLocations.map(loc => (
                        <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={filterCompanyCode} onValueChange={setFilterCompanyCode}>
                    <SelectTrigger className="h-8 w-[140px] text-xs border-input">
                      <SelectValue placeholder="All Co. Codes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Company Codes</SelectItem>
                      {uniqueCompanyCodes.map(cc => (
                        <SelectItem key={cc} value={cc}>{cc}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={filterPlant} onValueChange={setFilterPlant}>
                    <SelectTrigger className="h-8 w-[140px] text-xs border-input">
                      <SelectValue placeholder="All Plants" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Plants</SelectItem>
                      {uniquePlants.map(p => (
                        <SelectItem key={p} value={p}>{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {activeFilterCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs text-muted-foreground"
                      onClick={() => { setFilterGroup("all"); setFilterRole("all"); setFilterLocation("all"); setFilterCompanyCode("all"); setFilterPlant("all") }}
                    >
                      Clear ({activeFilterCount})
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* List content */}
          <ScrollArea className="flex-1">
            {/* USERS TAB */}
            {activeTab === "users" && (
              <Table>
                <TableHeader>
                  <TableRow>
                    {bulkMode && <TableHead className="w-[40px]" />}
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Groups</TableHead>
                    <TableHead>Roles</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Company Code</TableHead>
                    <TableHead>Plants</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[100px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map(user => {
                    const inherited = getInheritedRoles(user.groupIds, groups)
                    const allRoleIds = new Set([...user.directRoles, ...inherited.map(r => r.roleId)])
                    const isSelected = selectedUserId === user.id
                    const isBulkSelected = bulkSelectedUserIds.has(user.id)

                    return (
                      <TableRow
                        key={user.id}
                        className={`transition-colors ${bulkMode ? "cursor-pointer" : ""} ${isSelected && isDetailPanelOpen ? "bg-primary/5" : "hover:bg-muted/50"}`}
                        onClick={() => {
                          if (bulkMode) {
                            setBulkSelectedUserIds(prev => {
                              const next = new Set(prev)
                              if (next.has(user.id)) next.delete(user.id)
                              else next.add(user.id)
                              return next
                            })
                          }
                        }}
                      >
                        {bulkMode && (
                          <TableCell><Checkbox checked={isBulkSelected} /></TableCell>
                        )}
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{user.name}</span>
                            {user.directorySource && user.directorySource !== "manual" && (
                              <Badge variant="outline" className="text-[9px] px-1.5 py-0 gap-1">
                                {user.directorySource === "azure" && <><Cloud className="h-2.5 w-2.5" />Azure</>}
                                {user.directorySource === "zoho" && <><Database className="h-2.5 w-2.5" />Zoho</>}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-xs">{user.email}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {user.groupIds.map(gId => {
                              const g = allGroups.find(gr => gr.id === gId)
                              return g ? <Badge key={gId} variant="secondary" className="text-[10px] px-1.5 py-0">{g.name}</Badge> : null
                            })}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-muted-foreground">{allRoleIds.size}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {(user.scope?.locations || []).length > 0
                              ? (user.scope?.locations || []).map(loc => <Badge key={loc} variant="outline" className="text-[10px] px-1.5 py-0">{loc}</Badge>)
                              : <span className="text-xs text-muted-foreground">--</span>}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {(user.scope?.companyCodes || []).length > 0
                              ? (user.scope?.companyCodes || []).map(cc => <Badge key={cc} variant="outline" className="text-[10px] px-1.5 py-0">{cc}</Badge>)
                              : <span className="text-xs text-muted-foreground">--</span>}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {(user.scope?.plants || []).length > 0
                              ? (user.scope?.plants || []).map(p => <Badge key={p} variant="outline" className="text-[10px] px-1.5 py-0">{p}</Badge>)
                              : <span className="text-xs text-muted-foreground">--</span>}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(user.status)}</TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 text-xs"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedUserId(user.id)
                              setIsDetailPanelOpen(true)
                            }}
                          >
                            <Eye className="h-3.5 w-3.5 mr-1" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}

            {/* GROUPS TAB */}
            {activeTab === "groups" && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Group</TableHead>
                    <TableHead>Users</TableHead>
                    <TableHead>Roles</TableHead>
                    <TableHead>Tasks</TableHead>
                    <TableHead className="w-[100px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGroupsList.map(group => {
                    const groupUsers = users.filter(u => u.groupIds.includes(group.id))
                    const displayUsers = groupUsers.slice(0, 2)
                    const remainingCount = groupUsers.length - 2
                    const isSelected = selectedGroupId === group.id
                    return (
                      <TableRow
                        key={group.id}
                        className={`transition-colors ${isSelected && isDetailPanelOpen ? "bg-primary/5" : "hover:bg-muted/50"}`}
                      >
                        <TableCell>
                          <div>
                            <p className="font-medium">{group.name}</p>
                            <p className="text-[10px] text-muted-foreground">{getGroupPath(group.id, groups).join(" / ")}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {groupUsers.length === 0 ? (
                            <span className="text-xs text-muted-foreground">No users</span>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              {displayUsers.map(user => (
                                <div key={user.id} className="flex items-center gap-1.5">
                                  <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                                    <span className="text-[9px] font-semibold text-white">
                                      {user.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                                    </span>
                                  </div>
                                  <span className="text-xs font-medium max-w-[100px] truncate">{user.name}</span>
                                </div>
                              ))}
                              {remainingCount > 0 && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0 cursor-help">
                                        +{remainingCount}
                                      </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-[200px]">
                                      <div className="space-y-1">
                                        {groupUsers.slice(2).map(user => (
                                          <p key={user.id} className="text-xs">{user.name}</p>
                                        ))}
                                      </div>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {group.roles.map(roleId => {
                              const role = availableRoles.find(r => r.id === roleId)
                              return role ? <Badge key={roleId} variant="secondary" className="text-[10px] px-1.5 py-0">{role.name}</Badge> : null
                            })}
                            {group.roles.length === 0 && <span className="text-xs text-muted-foreground">--</span>}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-xs text-muted-foreground">{group.tasks?.length || 0}</span>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 text-xs"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedGroupId(group.id)
                              setIsDetailPanelOpen(true)
                            }}
                          >
                            <Eye className="h-3.5 w-3.5 mr-1" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}

            {/* ROLES TAB */}
            {activeTab === "roles" && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role</TableHead>
                    <TableHead>Privilege</TableHead>
                    <TableHead>Users</TableHead>
                    <TableHead>Groups</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRoles.map(role => {
                    const privilegeLevel = getPrivilegeLevel(role)
                    const usersCount = users.filter(u => u.directRoles.includes(role.id)).length
                    const groupsCount = allGroups.filter(g => g.roles.includes(role.id)).length
                    const isSelected = selectedRoleId === role.id
                    return (
                      <TableRow
                        key={role.id}
                        className={`cursor-pointer transition-colors ${isSelected ? "bg-primary/5" : "hover:bg-muted/50"}`}
                        onClick={() => setSelectedRoleId(role.id)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{role.name}</span>
                            {role.isSystem && <Badge variant="outline" className="text-[10px] px-1.5 py-0"><Lock className="h-2.5 w-2.5 mr-0.5" />System</Badge>}
                          </div>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{role.category}</p>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`text-xs ${getPrivilegeBadgeClasses(privilegeLevel)}`}>
                            {privilegeLevel}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Users className="h-3 w-3" />{usersCount}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Users className="h-3 w-3" />{groupsCount}
                          </span>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </ScrollArea>
        </div>

        {/* RIGHT PANEL: Relationship/detail panel */}
        {isDetailPanelOpen && (
          <div className="w-[420px] h-full flex-shrink-0 border rounded-lg bg-card overflow-hidden">
            {activeTab === "users" && renderUserDetailPanel()}
            {activeTab === "groups" && renderGroupDetailPanel()}
            {activeTab === "roles" && renderRoleDetailPanel()}
          </div>
        )}
      </div>

      {/* ==================== DIALOGS ==================== */}

      {/* Create User Dialog */}
      <Dialog open={isCreateUserDialogOpen} onOpenChange={(open) => { 
        setIsCreateUserDialogOpen(open); 
        if (!open) { 
          setAddUserSource("manual"); 
          setCreateUserName(""); 
          setCreateUserEmail(""); 
          setCreateUserGroups([]); 
          setCreateUserDirectRoles([]); 
          setCreateUserScope({ companyCodes: [], locations: [], plants: [] });
          setSelectedDirectoryUsers([]);
          setDirectoryAssignGroups([]);
          setDirectoryAssignRoles([]);
          setDirectoryAssignScope({ companyCodes: [], locations: [], plants: [] });
          setDirectorySearchQuery("");
        } 
      }}>
        <DialogContent className="max-w-5xl sm:max-w-5xl h-[600px] flex flex-col">
          <DialogHeader>
            <DialogTitle>Add Users</DialogTitle>
            <DialogDescription>
              {addUserSource === "manual" && "Add a user manually or import from a directory service."}
              {addUserSource === "azure" && "Search and import users from Microsoft Azure AD."}
              {addUserSource === "zoho" && "Search and import users from Zoho Directory."}
            </DialogDescription>
          </DialogHeader>

          {/* Source Selector */}
          <div className="flex items-center gap-1 p-1 bg-muted rounded-lg w-fit">
            <Button
              variant={addUserSource === "manual" ? "secondary" : "ghost"}
              size="sm"
              className="h-8 text-xs"
              onClick={() => setAddUserSource("manual")}
            >
              <UserPlus className="h-3.5 w-3.5 mr-1.5" />
              Add Individually
            </Button>
            <Button
              variant={addUserSource === "azure" ? "secondary" : "ghost"}
              size="sm"
              className="h-8 text-xs"
              onClick={() => setAddUserSource("azure")}
            >
              <Cloud className="h-3.5 w-3.5 mr-1.5" />
              Microsoft Azure AD
            </Button>
            <Button
              variant={addUserSource === "zoho" ? "secondary" : "ghost"}
              size="sm"
              className="h-8 text-xs"
              onClick={() => setAddUserSource("zoho")}
            >
              <Database className="h-3.5 w-3.5 mr-1.5" />
              Zoho Directory
            </Button>
          </div>

          <ScrollArea className="flex-1 h-[400px] -mx-6 px-6">
            {/* Manual Entry */}
            {addUserSource === "manual" && (
              <div className="space-y-4 py-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Name *</Label>
                    <Input placeholder="Full name" value={createUserName} onChange={(e) => setCreateUserName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Email *</Label>
                    <Input type="email" placeholder="email@company.com" value={createUserEmail} onChange={(e) => setCreateUserEmail(e.target.value)} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Groups</Label>
                  <div className="max-h-32 overflow-auto border rounded-lg p-2 space-y-1">
                    {allGroups.map(g => (
                      <div key={g.id} className="flex items-center gap-2 p-1.5 rounded hover:bg-muted/50">
                        <Checkbox checked={createUserGroups.includes(g.id)} onCheckedChange={(checked) => {
                          setCreateUserGroups(checked ? [...createUserGroups, g.id] : createUserGroups.filter(id => id !== g.id))
                        }} />
                        <span className="text-sm">{getGroupPath(g.id, groups).join(" / ")}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Direct Roles</Label>
                  <div className="max-h-32 overflow-auto border rounded-lg p-2 space-y-1">
                    {availableRoles.map(role => (
                      <div key={role.id} className="flex items-center gap-2 p-1.5 rounded hover:bg-muted/50">
                        <Checkbox checked={createUserDirectRoles.includes(role.id)} onCheckedChange={(checked) => {
                          setCreateUserDirectRoles(checked ? [...createUserDirectRoles, role.id] : createUserDirectRoles.filter(id => id !== role.id))
                        }} />
                        <span className="text-sm">{role.name}</span>
                        <Badge variant="secondary" className="text-[10px]">{role.category}</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Data Scope</Label>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Company Codes (comma-separated)</Label>
                      <Input placeholder="e.g. 1000, 2000" value={createUserScope.companyCodes.join(", ")} onChange={(e) => setCreateUserScope({ ...createUserScope, companyCodes: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Locations (comma-separated)</Label>
                      <Input placeholder="e.g. New York, London" value={createUserScope.locations.join(", ")} onChange={(e) => setCreateUserScope({ ...createUserScope, locations: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Plants (comma-separated)</Label>
                      <Input placeholder="e.g. Plant A, Plant B" value={createUserScope.plants.join(", ")} onChange={(e) => setCreateUserScope({ ...createUserScope, plants: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Directory Import (Azure or Zoho) */}
            {(addUserSource === "azure" || addUserSource === "zoho") && (
              <div className="space-y-4 py-2">
                <div className="grid grid-cols-2 gap-4">
                  {/* Left: Directory Search */}
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label>Search {addUserSource === "azure" ? "Azure AD" : "Zoho Directory"}</Label>
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search by name, email, or department"
                          className="pl-8"
                          value={directorySearchQuery}
                          onChange={(e) => setDirectorySearchQuery(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="border rounded-lg overflow-hidden">
                      <div className="bg-muted/50 px-3 py-2 border-b">
                        <p className="text-xs font-medium text-muted-foreground">Available Users ({filteredDirectoryUsers.length})</p>
                      </div>
                      <ScrollArea className="h-[280px]">
                        <div className="p-2 space-y-1">
                          {filteredDirectoryUsers.map(user => (
                            <div
                              key={user.id}
                              className={`flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 cursor-pointer transition-colors ${selectedDirectoryUsers.includes(user.id) ? "bg-primary/10 border border-primary/30" : ""}`}
                              onClick={() => {
                                setSelectedDirectoryUsers(prev =>
                                  prev.includes(user.id) ? prev.filter(id => id !== user.id) : [...prev, user.id]
                                )
                              }}
                            >
                              <Checkbox checked={selectedDirectoryUsers.includes(user.id)} />
                              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                                <span className="text-xs font-semibold text-white">{user.name.split(" ").map(n => n[0]).join("")}</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{user.name}</p>
                                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                              </div>
                              <Badge variant="outline" className="text-[10px] flex-shrink-0">{user.department}</Badge>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>

                    {selectedDirectoryUsers.length > 0 && (
                      <div className="flex items-center gap-2 p-2 bg-primary/10 rounded-lg border border-primary/30">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">{selectedDirectoryUsers.length} user(s) selected</span>
                      </div>
                    )}
                  </div>

                  {/* Right: Assignment */}
                  <div className="space-y-3">
                    <Label>Assign Permissions</Label>

                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Groups</Label>
                      <div className="max-h-24 overflow-auto border rounded-lg p-2 space-y-1">
                        {allGroups.map(g => (
                          <div key={g.id} className="flex items-center gap-2 p-1.5 rounded hover:bg-muted/50">
                            <Checkbox checked={directoryAssignGroups.includes(g.id)} onCheckedChange={(checked) => {
                              setDirectoryAssignGroups(checked ? [...directoryAssignGroups, g.id] : directoryAssignGroups.filter(id => id !== g.id))
                            }} />
                            <span className="text-xs">{getGroupPath(g.id, groups).join(" / ")}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Roles</Label>
                      <div className="max-h-24 overflow-auto border rounded-lg p-2 space-y-1">
                        {availableRoles.map(role => (
                          <div key={role.id} className="flex items-center gap-2 p-1.5 rounded hover:bg-muted/50">
                            <Checkbox checked={directoryAssignRoles.includes(role.id)} onCheckedChange={(checked) => {
                              setDirectoryAssignRoles(checked ? [...directoryAssignRoles, role.id] : directoryAssignRoles.filter(id => id !== role.id))
                            }} />
                            <span className="text-xs">{role.name}</span>
                            <Badge variant="secondary" className="text-[9px]">{role.category}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Data Scope</Label>
                      <div className="space-y-2">
                        <Input
                          placeholder="Company Codes (e.g. 1000, 2000)"
                          className="text-xs h-8"
                          value={directoryAssignScope.companyCodes.join(", ")}
                          onChange={(e) => setDirectoryAssignScope({ ...directoryAssignScope, companyCodes: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
                        />
                        <Input
                          placeholder="Locations (e.g. New York, London)"
                          className="text-xs h-8"
                          value={directoryAssignScope.locations.join(", ")}
                          onChange={(e) => setDirectoryAssignScope({ ...directoryAssignScope, locations: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
                        />
                        <Input
                          placeholder="Plants (e.g. Plant A, Plant B)"
                          className="text-xs h-8"
                          value={directoryAssignScope.plants.join(", ")}
                          onChange={(e) => setDirectoryAssignScope({ ...directoryAssignScope, plants: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </ScrollArea>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateUserDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateUser}>
              {addUserSource === "manual" ? (
                <><Send className="h-4 w-4 mr-2" />Create User</>
              ) : (
                <><Download className="h-4 w-4 mr-2" />Import Users ({selectedDirectoryUsers.length})</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Role Dialog */}
      <Dialog open={isAssignRoleDialogOpen} onOpenChange={(open) => { setIsAssignRoleDialogOpen(open); if (!open) { setAssignRoleConflict(null); setAssignRoleId("") } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Role</DialogTitle>
            <DialogDescription>Assign a direct role to {selectedUser?.name}.</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={assignRoleId} onValueChange={(val) => { setAssignRoleId(val); setAssignRoleConflict(null) }}>
                <SelectTrigger><SelectValue placeholder="Select a role" /></SelectTrigger>
                <SelectContent>
                  {availableRoles.filter(r => !selectedUser?.directRoles.includes(r.id)).map(role => (
                    <SelectItem key={role.id} value={role.id}>{role.name} ({role.category})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {assignRoleConflict && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-700">{assignRoleConflict}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignRoleDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAssignRole} disabled={!assignRoleId}>Assign Role</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Scope Dialog */}
      <Dialog open={isEditScopeDialogOpen} onOpenChange={setIsEditScopeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Data Scope</DialogTitle>
            <DialogDescription>Update data scope for {selectedUser?.name}.</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label className="text-xs">Company Codes (comma-separated)</Label>
              <Input value={editScope.companyCodes.join(", ")} onChange={(e) => setEditScope({ ...editScope, companyCodes: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Locations (comma-separated)</Label>
              <Input value={editScope.locations.join(", ")} onChange={(e) => setEditScope({ ...editScope, locations: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Plants (comma-separated)</Label>
              <Input value={editScope.plants.join(", ")} onChange={(e) => setEditScope({ ...editScope, plants: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditScopeDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveScope}>Save Scope</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Group Dialog */}
      <Dialog open={isCreateGroupDialogOpen} onOpenChange={setIsCreateGroupDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Group</DialogTitle>
            <DialogDescription>Create a new group with optional role and task assignments.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[60vh] overflow-auto">
            <div className="space-y-2">
              <Label>Group Name *</Label>
              <Input placeholder="Enter group name" value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>Roles</Label>
              <div className="max-h-32 overflow-auto border rounded-lg p-2 space-y-1">
                {availableRoles.map(role => (
                  <div key={role.id} className="flex items-center gap-2 p-1.5 rounded hover:bg-muted/50">
                    <Checkbox checked={newGroupRoles.includes(role.id)} onCheckedChange={(checked) => {
                      setNewGroupRoles(checked ? [...newGroupRoles, role.id] : newGroupRoles.filter(id => id !== role.id))
                    }} />
                    <span className="text-sm">{role.name}</span>
                    <Badge variant="secondary" className="text-[10px]">{role.category}</Badge>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Tasks / Modules</Label>
              <div className="max-h-32 overflow-auto border rounded-lg p-2 space-y-1">
                {availableTasks.map(task => (
                  <div key={task} className="flex items-center gap-2 p-1.5 rounded hover:bg-muted/50">
                    <Checkbox checked={newGroupTasks.includes(task)} onCheckedChange={(checked) => {
                      setNewGroupTasks(checked ? [...newGroupTasks, task] : newGroupTasks.filter(t => t !== task))
                    }} />
                    <span className="text-sm">{task}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsCreateGroupDialogOpen(false); setNewGroupName(""); setNewGroupRoles([]); setNewGroupTasks([]) }}>Cancel</Button>
            <Button onClick={handleCreateGroup}><Plus className="h-4 w-4 mr-2" />Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Group Dialog */}
      <Dialog open={isRenameGroupDialogOpen} onOpenChange={setIsRenameGroupDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Rename Group</DialogTitle></DialogHeader>
          <div className="py-4">
            <Label>Group Name *</Label>
            <Input className="mt-2" value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsRenameGroupDialogOpen(false); setNewGroupName("") }}>Cancel</Button>
            <Button onClick={handleRenameGroup}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Group Dialog */}
      <Dialog open={isDeleteGroupDialogOpen} onOpenChange={setIsDeleteGroupDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center gap-2"><AlertTriangle className="h-5 w-5" />Delete Group</DialogTitle>
            <DialogDescription>{"Are you sure you want to delete"} {`"${selectedGroup?.name}"`}{"?"}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg space-y-2">
              <p className="text-sm text-red-700">{usersInSelectedGroup.length} user(s) will be removed from this group.</p>
              {selectedGroup && selectedGroup.roles.length > 0 && (
                <p className="text-sm text-red-700">Roles: {selectedGroup.roles.map(r => availableRoles.find(ar => ar.id === r)?.name).join(", ")}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteGroupDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteGroup}><Trash2 className="h-4 w-4 mr-2" />Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add User to Group Dialog */}
      <Dialog open={isAddUserToGroupDialogOpen} onOpenChange={setIsAddUserToGroupDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add User to {selectedGroup?.name}</DialogTitle>
            <DialogDescription>Select a user to add to this group.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="max-h-64 overflow-auto border rounded-lg">
              {users.filter(u => !u.groupIds.includes(selectedGroupId || "")).length === 0 ? (
                <div className="p-4 text-center text-muted-foreground"><p>All users are already members</p></div>
              ) : (
                users.filter(u => !u.groupIds.includes(selectedGroupId || "")).map(user => (
                  <div key={user.id} className="flex items-center justify-between p-3 border-b last:border-b-0 hover:bg-muted/50">
                    <div>
                      <p className="font-medium text-sm">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => { handleAddUserToGroup(user.id); setIsAddUserToGroupDialogOpen(false) }}>
                      <UserPlus className="h-4 w-4 mr-1" />Add
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddUserToGroupDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Role to Group Dialog */}
      <Dialog open={isAddRoleToGroupDialogOpen} onOpenChange={setIsAddRoleToGroupDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Role to {selectedGroup?.name}</DialogTitle>
            <DialogDescription>Select a role to assign to this group. Members will inherit it.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="max-h-64 overflow-auto border rounded-lg">
              {availableRoles.filter(r => !selectedGroup?.roles.includes(r.id)).map(role => (
                <div key={role.id} className="flex items-center justify-between p-3 border-b last:border-b-0 hover:bg-muted/50">
                  <div>
                    <p className="font-medium text-sm">{role.name}</p>
                    <p className="text-xs text-muted-foreground">{role.description}</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => { handleAddRoleToGroup(role.id); setIsAddRoleToGroupDialogOpen(false) }}>
                    <Plus className="h-4 w-4 mr-1" />Add
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddRoleToGroupDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Assign Dialog */}
      <Dialog open={isBulkAssignDialogOpen} onOpenChange={setIsBulkAssignDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Bulk Assign</DialogTitle>
            <DialogDescription>Assign groups, roles, and scope to {bulkSelectedUserIds.size} selected user(s).</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[60vh] overflow-auto">
            <div className="space-y-2">
              <Label>Add to Groups</Label>
              <div className="max-h-32 overflow-auto border rounded-lg p-2 space-y-1">
                {allGroups.map(g => (
                  <div key={g.id} className="flex items-center gap-2 p-1.5 rounded hover:bg-muted/50">
                    <Checkbox checked={bulkAssignGroups.includes(g.id)} onCheckedChange={(checked) => {
                      setBulkAssignGroups(checked ? [...bulkAssignGroups, g.id] : bulkAssignGroups.filter(id => id !== g.id))
                    }} />
                    <span className="text-sm">{g.name}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Assign Roles</Label>
              <div className="max-h-32 overflow-auto border rounded-lg p-2 space-y-1">
                {availableRoles.map(role => (
                  <div key={role.id} className="flex items-center gap-2 p-1.5 rounded hover:bg-muted/50">
                    <Checkbox checked={bulkAssignRoles.includes(role.id)} onCheckedChange={(checked) => {
                      setBulkAssignRoles(checked ? [...bulkAssignRoles, role.id] : bulkAssignRoles.filter(id => id !== role.id))
                    }} />
                    <span className="text-sm">{role.name}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Add Scope (optional)</Label>
              <div className="space-y-2">
                <Input placeholder="Company Codes (comma-separated)" value={bulkAssignScope.companyCodes.join(", ")} onChange={(e) => setBulkAssignScope({ ...bulkAssignScope, companyCodes: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })} />
                <Input placeholder="Locations (comma-separated)" value={bulkAssignScope.locations.join(", ")} onChange={(e) => setBulkAssignScope({ ...bulkAssignScope, locations: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })} />
                <Input placeholder="Plants (comma-separated)" value={bulkAssignScope.plants.join(", ")} onChange={(e) => setBulkAssignScope({ ...bulkAssignScope, plants: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBulkAssignDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleBulkAssign}>Apply to {bulkSelectedUserIds.size} User(s)</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Bulk Upload Dialog */}
      <Dialog open={isBulkUploadDialogOpen} onOpenChange={(open) => { setIsBulkUploadDialogOpen(open); if (!open) resetBulkUpload() }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {bulkUploadStep === "done" ? "Invites Sent" : "Bulk Upload Users"}
            </DialogTitle>
            <DialogDescription>
              {bulkUploadStep === "upload" && "Upload a CSV file to add multiple users and send them invites."}
              {bulkUploadStep === "preview" && "Review the users below before sending invitations."}
              {bulkUploadStep === "done" && `Successfully sent ${bulkUploadImportedCount} invitation(s).`}
            </DialogDescription>
          </DialogHeader>

          {bulkUploadStep === "upload" && (
            <div className="space-y-4 py-2">
              <div
                className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                onDragOver={(e) => { e.preventDefault(); e.stopPropagation() }}
                onDrop={(e) => { e.preventDefault(); e.stopPropagation(); const file = e.dataTransfer.files?.[0]; if (file && file.name.endsWith(".csv")) handleBulkUploadFileChange(file); else setBulkUploadError("Please upload a .csv file.") }}
                onClick={() => { const input = document.createElement("input"); input.type = "file"; input.accept = ".csv"; input.onchange = (e) => { const file = (e.target as HTMLInputElement).files?.[0] || null; handleBulkUploadFileChange(file) }; input.click() }}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <Upload className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Click to upload or drag and drop</p>
                    <p className="text-xs text-muted-foreground mt-0.5">CSV files only</p>
                  </div>
                </div>
              </div>

              {bulkUploadError && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                  <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                  {bulkUploadError}
                </div>
              )}

              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Need a template?</p>
                    <p className="text-xs text-muted-foreground">Download our CSV template with the required format.</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="h-7 text-xs" onClick={downloadCsvTemplate}>
                  <Download className="h-3.5 w-3.5 mr-1" />Template
                </Button>
              </div>

              <div className="text-xs text-muted-foreground space-y-1">
                <p className="font-medium">CSV Format:</p>
                <p>Required columns: <span className="font-mono bg-muted px-1 rounded">Name</span>, <span className="font-mono bg-muted px-1 rounded">Email</span></p>
                <p>Optional columns: <span className="font-mono bg-muted px-1 rounded">Groups</span> (semicolon-separated), <span className="font-mono bg-muted px-1 rounded">Roles</span> (semicolon-separated)</p>
              </div>
            </div>
          )}

          {bulkUploadStep === "preview" && (
            <div className="space-y-4 py-2">
              {/* File info bar */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/50 border">
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{bulkUploadFile?.name}</span>
                  <span className="text-muted-foreground">({bulkUploadParsed.length} rows)</span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 text-xs text-muted-foreground"
                  onClick={() => { setBulkUploadStep("upload"); setBulkUploadFile(null); setBulkUploadParsed([]) }}
                >
                  Change file
                </Button>
              </div>

              {/* Summary badges */}
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800 text-xs gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  {bulkUploadParsed.filter(r => r.status === "valid").length} valid
                </Badge>
                {bulkUploadParsed.filter(r => r.status === "duplicate").length > 0 && (
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800 text-xs gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    {bulkUploadParsed.filter(r => r.status === "duplicate").length} duplicate
                  </Badge>
                )}
                {bulkUploadParsed.filter(r => r.status === "invalid").length > 0 && (
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-800 text-xs gap-1">
                    <X className="h-3 w-3" />
                    {bulkUploadParsed.filter(r => r.status === "invalid").length} invalid
                  </Badge>
                )}
              </div>

              {/* Spreadsheet-style preview */}
              <div className="border rounded-lg overflow-hidden">
                <ScrollArea className="max-h-[340px]">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/40">
                        <TableHead className="w-10 text-center text-[10px] font-semibold">#</TableHead>
                        <TableHead className="text-[11px] font-semibold">User</TableHead>
                        <TableHead className="text-[11px] font-semibold">Email</TableHead>
                        <TableHead className="text-[11px] font-semibold">Groups</TableHead>
                        <TableHead className="text-[11px] font-semibold">Roles</TableHead>
                        <TableHead className="w-24 text-center text-[11px] font-semibold">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bulkUploadParsed.map((row, idx) => (
                        <TableRow key={idx} className={row.status !== "valid" ? "bg-muted/20" : "hover:bg-muted/30"}>
                          <TableCell className="text-center text-xs text-muted-foreground font-mono">{idx + 1}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                                <span className="text-[10px] font-medium text-muted-foreground">
                                  {row.name ? row.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() : "?"}
                                </span>
                              </div>
                              <span className="text-sm font-medium truncate max-w-[140px]">
                                {row.name || <span className="text-muted-foreground italic">Missing</span>}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1.5">
                              <Mail className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                              <span className="text-sm text-muted-foreground truncate max-w-[180px]">
                                {row.email || <span className="italic">Missing</span>}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-0.5">
                              {row.groups.length > 0 ? row.groups.map(g => (
                                <Badge key={g} variant="outline" className="text-[10px] px-1.5 py-0">{g}</Badge>
                              )) : <span className="text-xs text-muted-foreground">--</span>}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-0.5">
                              {row.roles.length > 0 ? row.roles.map(r => (
                                <Badge key={r} variant="outline" className="text-[10px] px-1.5 py-0">{r}</Badge>
                              )) : <span className="text-xs text-muted-foreground">--</span>}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            {row.status === "valid" && <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 text-[10px]">Ready</Badge>}
                            {row.status === "duplicate" && (
                              <Tooltip>
                                <TooltipTrigger>
                                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 text-[10px]">Duplicate</Badge>
                                </TooltipTrigger>
                                <TooltipContent>This email already exists or is duplicated in the file</TooltipContent>
                              </Tooltip>
                            )}
                            {row.status === "invalid" && (
                              <Tooltip>
                                <TooltipTrigger>
                                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400 text-[10px]">Invalid</Badge>
                                </TooltipTrigger>
                                <TooltipContent>Missing name or valid email address</TooltipContent>
                              </Tooltip>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </div>

              {bulkUploadParsed.filter(r => r.status !== "valid").length > 0 && (
                <p className="text-xs text-muted-foreground">
                  Only <span className="font-medium">{bulkUploadParsed.filter(r => r.status === "valid").length}</span> valid user(s) will receive invitations. Duplicates and invalid entries will be skipped.
                </p>
              )}
            </div>
          )}

          {bulkUploadStep === "done" && (
            <div className="py-8 flex flex-col items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center">
                <Send className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-lg">{bulkUploadImportedCount} invite(s) sent</p>
                <p className="text-sm text-muted-foreground mt-1">Users have been added and invitation emails are on the way.</p>
              </div>
            </div>
          )}

          <DialogFooter>
            {bulkUploadStep === "upload" && (
              <Button variant="outline" onClick={() => setIsBulkUploadDialogOpen(false)}>Cancel</Button>
            )}
            {bulkUploadStep === "preview" && (
              <>
                <Button variant="outline" onClick={() => { setBulkUploadStep("upload"); setBulkUploadFile(null); setBulkUploadParsed([]) }}>Back</Button>
                <Button onClick={handleBulkUploadImport} disabled={bulkUploadParsed.filter(r => r.status === "valid").length === 0} className="gap-1.5">
                  <Send className="h-3.5 w-3.5" />
                  Send Invite ({bulkUploadParsed.filter(r => r.status === "valid").length})
                </Button>
              </>
            )}
            {bulkUploadStep === "done" && (
              <Button onClick={() => { setIsBulkUploadDialogOpen(false); resetBulkUpload() }}>Done</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
