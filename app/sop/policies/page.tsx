import { Suspense } from "react"
import { PoliciesContent } from "./policies-content"

export default function PoliciesPage() {
  return (
    <Suspense fallback={null}>
      <PoliciesContent />
    </Suspense>
  )
}
