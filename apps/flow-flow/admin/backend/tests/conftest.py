from pathlib import Path
import sys
sys.path.insert(0, str(Path(__file__).parent.parent))

import os
os.environ["FLOW_DATABASE_URL"] = "sqlite:///./test_barberia.db"

from backend.app.database import engine, Base
from backend.app import models  # noqa

Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

from backend.app.database import SessionLocal
from backend.app.models import Barbershop, User, Service, Schedule, ImageSection
from backend.app.auth import hash_password
from fastapi.testclient import TestClient
import pytest


def seed_test_data():
    db = SessionLocal()
    try:
        if not db.query(Barbershop).first():
            b = Barbershop(slug="flowflow", name="Barbería Flow Flow", tagline="Estilo que habla por sí solo")
            db.add(b)
            db.flush()

            for day in range(7):
                active = day < 6
                db.add(Schedule(day_of_week=day, is_active=active,
                               open_time="09:00" if active else "",
                               close_time="20:00" if active else "",
                               barbershop_id=b.id))

            for sec in [{"name": "Galería Principal", "slug": "gallery", "description": ""},
                        {"name": "Hero", "slug": "hero", "description": ""},
                        {"name": "Servicios", "slug": "services", "description": ""}]:
                db.add(ImageSection(**sec, barbershop_id=b.id))

            db.add(User(username="admin", password_hash=hash_password("admin123"),
                       name="Administrador", role="admin", barbershop_id=b.id))
            db.add(User(username="barber1", password_hash=hash_password("barber123"),
                       name="Carlos Barber", role="barber", barbershop_id=b.id))
            db.commit()
    finally:
        db.close()


seed_test_data()


@pytest.fixture
def client():
    from backend.app.main import app
    with TestClient(app) as c:
        c.headers.update({"X-Tenant-Slug": "flowflow"})
        yield c
