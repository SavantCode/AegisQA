import os
import sys
import platform
import time
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Allow running both from inside `backend/` (`uvicorn main:app`) and from root (`uvicorn backend.main:app`)
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from config import settings

try:
    import langgraph
    LANGGRAPH_INSTALLED = True
except ImportError:
    LANGGRAPH_INSTALLED = False

START_TIME = time.time()

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    description="Autonomous E2E Test Generation & Self-Healing Agent Backend (Python + LangGraph)",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {
        "message": "AegisQA Python FastAPI + LangGraph Backend is running!",
        "docs_url": "http://127.0.0.1:8000/docs",
        "health_url": "http://127.0.0.1:8000/api/health",
        "frontend_url": "http://localhost:3000",
    }


@app.get("/api/health")
async def health_check():
    """Health & System Architecture verification endpoint."""
    uptime_seconds = round(time.time() - START_TIME, 1)
    return {
        "status": "healthy",
        "service": settings.APP_NAME,
        "version": settings.VERSION,
        "python_version": platform.python_version(),
        "uptime_seconds": uptime_seconds,
        "architecture": {
            "orchestrator": "LangGraph StateGraph (Cyclic State Machine)",
            "langgraph_ready": LANGGRAPH_INSTALLED,
            "llm_router": {
                "primary": f"Groq ({settings.PRIMARY_MODEL})",
                "secondary": f"Google Gemini ({settings.FALLBACK_MODEL})",
                "offline_fallback": "Deterministic AST Test Synthesizer (Active)",
                "groq_key_configured": bool(settings.GROQ_API_KEY),
                "gemini_key_configured": bool(settings.GEMINI_API_KEY),
            },
            "security_layers": {
                "ast_code_firewall": settings.AST_FIREWALL_ENABLED,
                "ssrf_url_guard": settings.SSRF_PROTECTION_ENABLED,
                "max_self_healing_retries": settings.MAX_HEALING_RETRIES,
                "rate_limit_rpm": settings.RATE_LIMIT_PER_MINUTE,
            },
            "nodes_registered": [
                "1. ast_ingestor_node",
                "2. planner_node",
                "3. playwright_coder_node",
                "4. sandbox_runner_node",
                "5. self_healing_critic_node",
                "6. github_pr_publisher_node",
            ],
        },
    }