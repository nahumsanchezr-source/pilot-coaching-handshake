import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base
from app.routers import sessions, handshake

@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    # Auto-seed demonstration cases if database is fresh/empty
    try:
        from seed import seed
        seed()
    except Exception as e:
        print(f"Auto-seed check: {e}")
    yield

app = FastAPI(
    title="SkyOps Pilot Coaching API", 
    version="1.0.0",
    lifespan=lifespan
)

# Read CORS origins from environment variable
cors_env = os.getenv("CORS_ORIGINS", "*")
origins = [origin.strip() for origin in cors_env.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if "*" not in origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(sessions.router)
app.include_router(handshake.router)

@app.get("/health", tags=["System"])
def health_check():
    return {"status": "healthy", "service": "SkyOps Coaching Backend"}
