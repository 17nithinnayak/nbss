from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Member
from app.schemas import MemberDirectoryOut, MemberPublicOut, PublicMemberProfileOut

# Deliberately separate from the /members router and NOT behind auth —
# this exists so a QR code printed on a physical ID card can be scanned
# and verified by anyone (security, event staff), without them needing
# an account on the site.
router = APIRouter(prefix="/public", tags=["public"])


@router.get("/members/{member_id}", response_model=MemberPublicOut)
def get_public_member(member_id: str, db: Session = Depends(get_db)):
    member = db.get(Member, member_id)
    if not member:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Member not found")
    return member


@router.get("/profiles/{member_id}", response_model=PublicMemberProfileOut)
def get_public_profile(member_id: str, db: Session = Depends(get_db)):
    member = db.get(Member, member_id)
    if not member or not member.is_active:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Member not found")
    return member


@router.get("/members", response_model=list[MemberDirectoryOut])
def list_public_members(db: Session = Depends(get_db)):
    return (
        db.query(Member)
        .filter(Member.is_active.is_(True))
        .order_by(Member.display_order.asc(), Member.full_name.asc())
        .all()
    )
