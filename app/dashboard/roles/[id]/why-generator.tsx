"use client";

import { useState } from "react";
import { saveWhyAnswer, extractVoiceInsights, updateGenerationNotes } from "./actions";
import { PillButton } from "@/components/brand/pill-button";
import { Loader2 } from "lucide-react";

type Resume = { label: string; text: string; created_at: string };

export function WhyGenerator({
  roleId,
  sourceUrl,
  resumes,
  generationNotes,
}: {
  roleId: string;
  sourceUrl: string | null;
  resumes: Resume[];
  generationNotes: string | null;
}) {
  const [questionType, setQuestionType] = useState("why_role");
  const [selectedResumes, setSelectedResumes] = useState<number[] | "all">("all");
  const [notes, setNotes] = useState(generationNotes ?? "");
  const [answer, setAnswer] = useState("");
  const [generatedText, setGeneratedText] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function toggleResume(index: number) {
    if (selectedResumes === "all") {
      const allIndexes = resumes.map((_, i) => i).filter((i) => i !== index);
      setSelectedResumes(allIndexes);
    } else {
      const next = selectedResumes.includes(index)
        ? selectedResumes.filter((i) => i !== index)
        : [...selectedResumes, index];
      setSelectedResumes(next.length === resumes.length ? "all" : next);
    }
  }

  function toggleAll() {
    setSelectedResumes(selectedResumes === "all" ? [] : "all");
  }

  function isSelected(index: number) {
    return selectedResumes === "all" || selectedResumes.includes(index);
  }

  async function handleGenerate() {
    setError("");
    setAnswer("");
    setGeneratedText("");
    setStreaming(true);
    updateGenerationNotes(roleId, notes.trim() || null).catch(() => {});

    try {
      const res = await fetch("/api/why-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roleId,
          questionType,
          resumeIndexes: selectedResumes,
          additionalContext: notes.trim() || null,
        }),
      });

      if (!res.ok) {
        const json = await res.json();
        setError(json.error || "Something went wrong");
        setStreaming(false);
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) { setError("No response stream"); setStreaming(false); return; }

      const decoder = new TextDecoder();
      let accumulated = "";
      let partial = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        partial += decoder.decode(value, { stream: true });
        const lines = partial.split("\n");
        partial = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const parsed = JSON.parse(line);
            if (parsed.type === "content_block_delta" && parsed.delta?.type === "text_delta") {
              accumulated += parsed.delta.text;
              setAnswer(accumulated);
            }
          } catch { /* incomplete JSON */ }
        }
      }

      setGeneratedText(accumulated);
    } catch {
      setError("Failed to generate answer");
    }

    setStreaming(false);
  }

  async function handleSave() {
    if (!answer.trim()) return;
    setSaving(true);
    const final = answer.trim();
    await saveWhyAnswer(roleId, questionType, final, sourceUrl, generatedText);
    if (final !== generatedText) {
      extractVoiceInsights(generatedText, final).catch(() => {});
    }
    setSaving(false);
    setAnswer("");
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-black uppercase tracking-widest text-white/40">Question</label>
        <select
          value={questionType}
          onChange={(e) => setQuestionType(e.target.value)}
          className="w-full bg-brand-surface border border-white/10 text-white rounded-full px-5 py-2.5 text-sm font-medium focus:outline-none focus:border-white/30 transition-colors appearance-none cursor-pointer"
        >
          <option value="why_role">Why this role?</option>
          <option value="why_company">Why this company?</option>
          <option value="both">Why this role and company?</option>
        </select>
      </div>

      {resumes.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-black uppercase tracking-widest text-white/40">Resume</label>
          <div className="flex flex-col gap-1.5">
            <label className="flex items-center gap-2.5 text-sm text-white/60 cursor-pointer">
              <input type="checkbox" checked={selectedResumes === "all"} onChange={toggleAll} className="accent-brand-orange" />
              All resumes
            </label>
            {resumes.map((r, i) => (
              <label key={r.created_at} className="flex items-center gap-2.5 text-sm text-white/60 cursor-pointer">
                <input type="checkbox" checked={isSelected(i)} onChange={() => toggleResume(i)} className="accent-brand-orange" />
                {r.label}
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-black uppercase tracking-widest text-white/40">
          Anything else to include?
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. I spoke with someone on the team, I love their recent product launch…"
          rows={3}
          disabled={streaming}
          className="w-full bg-brand-surface border border-white/10 text-white placeholder:text-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/30 transition-colors resize-none"
        />
      </div>

      <PillButton color="orange" size="md" onClick={handleGenerate} disabled={streaming} className="self-start">
        {streaming ? <><Loader2 className="h-4 w-4 animate-spin mr-1.5" />generating</> : "generate answer"}
      </PillButton>

      {error && <p className="text-sm text-brand-red">{error}</p>}

      {answer && (
        <div className="flex flex-col gap-3">
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows={10}
            disabled={streaming}
            className="w-full bg-brand-surface border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/30 transition-colors resize-none"
          />
          <div className="flex items-center gap-3">
            <PillButton size="sm" color="orange" onClick={handleSave} disabled={saving || streaming || !answer.trim()}>
              {saving ? <><Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />saving</> : "save"}
            </PillButton>
            <button
              onClick={() => setAnswer("")}
              disabled={saving || streaming}
              className="text-xs font-bold text-white/30 hover:text-white transition-colors lowercase"
            >
              cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
