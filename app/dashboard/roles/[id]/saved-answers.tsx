"use client";

import { useState } from "react";
import { updateWhyAnswer, extractVoiceInsights } from "./actions";
import { Loader2 } from "lucide-react";
import { PillButton } from "@/components/brand/pill-button";

const QUESTION_LABELS: Record<string, string> = {
  why_role:    "why this role?",
  why_company: "why this company?",
  both:        "why this role and company?",
};

type SavedAnswer = {
  id: string;
  question_type: string;
  answer_text: string;
  created_at: string;
};

export function SavedAnswers({ answers, roleId }: { answers: SavedAnswer[]; roleId: string }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [saving, setSaving] = useState(false);

  function startEdit(answer: SavedAnswer) {
    setEditingId(answer.id);
    setEditText(answer.answer_text);
  }

  async function handleSave(answer: SavedAnswer) {
    if (!editText.trim()) return;
    setSaving(true);
    const final = editText.trim();
    await updateWhyAnswer(answer.id, roleId, final);
    if (final !== answer.answer_text) {
      extractVoiceInsights(answer.answer_text, final).catch(() => {});
    }
    setSaving(false);
    setEditingId(null);
  }

  if (answers.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      {answers.map((answer) => (
        <div key={answer.id} className="bg-brand-surface rounded-2xl p-5">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-black uppercase tracking-widest text-white/30">
              {QUESTION_LABELS[answer.question_type] ?? answer.question_type}
            </p>
            {editingId !== answer.id && (
              <button
                onClick={() => startEdit(answer)}
                className="text-xs font-bold text-white/30 hover:text-white transition-colors lowercase"
              >
                edit
              </button>
            )}
          </div>
          <p className="text-xs text-white/20 mb-3">
            {new Date(answer.created_at).toLocaleDateString()}
          </p>

          {editingId === answer.id ? (
            <div className="flex flex-col gap-3">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                rows={6}
                className="w-full bg-brand-base border border-white/10 text-white placeholder:text-white/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/30 resize-none"
              />
              <div className="flex items-center gap-3">
                <PillButton size="sm" color="orange" onClick={() => handleSave(answer)} disabled={saving}>
                  {saving ? <><Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />saving</> : "save"}
                </PillButton>
                <button
                  onClick={() => setEditingId(null)}
                  className="text-xs font-bold text-white/30 hover:text-white transition-colors lowercase"
                >
                  cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-white/70 whitespace-pre-wrap leading-relaxed">{answer.answer_text}</p>
          )}
        </div>
      ))}
    </div>
  );
}
