import { NextResponse } from "next/server"
import { getTransactionDetails } from "@/lib/blockchain"

export async function GET(request: Request, { params }: { params: { txId: string } }) {
  try {
    const { txId } = params
    const transaction = await getTransactionDetails(txId)

    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }

    return NextResponse.json(transaction)
  } catch (error) {
    console.error("Error fetching transaction:", error)
    return NextResponse.json({ error: "Failed to fetch transaction" }, { status: 500 })
  }
}
