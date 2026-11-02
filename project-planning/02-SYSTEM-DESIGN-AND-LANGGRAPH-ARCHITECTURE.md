# 02. System Design & Python LangGraph Multi-Agent Architecture

## 1. High-Level Decoupled Architecture

We use a decoupled **Next.js 14 Frontend (:3005)** + **Python FastAPI & LangGraph Backend (:8000)** architecture.

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                    FRONTEND: Next.js 14 (Port 3005)                     │
│  • Live LangGraph Node Visualizer (Real-time Server-Sent Events / Poll) │
│  • Interactive "Target App Sandbox" (Simulate real UI breaking changes) │
│  • Self-Healing Diff Viewer (Initial Spec vs. Self-Healed Spec)         │
│  • Security Audit Log & Free-Tier BYOK API Key Manager                  │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │  HTTP REST / SSE (/api/py/* rewrite)
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│             AI AGENT BACKEND: Python FastAPI (Port 8000)                │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ Layer 1: Security & Tenant Guardrails                             │  │
│  │ • Sliding-Window Rate Limiter (Per-IP / Per-Tenant)               │  │
│  │ • Prompt Injection Sanitizer (Strips malicious repo comments)     │  │
│  │ • SSRF URL Validator (Blocks private cloud metadata IPs)          │  │
│  │ • Python AST Code Firewall (Blocks os/subprocess/fs in specs)     │  │
│  └───────────────────────────────┬───────────────────────────────────┘  │
│                                  ▼                                      │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ Layer 2: Free-Tier Multi-LLM Router (`llm_router.py`)             │  │
│  │ • Tier 1: Groq Cloud Free API (`llama-3.3-70b-versatile`)         │  │
│  │ • Tier 2: Google Gemini Free API (`gemini-2.0-flash`)             │  │
│  │ • Tier 3: Zero-Key Deterministic AST Synthesizer (Offline Ready)  │  │
│  └───────────────────────────────┬───────────────────────────────────┘  │
│                                  ▼                                      │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ Layer 3: LangGraph Cyclic State Machine (`graph.py`)              │  │
│  │                                                                   │  │
│  │  [1. AST Code Ingestor] ──► [2. QA Test Planner]                  │  │
│  │                                      │                            │  │
│  │                                      ▼                            │  │
│  │                             [3. Playwright Coder]                 │  │
│  │                                      │                            │  │
│  │                                      ▼                            │  │
│  │                             [4. Sandbox Runner]                   │  │
│  │                                  /        \                       │  │
│  │                             (PASS)       (FAIL + DOM Snapshot)    │  │
│  │                              /                \                   │  │
│  │                             ▼                  ▼                  │  │
│  │                 [6. PR Publisher]    [5. Self-Healing Critic]     │  │
│  │                                                │                  │  │
│  │                                                └──► (Loops to 4,  │  │
│  │                                                     Max 3 Retries)│  │
│  └───────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Centralized LangGraph State Schema (`TestGenerationState`)

In LangGraph, all agent nodes read from and write to a strictly typed state dictionary:

```python
from typing import TypedDict, List, Dict, Any, Optional

class TestGenerationState(TypedDict):
    run_id: str
    component_name: str
    source_code: str                  # Raw React/Next.js component or PR diff
    target_url: str                   # Target app URL or sandbox mode
    ui_mutation_mode: str             # "none" | "selector_renamed" | "slow_modal" | "broken_submit"
    
    # Node 1 Output: AST Ingestor
    ast_metadata: Dict[str, Any]      # Extracted buttons, inputs, roles, testids, forms
    
    # Node 2 Output: Planner Agent
    test_plan: List[Dict[str, Any]]   # Structured JSON list of test scenarios & assertions
    
    # Node 3 Output: Test Coder Agent
    initial_test_code: str            # First-pass Playwright .spec.ts code
    current_test_code: str            # Active Playwright .spec.ts code (updated by healer)
    security_scan_passed: bool        # Verified by AST Code Firewall
    security_violations: List[str]
    
    # Node 4 Output: Sandbox Runner Agent
    execution_passed: bool
    execution_logs: List[str]
    failure_error: Optional[str]      # e.g., TimeoutError: locator('#checkout-btn') not found
    live_dom_snapshot: str            # Captured HTML DOM at moment of test failure
    
    # Node 5 Output: Self-Healing Critic Agent
    retry_count: int                  # Current healing iteration (Max 3)
    max_retries: int
    healing_history: List[Dict[str, Any]]  # Diffs, root cause diagnosis, patched locators
    
    # Node 6 Output: PR Creator Agent
    pr_payload: Dict[str, Any]        # Formatted commit, branch name, PR title & body
    timeline_events: List[Dict[str, Any]]  # Step-by-step audit trail for UI visualization
```

---

## 3. Detailed Breakdown of the 6 LangGraph Nodes

### Node 1: `ast_ingestor_node` (Zero-Token Static Code Parser)
- **Responsibility:** Parses the React/Next.js/HTML source code before calling any LLM.
- **What it extracts:**
  - Interactive elements (`<button>`, `<input>`, `<form>`, `<select>`, `<a>`).
  - Resilient attributes (`data-testid`, `aria-label`, `role`, `id`, `name`, `placeholder`).
  - Event handlers (`onClick`, `onSubmit`, `onChange`) and validation rules (`required`, `type="email"`).
- **Why this matters for Free-Tier:** Reduces prompt token size by ~70% and prevents the LLM from hallucinating selectors that don't exist in the source code.

### Node 2: `planner_node` (QA Architect Persona)
- **Responsibility:** Consumes the `ast_metadata` and component source to produce a structured JSON Test Matrix.
- **Test Categories Generated:**
  1. Initial component render & visibility verification.
  2. Form validation & negative edge cases (e.g., submitting empty required fields).
  3. Primary happy-path user interaction & expected state transition (e.g., toast/modal confirmation).

### Node 3: `playwright_coder_node` (Senior Automation Engineer Persona)
- **Responsibility:** Translates the JSON Test Matrix into a complete `@playwright/test` TypeScript file.
- **Security Gate:** Immediately runs the generated code through `security/firewall.py` to guarantee no `child_process`, `fs`, `eval`, or unauthorized network calls exist.

### Node 4: `sandbox_runner_node` (Isolated QA Execution Engine)
- **Responsibility:** Runs the Playwright test suite against the target environment or built-in interactive DOM sandbox.
- **On Pass:** Transitions graph edge directly to `github_pr_publisher_node`.
- **On Fail:** Captures the exact Playwright error stack trace (`Locator('#submit-btn') resolved to 0 elements`) **and** serializes a clean snapshot of the live DOM, then routes the conditional edge to `self_healing_critic_node`.

### Node 5: `self_healing_critic_node` (The Self-Healer)
- **Responsibility:** Compares the failed test locator against the live DOM snapshot.
- **Example Reasoning:**
  - *Failed Locator:* `page.locator('#checkout-submit-btn')`
  - *Live DOM Snapshot:* `<button data-testid="pay-now-primary-cta" aria-label="Complete Purchase">Pay Now</button>`
  - *Action:* Rewrites the broken locator to `page.getByTestId('pay-now-primary-cta')`, increments `retry_count`, records the diff in `healing_history`, and loops back to `sandbox_runner_node`.
- **Circuit Breaker:** If `retry_count >= 3` and the test still fails (indicating a genuine application bug rather than a broken selector), the loop terminates and flags a **Real Application Bug Report**.

### Node 6: `github_pr_publisher_node` (DevOps Bot Persona)
- **Responsibility:** Packages the verified, passing `.spec.ts` file, generates a summary of all tests and self-healing patches applied, and prepares (or submits via GitHub REST API) a Pull Request.