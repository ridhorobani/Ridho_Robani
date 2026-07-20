import React, { useState } from "react";
import { Project } from "../types";
import { Plus, FolderKanban, Search, X, Check, Code, Layout, Brain, Eye } from "lucide-react";
import { getTranslation, Language } from "../lib/translations";

interface ProjectsViewProps {
  projects: Project[];
  onAddProject: (proj: Project) => void;
  addToast: (msg: string, type: "success" | "error" | "info") => void;
  language: Language;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  onAddProject,
  addToast,
  language,
}) => {
  const t = getTranslation(language);
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [techInput, setTechInput] = useState("");
  const [type, setType] = useState<"Software" | "AI" | "Design" | "Research" | "Experiment">("Software");
  const [status, setStatus] = useState<"Active" | "Completed" | "Researching" | "On Hold">("Active");
  const [progress, setProgress] = useState(50);

  const filtered = projects.filter((p) => typeFilter === "ALL" || p.type === typeFilter);

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description) {
      addToast(
        language === "ID" ? "Harap berikan nama dan deskripsi proyek." : "Please provide a project name and description.",
        "error"
      );
      return;
    }

    const techStack = techInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const newProj: Project = {
      id: `proj-${Date.now()}`,
      name,
      description,
      techStack,
      type,
      status,
      progress,
      gallery: ["https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop"],
    };

    onAddProject(newProj);
    setShowAddModal(false);
    addToast(
      language === "ID"
        ? `Berhasil menginisialisasi repositori proyek: "${name}".`
        : `Successfully initialized project repo: "${name}".`,
      "success"
    );

    // Reset Form
    setName("");
    setDescription("");
    setTechInput("");
    setProgress(50);
  };

  return (
    <div className="space-y-8 py-8 px-4 sm:px-6 md:px-8 max-w-6xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono tracking-wider text-zinc-500 uppercase">
            {language === "ID" ? "Portofolio Akselerasi" : "Acceleration Portfolio"}
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-white tracking-tight mt-1">{t.projects}</h2>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="rounded-full bg-gradient-to-r from-amber-500 to-[#D4AF37] px-5 py-2 text-xs font-semibold text-black hover:opacity-95 shadow-[0_0_15px_rgba(212,175,55,0.15)] flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Plus className="h-4 w-4" /> {language === "ID" ? "Daftarkan Repositori" : "Register Repo"}
        </button>
      </div>

      {/* Grid Filter Options */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-zinc-900 pb-4 text-xs font-mono">
        {(["ALL", "Software", "AI", "Design", "Research", "Experiment"] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => setTypeFilter(filter)}
            className={`rounded-full px-4 py-1.5 border transition-all ${
              typeFilter === filter
                ? "border-[#D4AF37] bg-[#D4AF37]/5 text-[#D4AF37]"
                : "border-zinc-950 bg-zinc-950/10 text-zinc-500 hover:text-white"
            }`}
          >
            {filter === "ALL" ? (language === "ID" ? "Semua Jalur" : "All Tracks") : filter}
          </button>
        ))}
      </div>

      {/* Projects Cards Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.length === 0 ? (
          <div className="md:col-span-2 py-16 text-center text-xs text-zinc-500 font-mono">
            {language === "ID" ? "Tidak ada repositori proyek aktif yang cocok dengan jalur filter ini." : "No active project repositories match this filter track."}
          </div>
        ) : (
          filtered.map((proj) => (
            <div
              key={proj.id}
              className="group relative rounded-2xl border border-zinc-900 bg-zinc-950/40 p-6 backdrop-blur-md flex flex-col justify-between hover:border-zinc-800 transition-all duration-200 overflow-hidden"
            >
              {/* Header */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-amber-500 bg-amber-500/5 border border-amber-500/10 px-2 py-0.5 rounded uppercase tracking-wider text-[9px] font-semibold">
                    {proj.type}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[9px] tracking-wider uppercase font-semibold ${
                    proj.status === "Completed"
                      ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/10"
                      : proj.status === "Active"
                      ? "bg-amber-500/10 text-amber-500 border border-amber-500/10 animate-pulse"
                      : "bg-zinc-800/40 text-zinc-500 border border-zinc-800"
                  }`}>
                    {proj.status === "Active" && language === "ID" ? "Aktif" : proj.status === "Completed" && language === "ID" ? "Selesai" : proj.status}
                  </span>
                </div>

                <h4 className="text-base font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                  {proj.name}
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                  {proj.description}
                </p>
              </div>

              {/* Progress and Footer */}
              <div className="mt-6 pt-4 border-t border-zinc-950 space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 uppercase">
                    <span>{language === "ID" ? "Tahap Akselerasi" : "Acceleration Stage"}</span>
                    <span>{proj.progress}%</span>
                  </div>
                  {/* Progress bar */}
                  <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-[#D4AF37]"
                      style={{ width: `${proj.progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {proj.techStack.map((tech, idx) => (
                    <span key={idx} className="rounded-full bg-zinc-900/60 px-2.5 py-0.5 text-[9px] font-mono text-zinc-400 border border-zinc-950">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal: Add Project */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setShowAddModal(false)} className="fixed inset-0 bg-black/80 backdrop-blur-sm" />

          <div className="relative w-full max-w-lg rounded-2xl border border-zinc-900 bg-zinc-950 p-6 shadow-2xl backdrop-blur-xl max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowAddModal(false)} className="absolute top-4 right-4 text-zinc-500 hover:text-white cursor-pointer">
              <X className="h-4 w-4" />
            </button>

            <h3 className="text-lg font-serif text-white tracking-tight flex items-center gap-2">
              <FolderKanban className="h-5 w-5 text-[#D4AF37]" /> {language === "ID" ? "Inisialisasi Repositori Eksperimental" : "Initialize Experimental Repo"}
            </h3>
            <p className="text-[10px] font-mono text-zinc-500 mt-1 uppercase tracking-wider">SOVEREIGN INCUBATION INTERFACE</p>

            <form onSubmit={handleCreateProject} className="mt-6 space-y-4 text-xs font-sans">
              <div>
                <label className="block text-zinc-500 font-mono mb-1.5 uppercase tracking-wider">
                  {language === "ID" ? "Nama Proyek" : "Project Name"}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Neo-Chronos Indexing Service"
                  className="w-full rounded-xl border border-zinc-900 bg-zinc-950 px-3 py-2 text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-zinc-500 font-mono mb-1.5 uppercase tracking-wider">
                  {language === "ID" ? "Deskripsi" : "Description"}
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={language === "ID" ? "Ringkas tujuan konseptual proyek dan infrastruktur sistem..." : "Summarize the project's conceptual goals and system infrastructure..."}
                  className="w-full rounded-xl border border-zinc-900 bg-zinc-950 px-3 py-2 text-white outline-none resize-none font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-500 font-mono mb-1.5 uppercase tracking-wider">
                    {language === "ID" ? "Tipe Jalur" : "Track Type"}
                  </label>
                  <select
                    value={type}
                    onChange={(e: any) => setType(e.target.value)}
                    className="w-full rounded-xl border border-zinc-900 bg-zinc-950 px-3 py-2 text-white outline-none cursor-pointer"
                  >
                    <option value="Software">Software</option>
                    <option value="AI">AI</option>
                    <option value="Design">Design</option>
                    <option value="Research">Research</option>
                    <option value="Experiment">Experiment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-500 font-mono mb-1.5 uppercase tracking-wider font-sans">Status</label>
                  <select
                    value={status}
                    onChange={(e: any) => setStatus(e.target.value)}
                    className="w-full rounded-xl border border-zinc-900 bg-zinc-950 px-3 py-2 text-white outline-none cursor-pointer"
                  >
                    <option value="Active">{language === "ID" ? "Aktif / Akselerasi" : "Active / Acceleration"}</option>
                    <option value="Completed">{language === "ID" ? "Selesai / Produksi" : "Completed / Production"}</option>
                    <option value="Researching">{language === "ID" ? "Riset / Kelayakan" : "Research / Feasibility"}</option>
                    <option value="On Hold">{language === "ID" ? "Ditunda / Penyimpanan Dingin" : "On Hold / Cold Storage"}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 items-center">
                <div className="col-span-2">
                  <label className="block text-zinc-500 font-mono mb-1.5 uppercase tracking-wider">
                    {language === "ID" ? "Teknologi (pisahkan dengan koma)" : "Tech Stack (comma separated)"}
                  </label>
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    placeholder="e.g. Next.js, Rust, Docker"
                    className="w-full rounded-xl border border-zinc-900 bg-zinc-950 px-3 py-2 text-white outline-none"
                  />
                </div>

                <div className="col-span-1">
                  <label className="block text-zinc-500 font-mono mb-1.5 uppercase tracking-wider">
                    {language === "ID" ? "Kemajuan" : "Progress"} ({progress}%)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={(e) => setProgress(parseInt(e.target.value))}
                    className="w-full cursor-pointer accent-[#D4AF37] h-2 bg-zinc-900 rounded-full"
                  />
                </div>
              </div>

              {/* Actions */}
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
                  {language === "ID" ? "Buat Repositori" : "Create Repo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
