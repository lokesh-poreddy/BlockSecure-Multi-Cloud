// app/api/anchor/route.ts
import { NextRequest } from "next/server";
import {
  makeContractCall,
  broadcastTransaction,
  bufferCV,
  stringAsciiCV,
  AnchorMode,
} from "@stacks/transactions";
import { STACKS_TESTNET } from "@stacks/network";

export const runtime = "nodejs";

/**
 * IMPORTANT:
 * - This is a template. You must provide process.env.STACKS_PRIVATE_KEY and YOUR_CONTRACT address.
 * - In production you should not store private keys in plain env vars; use Vault or signing service.
 */

export async function POST(req: NextRequest) {
  const { hashHex } = await req.json().catch(() => ({}));
  if (!hashHex) return new Response(JSON.stringify({ error: "hashHex required" }), { status: 400 });

  try {
    const privateKey = process.env.STACKS_PRIVATE_KEY;
    if (!privateKey) return new Response(JSON.stringify({ error: "no key configured" }), { status: 500 });

    const txOptions = {
      contractAddress: "ST332M323FXZDSTYRNDJ6PRJJFQANEY423QMDAA13",
      contractName: "blocksecure-logs",
      functionName: "store-log-hash",
      functionArgs: [
        bufferCV(Buffer.from(hashHex, "hex")),
        stringAsciiCV(Date.now().toString()),
        stringAsciiCV("system")
      ],
      senderKey: privateKey,
      network: STACKS_TESTNET,
      fee: 1000,
      anchorMode: AnchorMode.Any,
    };

    const tx = await makeContractCall(txOptions);
    const res = await broadcastTransaction({
      transaction: tx,
      network: STACKS_TESTNET
    });
    return new Response(JSON.stringify({ ok: true, txid: res.txid }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
}
