import logging
from fastapi import APIRouter, Depends, HTTPException, status, Request
from slowapi import Limiter
from slowapi.util import get_remote_address
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User
from ..schemas import LoginRequest, TokenResponse
from ..auth import hash_password, verify_password, create_access_token, get_current_user

logger = logging.getLogger("admin")
router = APIRouter(prefix="/api/auth", tags=["auth"])
limiter = Limiter(key_func=get_remote_address)


@router.post("/login", response_model=TokenResponse)
@limiter.limit("10/minute")
def login(request: Request, data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == data.username).first()
    if not user or not verify_password(data.password, user.password_hash):
        logger.warning("login_failed username=%s", data.username)
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Credenciales invalidas")
    token = create_access_token(user.id)
    logger.info("login_ok username=%s role=%s", user.username, user.role)
    return TokenResponse(access_token=token)


@router.get("/me")
def me(user: User = Depends(get_current_user)):
    slug = None
    if user.barbershop and user.barbershop.slug:
        slug = user.barbershop.slug
    return {"id": user.id, "username": user.username, "name": user.name, "role": user.role, "barbershop_slug": slug}
