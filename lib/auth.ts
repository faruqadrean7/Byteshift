import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { queryOne, query } from "@/lib/db";
import {
  SESSION_COOKIE_NAME,
  signSession,
  verifySession,
} from "@/lib/session";

export type AdminUser = {
  id: string;
  email: string;
  role: string;
  full_name: string | null;
  avatar_url: string | null;
};

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

export async function authenticateAdmin(
  email: string,
  password: string
): Promise<{ user?: AdminUser; error?: string }> {
  const normalizedEmail = (email || "").trim().toLowerCase();
  const envAdminEmail = (process.env.ADMIN_EMAIL || "admin@byteshift.id").trim().toLowerCase();
  const envAdminPassword = process.env.ADMIN_PASSWORD || "admin123";

  // 1. Direct match with environment credentials (.env.local)
  if (normalizedEmail === envAdminEmail && password === envAdminPassword) {
    const exp = Date.now() + 7 * 24 * 60 * 60 * 1000;
    const token = await signSession({
      id: "admin-root",
      email: envAdminEmail,
      role: "admin",
      exp,
    });

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return {
      user: {
        id: "admin-root",
        email: envAdminEmail,
        role: "admin",
        full_name: "Super Admin Byteshift",
        avatar_url: null,
      },
    };
  }

  // 2. Query database profiles table if database is configured
  try {
    const profile = await queryOne<{
      id: string;
      email: string;
      password_hash: string;
      full_name: string | null;
      avatar_url: string | null;
      role: string;
    }>(
      "SELECT id, email, password_hash, full_name, avatar_url, role FROM profiles WHERE LOWER(email) = LOWER($1)",
      [normalizedEmail]
    );

    if (profile) {
      const matches = await verifyPassword(password, profile.password_hash);
      if (matches && ["admin", "editor"].includes(profile.role)) {
        const exp = Date.now() + 7 * 24 * 60 * 60 * 1000;
        const token = await signSession({
          id: profile.id,
          email: profile.email,
          role: profile.role,
          exp,
        });

        const cookieStore = await cookies();
        cookieStore.set(SESSION_COOKIE_NAME, token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 7 * 24 * 60 * 60,
        });

        return {
          user: {
            id: profile.id,
            email: profile.email,
            role: profile.role,
            full_name: profile.full_name,
            avatar_url: profile.avatar_url,
          },
        };
      }
    }
  } catch (err) {
    console.error("DB Auth query error:", err);
  }

  return { error: "Email atau password salah." };
}

export async function getCurrentUser(): Promise<AdminUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const session = await verifySession(token);
  if (!session) return null;

  if (session.id === "admin-root") {
    return {
      id: "admin-root",
      email: session.email,
      role: session.role,
      full_name: "Super Admin Byteshift",
      avatar_url: null,
    };
  }

  try {
    const profile = await queryOne<AdminUser>(
      "SELECT id, email, role, full_name, avatar_url FROM profiles WHERE id = $1",
      [session.id]
    );

    return (
      profile ?? {
        id: session.id,
        email: session.email,
        role: session.role,
        full_name: null,
        avatar_url: null,
      }
    );
  } catch {
    return {
      id: session.id,
      email: session.email,
      role: session.role,
      full_name: null,
      avatar_url: null,
    };
  }
}

export async function logoutAdmin(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function createAdminUser(
  email: string,
  password: string,
  fullName = "Admin Byteshift",
  role = "admin"
) {
  const hash = await hashPassword(password);
  const rows = await query<AdminUser>(
    `INSERT INTO profiles (email, password_hash, full_name, role)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (email) DO UPDATE SET password_hash = $2, full_name = $3, role = $4
     RETURNING id, email, role, full_name, avatar_url`,
    [email.toLowerCase(), hash, fullName, role]
  );
  return rows[0];
}
