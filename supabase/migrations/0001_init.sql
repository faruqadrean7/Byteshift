-- ============================================================================
-- Byteshift Studio — Initial schema
-- Run order: paste ke Supabase SQL editor lalu jalankan, atau supabase db push.
-- ============================================================================

create extension if not exists "uuid-ossp";

-- ---------- helpers --------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- ---------- 1. profiles (admin users) --------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text,
  avatar_url text,
  role text not null default 'admin' check (role in ('admin','editor','viewer')),
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', new.email));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin','editor')
  );
$$;

-- ---------- 2. services -----------------------------------------------------
create table if not exists public.services (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  icon text,
  title text not null,
  description text not null,
  tags text[] not null default '{}',
  order_index int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_services_updated before update on public.services
  for each row execute function public.touch_updated_at();

-- ---------- 3. portfolio ----------------------------------------------------
create table if not exists public.portfolio (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  title text not null,
  category text not null,
  client_name text,
  year int,
  cover_image text,
  gallery text[] not null default '{}',
  short_desc text,
  full_content jsonb,
  tech_stack text[] not null default '{}',
  demo_url text,
  project_url text,
  metrics jsonb,
  is_featured boolean not null default false,
  is_published boolean not null default true,
  order_index int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_portfolio_updated before update on public.portfolio
  for each row execute function public.touch_updated_at();
create index if not exists idx_portfolio_published on public.portfolio (is_published, order_index);

-- ---------- 4. testimonials -------------------------------------------------
create table if not exists public.testimonials (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  role text,
  company text,
  content text not null,
  rating int not null default 5 check (rating between 1 and 5),
  avatar_url text,
  project_id uuid references public.portfolio(id) on delete set null,
  is_published boolean not null default true,
  order_index int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------- 5. faqs ---------------------------------------------------------
create table if not exists public.faqs (
  id uuid primary key default uuid_generate_v4(),
  question text not null,
  answer text not null,
  category text default 'general',
  order_index int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------- 6. packages -----------------------------------------------------
create table if not exists public.packages (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  price_label text not null,
  period_label text,
  features text[] not null default '{}',
  is_featured boolean not null default false,
  cta_label text default 'Pilih Paket',
  cta_message text,
  order_index int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------- 7. team_members ------------------------------------------------
create table if not exists public.team_members (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  role text not null,
  bio text,
  photo_url text,
  social_links jsonb default '{}'::jsonb,
  order_index int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------- 8. blog_posts ---------------------------------------------------
create table if not exists public.blog_posts (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  title text not null,
  excerpt text,
  cover_image text,
  content jsonb,
  author_id uuid references public.profiles(id) on delete set null,
  tags text[] not null default '{}',
  is_published boolean not null default false,
  published_at timestamptz,
  meta_title text,
  meta_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_blog_updated before update on public.blog_posts
  for each row execute function public.touch_updated_at();
create index if not exists idx_blog_published on public.blog_posts (is_published, published_at desc);

-- ---------- 9. leads --------------------------------------------------------
create table if not exists public.leads (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text,
  phone_wa text,
  project_type text,
  budget_range text,
  message text,
  source text default 'website',
  status text not null default 'new' check (status in ('new','contacted','converted','dropped')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_leads_updated before update on public.leads
  for each row execute function public.touch_updated_at();
create index if not exists idx_leads_status on public.leads (status, created_at desc);

-- ---------- 10. site_settings (singleton row id=1) -------------------------
create table if not exists public.site_settings (
  id int primary key default 1 check (id = 1),
  site_name text not null default 'Byteshift Studio',
  tagline text,
  logo_url text,
  whatsapp_number text,
  email text,
  address text,
  social_links jsonb default '{}'::jsonb,
  hero_stats jsonb default '[]'::jsonb,
  meta_default jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_settings_updated before update on public.site_settings
  for each row execute function public.touch_updated_at();

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

alter table public.profiles      enable row level security;
alter table public.services      enable row level security;
alter table public.portfolio     enable row level security;
alter table public.testimonials  enable row level security;
alter table public.faqs          enable row level security;
alter table public.packages      enable row level security;
alter table public.team_members  enable row level security;
alter table public.blog_posts    enable row level security;
alter table public.leads         enable row level security;
alter table public.site_settings enable row level security;

-- profiles: pemilik bisa lihat dirinya sendiri; admin lihat semua
drop policy if exists "profiles_select_self" on public.profiles;
create policy "profiles_select_self" on public.profiles
  for select using (auth.uid() = id or public.is_admin());

drop policy if exists "profiles_update_self" on public.profiles;
create policy "profiles_update_self" on public.profiles
  for update using (auth.uid() = id);

-- services: public read aktif, admin write
drop policy if exists "services_public_read" on public.services;
create policy "services_public_read" on public.services
  for select using (is_active = true);
drop policy if exists "services_admin_all" on public.services;
create policy "services_admin_all" on public.services
  for all using (public.is_admin()) with check (public.is_admin());

-- portfolio: public read published, admin write
drop policy if exists "portfolio_public_read" on public.portfolio;
create policy "portfolio_public_read" on public.portfolio
  for select using (is_published = true);
drop policy if exists "portfolio_admin_all" on public.portfolio;
create policy "portfolio_admin_all" on public.portfolio
  for all using (public.is_admin()) with check (public.is_admin());

-- testimonials
drop policy if exists "testimonials_public_read" on public.testimonials;
create policy "testimonials_public_read" on public.testimonials
  for select using (is_published = true);
drop policy if exists "testimonials_admin_all" on public.testimonials;
create policy "testimonials_admin_all" on public.testimonials
  for all using (public.is_admin()) with check (public.is_admin());

-- faqs
drop policy if exists "faqs_public_read" on public.faqs;
create policy "faqs_public_read" on public.faqs
  for select using (is_active = true);
drop policy if exists "faqs_admin_all" on public.faqs;
create policy "faqs_admin_all" on public.faqs
  for all using (public.is_admin()) with check (public.is_admin());

-- packages
drop policy if exists "packages_public_read" on public.packages;
create policy "packages_public_read" on public.packages
  for select using (is_active = true);
drop policy if exists "packages_admin_all" on public.packages;
create policy "packages_admin_all" on public.packages
  for all using (public.is_admin()) with check (public.is_admin());

-- team_members
drop policy if exists "team_public_read" on public.team_members;
create policy "team_public_read" on public.team_members
  for select using (is_active = true);
drop policy if exists "team_admin_all" on public.team_members;
create policy "team_admin_all" on public.team_members
  for all using (public.is_admin()) with check (public.is_admin());

-- blog_posts: public read published, admin write
drop policy if exists "blog_public_read" on public.blog_posts;
create policy "blog_public_read" on public.blog_posts
  for select using (is_published = true);
drop policy if exists "blog_admin_all" on public.blog_posts;
create policy "blog_admin_all" on public.blog_posts
  for all using (public.is_admin()) with check (public.is_admin());

-- leads: anon insert ok (form publik), select/update admin only
drop policy if exists "leads_anon_insert" on public.leads;
create policy "leads_anon_insert" on public.leads
  for insert with check (true);
drop policy if exists "leads_admin_read" on public.leads;
create policy "leads_admin_read" on public.leads
  for select using (public.is_admin());
drop policy if exists "leads_admin_modify" on public.leads;
create policy "leads_admin_modify" on public.leads
  for update using (public.is_admin()) with check (public.is_admin());
drop policy if exists "leads_admin_delete" on public.leads;
create policy "leads_admin_delete" on public.leads
  for delete using (public.is_admin());

-- site_settings: public read, admin write
drop policy if exists "settings_public_read" on public.site_settings;
create policy "settings_public_read" on public.site_settings
  for select using (true);
drop policy if exists "settings_admin_all" on public.site_settings;
create policy "settings_admin_all" on public.site_settings
  for all using (public.is_admin()) with check (public.is_admin());

-- ============================================================================
-- STORAGE BUCKETS (run via Supabase dashboard atau supabase CLI)
-- bucket: 'media' (public read, admin write) untuk gambar portfolio/blog/team
-- ============================================================================

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "media_public_read" on storage.objects;
create policy "media_public_read" on storage.objects
  for select using (bucket_id = 'media');

drop policy if exists "media_admin_write" on storage.objects;
create policy "media_admin_write" on storage.objects
  for insert with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "media_admin_update" on storage.objects;
create policy "media_admin_update" on storage.objects
  for update using (bucket_id = 'media' and public.is_admin())
  with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "media_admin_delete" on storage.objects;
create policy "media_admin_delete" on storage.objects
  for delete using (bucket_id = 'media' and public.is_admin());
