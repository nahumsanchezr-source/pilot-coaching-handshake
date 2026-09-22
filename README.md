# Pilot Coaching Handshake

A bilateral operational application for coaching workflow management. Replaces static document-based coaching with an asynchronous, 3-state state-machine workflow.

## Architecture

| Layer    | Stack                                      |
|----------|--------------------------------------------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS 4 |
| Backend  | FastAPI, SQLAlchemy, SQLite, Pydantic v2    |
| Icons    | Lucide React                               |

### State Machine

```
PENDING_COMMITMENT → ACTIVE_FOLLOW_UP → CLOSED
       ↑                    ↑                ↑
  Leader creates       Pilot commits     Leader closes
```

## Prerequisites

- **Python 3.11+**
- **Node.js 18+**
- **npm 9+**

## Quick Start

### 1. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
.\venv\Scripts\activate

# Activate (macOS/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Seed database with sample data
python seed.py

# Start the API server
uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`.  
Interactive docs at `http://localhost:8000/docs`.

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

The UI will be available at `http://localhost:5173`.

## Views

| Route               | View                        | Access      |
|---------------------|-----------------------------|-------------|
| `/new`              | Leader Diagnostic Console   | Leader      |
| `/dashboard`        | Follow-Up & Audit Dashboard | Leader      |
| `/handshake/:token` | Pilot Debrief Portal        | Pilot (token) |

## API Endpoints

| Method  | Path                            | Description               |
|---------|---------------------------------|---------------------------|
| `POST`  | `/api/sessions`                 | Create coaching session   |
| `GET`   | `/api/sessions`                 | List sessions (filterable)|
| `GET`   | `/api/sessions/{id}`            | Get session by ID         |
| `PATCH` | `/api/sessions/{id}/close`      | Close session (leader)    |
| `GET`   | `/api/handshake/{token}`        | Get session by pilot token|
| `PATCH` | `/api/handshake/{token}/commit` | Submit pilot commitment   |

## Project Structure

```
form/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py          # FastAPI app, CORS, lifespan
│   │   ├── database.py      # SQLAlchemy engine & session
│   │   ├── models.py        # CoachingSession ORM model
│   │   ├── schemas.py       # Pydantic v2 schemas & enums
│   │   └── routers/
│   │       ├── sessions.py  # Leader CRUD endpoints
│   │       └── handshake.py # Pilot token endpoints
│   ├── seed.py              # Seed data script
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── api/client.ts    # Typed Axios API client
│   │   ├── types/index.ts   # TypeScript enums & interfaces
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Route-level page components
│   │   ├── App.tsx          # Router setup
│   │   └── main.tsx         # Entry point
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
└── README.md
```
