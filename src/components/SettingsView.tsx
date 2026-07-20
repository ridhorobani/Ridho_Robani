import React, { useRef } from "react";
import { Settings } from "../types";
import { ShieldAlert, Download, Upload, Bell, Globe, Sparkles, Moon, RefreshCw } from "lucide-react";
import { getTranslation, Language } from "../lib/translations";

interface SettingsViewProps {
  settings: Settings;
  onUpdateSettings: (set: Partial<Settings>) => void;
  onImportBackup: (backupStr: string) => boolean;
  onExportBackup: () => void;
  addToast: (msg: string, type: "success" | "error" | "info") => void;
  language: Language;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  onImportBackup,
  onExportBackup,
  addToast,
  language,
}) => {
  const t = getTranslation(language);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Trigger file selection for import
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  // Process file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      const success = onImportBackup(text);
      if (success) {
        addToast(
          language === "ID"
            ? "File cadangan sistem berhasil diurai dan dipulihkan."
            : "System backup file parsed and restored successfully.",
          "success"
        );
      } else {
        addToast(
          language === "ID"
            ? "Gagal mengurai file cadangan. Skema ROBANI tidak valid."
            : "Failed to parse backup file. Invalid ROBANI schema.",
          "error"
        );
      }
    };
    reader.readAsText(file);
    // clear input
    e.target.value = "";
  };

  return (
    <div className="space-y-8 py-8 px-4 sm:px-6 md:px-8 max-w-4xl mx-auto font-sans">
      {/* Header */}
      <div>
        <span className="text-xs font-mono tracking-wider text-zinc-500 uppercase">
          {language === "ID" ? "Preferensi" : "Preferences"}
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif text-white tracking-tight mt-1">{t.settings}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left menu descriptions */}
        <div className="md:col-span-1 space-y-2">
          <h4 className="text-sm font-semibold text-white">
            {language === "ID" ? "Kustomisasi Konsol" : "Console Customization"}
          </h4>
          <p className="text-xs text-zinc-500 leading-relaxed font-sans">
            {language === "ID"
              ? "Sesuaikan aturan lokalisasi, pipa notifikasi, dan tata letak visual ROBANI."
              : "Customize ROBANI's localization rules, notification pipelines, and visual layout."}
          </p>
        </div>

        {/* Right Settings Grid Panel */}
        <div className="md:col-span-2 space-y-6">
          {/* Theme & Visuals */}
          <div className="rounded-2xl border border-zinc-900 bg-zinc-950/40 p-5 space-y-4">
            <h5 className="text-xs font-mono tracking-widest text-zinc-500 uppercase flex items-center gap-2">
              <Moon className="h-4 w-4 text-[#D4AF37]" /> {language === "ID" ? "Identitas Visual" : "Visual Identity"}
            </h5>
            
            <div className="flex items-center justify-between text-xs">
              <div>
                <span className="font-semibold text-white block">
                  {language === "ID" ? "Gaya Obsidian Berdaulat" : "Sovereign Obsidian Style"}
                </span>
                <span className="text-zinc-500 text-[10px] mt-0.5 block">
                  {language === "ID" ? "Kemewahan gelap murni, indikator emas" : "Pure dark luxury, gold indicators"}
                </span>
              </div>
              <span className="rounded-full bg-amber-500/10 border border-[#D4AF37]/30 text-[#D4AF37] px-3 py-1 text-[10px] font-mono uppercase font-semibold">
                {language === "ID" ? "TAMPILAN AKTIF" : "ACTIVE SKIN"}
              </span>
            </div>
          </div>

          {/* Localization & Sound */}
          <div className="rounded-2xl border border-zinc-900 bg-zinc-950/40 p-5 space-y-4">
            <h5 className="text-xs font-mono tracking-widest text-zinc-500 uppercase flex items-center gap-2">
              <Globe className="h-4 w-4 text-[#D4AF37]" /> {language === "ID" ? "Lokalisasi & Audio" : "Localization & Audio"}
            </h5>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-zinc-500 font-mono mb-1.5 uppercase tracking-wider text-[10px]">
                  {language === "ID" ? "Bahasa Konsol" : "Console Language"}
                </label>
                <select
                  value={settings.language}
                  onChange={(e: any) => {
                    onUpdateSettings({ language: e.target.value });
                    addToast(
                      language === "ID"
                        ? `Lokalisasi diatur ke ${e.target.value}.`
                        : `Localization set to ${e.target.value}.`,
                      "success"
                    );
                  }}
                  className="w-full rounded-xl border border-zinc-900 bg-zinc-950 px-3 py-2 text-white text-xs outline-none cursor-pointer"
                >
                  <option value="EN">English (US)</option>
                  <option value="DE">Deutsch (Germany)</option>
                  <option value="ID">Bahasa Indonesia</option>
                  <option value="FR">Français (France)</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-500 font-mono mb-1.5 uppercase tracking-wider text-[10px]">
                  {language === "ID" ? "Frekuensi Cadangan" : "Backup Frequency"}
                </label>
                <select
                  value={settings.backupInterval}
                  onChange={(e: any) => {
                    onUpdateSettings({ backupInterval: e.target.value });
                    addToast(
                      language === "ID"
                        ? `Parameter Pencadangan Otomatis dikonfigurasi ke: ${e.target.value === "Manual" ? "Pemicu Manual" : e.target.value === "Daily" ? "Harian" : "Mingguan"}.`
                        : `Auto-Backup parameters configured to: ${e.target.value}.`,
                      "info"
                    );
                  }}
                  className="w-full rounded-xl border border-zinc-900 bg-zinc-950 px-3 py-2 text-white text-xs outline-none cursor-pointer"
                >
                  <option value="Manual">{language === "ID" ? "Pemicu Manual" : "Manual Trigger"}</option>
                  <option value="Daily">{language === "ID" ? "Harian Otomatis" : "Daily Auto"}</option>
                  <option value="Weekly">{language === "ID" ? "Mingguan Otomatis" : "Weekly Auto"}</option>
                </select>
              </div>
            </div>

            {/* Notifications Toggle */}
            <div className="pt-2 flex items-center justify-between text-xs">
              <div>
                <span className="font-semibold text-white block">
                  {language === "ID" ? "Sistem Peringatan Visual" : "Visual Alert System"}
                </span>
                <span className="text-zinc-500 text-[10px] mt-0.5 block">
                  {language === "ID" ? "Keluarkan pembaruan toast premium selama log" : "Emit premium toast updates during logs"}
                </span>
              </div>
              <button
                onClick={() => {
                  const newVal = !settings.notifications;
                  onUpdateSettings({ notifications: newVal });
                  addToast(
                    newVal
                      ? (language === "ID" ? "Umpan balik visual diaktifkan." : "Visual feedback enabled.")
                      : (language === "ID" ? "Pencatatan senyap diaktifkan." : "Silent logging enabled."),
                    "info"
                  );
                }}
                className={`rounded-full h-5 w-10 p-0.5 transition-colors cursor-pointer ${
                  settings.notifications ? "bg-[#D4AF37]" : "bg-zinc-900"
                }`}
              >
                <div className={`h-4 w-4 rounded-full bg-black transition-transform ${
                  settings.notifications ? "translate-x-5" : "translate-x-0"
                }`} />
              </button>
            </div>
          </div>

          {/* Backup, Import, Export */}
          <div className="rounded-2xl border border-zinc-900 bg-zinc-950/40 p-5 space-y-4">
            <h5 className="text-xs font-mono tracking-widest text-zinc-500 uppercase flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-[#D4AF37]" /> {language === "ID" ? "Cadangan Database & Keamanan" : "Database Backup & Safety"}
            </h5>

            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              {language === "ID"
                ? "Ekspor database otak lengkap Anda (termasuk esai penelitian, pengaturan trading, dan log pelacakan proyek) ke dalam file cadangan JSON lokal, atau unggah file yang dibuat sebelumnya untuk memulihkan nilai."
                : "Export your full brain database (including research essays, trading setups, and projects tracking logs) into a local JSON backup file, or upload a previously generated file to restore values."}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Export button */}
              <button
                onClick={onExportBackup}
                className="rounded-xl border border-zinc-900 bg-zinc-950 hover:bg-zinc-900 text-xs font-semibold py-3 text-white flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Download className="h-4 w-4 text-[#D4AF37]" /> {language === "ID" ? "Ekspor Database JSON" : "Export Database JSON"}
              </button>

              {/* Import button */}
              <button
                onClick={handleImportClick}
                className="rounded-xl border border-[#D4AF37]/20 hover:border-[#D4AF37]/40 bg-zinc-950 hover:bg-zinc-900 text-xs font-semibold py-3 text-[#D4AF37] flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Upload className="h-4 w-4" /> {language === "ID" ? "Impor Database JSON" : "Import Database JSON"}
              </button>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Note alert */}
            <div className="rounded-xl border border-zinc-900 bg-zinc-950 p-3.5 flex items-start gap-2.5 text-[10px] text-zinc-500 font-sans">
              <ShieldAlert className="h-4 w-4 text-amber-500 shrink-0" />
              <p className="leading-relaxed">
                {language === "ID"
                  ? "Mengimpor cadangan akan memulihkan data yang disimpan sepenuhnya dan menimpa status lokal saat ini. Pastikan Anda menyimpan revisi aktif terlebih dahulu."
                  : "Importing backups will completely restore saved data and overwrite any current local state. Ensure you save active revisions first."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
