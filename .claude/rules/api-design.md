# API Design

Paths: apps/*/backend/**/*.py

## Endpoints

- Prefix: `/api/v1/`
- Always use `response_model` Pydantic schema
- Explicit `status_code` (201 for POST, 200 for GET)
- Input validation via Pydantic (never manual)
- Log all CRUD operations with `logger.info`

## Models

- `__tablename__` in plural: `leads`, `campaigns`
- `created_at` with `server_default=func.now()`
- `DATABASE_URL` from environment variable

## Example

```python
@router.post("/leads", response_model=LeadResponse, status_code=201)
def create_lead(lead_data: LeadCreate, db: Session = Depends(get_db)):
    lead = Lead(**lead_data.model_dump())
    db.add(lead)
    db.commit()
    db.refresh(lead)
    return lead
```
