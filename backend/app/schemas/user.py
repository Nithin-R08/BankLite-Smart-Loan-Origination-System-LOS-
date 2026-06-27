import datetime
from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class UserBase(BaseModel):
    email: EmailStr
    full_name: str = Field(..., min_length=2, max_length=100)
    phone: Optional[str] = Field(None, max_length=20)

class UserCreate(UserBase):
    password: str = Field(..., min_length=6)
    role: str = Field("Customer", pattern="^(Customer|Officer)$")

class UserUpdate(BaseModel):
    full_name: Optional[str] = Field(None, min_length=2, max_length=100)
    phone: Optional[str] = Field(None, max_length=20)
    password: Optional[str] = Field(None, min_length=6)
    current_password: Optional[str] = None

class UserResponse(UserBase):
    id: int
    role: str
    created_at: datetime.datetime
    updated_at: datetime.datetime

    class Config:
        from_attributes = True
        json_encoders = {
            datetime.datetime: lambda dt: dt.isoformat()
        }
