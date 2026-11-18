# Redesign UI — "Soft Steel" (Kalem · Elegan · Profesional)

**Tanggal:** 2026-11-18
**Status:** Menunggu persetujuan
**Pemilik:** RUQQARCH (ByteShift)

## Maksud & Alasan (Why)

Tampilan situs publik ByteShift saat ini terasa terlalu "ramai": warna aksen
biru/sky terlalu jenuh (mis. `#4C9AED`, `blue-500`, `sky-300/400`) sehingga
"menyala" di atas latar gelap, ditambah loncatan tajam antar-section dari
**putih ke navy**. Tujuan redesign: tampilan **lebih kalem, elegan, dan
profesional tanpa mengubah identitas** (tetap navy + biru). Card dan transisi
antar-section dirapikan agar terasa satu sistem.

Keputusan arah diambil bersama lewat mockup visual: palet **Soft Steel**,
mayoritas section gelap dengan **satu/beberapa selingan terang yang elegan**.

## Goals

- Palet dark **Soft Steel** yang konsisten: biru di-desaturasi ke arah baja,
  dipakai hemat sebagai aksen.
- Hilangkan loncatan kontras: antar-section gelap hanya bergeser nada tipis;
  transisi gelap↔terang pakai **gradasi lembut**, bukan garis keras.
- **Selingan terang elegan**: off-white kebiruan (`#EEF1F6`), bukan putih murni;
  aksen biru-baja lebih tua (`#3C6193`) agar tetap satu keluarga.
- **Card** konsisten: permukaan navy bertingkat, garis hairline halus, hover
  lembut (naik sedikit + garis menyala pelan), bukan flip warna penuh.
- Satu sumber kebenaran warna (CSS variables + token Tailwind) agar konsisten
  dan mudah dirawat.

## Non-Goals / Anti-Goals

- **Bukan** mengubah struktur layout, konten, atau copy teks.
- **Bukan** mengganti font/tipografi secara drastis (tetap pakai display/sans
  yang ada).
- **Bukan** menyentuh fungsionalitas, data, auth, atau API.
- Panel **admin/CMS tidak** di-overhaul visualnya pada proyek ini — hanya
  dipastikan tidak rusak oleh perubahan token (lihat "Batasan").
- Anti-goal: tampilan jadi monoton/membosankan (karena itu ada selingan
  terang), atau aksen hilang sama sekali sehingga terasa datar.

## Batasan (Constraints)

- Stack tetap: Next.js + Tailwind. Token didefinisikan di
  `app/globals.css` (`:root`) dan dipetakan di `tailwind.config.ts`.
- Identitas warna harus tetap **navy + biru** (tidak boleh ganti hue utama ke
  warna lain).
- Admin memakai sebagian token yang sama; perubahan token tidak boleh membuat
  teks admin tidak terbaca (kontras minimum tetap terjaga).
- Perubahan harus tetep lolos `npm run typecheck` dan `npm run build`.

## Palet Final (Token)

**Sistem gelap (mayoritas section):**

| Token | Nilai | Pakai |
|---|---|---|
| `base` | `#0E1420` | Latar section tergelap / hero |
| `surface` | `#151D2D` | Latar section selang-seling |
| `surface-2` | `#1A2436` | Permukaan card |
| `raise` | `#212D42` | Card saat hover |
| `line` | `rgba(148,163,184,.10)` | Garis hairline default |
| `line-strong` | `rgba(148,163,184,.20)` | Garis/pemisah lebih tegas |
| `accent` | `#6A8DB5` | Aksen baja (tombol, ikon, dot) |
| `accent-strong` | `#84A6CC` | Aksen hover/penekanan |
| `accent-soft` | `#B0C0D3` | Teks aksen di latar gelap |
| `text` | `#ECEFF4` | Teks utama |
| `muted` | `#95A3B7` | Teks sekunder |
| `faint` | `#6B7A90` | Label/caption |

**Selingan terang (elegan):**

| Token | Nilai | Pakai |
|---|---|---|
| `light` | `#EEF1F6` | Latar section terang (off-white kebiruan) |
| `light-card` | `#FFFFFF` | Card di area terang |
| `light-line` | `rgba(15,23,42,.08)` | Garis di area terang |
| `ink` | `#1F2A3D` | Teks utama di area terang |
| `ink-muted` | `#5A6A80` | Teks sekunder di area terang |
| `accent-ink` | `#3C6193` | Aksen biru-baja di area terang |

**Transisi section:**
- Gelap ↔ gelap: pemisah tipis `linear-gradient(90deg,transparent,line-strong,transparent)`.
- Gelap ↔ terang: blok gradasi vertikal ~80px (`base`→`light` dan sebaliknya).

**Spesifikasi card:**
- Radius 16px; padding ~22px; border hairline (`line`).
- Ikon di dalam tile rounded (11px) berlatar `rgba(106,141,181,.14)`.
- Hover gelap: `translateY(-4px)` + border `rgba(106,141,181,.4)` + bg `raise`.
- Hover terang: `translateY(-4px)` + shadow lembut membesar.
- Card unggulan: gradasi halus `#263448`→`surface-2` + border aksen + shadow
  biru lembut.

## Rencana Selingan Terang

Mayoritas halaman gelap. Section yang dijadikan selingan terang (1–2 saja agar
"napas"-nya terasa, tidak selang-seling terus):
- **Portofolio Pilihan** di homepage (grid karya terbaca lebih jelas di terang).
- Kandidat kedua (opsional): section **Proses** atau **Testimoni**.

Builder menentukan penempatan final berdasarkan ritme halaman, dengan aturan:
tidak ada dua selingan terang berdempetan, dan setiap batas gelap↔terang pakai
gradasi lembut.

## Approaches (yang dipertimbangkan)

**Approach 1 — Token terpusat + sweep komponen (DIPILIH).**
Definisikan seluruh warna di `globals.css` (`:root`) dan petakan sebagai token
semantik di `tailwind.config.ts`. Lalu sapu 21 komponen publik + 7 halaman:
ganti warna ad-hoc (`#4C9AED`, `blue-500`, `sky-400`, `bg-white`, dll.) ke token
baru; terapkan spesifikasi card & transisi section.
- *Pro:* satu sumber kebenaran, konsisten, mudah dirawat, masalah "kontras"
  tidak kambuh.
- *Kontra:* menyentuh banyak file (butuh verifikasi build menyeluruh).

**Approach 2 — Restyle per-komponen tanpa ubah token.**
Ganti nilai kelas langsung di tiap komponen, biarkan sistem token apa adanya.
- *Pro:* risiko regresi global kecil.
- *Kontra:* inkonsistensi tetap ada, sulit dirawat, masalah warna gampang
  kambuh. Ditolak karena bertentangan dengan tujuan "satu sistem".

**Approach 3 — Buat design-system package terpisah.**
- Overkill untuk situs ini; ditolak.

## Yang diputuskan vs diserahkan ke builder

**Sudah diputuskan (di atas):** palet & token final, spesifikasi card, aturan
transisi section, pendekatan implementasi (Approach 1), dan kebijakan selingan
terang.

**Diserahkan ke builder:**
- Penempatan final section terang (mengikuti aturan di atas).
- Pemetaan detail tiap kelas lama → token baru per komponen.
- Nilai shadow/opacity final dalam rentang yang sudah dicontohkan di mockup.
- Urutan pengerjaan & pemecahan task (akan disusun di tahap plan).

## Verifikasi

- `npm run typecheck` dan `npm run build` hijau.
- Tinjauan visual tiap halaman publik (homepage, portfolio, tentang, kontak,
  blog) memastikan tidak ada loncatan kontras & aksen tidak "menyala".
- Tidak ada warna hardcoded lama tersisa di komponen publik (grep `#4C9AED`
  dkk. kosong).
