import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .database import engine, SessionLocal, Base
from .models import User, Schedule
from .auth import hash_password
from .routes import auth, services, appointments, schedule, gallery, dashboard

app = FastAPI(title="Barberia Flow Flow Admin API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3003", "http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(services.router)
app.include_router(appointments.router)
app.include_router(schedule.router)
app.include_router(gallery.router)
app.include_router(dashboard.router)

os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if not db.query(User).first():
            admin = User(
                username="admin",
                password_hash=hash_password("admin123"),
                name="Administrador",
                role="admin",
            )
            db.add(admin)

            barber = User(
                username="barber1",
                password_hash=hash_password("barber123"),
                name="Carlos Barber",
                role="barber",
            )
            db.add(barber)

            for day in range(7):
                existing = db.query(Schedule).filter(Schedule.day_of_week == day).first()
                if not existing:
                    active = day < 6
                    s = Schedule(
                        day_of_week=day,
                        is_active=active,
                        open_time="09:00" if active else "",
                        close_time="20:00" if active else "",
                    )
                    db.add(s)
            db.commit()
    finally:
        db.close()
