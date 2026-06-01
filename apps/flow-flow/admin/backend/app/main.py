import os
import logging
from pathlib import Path
from contextlib import asynccontextmanager
from dotenv import load_dotenv

env_path = Path(__file__).resolve().parent.parent.parent / ".env"
load_dotenv(env_path)
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.middleware import SlowAPIMiddleware
from .database import engine, SessionLocal, Base
from .models import User, Schedule, ImageSection, Service, Barbershop
from .auth import hash_password
from .middleware import tenant_middleware
from .routes import auth, services, appointments, schedule, gallery, dashboard, testimonials, sections, availability, tenant, admin, users

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s admin_api %(levelname)s %(message)s",
)
logger = logging.getLogger("admin")

limiter = Limiter(key_func=get_remote_address, default_limits=["60/minute"])


def provision_barbershop(db, slug, name, tagline="", admin_pass="admin123"):
    b = Barbershop(slug=slug, name=name, tagline=tagline, description=f"{name} - Barbería profesional")
    db.add(b)
    db.flush()

    for day in range(7):
        active = day < 6
        s = Schedule(day_of_week=day, is_active=active,
                     open_time="09:00" if active else "",
                     close_time="20:00" if active else "",
                     barbershop_id=b.id)
        db.add(s)

    for sec in [{"name": "Galería Principal", "slug": "gallery", "description": "Fotos en Nuestro Trabajo", "sort_order": 0},
                {"name": "Hero", "slug": "hero", "description": "Imagen principal de la landing", "sort_order": 1},
                {"name": "Servicios", "slug": "services", "description": "Fotos de cada tipo de corte", "sort_order": 2}]:
        db.add(ImageSection(**sec, barbershop_id=b.id))

    for svc in [{"name": "Corte Clásico", "description": "Corte con tijera y máquina, acabado perfecto.", "price": "$25.000", "icon": "✂️", "sort_order": 0},
                {"name": "Corte Moderno", "description": "Degradados, texturas y estilos contemporáneos.", "price": "$35.000", "icon": "💈", "sort_order": 1},
                {"name": "Arreglo de Barba", "description": "Perfilado con navaja, toalla caliente y crema.", "price": "$15.000", "icon": "🧔", "sort_order": 2},
                {"name": "Corte + Barba", "description": "Combo completo de corte y arreglo de barba.", "price": "$40.000", "icon": "⭐", "sort_order": 3},
                {"name": "Corte Premium", "description": "Corte + barba + lavado + masaje capilar.", "price": "$55.000", "icon": "👑", "sort_order": 4},
                {"name": "Corte Infantil", "description": "Corte para niños hasta 12 años.", "price": "$18.000", "icon": "🧒", "sort_order": 5}]:
        db.add(Service(**svc, barbershop_id=b.id))

    db.commit()
    logger.info("provisioned barbershop=%s", slug)


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if not db.query(Barbershop).first():
            provision_barbershop(db, "flowflow", "Barbería Flow Flow", "Estilo que habla por sí solo")
        if not db.query(User).filter(User.barbershop_id == None, User.role == "super_admin").first():
            sa = User(username="superadmin", password_hash=hash_password("superadmin123"),
                      name="Super Admin", role="super_admin", barbershop_id=None)
            db.add(sa)
            db.commit()
            logger.info("seed_data created: super_admin")
    finally:
        db.close()
    yield


app = FastAPI(title="Barberia Flow Flow Admin API", lifespan=lifespan)

app.state.limiter = limiter
app.add_exception_handler(429, _rate_limit_exceeded_handler)

env = os.getenv("APP_ENV", "development")
origins = {
    "development": ["http://localhost:3003", "http://localhost:3000", "http://localhost:3002", "http://localhost:5173",
                     "http://192.168.101.81:3003", "http://192.168.101.81:3002",
                     "http://192.168.101.81:3000", "http://192.168.101.81:5173",
                     "http://172.19.0.1:3003", "http://172.19.0.1:3002", "http://172.19.0.1:3000"],
    "production": ["https://admin.flowflow.com", "https://flowflow.com"],
}

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins.get(env, origins["development"]),
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Content-Type", "Authorization", "X-Tenant-Slug"],
)
app.add_middleware(SlowAPIMiddleware)
app.middleware("http")(tenant_middleware)

app.include_router(auth.router)
app.include_router(services.router)
app.include_router(appointments.router)
app.include_router(schedule.router)
app.include_router(gallery.router)
app.include_router(dashboard.router)
app.include_router(testimonials.router)
app.include_router(sections.router)
app.include_router(availability.router)
app.include_router(tenant.router)
app.include_router(admin.router)
app.include_router(users.router)

os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
