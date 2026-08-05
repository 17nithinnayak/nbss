from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Member, Role
from app.security import decode_access_token

# tokenUrl is just for the OpenAPI docs "Authorize" button — actual login is /auth/login
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


def get_current_member(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> Member:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    member_id = decode_access_token(token)
    if member_id is None:
        raise credentials_exception

    member = db.get(Member, member_id)
    if member is None or not member.is_active:
        raise credentials_exception
    return member


def require_super_admin(member: Member = Depends(get_current_member)) -> Member:
    if member.role != Role.SUPER_ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only a super admin can perform this action",
        )
    return member
