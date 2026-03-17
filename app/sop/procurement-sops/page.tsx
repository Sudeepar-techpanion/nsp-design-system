import { Suspense } from "react"
import { ProcurementSOPsContent } from "./procurement-sops-content"

export default function ProcurementSOPsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      }
    >
      <ProcurementSOPsContent />
    </Suspense>
  )
}
