from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import Base, engine
from app.routers import auth, members, events

# Simple create-all is fine at this scale (no migrations needed for ~100 rows,
# fixed schema). If the schema needs to evolve later, introduce Alembic.
Base.metadata.create_all(bind=engine)

app = FastAPI(title="NBSS Community API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(members.router)
app.include_router(events.router)


@app.get("/health")
def health_check():
    return {"status": "ok"}
