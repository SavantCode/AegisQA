# AegisQA — Autonomous E2E Test Generation & Self-Healing Agent

Built with **Python (FastAPI + LangGraph)** in `backend/` and **Next.js 14 (TypeScript + Tailwind)** in `frontend/`.

## Quick Start (2 Terminals)

### 1. Terminal 1 — Python Backend (`Port 8000`)
```powershell
cd backend
.\.venv\Scripts\Activate.ps1
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

### 2. Terminal 2 — Next.js Frontend (`Port 3000`)
```powershell
cd frontend
npm run dev
```

Open **`http://localhost:3000`** in your browser.

---

## Full Architecture & Planning Docs
All detailed design documents are saved in [`project-planning/`](./project-planning/):
- `00-HOW-TO-START-BACKEND-AND-FRONTEND.md`
- `01-EXECUTIVE-OVERVIEW-AND-USE-CASES.md`
- `02-SYSTEM-DESIGN-AND-LANGGRAPH-ARCHITECTURE.md`
- `03-FREE-TIER-INFRASTRUCTURE-AND-SCALING.md`
- `04-SECURITY-AND-SANDBOX-DESIGN.md`
- `05-STEP-BY-STEP-SETUP-AND-ROADMAP.md`