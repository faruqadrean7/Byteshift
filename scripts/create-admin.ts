import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";
import { loadEnv } from "./env";

loadEnv();

async function main() {
  const databaseUrl =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.NEON_DATABASE_URL;

  if (!databaseUrl) {
    console.error("❌ DATABASE_URL tidak ditemukan di .env.local");
    process.exit(1);
  }

  const args = process.argv.slice(2);
  const email = args[0] || process.env.ADMIN_EMAIL || "admin@byteshift.id";
  const password = args[1] || process.env.ADMIN_PASSWORD || "admin123";
  const fullName = args[2] || "Admin Byteshift";

  console.log(`\n🔐 Membuat / Mengupdate akun admin...`);
  console.log(`   Email    : ${email}`);
  console.log(`   Password : ${password}`);
  console.log(`   Nama     : ${fullName}`);

  const sql = neon(databaseUrl);
  const passwordHash = await bcrypt.hash(password, 10);

  await (sql as any)`
    INSERT INTO profiles (email, password_hash, full_name, role)
    VALUES (${email.toLowerCase()}, ${passwordHash}, ${fullName}, 'admin')
    ON CONFLICT (email) DO UPDATE SET password_hash = ${passwordHash}, full_name = ${fullName}, role = 'admin'
  `;

  console.log(`\n✅ Berhasil! Anda sekarang dapat login di:`);
  console.log(`   http://localhost:3000/admin/login atau https://domain-anda.com/admin/login\n`);
}

main().catch((err) => {
  console.error("❌ Gagal:", err);
  process.exit(1);
});
