import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface StatItem {
  label: string
  value: number | string
  variant?: "success" | "warning" | "info" | "default"
}

interface StatCardProps {
  title: string
  value: number | string
  icon?: LucideIcon
  items?: StatItem[]
  footer?: React.ReactNode
  className?: string
}

const variantColors = {
  success: "text-success",
  warning: "text-warning-foreground bg-warning/10 rounded px-2",
  info: "text-info",
  default: "text-muted-foreground",
}

export function StatCard({ title, value, icon: Icon, items, footer, className }: StatCardProps) {
  return (
    <Card className={cn("", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        {items && items.length > 0 && (
          <div className="mt-4 space-y-2">
            {items.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className={cn("font-medium", item.variant && variantColors[item.variant])}>{item.label}</span>
                <span className="text-foreground">{item.value}</span>
              </div>
            ))}
          </div>
        )}
        {footer}
      </CardContent>
    </Card>
  )
}
