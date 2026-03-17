"use client"

import type React from "react"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Sparkles,
  Brain,
  Zap,
  Bot,
  MessageSquare,
  BarChart3,
  FileSearch,
  Shield,
  Workflow,
  ArrowRight,
  Lock,
} from "lucide-react"

interface AICapability {
  id: string
  title: string
  description: string
  icon: React.ElementType
  href: string
  status: "active" | "coming-soon" | "beta"
  features: string[]
}

const aiCapabilities: AICapability[] = [
  {
    id: "action-feed",
    title: "AI Action Feed",
    description:
      "Intelligent prioritized inbox that surfaces the right actions at the right time based on context, goals, and SLAs.",
    icon: Zap,
    href: "/sop/xai/action-feed",
    status: "active",
    features: ["Priority-based actions", "Context-aware suggestions", "SLA breach prediction", "Smart delegation"],
  },
  {
    id: "smart-assistant",
    title: "Smart Assistant",
    description: "Conversational AI assistant for procurement queries, document search, and workflow guidance.",
    icon: MessageSquare,
    href: "/sop/xai/assistant",
    status: "coming-soon",
    features: ["Natural language queries", "Document Q&A", "Process guidance", "Quick actions"],
  },
  {
    id: "anomaly-detection",
    title: "Anomaly Detection",
    description: "AI-powered monitoring to detect unusual patterns in vendor behavior, pricing, and compliance.",
    icon: Shield,
    href: "/sop/xai/anomaly",
    status: "coming-soon",
    features: ["Price anomalies", "Vendor risk signals", "Compliance deviations", "Fraud indicators"],
  },
  {
    id: "predictive-analytics",
    title: "Predictive Analytics",
    description: "Forecast demand, predict vendor performance, and anticipate supply chain disruptions.",
    icon: BarChart3,
    href: "/sop/xai/analytics",
    status: "coming-soon",
    features: ["Demand forecasting", "Vendor scoring", "Risk prediction", "Cost optimization"],
  },
  {
    id: "document-intelligence",
    title: "Document Intelligence",
    description: "Automated extraction, classification, and validation of procurement documents and invoices.",
    icon: FileSearch,
    href: "/sop/xai/documents",
    status: "beta",
    features: ["OCR extraction", "Auto-classification", "Data validation", "Contract analysis"],
  },
  {
    id: "workflow-automation",
    title: "Workflow Automation",
    description: "AI-suggested workflow optimizations and automated task routing based on patterns.",
    icon: Workflow,
    href: "/sop/xai/automation",
    status: "coming-soon",
    features: ["Process mining", "Bottleneck detection", "Auto-routing", "Efficiency recommendations"],
  },
]

const getStatusBadge = (status: AICapability["status"]) => {
  switch (status) {
    case "active":
      return <Badge className="bg-green-100 text-green-700 border-green-200">Active</Badge>
    case "beta":
      return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Beta</Badge>
    case "coming-soon":
      return (
        <Badge variant="outline" className="text-muted-foreground">
          <Lock className="h-3 w-3 mr-1" />
          Coming Soon
        </Badge>
      )
  }
}

export function XAIContent() {
  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">xAI — Intelligent Assistant</h1>
          <p className="text-muted-foreground mt-1">AI-powered capabilities to enhance procurement operations</p>
        </div>
        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
          <Sparkles className="h-3 w-3 mr-1" />
          AI Powered
        </Badge>
      </div>

      {/* AI Philosophy Banner */}
      <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
        <CardContent className="py-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Brain className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">AI Configuration Philosophy</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Our AI interprets admin-provided configuration inputs and converts them into intent, boundaries, and
                weighting signals. It prepares configuration context — not rules, tasks, or decisions. The AI optimizes
                based on your goals while respecting authority limits and SLA boundaries.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Capabilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {aiCapabilities.map((capability) => {
          const Icon = capability.icon
          const isActive = capability.status === "active" || capability.status === "beta"

          return (
            <Card
              key={capability.id}
              className={`group transition-all duration-200 ${
                isActive ? "hover:shadow-lg hover:border-primary/50 cursor-pointer" : "opacity-75"
              }`}
            >
              {isActive ? (
                <Link href={capability.href} className="block h-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      {getStatusBadge(capability.status)}
                    </div>
                    <CardTitle className="text-lg mt-3 group-hover:text-primary transition-colors">
                      {capability.title}
                    </CardTitle>
                    <CardDescription>{capability.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Key Features</p>
                      <div className="flex flex-wrap gap-1.5">
                        {capability.features.map((feature) => (
                          <Badge key={feature} variant="secondary" className="text-xs font-normal">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mt-4 text-sm text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      Configure <ArrowRight className="h-4 w-4" />
                    </div>
                  </CardContent>
                </Link>
              ) : (
                <>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="p-2 bg-muted rounded-lg">
                        <Icon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      {getStatusBadge(capability.status)}
                    </div>
                    <CardTitle className="text-lg mt-3 text-muted-foreground">{capability.title}</CardTitle>
                    <CardDescription>{capability.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Planned Features
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {capability.features.map((feature) => (
                          <Badge key={feature} variant="outline" className="text-xs font-normal text-muted-foreground">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </>
              )}
            </Card>
          )
        })}
      </div>

      {/* Guardrails Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            AI Guardrails
          </CardTitle>
          <CardDescription>Non-negotiable boundaries for all AI capabilities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { rule: "No rule or threshold creation", desc: "AI interprets, doesn't create logic" },
              { rule: "No task or action generation", desc: "AI surfaces, doesn't execute" },
              { rule: "No admin intent override", desc: "Configuration is respected exactly" },
              { rule: "No inference beyond inputs", desc: "Only uses provided data" },
              { rule: "No optimization outside goals", desc: "Stays within stated objectives" },
              { rule: "Explainable & auditable", desc: "All recommendations are traceable" },
            ].map((guardrail, idx) => (
              <div key={idx} className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
                <Bot className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium">{guardrail.rule}</p>
                  <p className="text-xs text-muted-foreground">{guardrail.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
