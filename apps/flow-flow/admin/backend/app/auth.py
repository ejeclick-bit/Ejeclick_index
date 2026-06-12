import os
import re
from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
import bcrypt as _bcrypt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from sqlalchemy import text
from .database import get_db
from .models import User

SECRET_KEY = os.getenv("FLOW_JWT_SECRET", "dev-secret-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE = 24

security = HTTPBearer()


def hash_password(password: str) -> str:
    return _bcrypt.hashpw(password.encode(), _bcrypt.gensalt()).decode()


def verify_password(plain: str, hashed: str) -> bool:
    return _bcrypt.checkpw(plain.encode(), hashed.encode())


def create_access_token(user_id: int) -> str:
    expire = datetime.now(timezone.utc) + timedelta(hours=ACCESS_TOKEN_EXPIRE)
    return jwt.encode({"sub": str(user_id), "exp": expire}, SECRET_KEY, algorithm=ALGORITHM)


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
) -> User:
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = int(payload.get("sub"))
    except (JWTError, ValueError):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token invalido")

    user = db.query(User).filter(User.id == user_id).first()
    if not user or not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Usuario inactivo")
        
    if user.role == "super_admin":
        db.info["is_super_admin"] = "1"
        db.info["tenant_id"] = "-1"
        if db.bind.name != "sqlite":
            db.execute(text("SET LOCAL app.is_super_admin = '1'"))
    else:
        db.info["is_super_admin"] = "0"
        db.info["tenant_id"] = str(user.barbershop_id)
        if db.bind.name != "sqlite":
            db.execute(text(f"SET LOCAL app.current_tenant = '{user.barbershop_id}'"))
            db.execute(text("SET LOCAL app.is_super_admin = '0'"))
        
    return user


FORBIDDEN_PASSWORDS = {"12345678", "password", "admin123", "contraseña", "abc12345", "qwerty123", "123456789", "barberia123"}


def validate_password(password: str) -> tuple[bool, str]:
    errors = []
    if len(password) < 8:
        errors.append("Mínimo 8 caracteres")
    if not re.search(r"[A-Z]", password):
        errors.append("Debe contener al menos una mayúscula")
    if not re.search(r"[a-z]", password):
        errors.append("Debe contener al menos una minúscula")
    if not re.search(r"\d", password):
        errors.append("Debe contener al menos un número")
    if password.lower() in FORBIDDEN_PASSWORDS:
        errors.append("Contraseña muy común o insegura")
    return (len(errors) == 0, "; ".join(errors))
