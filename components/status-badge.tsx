import type React from "react"
import { cn } from "@/lib/utils"

type StatusVariant = "success" | "warning" | "info" | "error" | "default"

interface StatusBadgeProps {
  variant?: StatusVariant
  children: React.ReactNode
  className?: string
}

const variantStyles: Record<StatusVariant, string> = {
  success: "bg-success/15 text-success border-success/30",
  warning: "bg-warning/15 text-warning-foreground border-warning/30",
  info: "bg-info/15 text-info border-info/30",
  error: "bg-destructive/15 text-destructive border-destructive/30",
  default: "bg-muted text-muted-foreground border-border",
}

export function StatusBadge({ variant = "default", children, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
