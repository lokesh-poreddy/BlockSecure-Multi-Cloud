import { NextResponse } from "next/server"
import { tamperDetector } from "@/lib/tamper-detection"

export async function GET() {
  try {
    const allEvents = tamperDetector.getAllTamperEvents()
    return NextResponse.json(allEvents)
  } catch (error) {
    console.error("Error fetching tamper history:", error)
    return NextResponse.json({ error: "Failed to fetch tamper history" }, { status: 500 })
  }
}

export async function GET_BY_LOG(request: Request) {
  try {
    const url = new URL(request.url)
    const logId = url.searchParams.get("logId")

    if (!logId) {
      return NextResponse.json({ error: "Log ID is required" }, { status: 400 })
    }

    const events = tamperDetector.getTamperHistory(logId)
    return NextResponse.json(events)
  } catch (error) {
    console.error("Error fetching tamper history for log:", error)
    return NextResponse.json({ error: "Failed to fetch tamper history" }, { status: 500 })
  }
}
