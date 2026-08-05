from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, selectinload

from app.database import get_db
from app.deps import get_current_member, require_super_admin
from app.models import Event, EventPhoto, Member
from app.schemas import EventOut, EventCreate, EventUpdate

router = APIRouter(prefix="/events", tags=["events"])


@router.get("", response_model=list[EventOut])
def list_events(
    db: Session = Depends(get_db),
    _current: Member = Depends(get_current_member),
):
    """Most recent events first. Any logged-in member can view."""
    return (
        db.query(Event)
        .options(selectinload(Event.photos))
        .order_by(Event.event_date.desc())
        .all()
    )


@router.get("/{event_id}", response_model=EventOut)
def get_event(
    event_id: str,
    db: Session = Depends(get_db),
    _current: Member = Depends(get_current_member),
):
    event = db.get(Event, event_id)
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")
    return event


@router.post("", response_model=EventOut, status_code=status.HTTP_201_CREATED)
def create_event(
    payload: EventCreate,
    db: Session = Depends(get_db),
    _admin: Member = Depends(require_super_admin),
):
    event = Event(
        title=payload.title,
        description=payload.description,
        event_date=payload.event_date,
    )
    event.photos = [
        EventPhoto(photo_url=p.photo_url, caption=p.caption, display_order=p.display_order)
        for p in payload.photos
    ]
    db.add(event)
    db.commit()
    db.refresh(event)
    return event


@router.patch("/{event_id}", response_model=EventOut)
def update_event(
    event_id: str,
    payload: EventUpdate,
    db: Session = Depends(get_db),
    _admin: Member = Depends(require_super_admin),
):
    event = db.get(Event, event_id)
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")

    updates = payload.model_dump(exclude_unset=True, exclude={"photos"})
    for field, value in updates.items():
        setattr(event, field, value)

    # Replacing photos wholesale keeps the admin form simple: it always
    # submits the full current photo list rather than diffing add/remove.
    if payload.photos is not None:
        event.photos = [
            EventPhoto(photo_url=p.photo_url, caption=p.caption, display_order=p.display_order)
            for p in payload.photos
        ]

    db.commit()
    db.refresh(event)
    return event


@router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_event(
    event_id: str,
    db: Session = Depends(get_db),
    _admin: Member = Depends(require_super_admin),
):
    event = db.get(Event, event_id)
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")

    db.delete(event)
    db.commit()
    return None
