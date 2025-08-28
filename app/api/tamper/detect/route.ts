import { NextResponse } from "next/server"
import { tamperDetector } from "@/lib/tamper-detection"

export async function POST(request: Request) {
  try {
    const { logId, logData } = await request.json()

    if (!logId || !logData) {
      return NextResponse.json({ error: "Log ID and data are required" }, { status: 400 })
    }

    const analysis = await tamperDetector.detectTampering(logId, logData)

    return NextResponse.json(analysis)
  } catch (error) {
    console.error("Error detecting tampering:", error)
    return NextResponse.json({ error: "Failed to detect tampering" }, { status: 500 })
  }
}
