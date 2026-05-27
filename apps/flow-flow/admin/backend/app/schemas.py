from pydantic import BaseModel
from typing import Optional


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


class AppointmentCreate(BaseModel):
    client_name: str
    client_phone: str
    client_email: str = ""
    service_id: Optional[int] = None
    service_name: str = ""
    date: str
    time: str
    notes: str = ""


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
    created_at: Optional[str] = None

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


class GalleryResponse(BaseModel):
    id: int
    filename: str
    alt_text: str
    url: str
    uploaded_at: Optional[str] = None
    sort_order: int

    model_config = {"from_attributes": True}


class DashboardResponse(BaseModel):
    today_appointments: int
    total_services: int
    pending_appointments: int
    total_clients: int
    upcoming_appointments: list[AppointmentResponse]
