"use client";

import { useRef, useState } from "react";
import { addResume, deleteResume, type ResumeEntry } from "./actions";
import { PillButton } from "@/components/brand/pill-button";

export function ResumeManager({ resumes }: { resumes: ResumeEntry[] }) {
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [label, setLabel] = useState("");
  const [text, setText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    const body = new FormData();
    body.append("file", file);

    const res = await fetch("/api/parse-resume", { method: "POST", body });
    const json = await res.json();

    if (json.error) {
      setError(json.error);
      setUploading(false);
      return;
    }

    setText(json.data.text);
    if (!label) setLabel(json.data.fileName);
    setUploading(false);
  }

  async function handleAdd() {
    setError("");
    if (!text.trim()) {
      setError("Upload a file or paste resume text");
      return;
    }
    const formData = new FormData();
    formData.set("label", label || "Untitled");
    formData.set("text", text);
    const result = await addResume(formData);
    if (result?.error) {
      setError(result.error);
      return;
    }
    resetForm();
  }

  function resetForm() {
    setAdding(false);
    setError("");
    setLabel("");
    setText("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div className="flex flex-col gap-3">
      {resumes.map((r) => (
        <div key={r.created_at} className="bg-brand-surface rounded-2xl p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <p className="font-bold text-white text-sm">{r.label}</p>
              <p className="text-xs text-white/30 mt-0.5">
                {new Date(r.created_at).toLocaleDateString()}
              </p>
              <p className="text-sm whitespace-pre-wrap mt-2 text-white/40 line-clamp-4">
                {r.text}
              </p>
            </div>
            <button
              className="text-xs font-bold text-brand-red/50 hover:text-brand-red transition-colors shrink-0"
              onClick={() => deleteResume(r.created_at)}
            >
              remove
            </button>
          </div>
        </div>
      ))}

      {adding ? (
        <div className="bg-brand-surface rounded-2xl p-5">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="label" className="text-xs font-black uppercase tracking-widest text-white/40">Label</label>
              <input
                id="label"
                placeholder='e.g. "Product Manager resume" or "SWE resume"'
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="w-full bg-brand-base border border-white/10 text-white placeholder:text-white/20 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-white/30 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black uppercase tracking-widest text-white/40">Upload a file</label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileChange}
                disabled={uploading}
                className="text-sm text-white/60 file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-white/10 file:text-white hover:file:bg-white/20 file:cursor-pointer cursor-pointer"
              />
              {uploading && (
                <p className="text-xs text-white/40">Extracting text...</p>
              )}
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-brand-surface px-3 text-xs text-white/30">or paste text</span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="text" className="text-xs font-black uppercase tracking-widest text-white/40">Resume text</label>
              <textarea
                id="text"
                placeholder="Paste your resume content here"
                rows={8}
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full bg-brand-base border border-white/10 text-white placeholder:text-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/30 transition-colors resize-none"
              />
            </div>

            {error && <p className="text-sm text-brand-red">{error}</p>}

            <div className="flex items-center gap-3">
              <PillButton size="sm" color="orange" onClick={handleAdd}>save</PillButton>
              <button
                onClick={resetForm}
                className="text-xs font-bold text-white/30 hover:text-white transition-colors"
              >
                cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        <PillButton
          variant="outlined"
          color="white"
          size="sm"
          className="self-start"
          onClick={() => setAdding(true)}
        >
          add resume
        </PillButton>
      )}
    </div>
  );
}
