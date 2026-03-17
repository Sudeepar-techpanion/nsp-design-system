import { Suspense } from "react"
import { ActionFeedContent } from "./action-feed-content"

export default function ActionFeedPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <ActionFeedContent />
    </Suspense>
  )
}
