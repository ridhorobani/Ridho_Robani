import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HistoricalEra } from "../types";
import { History as HistoryIcon, BookOpen, Clock, Activity, CornerDownRight } from "lucide-react";
import { getTranslation, Language } from "../lib/translations";

interface HistoryViewProps {
  eras: HistoricalEra[];
  language: Language;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ eras, language }) => {
  const t = getTranslation(language);
  const [selectedEra, setSelectedEra] = useState<HistoricalEra>(eras[0]);

  return (
    <div className="space-y-8 py-8 px-4 sm:px-6 md:px-8 max-w-6xl mx-auto font-sans">
      {/* Header */}
      <div>
        <span className="text-xs font-mono tracking-wider text-zinc-500 uppercase">
          {language === "ID" ? "Kronik Waktu" : "Chronos Chronicles"}
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif text-white tracking-tight mt-1">{t.history}</h2>
      </div>

      {/* Epochs Navigation Ribbon */}
      <div className="flex flex-wrap items-center gap-2 border-b border-zinc-900 pb-4">
        {eras.map((era) => (
          <button
            key={era.id}
            onClick={() => setSelectedEra(era)}
            className={`rounded-full px-4 py-2 text-xs font-medium font-sans border transition-all duration-200 cursor-pointer ${
              selectedEra.id === era.id
                ? "border-[#D4AF37] bg-[#D4AF37]/5 text-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.05)]"
                : "border-zinc-900 bg-zinc-950/20 text-zinc-500 hover:border-zinc-800 hover:text-zinc-300"
            }`}
          >
            {era.name}
          </button>
        ))}
      </div>

      {/* Era Description Cover */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedEra.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-6"
        >
          <div className="rounded-2xl border border-zinc-900 bg-zinc-950/40 p-6 backdrop-blur-md space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-[#D4AF37]">
              <Clock className="h-4 w-4" />
              <span>{selectedEra.period}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-serif text-white tracking-tight">{selectedEra.name}</h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-3xl font-sans">
              {selectedEra.description}
            </p>
          </div>

          {/* Connected Historical Turnings Timeline */}
          <div className="space-y-6">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
              {language === "ID" ? "Pergeseran Paradigma Bersejarah" : "Historic Paradigm Shifts"}
            </span>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {selectedEra.events.map((event, idx) => (
                <div
                  key={event.id}
                  className="rounded-2xl border border-zinc-900 bg-zinc-950/20 p-5 space-y-4 relative overflow-hidden group hover:border-zinc-800 transition-all duration-200"
                >
                  {/* Subtle index backing */}
                  <span className="absolute top-2 right-4 text-3xl font-serif text-zinc-900/50 select-none pointer-events-none font-bold">
                    0{idx + 1}
                  </span>

                  <div className="space-y-1">
                    <span className="font-mono text-xs text-[#D4AF37] font-semibold">{event.year}</span>
                    <h4 className="text-sm font-bold text-white font-sans">{event.title}</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed font-sans pt-1">
                      {event.description}
                    </p>
                  </div>

                  {/* Macro Impact Summary Box */}
                  <div className="rounded-xl border border-zinc-900 bg-zinc-950 p-4 space-y-1.5 shadow-inner">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase flex items-center gap-1.5 font-semibold">
                      <CornerDownRight className="h-3.5 w-3.5 text-[#D4AF37]" /> {language === "ID" ? "Dampak Keuangan & Makro" : "Financial & Macro Impact"}
                    </span>
                    <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                      {event.impact}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
