from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Time, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from .database import Base


class Barbershop(Base):
    __tablename__ = "barbershops"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    slug = Column(String(50), unique=True, nullable=False, index=True)
    name = Column(String(255), nullable=False)
    tagline = Column(String(255), default="")
    description = Column(Text, default="")
    logo_url = Column(String(500), default="")
    favicon_url = Column(String(500), default="")
    palette = Column(JSON, default=lambda: {"primary": "#c9953c", "secondary": "#0a0a0a", "accent": "#e0b660", "bg": "#0a0a0a", "surface": "#141414"})
    whatsapp = Column(String(50), default="")
    phone = Column(String(50), default="")
    email = Column(String(255), default="")
    address = Column(String(255), default="")
    social = Column(JSON, default=lambda: {"instagram": "", "facebook": "", "tiktok": ""})
    is_active = Column(Boolean, default=True)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    username = Column(String(100), nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    name = Column(String(255), nullable=False)
    role = Column(String(20), default="admin")
    is_active = Column(Boolean, default=True)
    barbershop_id = Column(Integer, ForeignKey("barbershops.id"), nullable=True, index=True)

    barbershop = relationship("Barbershop", lazy="joined")

    __table_args__ = ()


class Service(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, default="")
    price = Column(String(50), nullable=False)
    icon = Column(String(50), default="✂️")
    is_active = Column(Boolean, default=True)
    sort_order = Column(Integer, default=0)
    barbershop_id = Column(Integer, ForeignKey("barbershops.id"), nullable=False, index=True)

    barbershop = relationship("Barbershop", lazy="joined")


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
    barbershop_id = Column(Integer, ForeignKey("barbershops.id"), nullable=False, index=True)

    barbershop = relationship("Barbershop", lazy="joined")


class Schedule(Base):
    __tablename__ = "schedules"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    day_of_week = Column(Integer, nullable=False)
    is_active = Column(Boolean, default=True)
    open_time = Column(String(10), default="09:00")
    close_time = Column(String(10), default="20:00")
    barbershop_id = Column(Integer, ForeignKey("barbershops.id"), nullable=False, index=True)

    barbershop = relationship("Barbershop", lazy="joined")


class Testimonial(Base):
    __tablename__ = "testimonials"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    quote = Column(Text, nullable=False)
    author = Column(String(255), nullable=False)
    role = Column(String(255), default="")
    is_active = Column(Boolean, default=True)
    sort_order = Column(Integer, default=0)
    barbershop_id = Column(Integer, ForeignKey("barbershops.id"), nullable=False, index=True)

    barbershop = relationship("Barbershop", lazy="joined")


class ImageSection(Base):
    __tablename__ = "image_sections"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    slug = Column(String(50), nullable=False, index=True)
    description = Column(String(255), default="")
    sort_order = Column(Integer, default=0)
    barbershop_id = Column(Integer, ForeignKey("barbershops.id"), nullable=False, index=True)

    barbershop = relationship("Barbershop", lazy="joined")

    __table_args__ = ()


class GalleryImage(Base):
    __tablename__ = "gallery_images"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    filename = Column(String(255), nullable=False)
    alt_text = Column(String(255), default="")
    section_id = Column(Integer, ForeignKey("image_sections.id"), nullable=False)
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    sort_order = Column(Integer, default=0)
    barbershop_id = Column(Integer, ForeignKey("barbershops.id"), nullable=False, index=True)

    section = relationship("ImageSection", lazy="joined")
    barbershop = relationship("Barbershop", lazy="joined")


class DayOverride(Base):
    __tablename__ = "day_overrides"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    date = Column(String(20), nullable=False, index=True)
    is_active = Column(Boolean, default=False)
    open_time = Column(String(10), default="")
    close_time = Column(String(10), default="")
    reason = Column(String(255), default="")
    barbershop_id = Column(Integer, ForeignKey("barbershops.id"), nullable=False, index=True)

    barbershop = relationship("Barbershop", lazy="joined")

    __table_args__ = ()


class TimeBlock(Base):
    __tablename__ = "time_blocks"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    date = Column(String(20), nullable=False, index=True)
    start_time = Column(String(10), nullable=False)
    end_time = Column(String(10), nullable=False)
    reason = Column(String(255), default="")
    barbershop_id = Column(Integer, ForeignKey("barbershops.id"), nullable=False, index=True)

    barbershop = relationship("Barbershop", lazy="joined")
