from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_customer
from app.models.user import User
from app.schemas.loan import LoanCreate, LoanResponse
from app.schemas.user import UserResponse, UserUpdate
from app.schemas.response import ApiResponse
from app.services.loan_service import LoanService
from app.services.auth_service import AuthService
from typing import List

router = APIRouter(prefix="/customer", tags=["Customer Portal"])

@router.post("/loan/apply", response_model=ApiResponse, status_code=status.HTTP_201_CREATED)
def apply_loan(
    loan_in: LoanCreate, 
    current_customer: User = Depends(get_current_customer),
    db: Session = Depends(get_db)
):
    loan = LoanService.apply_loan(db, current_customer.id, loan_in)
    loan_res = LoanResponse.from_orm(loan)
    return ApiResponse(
        success=True,
        message="Loan application submitted successfully",
        data=loan_res
    )

@router.get("/loans", response_model=ApiResponse)
def get_loans(
    status_filter: str = Query(None, description="Filter loans by status"),
    search: str = Query(None, description="Search loans by purpose"),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    current_customer: User = Depends(get_current_customer),
    db: Session = Depends(get_db)
):
    loans, total = LoanService.get_customer_loans(
        db=db, 
        customer_id=current_customer.id, 
        status_filter=status_filter,
        search=search,
        skip=skip, 
        limit=limit
    )
    
    loans_res = [LoanResponse.from_orm(loan) for loan in loans]
    
    return ApiResponse(
        success=True,
        message="Customer loans retrieved successfully",
        data={
            "loans": loans_res,
            "total": total,
            "skip": skip,
            "limit": limit
        }
    )

@router.get("/profile", response_model=ApiResponse)
def get_profile(current_customer: User = Depends(get_current_customer)):
    user_res = UserResponse.from_orm(current_customer)
    return ApiResponse(
        success=True,
        message="Customer profile retrieved successfully",
        data=user_res
    )

@router.put("/profile", response_model=ApiResponse)
def update_profile(
    update_in: UserUpdate,
    current_customer: User = Depends(get_current_customer),
    db: Session = Depends(get_db)
):
    updated_user = AuthService.update_profile(db, current_customer, update_in)
    user_res = UserResponse.from_orm(updated_user)
    return ApiResponse(
        success=True,
        message="Profile updated successfully",
        data=user_res
    )

@router.get("/dashboard-stats", response_model=ApiResponse)
def get_dashboard_stats(
    current_customer: User = Depends(get_current_customer),
    db: Session = Depends(get_db)
):
    stats = LoanService.get_customer_stats(db, current_customer.id)
    recent_res = [LoanResponse.from_orm(loan) for loan in stats["recent_applications"]]
    stats["recent_applications"] = recent_res
    return ApiResponse(
        success=True,
        message="Customer dashboard statistics retrieved successfully",
        data=stats
    )
