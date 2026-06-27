import datetime
from sqlalchemy.orm import Session
from app.models.audit import AuditLog
from app.models.user import User

class AuditService:
    @staticmethod
    def log_action(db: Session, loan_id: int, officer_id: int, action: str, comments: str) -> AuditLog:
        log = AuditLog(
            loan_id=loan_id,
            officer_id=officer_id,
            action=action,
            comments=comments,
            created_at=datetime.datetime.utcnow()
        )
        db.add(log)
        db.commit()
        db.refresh(log)
        return log

    @staticmethod
    def get_all_logs(db: Session, skip: int = 0, limit: int = 100):
        # We can join with User (officer) and LoanApplication to return rich details
        query = db.query(AuditLog).order_by(AuditLog.created_at.desc())
        total = query.count()
        items = query.offset(skip).limit(limit).all()
        return items, total
