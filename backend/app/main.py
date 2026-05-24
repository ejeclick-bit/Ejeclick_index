import logging
import time

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base
from app.routes import router

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
)
logger = logging.getLogger("ejeclick")

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="EjeClick API",
    description="Backend for EjeClick landing page",
    version="1.0.0",
    docs_url="/api/docs",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
