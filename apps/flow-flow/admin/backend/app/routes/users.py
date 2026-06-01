import logging
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models import User, Barbershop
from ..schemas import UserCreate, UserUpdate, UserResponse
from ..auth import get_current_user, hash_password, validate_password
from ..deps import get_tenant_id

logger = logging.getLogger("admin")
router = APIRouter(prefix="/api/users", tags=["users"])


@router.get("", response_model=List[UserResponse])
def list_users(
    request: Request,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
    tenant_id: Optional[int] = Depends(get_tenant_id),
):
    if user.role == "super_admin":
        if tenant_id:
            return db.query(User).filter(User.barbershop_id == tenant_id).all()
        return db.query(User).all()
    if tenant_id:
        return db.query(User).filter(User.barbershop_id == tenant_id).all()
    return []


@router.post("", response_model=UserResponse, status_code=201)
def create_user(
    data: UserCreate,
    request: Request,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
    tenant_id: Optional[int] = Depends(get_tenant_id),
):
    if user.role not in ("admin", "super_admin"):
        raise HTTPException(status_code=403, detail="Solo admin puede crear usuarios")

    ok, msg = validate_password(data.password)
    if not ok:
        raise HTTPException(status_code=400, detail=msg)

    existing = db.query(User).filter(User.username == data.username).first()
    if existing:
        raise HTTPException(status_code=409, detail="El usuario ya existe")

    bid = tenant_id
    if user.role == "super_admin" and not bid:
        raise HTTPException(status_code=400, detail="Selecciona una barbería primero (X-Tenant-Slug)")

    new_user = User(
        username=data.username,
        password_hash=hash_password(data.password),
        name=data.name,
        role=data.role or "barber",
        barbershop_id=bid,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    logger.info("user_created username=%s role=%s shop=%s", data.username, data.role, bid)
    return UserResponse(
        id=new_user.id, username=new_user.username, name=new_user.name,
        role=new_user.role, is_active=new_user.is_active,
        barbershop_id=new_user.barbershop_id,
    )


@router.put("/{user_id}", response_model=UserResponse)
def update_user(
    user_id: int,
    data: UserUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
    tenant_id: Optional[int] = Depends(get_tenant_id),
):
    target = db.query(User).filter(User.id == user_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    if user.role != "super_admin" and target.barbershop_id != tenant_id:
        raise HTTPException(status_code=403, detail="No tienes acceso a este usuario")

    if data.name is not None:
        target.name = data.name
    if data.is_active is not None:
        target.is_active = data.is_active
    if data.role is not None and user.role == "super_admin":
        target.role = data.role
    db.commit()
    db.refresh(target)
    return UserResponse(
        id=target.id, username=target.username, name=target.name,
        role=target.role, is_active=target.is_active,
        barbershop_id=target.barbershop_id,
    )
