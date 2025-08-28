"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, AlertTriangle, Copy, ExternalLink, Clock, Hash, Blocks } from "lucide-react"

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

interface LogDetailsProps {
  log: LogEntry
  onClose: () => void
}

export function LogDetails({ log, onClose }: LogDetailsProps) {
  const [transactionDetails, setTransactionDetails] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchTransactionDetails = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/blockchain/transaction/${log.txId}`)
        if (response.ok) {
          const data = await response.json()
          setTransactionDetails(data)
        }
      } catch (error) {
        console.error("Failed to fetch transaction details:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTransactionDetails()
  }, [log.txId])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
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

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-lg">{getCloudIcon(log.cloud)}</span>
            Log Details
          </DialogTitle>
          <DialogDescription>
            Detailed information about this log entry and its blockchain verification
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Log Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Log Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge className={getCloudColor(log.cloud)}>
                  {getCloudIcon(log.cloud)} {log.cloud}
                </Badge>
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

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Event</label>
                  <p className="text-sm mt-1">{log.event}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Timestamp</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">{new Date(log.timestamp).toLocaleString()}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Log ID</label>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm font-mono">{log.id}</p>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(log.id)} className="h-6 w-6 p-0">
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Blockchain Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Blocks className="h-5 w-5" />
                Blockchain Verification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Hash (SHA-256)</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-mono">{log.hash}</p>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(log.hash)} className="h-6 w-6 p-0">
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Transaction ID</label>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm font-mono break-all">{log.txId}</p>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(log.txId)} className="h-6 w-6 p-0">
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {log.blockHeight && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Block Height</label>
                    <p className="text-sm mt-1">{log.blockHeight.toLocaleString()}</p>
                  </div>
                )}
              </div>

              <Separator />

              {/* Transaction Details */}
              {loading ? (
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </div>
              ) : transactionDetails ? (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Transaction Details</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <label className="text-muted-foreground">Status</label>
                      <p className="font-medium">
                        {transactionDetails.status === "confirmed" ? (
                          <span className="text-chart-2">Confirmed</span>
                        ) : transactionDetails.status === "pending" ? (
                          <span className="text-accent">Pending</span>
                        ) : (
                          <span className="text-destructive">Failed</span>
                        )}
                      </p>
                    </div>
                    <div>
                      <label className="text-muted-foreground">Gas Used</label>
                      <p className="font-medium">{transactionDetails.gasUsed?.toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="text-muted-foreground">Fee</label>
                      <p className="font-medium">{transactionDetails.fee} STX</p>
                    </div>
                    <div>
                      <label className="text-muted-foreground">Block Hash</label>
                      <p className="font-mono text-xs">{transactionDetails.blockHash?.slice(0, 16)}...</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Transaction details not available</p>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`https://explorer.stacks.co/txid/${log.txId}`, "_blank")}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View on Explorer
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
