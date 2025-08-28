"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Shield,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Cloud,
  Blocks,
  Zap,
  Eye,
  Github,
  ExternalLink,
} from "lucide-react"
import Link from "next/link"

export function LandingPage() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold text-foreground">BlockSecure Multi-Cloud</h1>
                <p className="text-xs text-muted-foreground">Hackathon MVP</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Button variant="outline" asChild>
                <Link href="https://github.com/blocksecure/multi-cloud-mvp" target="_blank">
                  <Github className="h-4 w-4 mr-2" />
                  GitHub
                </Link>
              </Button>
              <Button asChild>
                <Link href="/dashboard">
                  View Dashboard
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-6 px-4 py-2 text-sm">
            <Zap className="h-4 w-4 mr-2" />
            Hackathon MVP - Built in 24 Hours
          </Badge>

          <h1 className="text-4xl md:text-6xl font-bold text-balance mb-6">
            Blockchain-Verified
            <br />
            <span className="text-primary">Multi-Cloud Security</span>
          </h1>

          <p className="text-xl text-muted-foreground text-balance mb-8 max-w-3xl mx-auto">
            Demonstrating how blockchain technology can secure and verify logs across AWS, Azure, and GCP with
            tamper-proof verification using Stacks blockchain and Clarity smart contracts.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" asChild className="text-lg px-8 py-6">
              <Link href="/dashboard">
                <Eye className="h-5 w-5 mr-2" />
                Live Demo Dashboard
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8 py-6 bg-transparent">
              <Link href="https://github.com/blocksecure/multi-cloud-mvp" target="_blank">
                <Github className="h-5 w-5 mr-2" />
                View Source Code
              </Link>
            </Button>
          </div>

          {/* Demo Preview */}
          <div
            className="relative max-w-5xl mx-auto rounded-lg border bg-card/50 p-2 transition-transform hover:scale-[1.02]"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="aspect-video bg-muted rounded-md flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10" />
              <div className="relative z-10 text-center">
                <Shield className="h-16 w-16 text-primary mx-auto mb-4" />
                <p className="text-lg font-medium">Interactive Dashboard Preview</p>
                <p className="text-sm text-muted-foreground">Real-time log verification across multiple clouds</p>
              </div>
              {isHovered && (
                <div className="absolute inset-0 bg-primary/5 flex items-center justify-center">
                  <Button size="lg" asChild>
                    <Link href="/dashboard">
                      <ArrowRight className="h-5 w-5 mr-2" />
                      Launch Dashboard
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Problem & Solution */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4">The Problem</Badge>
              <h2 className="text-3xl font-bold mb-6">Multi-Cloud Log Tampering</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Organizations using multiple cloud providers face significant challenges in ensuring log integrity.
                Traditional centralized logging systems are vulnerable to tampering, making it difficult to maintain
                audit trails and comply with security regulations.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  <span>Logs can be modified without detection</span>
                </li>
                <li className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  <span>No immutable audit trail across clouds</span>
                </li>
                <li className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  <span>Compliance and forensic challenges</span>
                </li>
              </ul>
            </div>
            <div>
              <Badge className="mb-4">Our Solution</Badge>
              <h2 className="text-3xl font-bold mb-6">Blockchain Verification</h2>
              <p className="text-lg text-muted-foreground mb-6">
                BlockSecure anchors log hashes to the Stacks blockchain, creating an immutable record that enables
                real-time tamper detection across AWS, Azure, and GCP environments.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-chart-2" />
                  <span>Immutable blockchain anchoring</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-chart-2" />
                  <span>Real-time tamper detection</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-chart-2" />
                  <span>Cross-cloud verification</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4">Key Features</Badge>
            <h2 className="text-3xl font-bold mb-4">Complete Security Solution</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A comprehensive demonstration of blockchain-secured multi-cloud log integrity
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Cloud className="h-8 w-8 text-chart-1 mb-2" />
                <CardTitle>Multi-Cloud Integration</CardTitle>
                <CardDescription>
                  Seamlessly monitors and verifies logs from AWS, Azure, and GCP in real-time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-chart-3 rounded-full" />
                    AWS EC2, S3, IAM, RDS
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-chart-1 rounded-full" />
                    Azure VMs, Blob Storage, AD
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-chart-2 rounded-full" />
                    GCP BigQuery, Cloud Storage
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Blocks className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Blockchain Anchoring</CardTitle>
                <CardDescription>
                  Uses Stacks blockchain and Clarity smart contracts for immutable log verification
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-chart-2" />
                    SHA-256 hash generation
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-chart-2" />
                    Stacks blockchain integration
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-chart-2" />
                    Clarity smart contracts
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-8 w-8 text-accent mb-2" />
                <CardTitle>Tamper Detection</CardTitle>
                <CardDescription>
                  Advanced algorithms detect various types of log tampering with real-time alerts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-destructive" />
                    Content modification
                  </li>
                  <li className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-destructive" />
                    Timestamp manipulation
                  </li>
                  <li className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-destructive" />
                    Hash integrity checks
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4">Technology Stack</Badge>
            <h2 className="text-3xl font-bold mb-4">Built with Modern Technologies</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Leveraging cutting-edge blockchain and web technologies for maximum security and performance
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Next.js 15", description: "React framework with App Router", color: "bg-slate-900 text-white" },
              {
                name: "Stacks Blockchain",
                description: "Bitcoin-secured smart contracts",
                color: "bg-purple-600 text-white",
              },
              { name: "Clarity", description: "Predictable smart contract language", color: "bg-blue-600 text-white" },
              { name: "Tailwind CSS", description: "Utility-first CSS framework", color: "bg-cyan-600 text-white" },
              { name: "TypeScript", description: "Type-safe JavaScript", color: "bg-blue-700 text-white" },
              { name: "Vercel", description: "Deployment and hosting platform", color: "bg-black text-white" },
              {
                name: "Crypto APIs",
                description: "SHA-256 hashing and verification",
                color: "bg-green-600 text-white",
              },
              {
                name: "Real-time Updates",
                description: "Live log streaming simulation",
                color: "bg-orange-600 text-white",
              },
            ].map((tech, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className={`w-12 h-12 rounded-lg ${tech.color} flex items-center justify-center mb-3`}>
                    <div className="w-6 h-6 bg-white/20 rounded" />
                  </div>
                  <h3 className="font-semibold mb-1">{tech.name}</h3>
                  <p className="text-sm text-muted-foreground">{tech.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Explore?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Experience the future of multi-cloud security with our interactive dashboard demonstration
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="text-lg px-8 py-6">
              <Link href="/dashboard">
                <Eye className="h-5 w-5 mr-2" />
                Launch Live Demo
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8 py-6 bg-transparent">
              <Link href="https://github.com/blocksecure/multi-cloud-mvp" target="_blank">
                <ExternalLink className="h-5 w-5 mr-2" />
                View Documentation
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <Shield className="h-6 w-6 text-primary" />
              <div>
                <p className="font-semibold">BlockSecure Multi-Cloud</p>
                <p className="text-sm text-muted-foreground">Hackathon MVP 2025</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <Link
                href="https://github.com/blocksecure/multi-cloud-mvp"
                target="_blank"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="h-5 w-5" />
              </Link>
              <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                Dashboard
              </Link>
              <p className="text-sm text-muted-foreground">Built with ❤️ for blockchain security</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
