# How to Start Backend (Python FastAPI) & Frontend (Next.js)

Your project is organized into two clean, isolated folders:
- **`backend/`** — Python FastAPI + LangGraph Agent Server (Runs on **`http://127.0.0.1:8000`**)
- **`frontend/`** — Next.js 14 Dashboard UI (Runs on **`http://localhost:3000`**)

---

## Daily Startup Guide (Every Time You Open VS Code)

You need **2 terminals** open side-by-side in VS Code.

### Terminal 1: Start the Python AI Backend (`Port 8000`)

1. **Go into the `backend` folder:**
   ```powershell
   cd backend
   ```

2. **Activate your Python Virtual Environment (`.venv`):**
   - **Windows PowerShell:**
     ```powershell
     .\.venv\Scripts\Activate.ps1
     ```
   - **Windows Command Prompt (CMD):**
     ```cmd
     .venv\Scripts\activate.bat
     ```
   - **Git Bash:**
     ```bash
     source .venv/Scripts/activate
     ```
   *(Make sure you see `(.venv)` at the start of your terminal prompt!)*

3. **Start the FastAPI Server:**
   ```powershell
   uvicorn main:app --host 127.0.0.1 --port 8000 --reload
   ```

4. **Backend URLs to Verify:**
   - Root Status: `http://127.0.0.1:8000/`
   - Health & Architecture JSON: `http://127.0.0.1:8000/api/health`
   - Interactive Swagger API Docs: `http://127.0.0.1:8000/docs`

---

### Terminal 2: Start the Next.js Frontend (`Port 3000`)

1. **Open a second terminal (`+` button in VS Code) and go into the `frontend` folder:**
   ```powershell
   cd frontend
   ```

2. **Start the Next.js Dev Server:**
   ```powershell
   npm run dev
   ```

3. **Open the Web Application in Browser:**
   - Dashboard UI: **`http://localhost:3000`**

---

## First-Time Installation Commands (Only Needed Once or After Adding Packages)

### If you add new Python packages to `backend/requirements.txt`:
```powershell
cd backend
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### If you add new Node packages to `frontend/package.json`:
```powershell
cd frontend
npm install
```

---

## Troubleshooting Quick Checks

1. **Port 8000 or 3000 already in use?**
   - Press `Ctrl + C` in the terminal running the server to stop it cleanly.
   - Or run frontend on a custom port anytime: `npx next dev -p 3002`
2. **PowerShell blocks `.Activate.ps1` script?**
   - Run this once in PowerShell:
     ```powershell
     Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
     ```
3. **Frontend says "Python FastAPI Backend Not Reachable Yet"?**
   - Check Terminal 1 to make sure `uvicorn main:app --host 127.0.0.1 --port 8000 --reload` is running without errors, then click **"Verify Python Bridge"** on `http://localhost:3000`.