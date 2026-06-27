import random
import datetime
from sqlalchemy import func
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.loan import LoanApplication
from app.models.user import User
from app.models.audit import AuditLog
from app.schemas.loan import LoanCreate, LoanReview
from app.services.audit_service import AuditService

class LoanService:
    @staticmethod
    def calculate_credit_score(
        monthly_income: float,
        yearly_income: float,
        employment_type: str,
        loan_amount: float,
        loan_duration: int
    ) -> int:
        # Base credit score starts at 300
        score = 300
        
        # 1. Employment type points
        if employment_type == "Full-Time":
            score += 250
        elif employment_type == "Self-Employed":
            score += 200
        elif employment_type == "Part-Time":
            score += 150
        else:  # Unemployed
            score += 50
            
        # 2. Yearly income points
        if yearly_income >= 1200000:  # >= 12L
            score += 300
        elif yearly_income >= 600000:  # >= 6L
            score += 250
        elif yearly_income >= 300000:  # >= 3L
            score += 180
        elif yearly_income >= 150000:  # >= 1.5L
            score += 120
        else:
            score += 50
            
        # 3. Monthly loan payment to monthly income ratio points
        if loan_duration <= 0:
            loan_duration = 1
        monthly_payment = loan_amount / loan_duration
        
        if monthly_income <= 0:
            payment_to_income = 1.0
        else:
            payment_to_income = monthly_payment / monthly_income
            
        if payment_to_income <= 0.10:  # <= 10%
            score += 300
        elif payment_to_income <= 0.20:  # <= 20%
            score += 250
        elif payment_to_income <= 0.35:  # <= 35%
            score += 180
        elif payment_to_income <= 0.50:  # <= 50%
            score += 100
        else:
            score += 20
            
        # Cap score between 300 and 850
        return max(300, min(850, score))

    @staticmethod
    def apply_loan(db: Session, customer_id: int, loan_in: LoanCreate) -> LoanApplication:
        # Calculate credit score based on applicant inputs
        credit_score = LoanService.calculate_credit_score(
            monthly_income=loan_in.monthly_income,
            yearly_income=loan_in.yearly_income,
            employment_type=loan_in.employment_type,
            loan_amount=loan_in.loan_amount,
            loan_duration=loan_in.loan_duration
        )
        
        db_loan = LoanApplication(
            customer_id=customer_id,
            loan_amount=loan_in.loan_amount,
            purpose=loan_in.purpose,
            monthly_income=loan_in.monthly_income,
            yearly_income=loan_in.yearly_income,
            employment_type=loan_in.employment_type,
            loan_duration=loan_in.loan_duration,
            credit_score=credit_score,
            status="Pending",
            officer_comments=None
        )
        db.add(db_loan)
        db.commit()
        db.refresh(db_loan)
        return db_loan

    @staticmethod
    def get_customer_loans(
        db: Session, 
        customer_id: int, 
        status_filter: str = None, 
        search: str = None,
        skip: int = 0, 
        limit: int = 10
    ):
        query = db.query(LoanApplication).filter(LoanApplication.customer_id == customer_id)
        
        if status_filter:
            query = query.filter(func.lower(LoanApplication.status) == status_filter.lower())
            
        if search:
            query = query.filter(LoanApplication.purpose.ilike(f"%{search}%"))
            
        total = query.count()
        items = query.order_by(LoanApplication.created_at.desc()).offset(skip).limit(limit).all()
        return items, total

    @staticmethod
    def get_customer_stats(db: Session, customer_id: int) -> dict:
        total = db.query(LoanApplication).filter(LoanApplication.customer_id == customer_id).count()
        pending = db.query(LoanApplication).filter(LoanApplication.customer_id == customer_id, LoanApplication.status == "Pending").count()
        approved = db.query(LoanApplication).filter(LoanApplication.customer_id == customer_id, LoanApplication.status == "Approved").count()
        rejected = db.query(LoanApplication).filter(LoanApplication.customer_id == customer_id, LoanApplication.status == "Rejected").count()
        
        # Recent 5 applications
        recent = db.query(LoanApplication)\
            .filter(LoanApplication.customer_id == customer_id)\
            .order_by(LoanApplication.created_at.desc())\
            .limit(5).all()
            
        return {
            "total": total,
            "pending": pending,
            "approved": approved,
            "rejected": rejected,
            "recent_applications": recent
        }

    @staticmethod
    def get_officer_stats(db: Session) -> dict:
        # Times
        now = datetime.datetime.utcnow()
        today_start = datetime.datetime(now.year, now.month, now.day)

        pending_reviews = db.query(LoanApplication).filter(LoanApplication.status == "Pending").count()
        
        today_approvals = db.query(LoanApplication).filter(
            LoanApplication.status == "Approved",
            LoanApplication.updated_at >= today_start
        ).count()
        
        today_rejections = db.query(LoanApplication).filter(
            LoanApplication.status == "Rejected",
            LoanApplication.updated_at >= today_start
        ).count()

        # Average Credit Score
        avg_score_res = db.query(func.avg(LoanApplication.credit_score)).scalar()
        avg_credit_score = round(avg_score_res) if avg_score_res else 0

        # Approval Rate = Approved / (Approved + Rejected)
        approved_count = db.query(LoanApplication).filter(LoanApplication.status == "Approved").count()
        rejected_count = db.query(LoanApplication).filter(LoanApplication.status == "Rejected").count()
        total_decisions = approved_count + rejected_count
        approval_rate = round((approved_count / total_decisions) * 100, 1) if total_decisions > 0 else 0.0

        # Chart 1: Loan Distribution by Purpose
        purpose_distribution = []
        purpose_query = db.query(
            LoanApplication.purpose,
            func.count(LoanApplication.id),
            func.sum(LoanApplication.loan_amount)
        ).group_by(LoanApplication.purpose).all()
        
        # Group similar purposes slightly if needed, but since it's user input, we list them
        # For a clean dashboard, we can return the top purposes and group others
        for purpose, count, total_amount in purpose_query:
            purpose_distribution.append({
                "name": purpose,
                "value": count,
                "amount": float(total_amount or 0)
            })

        # Chart 2: Approval Trends (Approved vs Rejected)
        # We can simulate/fetch the last 6 months or last 7 days of audit log reviews.
        # Let's group loans by month or day. For a dashboard, let's group by month of the last 6 months.
        trends = []
        for i in range(5, -1, -1):
            date = now - datetime.timedelta(days=i*30)
            month_name = date.strftime("%b")
            month_start = datetime.datetime(date.year, date.month, 1)
            # In SQLite / MySQL, standard date comparisons work
            next_month_year = date.year if date.month < 12 else date.year + 1
            next_month = date.month + 1 if date.month < 12 else 1
            month_end = datetime.datetime(next_month_year, next_month, 1)
            
            app_count = db.query(LoanApplication).filter(
                LoanApplication.created_at >= month_start,
                LoanApplication.created_at < month_end
            ).count()
            
            app_approved = db.query(LoanApplication).filter(
                LoanApplication.status == "Approved",
                LoanApplication.updated_at >= month_start,
                LoanApplication.updated_at < month_end
            ).count()
            
            app_rejected = db.query(LoanApplication).filter(
                LoanApplication.status == "Rejected",
                LoanApplication.updated_at >= month_start,
                LoanApplication.updated_at < month_end
            ).count()
            
            trends.append({
                "month": month_name,
                "applications": app_count,
                "approved": app_approved,
                "rejected": app_rejected
            })

        # Chart 3: Risk Distribution (Low Risk: >=750, Medium: 600-749, High: <600)
        low_risk = db.query(LoanApplication).filter(LoanApplication.credit_score >= 740).count()
        medium_risk = db.query(LoanApplication).filter(LoanApplication.credit_score >= 600, LoanApplication.credit_score < 740).count()
        high_risk = db.query(LoanApplication).filter(LoanApplication.credit_score < 600).count()
        
        risk_distribution = [
            {"name": "Low Risk (740-850)", "value": low_risk, "color": "#10B981"},
            {"name": "Medium Risk (600-739)", "value": medium_risk, "color": "#F59E0B"},
            {"name": "High Risk (300-599)", "value": high_risk, "color": "#EF4444"}
        ]

        # Recent activities (Recent 10 Audit Logs)
        recent_logs = db.query(AuditLog)\
            .order_by(AuditLog.created_at.desc())\
            .limit(10).all()
            
        recent_activities = []
        for log in recent_logs:
            loan = db.query(LoanApplication).filter(LoanApplication.id == log.loan_id).first()
            officer = db.query(User).filter(User.id == log.officer_id).first()
            recent_activities.append({
                "id": log.id,
                "officer_name": officer.full_name if officer else "Unknown Officer",
                "action": log.action,
                "loan_id": log.loan_id,
                "amount": loan.loan_amount if loan else 0.0,
                "comments": log.comments,
                "timestamp": log.created_at
            })

        return {
            "pending_reviews": pending_reviews,
            "today_approvals": today_approvals,
            "today_rejections": today_rejections,
            "average_credit_score": avg_credit_score,
            "approval_rate": approval_rate,
            "purpose_distribution": purpose_distribution,
            "trends": trends,
            "risk_distribution": risk_distribution,
            "recent_activities": recent_activities
        }

    @staticmethod
    def get_pending_applications(db: Session, skip: int = 0, limit: int = 50):
        query = db.query(LoanApplication).filter(LoanApplication.status == "Pending").order_by(LoanApplication.created_at.asc())
        total = query.count()
        items = query.offset(skip).limit(limit).all()
        return items, total

    @staticmethod
    def get_application_by_id(db: Session, loan_id: int) -> LoanApplication:
        loan = db.query(LoanApplication).filter(LoanApplication.id == loan_id).first()
        if not loan:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Loan application not found"
            )
        return loan

    @staticmethod
    def review_loan(db: Session, loan_id: int, officer_id: int, review_in: LoanReview) -> LoanApplication:
        loan = db.query(LoanApplication).filter(LoanApplication.id == loan_id).first()
        if not loan:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Loan application not found"
            )
            
        if loan.status != "Pending":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Cannot review application with status {loan.status}"
            )
            
        # Update Loan
        loan.status = review_in.status
        loan.officer_comments = review_in.comments
        loan.updated_at = datetime.datetime.utcnow()
        
        # Log Audit Action
        AuditService.log_action(
            db=db,
            loan_id=loan.id,
            officer_id=officer_id,
            action=review_in.status,
            comments=review_in.comments
        )
        
        db.commit()
        db.refresh(loan)
        return loan
