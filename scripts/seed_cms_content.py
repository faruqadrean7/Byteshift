import asyncio
import uuid
import json
from datetime import datetime, timezone
from sqlalchemy import select, text
from backend.app.db.session import AsyncSessionLocal
from backend.app.models.entities import (
    Service,
    Testimonial,
    Portfolio,
    Faq,
    TeamMember,
    BlogPost,
    Profile,
)

async def seed_all():
    async with AsyncSessionLocal() as session:
        # 1. Author
        res = await session.execute(select(Profile).limit(1))
        author = res.scalar_one_or_none()
        author_id = author.id if author else None

        # ==================== SERVICES ====================
        services_data = [
            {
                "slug": "sistem-informasi-erp-enterprise",
                "title": "Sistem Informasi & ERP Enterprise",
                "icon": "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80",
                "description": "Satukan inventaris, keuangan, dan puluhan cabang dalam satu dashboard kendali sentral tanpa data ganda.",
                "tags": ["Operational Efficiency", "0% selisih stok & laporan instan"],
                "order_index": 0,
                "is_active": True,
            },
            {
                "slug": "rekayasa-software-custom",
                "title": "Rekayasa Software & Portal Web Custom",
                "icon": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
                "description": "Bangun platform digital berkecepatan tinggi yang stabil menampung lonjakan puluhan ribu pengguna bersamaan.",
                "tags": ["Core Capability", "100% Hak cipta kode & arsitektur scalable", "highlight"],
                "order_index": 1,
                "is_active": True,
            },
            {
                "slug": "automasi-cerdas-integrasi-api",
                "title": "Automasi Cerdas & Integrasi API",
                "icon": "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80",
                "description": "Hilangkan kerja manual berulang dan sambungkan sistem Anda dengan payment gateway, logistik, bank, dan perpajakan.",
                "tags": ["Process Automation", "Efisiensi kerja naik hingga 40%+"],
                "order_index": 2,
                "is_active": True,
            },
            {
                "slug": "iot-industri-cloud-architecture",
                "title": "IoT Industri & Cloud Architecture",
                "icon": "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
                "description": "Monitoring mesin pabrik real-time 24/7 dan infrastruktur cloud tahan downtime dengan kepatuhan SLA 99.9%.",
                "tags": ["Smart Monitoring", "Deteksi dini sensor & garansi SLA 99.9%"],
                "order_index": 3,
                "is_active": True,
            },
        ]

        for s in services_data:
            existing = await session.execute(select(Service).where(Service.slug == s["slug"]))
            if not existing.scalar_one_or_none():
                session.add(Service(**s))
                print(f"Added service: {s['title']}")

        # ==================== TESTIMONIALS ====================
        testimonials_data = [
            {
                "name": "Hendro Wijaya",
                "role": "Chief Operating Officer",
                "company": "PT Logistik Nusantara",
                "content": "Byteshift berhasil mengintegrasikan sistem ERP multi-cabang kami dalam waktu 3 bulan. Downtime yang dulu sering terjadi kini 100% teratasi dan operasional jauh lebih efisien.",
                "rating": 5,
                "avatar_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
                "is_published": True,
                "order_index": 0,
            },
            {
                "name": "Dr. Amanda Santoso",
                "role": "Direktur Pelayanan Medis",
                "company": "RS Prima Medika",
                "content": "Digitalisasi RME dan sistem antrean terpadu dari Byteshift sangat stabil dan patuh terhadap standar Kemenkes. Pasien tidak lagi menunggu lama dan audit rekam medis jadi sangat cepat.",
                "rating": 5,
                "avatar_url": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
                "is_published": True,
                "order_index": 1,
            },
            {
                "name": "Reza Pratama",
                "role": "Head of Engineering",
                "company": "FinTech Solusindo",
                "content": "Kecepatan eksekusi tim Byteshift luar biasa. Arsitektur payment engine yang mereka bangun mampu menampung lonjakan transaksi jutaan request per hari dengan latensi sangat rendah.",
                "rating": 5,
                "avatar_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
                "is_published": True,
                "order_index": 2,
            },
        ]

        for t in testimonials_data:
            existing = await session.execute(select(Testimonial).where(Testimonial.name == t["name"]))
            if not existing.scalar_one_or_none():
                session.add(Testimonial(**t))
                print(f"Added testimonial: {t['name']}")

        # ==================== PORTFOLIO ====================
        portfolio_data = [
            {
                "slug": "erp-distribusi-nusantara",
                "title": "Sistem ERP Sentral & Sinkronisasi 42 Gudang",
                "category": "ERP & Supply Chain",
                "client_name": "PT Nusantara Prima",
                "year": 2026,
                "cover_image": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
                "gallery": [],
                "short_desc": "Menghubungkan inventaris multi-cabang secara real-time, meniadakan selisih stok fisik, dan mempercepat pencatatan invoice sebesar 60%.",
                "tech_stack": ["PostgreSQL", "Next.js", "Docker", "FastAPI"],
                "is_featured": True,
                "is_published": True,
                "order_index": 0,
            },
            {
                "slug": "simrs-rekam-medis-digital",
                "title": "Rekam Medis Elektronik (RME) & Antrean Terpadu RS",
                "category": "Healthcare System",
                "client_name": "RS Medika Utama",
                "year": 2026,
                "cover_image": "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80",
                "gallery": [],
                "short_desc": "Digitalisasi 100% rekam medis pasien terintegrasi SatuSehat & BPJS, memangkas waktu tunggu rawat jalan dari 45 menit menjadi 8 menit.",
                "tech_stack": ["HL7 FHIR", "PostgreSQL", "Cloud", "FastAPI"],
                "is_featured": True,
                "is_published": True,
                "order_index": 1,
            },
            {
                "slug": "fintech-payment-engine",
                "title": "High-Throughput Payment Engine & Verifikasi KYC",
                "category": "Fintech Platform",
                "client_name": "PayDigital Corp",
                "year": 2026,
                "cover_image": "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80",
                "gallery": [],
                "short_desc": "Arsitektur pemrosesan transaksi berkapasitas 5.000 TPS dengan verifikasi identitas AI otomatis berstandar keamanan PCI-DSS.",
                "tech_stack": ["Golang", "PostgreSQL", "Redis", "FastAPI"],
                "is_featured": True,
                "is_published": True,
                "order_index": 2,
            },
        ]

        for p in portfolio_data:
            existing = await session.execute(select(Portfolio).where(Portfolio.slug == p["slug"]))
            if not existing.scalar_one_or_none():
                session.add(Portfolio(**p))
                print(f"Added portfolio: {p['title']}")

        # ==================== FAQS ====================
        faqs_data = [
            {
                "question": "Bagaimana tahapan awal konsultasi dan evaluasi sistem bersama Byteshift?",
                "answer": "Tahap awal dimulai dengan Diagnostic Assessment (Audit Kebutuhan). Kami menganalisis arsitektur sistem, bottleneck performa, atau alur kerja operasional Anda saat ini. Dari diagnosa ini, kami menyusun Proposal Solusi & Peta Jalan Teknis (Technical Roadmap) secara transparan sebelum penulisan baris kode pertama.",
                "category": "Konsultasi",
                "order_index": 0,
                "is_active": True,
            },
            {
                "question": "Apakah perusahaan kami memegang 100% hak cipta atas source code yang dibangun?",
                "answer": "Ya, 100% penuh. Seluruh source code, database schema, dokumentasi arsitektur, dan konfigurasi infrastruktur deployment diserahkan kepada perusahaan Anda tanpa ada biaya lisensi berulang atau vendor lock-in tersembunyi.",
                "category": "Legal & Hak Cipta",
                "order_index": 1,
                "is_active": True,
            },
            {
                "question": "Bagaimana jaminan keamanan data rahasia dan perjanjian kerahasiaan (NDA)?",
                "answer": "Kerahasiaan data adalah prioritas tertinggi kami. Sebelum kickoff proyek dimulai, kami menandatangani Non-Disclosure Agreement (NDA) yang mengikat secara hukum. Seluruh proses rekayasa menerapkan standar OWASP Top 10, enkripsi end-to-end, dan pemisahan akses lingkungan produksi yang ketat.",
                "category": "Keamanan & NDA",
                "order_index": 2,
                "is_active": True,
            },
            {
                "question": "Apakah Byteshift menyediakan garansi SLA dan pemeliharaan sistem pasca peluncuran?",
                "answer": "Tentu. Setiap proyek mencakup masa garansi teknis pasca-rilis serta opsi SLA Support 99.9% 24/7. Tim dedicated engineer kami siap memantau performa server, menangani bug kritis secara responsif, dan memastikan sistem berjalan stabil di segala kondisi trafik.",
                "category": "Dukungan & SLA",
                "order_index": 3,
                "is_active": True,
            },
            {
                "question": "Berapa lama rata-rata durasi pengerjaan solusi software atau integrasi sistem?",
                "answer": "Durasi sangat bergantung pada cakupan proyek. Untuk modul integrasi API dan automasi sistem biasanya membutuhkan waktu 4–8 minggu. Untuk sistem informasi skala enterprise atau ERP multi-cabang biasanya berlangsung antara 2–4 bulan dengan pendekatan rilis bertahap (Agile Sprints) sehingga value bisnis dapat dirasakan lebih cepat.",
                "category": "Timeline & Durasi",
                "order_index": 4,
                "is_active": True,
            },
        ]

        for f in faqs_data:
            existing = await session.execute(select(Faq).where(Faq.question == f["question"]))
            if not existing.scalar_one_or_none():
                session.add(Faq(**f))
                print(f"Added FAQ: {f['question'][:40]}...")

        # ==================== TEAM MEMBERS ====================
        team_data = [
            {
                "name": "Faruq Adrean",
                "role": "Managing Director & Principal Architect",
                "bio": "Praktisi arsitektur perangkat lunak skala enterprise dan konsultasi sistem berlatar belakang rekayasa cloud berkinerja tinggi.",
                "photo_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
                "social_links": {"linkedin": "https://linkedin.com", "github": "https://github.com"},
                "order_index": 0,
                "is_active": True,
            },
            {
                "name": "Ir. David Prasetyo, M.T.",
                "role": "Head of Engineering & Infrastructure",
                "bio": "Spesialis cloud architecture, high-availability database cluster, dan sistem IoT industri terdistribusi.",
                "photo_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
                "social_links": {"linkedin": "https://linkedin.com"},
                "order_index": 1,
                "is_active": True,
            },
            {
                "name": "Sarah Oktaviani, S.Kom.",
                "role": "Lead System Analyst & Product Delivery",
                "bio": "Berpengalaman memimpin transformasi digital dan standarisasi proses bisnis pada sektor logistik, perbankan, dan kesehatan.",
                "photo_url": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
                "social_links": {"linkedin": "https://linkedin.com"},
                "order_index": 2,
                "is_active": True,
            },
        ]

        for tm in team_data:
            existing = await session.execute(select(TeamMember).where(TeamMember.name == tm["name"]))
            if not existing.scalar_one_or_none():
                session.add(TeamMember(**tm))
                print(f"Added team member: {tm['name']}")

        # ==================== BLOG POSTS ====================
        blog_data = [
            {
                "slug": "mengatasi-bottleneck-database-pada-arsitektur-high-throughput",
                "title": "Strategi Menghilangkan Bottleneck Database pada Arsitektur High-Throughput",
                "excerpt": "Panduan teknis optimasi connection pool, indexing bertarget, dan pemisahan beban read-write pada sistem bertrafik tinggi.",
                "cover_image": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
                "content": {
                    "type": "doc",
                    "content": [
                        {
                            "type": "paragraph",
                            "content": [
                                {
                                    "type": "text",
                                    "text": "Lonjakan transaksi seringkali membuat database relational kewalahan jika arsitektur connection pool dan strategi indexing tidak dirancang secara presisi. Dalam artikel ini kami membahas pola arsitektur yang terbukti mampu menopang puluhan ribu kueri per detik dengan latensi konsisten di bawah 50ms."
                                }
                            ]
                        }
                    ]
                },
                "author_id": author_id,
                "tags": ["Arsitektur Database", "High Availability", "Performa"],
                "is_published": True,
                "published_at": datetime.now(timezone.utc),
                "meta_title": "Mengatasi Bottleneck Database High-Throughput — Byteshift",
                "meta_description": "Panduan optimasi connection pool dan indexing database pada sistem bertrafik tinggi.",
            },
            {
                "slug": "panduan-integrasi-satu-sehat-dan-standarisasi-hl7-fhir",
                "title": "Panduan Arsitektur Integrasi SatuSehat Kemenkes dengan Standar HL7 FHIR",
                "excerpt": "Langkah terstruktur digitalisasi Rekam Medis Elektronik (RME) yang aman, patuh regulasi, dan interoperable.",
                "cover_image": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
                "content": {
                    "type": "doc",
                    "content": [
                        {
                            "type": "paragraph",
                            "content": [
                                {
                                    "type": "text",
                                    "text": "Kepatuhan terhadap regulasi RME Kementerian Kesehatan mewajibkan institusi fasilitas kesehatan mengadopsi standar HL7 FHIR. Kami membagikan best practices membangun middleware integrasi yang tangguh dan menjaga integritas data pasien."
                                }
                            ]
                        }
                    ]
                },
                "author_id": author_id,
                "tags": ["Healthcare", "HL7 FHIR", "Kemenkes", "SIMRS"],
                "is_published": True,
                "published_at": datetime.now(timezone.utc),
                "meta_title": "Integrasi SatuSehat & Standar HL7 FHIR — Byteshift",
                "meta_description": "Arsitektur integrasi RME fasilitas kesehatan berstandar SatuSehat Kemenkes.",
            },
        ]

        for b in blog_data:
            existing = await session.execute(select(BlogPost).where(BlogPost.slug == b["slug"]))
            if not existing.scalar_one_or_none():
                session.add(BlogPost(**b))
                print(f"Added blog post: {b['title']}")

        await session.commit()
        print("All CMS content seeded successfully!")

if __name__ == "__main__":
    asyncio.run(seed_all())
