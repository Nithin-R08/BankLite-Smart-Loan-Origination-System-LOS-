import datetime
from pydantic import BaseModel, Field
from typing import Optional, List
from app.schemas.user import UserResponse
from app.schemas.audit import AuditLogResponse

class LoanBase(BaseModel):
    loan_amount: float = Field(..., gt=0)
    purpose: str = Field(..., min_length=5, max_length=255)
    monthly_income: float = Field(..., gt=0)
    employment_type: str = Field(..., pattern="^(Full-Time|Part-Time|Self-Employed|Unemployed)$")
    loan_duration: int = Field(..., gt=0, le=360)  # max 30 years in months

class LoanCreate(LoanBase):
    pass

class LoanResponse(LoanBase):
    id: int
    customer_id: int
    credit_score: int
    status: str
    officer_comments: Optional[str] = None
    created_at: datetime.datetime
    updated_at: datetime.datetime

    class Config:
        from_attributes = True

class LoanDetailResponse(LoanResponse):
    customer: UserResponse
    audit_logs: Optional[List[AuditLogResponse]] = None

    class Config:
        from_attributes = True

class LoanReview(BaseModel):
    status: str = Field(..., pattern="^(Approved|Rejected)$")
    comments: str = Field(..., min_length=5, max_length=1000)
