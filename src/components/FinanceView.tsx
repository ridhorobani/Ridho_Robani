import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FinanceAsset } from "../types";
import { TrendingUp, TrendingDown, Target, ShieldCheck, HelpCircle, Layers, Activity } from "lucide-react";
import { getTranslation, Language } from "../lib/translations";

interface FinanceViewProps {
  assets: FinanceAsset[];
  language: Language;
}

export const FinanceView: React.FC<FinanceViewProps> = ({ assets, language }) => {
  const t = getTranslation(language);
  const [selectedAsset, setSelectedAsset] = useState<FinanceAsset>(assets[0]);
  const [candleSeed, setCandleSeed] = useState<number[]>([]);

  // Generate responsive mock candlestick chart heights and colors
  useEffect(() => {
    // Generate 18 candlesticks
    const candles = [];
    let start = parseFloat(selectedAsset.price) * 0.98;
    for (let i = 0; i < 18; i++) {
      const isUp = Math.random() > 0.45;
      const change = (Math.random() * 0.01 + 0.002) * start;
      const open = start;
      const close = isUp ? start + change : start - change;
      const high = Math.max(open, close) + Math.random() * 0.003 * start;
      const low = Math.min(open, close) - Math.random() * 0.003 * start;
      candles.push({ open, close, high, low, isUp });
      start = close;
    }
    // force last candle close to match current price roughly
    candles[candles.length - 1].close = parseFloat(selectedAsset.price);
    setCandleSeed(candles.flatMap(c => [c.open, c.close, c.high, c.low]));
  }, [selectedAsset]);

  // Read candlesticks from seed
  const candlesList: Array<{ open: number; close: number; high: number; low: number; isUp: boolean }> = [];
  if (candleSeed.length >= 72) {
    for (let i = 0; i < 18; i++) {
      const offset = i * 4;
      const open = candleSeed[offset];
      const close = candleSeed[offset + 1];
      const high = candleSeed[offset + 2];
      const low = candleSeed[offset + 3];
      candlesList.push({ open, close, high, low, isUp: close >= open });
    }
  }

  const chartMax = Math.max(...candleSeed) * 1.002 || 1;
  const chartMin = Math.min(...candleSeed) * 0.998 || 0;
  const range = chartMax - chartMin;

  return (
    <div className="space-y-8 py-8 px-4 sm:px-6 md:px-8 max-w-6xl mx-auto font-sans">
      {/* Header */}
      <div>
        <span className="text-xs font-mono tracking-wider text-zinc-500 uppercase">
          {language === "ID" ? "Alokasi Aset" : "Asset Allocation"}
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif text-white tracking-tight mt-1">
          {language === "ID" ? "Kecerdasan Finansial" : "Financial Intelligence"}
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Asset Selection List */}
        <div className="flex flex-col gap-2.5 lg:col-span-1">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider px-2">
            {language === "ID" ? "Daftar Pantau" : "Watchlist"}
          </span>
          {assets.map((asset) => (
            <button
              key={asset.id}
              onClick={() => setSelectedAsset(asset)}
              className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition-all duration-200 cursor-pointer ${
                selectedAsset.id === asset.id
                  ? "border-[#D4AF37] bg-[#D4AF37]/5 text-[#D4AF37]"
                  : "border-zinc-900 bg-zinc-950/30 text-zinc-400 hover:border-zinc-800 hover:text-white"
              }`}
            >
              <div>
                <span className="text-[10px] font-mono text-zinc-500 block">{asset.symbol}</span>
                <span className="text-xs font-semibold mt-0.5 block">{asset.name}</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono text-white block">${parseFloat(asset.price).toLocaleString()}</span>
                <span className={`text-[9px] font-mono mt-0.5 block ${asset.isUp ? "text-emerald-500" : "text-red-500"}`}>
                  {asset.change}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Right Column: Asset Details and Charts */}
        <div className="lg:col-span-3 space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedAsset.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Asset Snapshot Card */}
              <div className="rounded-2xl border border-zinc-900 bg-zinc-950/50 p-6 backdrop-blur-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-[#D4AF37] tracking-wider uppercase bg-amber-500/5 border border-amber-500/10 px-2.5 py-0.5 rounded-full">
                      {selectedAsset.symbol}
                    </span>
                    {selectedAsset.isUp ? (
                      <TrendingUp className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                  <h3 className="text-2xl font-serif text-white tracking-tight">{selectedAsset.name}</h3>
                </div>

                <div className="sm:text-right">
                  <span className="text-2xl font-bold font-mono text-white tracking-tight">
                    ${parseFloat(selectedAsset.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span className={`block text-xs font-mono mt-1 ${selectedAsset.isUp ? "text-emerald-500" : "text-red-500"}`}>
                    {selectedAsset.change} ({language === "ID" ? "Pergeseran Harian" : "Daily Shift"})
                  </span>
                </div>
              </div>

              {/* Custom Vector Candlestick Chart Mock */}
              <div className="rounded-2xl border border-zinc-900 bg-black/90 p-5 relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono tracking-wider text-zinc-500 uppercase flex items-center gap-1.5">
                    <Activity className="h-3.5 w-3.5 text-[#D4AF37]" /> {language === "ID" ? "Terminal Candlestick Teknis Interaktif" : "Interactive Technical Candlestick Terminal"}
                  </span>
                  <div className="flex gap-2 text-[9px] font-mono text-zinc-500">
                    <span className="rounded bg-zinc-900 border border-zinc-800 px-1.5 py-0.5">EMA 20</span>
                    <span className="rounded bg-zinc-900 border border-zinc-800 px-1.5 py-0.5">EMA 50</span>
                  </div>
                </div>

                <div className="h-48 w-full relative flex items-end">
                  <svg viewBox="0 0 540 180" className="h-full w-full overflow-visible">
                    {/* Grid lines */}
                    {[0.25, 0.5, 0.75].map((ratio, i) => {
                      const y = 180 - ratio * 180;
                      const val = chartMax - ratio * range;
                      return (
                        <g key={i} className="opacity-10">
                          <line x1="0" y1={y} x2="540" y2={y} stroke="#fff" strokeWidth="0.5" strokeDasharray="3 3" />
                          <text x="535" y={y - 3} fill="#fff" fontSize="8" fontFamily="monospace" textAnchor="end">
                            ${val.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                          </text>
                        </g>
                      );
                    })}

                    {/* Support level representation lines */}
                    {selectedAsset.support.slice(0, 1).map((sup, idx) => {
                      const val = parseFloat(sup.replace(/[$,]/g, ""));
                      if (val >= chartMin && val <= chartMax) {
                        const y = 180 - ((val - chartMin) / range) * 180;
                        return (
                          <g key={idx} className="opacity-40">
                            <line x1="0" y1={y} x2="540" y2={y} stroke="#10B981" strokeWidth="1" strokeDasharray="5 5" />
                            <text x="5" y={y - 3} fill="#10B981" fontSize="8" fontFamily="monospace">
                              Support {sup}
                            </text>
                          </g>
                        );
                      }
                      return null;
                    })}

                    {/* Resistance level representation lines */}
                    {selectedAsset.resistance.slice(0, 1).map((res, idx) => {
                      const val = parseFloat(res.replace(/[$,]/g, ""));
                      if (val >= chartMin && val <= chartMax) {
                        const y = 180 - ((val - chartMin) / range) * 180;
                        return (
                          <g key={idx} className="opacity-40">
                            <line x1="0" y1={y} x2="540" y2={y} stroke="#EF4444" strokeWidth="1" strokeDasharray="5 5" />
                            <text x="5" y={y - 3} fill="#EF4444" fontSize="8" fontFamily="monospace">
                              Resistance {res}
                            </text>
                          </g>
                        );
                      }
                      return null;
                    })}

                    {/* Candlesticks */}
                    {candlesList.map((candle, i) => {
                      const candleWidth = 14;
                      const gap = 16;
                      const x = i * (candleWidth + gap) + 12;

                      const openY = 180 - ((candle.open - chartMin) / range) * 180;
                      const closeY = 180 - ((candle.close - chartMin) / range) * 180;
                      const highY = 180 - ((candle.high - chartMin) / range) * 180;
                      const lowY = 180 - ((candle.low - chartMin) / range) * 180;

                      const bodyY = Math.min(openY, closeY);
                      const bodyHeight = Math.max(1, Math.abs(openY - closeY));

                      return (
                        <g key={i}>
                          {/* Wick */}
                          <line
                            x1={x + candleWidth / 2}
                            y1={highY}
                            x2={x + candleWidth / 2}
                            y2={lowY}
                            stroke={candle.isUp ? "#10B981" : "#EF4444"}
                            strokeWidth="1.5"
                          />
                          {/* Body */}
                          <rect
                            x={x}
                            y={bodyY}
                            width={candleWidth}
                            height={bodyHeight}
                            fill={candle.isUp ? "#10B981" : "#EF4444"}
                            rx="1.5"
                          />
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>

              {/* Notes Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Market Summary & Analysis */}
                <div className="rounded-2xl border border-zinc-900 bg-zinc-950/40 p-5 space-y-4">
                  <h4 className="text-xs font-mono tracking-widest text-zinc-500 uppercase flex items-center gap-2">
                    <Layers className="h-4 w-4 text-[#D4AF37]" /> {language === "ID" ? "Konteks & Prospek Pasar" : "Market Context & Outlook"}
                  </h4>
                  <div className="space-y-4 text-xs leading-relaxed text-zinc-300 font-sans">
                    <div>
                      <span className="font-mono text-zinc-500 block mb-1">{language === "ID" ? "Catatan Makro" : "Macro Notes"}</span>
                      <p>{selectedAsset.marketNotes}</p>
                    </div>
                    <div>
                      <span className="font-mono text-[#D4AF37] block mb-1">{t.tactical_analysis}</span>
                      <p>{selectedAsset.personalAnalysis}</p>
                    </div>
                  </div>
                </div>

                {/* Technical Levels & Liquidity */}
                <div className="rounded-2xl border border-zinc-900 bg-zinc-950/40 p-5 space-y-4">
                  <h4 className="text-xs font-mono tracking-widest text-zinc-500 uppercase flex items-center gap-2">
                    <Target className="h-4 w-4 text-[#D4AF37]" /> {language === "ID" ? "Level Target Utama" : "Key Target Levels"}
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-xl border border-zinc-900 bg-zinc-950/10">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase">{t.support_levels}</span>
                      <div className="mt-2 space-y-1 font-mono text-xs text-emerald-500 font-semibold">
                        {selectedAsset.support.map((s, idx) => (
                          <div key={idx}>{s}</div>
                        ))}
                      </div>
                    </div>
                    <div className="p-3 rounded-xl border border-zinc-900 bg-zinc-950/10">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase">{t.resistance_levels}</span>
                      <div className="mt-2 space-y-1 font-mono text-xs text-red-400 font-semibold">
                        {selectedAsset.resistance.map((r, idx) => (
                          <div key={idx}>{r}</div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-zinc-300 space-y-2 pt-2">
                    <span className="font-mono text-zinc-500 block">{t.liquidity_pools}</span>
                    <p className="leading-relaxed">{selectedAsset.liquidityNotes}</p>
                  </div>
                </div>
              </div>

              {/* Risk Management Block */}
              <div className="rounded-2xl border border-red-950 bg-red-950/5 p-5 flex items-start gap-4">
                <ShieldCheck className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono text-amber-500 uppercase tracking-widest font-semibold block">
                    {t.risk_protocols}
                  </span>
                  <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                    {selectedAsset.riskNotes}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
