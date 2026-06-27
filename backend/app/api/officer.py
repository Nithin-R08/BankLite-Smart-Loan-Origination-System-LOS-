from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_officer
from app.models.user import User
from app.schemas.loan import LoanDetailResponse, LoanReview
from app.schemas.response import ApiResponse
from app.schemas.user import UserResponse
from app.services.loan_service import LoanService
from app.services.audit_service import AuditService

router = APIRouter(prefix="/officer", tags=["Credit Officer Portal"])

@router.get("/dashboard", response_model=ApiResponse)
def get_dashboard(
    current_officer: User = Depends(get_current_officer),
    db: Session = Depends(get_db)
):
    stats = LoanService.get_officer_stats(db)
    return ApiResponse(
        success=True,
        message="Officer dashboard statistics retrieved successfully",
        data=stats
    )

@router.get("/pending", response_model=ApiResponse)
def get_pending(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    current_officer: User = Depends(get_current_officer),
    db: Session = Depends(get_db)
):
    loans, total = LoanService.get_pending_applications(db, skip, limit)
    loans_res = [LoanDetailResponse.from_orm(loan) for loan in loans]
    return ApiResponse(
        success=True,
        message="Pending loan applications retrieved successfully",
        data={
            "loans": loans_res,
            "total": total,
            "skip": skip,
            "limit": limit
        }
    )

@router.get("/application/{loan_id}", response_model=ApiResponse)
def get_application(
    loan_id: int,
    current_officer: User = Depends(get_current_officer),
    db: Session = Depends(get_db)
):
    loan = LoanService.get_application_by_id(db, loan_id)
    loan_res = LoanDetailResponse.from_orm(loan)
    return ApiResponse(
        success=True,
        message="Application details retrieved successfully",
        data=loan_res
    )

@router.put("/review/{loan_id}", response_model=ApiResponse)
def review_application(
    loan_id: int,
    review_in: LoanReview,
    current_officer: User = Depends(get_current_officer),
    db: Session = Depends(get_db)
):
    updated_loan = LoanService.review_loan(
        db=db,
        loan_id=loan_id,
        officer_id=current_officer.id,
        review_in=review_in
    )
    loan_res = LoanDetailResponse.from_orm(updated_loan)
    return ApiResponse(
        success=True,
        message=f"Loan application has been successfully {review_in.status.lower()}",
        data=loan_res
    )

@router.get("/audit-logs", response_model=ApiResponse)
def get_audit_logs(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    current_officer: User = Depends(get_current_officer),
    db: Session = Depends(get_db)
):
    logs, total = AuditService.get_all_logs(db, skip, limit)
    
    # Map to AuditLogDetailResponse manually to ensure safe loading
    logs_res = []
    for log in logs:
        logs_res.append({
            "id": log.id,
            "loan_id": log.loan_id,
            "officer_id": log.officer_id,
            "action": log.action,
            "comments": log.comments,
            "created_at": log.created_at,
            "officer": UserResponse.from_orm(log.officer) if log.officer else None,
            "loan_amount": log.loan.loan_amount if log.loan else 0.0,
            "customer_name": log.loan.customer.full_name if (log.loan and log.loan.customer) else "Unknown"
        })
        
    return ApiResponse(
        success=True,
        message="Audit logs retrieved successfully",
        data={
            "audit_logs": logs_res,
            "total": total,
            "skip": skip,
            "limit": limit
        }
    )
