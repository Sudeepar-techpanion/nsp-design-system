import { Suspense } from "react"
import InboxContent from "./inbox-content"

export default function InboxPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <InboxContent />
    </Suspense>
  )
}
