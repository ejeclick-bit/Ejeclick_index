from pydantic import BaseModel, EmailStr, Field


class LeadCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=255)
    email: EmailStr
    whatsapp: str = Field(..., min_length=7, max_length=50)
    business_type: str = Field(..., min_length=2, max_length=255)


class LeadResponse(BaseModel):
    id: int
    name: str
    email: str
    whatsapp: str
    business_type: str

    model_config = {"from_attributes": True}
