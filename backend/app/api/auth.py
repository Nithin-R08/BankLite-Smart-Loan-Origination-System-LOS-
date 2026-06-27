from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse
from app.schemas.auth import LoginSchema, TokenSchema
from app.schemas.response import ApiResponse
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=ApiResponse, status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    db_user = AuthService.register_user(db, user_in)
    user_res = UserResponse.from_orm(db_user)
    return ApiResponse(
        success=True,
        message="User registered successfully",
        data=user_res
    )

@router.post("/login", response_model=ApiResponse)
def login(login_in: LoginSchema, db: Session = Depends(get_db)):
    token_res = AuthService.login_user(db, login_in)
    return ApiResponse(
        success=True,
        message="Login successful",
        data=token_res
    )

@router.get("/me", response_model=ApiResponse)
def get_me(current_user: User = Depends(get_current_user)):
    user_res = UserResponse.from_orm(current_user)
    return ApiResponse(
        success=True,
        message="Current user retrieved successfully",
        data=user_res
    )
