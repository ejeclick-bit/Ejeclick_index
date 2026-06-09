import os
from fastapi import Request
from sqlalchemy import create_engine, text
from sqlalchemy.orm import DeclarativeBase, sessionmaker

DATABASE_URL = os.getenv(
    "FLOW_DATABASE_URL",
    "postgresql://flow_flow:flow_flow@localhost:3004/flow_flow",
)

engine_args = {}
if DATABASE_URL.startswith("sqlite"):
    engine_args["connect_args"] = {"check_same_thread": False}

engine = create_engine(DATABASE_URL, **engine_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db(request: Request = None):
    db = SessionLocal()
    if request:
        tenant_id = getattr(request.state, "barbershop_id", None)
        if tenant_id is not None:
            db.execute(text(f"SET LOCAL app.current_tenant = '{tenant_id}'"))
        else:
            db.execute(text("SET LOCAL app.current_tenant = ''"))
    else:
        db.execute(text("SET LOCAL app.current_tenant = ''"))
        
    try:
        yield db
    finally:
        db.close()
