import re
from pydantic import BaseModel, field_validator
from datetime import datetime
from typing import Optional, Union


class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class ServiceCreate(BaseModel):
    name: str
    description: str = ""
    price: str
    icon: str = "✂️"
    is_active: bool = True
    sort_order: int = 0

    @field_validator("name")
    @classmethod
    def name_not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("El nombre no puede estar vacio")
        return v.strip()

    @field_validator("price")
    @classmethod
    def price_valid(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("El precio no puede estar vacio")
        return v.strip()


class ServiceUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[str] = None
    icon: Optional[str] = None
    is_active: Optional[bool] = None
    sort_order: Optional[int] = None


class ServiceResponse(BaseModel):
    id: int
    name: str
    description: str
    price: str
    icon: str
    is_active: bool
    sort_order: int

    model_config = {"from_attributes": True}


PHONE_RE = re.compile(r"^\+?\d{7,15}$")


class AppointmentCreate(BaseModel):
    client_name: str
    client_phone: str
    client_email: str = ""
    service_id: Optional[int] = None
    service_name: str = ""
    date: str
    time: str
    notes: str = ""

    @field_validator("client_name")
    @classmethod
    def name_not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("El nombre del cliente es obligatorio")
        return v.strip()

    @field_validator("client_phone")
    @classmethod
    def phone_valid(cls, v: str) -> str:
        if not PHONE_RE.match(v.strip()):
            raise ValueError("Telefono invalido. Debe tener 7-15 digitos, opcional + al inicio")
        return v.strip()

    @field_validator("date")
    @classmethod
    def date_not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("La fecha es obligatoria")
        return v.strip()

    @field_validator("time")
    @classmethod
    def time_not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("La hora es obligatoria")
        return v.strip()


class AppointmentUpdate(BaseModel):
    status: Optional[str] = None
    service_id: Optional[int] = None
    notes: Optional[str] = None


class AppointmentResponse(BaseModel):
    id: int
    client_name: str
    client_phone: str
    client_email: str
    service_id: Optional[int]
    service_name: str
    date: str
    time: str
    status: str
    notes: str
    created_at: Optional[Union[str, datetime]] = None

    model_config = {"from_attributes": True}


class ScheduleCreate(BaseModel):
    day_of_week: int
    is_active: bool = True
    open_time: str = "09:00"
    close_time: str = "20:00"


class ScheduleResponse(BaseModel):
    id: int
    day_of_week: int
    is_active: bool
    open_time: str
    close_time: str

    model_config = {"from_attributes": True}


class TestimonialCreate(BaseModel):
    quote: str
    author: str
    role: str = ""
    is_active: bool = True
    sort_order: int = 0


class TestimonialUpdate(BaseModel):
    quote: Optional[str] = None
    author: Optional[str] = None
    role: Optional[str] = None
    is_active: Optional[bool] = None
    sort_order: Optional[int] = None


class TestimonialResponse(BaseModel):
    id: int
    quote: str
    author: str
    role: str
    is_active: bool
    sort_order: int

    model_config = {"from_attributes": True}


class SectionResponse(BaseModel):
    id: int
    name: str
    slug: str
    description: str
    sort_order: int

    model_config = {"from_attributes": True}


class GalleryResponse(BaseModel):
    id: int
    filename: str
    alt_text: str
    section_id: int
    section_slug: str = ""
    section_name: str = ""
    url: str = ""
    uploaded_at: Optional[Union[str, datetime]] = None
    sort_order: int


class CancelAppointmentRequest(BaseModel):
    client_email: str
    client_phone: str


class AppointmentCancelResponse(BaseModel):
    id: int
    status: str
    date: str
    time: str


class AppointmentSearchRequest(BaseModel):
    client_email: str
    client_phone: str


class AppointmentSearchItem(BaseModel):
    id: int
    date: str
    time: str
    service_name: str
    status: str


class BarbershopResponse(BaseModel):
    id: int
    slug: str
    name: str
    tagline: str
    description: str
    logo_url: str
    favicon_url: str
    palette: dict
    whatsapp: str
    phone: str
    email: str
    address: str
    social: dict
    is_active: bool

    model_config = {"from_attributes": True}


class BarbershopCreate(BaseModel):
    slug: str
    name: str
    tagline: str = ""
    description: str = ""
    admin_username: str
    admin_password: str
    admin_name: str


class BarbershopBrandingUpdate(BaseModel):
    name: Optional[str] = None
    tagline: Optional[str] = None
    description: Optional[str] = None
    logo_url: Optional[str] = None
    palette: Optional[dict] = None
    whatsapp: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    social: Optional[dict] = None


class UserCreate(BaseModel):
    username: str
    password: str
    name: str
    role: str = "barber"


class UserUpdate(BaseModel):
    name: Optional[str] = None
    is_active: Optional[bool] = None
    role: Optional[str] = None


class UserResponse(BaseModel):
    id: int
    username: str
    name: str
    role: str
    is_active: bool
    barbershop_id: Optional[int] = None

    model_config = {"from_attributes": True}


class DayOverrideCreate(BaseModel):
    date: str
    is_active: bool = False
    open_time: str = ""
    close_time: str = ""
    reason: str = ""


class DayOverrideResponse(BaseModel):
    id: int
    date: str
    is_active: bool
    open_time: str
    close_time: str
    reason: str

    model_config = {"from_attributes": True}


class TimeBlockCreate(BaseModel):
    date: str
    start_time: str
    end_time: str
    reason: str = ""


class TimeBlockResponse(BaseModel):
    id: int
    date: str
    start_time: str
    end_time: str
    reason: str

    model_config = {"from_attributes": True}


class DashboardResponse(BaseModel):
    today_appointments: int
    total_services: int
    pending_appointments: int
    total_clients: int
    upcoming_appointments: list[AppointmentResponse]
