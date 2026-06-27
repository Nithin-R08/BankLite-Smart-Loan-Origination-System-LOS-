from pydantic import BaseModel, EmailStr
from typing import Optional

class LoginSchema(BaseModel):
    email: EmailStr
    password: str
    role: str  # "Customer" or "Officer"

class TokenSchema(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    full_name: str
    email: str

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None
