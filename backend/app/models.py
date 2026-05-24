from sqlalchemy import Column, Integer, String, DateTime, func

from app.database import Base


class Lead(Base):
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    whatsapp = Column(String(50), nullable=False)
    business_type = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
