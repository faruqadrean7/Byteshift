import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const start = Date.now();
  let dbStatus = "healthy";
  let dbLatencyMs = 0;
  let fastApiStatus = "unreachable";

  try {
    const fastApiUrl = (process.env.FASTAPI_URL || "http://127.0.0.1:8000").replace(/\/$/, "");
    const res = await fetch(`${fastApiUrl}/health`, {
      cache: "no-store",
      signal: AbortSignal.timeout(1000),
    });
    if (res.ok) fastApiStatus = "healthy";
  } catch {}

  try {
    const dbStart = Date.now();
    await query("SELECT 1");
    dbLatencyMs = Date.now() - dbStart;
  } catch (err) {
    dbStatus = "unreachable";
  }

  const uptimeSeconds = Math.floor(process.uptime());
  const memoryUsage = process.memoryUsage();

  const isHealthy = dbStatus === "healthy";

  return NextResponse.json(
    {
      status: isHealthy ? "ok" : "degraded",
      timestamp: new Date().toISOString(),
      service: "byteshift-technology-consulting",
      uptime: `${uptimeSeconds}s`,
      database: {
        status: dbStatus,
        latency: `${dbLatencyMs}ms`,
      },
      fastapi: {
        status: fastApiStatus,
      },
      system: {
        memory_rss_mb: Math.round(memoryUsage.rss / 1024 / 1024),
        memory_heap_used_mb: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        node_version: process.version,
      },
      duration_ms: Date.now() - start,
    },
    { status: isHealthy ? 200 : 503 }
  );
}
