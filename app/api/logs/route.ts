import { NextResponse } from "next/server"
import { anchorLogToBlockchain } from "@/lib/blockchain"

const CLOUD_PROVIDERS = ["AWS", "Azure", "GCP"] as const
const SAMPLE_EVENTS = {
  AWS: [
    "EC2 instance started",
    "S3 bucket created: finance-data",
    "IAM role updated: AdminRole",
    "RDS database backup completed",
    "Lambda function deployed",
    "CloudWatch alarm triggered",
  ],
  Azure: [
    "VM deployed: Standard_D2s_v3",
    "Blob storage container created: reports-2025",
    "Azure AD user added: alice@company.com",
    "Cosmos DB write operation succeeded",
    "Function App scaled up",
    "Key Vault secret updated",
  ],
  GCP: [
    "BigQuery job executed: daily_sales_report",
    "Cloud Storage bucket created: analytics-data",
    "Pub/Sub message published to topic: alerts",
    "GKE cluster scaled to 5 nodes",
    "Cloud Function triggered",
    "Firestore document updated",
  ],
}

export async function GET() {
  try {
    // Generate a random log entry
    const cloud = CLOUD_PROVIDERS[Math.floor(Math.random() * CLOUD_PROVIDERS.length)]
    const events = SAMPLE_EVENTS[cloud]
    const event = events[Math.floor(Math.random() * events.length)]

    const logEntry = {
      cloud,
      event,
      timestamp: new Date().toISOString(),
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    }

    const anchor = await anchorLogToBlockchain(logEntry)

    const response = {
      ...logEntry,
      hash: anchor.logHash,
      txId: anchor.txId,
      verified: anchor.verified,
      anchoredAt: anchor.timestamp,
      blockHeight: anchor.blockHeight,
      transaction: anchor.transaction,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error generating log:", error)
    return NextResponse.json({ error: "Failed to generate log" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { logData } = await request.json()

    if (!logData) {
      return NextResponse.json({ error: "Log data is required" }, { status: 400 })
    }

    const anchor = await anchorLogToBlockchain(logData)

    return NextResponse.json({
      hash: anchor.logHash,
      txId: anchor.txId,
      verified: anchor.verified,
      timestamp: anchor.timestamp,
      blockHeight: anchor.blockHeight,
      transaction: anchor.transaction,
    })
  } catch (error) {
    console.error("Error anchoring log:", error)
    return NextResponse.json({ error: "Failed to anchor log" }, { status: 500 })
  }
}
