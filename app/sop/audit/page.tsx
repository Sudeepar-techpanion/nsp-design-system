import { Suspense } from "react"
import AuditContent from "./audit-content"

export default function AuditPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      }
    >
      <AuditContent />
    </Suspense>
  )
}
