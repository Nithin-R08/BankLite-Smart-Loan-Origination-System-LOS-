import logging
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import SQLAlchemyError

from app.config import settings
from app.database import engine, Base
from app.api import auth, customer, officer

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("banklite")

# Create database tables automatically if they do not exist
# Note: For production systems, migration tools like Alembic are preferred,
# but automatic creation ensures instant functionality for development and evaluation.
try:
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables initialized successfully.")
    
    # Auto-seed database if empty
    from app.database import SessionLocal
    from app.models.user import User
    from app.utils.security import get_password_hash
    db = SessionLocal()
    try:
        if db.query(User).count() == 0:
            logger.info("Database is empty. Seeding default accounts...")
            customer_user = User(
                full_name="Sarah Jenkins (Customer)",
                email="customer@banklite.com",
                phone="555-0123-456",
                password=get_password_hash("password123"),
                role="Customer"
            )
            officer_user = User(
                full_name="Richard Davis (Credit Officer)",
                email="officer@banklite.com",
                phone="555-0199-987",
                password=get_password_hash("password123"),
                role="Officer"
            )
            db.add(customer_user)
            db.add(officer_user)
            db.commit()
            logger.info("Database seeded successfully with default accounts.")
    finally:
        db.close()
except Exception as e:
    logger.error(f"Error initializing database tables or seeding: {e}")

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Enterprise-grade Smart Loan Origination System API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(customer.router, prefix=settings.API_V1_STR)
app.include_router(officer.router, prefix=settings.API_V1_STR)

# Global Exception Handlers for Standardized Response Formats
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    logger.warning(f"HTTPException on {request.url.path}: {exc.detail}")
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "message": exc.detail
        }
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = exc.errors()
    # Format error messages into a human-readable list
    error_msgs = []
    for err in errors:
        loc = " -> ".join([str(item) for item in err["loc"][1:]]) if len(err["loc"]) > 1 else "body"
        error_msgs.append(f"[{loc}]: {err['msg']}")
    
    full_message = "; ".join(error_msgs)
    logger.warning(f"Validation error on {request.url.path}: {full_message}")
    
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "success": False,
            "message": f"Input validation failed: {full_message}"
        }
    )

@app.exception_handler(SQLAlchemyError)
async def sqlalchemy_exception_handler(request: Request, exc: SQLAlchemyError):
    logger.error(f"Database error on {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "message": "A database error occurred. Please contact the administrator."
        }
    )

@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled server error on {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "message": f"Internal Server Error: {str(exc)}"
        }
    )

@app.get("/")
def read_root():
    return {
        "success": True,
        "message": f"Welcome to {settings.PROJECT_NAME} API. Access docs at /docs."
    }
