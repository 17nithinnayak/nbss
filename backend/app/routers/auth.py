from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import get_current_member
from app.models import Member
from app.schemas import LoginRequest, Token, ChangePasswordRequest, MemberMeOut
from app.security import verify_password, create_access_token, hash_password

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=Token)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    member = db.query(Member).filter(Member.email == payload.email.lower()).first()
    if not member or not verify_password(payload.password, member.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
    if not member.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account is deactivated")

    token = create_access_token(subject=member.id)
    return Token(access_token=token)


@router.get("/me", response_model=MemberMeOut)
def read_current_member(current: Member = Depends(get_current_member)):
    return current


@router.post("/change-password")
def change_password(
    payload: ChangePasswordRequest,
    current: Member = Depends(get_current_member),
    db: Session = Depends(get_db),
):
    if not verify_password(payload.current_password, current.hashed_password):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Current password is incorrect")

    current.hashed_password = hash_password(payload.new_password)
    db.commit()
    return {"detail": "Password updated successfully"}
