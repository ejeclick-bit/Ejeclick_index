from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import Service, User
from ..schemas import ServiceCreate, ServiceUpdate, ServiceResponse
from ..auth import get_current_user

router = APIRouter(prefix="/api/services", tags=["services"])


@router.get("", response_model=List[ServiceResponse])
def list_services(include_inactive: bool = False, db: Session = Depends(get_db)):
    query = db.query(Service)
    if not include_inactive:
        query = query.filter(Service.is_active == True)
    return query.order_by(Service.sort_order).all()


@router.post("", response_model=ServiceResponse, status_code=201)
def create_service(
    data: ServiceCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    service = Service(**data.model_dump())
    db.add(service)
    db.commit()
    db.refresh(service)
    return service


@router.put("/{service_id}", response_model=ServiceResponse)
def update_service(
    service_id: int,
    data: ServiceUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Servicio no encontrado")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(service, key, value)
    db.commit()
    db.refresh(service)
    return service


@router.delete("/{service_id}", status_code=204)
def delete_service(
    service_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Servicio no encontrado")
    db.delete(service)
    db.commit()
