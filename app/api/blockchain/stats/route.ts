import { NextResponse } from "next/server"
import { getBlockchainStats } from "@/lib/blockchain"

export async function GET() {
  try {
    const stats = getBlockchainStats()
    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching blockchain stats:", error)
    return NextResponse.json({ error: "Failed to fetch blockchain stats" }, { status: 500 })
  }
}
