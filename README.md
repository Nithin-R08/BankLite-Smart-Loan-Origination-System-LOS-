# BankLite – Smart Loan Origination System (LOS)

BankLite is a production-ready, enterprise-grade Smart Loan Origination System (LOS) designed for financial institutions to manage loan file registries, dynamic credit scoring, underwriting reviews, and compliant audit logging.

It contains two fully segregated user environments:
- **Customer Portal**: For applying for loans, viewing dynamic credit scores, and tracking underwriting status.
- **Credit Officer Portal**: For underwriting queued applications, examining debt-to-income metrics, approving/reclaiming files with mandatory commentary, viewing macro analytics, and auditing log ledgers.

---

## Technical Stack

### Backend
- **Core Framework**: FastAPI (Python)
- **Database Engine**: SQLAlchemy (supports MySQL and SQLite fallback)
- **Validation Layers**: Pydantic v2
- **Auth Tier**: JSON Web Tokens (JWT) + Cryptographic Hashing (passlib/bcrypt)
- **Server Gateway**: Uvicorn

### Frontend
- **Framework**: React 19 + TypeScript + Vite
- **Styling Core**: Tailwind CSS v4 (using Vite JIT plugin)
- **State & Forms**: React Hook Form + Zod
- **Animations**: Framer Motion
- **Analytics**: Recharts
- **Router**: React Router DOM v6
- **Toasts**: React Hot Toast

---

## Folder Structure

```text
BankLite/
├── backend/
│   ├── app/
│   │   ├── api/            # API endpoints & routing (auth, customer, officer)
│   │   ├── core/           # Configuration layers
│   │   ├── models/         # SQLAlchemy models (user, loan, audit)
│   │   ├── schemas/        # Pydantic validation schemas
│   │   ├── services/       # Layered business logic (auth, loan, audit)
│   │   ├── utils/          # Hashing, security, export helpers
│   │   ├── config.py       # Pydantic Settings initialization
│   │   ├── database.py     # SQLAlchemy DB connection setup
│   │   └── main.py         # FastAPI main entrypoint & startup handlers
│   ├── requirements.txt    # Python dependencies
│   └── .env                # Backend environment settings
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI primitives (Sidebar, Navbar, Skeletons, Modals)
│   │   ├── contexts/       # Auth global context state
│   │   ├── layouts/        # Page layout wrappers (Auth, Dashboard)
│   │   ├── pages/          # Page components (Landing, Dashboards, Underwriting, Audits)
│   │   ├── services/       # Axios API client wrappers (auth, loans, officer)
│   │   ├── types/          # Shared TypeScript type definitions
│   │   ├── App.tsx         # Router definitions & guards
│   │   └── main.tsx        # React 19 mount point
│   ├── package.json        # Frontend NPM configurations
│   └── vite.config.ts      # Vite bundler configurations
└── README.md
```

---

## Installation & Running Locally

BankLite is configured to run out-of-the-box using a local SQLite database (`banklite.db`) to enable zero-configuration testing. Switching to a production MySQL database is a simple 1-line configuration change in `.env`.

### Step 1: Backend Setup
1. Open your terminal in the `backend/` directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   - **Windows (PowerShell)**:
     ```powershell
     python -m venv venv
     .\venv\Scripts\Activate.ps1
     ```
   - **macOS/Linux**:
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the FastAPI server:
   ```bash
   uvicorn app.main:app --reload
   ```
   *The backend will boot at `http://127.0.0.1:8000`. You can inspect the Swagger API docs at `http://127.0.0.1:8000/docs`.*

### Step 2: Frontend Setup
1. Open a new terminal in the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. Boot the Vite development server:
   ```bash
   npm run dev
   ```
   *The application will boot at `http://localhost:5173`.*

---

## Default Seeded Accounts

To make evaluation simple, the database automatically seeds two test accounts upon its first launch:

### 1. Customer Account
- **Email**: `customer@banklite.com`
- **Password**: `password123`
- *Capabilities*: Request loans, verify credit scores, view personal files list, update user profile.

### 2. Credit Officer Account
- **Email**: `officer@banklite.com`
- **Password**: `password123`
- *Capabilities*: Review the pending review queue, approve/decline applications with mandatory comments, download CSV logs, monitor portfolio risk analytics.

---

## Production Deployment Configurations

### Database Migration (MySQL)
To migrate to MySQL in production, update the `DATABASE_URL` in `backend/.env`:
```text
DATABASE_URL=mysql+pymysql://<user>:<password>@<host>:<port>/banklite
```

### Backend Deployment (Render / Heroku)
Build Command: `pip install -r requirements.txt`  
Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### Frontend Deployment (Vercel / Netlify)
Ensure you set the environment variable:  
`VITE_API_URL=https://your-backend-url.onrender.com/api`
