import type React from "react"
import { Suspense } from "react"
import { Sidebar } from "@/components/sidebar"

export default function SOPLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen bg-background overflow-hidden">
      <Sidebar />
      {/* Main content with left margin to account for fixed sidebar (w-16 = 64px) */}
      <main className="ml-16 h-full flex flex-col overflow-hidden">
        <Suspense fallback={null}>{children}</Suspense>
      </main>
    </div>
  )
}
