# ByteShift Studio — FastAPI Backend

Backend performa tinggi berbasis **FastAPI (Python)** terintegrasi dengan **Neon PostgreSQL**, menyediakan RESTful API berkecepatan tinggi, validasi skema berbasis **Pydantic v2**, otentikasi **JWT**, dan dokumentasi interaktif **Swagger UI**.

---

## ⚡ Fitur Utama

- **RESTful Endpoints Lengkap**:
  - `Public API`: Services, Portfolio, Testimoni, FAQ, Paket, Tim, Blog, Settings, dan Formulir Leads.
  - `Admin CMS API`: Operasi CRUD penuh untuk seluruh tabel yang terproteksi token JWT Bearer.
  - `Media Upload`: Mendukung cloud storage S3 (Neon Object Storage / AWS S3 / Cloudflare R2) dan fallback lokal.
- **Otomatisasi Dokumentasi**:
  - Swagger UI: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
  - ReDoc: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)
- **Async PostgreSQL ORM**:
  - Ditenagai SQLAlchemy 2.0 Async + `asyncpg`.
  - Kompatibel dengan connection string SSL dari Neon DB.

---

## 🚀 Cara Menjalankan Backend

### Opsi 1: Lewat NPM Script (Root Proyek)
```bash
npm run backend:dev
```

### Opsi 2: Langsung via Bash Script
```bash
./backend/run.sh
```

Server akan aktif di:
- **API Base**: `http://127.0.0.1:8000/api/v1`
- **Swagger Docs**: `http://127.0.0.1:8000/docs`
- **Health Check**: `http://127.0.0.1:8000/health`

---

## 🔑 Autentikasi Admin

Endpoint Admin memerlukan header:
```http
Authorization: Bearer <access_token>
```

Untuk mendapatkan token, lakukan request `POST` ke `/api/v1/auth/login`:
```json
{
  "email": "faruq4drean@gmail.com",
  "password": "<ADMIN_PASSWORD_ANDA>"
}
```

---

## 📂 Struktur Direktori Backend

```text
backend/
├── app/
│   ├── api/
│   │   └── v1/
│   │       └── endpoints/
│   │           ├── admin.py       # CRUD terlindungi untuk CMS
│   │           ├── auth.py        # Login & profil admin
│   │           ├── public.py      # Data publik untuk website Next.js
│   │           └── upload.py      # Handler unggah gambar/media
│   ├── core/
│   │   ├── config.py              # Konfigurasi env & CORS
│   │   └── security.py            # Hashing bcrypt & verifikasi JWT
│   ├── db/
│   │   └── session.py             # Koneksi async SQLAlchemy + asyncpg
│   ├── models/
│   │   └── entities.py            # Model database PostgreSQL
│   ├── schemas/
│   │   └── schemas.py             # Skema Pydantic request & response
│   └── main.py                    # Entry point aplikasi FastAPI
├── requirements.txt               # Daftar dependensi Python
├── run.sh                         # Script runner uvicorn
└── venv/                          # Virtual environment Python
```
