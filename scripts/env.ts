import * as fs from "fs";
import * as path from "path";

/**
 * Minimal .env loader for standalone scripts (tsx does not auto-load env files).
 * Reads .env.local then .env, strips surrounding quotes, and never overrides a
 * value already present in process.env (so shell-provided vars win).
 */
export function loadEnv(files: string[] = [".env.local", ".env"]): void {
  for (const file of files) {
    const envPath = path.join(process.cwd(), file);
    if (!fs.existsSync(envPath)) continue;

    for (const rawLine of fs.readFileSync(envPath, "utf-8").split("\n")) {
      const line = rawLine.trim();
      if (!line || line.startsWith("#")) continue;

      const idx = line.indexOf("=");
      if (idx === -1) continue;

      const key = line.slice(0, idx).trim();
      let value = line.slice(idx + 1).trim();

      // Strip a single pair of matching surrounding quotes.
      if (
        value.length >= 2 &&
        ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'")))
      ) {
        value = value.slice(1, -1);
      }

      if (key && process.env[key] === undefined) {
        process.env[key] = value;
      }
    }
  }
}
