import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Cpu, Send, Sparkles, Terminal, BookOpen, AlertCircle, RefreshCw } from "lucide-react";
import { getTranslation, Language } from "../lib/translations";

interface Message {
  role: "user" | "assistant";
  text: string;
}

interface AILabViewProps {
  notesText: string;
  tradeStatsText: string;
  language: Language;
}

export const AILabView: React.FC<AILabViewProps> = ({ notesText, tradeStatsText, language }) => {
  const t = getTranslation(language);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        text: language === "ID" 
          ? "Selamat datang di Laboratorium AI ROBANI. Saya adalah co-pilot kognitif berdaulat Anda. Saya memiliki akses tersinkronisasi ke database Second Brain Anda, termasuk catatan penelitian terbaru dan catatan eksekusi. Bagaimana saya bisa membantu intelektual Anda hari ini?"
          : "Welcome to the ROBANI AI Laboratory. I am your sovereign cognitive co-pilot. I have synchronized access to your Second Brain databases, including recent research notes and execution records. How shall I assist your intellect today?",
      }
    ]);
  }, [language]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [persona, setPersona] = useState<"economist" | "risk" | "geopolitics" | "architect" >("economist");

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const personas = {
    economist: {
      name: language === "ID" ? "Ekonom Makro" : "Macro Economist",
      instruction: `You are the chief sovereign Macro Economist for ROBANI Second Brain. Answer questions by integrating classical monetary mechanics, gold-reserve dynamics, fractional reserve banking, and liquidity cycles. Refer occasionally to user notes if relevant: ${notesText}. Keep advice exceptionally precise and structured.`,
      quickPrompt: language === "ID" ? "Dekonstruksi tren akumulasi emas berdaulat vs imbal hasil obligasi." : "Deconstruct the sovereign gold accumulation trend vs treasury yields."
    },
    risk: {
      name: language === "ID" ? "Analis Risiko Trading" : "Trading Risk Analyst",
      instruction: `You are the head Trading Risk Analyst for ROBANI. Evaluate trade biases, stop placement, liquidity sweeps, and capital preservation. Reference the user's trading journal statistics if relevant: ${tradeStatsText}. Champion Half-Kelly risk management strictly.`,
      quickPrompt: language === "ID" ? "Sintesis batasan risiko untuk trading pengumuman CPI bergejolak tinggi." : "Synthesize risk guardrails for trading high-volatility CPI announcements."
    },
    geopolitics: {
      name: language === "ID" ? "Petugas Dokumen Intelijen" : "Intelligence Dossier Officer",
      instruction: "You are an elite Sovereign Intelligence Dossier Officer. Analyze geopolitical movements, rare mineral monopolies (Rare Earths, Cobalt, Petroleum), trade blockades, and international treaty dynamics through the lens of pure sovereign self-interest and supply-chain stability.",
      quickPrompt: language === "ID" ? "Analisis dominasi pemurnian logam jarang Tiongkok vs mitigasi rantai pasok NATO." : "Analyze China's rare earth refining dominance vs NATO supply chain mitigation."
    },
    architect: {
      name: language === "ID" ? "Arsitek Sistem" : "Systems Architect",
      instruction: "You are the lead Systems Architect for ROBANI. Guide software engineering decisions, database configurations, vector embedding pipelines, micro-frontends, and premium minimalist visual systems.",
      quickPrompt: language === "ID" ? "Garis bawahi pipa database vektor untuk mencocokkan pelajaran trading dengan sejarah." : "Outline a vector database pipeline to cross-reference trading lessons with history."
    }
  };

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    if (!textToSend) setInput("");

    // Add user message
    const userMsg: Message = { role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          systemInstruction: personas[persona].instruction,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessages((prev) => [...prev, { role: "assistant", text: data.text || "Diagnostic failed to output text." }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", text: `Error: ${data.error || "The AI model encountered a secure gateway failure."}` },
        ]);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: `Failure: Critical network exception. Ensure the Express API proxy is online.` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 py-8 px-4 sm:px-6 md:px-8 max-w-6xl mx-auto font-sans h-[calc(100vh-140px)] flex flex-col justify-between">
      {/* Header & Persona Selector */}
      <div className="shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono tracking-wider text-zinc-500 uppercase">
            {language === "ID" ? "Sandbox AI" : "AI Sandbox"}
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-white tracking-tight mt-1">{t.ailab}</h2>
        </div>

        {/* Persona Pill Selectors */}
        <div className="flex flex-wrap gap-1 rounded-xl border border-zinc-900 bg-zinc-950 p-0.5 text-[10px] font-mono">
          {(Object.keys(personas) as Array<keyof typeof personas>).map((key) => (
            <button
              key={key}
              onClick={() => setPersona(key)}
              className={`rounded-lg px-2.5 py-1.5 transition-all cursor-pointer font-semibold ${
                persona === key
                  ? "bg-[#D4AF37] text-black"
                  : "text-zinc-500 hover:text-white"
              }`}
            >
              {personas[key].name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Terminal Frame */}
      <div className="flex-1 min-h-0 rounded-2xl border border-zinc-900 bg-black/40 flex flex-col overflow-hidden relative">
        {/* Terminal Header */}
        <div className="shrink-0 border-b border-zinc-950 bg-zinc-950/60 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <Terminal className="h-4 w-4 text-[#D4AF37]" />
            <span>ROBANI-AI-CORE // SECURE_SHELL // active_persona: {persona}</span>
          </div>
          <div className="flex gap-1">
            <span className="h-2 w-2 rounded-full bg-red-500/40" />
            <span className="h-2 w-2 rounded-full bg-amber-500/40" />
            <span className="h-2 w-2 rounded-full bg-emerald-500/40 animate-pulse" />
          </div>
        </div>

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 max-w-4xl ${
                msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
              }`}
            >
              {/* Profile Orb */}
              <div className={`h-8 w-8 rounded-full border shrink-0 flex items-center justify-center text-xs font-mono font-bold ${
                msg.role === "user"
                  ? "border-zinc-800 bg-zinc-900 text-white"
                  : "border-[#D4AF37]/30 bg-black shadow-[0_0_10px_rgba(212,175,55,0.1)] text-[#D4AF37]"
              }`}>
                {msg.role === "user" ? "U" : "R"}
              </div>

              {/* Text Bubble */}
              <div className={`rounded-2xl px-4 py-3 text-xs leading-relaxed font-sans max-w-[85%] ${
                msg.role === "user"
                  ? "bg-zinc-900 text-zinc-100"
                  : "bg-zinc-950/40 text-zinc-300 border border-zinc-950"
              }`}>
                <div className="prose prose-invert prose-xs max-w-none">
                  {msg.text.split("\n").map((line, idx) => (
                    <p key={idx} className={idx > 0 ? "mt-2" : ""}>
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* Loading bubble */}
          {loading && (
            <div className="flex gap-3 mr-auto items-center">
              <div className="h-8 w-8 rounded-full border border-[#D4AF37]/30 bg-black flex items-center justify-center text-xs font-mono text-[#D4AF37]">
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              </div>
              <div className="rounded-2xl bg-zinc-950/40 px-4 py-3 text-xs font-mono text-zinc-500 border border-zinc-950 animate-pulse">
                {language === "ID" ? "ROBANI Core memproses vektor kognitif..." : "ROBANI Core processing vectors..."}
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Prompt Suggestions Footer */}
        <div className="shrink-0 px-4 py-2 bg-zinc-950/30 border-t border-zinc-950 flex flex-wrap gap-2">
          <span className="text-[9px] font-mono text-zinc-600 self-center uppercase tracking-wider">
            {language === "ID" ? "Mulai Cepat:" : "Quickstart:"}
          </span>
          <button
            onClick={() => handleSend(personas[persona].quickPrompt)}
            className="rounded border border-zinc-900 hover:border-zinc-800 bg-zinc-950/80 px-2.5 py-1 text-[10px] text-zinc-400 font-mono transition-all text-left cursor-pointer"
          >
            {personas[persona].quickPrompt}
          </button>
        </div>
      </div>

      {/* Input box */}
      <div className="shrink-0 flex items-center gap-2">
        <div className="flex-1 flex items-center gap-3 border border-zinc-900 bg-zinc-950 rounded-full px-4 py-3">
          <Cpu className="h-4 w-4 text-zinc-500" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={language === "ID" ? `Tanya co-pilot ${personas[persona].name} Anda...` : `Ask your ${personas[persona].name} co-pilot...`}
            className="w-full bg-transparent text-xs text-white placeholder-zinc-500 outline-none"
          />
        </div>
        <button
          onClick={() => handleSend()}
          disabled={loading || !input.trim()}
          className="rounded-full h-11 w-11 bg-gradient-to-r from-amber-500 to-[#D4AF37] flex items-center justify-center text-black shadow-lg hover:opacity-90 disabled:opacity-40 transition-all cursor-pointer"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
