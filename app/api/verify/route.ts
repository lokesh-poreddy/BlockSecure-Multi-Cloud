import { NextResponse } from "next/server"
import { verifyLogOnBlockchain } from "@/lib/blockchain"

export async function POST(request: Request) {
  try {
    const { hash, txId } = await request.json()

    if (!hash) {
      return NextResponse.json({ error: "Hash is required" }, { status: 400 })
    }

    const anchor = await verifyLogOnBlockchain(hash)

    if (!anchor) {
      return NextResponse.json({
        hash,
        txId: txId || null,
        verified: false,
        error: "Log not found on blockchain",
        timestamp: new Date().toISOString(),
      })
    }

    return NextResponse.json({
      hash: anchor.logHash,
      txId: anchor.txId,
      verified: anchor.verified,
      timestamp: anchor.timestamp,
      blockHeight: anchor.blockHeight,
      anchorer: anchor.anchorer,
      transaction: anchor.transaction,
    })
  } catch (error) {
    console.error("Error verifying log:", error)
    return NextResponse.json({ error: "Failed to verify log" }, { status: 500 })
  }
}
