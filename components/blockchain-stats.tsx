"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, Blocks, Clock } from "lucide-react"

interface BlockchainStats {
  currentBlockHeight: number
  totalAnchors: number
  verifiedAnchors: number
  pendingTransactions: number
  averageConfirmationTime: string
}

export function BlockchainStats() {
  const [stats, setStats] = useState<BlockchainStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/blockchain/stats")
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error("Failed to fetch blockchain stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
    const interval = setInterval(fetchStats, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Blocks className="h-5 w-5" />
            Stacks Blockchain Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Blocks className="h-5 w-5" />
            Stacks Blockchain Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Failed to load blockchain stats</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Blocks className="h-5 w-5" />
          Stacks Blockchain Status
          <Badge variant="secondary" className="ml-2">
            <Activity className="h-3 w-3 mr-1" />
            Live
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Block Height</p>
            <p className="text-2xl font-bold">{stats.currentBlockHeight.toLocaleString()}</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total Anchors</p>
            <p className="text-2xl font-bold text-chart-1">{stats.totalAnchors}</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Verified</p>
            <p className="text-2xl font-bold text-chart-2">{stats.verifiedAnchors}</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Pending TX</p>
            <p className="text-2xl font-bold text-accent">{stats.pendingTransactions}</p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Avg Confirmation:</span>
            </div>
            <span className="font-medium">{stats.averageConfirmationTime}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
