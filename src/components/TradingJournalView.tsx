import React, { useState } from "react";
import { TradingJournalEntry } from "../types";
import { EquityCurve, WinRateGauge } from "./InteractiveCharts";
import { Plus, Search, Filter, Calendar, TrendingUp, Compass, Sliders, X, AlertCircle } from "lucide-react";
import { getTranslation, Language } from "../lib/translations";

interface TradingJournalViewProps {
  trades: TradingJournalEntry[];
  onAddTrade: (trade: TradingJournalEntry) => void;
  addToast: (msg: string, type: "success" | "error" | "info") => void;
  language: Language;
}

export const TradingJournalView: React.FC<TradingJournalViewProps> = ({
  trades,
  onAddTrade,
  addToast,
  language,
}) => {
  const t = getTranslation(language);
  const [showAddModal, setShowAddModal] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "WIN" | "LOSS" | "BREAKEVEN">("ALL");
  const [marketFilter, setMarketFilter] = useState("ALL");

  // Form State
  const [market, setMarket] = useState("Gold (XAUUSD)");
  const [bias, setBias] = useState<"LONG" | "SHORT">("LONG");
  const [entry, setEntry] = useState("");
  const [exit, setExit] = useState("");
  const [sl, setSl] = useState("");
  const [tp, setTp] = useState("");
  const [risk, setRisk] = useState("1.0");
  const [reason, setReason] = useState("");
  const [emotion, setEmotion] = useState<"Disciplined" | "Greed" | "Fear" | "Neutral" | "Anxious" | "Excited">("Disciplined");
  const [lessons, setLessons] = useState("");

  const marketsList = ["ALL", ...Array.from(new Set(trades.map((t) => t.market)))];

  // Filtering
  const filteredTrades = trades.filter((trade) => {
    const matchesSearch = trade.market.toLowerCase().includes(search.toLowerCase()) ||
                          trade.reason.toLowerCase().includes(search.toLowerCase()) ||
                          trade.lessons.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || trade.status === statusFilter;
    const matchesMarket = marketFilter === "ALL" || trade.market === marketFilter;
    return matchesSearch && matchesStatus && matchesMarket;
  });

  // Calculate statistics
  const totalTradesCount = trades.length;
  const winTrades = trades.filter((t) => t.status === "WIN");
  const winRate = totalTradesCount > 0 ? Math.round((winTrades.length / totalTradesCount) * 100) : 0;
  
  const avgRR = trades.length > 0 
    ? (trades.reduce((acc, t) => acc + (t.status === "WIN" ? t.reward : 0), 0) / (winTrades.length || 1)).toFixed(2)
    : "0.00";

  const totalR = trades.reduce((acc, t) => {
    if (t.status === "WIN") return acc + t.reward;
    if (t.status === "LOSS") return acc - 1;
    return acc;
  }, 0).toFixed(2);

  // Handle Trade Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!entry || !exit || !sl || !tp) {
      addToast(
        language === "ID" ? "Harap isi parameter eksekusi numerik utama." : "Please fill in key numerical execution parameters.",
        "error"
      );
      return;
    }

    const entNum = parseFloat(entry);
    const exitNum = parseFloat(exit);
    const slNum = parseFloat(sl);
    const tpNum = parseFloat(tp);

    if (isNaN(entNum) || isNaN(exitNum) || isNaN(slNum) || isNaN(tpNum)) {
      addToast(
        language === "ID" ? "Level eksekusi harus berupa angka yang valid." : "Execution levels must be valid numbers.",
        "error"
      );
      return;
    }

    // Determine status and Reward
    let status: "WIN" | "LOSS" | "BREAKEVEN" = "BREAKEVEN";
    let reward = 0;

    const isWin = bias === "LONG" ? exitNum > entNum : exitNum < entNum;
    const isLoss = bias === "LONG" ? exitNum <= slNum : exitNum >= slNum;

    if (isWin) {
      status = "WIN";
      // Calculate Reward ratio R
      const riskDist = Math.abs(entNum - slNum);
      const gainDist = Math.abs(exitNum - entNum);
      reward = riskDist > 0 ? parseFloat((gainDist / riskDist).toFixed(2)) : 0;
    } else if (isLoss) {
      status = "LOSS";
      reward = -1.0;
    }

    const newEntry: TradingJournalEntry = {
      id: `trade-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      market,
      bias,
      entry: entNum,
      exit: exitNum,
      sl: slNum,
      tp: tpNum,
      risk: parseFloat(risk),
      reward: status === "WIN" ? reward : -1,
      reason,
      emotion,
      lessons,
      status,
    };

    onAddTrade(newEntry);
    setShowAddModal(false);
    addToast(
      language === "ID" 
        ? `Berhasil mencatat transaksi ${bias} di ${market} sebagai ${status}.`
        : `Successfully logged ${bias} trade on ${market} as a ${status}.`,
      "success"
    );

    // Reset Form
    setEntry("");
    setExit("");
    setSl("");
    setTp("");
    setReason("");
    setLessons("");
  };

  return (
    <div className="space-y-8 py-8 px-4 sm:px-6 md:px-8 max-w-6xl mx-auto font-sans">
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono tracking-wider text-zinc-500 uppercase font-sans">
            {language === "ID" ? "Log Eksekusi" : "Execution Logs"}
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-white tracking-tight mt-1">{t.trading}</h2>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="rounded-full bg-gradient-to-r from-amber-500 to-[#D4AF37] px-5 py-2 text-xs font-semibold text-black hover:opacity-95 shadow-[0_0_15px_rgba(212,175,55,0.15)] flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Plus className="h-4 w-4" /> {t.log_new_trade}
        </button>
      </div>

      {/* Grid: Charts & Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <EquityCurve trades={trades} />
        </div>
        <div>
          <WinRateGauge winRate={winRate} />
        </div>
      </div>

      {/* Numerical Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-zinc-900 bg-zinc-950/20 p-4">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
            {language === "ID" ? "Total Transaksi" : "Total Executed"}
          </span>
          <span className="text-lg font-bold font-mono text-white block mt-1">
            {totalTradesCount} {language === "ID" ? "Transaksi" : "Trades"}
          </span>
        </div>
        <div className="rounded-xl border border-zinc-900 bg-zinc-950/20 p-4">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
            {language === "ID" ? "Transaksi Sukses" : "Successful Swaps"}
          </span>
          <span className="text-lg font-bold font-mono text-emerald-500 block mt-1">
            {winTrades.length} {language === "ID" ? "Menang" : "Wins"}
          </span>
        </div>
        <div className="rounded-xl border border-zinc-900 bg-zinc-950/20 p-4">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
            {language === "ID" ? "Rata-Rata Imbalan Menang" : "Average Win Reward"}
          </span>
          <span className="text-lg font-bold font-mono text-white block mt-1">{avgRR} R</span>
        </div>
        <div className="rounded-xl border border-zinc-900 bg-zinc-950/20 p-4">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
            {language === "ID" ? "Akumulasi R" : "Accumulated R"}
          </span>
          <span className={`text-lg font-bold font-mono block mt-1 ${parseFloat(totalR) >= 0 ? "text-[#D4AF37]" : "text-red-500"}`}>
            {parseFloat(totalR) >= 0 ? "+" : ""}{totalR} R
          </span>
        </div>
      </div>

      {/* Search & Filter bar */}
      <div className="rounded-2xl border border-zinc-900 bg-zinc-950/40 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search bar */}
          <div className="flex-1 flex items-center gap-2 border border-zinc-900 bg-zinc-950/80 rounded-xl px-3 py-2">
            <Search className="h-4 w-4 text-zinc-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={language === "ID" ? "Cari berdasarkan pasar, alasan, atau pelajaran..." : "Search by market, reason, or lessons..."}
              className="w-full bg-transparent text-xs text-white placeholder-zinc-500 outline-none"
            />
          </div>

          {/* Market selector */}
          <div className="flex items-center gap-2 border border-zinc-900 bg-zinc-950/80 rounded-xl px-3 py-2 text-xs">
            <Filter className="h-3.5 w-3.5 text-zinc-500" />
            <select
              value={marketFilter}
              onChange={(e) => setMarketFilter(e.target.value)}
              className="bg-transparent text-zinc-300 outline-none cursor-pointer"
            >
              {marketsList.map((m, idx) => (
                <option key={idx} value={m} className="bg-black text-white">
                  {m === "ALL" ? (language === "ID" ? "Semua Pasar" : "All Markets") : m}
                </option>
              ))}
            </select>
          </div>

          {/* Status buttons */}
          <div className="flex rounded-xl border border-zinc-900 bg-zinc-950/80 p-0.5 self-start sm:self-auto text-xs font-mono">
            {(["ALL", "WIN", "LOSS", "BREAKEVEN"] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`rounded-lg px-3 py-1.5 transition-all text-[10px] cursor-pointer ${
                  statusFilter === filter
                    ? "bg-[#D4AF37] text-black font-semibold"
                    : "text-zinc-500 hover:text-white"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Trade Listings Table */}
        <div className="overflow-x-auto">
          {filteredTrades.length === 0 ? (
            <div className="py-12 text-center text-xs text-zinc-500 font-mono">
              {language === "ID" ? "Tidak ada rekaman transaksi yang cocok dengan filter aktif." : "No recorded trades match active filters."}
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[600px] text-xs font-sans">
              <thead>
                <tr className="border-b border-zinc-900 text-[10px] font-mono uppercase text-zinc-500 tracking-wider">
                  <th className="pb-3 pr-2">{t.date}</th>
                  <th className="pb-3 pr-2">{t.market}</th>
                  <th className="pb-3 pr-2">{t.bias}</th>
                  <th className="pb-3 pr-2 font-mono">{language === "ID" ? "Masuk / Keluar" : "Entry / Exit"}</th>
                  <th className="pb-3 pr-2 font-mono">SL / TP</th>
                  <th className="pb-3 pr-2 font-mono">{language === "ID" ? "Risiko/RR" : "Risk/RR"}</th>
                  <th className="pb-3 pr-2">{language === "ID" ? "Emosi" : "Emotion"}</th>
                  <th className="pb-3 pr-2">{language === "ID" ? "Hasil" : "Outcome"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-950 text-zinc-300">
                {filteredTrades.map((trade) => (
                  <tr key={trade.id} className="hover:bg-zinc-900/10 transition-colors">
                    <td className="py-3.5 font-mono text-zinc-500">{trade.date}</td>
                    <td className="py-3.5 font-semibold text-white">{trade.market}</td>
                    <td className="py-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-semibold border ${
                        trade.bias === "LONG" 
                          ? "bg-emerald-500/5 text-emerald-500 border-emerald-500/15" 
                          : "bg-red-500/5 text-red-500 border-red-500/15"
                      }`}>
                        {trade.bias}
                      </span>
                    </td>
                    <td className="py-3.5 font-mono">
                      <span className="text-white">{trade.entry.toLocaleString()}</span>
                      <span className="text-zinc-600 font-sans mx-1">→</span>
                      <span className="text-zinc-400">{trade.exit.toLocaleString()}</span>
                    </td>
                    <td className="py-3.5 font-mono text-zinc-500">
                      <span>{trade.sl.toLocaleString()}</span>
                      <span className="text-zinc-700 font-sans mx-1">|</span>
                      <span>{trade.tp.toLocaleString()}</span>
                    </td>
                    <td className="py-3.5 font-mono">
                      <span>{trade.risk}%</span>
                      <span className="text-zinc-600 font-sans mx-1">/</span>
                      <span className={trade.status === "WIN" ? "text-emerald-500 font-semibold" : ""}>
                        {trade.reward > 0 ? `+${trade.reward}R` : trade.reward === 0 ? "0R" : `${trade.reward}R`}
                      </span>
                    </td>
                    <td className="py-3.5">
                      <span className="rounded bg-zinc-900 border border-zinc-800 px-2 py-0.5 text-[10px] text-zinc-400">
                        {trade.emotion}
                      </span>
                    </td>
                    <td className="py-3.5">
                      <span className={`font-mono font-bold text-[10px] tracking-wider rounded px-2 py-1 ${
                        trade.status === "WIN"
                          ? "bg-emerald-500/10 text-emerald-500"
                          : trade.status === "LOSS"
                          ? "bg-red-500/10 text-red-500"
                          : "bg-zinc-800/40 text-zinc-400"
                      }`}>
                        {trade.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal Drawer: Add Position Log */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setShowAddModal(false)} className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
          
          <div className="relative w-full max-w-lg rounded-2xl border border-zinc-900 bg-zinc-950 p-6 shadow-2xl backdrop-blur-xl max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowAddModal(false)} className="absolute top-4 right-4 text-zinc-500 hover:text-white cursor-pointer">
              <X className="h-4 w-4" />
            </button>

            <h3 className="text-lg font-serif text-white tracking-tight flex items-center gap-2">
              <Sliders className="h-5 w-5 text-[#D4AF37]" /> {language === "ID" ? "Catat Transaksi Dieksekusi" : "Log Executed Trade"}
            </h3>
            <p className="text-[10px] font-mono text-zinc-500 mt-1 uppercase tracking-wider">ROBANI Execution protocol</p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-xs font-sans">
              <div className="grid grid-cols-2 gap-4">
                {/* Market Selection */}
                <div>
                  <label className="block text-zinc-500 font-mono mb-1.5 uppercase tracking-wider">
                    {language === "ID" ? "Aset Trading" : "Trading asset"}
                  </label>
                  <select
                    value={market}
                    onChange={(e) => setMarket(e.target.value)}
                    className="w-full rounded-xl border border-zinc-900 bg-zinc-950 px-3 py-2 text-white outline-none cursor-pointer"
                  >
                    <option value="Gold (XAUUSD)">Gold (XAUUSD)</option>
                    <option value="Bitcoin (BTCUSD)">Bitcoin (BTCUSD)</option>
                    <option value="Ethereum (ETHUSD)">Ethereum (ETHUSD)</option>
                    <option value="EURUSD (Euro)">EURUSD (Euro)</option>
                    <option value="S&P 500 (SPX)">S&P 500 (SPX)</option>
                  </select>
                </div>

                {/* Bias Toggle */}
                <div>
                  <label className="block text-zinc-500 font-mono mb-1.5 uppercase tracking-wider">
                    {language === "ID" ? "Arah" : "Direction"}
                  </label>
                  <div className="flex rounded-xl border border-zinc-900 bg-zinc-950 p-0.5">
                    {(["LONG", "SHORT"] as const).map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setBias(b)}
                        className={`flex-1 rounded-lg py-1.5 font-mono font-semibold transition-all cursor-pointer ${
                          bias === b
                            ? b === "LONG"
                              ? "bg-emerald-500 text-black shadow-lg"
                              : "bg-red-500 text-black shadow-lg"
                            : "text-zinc-500 hover:text-white"
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Execution levels */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-500 font-mono mb-1.5 uppercase tracking-wider">
                    {language === "ID" ? "Level Masuk" : "Entry Level"}
                  </label>
                  <input
                    type="text"
                    required
                    value={entry}
                    onChange={(e) => setEntry(e.target.value)}
                    placeholder="e.g. 2385.50"
                    className="w-full rounded-xl border border-zinc-900 bg-zinc-950 px-3 py-2 text-white outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-zinc-500 font-mono mb-1.5 uppercase tracking-wider">
                    {language === "ID" ? "Level Keluar" : "Exit Level"}
                  </label>
                  <input
                    type="text"
                    required
                    value={exit}
                    onChange={(e) => setExit(e.target.value)}
                    placeholder="e.g. 2410.00"
                    className="w-full rounded-xl border border-zinc-900 bg-zinc-950 px-3 py-2 text-white outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-zinc-500 font-mono mb-1.5 uppercase tracking-wider">Stop Loss</label>
                  <input
                    type="text"
                    required
                    value={sl}
                    onChange={(e) => setSl(e.target.value)}
                    placeholder="e.g. 2375.00"
                    className="w-full rounded-xl border border-zinc-900 bg-zinc-950 px-3 py-2 text-white outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-zinc-500 font-mono mb-1.5 uppercase tracking-wider">Take Profit</label>
                  <input
                    type="text"
                    required
                    value={tp}
                    onChange={(e) => setTp(e.target.value)}
                    placeholder="e.g. 2415.00"
                    className="w-full rounded-xl border border-zinc-900 bg-zinc-950 px-3 py-2 text-white outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-zinc-500 font-mono mb-1.5 uppercase tracking-wider">
                    {language === "ID" ? "Risiko %" : "Risk %"}
                  </label>
                  <select
                    value={risk}
                    onChange={(e) => setRisk(e.target.value)}
                    className="w-full rounded-xl border border-zinc-900 bg-zinc-950 px-3 py-2 text-white outline-none font-mono cursor-pointer"
                  >
                    <option value="0.5">0.5%</option>
                    <option value="1.0">1.0%</option>
                    <option value="1.5">1.5%</option>
                    <option value="2.0">2.0%</option>
                  </select>
                </div>
              </div>

              {/* Psychological Context */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="block text-zinc-500 font-mono mb-1.5 uppercase tracking-wider">
                    {language === "ID" ? "Kondisi Mental" : "State of Mind"}
                  </label>
                  <select
                    value={emotion}
                    onChange={(e: any) => setEmotion(e.target.value)}
                    className="w-full rounded-xl border border-zinc-900 bg-zinc-950 px-3 py-2 text-white outline-none cursor-pointer"
                  >
                    <option value="Disciplined">{language === "ID" ? "Disiplin" : "Disciplined"}</option>
                    <option value="Greed">{language === "ID" ? "Serakah" : "Greed"}</option>
                    <option value="Fear">{language === "ID" ? "Takut" : "Fear"}</option>
                    <option value="Neutral">{language === "ID" ? "Netral" : "Neutral"}</option>
                    <option value="Anxious">{language === "ID" ? "Gelisah" : "Anxious"}</option>
                    <option value="Excited">{language === "ID" ? "Gembira" : "Excited"}</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-zinc-500 font-mono mb-1.5 uppercase tracking-wider">
                    {language === "ID" ? "Alasan masuk" : "Reason for entry"}
                  </label>
                  <input
                    type="text"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="e.g. London sweep + 1H demand retest"
                    className="w-full rounded-xl border border-zinc-900 bg-zinc-950 px-3 py-2 text-white outline-none"
                  />
                </div>
              </div>

              {/* Lessons */}
              <div>
                <label className="block text-zinc-500 font-mono mb-1.5 uppercase tracking-wider">
                  {language === "ID" ? "Pelajaran Utama / Hikmah" : "Key Lesson / Takeaway"}
                </label>
                <textarea
                  rows={2}
                  value={lessons}
                  onChange={(e) => setLessons(e.target.value)}
                  placeholder={language === "ID" ? "Apa yang pasar ajarkan kepada Anda selama eksekusi ini?" : "What did the market teach you during this execution?"}
                  className="w-full rounded-xl border border-zinc-900 bg-zinc-950 px-3 py-2 text-white outline-none resize-none"
                />
              </div>

              {/* Alert */}
              <div className="rounded-xl border border-zinc-900 bg-zinc-950 p-3 flex items-start gap-2 text-[10px] text-zinc-500">
                <AlertCircle className="h-4 w-4 text-[#D4AF37] shrink-0" />
                <p className="leading-relaxed">
                  {language === "ID" 
                    ? "Pencatatan secara otomatis menentukan hasil transaksi relatif terhadap stop-loss dan menghitung unit geometris R."
                    : "Logging will automatically determine trade outcome relative to your stop-loss and compute geometric R units."}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 rounded-full border border-zinc-850 px-4 py-2.5 hover:bg-zinc-900 transition-all font-semibold text-zinc-400 cursor-pointer text-center"
                >
                  {language === "ID" ? "Batal" : "Cancel"}
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-full bg-gradient-to-r from-amber-500 to-[#D4AF37] px-4 py-2.5 hover:opacity-90 transition-all font-semibold text-black cursor-pointer text-center"
                >
                  {language === "ID" ? "Konfirmasi Log" : "Confirm Logs"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
