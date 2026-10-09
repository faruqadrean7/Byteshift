import { neon } from "@neondatabase/serverless";
import * as fs from "fs";
import * as path from "path";
import bcrypt from "bcryptjs";

async function main() {
  const databaseUrl =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.NEON_DATABASE_URL;

  if (!databaseUrl) {
    console.error("\n❌ Error: DATABASE_URL tidak ditemukan di environment variable.");
    console.error("Tambahkan DATABASE_URL di file .env.local atau set saat menjalankan script:");
    console.error('DATABASE_URL="postgresql://user:password@ep-xyz.us-east-2.aws.neon.tech/neondb?sslmode=require" npm run db:init\n');
    process.exit(1);
  }

  console.log("\n🚀 Menghubungkan ke Neon DB...");
  const sql = neon(databaseUrl);

  const schemaPath = path.join(process.cwd(), "neon", "schema.sql");
  if (!fs.existsSync(schemaPath)) {
    console.error(`❌ Error: File schema tidak ditemukan di ${schemaPath}`);
    process.exit(1);
  }

  const schemaSql = fs.readFileSync(schemaPath, "utf-8");

  console.log("📦 Menjalankan migrasi tabel ke Neon DB...");
  
  // Split by statements or run directly
  const statements = schemaSql
    .split(";\n")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  for (const statement of statements) {
    try {
      await (sql as any)(statement);
    } catch (err: any) {
      // Ignore already exists notices
      if (!err.message?.includes("already exists")) {
        console.warn(`⚠️ Warning executing statement: ${err.message}`);
      }
    }
  }

  console.log("✅ Seluruh tabel Neon DB berhasil dibuat / dimigrasi!");

  // Create default initial admin
  const adminEmail = process.env.ADMIN_EMAIL || "admin@byteshift.id";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  try {
    await (sql as any)`
      INSERT INTO profiles (email, password_hash, full_name, role)
      VALUES (${adminEmail.toLowerCase()}, ${passwordHash}, 'Super Admin Byteshift', 'admin')
      ON CONFLICT (email) DO UPDATE SET password_hash = ${passwordHash}, role = 'admin'
    `;
    console.log(`\n👑 Akun Admin Default Siap Digunakan:`);
    console.log(`   Email   : ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
    console.log(`   Login di: http://localhost:3000/admin/login`);
  } catch (err: any) {
    console.error("Gagal membuat akun admin:", err.message);
  }

  console.log("\n🎉 Inisialisasi Neon DB Selesai dengan Sukses!\n");
}

main().catch((err) => {
  console.error("\n❌ Gagal inisialisasi database:", err);
  process.exit(1);
});
