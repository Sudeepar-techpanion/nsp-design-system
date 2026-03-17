import { Suspense } from "react"
import { XAIContent } from "./xai-content"

export default function XAIPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <XAIContent />
    </Suspense>
  )
}
