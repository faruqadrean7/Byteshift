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
    // @neondatabase/serverless v1 exposes `.query(text, params)` for
    // parameterized (non tagged-template) SQL. Calling the function directly
    // with a plain string throws in v1, so we must use `.query`.
    const result = (await sql.query(text, params)) as unknown;
    // With arrayMode/fullResults = false the driver returns the rows array
    // directly; guard for the `{ rows }` shape in case config changes.
    const rows = Array.isArray(result)
      ? (result as T[])
      : ((result as { rows?: T[] })?.rows ?? []);
    return rows;
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
