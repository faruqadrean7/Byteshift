from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from backend.app.db.session import get_db
from backend.app.core.security import require_admin_user
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
    ServiceCreate,
    ServiceUpdate,
    ServiceOut,
    SectorCreate,
    SectorUpdate,
    SectorOut,
    PortfolioCreate,
    PortfolioUpdate,
    PortfolioOut,
    TestimonialCreate,
    TestimonialUpdate,
    TestimonialOut,
    FaqCreate,
    FaqUpdate,
    FaqOut,
    PackageCreate,
    PackageUpdate,
    PackageOut,
    TeamMemberCreate,
    TeamMemberUpdate,
    TeamMemberOut,
    BlogPostCreate,
    BlogPostUpdate,
    BlogPostOut,
    LeadUpdate,
    LeadOut,
    SiteSettingUpdate,
    SiteSettingOut,
)

router = APIRouter(dependencies=[Depends(require_admin_user)])

# ==================== SERVICES ====================
@router.get("/services", response_model=List[ServiceOut])
async def admin_get_services(db: AsyncSession = Depends(get_db)):
    stmt = select(Service).order_by(Service.order_index.asc())
    result = await db.execute(stmt)
    return result.scalars().all()

@router.post("/services", response_model=ServiceOut)
async def admin_create_service(service_in: ServiceCreate, db: AsyncSession = Depends(get_db)):
    service = Service(**service_in.model_dump())
    db.add(service)
    await db.commit()
    await db.refresh(service)
    return service

@router.put("/services/{service_id}", response_model=ServiceOut)
async def admin_update_service(service_id: UUID, service_in: ServiceUpdate, db: AsyncSession = Depends(get_db)):
    stmt = select(Service).where(Service.id == service_id)
    result = await db.execute(stmt)
    service = result.scalar_one_or_none()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    
    for key, value in service_in.model_dump(exclude_unset=True).items():
        setattr(service, key, value)
    
    await db.commit()
    await db.refresh(service)
    return service

@router.delete("/services/{service_id}")
async def admin_delete_service(service_id: UUID, db: AsyncSession = Depends(get_db)):
    stmt = select(Service).where(Service.id == service_id)
    result = await db.execute(stmt)
    service = result.scalar_one_or_none()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    await db.delete(service)
    await db.commit()
    return {"ok": True, "message": "Service deleted"}

# ==================== SECTORS ====================
@router.get("/sectors", response_model=List[SectorOut])
async def admin_get_sectors(db: AsyncSession = Depends(get_db)):
    stmt = select(Sector).order_by(Sector.order_index.asc())
    result = await db.execute(stmt)
    return result.scalars().all()

@router.post("/sectors", response_model=SectorOut)
async def admin_create_sector(sector_in: SectorCreate, db: AsyncSession = Depends(get_db)):
    sector = Sector(**sector_in.model_dump())
    db.add(sector)
    await db.commit()
    await db.refresh(sector)
    return sector

@router.put("/sectors/{sector_id}", response_model=SectorOut)
async def admin_update_sector(sector_id: UUID, sector_in: SectorUpdate, db: AsyncSession = Depends(get_db)):
    stmt = select(Sector).where(Sector.id == sector_id)
    result = await db.execute(stmt)
    sector = result.scalar_one_or_none()
    if not sector:
        raise HTTPException(status_code=404, detail="Sector not found")
    
    for key, value in sector_in.model_dump(exclude_unset=True).items():
        setattr(sector, key, value)
    
    await db.commit()
    await db.refresh(sector)
    return sector

@router.delete("/sectors/{sector_id}")
async def admin_delete_sector(sector_id: UUID, db: AsyncSession = Depends(get_db)):
    stmt = select(Sector).where(Sector.id == sector_id)
    result = await db.execute(stmt)
    sector = result.scalar_one_or_none()
    if not sector:
        raise HTTPException(status_code=404, detail="Sector not found")
    await db.delete(sector)
    await db.commit()
    return {"ok": True, "message": "Sector deleted"}

# ==================== PORTFOLIO ====================
@router.get("/portfolio", response_model=List[PortfolioOut])
async def admin_get_portfolio(db: AsyncSession = Depends(get_db)):
    stmt = select(Portfolio).order_by(Portfolio.order_index.asc())
    result = await db.execute(stmt)
    return result.scalars().all()

@router.post("/portfolio", response_model=PortfolioOut)
async def admin_create_portfolio(port_in: PortfolioCreate, db: AsyncSession = Depends(get_db)):
    item = Portfolio(**port_in.model_dump())
    db.add(item)
    await db.commit()
    await db.refresh(item)
    return item

@router.put("/portfolio/{port_id}", response_model=PortfolioOut)
async def admin_update_portfolio(port_id: UUID, port_in: PortfolioUpdate, db: AsyncSession = Depends(get_db)):
    stmt = select(Portfolio).where(Portfolio.id == port_id)
    result = await db.execute(stmt)
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    
    for key, value in port_in.model_dump(exclude_unset=True).items():
        setattr(item, key, value)
    
    await db.commit()
    await db.refresh(item)
    return item

@router.delete("/portfolio/{port_id}")
async def admin_delete_portfolio(port_id: UUID, db: AsyncSession = Depends(get_db)):
    stmt = select(Portfolio).where(Portfolio.id == port_id)
    result = await db.execute(stmt)
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    await db.delete(item)
    await db.commit()
    return {"ok": True, "message": "Portfolio deleted"}

# ==================== BLOG POSTS ====================
@router.get("/blog", response_model=List[BlogPostOut])
async def admin_get_blog(db: AsyncSession = Depends(get_db)):
    stmt = select(BlogPost).order_by(desc(BlogPost.created_at))
    result = await db.execute(stmt)
    return result.scalars().all()

@router.post("/blog", response_model=BlogPostOut)
async def admin_create_blog(blog_in: BlogPostCreate, db: AsyncSession = Depends(get_db)):
    post = BlogPost(**blog_in.model_dump())
    db.add(post)
    await db.commit()
    await db.refresh(post)
    return post

@router.put("/blog/{blog_id}", response_model=BlogPostOut)
async def admin_update_blog(blog_id: UUID, blog_in: BlogPostUpdate, db: AsyncSession = Depends(get_db)):
    stmt = select(BlogPost).where(BlogPost.id == blog_id)
    result = await db.execute(stmt)
    post = result.scalar_one_or_none()
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    
    for key, value in blog_in.model_dump(exclude_unset=True).items():
        setattr(post, key, value)
    
    await db.commit()
    await db.refresh(post)
    return post

@router.delete("/blog/{blog_id}")
async def admin_delete_blog(blog_id: UUID, db: AsyncSession = Depends(get_db)):
    stmt = select(BlogPost).where(BlogPost.id == blog_id)
    result = await db.execute(stmt)
    post = result.scalar_one_or_none()
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    await db.delete(post)
    await db.commit()
    return {"ok": True, "message": "Blog post deleted"}

# ==================== LEADS (CRM) ====================
@router.get("/leads", response_model=List[LeadOut])
async def admin_get_leads(
    status_filter: Optional[str] = Query(None, alias="status"),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Lead)
    if status_filter:
        stmt = stmt.where(Lead.status == status_filter)
    stmt = stmt.order_by(desc(Lead.created_at))
    result = await db.execute(stmt)
    return result.scalars().all()

@router.patch("/leads/{lead_id}", response_model=LeadOut)
async def admin_update_lead(lead_id: UUID, lead_in: LeadUpdate, db: AsyncSession = Depends(get_db)):
    stmt = select(Lead).where(Lead.id == lead_id)
    result = await db.execute(stmt)
    lead = result.scalar_one_or_none()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    for key, value in lead_in.model_dump(exclude_unset=True).items():
        setattr(lead, key, value)
    
    await db.commit()
    await db.refresh(lead)
    return lead

@router.delete("/leads/{lead_id}")
async def admin_delete_lead(lead_id: UUID, db: AsyncSession = Depends(get_db)):
    stmt = select(Lead).where(Lead.id == lead_id)
    result = await db.execute(stmt)
    lead = result.scalar_one_or_none()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    await db.delete(lead)
    await db.commit()
    return {"ok": True, "message": "Lead deleted"}

# ==================== TESTIMONIALS ====================
@router.get("/testimonials", response_model=List[TestimonialOut])
async def admin_get_testimonials(db: AsyncSession = Depends(get_db)):
    stmt = select(Testimonial).order_by(Testimonial.order_index.asc())
    result = await db.execute(stmt)
    return result.scalars().all()

@router.post("/testimonials", response_model=TestimonialOut)
async def admin_create_testimonial(item_in: TestimonialCreate, db: AsyncSession = Depends(get_db)):
    item = Testimonial(**item_in.model_dump())
    db.add(item)
    await db.commit()
    await db.refresh(item)
    return item

@router.put("/testimonials/{item_id}", response_model=TestimonialOut)
async def admin_update_testimonial(item_id: UUID, item_in: TestimonialUpdate, db: AsyncSession = Depends(get_db)):
    stmt = select(Testimonial).where(Testimonial.id == item_id)
    result = await db.execute(stmt)
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    for key, value in item_in.model_dump(exclude_unset=True).items():
        setattr(item, key, value)
    await db.commit()
    await db.refresh(item)
    return item

@router.delete("/testimonials/{item_id}")
async def admin_delete_testimonial(item_id: UUID, db: AsyncSession = Depends(get_db)):
    stmt = select(Testimonial).where(Testimonial.id == item_id)
    result = await db.execute(stmt)
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    await db.delete(item)
    await db.commit()
    return {"ok": True, "message": "Testimonial deleted"}

# ==================== FAQS ====================
@router.get("/faqs", response_model=List[FaqOut])
async def admin_get_faqs(db: AsyncSession = Depends(get_db)):
    stmt = select(Faq).order_by(Faq.order_index.asc())
    result = await db.execute(stmt)
    return result.scalars().all()

@router.post("/faqs", response_model=FaqOut)
async def admin_create_faq(item_in: FaqCreate, db: AsyncSession = Depends(get_db)):
    item = Faq(**item_in.model_dump())
    db.add(item)
    await db.commit()
    await db.refresh(item)
    return item

@router.put("/faqs/{item_id}", response_model=FaqOut)
async def admin_update_faq(item_id: UUID, item_in: FaqUpdate, db: AsyncSession = Depends(get_db)):
    stmt = select(Faq).where(Faq.id == item_id)
    result = await db.execute(stmt)
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="FAQ not found")
    for key, value in item_in.model_dump(exclude_unset=True).items():
        setattr(item, key, value)
    await db.commit()
    await db.refresh(item)
    return item

@router.delete("/faqs/{item_id}")
async def admin_delete_faq(item_id: UUID, db: AsyncSession = Depends(get_db)):
    stmt = select(Faq).where(Faq.id == item_id)
    result = await db.execute(stmt)
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="FAQ not found")
    await db.delete(item)
    await db.commit()
    return {"ok": True, "message": "FAQ deleted"}

# ==================== TEAM MEMBERS ====================
@router.get("/team", response_model=List[TeamMemberOut])
async def admin_get_team(db: AsyncSession = Depends(get_db)):
    stmt = select(TeamMember).order_by(TeamMember.order_index.asc())
    result = await db.execute(stmt)
    return result.scalars().all()

@router.post("/team", response_model=TeamMemberOut)
async def admin_create_team(item_in: TeamMemberCreate, db: AsyncSession = Depends(get_db)):
    item = TeamMember(**item_in.model_dump())
    db.add(item)
    await db.commit()
    await db.refresh(item)
    return item

@router.put("/team/{item_id}", response_model=TeamMemberOut)
async def admin_update_team(item_id: UUID, item_in: TeamMemberUpdate, db: AsyncSession = Depends(get_db)):
    stmt = select(TeamMember).where(TeamMember.id == item_id)
    result = await db.execute(stmt)
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Team member not found")
    for key, value in item_in.model_dump(exclude_unset=True).items():
        setattr(item, key, value)
    await db.commit()
    await db.refresh(item)
    return item

@router.delete("/team/{item_id}")
async def admin_delete_team(item_id: UUID, db: AsyncSession = Depends(get_db)):
    stmt = select(TeamMember).where(TeamMember.id == item_id)
    result = await db.execute(stmt)
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Team member not found")
    await db.delete(item)
    await db.commit()
    return {"ok": True, "message": "Team member deleted"}

# ==================== SITE SETTINGS ====================
@router.put("/settings", response_model=SiteSettingOut)
async def admin_update_settings(settings_in: SiteSettingUpdate, db: AsyncSession = Depends(get_db)):
    stmt = select(SiteSetting).where(SiteSetting.id == 1)
    result = await db.execute(stmt)
    setting = result.scalar_one_or_none()
    if not setting:
        setting = SiteSetting(id=1)
        db.add(setting)
    
    for key, value in settings_in.model_dump(exclude_unset=True).items():
        setattr(setting, key, value)
    
    await db.commit()
    await db.refresh(setting)
    return setting
