import logging
import time
import os

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from app.database import engine, Base
from app.routes import router

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
)
logger = logging.getLogger("ejeclick")

Base.metadata.create_all(bind=engine)

limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title="EjeClick API",
    description="Backend for EjeClick landing page",
    version="1.0.0",
    docs_url="/api/docs",
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

origins = {
    "development": ["http://localhost:5173", "http://localhost:5174", "http://localhost"],
    "production": ["https://ejeclick.com"],
}
env = os.getenv("APP_ENV", "development")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins.get(env, origins["development"]),
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


@app.middleware("http")
async def log_requests(request: Request, call_next):
    start = time.time()
    response = await call_next(request)
    duration = (time.time() - start) * 1000
    logger.info(
        "%s %s | %d | %.0fms",
        request.method,
        request.url.path,
        response.status_code,
        duration,
    )
    return response


app.include_router(router, prefix="/api/v1")
