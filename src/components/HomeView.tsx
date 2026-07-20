import React from "react";
import { motion } from "motion/react";
import { Sparkline } from "./InteractiveCharts";
import { FinanceAsset, Project, PersonalNote } from "../types";
import { Compass, ShieldAlert, Cpu, ArrowUpRight, TrendingUp, Briefcase, FileText } from "lucide-react";
import { getTranslation, Language } from "../lib/translations";

interface HomeViewProps {
  assets: FinanceAsset[];
  projects: Project[];
  notes: PersonalNote[];
  setView: (view: string) => void;
  language: Language;
}

export const HomeView: React.FC<HomeViewProps> = ({ assets, projects, notes, setView, language }) => {
  const t = getTranslation(language);

  // Stat values
  const stats = [
    { label: t.assets_custody, value: "$384,200", change: "+14.8%", icon: TrendingUp },
    { label: t.active_projects, value: `${projects.length} Repos`, change: "Stable", icon: Briefcase },
    { label: t.brain_notes, value: `${notes.length} ${language === "ID" ? "Dokumen" : "Documents"}`, change: "Active", icon: FileText },
    { label: t.ai_queries, value: "1,240 Units", change: "24h Online", icon: Cpu },
  ];

  return (
    <div className="space-y-20 py-12 px-4 sm:px-6 md:px-8 max-w-6xl mx-auto font-sans">
      {/* Premium Hero Section */}
      <section className="text-center space-y-6 pt-16">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-2 rounded-full border border-zinc-900 bg-zinc-950/80 px-3.5 py-1.5 text-[10px] font-mono tracking-wider text-zinc-400 uppercase"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
          {t.unified_platform}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
          className="text-5xl sm:text-7xl md:text-[84px] font-display font-extrabold tracking-tighter text-white uppercase leading-[0.85]"
        >
          {t.synthesize} <br className="hidden sm:inline" />
          <span className="font-serif italic font-normal text-[#D4AF37] lowercase">{t.reality}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="max-w-xl mx-auto text-sm sm:text-base text-zinc-400 font-sans leading-relaxed tracking-wide"
        >
          {t.home_p}
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-4 pt-4"
        >
          <button
            onClick={() => setView("dashboard")}
            className="rounded-full bg-gradient-to-r from-amber-500 to-[#D4AF37] px-6 py-2.5 text-xs font-semibold text-black hover:opacity-90 shadow-[0_0_20px_rgba(212,175,55,0.2)] transition-all cursor-pointer"
          >
            {t.enter_dashboard}
          </button>
          <button
            onClick={() => setView("ailab")}
            className="rounded-full border border-zinc-800 bg-zinc-950/50 px-6 py-2.5 text-xs font-semibold text-zinc-300 hover:bg-zinc-900 hover:text-white transition-all cursor-pointer"
          >
            {t.access_ai}
          </button>
        </motion.div>
      </section>

      {/* Market Overview Ticker */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-mono tracking-widest text-zinc-500 uppercase">{t.live_markets}</h2>
          <button 
            onClick={() => setView("finance")}
            className="flex items-center gap-1 text-xs text-[#D4AF37] hover:underline cursor-pointer"
          >
            {t.expand_markets} <ArrowUpRight className="h-3 w-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {assets.slice(0, 3).map((asset) => (
            <motion.div
              key={asset.id}
              whileHover={{ y: -3 }}
              className="flex items-center justify-between rounded-2xl border border-zinc-900 bg-zinc-950/40 p-4 backdrop-blur-md"
            >
              <div>
                <span className="text-[10px] font-mono text-zinc-500 tracking-wider">{asset.symbol}</span>
                <h4 className="text-sm font-semibold text-white mt-0.5">{asset.name}</h4>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm font-mono text-zinc-300 font-semibold">${parseFloat(asset.price).toLocaleString()}</span>
                  <span className={`text-[10px] font-mono ${asset.isUp ? "text-emerald-500" : "text-red-500"}`}>
                    {asset.change}
                  </span>
                </div>
              </div>
              <div className="shrink-0">
                <Sparkline
                  data={asset.id === "gold" ? [2390, 2385, 2400, 2395, 2412] : asset.id === "bitcoin" ? [65000, 64200, 66100, 65900, 67450] : [3550, 3500, 3580, 3510, 3520]}
                  isUp={asset.isUp}
                  width={100}
                  height={36}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Beautiful Stat Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="rounded-2xl border border-zinc-900 bg-zinc-950/60 p-5 backdrop-blur-md flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <span className="text-xs font-mono text-zinc-500 tracking-wider uppercase">
                  {stat.label}
                </span>
                <Icon className="h-4 w-4 text-[#D4AF37]/80" />
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <h4 className="text-lg font-medium text-white tracking-tight font-mono">
                  {stat.value}
                </h4>
                <span className="text-[10px] font-mono text-[#D4AF37]">
                  {stat.change}
                </span>
              </div>
            </div>
          );
        })}
      </section>

      {/* Grid of Featured Projects and Notes */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Featured Projects */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-mono tracking-widest text-zinc-500 uppercase">{t.featured_projects}</h3>
            <button
              onClick={() => setView("projects")}
              className="flex items-center gap-1 text-xs text-[#D4AF37] hover:underline cursor-pointer"
            >
              {t.see_portfolio} <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>

          <div className="space-y-4">
            {projects.slice(0, 2).map((proj) => (
              <div
                key={proj.id}
                className="group relative overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-950/50 p-5 backdrop-blur-md transition-all hover:border-zinc-800"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-amber-500/80 bg-amber-500/5 border border-amber-500/10 px-2 py-0.5 rounded">
                      {proj.type}
                    </span>
                    <h4 className="text-base font-semibold text-white mt-2 group-hover:text-[#D4AF37] transition-colors">
                      {proj.name}
                    </h4>
                    <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                      {proj.description}
                    </p>
                  </div>
                  <span className="text-xs font-mono text-zinc-500">{proj.progress}%</span>
                </div>
                <div className="mt-4 h-[1px] w-full bg-zinc-900" />
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {proj.techStack.slice(0, 3).map((tech, idx) => (
                    <span key={idx} className="rounded-full bg-zinc-900/50 px-2 py-0.5 text-[9px] font-mono text-zinc-500 border border-zinc-950">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Latest Knowledge Entries */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-mono tracking-widest text-zinc-500 uppercase">{t.research_intel}</h3>
            <button
              onClick={() => setView("knowledge")}
              className="flex items-center gap-1 text-xs text-[#D4AF37] hover:underline cursor-pointer"
            >
              {t.explore_notes} <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>

          <div className="space-y-4">
            {notes.slice(0, 2).map((note) => (
              <div
                key={note.id}
                className="group rounded-2xl border border-zinc-900 bg-zinc-950/50 p-5 backdrop-blur-md transition-all hover:border-zinc-800"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono tracking-wider text-zinc-500 uppercase">
                    {note.category}
                  </span>
                  <span className="text-[9px] font-mono text-zinc-500">{note.date}</span>
                </div>
                <h4 className="text-sm font-semibold text-white mt-2 group-hover:text-[#D4AF37] transition-colors leading-snug">
                  {note.title}
                </h4>
                <p className="text-xs text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
                  {note.content.replace(/[#*`]/g, "")}
                </p>
                <div className="mt-3 flex gap-1">
                  {note.tags.slice(0, 2).map((tag, idx) => (
                    <span key={idx} className="rounded text-[9px] font-mono text-amber-500/80 bg-amber-500/3 px-1.5 py-0.5 border border-amber-500/5">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modern Core Value Block */}
      <section className="rounded-3xl border border-zinc-900 bg-gradient-to-b from-zinc-950 to-black p-8 sm:p-12 text-center space-y-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent" />
        <h3 className="text-lg sm:text-2xl font-serif text-white tracking-wide">
          "{t.quote}"
        </h3>
        <p className="max-w-md mx-auto text-xs text-zinc-500 font-mono tracking-widest uppercase">
          {t.robani_core_systems}
        </p>
      </section>
    </div>
  );
};
