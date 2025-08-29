// lib/mock-blockchain-service.ts
// Simulate Stacks-like behavior: tx lifecycle, block heights, fees
import { randomBytes } from "crypto";

type TxRecord = {
  txId: string;
  hashHex: string;
  status: "pending" | "confirmed" | "failed";
  createdAt: string;
  confirmedAt?: string;
  blockHeight?: number;
  fee: number;
};

const txStore = new Map<string, TxRecord>();
let blockHeight = 1000;

export function mockCreateTx(hashHex: string) {
  const txId = randomBytes(16).toString("hex");
  const rec: TxRecord = {
    txId,
    hashHex,
    status: "pending",
    createdAt: new Date().toISOString(),
    fee: Math.floor(Math.random() * 2000) + 100,
  };
  txStore.set(txId, rec);

  // simulate confirmation after random delay (6-12s)
  setTimeout(() => {
    const r = txStore.get(txId);
    if (!r) return;
    r.status = "confirmed";
    r.confirmedAt = new Date().toISOString();
    r.blockHeight = ++blockHeight;
    txStore.set(txId, r);
  }, 8000 + Math.floor(Math.random() * 5000));

  return rec;
}

export function getTx(txId: string) {
  return txStore.get(txId) ?? null;
}

export function getBlockchainStats() {
  const txs = Array.from(txStore.values());
  return {
    blockHeight,
    txCount: txs.length,
    pending: txs.filter((t) => t.status === "pending").length,
    confirmed: txs.filter((t) => t.status === "confirmed").length,
    avgFee: Math.round((txs.reduce((s, t) => s + t.fee, 0) || 0) / (txs.length || 1)),
  };
}
