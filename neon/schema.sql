-- ============================================================================
-- Byteshift Studio — Neon DB PostgreSQL Schema
-- Run order: Copy & paste into Neon SQL Editor, or run `npm run db:init`
-- ============================================================================

-- ---------- 1. helpers & triggers -------------------------------------------
CREATE OR REPLACE FUNCTION touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- ---------- 2. profiles (Admin Users) ---------------------------------------
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'editor', 'viewer')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_profiles_updated ON profiles;
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

-- ---------- 3. services -----------------------------------------------------
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  icon TEXT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  order_index INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_services_updated ON services;
CREATE TRIGGER trg_services_updated BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

-- ---------- 3b. sectors -----------------------------------------------------
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

DROP TRIGGER IF EXISTS trg_sectors_updated ON sectors;
CREATE TRIGGER trg_sectors_updated BEFORE UPDATE ON sectors
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

-- ---------- 4. portfolio ----------------------------------------------------
CREATE TABLE IF NOT EXISTS portfolio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  client_name TEXT,
  year INT,
  cover_image TEXT,
  gallery TEXT[] NOT NULL DEFAULT '{}',
  short_desc TEXT,
  full_content JSONB,
  tech_stack TEXT[] NOT NULL DEFAULT '{}',
  demo_url TEXT,
  project_url TEXT,
  metrics JSONB,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_published BOOLEAN NOT NULL DEFAULT true,
  order_index INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_portfolio_updated ON portfolio;
CREATE TRIGGER trg_portfolio_updated BEFORE UPDATE ON portfolio
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

CREATE INDEX IF NOT EXISTS idx_portfolio_published ON portfolio (is_published, order_index);

-- ---------- 5. testimonials -------------------------------------------------
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT,
  company TEXT,
  content TEXT NOT NULL,
  rating INT NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  avatar_url TEXT,
  project_id UUID REFERENCES portfolio(id) ON DELETE SET NULL,
  is_published BOOLEAN NOT NULL DEFAULT true,
  order_index INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------- 6. faqs ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  order_index INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------- 7. packages -----------------------------------------------------
CREATE TABLE IF NOT EXISTS packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price_label TEXT NOT NULL,
  period_label TEXT,
  features TEXT[] NOT NULL DEFAULT '{}',
  is_featured BOOLEAN NOT NULL DEFAULT false,
  cta_label TEXT DEFAULT 'Pilih Paket',
  cta_message TEXT,
  order_index INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------- 8. team_members -------------------------------------------------
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT,
  photo_url TEXT,
  social_links JSONB DEFAULT '{}'::jsonb,
  order_index INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------- 9. blog_posts ---------------------------------------------------
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  cover_image TEXT,
  content JSONB,
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  is_published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_blog_updated ON blog_posts;
CREATE TRIGGER trg_blog_updated BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

CREATE INDEX IF NOT EXISTS idx_blog_published ON blog_posts (is_published, published_at DESC);

-- ---------- 10. leads -------------------------------------------------------
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone_wa TEXT,
  project_type TEXT,
  budget_range TEXT,
  message TEXT,
  source TEXT DEFAULT 'website',
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'converted', 'dropped')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_leads_updated ON leads;
CREATE TRIGGER trg_leads_updated BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

CREATE INDEX IF NOT EXISTS idx_leads_status ON leads (status, created_at DESC);

-- ---------- 11. site_settings (singleton row id=1) --------------------------
CREATE TABLE IF NOT EXISTS site_settings (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  site_name TEXT NOT NULL DEFAULT 'Byteshift Consulting',
  tagline TEXT,
  logo_url TEXT,
  whatsapp_number TEXT,
  email TEXT,
  address TEXT,
  social_links JSONB DEFAULT '{}'::jsonb,
  hero_stats JSONB DEFAULT '[]'::jsonb,
  meta_default JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_settings_updated ON site_settings;
CREATE TRIGGER trg_settings_updated BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

-- ---------- Default Initial Data -------------------------------------------
INSERT INTO site_settings (
  id,
  site_name,
  tagline,
  whatsapp_number,
  email,
  address,
  hero_stats
) VALUES (
  1,
  'Byteshift Consulting',
  'Mitra Rekayasa Teknologi & Konsultasi Strategis untuk Pertumbuhan Bisnis yang Berkelanjutan',
  '6282210810793',
  'contact@byteshift.id',
  'Jakarta, Indonesia',
  '[
    {"num": "99.9%", "label": "Garansi Stabilitas Sistem", "desc": "Meniadakan risiko downtime & kerugian operasional"},
    {"num": "50+", "label": "Masalah Operasional Tuntas", "desc": "Mengubah alur manual & lambat jadi otomatis serta efisien"},
    {"num": "100%", "label": "Kepatuhan SLA & NDA", "desc": "Jaminan tepat waktu & perlindungan penuh data rahasia"},
    {"num": "24/7", "label": "Dukungan Reaksi Cepat", "desc": "Dedicated engineer siaga menjaga kelancaran sistem"}
  ]'::jsonb
) ON CONFLICT (id) DO NOTHING;
