"use client";

import React, { useEffect, useState } from "react";
import {
  ShieldCheck,
  Cpu,
  GitBranch,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Activity,
  Lock,
} from "lucide-react";

interface HealthResponse {
  status: string;
  service: string;
  version: string;
  python_version: string;
  uptime_seconds: number;
  architecture: {
    orchestrator: string;
    langgraph_ready: boolean;
    llm_router: {
      primary: string;
      secondary: string;
      offline_fallback: string;
      groq_key_configured: boolean;
      gemini_key_configured: boolean;
    };
    security_layers: {
      ast_code_firewall: boolean;
      ssrf_url_guard: boolean;
      max_self_healing_retries: number;
      rate_limit_rpm: number;
    };
    nodes_registered: string[];
  };
}

export default function SystemSetupPage() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkBackend = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/py/health", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setHealth(data);
    } catch (err: any) {
      setError(
        err.message || "Could not connect to Python FastAPI Backend on port 8000"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkBackend();
  }, []);

  return (
    <main className="max-w-6xl mx-auto px-6 py-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium mb-3">
            <Activity className="w-3.5 h-3.5" />
            Phase 1: Base Monorepo & Python FastAPI Bridge Setup
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            AegisQA — Autonomous E2E LangGraph Agent
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Decoupled Architecture: Next.js 14 UI (:3000) ↔ Python FastAPI + LangGraph Engine (:8000)
          </p>
        </div>

        <button
          onClick={checkBackend}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-medium transition"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Verify Python Bridge
        </button>
      </div>

      {/* Connection Banner */}
      {error ? (
        <div className="p-5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-4">
          <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-amber-300 font-semibold">
              Python FastAPI Backend Not Reachable Yet
            </h3>
            <p className="text-slate-300 text-sm mt-1">{error}</p>
            <p className="text-slate-400 text-xs mt-2">
              Make sure dependencies are installed and the FastAPI server is running on port 8000.
            </p>
          </div>
        </div>
      ) : health ? (
        <div className="p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <h3 className="text-emerald-300 font-semibold">
                Python FastAPI + LangGraph Backend Connected!
              </h3>
              <p className="text-slate-300 text-sm">
                Running Python {health.python_version} • Version{" "}
                <span className="font-mono text-xs bg-slate-800 px-2 py-0.5 rounded">
                  {health.version}
                </span>{" "}
                • Uptime: {health.uptime_seconds}s
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono uppercase">
            {health.status}
          </span>
        </div>
      ) : null}

      {/* System Cards Grid */}
      {health && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: LangGraph State Machine */}
          <div className="p-6 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <GitBranch className="w-5 h-5 text-indigo-400" />
                <h2 className="font-semibold text-white">LangGraph Pipeline</h2>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                Cyclic Graph
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {health.architecture.orchestrator}
            </p>
            <div className="space-y-2 pt-2">
              {health.architecture.nodes_registered.map((node, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-xs font-mono bg-slate-950/80 border border-slate-800/80 px-3 py-2 rounded-lg text-slate-300"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  {node}
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Free-Tier Multi-LLM Router */}
          <div className="p-6 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Cpu className="w-5 h-5 text-cyan-400" />
                <h2 className="font-semibold text-white">Free-Tier LLM Router</h2>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                $0 Cost Tier
              </span>
            </div>
            <div className="space-y-3 text-sm">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <div className="text-xs text-slate-400">Primary Model</div>
                <div className="font-medium text-slate-200 mt-0.5">
                  {health.architecture.llm_router.primary}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <div className="text-xs text-slate-400">Fallback Model 1</div>
                <div className="font-medium text-slate-200 mt-0.5">
                  {health.architecture.llm_router.secondary}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <div className="text-xs text-slate-400">Zero-Key Offline Mode</div>
                <div className="font-medium text-emerald-400 mt-0.5">
                  {health.architecture.llm_router.offline_fallback}
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Security & Sandbox Guardrails */}
          <div className="p-6 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h2 className="font-semibold text-white">Security Guardrails</h2>
              </div>
              <Lock className="w-4 h-4 text-slate-400" />
            </div>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-300">AST Code Execution Firewall</span>
                <span className="text-emerald-400 font-semibold">ACTIVE</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-300">SSRF Internal IP Guard</span>
                <span className="text-emerald-400 font-semibold">ACTIVE</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-300">Max Self-Healing Loops</span>
                <span className="font-mono text-indigo-300">
                  {health.architecture.security_layers.max_self_healing_retries} retries
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-300">Tenant Rate Limiter</span>
                <span className="font-mono text-indigo-300">
                  {health.architecture.security_layers.rate_limit_rpm} req/min
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}