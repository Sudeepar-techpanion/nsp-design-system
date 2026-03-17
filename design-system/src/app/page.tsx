import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Nimble S2P Design System</h1>
          <p className="text-lg text-muted-foreground">
            A professional purple-themed design system for enterprise procurement applications
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6 space-y-4">
          <h2 className="text-2xl font-semibold">Registry</h2>
          <p className="text-muted-foreground">
            Access the design system components via the shadcn CLI
          </p>
          <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
            <code>npx shadcn@latest add https://your-registry-url.vercel.app/r/theme.json</code>
          </pre>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border bg-card p-6 space-y-3">
            <h3 className="text-xl font-semibold">Blocks</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/r/blank.json" className="text-primary hover:underline">
                  Blank - Empty application shell
                </Link>
              </li>
              <li>
                <Link href="/r/dashboard.json" className="text-primary hover:underline">
                  Dashboard - Complete dashboard with data
                </Link>
              </li>
            </ul>
          </div>

          <div className="rounded-lg border bg-card p-6 space-y-3">
            <h3 className="text-xl font-semibold">Components</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/r/nimble-sidebar.json" className="text-primary hover:underline">
                  Nimble Sidebar
                </Link>
              </li>
              <li>
                <Link href="/r/nimble-header.json" className="text-primary hover:underline">
                  Nimble Header
                </Link>
              </li>
              <li>
                <Link href="/r/status-badge.json" className="text-primary hover:underline">
                  Status Badge
                </Link>
              </li>
              <li>
                <Link href="/r/stat-card.json" className="text-primary hover:underline">
                  Stat Card
                </Link>
              </li>
              <li>
                <Link href="/r/page-tabs.json" className="text-primary hover:underline">
                  Page Tabs
                </Link>
              </li>
              <li>
                <Link href="/r/data-table.json" className="text-primary hover:underline">
                  Data Table
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="rounded-lg border bg-sidebar p-6 text-sidebar-foreground space-y-4">
          <h2 className="text-2xl font-semibold">MCP Integration</h2>
          <p>Integrate with AI IDEs using Model Context Protocol</p>
          <pre className="bg-sidebar-accent p-4 rounded-md overflow-x-auto text-sm">
            <code>{`{
  "mcpServers": {
    "nimble-s2p": {
      "command": "npx -y shadcn@canary registry:mcp",
      "env": {
        "REGISTRY_URL": "https://your-registry-url.vercel.app/r/registry.json"
      }
    }
  }
}`}</code>
          </pre>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <div className="p-4 rounded-lg bg-primary text-primary-foreground text-center">
            <div className="text-sm">Primary</div>
          </div>
          <div className="p-4 rounded-lg bg-success text-success-foreground text-center">
            <div className="text-sm">Success</div>
          </div>
          <div className="p-4 rounded-lg bg-warning text-warning-foreground text-center">
            <div className="text-sm">Warning</div>
          </div>
          <div className="p-4 rounded-lg bg-destructive text-destructive-foreground text-center">
            <div className="text-sm">Destructive</div>
          </div>
        </div>
      </div>
    </main>
  )
}
