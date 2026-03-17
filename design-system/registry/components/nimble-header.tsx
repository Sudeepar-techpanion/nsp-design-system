"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Bell, CheckCircle, Menu, User, Settings, LogOut, UserPlus, CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

interface UserProfile {
  name: string
  email: string
  role: string
  organization?: string
  mobile?: string
  location?: string
  initials?: string
}

interface NimbleHeaderProps {
  /** User profile information */
  user?: UserProfile
  /** Show notifications button */
  showNotifications?: boolean
  /** Show setup progress button */
  showSetupProgress?: boolean
  /** Show delegate option in dropdown */
  showDelegate?: boolean
  /** Callback when logout is clicked */
  onLogout?: () => void
  /** Callback when settings is clicked */
  onSettings?: () => void
  /** Login redirect path */
  loginPath?: string
}

const defaultUser: UserProfile = {
  name: "User",
  email: "user@example.com",
  role: "Admin",
  organization: "Organization",
  mobile: "+1 (555) 000-0000",
  location: "Location",
  initials: "U",
}

export function NimbleHeader({
  user = defaultUser,
  showNotifications = true,
  showSetupProgress = true,
  showDelegate = true,
  onLogout,
  onSettings,
  loginPath = "/login",
}: NimbleHeaderProps) {
  const router = useRouter()
  const [delegateModalOpen, setDelegateModalOpen] = useState(false)
  const [profileModalOpen, setProfileModalOpen] = useState(false)
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined)
  const [toDate, setToDate] = useState<Date | undefined>(undefined)
  const [assignTo, setAssignTo] = useState("")
  const [notifyUser, setNotifyUser] = useState(true)
  const [assignToError, setAssignToError] = useState("")

  const userInitials = user.initials || user.name.charAt(0).toUpperCase()

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const isFormValid = fromDate && toDate && assignTo && isValidEmail(assignTo) && toDate >= fromDate

  const handleAssignBackup = () => {
    if (!isValidEmail(assignTo)) {
      setAssignToError("Please enter a valid email address")
      return
    }
    if (toDate && fromDate && toDate < fromDate) {
      return
    }
    console.log("Delegation saved:", { fromDate, toDate, assignTo, notifyUser })
    handleCloseModal()
  }

  const handleCloseModal = () => {
    setDelegateModalOpen(false)
    setFromDate(undefined)
    setToDate(undefined)
    setAssignTo("")
    setNotifyUser(true)
    setAssignToError("")
  }

  const handleAssignToChange = (value: string) => {
    setAssignTo(value)
    if (assignToError && isValidEmail(value)) {
      setAssignToError("")
    }
  }

  const handleLogout = () => {
    if (onLogout) {
      onLogout()
    } else {
      router.push(loginPath)
    }
  }

  return (
    <>
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border bg-background px-4 md:px-6">
        {/* Left Side - Mobile Menu */}
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </Button>
        </div>

        {/* Right Side */}
        <div className="flex items-center ml-auto gap-4">
          {/* Notifications */}
          {showNotifications && (
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
            </Button>
          )}

          {/* Setup Progress */}
          {showSetupProgress && (
            <Button variant="ghost" size="icon" className="relative">
              <CheckCircle className="h-5 w-5 text-muted-foreground" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-info" />
            </Button>
          )}

          {/* User Profile with Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity outline-none">
                <Avatar className="h-9 w-9 bg-primary">
                  <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-sm">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block text-left">
                  <div className="text-sm font-medium text-foreground">{user.name}</div>
                  <div className="text-xs text-muted-foreground">{user.role}</div>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-3 py-3">
                <p className="text-sm font-semibold text-foreground">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.role}</p>
                <p className="text-xs text-info">{user.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" onSelect={() => setProfileModalOpen(true)}>
                <User className="mr-3 h-4 w-4 text-muted-foreground" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onSelect={onSettings}>
                <Settings className="mr-3 h-4 w-4 text-muted-foreground" />
                <span>Settings</span>
              </DropdownMenuItem>
              {showDelegate && (
                <DropdownMenuItem className="cursor-pointer" onSelect={() => setDelegateModalOpen(true)}>
                  <UserPlus className="mr-3 h-4 w-4 text-muted-foreground" />
                  <span>Delegate</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" onSelect={handleLogout}>
                <LogOut className="mr-3 h-4 w-4 text-muted-foreground" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Profile Modal */}
      <Dialog open={profileModalOpen} onOpenChange={setProfileModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">User Profile</DialogTitle>
            <DialogDescription>View your account information and details</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex items-center gap-4 pb-4 border-b">
              <Avatar className="h-16 w-16 bg-primary">
                <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-xl">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold text-foreground">{user.name}</h3>
                <p className="text-sm text-muted-foreground">{user.role}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <Label className="text-xs font-medium text-muted-foreground">Email Address</Label>
                <p className="text-sm font-medium text-foreground">{user.email}</p>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-medium text-muted-foreground">Role</Label>
                <p className="text-sm font-medium text-foreground">{user.role}</p>
              </div>

              {user.organization && (
                <div className="space-y-1">
                  <Label className="text-xs font-medium text-muted-foreground">Organization</Label>
                  <p className="text-sm font-medium text-foreground">{user.organization}</p>
                </div>
              )}

              {user.mobile && (
                <div className="space-y-1">
                  <Label className="text-xs font-medium text-muted-foreground">Mobile Number</Label>
                  <p className="text-sm font-medium text-foreground">{user.mobile}</p>
                </div>
              )}

              {user.location && (
                <div className="space-y-1">
                  <Label className="text-xs font-medium text-muted-foreground">Location</Label>
                  <p className="text-sm font-medium text-foreground">{user.location}</p>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setProfileModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delegate Modal */}
      <Dialog open={delegateModalOpen} onOpenChange={(open) => !open && handleCloseModal()}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-foreground">Delegate Access</DialogTitle>
            <DialogDescription>
              Assign a backup person to handle your tasks during your absence.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="from-date" className="text-sm font-medium">
                  From Date <span className="text-destructive">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="from-date"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !fromDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {fromDate ? format(fromDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={fromDate}
                      onSelect={setFromDate}
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="to-date" className="text-sm font-medium">
                  To Date <span className="text-destructive">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="to-date"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !toDate && "text-muted-foreground",
                        toDate && fromDate && toDate < fromDate && "border-destructive"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {toDate ? format(toDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={toDate}
                      onSelect={setToDate}
                      disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0)) || (fromDate ? date < fromDate : false)
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {toDate && fromDate && toDate < fromDate && (
                  <p className="text-xs text-destructive">To date must be after from date</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="assign-to" className="text-sm font-medium">
                Assign To <span className="text-destructive">*</span>
              </Label>
              <Input
                id="assign-to"
                type="email"
                placeholder="Enter email address"
                value={assignTo}
                onChange={(e) => handleAssignToChange(e.target.value)}
                className={cn(assignToError && "border-destructive focus-visible:ring-destructive")}
              />
              {assignToError && <p className="text-xs text-destructive">{assignToError}</p>}
              <p className="text-xs text-muted-foreground">
                Enter the email of the person who will handle your tasks
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Checkbox
                id="notify-user"
                checked={notifyUser}
                onCheckedChange={(checked) => setNotifyUser(checked === true)}
              />
              <div className="space-y-0.5">
                <Label htmlFor="notify-user" className="text-sm font-medium cursor-pointer">
                  Notify user
                </Label>
                <p className="text-xs text-muted-foreground">Send an email notification to the assigned person</p>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-3 sm:gap-3">
            <Button variant="outline" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button onClick={handleAssignBackup} disabled={!isFormValid}>
              Assign Backup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export { type UserProfile }
