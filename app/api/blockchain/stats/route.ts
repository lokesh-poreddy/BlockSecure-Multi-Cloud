import { NextResponse } from "next/server"
import { getBlockchainStats } from "@/lib/mock-blockchain-service"

export async function GET() {
  try {
    const rawStats = getBlockchainStats()
    
    // Transform the stats to match the frontend expectations
    const stats = {
      currentBlockHeight: rawStats.blockHeight,
      totalAnchors: rawStats.txCount,
      verifiedAnchors: rawStats.confirmed,
      pendingTransactions: rawStats.pending,
      averageConfirmationTime: "~10 seconds", // Mock value since we use setTimeout in mock service
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching blockchain stats:", error)
    return NextResponse.json(
      { error: "Failed to fetch blockchain stats" }, 
      { status: 500 }
    )
  }
}
