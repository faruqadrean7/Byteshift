import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

function getDatabaseUrl(): string | null {
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.NEON_DATABASE_URL ||
    null
  );
}

let cachedSql: NeonQueryFunction<false, false> | null = null;

export function getDb(): NeonQueryFunction<false, false> | null {
  const url = getDatabaseUrl();
  if (!url) {
    return null;
  }
  if (!cachedSql) {
    cachedSql = neon(url);
  }
  return cachedSql;
}

/**
 * Execute raw parameterized SQL query on Neon DB.
 * Returns array of typed results or fallback array.
 */
export async function query<T = Record<string, unknown>>(
  text: string,
  params: unknown[] = []
): Promise<T[]> {
  const sql = getDb();
  if (!sql) {
    return [];
  }
  try {
    const result = await (sql as any)(text, params);
    return (result as T[]) || [];
  } catch (error) {
    console.error("Neon DB Query Error:", error, { text, params });
    throw error;
  }
}

/**
 * Helper to query a single row
 */
export async function queryOne<T = Record<string, unknown>>(
  text: string,
  params: unknown[] = []
): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows[0] ?? null;
}
