# 💻 Panduan Lanjut Coding di Device / Komputer Lain
### Project: ByteShift Technology Consulting Website & CMS

Panduan ini ditujukan agar Anda dapat melanjutkan pengembangan website **ByteShift** di komputer atau laptop lain (misal: pindah dari PC kantor ke laptop pribadi atau sebaliknya) secara mulus dan tanpa kendala.

---

## 🧭 Prinsip Utama (Cara Kerja Sync)
1. **Kode Program**: Tersimpan aman di repository **GitHub**.
2. **Database & Konten**: Tersimpan di Cloud (**Neon PostgreSQL**), sehingga data artikel, leads, dan portfolio yang sudah Anda input akan otomatis muncul di device baru selama terhubung ke internet.
3. **File Konfigurasi Rahasia (`.env.local`)**: **Sengaja tidak di-upload ke GitHub** demi keamanan. Anda hanya perlu menyalin/membuat ulang file ini sekali saja di device baru.

---

## 🛠️ Prasyarat di Device Baru
Pastikan software berikut sudah terpasang di komputer/laptop baru Anda:
1. **Node.js** (Versi 18.x atau 20.x LTS direkomendasikan): [Download Node.js](https://nodejs.org/)
2. **Git**: [Download Git](https://git-scm.com/)
3. **Code Editor**: VS Code, Cursor, atau editor favorit Anda.

Verifikasi instalasi di terminal device baru:
```bash
node -v
npm -v
git --version
```

---

## 🚀 Langkah-Langkah Menyiapkan di Device Baru

### Langkah 1: Clone Repository dari GitHub
Buka terminal di folder tempat Anda biasa menyimpan project (misal folder `Projects` atau `Documents`), lalu clone repo Anda:

```bash
git clone https://github.com/faruqadrean7/Byteshift.git
```
*(Ganti nama repo jika Anda menggunakan nama repo yang berbeda saat upload).*

Lalu masuk ke dalam folder project:
```bash
cd byteshift
```

---

### Langkah 2: Install Dependencies (Package)
Jalankan perintah ini untuk mengunduh semua library (`node_modules`) yang dibutuhkan:

```bash
npm install
```
*(Atau `pnpm install` jika Anda menggunakan pnpm).*

---

### Langkah 3: Setup File `.env.local`
Karena file `.env.local` diabaikan oleh Git, Anda perlu membuatnya secara manual di folder root `byteshift`:

1. Buat file baru bernama `.env.local` di root project.
2. Salin isi dari file `.env.example` atau gunakan format berikut:

```env
# ============================================================================
# Byteshift Studio — Environment Variables
# ============================================================================

# 1. Neon DB Connection String (Database Cloud)
DATABASE_URL="postgresql://user:password@ep-xyz.us-east-2.aws.neon.tech/neondb?sslmode=require"

# 2. Secret Key Autentikasi Admin Session
AUTH_SECRET="byteshift-super-secret-key-change-this-in-production-12345"

# 3. Kredensial Login Admin Default
ADMIN_EMAIL="admin@byteshift.id"
ADMIN_PASSWORD="admin123"

# 4. URL Website Lokal
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# 5. WhatsApp Admin (Format internasional tanpa simbol +, contoh: 6282210810793)
NEXT_PUBLIC_WA_NUMBER="6282210810793"
```

> 💡 **TIPS PRAKTIS**: Anda bisa menyalin langsung nilai `DATABASE_URL` dari file `.env.local` yang ada di komputer lama Anda agar langsung terhubung ke database yang sama.

---

### Langkah 4: Jalankan Development Server
Setelah dependency terinstall dan `.env.local` terisi, jalankan:

```bash
npm run dev
```

Buka browser Anda:
- **Website Publik**: [http://localhost:3000](http://localhost:3000)
- **Web Admin CMS**: [http://localhost:3000/admin](http://localhost:3000/admin)
  - Email: `admin@byteshift.id`
  - Password: `admin123`

---

## 🔄 Alur Kerja Harian (Workflow Pindah-Pindah Device)

Agar kode Anda tidak bentrok (*conflict*) saat berganti device, terapkan **2 Aturan Emas** ini:

```
[ Device Lama ]  ---> (git push) ---> [ GITHUB ] ---> (git pull) ---> [ Device Baru ]
```

### 1. SEBELUM Mulai Koding di Device Manapun:
Selalu tarik perubahan terbaru dari GitHub:
```bash
git pull origin main
```

### 2. SETELAH Selesai Koding (Sebelum Pindah Device):
Selalu simpan dan upload pekerjaan Anda ke GitHub:
```bash
git add .
git commit -m "Update fitur atau perbaikan terbaru"
git push origin main
```

---

## ❓ Mengatasi Masalah Umum (Troubleshooting)

### 1. Error `Port 3000 is already in use`
Jika port 3000 sedang terpakai proses lain:
- Jalankan di terminal: `npx kill-port 3000`
- Atau biarkan Next.js otomatis berjalan di port berikutnya (biasanya `http://localhost:3001`).

### 2. Error Git `error: Your local changes would be overwritten by merge`
Terjadi jika Anda mengedit file di device baru tanpa melakukan `git pull` terlebih dahulu:
```bash
# Simpan sementara editan lokal Anda:
git stash

# Ambil update dari GitHub:
git pull origin main

# Kembalikan editan lokal Anda:
git stash pop
```

### 3. Error Build atau Modul Tidak Ditemukan
Jika ada library yang error atau cache lawas:
```bash
# Hapus cache build dan node_modules
rm -rf .next node_modules package-lock.json

# Install ulang
npm install
npm run dev
```

---
*ByteShift Technology Consulting — Internal Developer Guide*
