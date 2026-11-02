import os
from pydantic import BaseModel


class Settings(BaseModel):
    APP_NAME: str = "AegisQA Autonomous E2E LangGraph Agent"
    VERSION: str = "0.1.0-foundation"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")

    # Free-Tier Multi-LLM Router Config
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    PRIMARY_MODEL: str = "llama-3.3-70b-versatile"
    FALLBACK_MODEL: str = "gemini-2.0-flash"

    # Security & Sandbox Guardrails
    MAX_HEALING_RETRIES: int = 3
    RATE_LIMIT_PER_MINUTE: int = 20
    AST_FIREWALL_ENABLED: bool = True
    SSRF_PROTECTION_ENABLED: bool = True


settings = Settings()