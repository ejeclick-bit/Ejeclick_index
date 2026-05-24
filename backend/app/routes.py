import logging

from fastapi import APIRouter, Depends, Request, HTTPException, status
from sqlalchemy.orm import Session
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.database import get_db
from app.models import Lead
from app.schemas import LeadCreate, LeadResponse

limiter = Limiter(key_func=get_remote_address)

logger = logging.getLogger("ejeclick")

router = APIRouter()


@router.post("/leads", response_model=LeadResponse, status_code=status.HTTP_201_CREATED)
@limiter.limit("10/minute")
def create_lead(request: Request, lead_data: LeadCreate, db: Session = Depends(get_db)):
    lead = Lead(
        name=lead_data.name,
        email=lead_data.email,
        whatsapp=lead_data.whatsapp,
        business_type=lead_data.business_type,
    )
    db.add(lead)
    db.commit()
    db.refresh(lead)
    logger.info("New lead created: id=%d email=%s business=%s", lead.id, lead.email, lead.business_type)
    return lead


@router.get("/leads", response_model=list[LeadResponse])
def list_leads(db: Session = Depends(get_db)):
    leads = db.query(Lead).order_by(Lead.created_at.desc()).all()
    logger.info("Leads listed: count=%d", len(leads))
    return leads
