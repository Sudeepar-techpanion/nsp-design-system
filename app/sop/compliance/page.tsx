import { Suspense } from "react"
import { ComplianceContent } from "./compliance-content"

export default function CompliancePage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <ComplianceContent />
    </Suspense>
  )
}
