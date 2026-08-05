from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import get_current_member, require_super_admin
from app.models import Member
from app.schemas import MemberOut, MemberCreate, MemberUpdate
from app.security import hash_password

router = APIRouter(prefix="/members", tags=["members"])


@router.get("", response_model=list[MemberOut])
def list_members(
    db: Session = Depends(get_db),
    _current: Member = Depends(get_current_member),  # must be logged in to view directory
):
    """The showcase directory. Any logged-in member (or super admin) can view it."""
    return (
        db.query(Member)
        .filter(Member.is_active.is_(True))
        .order_by(Member.display_order.asc(), Member.full_name.asc())
        .all()
    )


@router.get("/{member_id}", response_model=MemberOut)
def get_member(
    member_id: str,
    db: Session = Depends(get_db),
    _current: Member = Depends(get_current_member),
):
    member = db.get(Member, member_id)
    if not member:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Member not found")
    return member


@router.post("", response_model=MemberOut, status_code=status.HTTP_201_CREATED)
def create_member(
    payload: MemberCreate,
    db: Session = Depends(get_db),
    _admin: Member = Depends(require_super_admin),
):
    existing = db.query(Member).filter(Member.email == payload.email.lower()).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already in use")

    member = Member(
        full_name=payload.full_name,
        title=payload.title,
        email=payload.email.lower(),
        hashed_password=hash_password(payload.password),
        bio=payload.bio,
        photo_url=payload.photo_url,
        phone=payload.phone,
        blood_group=payload.blood_group,
        valid_until=payload.valid_until,
        display_order=payload.display_order,
        role=payload.role,
    )
    db.add(member)
    db.commit()
    db.refresh(member)
    return member


@router.patch("/{member_id}", response_model=MemberOut)
def update_member(
    member_id: str,
    payload: MemberUpdate,
    db: Session = Depends(get_db),
    _admin: Member = Depends(require_super_admin),
):
    member = db.get(Member, member_id)
    if not member:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Member not found")

    updates = payload.model_dump(exclude_unset=True)
    for field, value in updates.items():
        setattr(member, field, value)

    db.commit()
    db.refresh(member)
    return member


@router.delete("/{member_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_member(
    member_id: str,
    db: Session = Depends(get_db),
    admin: Member = Depends(require_super_admin),
):
    if member_id == admin.id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You cannot delete your own account")

    member = db.get(Member, member_id)
    if not member:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Member not found")

    db.delete(member)
    db.commit()
    return None
