# 05. Manual Environment Setup Guide & Implementation Roadmap

## Part 1: Folder-by-Folder Manual Setup Guide (Windows / macOS / Linux)

We keep Python strictly inside `backend/` (with its own isolated `backend/.venv`) and Next.js in the project root.

### Terminal 1: Python FastAPI + LangGraph Backend (`backend/` folder)
1. **Navigate into the `backend` directory:**
   ```powershell
   cd backend
   ```
2. **Create a clean virtual environment named `.venv` inside `backend/`:**
   ```powershell
   python -m venv .venv
   ```
3. **Activate the virtual environment:**
   - **Windows PowerShell:**
     ```powershell
     .\.venv\Scripts\Activate.ps1
     ```
   - **Windows CMD:**
     ```cmd
     .venv\Scripts\activate.bat
     ```
   - **Git Bash (Windows):**
     ```bash
     source .venv/Scripts/activate
     ```
   - **macOS / Linux:**
     ```bash
     source .venv/bin/activate
     ```
4. **Upgrade pip and install requirements:**
   ```powershell
   python -m pip install --upgrade pip
   pip install -r requirements.txt
   ```
5. **Run the FastAPI server on Port 8000:**
   ```powershell
   uvicorn main:app --host 127.0.0.1 --port 8000 --reload
   ```
   - Verify at: `http://127.0.0.1:8000/api/health`
   - Interactive Swagger API Docs: `http://127.0.0.1:8000/docs`

---

### Terminal 2: Next.js 14 Frontend (Project Root folder)
1. **Open a second terminal in the project root folder:**
   ```powershell
   npm install
   npm run dev:next
   ```
2. **Open the UI in your browser:**
   - URL: `http://localhost:3005`
   - Note: `next.config.mjs` automatically proxies `/api/py/*` requests from Next.js (`:3005`) to FastAPI (`:8000`).

---

## Part 2: Modular Implementation Roadmap

### Phase 1: Base Monorepo & Python FastAPI Bridge (COMPLETED)
- [x] Next.js 14 + Tailwind CSS + TypeScript setup on port `3005`.
- [x] Python FastAPI setup in `backend/` on port `8000`.
- [x] Clean `backend/.venv` virtual environment workflow.
- [x] Health verification endpoint (`/api/health`) & bridge status dashboard.

### Phase 2: Security Guardrails & Zero-Token AST Code Ingestor (`backend/security/` & `backend/agent/ast_parser.py`)
- [ ] Build `backend/security/firewall.py` (AST/Regex code validator blocking `child_process`, `fs`, `eval`, `process.env`, SSRF guard, and Prompt Injection sanitizer).
- [ ] Build `backend/security/rate_limiter.py` (Per-tenant sliding window rate limiter).
- [ ] Build `backend/agent/ast_parser.py` (Extracts JSX elements, `data-testid`, ARIA roles, inputs, buttons, and forms from React/Next.js code with 0 LLM tokens).

### Phase 3: Free-Tier Multi-LLM Router & LangGraph Cyclic State Machine (`backend/agent/`)
- [ ] Build `backend/agent/state.py` (`TestGenerationState` TypedDict).
- [ ] Build `backend/agent/llm_router.py` (Groq `llama-3.3-70b-versatile` -> Gemini `gemini-2.0-flash` -> Offline Deterministic AST Synthesizer).
- [ ] Build `backend/agent/sandbox_runner.py` (Executes Playwright tests against live/simulated DOM mutations and captures DOM snapshots on failure).
- [ ] Build `backend/agent/graph.py` (Full 6-node `StateGraph` with conditional self-healing loop up to 3 retries).
- [ ] Add SQLite persistence (`backend/database.py`) to save all test runs, healing diffs, and metrics.

### Phase 4: Interactive Mission Control UI (`src/app/page.tsx`)
- [ ] **Component & PR Diff Input Studio:** Preset real-world React components (Checkout Flow, Auth Login Modal, User Profile Settings) + custom code editor.
- [ ] **"Simulate Breaking UI Change" Toggle:** Let users trigger real UI drifts (e.g., *Rename `#checkout-btn` to `data-testid="pay-now-cta"`*, *Inject Modal Latency*, or *Break Form Submit Handler*) to watch the Self-Healing loop diagnose and patch the test live!
- [ ] **Live LangGraph Visual State Machine:** Real-time node highlighting (`Ingestor` -> `Planner` -> `Coder` -> `Runner` -> `Self-Healer` -> `PR Ready`).
- [ ] **Side-by-Side Self-Healing Code Diff Viewer:** Compare the initial broken `.spec.ts` selector vs. the self-healed `.spec.ts` selector alongside the captured DOM snapshot.
- [ ] **Free-Tier BYOK Settings Modal:** Optional input for user's free Groq / Gemini API keys + Security Firewall test console.