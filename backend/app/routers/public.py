from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Member
from app.schemas import MemberPublicOut

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
