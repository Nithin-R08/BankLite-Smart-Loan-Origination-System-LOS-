import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class LoanApplication(Base):
    __tablename__ = "loan_applications"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    loan_amount = Column(Float, nullable=False)
    purpose = Column(String(255), nullable=False)
    monthly_income = Column(Float, nullable=False)
    employment_type = Column(String(50), nullable=False)
    loan_duration = Column(Integer, nullable=False)  # in months
    credit_score = Column(Integer, nullable=False)
    status = Column(String(20), default="Pending", nullable=False)  # "Pending", "Approved", "Rejected"
    officer_comments = Column(String(1000), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relationships
    customer = relationship("User", back_populates="loans", foreign_keys=[customer_id])
    audit_logs = relationship("AuditLog", back_populates="loan", cascade="all, delete-orphan")
