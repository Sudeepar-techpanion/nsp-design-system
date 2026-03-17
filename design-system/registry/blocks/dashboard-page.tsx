import { NimbleSidebar } from "@/components/nimble-sidebar"
import { NimbleHeader } from "@/components/nimble-header"
import { StatCard } from "@/components/stat-card"
import { StatusBadge } from "@/components/status-badge"
import { PageTabs } from "@/components/page-tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Inbox, ClipboardList, ShieldCheck, TrendingUp, Plus } from "lucide-react"

const tabs = [
  { name: "Overview", href: "/" },
  { name: "Analytics", href: "/analytics" },
  { name: "Reports", href: "/reports" },
]

const recentItems = [
  { id: "INV-001", type: "Invoice", status: "Pending", amount: "$1,234.00", date: "2024-01-15" },
  { id: "RFQ-042", type: "RFQ", status: "Approved", amount: "$5,678.00", date: "2024-01-14" },
  { id: "PO-103", type: "Purchase Order", status: "Processing", amount: "$890.00", date: "2024-01-13" },
  { id: "INV-002", type: "Invoice", status: "Completed", amount: "$2,456.00", date: "2024-01-12" },
]

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen">
      <NimbleSidebar />
      <div className="flex flex-1 flex-col pl-16">
        <NimbleHeader
          user={{
            name: "John Doe",
            email: "john@company.com",
            role: "Admin",
            organization: "Company Inc.",
            initials: "JD",
          }}
        />
        <main className="flex-1 p-6">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
                <p className="text-muted-foreground">Overview of your procurement activities</p>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Request
              </Button>
            </div>

            {/* Page Tabs */}
            <PageTabs tabs={tabs} />

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Total Inbox Items"
                value={156}
                icon={Inbox}
                items={[
                  { label: "Pending Review", value: 42, variant: "warning" },
                  { label: "Completed", value: 114, variant: "success" },
                ]}
              />
              <StatCard
                title="Active SOPs"
                value={24}
                icon={ClipboardList}
                items={[
                  { label: "Published", value: 18, variant: "success" },
                  { label: "Draft", value: 6, variant: "default" },
                ]}
              />
              <StatCard
                title="Compliance Score"
                value="94%"
                icon={ShieldCheck}
                items={[
                  { label: "Passing", value: 47, variant: "success" },
                  { label: "Warning", value: 3, variant: "warning" },
                ]}
              />
              <StatCard
                title="Monthly Savings"
                value="$45.2K"
                icon={TrendingUp}
                items={[
                  { label: "vs Last Month", value: "+12.5%", variant: "success" },
                ]}
              />
            </div>

            {/* Recent Activity Table */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Activity</CardTitle>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.id}</TableCell>
                        <TableCell>{item.type}</TableCell>
                        <TableCell>
                          <StatusBadge
                            variant={
                              item.status === "Completed"
                                ? "success"
                                : item.status === "Approved"
                                ? "success"
                                : item.status === "Pending"
                                ? "warning"
                                : "info"
                            }
                          >
                            {item.status}
                          </StatusBadge>
                        </TableCell>
                        <TableCell>{item.amount}</TableCell>
                        <TableCell className="text-muted-foreground">{item.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
