import React, { useState } from "react";
import { PersonalNote } from "../types";
import { Search, Plus, BookOpen, Tag, Calendar, Folder, X, Check, Eye } from "lucide-react";
import { getTranslation, Language } from "../lib/translations";

interface KnowledgeViewProps {
  notes: PersonalNote[];
  onAddNote: (note: PersonalNote) => void;
  addToast: (msg: string, type: "success" | "error" | "info") => void;
  language: Language;
}

export const KnowledgeView: React.FC<KnowledgeViewProps> = ({
  notes,
  onAddNote,
  addToast,
  language,
}) => {
  const t = getTranslation(language);
  const [selectedNote, setSelectedNote] = useState<PersonalNote | null>(notes[0] || null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Macroeconomics");
  const [tagsInput, setTagsInput] = useState("");

  const categories = ["ALL", ...Array.from(new Set(notes.map((n) => n.category)))];

  // Filtering
  const filteredNotes = notes.filter((note) => {
    const matchesSearch = note.title.toLowerCase().includes(search.toLowerCase()) ||
                          note.content.toLowerCase().includes(search.toLowerCase()) ||
                          note.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = categoryFilter === "ALL" || note.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Simple Markdown Renderer
  const renderMarkdown = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      if (line.startsWith("### ")) {
        return <h4 key={idx} className="text-sm font-semibold font-sans tracking-wide text-white mt-4 mb-2 uppercase">{line.slice(4)}</h4>;
      }
      if (line.startsWith("## ")) {
        return <h3 key={idx} className="text-base font-serif text-[#D4AF37] mt-6 mb-3 border-b border-zinc-900 pb-1">{line.slice(3)}</h3>;
      }
      if (line.startsWith("# ")) {
        return <h2 key={idx} className="text-lg font-serif text-white mt-8 mb-4">{line.slice(2)}</h2>;
      }
      if (line.startsWith("- ")) {
        return <li key={idx} className="text-xs text-zinc-300 leading-relaxed font-sans ml-4 list-disc mb-1">{line.slice(2)}</li>;
      }
      if (line.startsWith("1. ")) {
        return <li key={idx} className="text-xs text-zinc-300 leading-relaxed font-sans ml-4 list-decimal mb-1">{line.slice(3)}</li>;
      }
      if (line.trim() === "") {
        return <div key={idx} className="h-2" />;
      }
      // Inline formatting replacements
      let contentStr = line;
      // Bold **text**
      const boldRegex = /\*\*(.*?)\*\*/g;
      const parts = [];
      let lastIndex = 0;
      let match;
      while ((match = boldRegex.exec(contentStr)) !== null) {
        if (match.index > lastIndex) {
          parts.push(contentStr.substring(lastIndex, match.index));
        }
        parts.push(<strong key={match.index} className="text-white font-semibold">{match[1]}</strong>);
        lastIndex = boldRegex.lastIndex;
      }
      if (lastIndex < contentStr.length) {
        parts.push(contentStr.substring(lastIndex));
      }

      return (
        <p key={idx} className="text-xs leading-relaxed text-zinc-300 font-sans mb-3">
          {parts.length > 0 ? parts : contentStr}
        </p>
      );
    });
  };

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      addToast(
        language === "ID" ? "Harap berikan judul dan konten catatan riset." : "Please provide a title and note body content.",
        "error"
      );
      return;
    }

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const newNote: PersonalNote = {
      id: `note-${Date.now()}`,
      title,
      content,
      category,
      tags,
      date: new Date().toISOString().split("T")[0],
    };

    onAddNote(newNote);
    setShowAddModal(false);
    setSelectedNote(newNote);
    addToast(
      language === "ID" 
        ? `Berhasil menyimpan catatan: "${title}" ke dalam Second Brain Anda.`
        : `Successfully logged note: "${title}" to your Second Brain.`,
      "success"
    );

    // Reset Form
    setTitle("");
    setContent("");
    setTagsInput("");
  };

  return (
    <div className="space-y-8 py-8 px-4 sm:px-6 md:px-8 max-w-6xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono tracking-wider text-zinc-500 uppercase">
            {language === "ID" ? "Inti Pengetahuan" : "Knowledge Core"}
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-white tracking-tight mt-1">{t.knowledge}</h2>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="rounded-full bg-gradient-to-r from-amber-500 to-[#D4AF37] px-5 py-2 text-xs font-semibold text-black hover:opacity-95 shadow-[0_0_15px_rgba(212,175,55,0.15)] flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Plus className="h-4 w-4" /> {language === "ID" ? "Tulis Catatan" : "Compose Note"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Notes Catalog Column */}
        <div className="lg:col-span-1 space-y-4">
          {/* Search box */}
          <div className="flex items-center gap-2 border border-zinc-900 bg-zinc-950/80 rounded-xl px-3 py-2 text-xs">
            <Search className="h-4 w-4 text-zinc-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={language === "ID" ? "Cari berdasarkan judul, isi, atau tag..." : "Search by title, body, or tags..."}
              className="w-full bg-transparent text-white placeholder-zinc-500 outline-none"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5 border-b border-zinc-900 pb-3">
            {categories.map((cat, i) => (
              <button
                key={i}
                onClick={() => setCategoryFilter(cat)}
                className={`rounded px-2.5 py-1 text-[10px] font-mono border transition-all ${
                  categoryFilter === cat
                    ? "border-[#D4AF37] bg-[#D4AF37]/5 text-[#D4AF37]"
                    : "border-zinc-950 bg-zinc-950/10 text-zinc-500 hover:text-white"
                }`}
              >
                {cat === "ALL" ? (language === "ID" ? "Semua" : "All") : cat}
              </button>
            ))}
          </div>

          {/* List of filtered notes */}
          <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto">
            {filteredNotes.length === 0 ? (
              <div className="py-12 text-center text-xs text-zinc-500 font-mono">
                {language === "ID" ? "Tidak ada catatan buku yang cocok." : "No matching notebook entries."}
              </div>
            ) : (
              filteredNotes.map((note) => (
                <button
                  key={note.id}
                  onClick={() => setSelectedNote(note)}
                  className={`w-full text-left rounded-xl border p-4 transition-all duration-200 cursor-pointer ${
                    selectedNote?.id === note.id
                      ? "border-[#D4AF37] bg-[#D4AF37]/5"
                      : "border-zinc-900 bg-zinc-950/20 hover:border-zinc-800"
                  }`}
                >
                  <div className="flex items-center justify-between text-[9px] font-mono text-zinc-500">
                    <span className="uppercase">{note.category}</span>
                    <span>{note.date}</span>
                  </div>
                  <h4 className={`text-xs font-semibold mt-2 ${selectedNote?.id === note.id ? "text-[#D4AF37]" : "text-white group-hover:text-[#D4AF37]"}`}>
                    {note.title}
                  </h4>
                  <p className="text-[10px] text-zinc-500 mt-1 line-clamp-2 leading-relaxed">
                    {note.content.replace(/[#*`]/g, "")}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right Note Detail Column */}
        <div className="lg:col-span-2">
          {selectedNote ? (
            <div className="rounded-2xl border border-zinc-900 bg-zinc-950/30 p-6 sm:p-8 backdrop-blur-md space-y-6">
              {/* Header block */}
              <div className="space-y-3 pb-6 border-b border-zinc-900">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#D4AF37] uppercase flex items-center gap-1.5">
                    <Folder className="h-3.5 w-3.5" /> {selectedNote.category}
                  </span>
                  <span className="text-zinc-500 flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" /> {selectedNote.date}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-serif text-white tracking-tight">{selectedNote.title}</h3>
                
                {/* Tags row */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {selectedNote.tags.map((tag, i) => (
                    <span key={i} className="rounded text-[9px] font-mono text-amber-500/80 bg-amber-500/3 px-2 py-0.5 border border-amber-500/5 flex items-center gap-1">
                      <Tag className="h-2 w-2" /> #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Parsed content block */}
              <div className="text-xs leading-relaxed text-zinc-300 font-sans prose prose-invert max-w-none">
                {renderMarkdown(selectedNote.content)}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-zinc-900 bg-zinc-950/10 p-12 text-center text-xs text-zinc-500 font-mono">
              {language === "ID" ? "Pilih atau buat catatan penelitian dari panel untuk membuka." : "Select or create a research note from the panel to open."}
            </div>
          )}
        </div>
      </div>

      {/* Modal: Compose Note */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setShowAddModal(false)} className="fixed inset-0 bg-black/80 backdrop-blur-sm" />

          <div className="relative w-full max-w-lg rounded-2xl border border-zinc-900 bg-zinc-950 p-6 shadow-2xl backdrop-blur-xl max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowAddModal(false)} className="absolute top-4 right-4 text-zinc-500 hover:text-white cursor-pointer">
              <X className="h-4 w-4" />
            </button>

            <h3 className="text-lg font-serif text-white tracking-tight flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-[#D4AF37]" /> {language === "ID" ? "Tulis Catatan Riset" : "Compose Research Note"}
            </h3>
            <p className="text-[10px] font-mono text-zinc-500 mt-1 uppercase tracking-wider">SOVEREIGN CORE ENTRY MODULE</p>

            <form onSubmit={handleCreateNote} className="mt-6 space-y-4 text-xs font-sans">
              <div>
                <label className="block text-zinc-500 font-mono mb-1.5 uppercase tracking-wider">
                  {language === "ID" ? "Judul Catatan" : "Note Title"}
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Geopolitical ramifications of rare earth mining caps"
                  className="w-full rounded-xl border border-zinc-900 bg-zinc-950 px-3 py-2 text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-500 font-mono mb-1.5 uppercase tracking-wider">
                    {language === "ID" ? "Kategori" : "Category"}
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl border border-zinc-900 bg-zinc-950 px-3 py-2 text-white outline-none cursor-pointer"
                  >
                    <option value="Macroeconomics">Macroeconomics</option>
                    <option value="Artificial Intelligence">Artificial Intelligence</option>
                    <option value="Trading">Trading</option>
                    <option value="Technology">Technology</option>
                    <option value="Philosophy">Philosophy</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-500 font-mono mb-1.5 uppercase tracking-wider">
                    {language === "ID" ? "Tag (pisahkan dengan koma)" : "Tags (comma separated)"}
                  </label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="e.g. RareEarths, China, ESG"
                    className="w-full rounded-xl border border-zinc-900 bg-zinc-950 px-3 py-2 text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-500 font-mono mb-1.5 uppercase tracking-wider">
                  {language === "ID" ? "Isi Konten (mendukung tajuk ## dan #)" : "Content Body (supports headers ## and #)"}
                </label>
                <textarea
                  required
                  rows={8}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={language === "ID" ? "Tulis tesis Anda menggunakan tajuk markdown dan poin-poin..." : "Write your thesis using markdown headers and bullet points..."}
                  className="w-full rounded-xl border border-zinc-900 bg-zinc-950 px-3 py-2 text-white outline-none font-sans resize-none"
                />
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
                  {language === "ID" ? "Simpan Catatan" : "Commit Entry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
