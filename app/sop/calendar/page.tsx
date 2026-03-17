import { Suspense } from "react"
import { CalendarContent } from "./calendar-content"

export default function CalendarPage() {
  return (
    <Suspense fallback={null}>
      <CalendarContent />
    </Suspense>
  )
}
