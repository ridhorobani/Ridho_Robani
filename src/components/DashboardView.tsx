import React from "react";
import { motion } from "motion/react";
import { PersonalNote, Project, TradingJournalEntry, FinanceAsset } from "../types";
import { BookOpen, FolderKanban, TrendingUp, Calendar, AlertTriangle, Play, CircleDot, ArrowUpRight } from "lucide-react";
import { getTranslation, Language } from "../lib/translations";

interface DashboardViewProps {
  notes: PersonalNote[];
  projects: Project[];
  trades: TradingJournalEntry[];
  assets: FinanceAsset[];
  setView: (view: string) => void;
  language: Language;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  notes,
  projects,
  trades,
  assets,
  setView,
  language,
}) => {
  const t = getTranslation(language);
  // Compute Trading Summary
  const winTrades = trades.filter((t) => t.status === "WIN");
  const winRate = trades.length > 0 ? Math.round((winTrades.length / trades.length) * 100) : 0;
  const netReward = trades.reduce((acc, curr) => {
    if (curr.status === "WIN") return acc + curr.reward;
    if (curr.status === "LOSS") return acc - 1; // Risk is 1R per loss
    return acc;
  }, 0);

  // Curated News
  const news = [
    { source: "Aramco Intel", title: "OPEC+ extends voluntary cuts into Q4 to offset non-OPEC shale expansion.", time: "1h ago", impact: "HIGH" },
    { source: "Fed Watch", title: "FOMC dot plot suggests a single 25bps rate trim in late September.", time: "3h ago", impact: "HIGH" },
    { source: "TechAlpha", title: "Sub-10B parameter model matches frontier model logic in quantitative benchmarks.", time: "6h ago", impact: "MEDIUM" },
  ];

  // Economic Calendar
  const calEvents = [
    { time: "08:30 EST", cur: "USD", event: "CPI MoM (Core)", forecast: "0.2%", actual: "0.2%", priority: "HIGH" },
    { time: "10:30 EST", cur: "USD", event: "Crude Oil Inventories", forecast: "-1.2M", actual: "--", priority: "MEDIUM" },
    { time: "19:30 EST", cur: "AUD", event: "Employment Change", forecast: "25.0K", actual: "--", priority: "MEDIUM" },
  ];

  return (
    <div className="space-y-8 py-8 px-4 sm:px-6 md:px-8 max-w-6xl mx-auto font-sans">
      {/* Header and Quick Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono tracking-wider text-zinc-500 uppercase">
            {language === "ID" ? "Sistem Pusat" : "System Central"}
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-white tracking-tight mt-1">
            {language === "ID" ? "Kokpit Berdaulat" : "Sovereign Cockpit"}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex h-2 w-2 rounded-full bg-[#D4AF37]" />
          <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
            {language === "ID" ? "Tersinkronisasi (UTC-7)" : "Synchronized (UTC-7)"}
          </span>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Metrics & Heatmap & Calendar */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Metrics Widget */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl border border-zinc-900 bg-zinc-950/40 p-4 backdrop-blur-md">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">{t.trading_win_rate}</span>
              <h4 className="text-xl font-bold font-mono text-[#D4AF37] mt-1">{winRate}%</h4>
              <p className="text-[10px] text-zinc-500 mt-1">
                {language === "ID" ? `Di seluruh ${trades.length} posisi tercatat` : `Across ${trades.length} recorded positions`}
              </p>
            </div>
            <div className="rounded-xl border border-zinc-900 bg-zinc-950/40 p-4 backdrop-blur-md">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                {language === "ID" ? "Rasio RR Bersih" : "Net RR Generated"}
              </span>
              <h4 className="text-xl font-bold font-mono text-white mt-1">
                {netReward > 0 ? "+" : ""}
                {netReward.toFixed(2)} R
              </h4>
              <p className="text-[10px] text-zinc-500 mt-1">
                {language === "ID" ? "Koefisien imbal hasil portofolio" : "Portfolio yield coefficient"}
              </p>
            </div>
            <div className="rounded-xl border border-zinc-900 bg-zinc-950/40 p-4 backdrop-blur-md">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">{t.active_projects}</span>
              <h4 className="text-xl font-bold font-mono text-white mt-1">
                {projects.filter((p) => p.status === "Active").length} / {projects.length}
              </h4>
              <p className="text-[10px] text-zinc-500 mt-1">
                {language === "ID" ? "Dalam fase akselerasi aktif" : "In active acceleration phase"}
              </p>
            </div>
          </div>

          {/* Market Heatmap */}
          <div className="rounded-2xl border border-zinc-900 bg-zinc-950/60 p-5 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono tracking-widest text-zinc-500 uppercase">
                {language === "ID" ? "Peta Panas Pasar Relatif" : "Relative Market Heatmap"}
              </h3>
              <span className="text-[9px] font-mono text-[#D4AF37]">
                {language === "ID" ? "Pengurutan Dinamis" : "Dynamic Sorting"}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {assets.map((asset) => (
                <div
                  key={asset.id}
                  onClick={() => setView("finance")}
                  className={`cursor-pointer rounded-xl border border-zinc-900 p-3 flex flex-col justify-between transition-all duration-150 hover:bg-zinc-900/30 ${
                    asset.isUp ? "bg-emerald-950/10 border-emerald-950" : "bg-red-950/10 border-red-950"
                  }`}
                >
                  <span className="text-[9px] font-mono text-zinc-500">{asset.symbol}</span>
                  <div className="mt-3">
                    <span className="text-xs font-semibold font-mono text-white">${parseFloat(asset.price).toLocaleString()}</span>
                    <span className={`block text-[9px] font-mono mt-0.5 ${asset.isUp ? "text-emerald-500" : "text-red-500"}`}>
                      {asset.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Economic Calendar */}
          <div className="rounded-2xl border border-zinc-900 bg-zinc-950/60 p-5 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono tracking-widest text-zinc-500 uppercase flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-[#D4AF37]" /> {language === "ID" ? "Agenda Ekonomi (Hari Ini)" : "Economic Agenda (Today)"}
              </h3>
              <span className="text-[9px] font-mono text-zinc-500">
                {language === "ID" ? "Sumber: ROBANI Oracle" : "Source: ROBANI Oracle"}
              </span>
            </div>

            <div className="space-y-2">
              {calEvents.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl border border-zinc-900 bg-zinc-950/20 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-zinc-500 w-16">{item.time}</span>
                    <span className="rounded bg-zinc-900 border border-zinc-800 px-1 text-[9px] font-mono text-zinc-400">
                      {item.cur}
                    </span>
                    <span className="font-medium text-white">{item.event}</span>
                  </div>
                  <div className="flex items-center gap-4 font-mono text-zinc-400">
                    <div>
                      <span className="text-[10px] text-zinc-600 block text-right">
                        {language === "ID" ? "Proyeksi" : "Forecast"}
                      </span>
                      <span>{item.forecast}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-600 block text-right">
                        {language === "ID" ? "Aktual" : "Actual"}
                      </span>
                      <span className={item.actual !== "--" ? "text-emerald-500" : ""}>{item.actual}</span>
                    </div>
                    <span className={`h-1.5 w-1.5 rounded-full ${item.priority === "HIGH" ? "bg-red-500" : "bg-amber-500"}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: News Feed & Recent Notes */}
        <div className="space-y-6">
          {/* Quick News Intelligence */}
          <div className="rounded-2xl border border-zinc-900 bg-zinc-950/60 p-5 backdrop-blur-md space-y-4">
            <h3 className="text-xs font-mono tracking-widest text-zinc-500 uppercase flex items-center gap-2">
              <AlertTriangle className="h-3.5 w-3.5 text-[#D4AF37]" /> {language === "ID" ? "Intel Kilat" : "Flash Intelligence"}
            </h3>

            <div className="space-y-3">
              {news.map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl border border-zinc-900 bg-zinc-950/10 space-y-1.5">
                  <div className="flex items-center justify-between text-[9px] font-mono">
                    <span className="text-[#D4AF37]">{item.source}</span>
                    <span className="text-zinc-500">{item.time}</span>
                  </div>
                  <h4 className="text-xs text-white leading-relaxed font-sans">{item.title}</h4>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Notes Notebook */}
          <div className="rounded-2xl border border-zinc-900 bg-zinc-950/60 p-5 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono tracking-widest text-zinc-500 uppercase flex items-center gap-2">
                <BookOpen className="h-3.5 w-3.5 text-[#D4AF37]" /> {language === "ID" ? "Buku Catatan Otak Aktif" : "Active Brain Notebooks"}
              </h3>
              <button
                onClick={() => setView("knowledge")}
                className="text-[10px] text-[#D4AF37] hover:underline flex items-center gap-1 cursor-pointer"
              >
                {language === "ID" ? "Semua" : "All"} <ArrowUpRight className="h-3 w-3" />
              </button>
            </div>

            <div className="space-y-2">
              {notes.slice(0, 3).map((note) => (
                <div
                  key={note.id}
                  onClick={() => setView("knowledge")}
                  className="cursor-pointer group flex items-start justify-between p-3 rounded-xl border border-zinc-900 bg-zinc-950/20 transition-all hover:bg-zinc-900/30"
                >
                  <div className="space-y-1">
                    <span className="text-[8px] font-mono uppercase text-zinc-500 tracking-wider">
                      {note.category}
                    </span>
                    <h4 className="text-xs font-medium text-white group-hover:text-[#D4AF37] transition-colors leading-snug">
                      {note.title}
                    </h4>
                  </div>
                  <span className="text-[9px] font-mono text-zinc-600 shrink-0 ml-2">{note.date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick AI Trigger */}
          <div
            onClick={() => setView("ailab")}
            className="cursor-pointer group rounded-2xl border border-zinc-900 bg-gradient-to-br from-zinc-950 to-zinc-900 p-5 shadow-[0_0_20px_rgba(212,175,55,0.05)] transition-all hover:border-zinc-800"
          >
            <div className="flex items-center gap-2">
              <CircleDot className="h-4 w-4 text-[#D4AF37]" />
              <span className="text-xs font-mono tracking-widest text-zinc-400 uppercase">
                {language === "ID" ? "Konsultasikan dengan Oracle AI" : "Consult the AI Oracle"}
              </span>
            </div>
            <h4 className="text-sm font-semibold text-white mt-3 group-hover:text-[#D4AF37] transition-colors">
              {language === "ID" ? "Kueri Kecerdasan Gabungan Anda →" : "Query Your Combined Intelligence →"}
            </h4>
            <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed font-sans">
              {language === "ID" 
                ? "Gunakan LLM untuk menganalisis catatan, log sejarah, dan metrik trading Anda dengan masukan satu kalimat."
                : "Deploy LLMs over your notes, history logs, and trade metrics with single-sentence inputs."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
