export interface Log {
  id: string
  cloud: "AWS" | "Azure" | "GCP"
  event: string
  timestamp: string
  hash: string
  txId: string
  verified: boolean
  tampered?: boolean
  blockHeight?: number
  transaction?: any
}

export interface User {
  id: string
  email: string
  role: "admin" | "auditor"
  name: string
}
