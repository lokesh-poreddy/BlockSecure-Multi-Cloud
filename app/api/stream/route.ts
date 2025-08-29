// app/api/stream/route.ts
import { NextRequest } from "next/server";

export const runtime = "edge";
const clients = new Set<ReadableStreamDefaultController>();

export async function GET(_req: NextRequest) {
  const stream = new ReadableStream({
    start(controller) {
      clients.add(controller);
      controller.enqueue(`event: hello\ndata: ${JSON.stringify({ ok: true })}\n\n`);
    },
    cancel() {
      // noop
    },
  });

  // heartbeat to keep connections alive
  const keepAlive = setInterval(() => {
    for (const c of clients) {
      try {
        c.enqueue(`event: ping\ndata: {}\n\n`);
      } catch {
        clients.delete(c);
      }
    }
  }, 25000);

  const headers = {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  };

  // Closing cleanup handled by environment; return Response
  return new Response(stream, {
    headers,
    status: 200,
  });
}

// Exported helper to broadcast from other server routes (Node runtime)
export function broadcastSSE(payload: any, event = "message") {
  const str = `event: ${event}\ndata: ${JSON.stringify(payload)}\n\n`;
  for (const c of Array.from(clients)) {
    try {
      c.enqueue(str);
    } catch {
      clients.delete(c);
    }
  }
}
