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


from sqlalchemy import event
from sqlalchemy.orm import Session

def get_db(request: Request = None):
    db = SessionLocal()
    tenant_id = "-1"
    is_super_admin = "0"
    
    if request:
        tid = getattr(request.state, "barbershop_id", None)
        if tid is not None:
            tenant_id = str(tid)
            
    db.info["tenant_id"] = tenant_id
    db.info["is_super_admin"] = is_super_admin
    
    # Ejecutamos para la transacción actual que ya empezó
    if engine.name != "sqlite":
        db.execute(text(f"SET LOCAL app.current_tenant = '{tenant_id}'"))
        db.execute(text(f"SET LOCAL app.is_super_admin = '{is_super_admin}'"))
        
    try:
        yield db
    finally:
        db.close()

@event.listens_for(SessionLocal, "after_begin")
def receive_after_begin(session, transaction, connection):
    tenant_id = session.info.get("tenant_id", "-1")
    is_super_admin = session.info.get("is_super_admin", "0")
    if connection.engine.name != "sqlite":
        connection.execute(text(f"SET LOCAL app.current_tenant = '{tenant_id}'"))
        connection.execute(text(f"SET LOCAL app.is_super_admin = '{is_super_admin}'"))

