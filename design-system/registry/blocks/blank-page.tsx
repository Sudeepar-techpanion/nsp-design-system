import { NimbleSidebar } from "@/components/nimble-sidebar"
import { NimbleHeader } from "@/components/nimble-header"

export default function Page() {
  return (
    <div className="flex min-h-screen">
      <NimbleSidebar />
      <div className="flex flex-1 flex-col pl-16">
        <NimbleHeader
          user={{
            name: "John Doe",
            email: "john@company.com",
            role: "Admin",
            organization: "Company Inc.",
            initials: "JD",
          }}
        />
        <main className="flex-1 p-6">
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Welcome</h1>
              <p className="text-muted-foreground">
                This is a blank page template with the Nimble S2P design system.
              </p>
            </div>
            {/* Add your content here */}
          </div>
        </main>
      </div>
    </div>
  )
}
