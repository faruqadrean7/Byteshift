-- Seed data Byteshift Studio (port dari HTML lama).
-- Jalankan setelah migrasi 0001_init.sql.

-- ---------- site_settings ---------------------------------------------------
insert into public.site_settings (id, site_name, tagline, whatsapp_number, email, address, social_links, hero_stats, meta_default)
values (
  1,
  'Byteshift Studio',
  'Solusi Digital untuk Semua Kebutuhan Anda',
  '6281234567890',
  'halo@byteshiftstudio.com',
  'Jombang, Jawa Timur',
  '{"instagram":"https://instagram.com/byteshiftstudio","linkedin":"https://linkedin.com/company/byteshiftstudio","youtube":"https://youtube.com/@byteshiftstudio"}'::jsonb,
  '[{"num":"50+","label":"Project Selesai"},{"num":"98%","label":"Klien Puas"},{"num":"3th","label":"Pengalaman"}]'::jsonb,
  '{"description":"Byteshift Studio membangun website & aplikasi profesional untuk bisnis, UMKM, pendidikan, dan perorangan."}'::jsonb
)
on conflict (id) do update set
  site_name = excluded.site_name,
  tagline = excluded.tagline,
  whatsapp_number = excluded.whatsapp_number,
  email = excluded.email,
  address = excluded.address,
  social_links = excluded.social_links,
  hero_stats = excluded.hero_stats,
  meta_default = excluded.meta_default;

-- ---------- services --------------------------------------------------------
insert into public.services (slug, icon, title, description, tags, order_index) values
  ('website-profesional','🌐','Website Profesional','Company profile, landing page, blog, hingga website e-commerce yang cepat, responsif, dan SEO-friendly.','{Landing Page,E-Commerce,Company Profile,Blog}',1),
  ('aplikasi-mobile','📱','Aplikasi Mobile','Aplikasi Android & iOS custom untuk kebutuhan bisnis Anda — kasir, absensi, marketplace, dan lainnya.','{Android,iOS,Cross-Platform}',2),
  ('sistem-dashboard','⚙️','Sistem & Dashboard','Sistem manajemen internal, dashboard analitik, CRM, dan aplikasi web berbasis data untuk operasional bisnis.','{CRM,Dashboard,ERP,Admin Panel}',3),
  ('toko-online','🛒','Toko Online','Platform e-commerce lengkap dengan keranjang, payment gateway, manajemen produk & pesanan.','{Payment Gateway,COD,Multi-produk}',4),
  ('platform-edukasi','🎓','Platform Edukasi','LMS, e-learning, portal sekolah/kampus, sistem nilai, dan platform kursus online yang interaktif.','{LMS,E-Learning,Portal Siswa}',5),
  ('maintenance-support','🔧','Maintenance & Support','Update berkala, perbaikan bug, optimasi performa, dan dukungan teknis setelah website/app selesai.','{24/7 Support,Update,Optimasi}',6)
on conflict (slug) do nothing;

-- ---------- packages --------------------------------------------------------
insert into public.packages (name, price_label, period_label, features, is_featured, cta_label, cta_message, order_index) values
  ('Starter','Rp 1,5 Jt','mulai dari',
    '{Website 1–5 halaman,Desain responsif mobile,Domain + hosting 1 tahun,WhatsApp button,Revisi 2x,Support 30 hari}',
    false,'Pilih Starter','Halo Byteshift, saya tertarik paket Starter',1),
  ('Professional','Rp 5 Jt','mulai dari',
    '{Website/App custom penuh,Desain UI/UX premium,CMS / Admin panel,SEO dasar + Google Analytics,Revisi unlimited,Support 3 bulan,Pelatihan penggunaan}',
    true,'Pilih Professional','Halo Byteshift, saya tertarik paket Professional',2),
  ('Enterprise','Custom','sesuai kebutuhan',
    '{Sistem kompleks & skala besar,Integrasi API & third-party,Database & keamanan tinggi,Tim dedicated,SLA & uptime guarantee,Support prioritas 1 tahun,Konsultasi strategi digital}',
    false,'Diskusi Harga','Halo Byteshift, saya ingin diskusi paket Enterprise',3);

-- ---------- testimonials ----------------------------------------------------
insert into public.testimonials (name, role, company, content, rating, order_index) values
  ('Andi Rahmawan','Pemilik Toko Batik','Jombang','Website toko online saya selesai dalam 2 minggu, tampilannya profesional banget. Penjualan naik signifikan setelah pakai website dari Byteshift!',5,1),
  ('Sri Nurwati, S.Pd','Kepala Sekolah SD','Mojokerto','Sistem presensi digital untuk sekolah kami berhasil dibuat dengan sangat baik. Proses diskusi transparan dan hasilnya melebihi ekspektasi.',5,2),
  ('Dika Maulana','Freelance Designer','Surabaya','Portfolio website saya kini jauh lebih menarik. Tim Byteshift sangat responsif dan sabar dalam menjelaskan setiap tahapan pembuatannya.',5,3);

-- ---------- faqs ------------------------------------------------------------
insert into public.faqs (question, answer, category, order_index) values
  ('Berapa lama waktu pengerjaan?','Tergantung kompleksitas: landing page 5–10 hari, website company profile 2–3 minggu, sistem/aplikasi custom 4–8 minggu. Timeline pasti diberikan setelah konsultasi.','timeline',1),
  ('Apakah bisa revisi?','Bisa. Paket Starter dapat 2x revisi, Professional unlimited revisi selama tahap design & development, Enterprise sesuai kontrak.','process',2),
  ('Bagaimana sistem pembayaran?','DP 50% di awal setelah deal, pelunasan 50% saat website/app siap launching. Bisa transfer bank, e-wallet, atau invoice resmi.','payment',3),
  ('Hak cipta milik siapa setelah selesai?','100% milik Anda. Source code, asset, domain, dan hosting akan diserahkan lengkap setelah pelunasan.','legal',4),
  ('Apakah ada garansi?','Ya. Kami berikan garansi bug fix selama 30 hari untuk paket Starter, 3 bulan untuk Professional, dan 1 tahun SLA untuk Enterprise.','warranty',5),
  ('Bisa request fitur custom?','Tentu. Kami diskusi dulu untuk pastikan kebutuhan Anda, lalu kami susun proposal dengan harga sesuai scope.','custom',6),
  ('Apakah hosting & domain termasuk?','Untuk paket Starter sudah termasuk 1 tahun. Paket lain bisa pakai hosting eksisting Anda atau kami bantu setup.','hosting',7),
  ('Bagaimana setelah project selesai?','Kami berikan training penggunaan + dokumentasi. Maintenance bulanan tersedia mulai Rp 300 ribu/bulan.','aftersales',8);

-- ---------- team_members ----------------------------------------------------
insert into public.team_members (name, role, bio, order_index) values
  ('Founder Byteshift','Founder & Lead Engineer','Memimpin pengembangan produk dengan fokus pada kualitas kode dan kebutuhan bisnis klien.',1),
  ('UI/UX Designer','Senior UI/UX Designer','Merancang pengalaman pengguna yang intuitif dan visual yang kuat untuk setiap project.',2),
  ('Project Manager','Project Manager','Memastikan setiap project berjalan tepat waktu, sesuai scope, dan menjaga komunikasi dengan klien.',3);

-- ---------- portfolio (contoh awal — admin bisa edit/tambah) ----------------
insert into public.portfolio (slug, title, category, client_name, year, short_desc, tech_stack, metrics, is_featured, order_index) values
  ('toko-batik-jombang','Toko Batik Online — Jombang','E-Commerce','Andi Rahmawan',2024,
    'Website toko online dengan katalog batik, keranjang belanja, dan integrasi WhatsApp checkout.',
    '{Next.js,Tailwind,Supabase,Midtrans}',
    '{"omzet_increase":"+45%","pesanan_per_bulan":"120+","load_time":"1.2s"}'::jsonb,
    true, 1),
  ('presensi-sekolah-mojokerto','Sistem Presensi Digital Sekolah','Sistem Internal','SD Mojokerto',2024,
    'Aplikasi presensi siswa berbasis QR code dengan dashboard guru dan laporan otomatis.',
    '{Next.js,PostgreSQL,Tailwind}',
    '{"siswa_aktif":"450+","akurasi":"99.8%","time_saved":"2 jam/hari"}'::jsonb,
    true, 2),
  ('portfolio-designer','Portfolio Freelance Designer','Personal Branding','Dika Maulana',2024,
    'Website portfolio personal dengan animasi halus, blog, dan sistem inquiry project.',
    '{Next.js,Framer Motion,MDX}',
    '{"inquiries":"+30/bulan","bounce_rate":"-22%"}'::jsonb,
    false, 3);

-- ---------- blog (contoh awal) ---------------------------------------------
insert into public.blog_posts (slug, title, excerpt, tags, is_published, published_at, meta_title, meta_description) values
  ('cara-memilih-jasa-web-developer','5 Cara Memilih Jasa Web Developer untuk UMKM',
    'Panduan praktis memilih partner pengembangan website yang tepat untuk bisnis kecil-menengah, dari portofolio hingga garansi.',
    '{tips,umkm,website}', true, now(),
    '5 Cara Memilih Jasa Web Developer untuk UMKM',
    'Panduan memilih jasa web developer terbaik untuk UMKM: cek portofolio, garansi, harga, komunikasi, dan after-sales.');
