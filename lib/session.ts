export const SESSION_COOKIE_NAME = "byteshift_admin_session";

const DEV_FALLBACK_SECRET = "byteshift-secret-key-change-in-production";

function getAuthSecret(): string {
  const secret = process.env.AUTH_SECRET || process.env.JWT_SECRET;
  if (!secret) {
    // Never allow the well-known fallback secret in production — a predictable
    // key lets anyone forge a valid admin session token.
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "AUTH_SECRET (or JWT_SECRET) must be set in production. Refusing to sign/verify sessions with the insecure default key."
      );
    }
    return DEV_FALLBACK_SECRET;
  }
  return secret;
}

async function getKey(): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return await crypto.subtle.importKey(
    "raw",
    enc.encode(getAuthSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function base64UrlEncode(str: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(str)
      .toString("base64")
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
  }
  return btoa(str)
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64UrlDecode(str: string): string {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) str += "=";
  if (typeof Buffer !== "undefined") {
    return Buffer.from(str, "base64").toString();
  }
  return atob(str);
}

export async function signSession(payload: {
  id: string;
  email: string;
  role: string;
  exp: number;
}): Promise<string> {
  const data = base64UrlEncode(JSON.stringify(payload));
  const key = await getKey();
  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(data)
  );
  const signatureBytes = new Uint8Array(signatureBuffer);
  let binary = "";
  for (let i = 0; i < signatureBytes.length; i++) {
    binary += String.fromCharCode(signatureBytes[i]);
  }
  const signature = base64UrlEncode(binary);
  return `${data}.${signature}`;
}

export async function verifySession(
  token: string
): Promise<{ id: string; email: string; role: string } | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    const [data, signature] = parts;
    const key = await getKey();
    const sigBinary = base64UrlDecode(signature);
    const sigBytes = new Uint8Array(sigBinary.length);
    for (let i = 0; i < sigBinary.length; i++) {
      sigBytes[i] = sigBinary.charCodeAt(i);
    }
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      sigBytes,
      new TextEncoder().encode(data)
    );
    if (!valid) return null;
    const payload = JSON.parse(base64UrlDecode(data));
    if (payload.exp && Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}
