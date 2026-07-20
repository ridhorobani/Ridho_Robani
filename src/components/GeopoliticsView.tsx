import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { GeopoliticalCountry } from "../types";
import { ShieldAlert, Globe, Coins, ShieldCheck, Landmark, Anchor, Link2, TrendingUp, CalendarDays } from "lucide-react";
import { getTranslation, Language } from "../lib/translations";

interface GeopoliticsViewProps {
  countries: GeopoliticalCountry[];
  language: Language;
}

export const GeopoliticsView: React.FC<GeopoliticsViewProps> = ({ countries, language }) => {
  const t = getTranslation(language);
  const [selectedCountry, setSelectedCountry] = useState<GeopoliticalCountry>(countries[0]);

  return (
    <div className="space-y-8 py-8 px-4 sm:px-6 md:px-8 max-w-6xl mx-auto font-sans">
      {/* Header */}
      <div>
        <span className="text-xs font-mono tracking-wider text-zinc-500 uppercase">
          {language === "ID" ? "Dokumen Global" : "Global Dossiers"}
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif text-white tracking-tight mt-1">{t.geopolitics}</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Country Selector Menu */}
        <div className="flex flex-col gap-2 lg:col-span-1">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider px-2">
            {language === "ID" ? "Target Intelijen" : "Intelligence Targets"}
          </span>
          {countries.map((country) => (
            <button
              key={country.id}
              onClick={() => setSelectedCountry(country)}
              className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-all duration-200 cursor-pointer ${
                selectedCountry.id === country.id
                  ? "border-[#D4AF37] bg-[#D4AF37]/5 text-[#D4AF37]"
                  : "border-zinc-900 bg-zinc-950/30 text-zinc-400 hover:border-zinc-800 hover:text-white"
              }`}
            >
              <span className="text-xl shrink-0">{country.flag}</span>
              <div>
                <span className="text-xs font-semibold block">{country.name}</span>
                <span className="text-[9px] font-mono text-zinc-500 block">{country.region}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Intelligence Briefing Dossier */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCountry.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Dossier Cover */}
              <div className="rounded-2xl border border-zinc-900 bg-zinc-950/50 p-6 backdrop-blur-md flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{selectedCountry.flag}</span>
                  <div>
                    <span className="text-[10px] font-mono text-zinc-500 tracking-widest uppercase">
                      {language === "ID" ? "TAKlimat BERDAULAT" : "SOVEREIGN BRIEFING"}
                    </span>
                    <h3 className="text-2xl font-serif text-white mt-0.5">
                      {language === "ID" ? `Dokumen ${selectedCountry.name}` : `${selectedCountry.name} Dossier`}
                    </h3>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[9px] font-mono tracking-widest text-[#D4AF37] border border-[#D4AF37]/20 bg-[#D4AF37]/5 rounded px-2.5 py-1 uppercase">
                    {language === "ID" ? "Izin Keamanan Tingkat 1" : "Level 1 Security Clear"}
                  </span>
                </div>
              </div>

              {/* Dossier Grid Layout */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Summary Box */}
                <div className="md:col-span-2 space-y-6">
                  {/* General History & Political System */}
                  <div className="rounded-2xl border border-zinc-900 bg-zinc-950/30 p-5 space-y-4">
                    <h4 className="text-xs font-mono tracking-widest text-zinc-500 uppercase flex items-center gap-2">
                      <Landmark className="h-4 w-4 text-[#D4AF37]" /> {language === "ID" ? "Fondasi Sejarah & Kedaulatan" : "Historical Foundation & Sovereignty"}
                    </h4>
                    <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                      {selectedCountry.history}
                    </p>
                    <div className="pt-3 border-t border-zinc-950 flex flex-col sm:flex-row justify-between text-xs gap-3">
                      <div>
                        <span className="font-mono text-zinc-500 block">{language === "ID" ? "Sistem Politik" : "Political System"}</span>
                        <span className="text-white font-medium">{selectedCountry.politicalSystem}</span>
                      </div>
                      <div>
                        <span className="font-mono text-zinc-500 block">{language === "ID" ? "Mata Uang Aktif" : "Active Currency"}</span>
                        <span className="text-white font-mono font-medium">{selectedCountry.currency}</span>
                      </div>
                    </div>
                  </div>

                  {/* Economy & Trade Matrix */}
                  <div className="rounded-2xl border border-zinc-900 bg-zinc-950/30 p-5 space-y-4">
                    <h4 className="text-xs font-mono tracking-widest text-zinc-500 uppercase flex items-center gap-2">
                      <Coins className="h-4 w-4 text-[#D4AF37]" /> {language === "ID" ? "Struktur Industri & Makroekonomi" : "Industrial & Macroeconomic Structure"}
                    </h4>
                    <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                      {selectedCountry.economy}
                    </p>
                    <div className="pt-3 border-t border-zinc-950">
                      <span className="font-mono text-zinc-500 text-xs block mb-1.5">{language === "ID" ? "Profil Arus Perdagangan" : "Trade Flow profile"}</span>
                      <p className="text-xs text-zinc-400 leading-relaxed font-sans">{selectedCountry.trade}</p>
                    </div>
                  </div>
                </div>

                {/* Right Side: Resources, Alliance, Impact */}
                <div className="space-y-6">
                  {/* Strategic Resources */}
                  <div className="rounded-2xl border border-zinc-900 bg-zinc-950/30 p-5 space-y-3">
                    <h4 className="text-xs font-mono tracking-widest text-zinc-500 uppercase flex items-center gap-2">
                      <Anchor className="h-4 w-4 text-[#D4AF37]" /> {language === "ID" ? "Cadangan Strategis" : "Strategic Reserves"}
                    </h4>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {selectedCountry.naturalResources.map((res, i) => (
                        <span key={i} className="rounded-lg bg-zinc-900 border border-zinc-800 px-2.5 py-1 text-[10px] font-mono text-zinc-300">
                          {res}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Military Capability */}
                  <div className="rounded-2xl border border-zinc-900 bg-zinc-950/30 p-5 space-y-3">
                    <h4 className="text-xs font-mono tracking-widest text-zinc-500 uppercase flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-[#D4AF37]" /> {language === "ID" ? "Status Militer & Pertahanan" : "Military & Defense Status"}
                    </h4>
                    <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                      {selectedCountry.military}
                    </p>
                  </div>

                  {/* Global Market Impact */}
                  <div className="rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/3 p-5 space-y-3 shadow-[inset_0_0_20px_rgba(212,175,55,0.01)]">
                    <h4 className="text-xs font-mono tracking-widest text-[#D4AF37] uppercase flex items-center gap-2 font-semibold">
                      <TrendingUp className="h-4 w-4" /> {language === "ID" ? "Dampak Keuangan Global" : "Global Financial Impact"}
                    </h4>
                    <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                      {selectedCountry.marketImpact}
                    </p>
                  </div>
                </div>
              </div>

              {/* Connected Timeline section */}
              <div className="rounded-2xl border border-zinc-900 bg-zinc-950/40 p-6 space-y-6">
                <h4 className="text-xs font-mono tracking-widest text-zinc-500 uppercase flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-[#D4AF37]" /> {language === "ID" ? "Tonggak Sejarah Berdaulat" : "Sovereign Historical Milestones"}
                </h4>

                <div className="relative border-l border-zinc-900 pl-6 ml-2 space-y-6">
                  {selectedCountry.timeline.map((event, i) => (
                    <div key={i} className="relative">
                      {/* Node Bullet */}
                      <span className="absolute -left-[31px] top-1 h-2.5 w-2.5 rounded-full border border-[#D4AF37] bg-black shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
                      
                      <div className="space-y-1">
                        <span className="font-mono text-xs text-[#D4AF37] font-semibold">{event.year}</span>
                        <h5 className="text-xs font-bold text-white font-sans">{event.event}</h5>
                        <p className="text-xs text-zinc-400 leading-relaxed font-sans">{event.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
