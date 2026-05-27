from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Time, Text, ForeignKey
from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    username = Column(String(100), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    name = Column(String(255), nullable=False)
    role = Column(String(20), default="admin")
    is_active = Column(Boolean, default=True)


class Service(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, default="")
    price = Column(String(50), nullable=False)
    icon = Column(String(50), default="✂️")
    is_active = Column(Boolean, default=True)
    sort_order = Column(Integer, default=0)


class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    client_name = Column(String(255), nullable=False)
    client_phone = Column(String(50), nullable=False)
    client_email = Column(String(255), default="")
    service_id = Column(Integer, ForeignKey("services.id"), nullable=True)
    service_name = Column(String(255), default="")
    date = Column(String(20), nullable=False)
    time = Column(String(10), nullable=False)
    status = Column(String(20), default="pending")
    notes = Column(Text, default="")
    created_at = Column(DateTime, default=datetime.utcnow)


class Schedule(Base):
    __tablename__ = "schedules"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    day_of_week = Column(Integer, nullable=False)
    is_active = Column(Boolean, default=True)
    open_time = Column(String(10), default="09:00")
    close_time = Column(String(10), default="20:00")


class GalleryImage(Base):
    __tablename__ = "gallery_images"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    filename = Column(String(255), nullable=False)
    alt_text = Column(String(255), default="")
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    sort_order = Column(Integer, default=0)
