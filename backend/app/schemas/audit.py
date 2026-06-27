import datetime
from pydantic import BaseModel
from typing import Optional
from app.schemas.user import UserResponse

class AuditLogResponse(BaseModel):
    id: int
    loan_id: int
    officer_id: int
    action: str
    comments: Optional[str] = None
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class AuditLogDetailResponse(AuditLogResponse):
    officer: UserResponse
    loan_amount: Optional[float] = None
    customer_name: Optional[str] = None

    class Config:
        from_attributes = True
