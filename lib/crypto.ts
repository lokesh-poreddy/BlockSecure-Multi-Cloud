// Crypto utilities for log hashing and blockchain simulation
export async function hashLog(logData: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(logData)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

export function generateTransactionId(): string {
  return "ST" + Math.random().toString(36).substr(2, 9).toUpperCase()
}

export interface BlockchainAnchor {
  hash: string
  txId: string
  timestamp: string
  verified: boolean
}

// Simulate blockchain anchoring
export async function anchorToBlockchain(logHash: string): Promise<BlockchainAnchor> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 100 + Math.random() * 500))

  return {
    hash: logHash,
    txId: generateTransactionId(),
    timestamp: new Date().toISOString(),
    verified: Math.random() > 0.05, // 95% success rate
  }
}

// Simulate blockchain verification
export async function verifyOnBlockchain(hash: string, txId: string): Promise<boolean> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 50 + Math.random() * 200))

  // In a real implementation, this would query the Stacks blockchain
  return Math.random() > 0.1 // 90% verification success rate
}
