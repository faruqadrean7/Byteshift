from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from backend.app.db.session import get_db
from backend.app.models.entities import (
    Service,
    Sector,
    Portfolio,
    Testimonial,
    Faq,
    Package,
    TeamMember,
    BlogPost,
    Lead,
    SiteSetting,
)
from backend.app.schemas.schemas import (
    ServiceOut,
    SectorOut,
    PortfolioOut,
    TestimonialOut,
    FaqOut,
    PackageOut,
    TeamMemberOut,
    BlogPostOut,
    LeadCreate,
    LeadOut,
    SiteSettingOut,
)

router = APIRouter()

# ----------------- Site Settings -----------------
@router.get("/settings", response_model=Optional[SiteSettingOut])
async def get_settings(db: AsyncSession = Depends(get_db)):
    stmt = select(SiteSetting).where(SiteSetting.id == 1)
    result = await db.execute(stmt)
    return result.scalar_one_or_none()

# ----------------- Services -----------------
@router.get("/services", response_model=List[ServiceOut])
async def get_services(db: AsyncSession = Depends(get_db)):
    stmt = select(Service).where(Service.is_active.is_(True)).order_by(Service.order_index.asc())
    result = await db.execute(stmt)
    return result.scalars().all()

# ----------------- Sectors -----------------
@router.get("/sectors", response_model=List[SectorOut])
async def get_sectors(db: AsyncSession = Depends(get_db)):
    stmt = select(Sector).where(Sector.is_active.is_(True)).order_by(Sector.order_index.asc())
    result = await db.execute(stmt)
    return result.scalars().all()

# ----------------- Portfolio -----------------
@router.get("/portfolio", response_model=List[PortfolioOut])
async def get_portfolio(
    featured_only: bool = False,
    limit: Optional[int] = Query(None, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(Portfolio).where(Portfolio.is_published.is_(True))
    if featured_only:
        stmt = stmt.where(Portfolio.is_featured.is_(True))
    stmt = stmt.order_by(Portfolio.is_featured.desc(), Portfolio.order_index.asc())
    if limit:
        stmt = stmt.limit(limit)
    result = await db.execute(stmt)
    return result.scalars().all()

@router.get("/portfolio/{slug}", response_model=PortfolioOut)
async def get_portfolio_detail(slug: str, db: AsyncSession = Depends(get_db)):
    stmt = select(Portfolio).where(Portfolio.slug == slug, Portfolio.is_published.is_(True))
    result = await db.execute(stmt)
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Portfolio tidak ditemukan")
    return item

# ----------------- Testimonials -----------------
@router.get("/testimonials", response_model=List[TestimonialOut])
async def get_testimonials(
    limit: Optional[int] = Query(6, ge=1, le=50),
    db: AsyncSession = Depends(get_db),
):
    stmt = (
        select(Testimonial)
        .where(Testimonial.is_published.is_(True))
        .order_by(Testimonial.order_index.asc())
    )
    if limit:
        stmt = stmt.limit(limit)
    result = await db.execute(stmt)
    return result.scalars().all()

# ----------------- FAQ -----------------
@router.get("/faqs", response_model=List[FaqOut])
async def get_faqs(db: AsyncSession = Depends(get_db)):
    stmt = select(Faq).where(Faq.is_active.is_(True)).order_by(Faq.order_index.asc())
    result = await db.execute(stmt)
    return result.scalars().all()

# ----------------- Packages -----------------
@router.get("/packages", response_model=List[PackageOut])
async def get_packages(db: AsyncSession = Depends(get_db)):
    stmt = select(Package).where(Package.is_active.is_(True)).order_by(Package.order_index.asc())
    result = await db.execute(stmt)
    return result.scalars().all()

# ----------------- Team Members -----------------
@router.get("/team", response_model=List[TeamMemberOut])
async def get_team(db: AsyncSession = Depends(get_db)):
    stmt = select(TeamMember).where(TeamMember.is_active.is_(True)).order_by(TeamMember.order_index.asc())
    result = await db.execute(stmt)
    return result.scalars().all()

# ----------------- Blog -----------------
@router.get("/blog", response_model=List[BlogPostOut])
async def get_blog_posts(
    limit: Optional[int] = Query(None, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    stmt = (
        select(BlogPost)
        .where(BlogPost.is_published.is_(True))
        .order_by(desc(BlogPost.published_at))
    )
    if limit:
        stmt = stmt.limit(limit)
    result = await db.execute(stmt)
    return result.scalars().all()

@router.get("/blog/{slug}", response_model=BlogPostOut)
async def get_blog_detail(slug: str, db: AsyncSession = Depends(get_db)):
    stmt = select(BlogPost).where(BlogPost.slug == slug, BlogPost.is_published.is_(True))
    result = await db.execute(stmt)
    post = result.scalar_one_or_none()
    if not post:
        raise HTTPException(status_code=404, detail="Artikel tidak ditemukan")
    return post

# ----------------- Inquiries / Leads (Public Submit) -----------------
@router.post("/leads", response_model=LeadOut)
async def submit_lead(lead_in: LeadCreate, db: AsyncSession = Depends(get_db)):
    new_lead = Lead(
        name=lead_in.name,
        email=lead_in.email,
        phone_wa=lead_in.phone_wa,
        project_type=lead_in.project_type,
        budget_range=lead_in.budget_range,
        message=lead_in.message,
        source=lead_in.source or "website",
        status="new",
    )
    db.add(new_lead)
    await db.commit()
    await db.refresh(new_lead)
    return new_lead
