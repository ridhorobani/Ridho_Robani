import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Compass, BookOpen, BarChart2, ShieldAlert, History, FolderKanban, Cpu, Settings, Copy, Plus, Moon } from "lucide-react";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  setView: (view: string) => void;
  addToast: (msg: string, type: "success" | "error" | "info") => void;
  onQuickAction: (action: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  setView,
  addToast,
  onQuickAction,
}) => {
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const items = [
    { id: "nav-home", label: "Go to Home Landing", category: "Navigation", icon: Compass, action: () => { setView("home"); onClose(); } },
    { id: "nav-dash", label: "Go to Main Dashboard", category: "Navigation", icon: BookOpen, action: () => { setView("dashboard"); onClose(); } },
    { id: "nav-fin", label: "Go to Finance & Markets", category: "Navigation", icon: BarChart2, action: () => { setView("finance"); onClose(); } },
    { id: "nav-journal", label: "Go to Trading Journal", category: "Navigation", icon: Copy, action: () => { setView("trading"); onClose(); } },
    { id: "nav-geo", label: "Go to Geopolitical Intelligence", category: "Navigation", icon: ShieldAlert, action: () => { setView("geopolitics"); onClose(); } },
    { id: "nav-hist", label: "Go to Historical Chronicles", category: "Navigation", icon: History, action: () => { setView("history"); onClose(); } },
    { id: "nav-know", label: "Go to Knowledge Repository", category: "Navigation", icon: BookOpen, action: () => { setView("knowledge"); onClose(); } },
    { id: "nav-proj", label: "Go to Projects Portfolio", category: "Navigation", icon: FolderKanban, action: () => { setView("projects"); onClose(); } },
    { id: "nav-ai", label: "Go to AI Laboratory", category: "Navigation", icon: Cpu, action: () => { setView("ailab"); onClose(); } },
    { id: "nav-set", label: "Go to System Settings", category: "Navigation", icon: Settings, action: () => { setView("settings"); onClose(); } },
    { id: "action-note", label: "Create New Knowledge Note", category: "Quick Action", icon: Plus, action: () => { onQuickAction("new-note"); onClose(); } },
    { id: "action-trade", label: "Log New Trading Journal Entry", category: "Quick Action", icon: Plus, action: () => { onQuickAction("new-trade"); onClose(); } },
    { id: "action-backup", label: "Export System Database Backup", category: "Quick Action", icon: Settings, action: () => { onQuickAction("backup"); onClose(); } },
    { id: "action-theme", label: "Toggle Dark Interface Style", category: "Quick Action", icon: Moon, action: () => { addToast("Premium Pure Black is the designated active skin.", "info"); onClose(); } },
  ];

  const filtered = items.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setSearch("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // Controlled by parent
      }

      if (!isOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          filtered[selectedIndex].action();
        }
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex, filtered, onClose, setView, onQuickAction]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Dialog Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ duration: 0.15 }}
            className="relative z-10 w-full max-w-xl overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-950/95 shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-xl"
          >
            {/* Input Bar */}
            <div className="flex items-center gap-3 border-b border-zinc-900 px-4 py-3.5">
              <Search className="h-4 w-4 text-zinc-500" />
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder="Search command palette or jump to..."
                className="w-full bg-transparent text-sm text-white placeholder-zinc-500 outline-none font-sans"
              />
              <span className="rounded border border-zinc-800 bg-zinc-900 px-1.5 py-0.5 text-[9px] font-mono text-zinc-400">
                ESC
              </span>
            </div>

            {/* List Results */}
            <div className="max-h-[350px] overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <div className="py-12 text-center text-xs text-zinc-500 font-mono">
                  No matching neural commands found.
                </div>
              ) : (
                Object.entries(
                  filtered.reduce((acc, item) => {
                    if (!acc[item.category]) acc[item.category] = [];
                    acc[item.category].push(item);
                    return acc;
                  }, {} as Record<string, typeof filtered>)
                ).map(([category, catItems]) => (
                  <div key={category} className="mb-2">
                    <h5 className="px-3 py-1.5 text-[9px] font-mono tracking-widest text-zinc-500 uppercase">
                      {category}
                    </h5>
                    <div className="flex flex-col gap-0.5">
                      {catItems.map((item) => {
                        const globalIndex = filtered.indexOf(item);
                        const isSelected = globalIndex === selectedIndex;
                        const Icon = item.icon;

                        return (
                          <button
                            key={item.id}
                            onClick={item.action}
                            onMouseEnter={() => setSelectedIndex(globalIndex)}
                            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-all duration-150 ${
                              isSelected
                                ? "bg-zinc-900 text-[#D4AF37]"
                                : "text-zinc-400 hover:bg-zinc-900/40"
                            }`}
                          >
                            <Icon className={`h-3.5 w-3.5 shrink-0 ${isSelected ? "text-[#D4AF37]" : "text-zinc-500"}`} />
                            <span className="text-xs font-sans font-medium">{item.label}</span>
                            {isSelected && (
                              <span className="ml-auto text-[10px] font-mono text-[#D4AF37]/80">
                                ↵ Enter
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Hint Bar */}
            <div className="flex items-center gap-4 border-t border-zinc-900 bg-zinc-950 px-4 py-2 text-[10px] font-mono text-zinc-500">
              <span className="flex items-center gap-1">
                <span className="rounded bg-zinc-900 border border-zinc-800 px-1 font-sans">↑↓</span> Move
              </span>
              <span className="flex items-center gap-1">
                <span className="rounded bg-zinc-900 border border-zinc-800 px-1 font-sans">↵</span> Select
              </span>
              <span className="ml-auto text-[9px] text-[#D4AF37]/50 font-sans tracking-wide">
                ROBANI Second Brain Console
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
