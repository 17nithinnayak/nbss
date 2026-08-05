import enum
import uuid
from datetime import datetime, date, timezone

from sqlalchemy import String, Enum, Integer, Text, DateTime, Date, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Role(str, enum.Enum):
    SUPER_ADMIN = "super_admin"
    MEMBER = "member"


def _uuid() -> str:
    return str(uuid.uuid4())


class Member(Base):
    """
    A single member of the NBSS community. Doubles as the login-capable
    user account — the 'directory entry' and the 'account' are the same row
    since every member both appears in the showcase and can log in.
    """

    __tablename__ = "members"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=_uuid)

    # Profile / showcase fields — editable only by super_admin
    full_name: Mapped[str] = mapped_column(String(120), nullable=False)
    title: Mapped[str] = mapped_column(String(120), nullable=False)  # e.g. "National Chairman"
    bio: Mapped[str | None] = mapped_column(Text, nullable=True)
    photo_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    phone: Mapped[str | None] = mapped_column(String(30), nullable=True)
    blood_group: Mapped[str | None] = mapped_column(String(5), nullable=True)  # e.g. "O+", "AB-"
    valid_until: Mapped[date | None] = mapped_column(Date, nullable=True)  # ID card validity date
    display_order: Mapped[int] = mapped_column(Integer, default=100)  # lower = shown first

    # Account fields
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[Role] = mapped_column(Enum(Role), default=Role.MEMBER, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc)
    )


class Event(Base):
    """
    A community event — a title/description/date plus a gallery of photos.
    Only super_admin can create/edit/delete; any logged-in member can view.
    """

    __tablename__ = "events"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=_uuid)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    event_date: Mapped[date] = mapped_column(Date, nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc)
    )

    photos: Mapped[list["EventPhoto"]] = relationship(
        back_populates="event",
        cascade="all, delete-orphan",
        order_by="EventPhoto.display_order",
    )


class EventPhoto(Base):
    """A single photo belonging to an event, with an optional caption."""

    __tablename__ = "event_photos"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=_uuid)
    event_id: Mapped[str] = mapped_column(ForeignKey("events.id"), nullable=False)
    photo_url: Mapped[str] = mapped_column(String(500), nullable=False)
    caption: Mapped[str | None] = mapped_column(String(300), nullable=True)
    display_order: Mapped[int] = mapped_column(Integer, default=100)

    event: Mapped["Event"] = relationship(back_populates="photos")
