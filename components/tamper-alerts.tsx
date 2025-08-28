"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Shield, Eye, Clock, X } from "lucide-react"
import { tamperDetector, type TamperEvent } from "@/lib/tamper-detection"

export function TamperAlerts() {
  const [tamperEvents, setTamperEvents] = useState<TamperEvent[]>([])
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set())

  useEffect(() => {
    const updateTamperEvents = () => {
      const events = tamperDetector.getAllTamperEvents()
      setTamperEvents(events)
    }

    updateTamperEvents()
    const interval = setInterval(updateTamperEvents, 2000)

    return () => clearInterval(interval)
  }, [])

  const activeTamperEvents = tamperEvents.filter((event) => !dismissedAlerts.has(event.id))

  const dismissAlert = (eventId: string) => {
    setDismissedAlerts((prev) => new Set([...prev, eventId]))
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      case "high":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20"
      case "medium":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "low":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getTamperTypeLabel = (type: string) => {
    switch (type) {
      case "content_modification":
        return "Content Modified"
      case "timestamp_manipulation":
        return "Timestamp Tampered"
      case "hash_mismatch":
        return "Hash Mismatch"
      case "replay_attack":
        return "Replay Attack"
      default:
        return "Unknown Tampering"
    }
  }

  if (activeTamperEvents.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-chart-2" />
            Security Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-chart-2">
            <Shield className="h-4 w-4" />
            <span className="text-sm">All logs verified - No tampering detected</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          Security Alerts ({activeTamperEvents.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {activeTamperEvents.slice(0, 5).map((event) => (
            <Alert key={event.id} className="relative">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={getSeverityColor(event.severity)} variant="outline">
                        {event.severity.toUpperCase()}
                      </Badge>
                      <Badge variant="outline">{getTamperTypeLabel(event.type)}</Badge>
                    </div>
                    <p className="text-sm font-medium mb-1">{event.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(event.detectedAt).toLocaleTimeString()}
                      </span>
                      <span>Log: {event.logId.slice(0, 8)}...</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => dismissAlert(event.id)}
                    className="h-6 w-6 p-0 shrink-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          ))}
          {activeTamperEvents.length > 5 && (
            <div className="text-center">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View All {activeTamperEvents.length} Alerts
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
