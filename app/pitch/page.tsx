import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, AlertTriangle, CheckCircle, TrendingUp, ArrowRight, Bitcoin, Database, Cloud } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export default function PitchPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">BlockSecure</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="outline">View Dashboard</Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 space-y-20">
        {/* Hero Section */}
        <section className="text-center space-y-6">
          <Badge variant="secondary" className="text-sm">
            Powered by Stacks Blockchain
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-balance">
            Multi-Cloud Log Integrity
            <span className="text-primary block">Secured by Blockchain</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
            Ensure tamper-proof logging across AWS, Azure, GCP, and more with Bitcoin-secured blockchain anchoring
            through Stacks smart contracts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="text-lg px-8">
                View Live Demo <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
              Learn More
            </Button>
          </div>
        </section>

        {/* Problem Section */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-balance">The Problem</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
              Multi-cloud environments create critical security vulnerabilities
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-destructive/20">
              <CardHeader>
                <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
                <CardTitle>Log Tampering</CardTitle>
                <CardDescription>
                  Malicious actors can modify or delete critical log entries across cloud platforms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Insider threats with admin access</li>
                  <li>• External attackers covering tracks</li>
                  <li>• Accidental data corruption</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-destructive/20">
              <CardHeader>
                <Database className="h-12 w-12 text-destructive mb-4" />
                <CardTitle>Compliance Failures</CardTitle>
                <CardDescription>Regulatory requirements demand immutable audit trails</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• SOX compliance violations</li>
                  <li>• GDPR audit trail requirements</li>
                  <li>• Financial services regulations</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-destructive/20">
              <CardHeader>
                <Cloud className="h-12 w-12 text-destructive mb-4" />
                <CardTitle>Multi-Cloud Complexity</CardTitle>
                <CardDescription>Different cloud providers have varying security models</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Inconsistent logging formats</li>
                  <li>• Fragmented security policies</li>
                  <li>• No unified integrity verification</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Solution Section */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-balance">Our Solution</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
              BlockSecure anchors every log entry to the Bitcoin blockchain via Stacks
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <Card className="border-primary/20">
                <CardHeader>
                  <CheckCircle className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Immutable Anchoring</CardTitle>
                </CardHeader>
                <CardContent>
                  Every log entry is hashed and anchored to the Stacks blockchain, making tampering mathematically
                  impossible.
                </CardContent>
              </Card>

              <Card className="border-primary/20">
                <CardHeader>
                  <Shield className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Real-time Verification</CardTitle>
                </CardHeader>
                <CardContent>
                  Instant detection of any log modifications through cryptographic hash comparison with blockchain
                  records.
                </CardContent>
              </Card>

              <Card className="border-primary/20">
                <CardHeader>
                  <Bitcoin className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Bitcoin Security</CardTitle>
                </CardHeader>
                <CardContent>
                  Leverages Bitcoin's proven security model through Stacks' unique Proof-of-Transfer consensus
                  mechanism.
                </CardContent>
              </Card>
            </div>

            <div className="bg-muted/50 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">How It Works</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-semibold">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Log Generation</p>
                    <p className="text-sm text-muted-foreground">Multi-cloud events are captured in real-time</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-semibold">
                    2
                  </div>
                  <div>
                    <p className="font-medium">Cryptographic Hashing</p>
                    <p className="text-sm text-muted-foreground">Each log is hashed using SHA-256</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-semibold">
                    3
                  </div>
                  <div>
                    <p className="font-medium">Blockchain Anchoring</p>
                    <p className="text-sm text-muted-foreground">Hash is stored in Stacks smart contract</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-semibold">
                    4
                  </div>
                  <div>
                    <p className="font-medium">Continuous Verification</p>
                    <p className="text-sm text-muted-foreground">Real-time integrity checking against blockchain</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Stacks Section */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-balance">Why Stacks?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
              The only blockchain that brings smart contracts to Bitcoin
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="text-center">
                <Bitcoin className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                <CardTitle>Bitcoin Security</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground">
                  Inherits Bitcoin's $800B+ security model through Proof-of-Transfer
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Clarity Contracts</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground">Predictable, secure smart contracts with no surprises</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <TrendingUp className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <CardTitle>Enterprise Ready</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground">
                  Production-grade infrastructure with institutional backing
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Database className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <CardTitle>Web2 Bridge</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground">Seamless integration with existing enterprise systems</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Future Scope Section */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-balance">Future Scope</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
              Positioning Stacks as the trust anchor for Web2 + Web3 convergence
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold">Enterprise Adoption</h3>
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Financial Services</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Banks and fintech companies ensuring regulatory compliance with immutable transaction logs.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Healthcare</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      HIPAA-compliant patient data access logs with blockchain-verified audit trails.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Supply Chain</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      End-to-end traceability with tamper-proof logistics and quality control records.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-semibold">Technical Roadmap</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                  <div>
                    <p className="font-medium">Multi-Chain Support</p>
                    <p className="text-sm text-muted-foreground">
                      Extend to Ethereum, Polygon, and other major blockchains
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                  <div>
                    <p className="font-medium">AI-Powered Analytics</p>
                    <p className="text-sm text-muted-foreground">
                      Machine learning for anomaly detection and predictive security
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                  <div>
                    <p className="font-medium">Zero-Knowledge Proofs</p>
                    <p className="text-sm text-muted-foreground">
                      Privacy-preserving verification for sensitive enterprise data
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                  <div>
                    <p className="font-medium">Decentralized Identity</p>
                    <p className="text-sm text-muted-foreground">Integration with Stacks-based identity solutions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center space-y-8 py-12">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-balance">Ready to Secure Your Logs?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
              Experience the future of tamper-proof logging with our live demo
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="text-lg px-8">
                Try Live Demo <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
              Contact Sales
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold">BlockSecure</span>
            </div>
            <p className="text-sm text-muted-foreground">© 2025 BlockSecure. Powered by Stacks Blockchain.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
