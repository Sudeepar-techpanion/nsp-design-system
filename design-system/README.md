# Nimble S2P Design System

A professional purple-themed design system for enterprise procurement applications built with Radix UI, React, and Tailwind CSS.

## Features

- **Purple Sidebar Theme**: Professional purple branding with collapsible sidebar navigation
- **Status Indicators**: Success, warning, info, error, and default status badges
- **Statistics Cards**: Display KPIs with icons and breakdown items
- **Data Tables**: Flexible tables with sorting, filtering, and pagination
- **Page Tabs**: Navigation tabs with active state indication
- **User Header**: Profile dropdown with delegate access functionality

## Installation

### Using shadcn CLI

```bash
npx shadcn@latest add https://your-registry-url.vercel.app/r/theme.json
npx shadcn@latest add https://your-registry-url.vercel.app/r/nimble-sidebar.json
npx shadcn@latest add https://your-registry-url.vercel.app/r/nimble-header.json
npx shadcn@latest add https://your-registry-url.vercel.app/r/status-badge.json
npx shadcn@latest add https://your-registry-url.vercel.app/r/stat-card.json
npx shadcn@latest add https://your-registry-url.vercel.app/r/page-tabs.json
npx shadcn@latest add https://your-registry-url.vercel.app/r/data-table.json
```

### Using Blocks

For a complete starting point, use one of the blocks:

```bash
# Blank application with all components
npx shadcn@latest add https://your-registry-url.vercel.app/r/blank.json

# Dashboard with sample data
npx shadcn@latest add https://your-registry-url.vercel.app/r/dashboard.json
```

## MCP Integration

Integrate this registry with AI IDEs using Model Context Protocol (MCP):

### Cursor

Add to `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "nimble-s2p": {
      "command": "npx -y shadcn@canary registry:mcp",
      "env": {
        "REGISTRY_URL": "https://your-registry-url.vercel.app/r/registry.json"
      }
    }
  }
}
```

### Windsurf

Add to your MCP configuration:

```json
{
  "mcpServers": {
    "nimble-s2p": {
      "command": "npx -y shadcn@canary registry:mcp",
      "env": {
        "REGISTRY_URL": "https://your-registry-url.vercel.app/r/registry.json"
      }
    }
  }
}
```

## Components

### Theme

The theme includes:

- **Colors**: Purple primary, sidebar branding, semantic status colors
- **Typography**: Inter font family for clean, professional text
- **Spacing**: Consistent 0.5rem base radius
- **Dark Mode**: Full dark mode support

### Custom Components

| Component | Description |
|-----------|-------------|
| `nimble-sidebar` | Collapsible sidebar with hover expansion |
| `nimble-header` | Header with notifications and user profile |
| `status-badge` | Semantic status indicators |
| `stat-card` | Statistics display cards |
| `page-tabs` | Navigation tabs |
| `data-table` | Data table with sorting/filtering |

### Blocks

| Block | Description |
|-------|-------------|
| `blank` | Empty application shell |
| `dashboard` | Complete dashboard with sample data |

## Color Tokens

### Primary Colors

- `--primary`: Purple (`oklch(0.4 0.15 300)`)
- `--sidebar`: Dark purple (`oklch(0.32 0.13 295)`)

### Status Colors

- `--success`: Green for positive states
- `--warning`: Amber for caution states
- `--info`: Blue for informational states
- `--destructive`: Red for error/danger states

## Development

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Deploying the Registry

1. Deploy to Vercel or your preferred hosting
2. Update the `homepage` in `r/registry.json`
3. Update all registry URLs in component JSON files

## File Structure

```
design-system/
├── r/                          # Registry JSON files
│   ├── registry.json           # Main registry manifest
│   ├── theme.json              # Theme configuration
│   ├── nimble-sidebar.json     # Sidebar component
│   ├── nimble-header.json      # Header component
│   ├── status-badge.json       # Status badge component
│   ├── stat-card.json          # Statistics card component
│   ├── page-tabs.json          # Page tabs component
│   ├── data-table.json         # Data table component
│   ├── blank.json              # Blank block
│   └── dashboard.json          # Dashboard block
├── registry/
│   ├── common/                 # Common files (CSS, utils)
│   │   ├── globals.css
│   │   ├── utils.ts
│   │   ├── use-mobile.ts
│   │   ├── package.json
│   │   ├── postcss.config.mjs
│   │   └── tsconfig.json
│   ├── components/             # Component source files
│   │   ├── nimble-sidebar.tsx
│   │   ├── nimble-header.tsx
│   │   ├── status-badge.tsx
│   │   ├── stat-card.tsx
│   │   ├── page-tabs.tsx
│   │   └── data-table.tsx
│   ├── layouts/                # Layout templates
│   │   └── shell-layout.tsx
│   └── blocks/                 # Block page templates
│       ├── blank-page.tsx
│       └── dashboard-page.tsx
├── package.json
└── README.md
```

## License

MIT
