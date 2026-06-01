from typing import Optional
from fastapi import Request


async def get_tenant_id(request: Request) -> Optional[int]:
    return getattr(request.state, "barbershop_id", None)
