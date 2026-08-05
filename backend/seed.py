"""
Run once to create the first super admin so someone can actually log in
and start adding other members. Safe to re-run — it skips if the account
already exists.

Usage:
    python seed.py
Reads NBSS_ADMIN_EMAIL / NBSS_ADMIN_PASSWORD / NBSS_ADMIN_NAME from env,
or falls back to sane defaults for local dev.
"""
import os

from app.database import Base, engine, SessionLocal
from app.models import Member, Role
from app.security import hash_password

Base.metadata.create_all(bind=engine)

email = os.getenv("NBSS_ADMIN_EMAIL", "admin@nbss.org").lower()
password = os.getenv("NBSS_ADMIN_PASSWORD", "changeme123")
name = os.getenv("NBSS_ADMIN_NAME", "National Chairman")

db = SessionLocal()
try:
    existing = db.query(Member).filter(Member.email == email).first()
    if existing:
        print(f"Super admin '{email}' already exists — skipping.")
    else:
        admin = Member(
            full_name=name,
            title="National Chairman",
            email=email,
            hashed_password=hash_password(password),
            role=Role.SUPER_ADMIN,
            display_order=0,
        )
        db.add(admin)
        db.commit()
        print(f"Created super admin: {email} / {password}")
        print("Log in and change this password immediately.")
finally:
    db.close()
