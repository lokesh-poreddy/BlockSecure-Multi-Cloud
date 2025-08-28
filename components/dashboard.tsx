"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Shield, AlertTriangle, CheckCircle, Clock, Activity, Zap, Database } from "lucide-react"
import { BlockchainStats } from "./blockchain-stats"
import { LogDetails } from "./log-details"
import { TamperAlerts } from "./tamper-alerts"
import { ThemeToggle } from "./theme-toggle"
import { tamperDetector } from "@/lib/tamper-detection"

interface LogEntry {
  id: string
  cloud: "AWS" | "Azure" | "GCP"
  event: string
  timestamp: string
  hash: string
  txId: string
  verified: boolean
  tampered?: boolean
  blockHeight?: number
  transaction?: any
}

const MOCK_LOGS: Omit<LogEntry, "id" | "hash" | "txId" | "verified">[] = [
  { cloud: "AWS", event: "EC2 instance started", timestamp: "2025-08-26T12:01:05Z" },
  { cloud: "AWS", event: "S3 bucket created: finance-data", timestamp: "2025-08-26T12:03:15Z" },
  { cloud: "AWS", event: "IAM role updated: AdminRole", timestamp: "2025-08-26T12:05:42Z" },
  { cloud: "AWS", event: "RDS database backup completed", timestamp: "2025-08-26T12:10:30Z" },
  { cloud: "Azure", event: "VM deployed: Standard_D2s_v3", timestamp: "2025-08-26T12:02:18Z" },
  { cloud: "Azure", event: "Blob storage container created: reports-2025", timestamp: "2025-08-26T12:04:25Z" },
  { cloud: "Azure", event: "Azure AD user added: alice@company.com", timestamp: "2025-08-26T12:07:50Z" },
  { cloud: "Azure", event: "Cosmos DB write operation succeeded", timestamp: "2025-08-26T12:11:12Z" },
  { cloud: "GCP", event: "BigQuery job executed: daily_sales_report", timestamp: "2025-08-26T12:06:00Z" },
  { cloud: "GCP", event: "Cloud Storage bucket created: analytics-data", timestamp: "2025-08-26T12:08:44Z" },
  { cloud: "GCP", event: "Pub/Sub message published to topic: alerts", timestamp: "2025-08-26T12:09:35Z" },
  { cloud: "GCP", event: "GKE cluster scaled to 5 nodes", timestamp: "2025-08-26T12:12:20Z" },
]

function generateHash(data: string): string {
  // Simple hash simulation for demo
  let hash = 0
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16).padStart(8, "0")
}

function generateTxId(): string {
  return "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")
}

export function Dashboard() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [isRunning, setIsRunning] = useState(true)
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    // Initialize with existing logs
    const initialLogs = MOCK_LOGS.map((log, index) => {
      const logData = JSON.stringify(log)
      const newLog = {
        ...log,
        id: `log-${index}`,
        hash: generateHash(logData),
        txId: generateTxId(),
        verified: true,
        blockHeight: 150000 + index,
      }

      tamperDetector.recordOriginalLog(newLog.id, newLog)
      return newLog
    })
    setLogs(initialLogs)

    // Simulate real-time log generation
    const interval = setInterval(() => {
      if (!isRunning) return

      const randomLog = MOCK_LOGS[Math.floor(Math.random() * MOCK_LOGS.length)]
      const newLog: LogEntry = {
        ...randomLog,
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        hash: generateHash(JSON.stringify(randomLog)),
        txId: generateTxId(),
        verified: Math.random() > 0.1, // 90% verification rate
        blockHeight: 150000 + Math.floor(Math.random() * 1000),
      }

      tamperDetector.recordOriginalLog(newLog.id, newLog)
      setLogs((prev) => [newLog, ...prev].slice(0, 100)) // Keep last 100 logs
    }, 2000)

    return () => clearInterval(interval)
  }, [isRunning])

  const tamperLog = async (logId: string, tamperType = "content") => {
    setLogs((prev) =>
      prev.map((log) => {
        if (log.id === logId) {
          const tamperedLog = tamperDetector.simulateTampering(log, tamperType)
          return { ...tamperedLog, tampered: true, verified: false }
        }
        return log
      }),
    )

    // Detect tampering after a short delay to simulate real-time detection
    setTimeout(async () => {
      const tamperedLog = logs.find((log) => log.id === logId)
      if (tamperedLog) {
        await tamperDetector.detectTampering(logId, tamperedLog)
      }
    }, 500)
  }

  const simulateRandomTamper = () => {
    if (logs.length === 0) return

    const randomLog = logs[Math.floor(Math.random() * Math.min(logs.length, 10))] // Tamper recent logs
    const tamperTypes = ["content", "timestamp", "cloud", "critical"]
    const randomTamperType = tamperTypes[Math.floor(Math.random() * tamperTypes.length)]

    tamperLog(randomLog.id, randomTamperType)
  }

  const getCloudIcon = (cloud: string) => {
    switch (cloud) {
      case "AWS":
        return "🟠"
      case "Azure":
        return "🔵"
      case "GCP":
        return "🟡"
      default:
        return "☁️"
    }
  }

  const getCloudColor = (cloud: string) => {
    switch (cloud) {
      case "AWS":
        return "bg-chart-3/10 text-chart-3 border-chart-3/20"
      case "Azure":
        return "bg-chart-1/10 text-chart-1 border-chart-1/20"
      case "GCP":
        return "bg-chart-2/10 text-chart-2 border-chart-2/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const stats = {
    total: logs.length,
    verified: logs.filter((log) => log.verified).length,
    tampered: logs.filter((log) => log.tampered).length,
    aws: logs.filter((log) => log.cloud === "AWS").length,
    azure: logs.filter((log) => log.cloud === "Azure").length,
    gcp: logs.filter((log) => log.cloud === "GCP").length,
  }

  const filteredLogs = (cloud?: string) => {
    if (!cloud) return logs
    return logs.filter((log) => log.cloud === cloud)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">BlockSecure Multi-Cloud</h1>
                <p className="text-sm text-muted-foreground">Blockchain-Verified Log Integrity Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Badge variant={isRunning ? "default" : "secondary"} className="px-3 py-1">
                <Activity className="h-3 w-3 mr-1" />
                {isRunning ? "Live" : "Paused"}
              </Badge>
              <Button variant="outline" onClick={simulateRandomTamper} size="sm">
                Simulate Tamper
              </Button>
              <Button
                variant={isRunning ? "destructive" : "default"}
                onClick={() => setIsRunning(!isRunning)}
                size="sm"
              >
                {isRunning ? "Pause" : "Resume"} Simulation
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="logs">Live Logs</TabsTrigger>
            <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <TamperAlerts />

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <Card className="col-span-2 md:col-span-1">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Total Logs</p>
                      <p className="text-2xl font-bold">{stats.total}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="col-span-2 md:col-span-1">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-chart-2" />
                    <div>
                      <p className="text-sm text-muted-foreground">Verified</p>
                      <p className="text-2xl font-bold text-chart-2">{stats.verified}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="col-span-2 md:col-span-1">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    <div>
                      <p className="text-sm text-muted-foreground">Tampered</p>
                      <p className="text-2xl font-bold text-destructive">{stats.tampered}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="col-span-2 md:col-span-1">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🟠</span>
                    <div>
                      <p className="text-sm text-muted-foreground">AWS</p>
                      <p className="text-2xl font-bold">{stats.aws}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="col-span-2 md:col-span-1">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🔵</span>
                    <div>
                      <p className="text-sm text-muted-foreground">Azure</p>
                      <p className="text-2xl font-bold">{stats.azure}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="col-span-2 md:col-span-1">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🟡</span>
                    <div>
                      <p className="text-sm text-muted-foreground">GCP</p>
                      <p className="text-2xl font-bold">{stats.gcp}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Blockchain Stats */}
            <BlockchainStats />

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {logs.slice(0, 5).map((log) => (
                    <div
                      key={log.id}
                      className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => setSelectedLog(log)}
                    >
                      <div className="flex items-center gap-3">
                        <Badge className={getCloudColor(log.cloud)} variant="outline">
                          {getCloudIcon(log.cloud)} {log.cloud}
                        </Badge>
                        <div>
                          <p className="text-sm font-medium">{log.event}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {log.verified ? (
                          <Badge className="bg-chart-2/10 text-chart-2 border-chart-2/20">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        ) : (
                          <Badge variant="destructive">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            {log.tampered ? "Tampered" : "Unverified"}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs" className="space-y-6">
            <Tabs defaultValue="all" className="space-y-4">
              <TabsList>
                <TabsTrigger value="all">All Clouds ({logs.length})</TabsTrigger>
                <TabsTrigger value="AWS">AWS ({stats.aws})</TabsTrigger>
                <TabsTrigger value="Azure">Azure ({stats.azure})</TabsTrigger>
                <TabsTrigger value="GCP">GCP ({stats.gcp})</TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      All Multi-Cloud Logs
                      {isRunning && (
                        <Badge variant="secondary" className="ml-2">
                          <div className="w-2 h-2 bg-chart-2 rounded-full animate-pulse mr-1" />
                          Live
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {logs.map((log) => (
                        <div
                          key={log.id}
                          className={`p-4 rounded-lg border transition-all cursor-pointer ${
                            log.tampered
                              ? "bg-destructive/5 border-destructive/20"
                              : "bg-card border-border hover:bg-muted/50"
                          }`}
                          onClick={() => setSelectedLog(log)}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge className={getCloudColor(log.cloud)}>
                                  {getCloudIcon(log.cloud)} {log.cloud}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(log.timestamp).toLocaleTimeString()}
                                </span>
                              </div>
                              <p className="text-sm font-medium mb-1">{log.event}</p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span>Hash: {log.hash}</span>
                                <span>TX: {log.txId.slice(0, 10)}...</span>
                                {log.blockHeight && <span>Block: {log.blockHeight}</span>}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {log.verified ? (
                                <Badge className="bg-chart-2/10 text-chart-2 border-chart-2/20">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Verified
                                </Badge>
                              ) : (
                                <Badge variant="destructive">
                                  <AlertTriangle className="h-3 w-3 mr-1" />
                                  {log.tampered ? "Tampered" : "Unverified"}
                                </Badge>
                              )}
                              {!log.tampered && (
                                <div className="flex gap-1">
                                  <Select onValueChange={(value) => tamperLog(log.id, value)}>
                                    <SelectTrigger className="w-20 h-8 text-xs">
                                      <SelectValue placeholder="Tamper" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="content">Content</SelectItem>
                                      <SelectItem value="timestamp">Timestamp</SelectItem>
                                      <SelectItem value="cloud">Cloud</SelectItem>
                                      <SelectItem value="critical">Critical</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {["AWS", "Azure", "GCP"].map((cloud) => (
                <TabsContent key={cloud} value={cloud}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <span className="text-lg">{getCloudIcon(cloud)}</span>
                        {cloud} Logs
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {filteredLogs(cloud).map((log) => (
                          <div
                            key={log.id}
                            className={`p-4 rounded-lg border transition-all cursor-pointer ${
                              log.tampered
                                ? "bg-destructive/5 border-destructive/20"
                                : "bg-card border-border hover:bg-muted/50"
                            }`}
                            onClick={() => setSelectedLog(log)}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(log.timestamp).toLocaleTimeString()}
                                  </span>
                                </div>
                                <p className="text-sm font-medium mb-1">{log.event}</p>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  <span>Hash: {log.hash}</span>
                                  <span>TX: {log.txId.slice(0, 10)}...</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {log.verified ? (
                                  <Badge className="bg-chart-2/10 text-chart-2 border-chart-2/20">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Verified
                                  </Badge>
                                ) : (
                                  <Badge variant="destructive">
                                    <AlertTriangle className="h-3 w-3 mr-1" />
                                    {log.tampered ? "Tampered" : "Unverified"}
                                  </Badge>
                                )}
                                {!log.tampered && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      tamperLog(log.id)
                                    }}
                                    className="text-xs"
                                  >
                                    Tamper
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </TabsContent>

          <TabsContent value="blockchain">
            <BlockchainStats />
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Verification Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Verified Logs</span>
                      <span className="text-sm font-medium">{((stats.verified / stats.total) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-chart-2 h-2 rounded-full transition-all"
                        style={{ width: `${(stats.verified / stats.total) * 100}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cloud Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: "AWS", count: stats.aws, color: "bg-chart-3" },
                      { name: "Azure", count: stats.azure, color: "bg-chart-1" },
                      { name: "GCP", count: stats.gcp, color: "bg-chart-2" },
                    ].map((cloud) => (
                      <div key={cloud.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${cloud.color}`} />
                          <span className="text-sm">{cloud.name}</span>
                        </div>
                        <span className="text-sm font-medium">{cloud.count}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Log Details Modal */}
        {selectedLog && <LogDetails log={selectedLog} onClose={() => setSelectedLog(null)} />}
      </div>
    </div>
  )
}
