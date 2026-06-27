import datetime
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    phone = Column(String(20), nullable=True)
    password = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False)  # "Customer" or "Officer"
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relationships
    loans = relationship("LoanApplication", back_populates="customer", foreign_keys="[LoanApplication.customer_id]")
    reviewed_logs = relationship("AuditLog", back_populates="officer", foreign_keys="[AuditLog.officer_id]")
