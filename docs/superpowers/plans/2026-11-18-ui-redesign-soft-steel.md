# UI Redesign "Soft Steel" Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the public site to the calmer, more professional "Soft Steel" dark palette with elegant light interludes, without changing layout, content, or the navy+blue identity.

**Architecture:** Centralize all new colors as tokens in `app/globals.css` (`:root`) and `tailwind.config.ts`, then sweep the 21 public components + 7 public pages to replace ad-hoc colors (`#4C9AED`, `blue-500`, `sky-300/400`, `bg-white`, assorted navy hexes) with those tokens. Apply the agreed card spec and smooth section transitions. Admin/CMS is untouched.

**Tech Stack:** Next.js (App Router), Tailwind CSS, TypeScript.

**Spec:** `docs/superpowers/specs/2026-11-18-ui-redesign-soft-steel-design.md`

## Global Constraints

- Identity stays **navy + blue**; do not change the primary hue family.
- **Do not modify** existing `:root` HSL tokens (`--background`, `--card`, `--primary`, …) or `brand.*` Tailwind values — admin depends on them and must stay visually unchanged.
- Light interlude background is **off-white blue (`#EEF1F6`)**, never pure white; dark↔light boundaries use a **gradient seam block**, never a hard edge.
- Accent used sparingly (pills, buttons, icons, dots, one featured card). No glow/neon.
- No layout/content/copy changes, no font changes, no functional/data/auth changes.
- `npm run typecheck` and `npm run build` must stay green after every task.

## Token Reference (from spec — exact values)

Dark: `base #0E1420` · `surface #151D2D` · `surface2 #1A2436` · `raise #212D42` · `accent #6A8DB5` · `accent2 #84A6CC` · `soft #B0C0D3` · `text #ECEFF4` · `muted #95A3B7` · `faint #6B7A90`. Hairlines: `border-white/[0.08]` (default), `border-white/20` (strong).
Light interlude: `light #EEF1F6` · `lightcard #FFFFFF` · `ink #1F2A3D` · `inkmuted #5A6A80` · `accentink #3C6193`. Light hairline: `border-slate-900/[0.08]`.

## Review Focus

- **Mobile widths (<640px):** every swept section must keep 16px side gutter and no horizontal scroll; most likely to break where fixed paddings/hex gradients were hand-tuned. → covered in Task 8 visual checklist.
- **Text contrast on light interlude:** `inkmuted` on `light` must stay readable (WCAG AA for body) — verify in Task 5.
- **Featured/highlighted card legibility:** the gradient featured card text must remain readable on its lighter gradient — verify in Task 4.
- **Reduced-motion / hover on touch:** card hover lift must not trap state on touch devices — rely on CSS `:hover` only (no JS hover state); verify in Task 4.
- **Sticky nav over both dark and light sections:** translucent nav must stay legible when a light interlude scrolls under it — verify in Task 2.

---

### Task 1: Token foundation + shared SectionHeader

**Files:**
- Modify: `tailwind.config.ts` (add `steel` color group under `theme.extend.colors`)
- Modify: `app/globals.css` (add seam utilities; keep existing `:root`/utilities intact)
- Modify: `components/public/SectionHeader.tsx`

**Interfaces:**
- Produces: Tailwind classes `bg-steel-base`, `bg-steel-surface`, `bg-steel-surface2`, `bg-steel-raise`, `text-steel-text`, `text-steel-muted`, `text-steel-faint`, `text-steel-soft`, `bg-steel-accent`, `text-steel-accent`, `bg-steel-light`, `bg-steel-lightcard`, `text-steel-ink`, `text-steel-inkmuted`, `text-steel-accentink`, etc. CSS utilities: `.seam`, `.seam-to-light`, `.seam-to-dark`.
- `SectionHeader` keeps its current props (`tag`, `title`, `subtitle`, `align`, `invert`); `invert` now means "on dark" (steel tokens) vs default "on light interlude" (ink tokens).

- [ ] **Step 1:** Add the `steel` color group to `tailwind.config.ts` with the exact hex values from the Token Reference. Do not touch `brand.*`, the hsl-var colors, fonts, or animations.

- [ ] **Step 2:** In `app/globals.css`, add under `@layer utilities` (do not change existing rules):
  - `.seam { height:1px; background:linear-gradient(90deg,transparent,rgba(148,163,184,.2),transparent); }`
  - `.seam-to-light { height:80px; background:linear-gradient(to bottom,#0E1420,#EEF1F6); }`
  - `.seam-to-dark { height:80px; background:linear-gradient(to bottom,#EEF1F6,#0E1420); }`

- [ ] **Step 3:** Rewrite `SectionHeader.tsx` colors to steel tokens: dark/`invert` → `text-steel-text` title, `text-steel-muted` subtitle, pill `border-steel-accent/25 bg-steel-accent/10 text-steel-soft` with `bg-steel-accent` dot; light → `text-steel-ink` title, `text-steel-inkmuted` subtitle, pill `border-steel-accentink/20 bg-steel-accentink/[0.08] text-steel-accentink`. Keep markup/props identical.

- [ ] **Step 4: Verify** — Run `npm run typecheck` (Expected: clean) and `npm run build` (Expected: success). Visually confirm a page using SectionHeader renders with new pill/title colors.

- [ ] **Step 5: Commit** — `git add tailwind.config.ts app/globals.css components/public/SectionHeader.tsx && git commit -m "feat(ui): add Soft Steel tokens and restyle SectionHeader"`

---

### Task 2: Site chrome — Nav, Footer, FloatingWhatsApp

**Files:** Modify `components/public/Nav.tsx`, `components/public/Footer.tsx`, `components/public/FloatingWhatsApp.tsx`

- [ ] **Step 1:** Sweep each file: replace hardcoded hex (`#0B1324`, `#4C9AED`, navy variants), `blue-500`, `sky-*`, and `bg-white` with steel tokens. Nav translucent bg → `bg-steel-base/80 backdrop-blur border-b border-white/[0.08]`; links `text-steel-muted hover:text-steel-text`; CTA `bg-steel-accent text-[#0a0f18] hover:bg-steel-accent2`.
- [ ] **Step 2:** Footer → `bg-steel-base text-steel-muted`, headings `text-steel-text`, links hover `text-steel-accent2`, hairline dividers `border-white/[0.08]`.
- [ ] **Step 3:** FloatingWhatsApp → keep its brand-green (functional signal), only adjust any clashing navy/blue frame to steel tokens; leave the WhatsApp green as-is.
- [ ] **Step 4: Verify** — `npm run build` succeeds; sticky nav stays legible scrolling over a light section (Review Focus); no horizontal scroll on mobile.
- [ ] **Step 5: Commit** — `git commit -am "feat(ui): restyle nav, footer, floating whatsapp to Soft Steel"`

---

### Task 3: Hero zone — Hero, HeroMetrics, ClientsStrip

**Files:** Modify `components/public/Hero.tsx`, `components/public/HeroMetrics.tsx`, `components/public/ClientsStrip.tsx`

- [ ] **Step 1:** Hero → `bg-steel-base`; soft radial accent `radial-gradient(60% 70% at 80% -10%, rgba(106,141,181,.14), transparent 60%)`; grid overlay opacity lowered to `rgba(148,163,184,.04)`; headline `text-steel-text`, lead `text-steel-muted`; primary CTA `bg-steel-accent`, ghost CTA `border-white/20 text-steel-text`. Remove any `glow-border`/bright-blue blob in favor of the calm radial.
- [ ] **Step 2:** HeroMetrics → stat numbers `text-steel-text`, labels `text-steel-faint`, top divider `border-white/[0.08]`.
- [ ] **Step 3:** ClientsStrip → neutral marquee on `bg-steel-surface`; logos/text `text-steel-muted`; remove saturated blue borders.
- [ ] **Step 4: Verify** — `npm run build` succeeds; hero accent reads calm (no neon); mobile gutter intact.
- [ ] **Step 5: Commit** — `git commit -am "feat(ui): restyle hero, metrics, clients strip to Soft Steel"`

---

### Task 4: Services & Packages cards — ServicesGrid, Packages, Process, Sectors

**Files:** Modify `components/public/ServicesGrid.tsx`, `components/public/Packages.tsx`, `components/public/Process.tsx`, `components/public/Sectors.tsx`

- [ ] **Step 1:** Define the shared card recipe (apply inline per component, no new file): base `rounded-2xl bg-steel-surface2 border border-white/[0.08] p-6 transition-all`; hover `hover:-translate-y-1 hover:border-steel-accent/40 hover:bg-steel-raise` (CSS `:hover` only, no JS state — Review Focus); icon tile `rounded-xl bg-steel-accent/15`; chips `bg-white/[0.06] text-steel-soft border border-white/[0.08]`. Replace ServicesGrid's current `bg-white`/`brand-off`/full-gradient-flip hover with this.
- [ ] **Step 2:** ServicesGrid section bg → `bg-steel-surface`; remove `bg-white`.
- [ ] **Step 3:** Packages → section `bg-steel-base`; cards use the recipe; the one `isHighlighted` card → featured style `bg-gradient-to-br from-[#263448] to-steel-surface2 border border-steel-accent/40 shadow-[0_18px_50px_-20px_rgba(106,141,181,.4)]`, badge `bg-steel-accent/22 text-[#cdd9e8]`; verify featured text stays readable (Review Focus).
- [ ] **Step 4:** Process & Sectors → same token sweep; step numbers/icons use `text-steel-accent2`; connectors `border-white/[0.08]`.
- [ ] **Step 5: Verify** — `npm run build` succeeds; featured card legible; cards lift smoothly, no full color flip; mobile grid stacks cleanly.
- [ ] **Step 6: Commit** — `git commit -am "feat(ui): restyle services, packages, process, sectors cards"`

---

### Task 5: Light interlude — PortfolioSection, PortfolioGrid, PortfolioSlider, ProjectGallery

**Files:** Modify `components/public/PortfolioSection.tsx`, `components/public/PortfolioGrid.tsx`, `components/public/PortfolioSlider.tsx`, `components/public/ProjectGallery.tsx`

**Interfaces:**
- Produces: the homepage "Portofolio Pilihan" block rendered as the **light interlude**. The page (Task 7) wraps it between `.seam-to-light` and `.seam-to-dark` blocks.

- [ ] **Step 1:** PortfolioSection → `bg-steel-light text-steel-ink`; SectionHeader used WITHOUT `invert` (light variant). Portfolio cards → `bg-steel-lightcard border border-slate-900/[0.08] rounded-2xl shadow-[0_10px_30px_-18px_rgba(31,42,61,.25)] hover:-translate-y-1 hover:shadow-[0_20px_44px_-20px_rgba(31,42,61,.3)]`; titles `text-steel-ink`, body `text-steel-inkmuted`, chips `bg-[#e4e9f1] text-[#4a5d78]`.
- [ ] **Step 2:** PortfolioGrid / PortfolioSlider / ProjectGallery → same light-card treatment; nav arrows/dots use `text-steel-accentink`; replace any dark-only assumptions so they read on `light`.
- [ ] **Step 3: Verify** — `npm run build` succeeds; check `inkmuted (#5A6A80)` on `light (#EEF1F6)` meets WCAG AA for body text (Review Focus); images not clipped on mobile.
- [ ] **Step 4: Commit** — `git commit -am "feat(ui): portfolio as elegant light interlude"`

---

### Task 6: Remaining sections — About, CTA, Testimonials, FaqAccordion, LeadForm

**Files:** Modify `components/public/About.tsx`, `components/public/CTA.tsx`, `components/public/Testimonials.tsx`, `components/public/FaqAccordion.tsx`, `components/public/LeadForm.tsx`

- [ ] **Step 1:** About & Testimonials → dark steel tokens (quote text `text-steel-text`, attribution `text-steel-muted`); if a second light interlude fits the rhythm, builder may place Testimonials on `light` per spec rule (no two light sections adjacent).
- [ ] **Step 2:** CTA → `bg-steel-surface` panel with `bg-steel-accent` primary button; remove bright-blue gradient.
- [ ] **Step 3:** FaqAccordion → items `border-white/[0.08]`, open state `bg-steel-surface2`, chevron `text-steel-accent2`.
- [ ] **Step 4:** LeadForm → inputs `bg-steel-surface2 border-white/[0.08] text-steel-text placeholder:text-steel-faint focus:border-steel-accent focus:ring-steel-accent/30`; submit `bg-steel-accent`; error `text-rose-300` (keep semantic red, desaturated).
- [ ] **Step 5: Verify** — `npm run build` succeeds; form inputs legible and focusable; no neon focus ring.
- [ ] **Step 6: Commit** — `git commit -am "feat(ui): restyle about, cta, testimonials, faq, lead form"`

---

### Task 7: Page composition + section seams — the 7 public pages

**Files:** Modify `app/(public)/page.tsx`, `app/(public)/portfolio/page.tsx`, `app/(public)/portfolio/[slug]/page.tsx`, `app/(public)/tentang/page.tsx`, `app/(public)/kontak/page.tsx`, `app/(public)/blog/page.tsx`, `app/(public)/blog/[slug]/page.tsx`

- [ ] **Step 1:** On the homepage, order sections dark→light→dark and insert `<div className="seam-to-light"/>` before the Portfolio interlude and `<div className="seam-to-dark"/>` after it; insert `<div className="seam"/>` between adjacent dark sections. Ensure no two light interludes are adjacent.
- [ ] **Step 2:** Sweep each page file for inline hardcoded colors (`#0B1324`, `#4C9AED`, `bg-white`, `blue-*`, `sky-*`) and replace with steel tokens; set page root bg `bg-steel-base`.
- [ ] **Step 3:** Blog & portfolio detail pages: content/prose on dark uses `text-steel-muted`; the `prose-tiptap` rule in `globals.css` already targets slate-300 — leave if acceptable, otherwise point it to steel tokens.
- [ ] **Step 4: Verify** — `npm run build` succeeds; walk each page in the browser; seams are smooth, no white↔navy jump.
- [ ] **Step 5: Commit** — `git commit -am "feat(ui): compose pages with smooth section seams"`

---

### Task 8: Final sweep, verification & visual QA

**Files:** none new — cleanup only.

- [ ] **Step 1:** Grep for leftover old colors in public scope and fix any stragglers:
  Run: `grep -rnE "#4C9AED|#3E85D8|bg-white\b|(text|bg|border|from|to|via)-(sky)-[0-9]{2,3}" "components/public" "app/(public)"`
  Expected: no meaningful matches (document any intentional exception).
- [ ] **Step 2:** Run `npm run typecheck` (clean) and `npm run build` (success).
- [ ] **Step 3:** Visual QA checklist across homepage, /portfolio, /tentang, /kontak, /blog at mobile (375px) and desktop: (a) 16px gutter, no horizontal scroll; (b) no neon/glowing accents; (c) light interlude text passes AA; (d) card hover lifts smoothly; (e) sticky nav legible over light section.
- [ ] **Step 4:** Confirm admin pages unchanged — spot-check `/admin` login + dashboard render identical to before.
- [ ] **Step 5: Commit** — `git commit -am "chore(ui): final Soft Steel cleanup and QA"` (if any fixes made).

---

## Notes on verification method

This project has **no test framework** and the change is purely presentational, so tasks verify via `npm run typecheck` + `npm run build` + targeted `grep` for leftover colors + direct visual review, rather than unit tests. The Review Focus items are pinned to visual checks in their owning tasks.
