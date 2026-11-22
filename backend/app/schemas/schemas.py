from datetime import datetime
from typing import Optional, List, Any, Dict
from uuid import UUID
from pydantic import BaseModel, EmailStr, Field

# ----------------- Auth -----------------
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]

class UserOut(BaseModel):
    id: UUID
    email: str
    full_name: Optional[str] = None
    role: str
    avatar_url: Optional[str] = None

# ----------------- Service -----------------
class ServiceBase(BaseModel):
    slug: str
    icon: Optional[str] = None
    title: str
    description: str
    tags: List[str] = []
    order_index: int = 0
    is_active: bool = True

class ServiceCreate(ServiceBase):
    pass

class ServiceUpdate(BaseModel):
    slug: Optional[str] = None
    icon: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    tags: Optional[List[str]] = None
    order_index: Optional[int] = None
    is_active: Optional[bool] = None

class ServiceOut(ServiceBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# ----------------- Sector -----------------
class SectorBase(BaseModel):
    slug: str
    name: str
    category_tag: str
    filter_group: str = "finance"
    image: str
    executive_summary: str
    key_benefits: List[str] = []
    impact_metric: str
    href: str = "/kontak"
    order_index: int = 0
    is_active: bool = True

class SectorCreate(SectorBase):
    pass

class SectorUpdate(BaseModel):
    slug: Optional[str] = None
    name: Optional[str] = None
    category_tag: Optional[str] = None
    filter_group: Optional[str] = None
    image: Optional[str] = None
    executive_summary: Optional[str] = None
    key_benefits: Optional[List[str]] = None
    impact_metric: Optional[str] = None
    href: Optional[str] = None
    order_index: Optional[int] = None
    is_active: Optional[bool] = None

class SectorOut(SectorBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# ----------------- Portfolio -----------------
class PortfolioBase(BaseModel):
    slug: str
    title: str
    category: str
    client_name: Optional[str] = None
    year: Optional[int] = None
    cover_image: Optional[str] = None
    gallery: List[str] = []
    short_desc: Optional[str] = None
    full_content: Optional[Any] = None
    tech_stack: List[str] = []
    demo_url: Optional[str] = None
    project_url: Optional[str] = None
    metrics: Optional[Any] = None
    is_featured: bool = False
    is_published: bool = True
    order_index: int = 0

class PortfolioCreate(PortfolioBase):
    pass

class PortfolioUpdate(BaseModel):
    slug: Optional[str] = None
    title: Optional[str] = None
    category: Optional[str] = None
    client_name: Optional[str] = None
    year: Optional[int] = None
    cover_image: Optional[str] = None
    gallery: Optional[List[str]] = None
    short_desc: Optional[str] = None
    full_content: Optional[Any] = None
    tech_stack: Optional[List[str]] = None
    demo_url: Optional[str] = None
    project_url: Optional[str] = None
    metrics: Optional[Any] = None
    is_featured: Optional[bool] = None
    is_published: Optional[bool] = None
    order_index: Optional[int] = None

class PortfolioOut(PortfolioBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# ----------------- Testimonial -----------------
class TestimonialBase(BaseModel):
    name: str
    role: Optional[str] = None
    company: Optional[str] = None
    content: str
    rating: int = 5
    avatar_url: Optional[str] = None
    project_id: Optional[UUID] = None
    is_published: bool = True
    order_index: int = 0

class TestimonialCreate(TestimonialBase):
    pass

class TestimonialUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    company: Optional[str] = None
    content: Optional[str] = None
    rating: Optional[int] = None
    avatar_url: Optional[str] = None
    project_id: Optional[UUID] = None
    is_published: Optional[bool] = None
    order_index: Optional[int] = None

class TestimonialOut(TestimonialBase):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

# ----------------- FAQ -----------------
class FaqBase(BaseModel):
    question: str
    answer: str
    category: Optional[str] = "general"
    order_index: int = 0
    is_active: bool = True

class FaqCreate(FaqBase):
    pass

class FaqUpdate(BaseModel):
    question: Optional[str] = None
    answer: Optional[str] = None
    category: Optional[str] = None
    order_index: Optional[int] = None
    is_active: Optional[bool] = None

class FaqOut(FaqBase):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

# ----------------- Package -----------------
class PackageBase(BaseModel):
    name: str
    price_label: str
    period_label: Optional[str] = None
    features: List[str] = []
    is_featured: bool = False
    cta_label: Optional[str] = "Pilih Paket"
    cta_message: Optional[str] = None
    order_index: int = 0
    is_active: bool = True

class PackageCreate(PackageBase):
    pass

class PackageUpdate(BaseModel):
    name: Optional[str] = None
    price_label: Optional[str] = None
    period_label: Optional[str] = None
    features: Optional[List[str]] = None
    is_featured: Optional[bool] = None
    cta_label: Optional[str] = None
    cta_message: Optional[str] = None
    order_index: Optional[int] = None
    is_active: Optional[bool] = None

class PackageOut(PackageBase):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

# ----------------- Team Member -----------------
class TeamMemberBase(BaseModel):
    name: str
    role: str
    bio: Optional[str] = None
    photo_url: Optional[str] = None
    social_links: Optional[Dict[str, Any]] = None
    order_index: int = 0
    is_active: bool = True

class TeamMemberCreate(TeamMemberBase):
    pass

class TeamMemberUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    bio: Optional[str] = None
    photo_url: Optional[str] = None
    social_links: Optional[Dict[str, Any]] = None
    order_index: Optional[int] = None
    is_active: Optional[bool] = None

class TeamMemberOut(TeamMemberBase):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

# ----------------- Blog Post -----------------
class BlogPostBase(BaseModel):
    slug: str
    title: str
    excerpt: Optional[str] = None
    cover_image: Optional[str] = None
    content: Optional[Any] = None
    author_id: Optional[UUID] = None
    tags: List[str] = []
    is_published: bool = False
    published_at: Optional[datetime] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None

class BlogPostCreate(BlogPostBase):
    pass

class BlogPostUpdate(BaseModel):
    slug: Optional[str] = None
    title: Optional[str] = None
    excerpt: Optional[str] = None
    cover_image: Optional[str] = None
    content: Optional[Any] = None
    author_id: Optional[UUID] = None
    tags: Optional[List[str]] = None
    is_published: Optional[bool] = None
    published_at: Optional[datetime] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None

class BlogPostOut(BlogPostBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# ----------------- Lead -----------------
class LeadCreate(BaseModel):
    name: str
    email: Optional[str] = None
    phone_wa: Optional[str] = None
    project_type: Optional[str] = None
    budget_range: Optional[str] = None
    message: Optional[str] = None
    source: Optional[str] = "website"

class LeadUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None

class LeadOut(BaseModel):
    id: UUID
    name: str
    email: Optional[str] = None
    phone_wa: Optional[str] = None
    project_type: Optional[str] = None
    budget_range: Optional[str] = None
    message: Optional[str] = None
    source: Optional[str] = None
    status: str
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# ----------------- Site Settings -----------------
class SiteSettingUpdate(BaseModel):
    site_name: Optional[str] = None
    tagline: Optional[str] = None
    logo_url: Optional[str] = None
    whatsapp_number: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    social_links: Optional[Dict[str, Any]] = None
    hero_stats: Optional[List[Dict[str, Any]]] = None
    meta_default: Optional[Dict[str, Any]] = None

class SiteSettingOut(BaseModel):
    id: int
    site_name: str
    tagline: Optional[str] = None
    logo_url: Optional[str] = None
    whatsapp_number: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    social_links: Optional[Dict[str, Any]] = None
    hero_stats: Optional[List[Dict[str, Any]]] = None
    meta_default: Optional[Dict[str, Any]] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
