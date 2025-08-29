export interface TamperEvent {
  id: string
  logId: string
  type: "content_modification" | "timestamp_manipulation" | "hash_mismatch" | "replay_attack"
  originalValue: string
  tamperedValue: string
  detectedAt: string
  severity: "low" | "medium" | "high" | "critical"
  description: string
}

export interface TamperAnalysis {
  isTampered: boolean
  confidence: number
  events: TamperEvent[]
  riskScore: number
}

export class TamperDetector {
  private tamperHistory: Map<string, TamperEvent[]> = new Map()
  private originalHashes: Map<string, string> = new Map()

  // Store original log hash for comparison
  recordOriginalLog(logId: string, logData: any): void {
    const hash = this.generateSimpleHash(JSON.stringify(logData))
    this.originalHashes.set(logId, hash)
  }

  // Detect various types of tampering
  async detectTampering(logId: string, currentLogData: any): Promise<TamperAnalysis> {
    const events: TamperEvent[] = []
    let riskScore = 0

    // Check hash integrity
    const originalHash = this.originalHashes.get(logId)
    const currentHash = this.generateSimpleHash(JSON.stringify(currentLogData))

    if (originalHash && originalHash !== currentHash) {
      const event: TamperEvent = {
        id: `tamper-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        logId,
        type: "hash_mismatch",
        originalValue: originalHash,
        tamperedValue: currentHash,
        detectedAt: new Date().toISOString(),
        severity: "high",
        description: "Log content hash does not match original hash",
      }
      events.push(event)
      riskScore += 70
    }

    // Check for suspicious content patterns
    const contentAnalysis = this.analyzeContent(currentLogData)
    events.push(...contentAnalysis.events)
    riskScore += contentAnalysis.riskScore

    // Check timestamp anomalies
    const timestampAnalysis = this.analyzeTimestamp(currentLogData)
    events.push(...timestampAnalysis.events)
    riskScore += timestampAnalysis.riskScore

    // Store tamper events
    if (events.length > 0) {
      this.tamperHistory.set(logId, [...(this.tamperHistory.get(logId) || []), ...events])
    }

    return {
      isTampered: events.length > 0,
      confidence: Math.min(riskScore, 100),
      events,
      riskScore: Math.min(riskScore, 100),
    }
  }

  private analyzeContent(logData: any): { events: TamperEvent[]; riskScore: number } {
    const events: TamperEvent[] = []
    let riskScore = 0

    // Check for suspicious keywords that indicate tampering
    const suspiciousPatterns = [/\[TAMPERED\]/i, /\[MODIFIED\]/i, /\[DELETED\]/i, /UNAUTHORIZED/i, /SUSPICIOUS/i]

    const logText = JSON.stringify(logData).toLowerCase()

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(logText)) {
        events.push({
          id: `content-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          logId: logData.id || "unknown",
          type: "content_modification",
          originalValue: "clean content",
          tamperedValue: logText,
          detectedAt: new Date().toISOString(),
          severity: "critical",
          description: `Suspicious content pattern detected: ${pattern.source}`,
        })
        riskScore += 50
      }
    }

    return { events, riskScore }
  }

  private analyzeTimestamp(logData: any): { events: TamperEvent[]; riskScore: number } {
    const events: TamperEvent[] = []
    let riskScore = 0

    if (logData.timestamp) {
      const logTime = new Date(logData.timestamp)
      const now = new Date()

      // Check for future timestamps (impossible)
      if (logTime > now) {
        events.push({
          id: `timestamp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          logId: logData.id || "unknown",
          type: "timestamp_manipulation",
          originalValue: "valid timestamp",
          tamperedValue: logData.timestamp,
          detectedAt: new Date().toISOString(),
          severity: "high",
          description: "Log timestamp is in the future",
        })
        riskScore += 40
      }

      // Check for very old timestamps (suspicious)
      const daysDiff = (now.getTime() - logTime.getTime()) / (1000 * 60 * 60 * 24)
      if (daysDiff > 365) {
        events.push({
          id: `timestamp-old-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          logId: logData.id || "unknown",
          type: "timestamp_manipulation",
          originalValue: "recent timestamp",
          tamperedValue: logData.timestamp,
          detectedAt: new Date().toISOString(),
          severity: "medium",
          description: "Log timestamp is unusually old",
        })
        riskScore += 20
      }
    }

    return { events, riskScore }
  }

  // Simulate different types of tampering for demo
  simulateTampering(logData: any, tamperType: string): any {
    const tamperedLog = { ...logData }

    switch (tamperType) {
      case "content":
        tamperedLog.event = tamperedLog.event + " [TAMPERED]"
        break
      case "timestamp":
        tamperedLog.timestamp = new Date(Date.now() + 86400000).toISOString() // Future date
        break
      case "cloud":
        const clouds = ["AWS", "Azure", "GCP"]
        tamperedLog.cloud = clouds[Math.floor(Math.random() * clouds.length)]
        break
      case "critical":
        tamperedLog.event = "UNAUTHORIZED ACCESS DETECTED [CRITICAL]"
        tamperedLog.timestamp = new Date(Date.now() + 86400000).toISOString()
        break
      default:
        tamperedLog.event = tamperedLog.event + " [MODIFIED]"
    }

    return tamperedLog
  }

  getTamperHistory(logId: string): TamperEvent[] {
    return this.tamperHistory.get(logId) || []
  }

  getAllTamperEvents(): TamperEvent[] {
    const allEvents: TamperEvent[] = []
    for (const events of this.tamperHistory.values()) {
      allEvents.push(...events)
    }
    return allEvents.sort((a, b) => new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime())
  }

  private generateSimpleHash(data: string): string {
    let hash = 0
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash
    }
    return Math.abs(hash).toString(16).padStart(8, "0")
  }
}

// Singleton instance
export const tamperDetector = new TamperDetector()
