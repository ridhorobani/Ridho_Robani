import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ThemeBackground } from "./components/ThemeBackground";
import { LoadingScreen } from "./components/LoadingScreen";
import { ToastContainer, ToastItem, ToastType } from "./components/Toast";
import { CommandPalette } from "./components/CommandPalette";
import { getTranslation } from "./lib/translations";

// Import Views
import { HomeView } from "./components/HomeView";
import { DashboardView } from "./components/DashboardView";
import { FinanceView } from "./components/FinanceView";
import { TradingJournalView } from "./components/TradingJournalView";
import { GeopoliticsView } from "./components/GeopoliticsView";
import { HistoryView } from "./components/HistoryView";
import { KnowledgeView } from "./components/KnowledgeView";
import { ProjectsView } from "./components/ProjectsView";
import { AILabView } from "./components/AILabView";
import { SettingsView } from "./components/SettingsView";

// Import initial dataset
import {
  initialFinanceAssets,
  initialTradingJournal,
  initialGeopoliticalCountries,
  initialHistoricalEras,
  initialPersonalNotes,
  initialProjects,
} from "./data";
import { Settings, FinanceAsset, TradingJournalEntry, PersonalNote, Project } from "./types";

// Icons
import {
  Compass,
  BookOpen,
  BarChart2,
  Copy,
  ShieldAlert,
  History as HistoryIcon,
  FolderKanban,
  Cpu,
  Settings as SettingsIcon,
  Menu,
  X,
  Keyboard,
} from "lucide-react";

export default function App() {
  const [loadingCompleted, setLoadingCompleted] = useState(false);
  const [activeView, setActiveView] = useState<string>("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Core Stateful Databases
  const [assets, setAssets] = useState<FinanceAsset[]>(initialFinanceAssets);
  const [trades, setTrades] = useState<TradingJournalEntry[]>([]);
  const [countries] = useState(initialGeopoliticalCountries);
  const [eras] = useState(initialHistoricalEras);
  const [notes, setNotes] = useState<PersonalNote[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [settings, setSettings] = useState<Settings>({
    darkMode: true,
    language: "ID",
    notifications: true,
    backupInterval: "Manual",
  });

  // Toasts
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = (message: string, type: ToastType = "success") => {
    if (!settings.notifications) return;
    const id = `toast-${Date.now()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Hydrate State from localStorage
  useEffect(() => {
    try {
      const storedTrades = localStorage.getItem("robani_trades");
      const storedNotes = localStorage.getItem("robani_notes");
      const storedProjects = localStorage.getItem("robani_projects");
      const storedSettings = localStorage.getItem("robani_settings");

      if (storedTrades) setTrades(JSON.parse(storedTrades));
      else {
        setTrades(initialTradingJournal);
        localStorage.setItem("robani_trades", JSON.stringify(initialTradingJournal));
      }

      if (storedNotes) setNotes(JSON.parse(storedNotes));
      else {
        setNotes(initialPersonalNotes);
        localStorage.setItem("robani_notes", JSON.stringify(initialPersonalNotes));
      }

      if (storedProjects) setProjects(JSON.parse(storedProjects));
      else {
        setProjects(initialProjects);
        localStorage.setItem("robani_projects", JSON.stringify(initialProjects));
      }

      if (storedSettings) setSettings(JSON.parse(storedSettings));
    } catch (e) {
      console.error("Local Storage Hydration failure", e);
    }
  }, []);

  // Update localStorage helper
  const handleUpdateTrades = (newTrades: TradingJournalEntry[]) => {
    setTrades(newTrades);
    localStorage.setItem("robani_trades", JSON.stringify(newTrades));
  };

  const handleUpdateNotes = (newNotes: PersonalNote[]) => {
    setNotes(newNotes);
    localStorage.setItem("robani_notes", JSON.stringify(newNotes));
  };

  const handleUpdateProjects = (newProjects: Project[]) => {
    setProjects(newProjects);
    localStorage.setItem("robani_projects", JSON.stringify(newProjects));
  };

  const handleUpdateSettings = (partial: Partial<Settings>) => {
    const updated = { ...settings, ...partial };
    setSettings(updated);
    localStorage.setItem("robani_settings", JSON.stringify(updated));
  };

  // Keyboard Shortcuts (Ctrl+K and views quick triggers)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle palette
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Custom JSON Backup Pipeline (Import / Export / Backup)
  const handleExportBackup = () => {
    try {
      const fullDatabase = {
        schema: "robani-second-brain-backup",
        version: "3.1",
        exportDate: new Date().toISOString(),
        trades,
        notes,
        projects,
        settings,
      };

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fullDatabase, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `robani_backup_${new Date().toISOString().split("T")[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      addToast("Full system database compiled and exported successfully.", "success");
    } catch (err) {
      addToast("Database JSON serialization failed.", "error");
    }
  };

  const handleImportBackup = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.schema !== "robani-second-brain-backup") {
        return false;
      }

      if (parsed.trades) handleUpdateTrades(parsed.trades);
      if (parsed.notes) handleUpdateNotes(parsed.notes);
      if (parsed.projects) handleUpdateProjects(parsed.projects);
      if (parsed.settings) handleUpdateSettings(parsed.settings);

      return true;
    } catch (err) {
      return false;
    }
  };

  // Handle Command Palette Quick Actions
  const handleQuickAction = (action: string) => {
    if (action === "backup") {
      handleExportBackup();
    } else if (action === "new-note") {
      setActiveView("knowledge");
      addToast("Compose workspace active.", "info");
    } else if (action === "new-trade") {
      setActiveView("trading");
      addToast("Logging console active.", "info");
    }
  };

  // Prepare contextual text for server-side AI analyst
  const notesContextSummary = notes.map(n => `Title: ${n.title}\nCategory: ${n.category}\nContent: ${n.content}\n`).join("\n");
  const winCount = trades.filter(t => t.status === "WIN").length;
  const winRate = trades.length > 0 ? Math.round((winCount / trades.length) * 100) : 0;
  const tradeStatsSummary = `Win rate: ${winRate}%, total trades: ${trades.length}, active yield metrics: logged.`;

  const t = getTranslation(settings.language);

  // Sidebar Menu Items
  const menuItems = [
    { id: "home", label: t.home, icon: Compass },
    { id: "dashboard", label: t.dashboard, icon: BookOpen },
    { id: "finance", label: t.finance, icon: BarChart2 },
    { id: "trading", label: t.trading, icon: Copy },
    { id: "geopolitics", label: t.geopolitics, icon: ShieldAlert },
    { id: "history", label: t.history, icon: HistoryIcon },
    { id: "knowledge", label: t.knowledge, icon: BookOpen },
    { id: "projects", label: t.projects, icon: FolderKanban },
    { id: "ailab", label: t.ailab, icon: Cpu },
    { id: "settings", label: t.settings, icon: SettingsIcon },
  ];

  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden selection:bg-amber-500/20 selection:text-[#D4AF37]">
      {/* Immersive background layer */}
      <ThemeBackground />

      {/* Startup Loading Sequence */}
      <LoadingScreen onComplete={() => setLoadingCompleted(true)} />

      {loadingCompleted && (
        <div className="flex min-h-screen flex-col md:flex-row">
          
          {/* DESKTOP SIDEBAR PANEL (Apple/Linear inspired) */}
          <aside className="hidden md:flex w-64 shrink-0 flex-col justify-between border-r border-zinc-900 bg-black/90 p-6 backdrop-blur-xl h-screen sticky top-0 z-40">
            <div className="space-y-8">
              {/* Premium Logo Header */}
              <div 
                onClick={() => setActiveView("home")}
                className="cursor-pointer flex items-center gap-3 group"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-900 bg-zinc-950 shadow-[0_0_15px_rgba(212,175,55,0.08)] group-hover:border-[#D4AF37]/30 transition-all">
                  <span className="font-serif text-lg font-bold text-[#D4AF37] italic">R</span>
                </div>
                <div>
                  <span className="text-xl font-bold tracking-tighter text-[#D4AF37] font-serif italic block">ROBANI</span>
                  <span className="text-[8px] font-mono tracking-widest text-zinc-500 uppercase block -mt-1">{t.second_brain}</span>
                </div>
              </div>

              {/* Navigation list */}
              <nav className="flex flex-col gap-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveView(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`flex w-full items-center gap-3.5 rounded-xl px-4 py-2.5 text-left text-xs transition-all duration-200 cursor-pointer ${
                        isActive
                          ? "bg-zinc-900 text-[#D4AF37] font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]"
                          : "text-zinc-400 hover:bg-zinc-900/40 hover:text-zinc-200"
                      }`}
                    >
                      <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-[#D4AF37]" : "text-zinc-500"}`} />
                      <span className="font-sans font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Command Palette Indicator */}
            <div 
              onClick={() => setCommandPaletteOpen(true)}
              className="cursor-pointer rounded-xl border border-zinc-900 bg-zinc-950/60 p-3 flex items-center justify-between text-[10px] font-mono text-zinc-500 hover:border-zinc-800 transition-all duration-150"
            >
              <span className="flex items-center gap-1.5 font-sans"><Keyboard className="h-3.5 w-3.5 text-amber-500" /> {t.quick_actions}</span>
              <span className="rounded bg-zinc-900 px-1.5 py-0.5 text-[8px] border border-zinc-850">⌘K</span>
            </div>
          </aside>

          {/* MOBILE NAV BAR */}
          <header className="md:hidden shrink-0 flex items-center justify-between px-5 py-4 border-b border-zinc-900 bg-black/90 backdrop-blur-md sticky top-0 z-40">
            <div 
              onClick={() => setActiveView("home")}
              className="flex items-center gap-2.5 cursor-pointer"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-900 bg-zinc-950">
                <span className="font-serif text-sm font-bold text-[#D4AF37] italic">R</span>
              </div>
              <span className="text-lg font-bold tracking-tighter text-[#D4AF37] font-serif italic">ROBANI</span>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCommandPaletteOpen(true)}
                className="p-1.5 rounded-lg border border-zinc-900 text-zinc-400 bg-zinc-950 hover:bg-zinc-900"
              >
                <Keyboard className="h-4 w-4 text-[#D4AF37]" />
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 rounded-lg border border-zinc-900 text-zinc-400 bg-zinc-950 hover:bg-zinc-900 cursor-pointer"
              >
                {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            </div>
          </header>

          {/* MOBILE NAVIGATION DRAWER */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden border-b border-zinc-900 bg-black/95 backdrop-blur-xl z-30 overflow-hidden"
              >
                <nav className="flex flex-col gap-0.5 px-4 py-3">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeView === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveView(item.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-xs transition-all cursor-pointer ${
                          isActive ? "bg-zinc-900 text-[#D4AF37] font-semibold" : "text-zinc-400"
                        }`}
                      >
                        <Icon className="h-4 w-4 text-zinc-500" />
                        <span className="font-sans font-medium">{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </motion.div>
            )}
          </AnimatePresence>

          {/* MAIN PAGE VIEW FRAMEWORK */}
          <main className="flex-1 overflow-x-hidden min-h-[calc(100vh-65px)] md:min-h-screen">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeView}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="h-full"
              >
                {activeView === "home" && (
                  <HomeView
                    assets={assets}
                    projects={projects}
                    notes={notes}
                    setView={setActiveView}
                    language={settings.language}
                  />
                )}

                {activeView === "dashboard" && (
                  <DashboardView
                    notes={notes}
                    projects={projects}
                    trades={trades}
                    assets={assets}
                    setView={setActiveView}
                    language={settings.language}
                  />
                )}

                {activeView === "finance" && (
                  <FinanceView assets={assets} language={settings.language} />
                )}

                {activeView === "trading" && (
                  <TradingJournalView
                    trades={trades}
                    onAddTrade={(newTrade) => handleUpdateTrades([newTrade, ...trades])}
                    addToast={addToast}
                    language={settings.language}
                  />
                )}

                {activeView === "geopolitics" && (
                  <GeopoliticsView countries={countries} language={settings.language} />
                )}

                {activeView === "history" && (
                  <HistoryView eras={eras} language={settings.language} />
                )}

                {activeView === "knowledge" && (
                  <KnowledgeView
                    notes={notes}
                    onAddNote={(newNote) => handleUpdateNotes([newNote, ...notes])}
                    addToast={addToast}
                    language={settings.language}
                  />
                )}

                {activeView === "projects" && (
                  <ProjectsView
                    projects={projects}
                    onAddProject={(newProj) => handleUpdateProjects([newProj, ...projects])}
                    addToast={addToast}
                    language={settings.language}
                  />
                )}

                {activeView === "ailab" && (
                  <AILabView
                    notesText={notesContextSummary}
                    tradeStatsText={tradeStatsSummary}
                    language={settings.language}
                  />
                )}

                {activeView === "settings" && (
                  <SettingsView
                    settings={settings}
                    onUpdateSettings={handleUpdateSettings}
                    onImportBackup={handleImportBackup}
                    onExportBackup={handleExportBackup}
                    addToast={addToast}
                    language={settings.language}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      )}

      {/* Global Spotlight Command Palette */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        setView={setActiveView}
        addToast={addToast}
        onQuickAction={handleQuickAction}
      />

      {/* Global premium Toast Notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
