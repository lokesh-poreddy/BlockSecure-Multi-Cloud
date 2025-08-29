"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, FileText, Table } from "lucide-react"
import type { Log } from "@/lib/types"

interface ExportLogsProps {
  logs: Log[]
}

export function ExportLogs({ logs }: ExportLogsProps) {
  const [isExporting, setIsExporting] = useState(false)

  const exportToCSV = async () => {
    setIsExporting(true)

    // Create CSV content
    const headers = ["Timestamp", "Cloud Provider", "Event", "Hash", "Transaction ID", "Verification Status"]
    const csvContent = [
      headers.join(","),
      ...logs.map((log) =>
        [
          new Date(log.timestamp).toISOString(),
          log.cloud,
          `"${log.event}"`,
          log.hash,
          log.txId || "Pending",
          log.verified ? "Verified" : "Failed",
        ].join(","),
      ),
    ].join("\n")

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `blocksecure-logs-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)

    setTimeout(() => setIsExporting(false), 1000)
  }

  const exportToPDF = async () => {
    setIsExporting(true)

    // Create a simple HTML report
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>BlockSecure Log Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .stats { display: flex; justify-content: space-around; margin-bottom: 30px; }
            .stat { text-align: center; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .verified { color: green; }
            .failed { color: red; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>BlockSecure Multi-Cloud Log Report</h1>
            <p>Generated on ${new Date().toLocaleString()}</p>
          </div>
          
          <div class="stats">
            <div class="stat">
              <h3>${logs.length}</h3>
              <p>Total Logs</p>
            </div>
            <div class="stat">
              <h3>${logs.filter((l) => l.verified).length}</h3>
              <p>Verified</p>
            </div>
            <div class="stat">
              <h3>${logs.filter((l) => !l.verified).length}</h3>
              <p>Failed</p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Cloud</th>
                <th>Event</th>
                <th>Hash</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${logs
                .map(
                  (log) => `
                <tr>
                  <td>${new Date(log.timestamp).toLocaleString()}</td>
                  <td>${log.cloud}</td>
                  <td>${log.event}</td>
                  <td style="font-family: monospace; font-size: 12px;">${log.hash.substring(0, 16)}...</td>
                  <td class="${log.verified ? "verified" : "failed"}">
                    ${log.verified ? "✅ Verified" : "❌ Failed"}
                  </td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
        </body>
      </html>
    `

    // Create and download HTML file (can be opened and printed as PDF)
    const blob = new Blob([htmlContent], { type: "text/html" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `blocksecure-report-${new Date().toISOString().split("T")[0]}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)

    setTimeout(() => setIsExporting(false), 1000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Export Logs
        </CardTitle>
        <CardDescription>Download logs with blockchain proofs for compliance and auditing</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={exportToCSV}
            disabled={isExporting || logs.length === 0}
            variant="outline"
            className="flex items-center gap-2 bg-transparent"
          >
            <Table className="h-4 w-4" />
            Export CSV
          </Button>

          <Button
            onClick={exportToPDF}
            disabled={isExporting || logs.length === 0}
            variant="outline"
            className="flex items-center gap-2 bg-transparent"
          >
            <FileText className="h-4 w-4" />
            Export Report
          </Button>
        </div>

        <div className="text-sm text-muted-foreground space-y-2">
          <div className="flex justify-between">
            <span>Total logs:</span>
            <Badge variant="secondary">{logs.length}</Badge>
          </div>
          <div className="flex justify-between">
            <span>Verified logs:</span>
            <Badge variant="default">{logs.filter((l) => l.verified).length}</Badge>
          </div>
          <div className="flex justify-between">
            <span>Failed verification:</span>
            <Badge variant="destructive">{logs.filter((l) => !l.verified).length}</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
