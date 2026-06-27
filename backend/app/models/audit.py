import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    loan_id = Column(Integer, ForeignKey("loan_applications.id", ondelete="CASCADE"), nullable=False)
    officer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    action = Column(String(50), nullable=False)  # "Approved", "Rejected", etc.
    comments = Column(String(1000), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    loan = relationship("LoanApplication", back_populates="audit_logs")
    officer = relationship("User", back_populates="reviewed_logs")
