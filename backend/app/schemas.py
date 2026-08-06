from datetime import date, datetime

from pydantic import BaseModel, EmailStr, ConfigDict

from app.models import Role


# ---------- Auth ----------

class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str


# ---------- Member: public / read ----------

class MemberOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    full_name: str
    title: str
    bio: str | None
    photo_url: str | None
    phone: str | None
    blood_group: str | None
    valid_until: date | None
    display_order: int
    role: Role
    is_active: bool


class MemberMeOut(MemberOut):
    email: str
    created_at: datetime


# ---------- Member: write (super_admin only) ----------

class MemberCreate(BaseModel):
    full_name: str
    title: str
    email: EmailStr
    password: str
    bio: str | None = None
    photo_url: str | None = None
    phone: str | None = None
    blood_group: str | None = None
    valid_until: date | None = None
    display_order: int = 100
    role: Role = Role.MEMBER


class MemberUpdate(BaseModel):
    """All fields optional — partial update (PATCH semantics)."""
    full_name: str | None = None
    title: str | None = None
    bio: str | None = None
    photo_url: str | None = None
    phone: str | None = None
    blood_group: str | None = None
    valid_until: date | None = None
    display_order: int | None = None
    role: Role | None = None
    is_active: bool | None = None


# ---------- Events ----------

class EventPhotoIn(BaseModel):
    photo_url: str
    caption: str | None = None
    display_order: int = 100


class EventPhotoOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    photo_url: str
    caption: str | None
    display_order: int


class EventOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    description: str | None
    event_date: date
    created_at: datetime
    photos: list[EventPhotoOut] = []


class EventCreate(BaseModel):
    title: str
    description: str | None = None
    event_date: date
    photos: list[EventPhotoIn] = []


class EventUpdate(BaseModel):
    """All fields optional. If `photos` is provided, it REPLACES the entire
    photo set for this event (simplest mental model for a small admin form)."""
    title: str | None = None
    description: str | None = None
    event_date: date | None = None
    photos: list[EventPhotoIn] | None = None


# ---------- Public verification (no auth — scanned from a printed ID card) ----------

class MemberPublicOut(BaseModel):
    """Deliberately minimal: no email, no phone. Anyone with the QR code
    (i.e. anyone who can see the physical ID card) can view this, so it
    only contains what's already printed on the card anyway."""
    model_config = ConfigDict(from_attributes=True)

    full_name: str
    title: str
    photo_url: str | None
    blood_group: str | None
    valid_until: date | None
    is_active: bool
