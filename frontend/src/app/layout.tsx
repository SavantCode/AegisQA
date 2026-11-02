import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AegisQA | Autonomous E2E LangGraph Agent",
  description: "Autonomous E2E Test Generation & Self-Healing Agent powered by Python, FastAPI & LangGraph",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#090d16] text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}