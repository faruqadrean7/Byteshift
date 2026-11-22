import asyncio
import os
import sys
from sqlalchemy import text
from backend.app.db.session import AsyncSessionLocal

SECTORS_DATA = [
  {
    "slug": "fintech",
    "name": "Perbankan & FinTech",
    "category_tag": "Financial Services",
    "filter_group": "finance",
    "image": "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80",
    "executive_summary": "Payment engine throughput tinggi berlatensi rendah untuk meniadakan bottleneck transaksi dan memenuhi standar regulasi OJK & BI.",
    "key_benefits": [
      "Latensi pemrosesan transaksi <200ms dengan garansi 99.99% SLA",
      "Enkripsi bertingkat & otomatisasi rekonsiliasi data tanpa selisih",
    ],
    "impact_metric": "99.99% SLA · <200ms",
    "href": "/kontak",
    "order_index": 1,
  },
  {
    "slug": "manufacturing",
    "name": "Manufaktur & Smart Factory",
    "category_tag": "Industrial IoT",
    "filter_group": "industry",
    "image": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
    "executive_summary": "Telemetri sensor mesin real-time untuk mencegah unplanned downtime serta menyinkronkan rantai pasok bahan baku pabrik.",
    "key_benefits": [
      "Deteksi dini anomali sensor mesin secara preventif 24/7",
      "Peningkatan efisiensi operasional pabrik dan logistik +35%",
    ],
    "impact_metric": "Zero Downtime · +35% Efisiensi",
    "href": "/kontak",
    "order_index": 2,
  },
  {
    "slug": "healthcare",
    "name": "Kesehatan & Rumah Sakit",
    "category_tag": "Healthcare & SIMRS",
    "filter_group": "health",
    "image": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
    "executive_summary": "SIMRS satu pintu berstandar HL7/FHIR yang mengintegrasikan rekam medis elektronik (RME), antrean terpadu, dan klaim BPJS.",
    "key_benefits": [
      "Pemangkasan waktu antrean loket pasien rawat jalan hingga 80%",
      "Kepatuhan 100% regulasi SatuSehat Kementerian Kesehatan RI",
    ],
    "impact_metric": "Waktu Tunggu -80% · 100% RME",
    "href": "/kontak",
    "order_index": 3,
  },
  {
    "slug": "retail",
    "name": "Enterprise & Retail Distribusi",
    "category_tag": "Commerce & ERP",
    "filter_group": "finance",
    "image": "https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=800&q=80",
    "executive_summary": "Penyatuan operasional multi-cabang dan inventaris gudang dalam satu sistem ERP sentral terpadu tanpa selisih stok fisik.",
    "key_benefits": [
      "Sinkronisasi stok real-time ke seluruh channel penjualan & POS",
      "Otomatisasi laporan laba rugi konsolidasi multi-perusahaan",
    ],
    "impact_metric": "0% Selisih Stok · Rekap Instan",
    "href": "/kontak",
    "order_index": 4,
  },
  {
    "slug": "logistics",
    "name": "Logistik & Fleet Management",
    "category_tag": "Smart Logistics",
    "filter_group": "industry",
    "image": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
    "executive_summary": "Optimasi rute armada cerdas dan telematika GPS live untuk menekan konsumsi BBM serta mempercepat manifest pengiriman.",
    "key_benefits": [
      "Penghematan biaya bahan bakar armada kendaraan hingga 25%",
      "Pelacakan pengiriman real-time & e-POD digital instan",
    ],
    "impact_metric": "Hemat BBM 25% · Tracking Live",
    "href": "/kontak",
    "order_index": 5,
  },
  {
    "slug": "education",
    "name": "Pendidikan & Kampus Digital",
    "category_tag": "EdTech & Portal",
    "filter_group": "public",
    "image": "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
    "executive_summary": "Portal akademik berbasis cloud auto-scaling yang stabil menampung lonjakan puluhan ribu mahasiswa serentak pada periode KRS.",
    "key_benefits": [
      "Daya tampung 50.000+ user online bersamaan tanpa server crash",
      "Portal satu pintu terintegrasi modul akademik, SPP, & e-learning",
    ],
    "impact_metric": "50.000+ User · Zero Crash",
    "href": "/kontak",
    "order_index": 6,
  },
  {
    "slug": "government",
    "name": "Sektor Publik & GovTech",
    "category_tag": "Smart Government",
    "filter_group": "public",
    "image": "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80",
    "executive_summary": "Modernisasi sistem perizinan dan layanan publik 24/7 berbasis arsitektur SPBE nasional dengan standar keamanan data BSSN.",
    "key_benefits": [
      "Pemangkasan birokrasi dan waktu pemrosesan dokumen hingga 70%",
      "Enkripsi data kependudukan dan integrasi tanda tangan digital resmi",
    ],
    "impact_metric": "Layanan 24/7 · Alur -70%",
    "href": "/kontak",
    "order_index": 7,
  },
  {
    "slug": "energy",
    "name": "Energi, Tambang & Utilitas",
    "category_tag": "Industrial Remote",
    "filter_group": "industry",
    "image": "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80",
    "executive_summary": "Monitoring telemetri IoT edge offline-first untuk lokasi operasional terpencil guna mencegah kerusakan aset bernilai tinggi.",
    "key_benefits": [
      "Sinkronisasi otomatis saat konektivitas pulih tanpa data loss",
      "Pemantauan parameter K3 dan peringatan dini kerusakan mesin",
    ],
    "impact_metric": "Offline-First · Proteksi Aset",
    "href": "/kontak",
    "order_index": 8,
  },
]

async def migrate():
    async with AsyncSessionLocal() as session:
        print("Creating table 'sectors'...")
        await session.execute(text("""
            CREATE TABLE IF NOT EXISTS sectors (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                slug TEXT UNIQUE NOT NULL,
                name TEXT NOT NULL,
                category_tag TEXT NOT NULL,
                filter_group TEXT NOT NULL DEFAULT 'finance',
                image TEXT NOT NULL,
                executive_summary TEXT NOT NULL,
                key_benefits TEXT[] NOT NULL DEFAULT '{}',
                impact_metric TEXT NOT NULL,
                href TEXT NOT NULL DEFAULT '/kontak',
                order_index INT NOT NULL DEFAULT 0,
                is_active BOOLEAN NOT NULL DEFAULT true,
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            );
        """))
        await session.commit()
        print("Table 'sectors' created.")

        res = await session.execute(text("SELECT COUNT(*) FROM sectors"))
        count = res.scalar()
        print(f"Current sectors count: {count}")
        if count == 0:
            print("Seeding initial sectors...")
            for s in SECTORS_DATA:
                await session.execute(text("""
                    INSERT INTO sectors (
                        slug, name, category_tag, filter_group, image,
                        executive_summary, key_benefits, impact_metric, href, order_index, is_active
                    ) VALUES (
                        :slug, :name, :category_tag, :filter_group, :image,
                        :executive_summary, :key_benefits, :impact_metric, :href, :order_index, true
                    ) ON CONFLICT (slug) DO NOTHING;
                """), s)
            await session.commit()
            print("Seeded 8 sectors successfully!")

if __name__ == "__main__":
    asyncio.run(migrate())
