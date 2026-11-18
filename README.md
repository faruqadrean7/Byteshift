# Byteshift Consulting — Website + CMS (Neon DB Edition)

Website profil konsultan teknologi & rekayasa perangkat lunak modern dengan admin CMS terintegrasi. Seluruh konten (Portfolio, Services, Testimoni, FAQ, Paket, Tim, Blog, Leads, Settings) dapat dikelola langsung lewat panel admin.

> 📖 **Panduan Pindah Device / Laptop**: Baca [Panduan Lanjut Kerja di Device Lain](docs/CARA_LANJUT_KERJA_DI_DEVICE_LAIN.md) untuk langkah-langkah setup di komputer baru.

---

## ⚡ Tech Stack

- **Next.js 15** (App Router, Server Components, Server Actions, ISR)
- **Database**: **Neon DB** (Serverless PostgreSQL) via `@neondatabase/serverless`
- **Auth**: Built-in Secure Session & Password Hashing via `bcryptjs` + Web Crypto HMAC
- **Media Storage**: Built-in Server Upload (`/api/upload`) & Multi-origin CDN Support
- **Styling**: Tailwind CSS + Framer Motion
- **Editor**: Tiptap Rich Text Editor (Blog & Portfolio detail)
- **Form & Validation**: React Hook Form + Zod
- **Email Notifications**: Resend API (Opsional)

---

## 🚀 Panduan Setup dengan Neon DB

### 1. Dapatkan Connection String dari Neon
1. Masuk ke [neon.tech](https://neon.tech) dan buat project database PostgreSQL baru.
2. Di Dashboard Neon (bagian **Connection Details**), salin **Connection string** (Node.js / PostgreSQL).
   Contoh:
   ```env
   DATABASE_URL="postgresql://neondb_owner:npg_xxxx@ep-soft-xxxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
   ```

### 2. Konfigurasi Environment Variable
Salin `.env.example` menjadi `.env.local`:
```bash
cp .env.example .env.local
```
Lalu masukkan `DATABASE_URL` Anda ke `.env.local`.

### 3. Inisialisasi Database Otomatis (Migrasi + Buat Admin)
Jalankan perintah berikut:
```bash
npm run db:init
```
Perintah ini akan otomatis:
- Menghubungkan ke Neon DB Anda.
- Membuat semua tabel (`profiles`, `services`, `portfolio`, `testimonials`, `faqs`, `packages`, `team_members`, `blog_posts`, `leads`, `site_settings`), indeks, dan trigger.
- Membuat akun admin default:
  - **Email**: `admin@byteshift.id`
  - **Password**: `admin123`

*(Catatan: Anda juga bisa menyalin langsung script SQL dari file `neon/schema.sql` ke **SQL Editor** di dashboard Neon Console).*

### 4. Jalankan Aplikasi
```bash
npm run dev
```

- **Website Publik**: [http://localhost:3000](http://localhost:3000)
- **Panel Admin CMS**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

---

## 📂 Struktur Database (Neon DB)

| Tabel | Deskripsi |
|---|---|
| `profiles` | Data akun admin, email, password hash (`bcrypt`), peran (`admin`/`editor`) |
| `services` | Katalog layanan & kapabilitas konsultasi teknologi |
| `portfolio` | Studi kasus, hasil implementasi, galeri, dan metrik dampak bisnis |
| `testimonials` | Ulasan dan testimoni pimpinan perusahaan/klien |
| `faqs` | Pertanyaan umum seputar layanan dan garansi SLA |
| `packages` | Paket solusi teknologi & konsultasi |
| `team_members` | Profil pimpinan dan principal engineer |
| `blog_posts` | Artikel wawasan teknis & strategi digital |
| `leads` | Formulir inkuiri proyek dari calon klien |
| `site_settings` | Konfigurasi branding, nomor WhatsApp, email, dan statistik |

---

## 🔒 Fitur Keamanan Admin
- **Password Hashing**: Menggunakan `bcryptjs` dengan salt rounds terstandar.
- **Signed Session Token**: Menggunakan token HMAC SHA-256 tersimpan di HTTP-Only cookie.
- **Protected Middleware**: Melindungi seluruh rute `/admin/*` di level Edge Network.
- **Auth berlapis pada Server Actions**: Setiap aksi tulis/hapus memverifikasi sesi admin (`requireAdmin`), tidak hanya mengandalkan middleware.
- **Parameterized SQL**: Seluruh query menggunakan parameterized input untuk mencegah SQL Injection.
- **Upload terproteksi**: Endpoint `/api/upload` wajib sesi admin, memvalidasi tipe MIME (JPG/PNG/WebP/GIF/AVIF, SVG ditolak), dan membatasi ukuran file (5 MB).
- **Rate limiting**: `/api/auth/login` (5 percobaan / 10 menit per IP) dan `/api/leads` (5 kiriman / menit per IP).

## ⚠️ Catatan Wajib untuk Produksi (`NODE_ENV=production`)
- **`AUTH_SECRET` WAJIB diisi.** Tanpa ini, aplikasi menolak menandatangani/memverifikasi sesi (fail-closed) demi mencegah token admin dipalsukan. Gunakan string acak ≥ 32 karakter.
- **`ADMIN_PASSWORD` WAJIB diisi** bila ingin memakai login kredensial `.env`. Di produksi, password default `admin123` **dinonaktifkan** — jika kosong, login hanya lewat akun di tabel `profiles`.
- **Upload file: Neon Object Storage (disarankan) atau disk lokal.** Jika env `AWS_*` (lihat `.env.example` bagian 7) diisi, `/api/upload` menyimpan foto ke **Neon Object Storage** (S3-compatible, persisten & aman untuk serverless). Bucket harus mode `public_read` agar foto bisa dilihat pengunjung. Jika env kosong, upload fallback ke `public/uploads` — ini **tidak persisten di serverless read-only** (mis. Vercel), hanya cocok untuk lokal/VPS.
- **Rate limiting bersifat in-memory** (per instance). Untuk multi-instance, gunakan store bersama seperti Upstash Redis.
- **Secret `/api/revalidate`** hanya diterima via header `x-secret` (bukan query string).
