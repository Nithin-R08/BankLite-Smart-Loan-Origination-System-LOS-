from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.schemas.auth import LoginSchema, TokenSchema
from app.utils.security import get_password_hash, verify_password, create_access_token

class AuthService:
    @staticmethod
    def register_user(db: Session, user_in: UserCreate) -> User:
        # Check if user already exists
        existing_user = db.query(User).filter(User.email == user_in.email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Create user
        db_user = User(
            full_name=user_in.full_name,
            email=user_in.email,
            phone=user_in.phone,
            password=get_password_hash(user_in.password),
            role=user_in.role
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user

    @staticmethod
    def login_user(db: Session, login_in: LoginSchema) -> TokenSchema:
        user = db.query(User).filter(User.email == login_in.email).first()
        if not user or not verify_password(login_in.password, user.password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password"
            )
        
        # Verify role matches what they selected (optional but good for strict portals)
        if user.role != login_in.role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. User is registered as a {user.role}."
            )

        # Generate token
        token_data = {"sub": user.email, "role": user.role}
        access_token = create_access_token(data=token_data)
        
        return TokenSchema(
            access_token=access_token,
            role=user.role,
            full_name=user.full_name,
            email=user.email
        )

    @staticmethod
    def update_profile(db: Session, user: User, update_in: UserUpdate) -> User:
        if update_in.full_name is not None:
            user.full_name = update_in.full_name
        if update_in.phone is not None:
            user.phone = update_in.phone
        if update_in.password is not None:
            # If changing password, must verify current password
            if not update_in.current_password or not verify_password(update_in.current_password, user.password):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid current password provided for changing password"
                )
            user.password = get_password_hash(update_in.password)
        
        db.commit()
        db.refresh(user)
        return user
