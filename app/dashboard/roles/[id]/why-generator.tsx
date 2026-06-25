"use client";

import { useState } from "react";
import { saveWhyAnswer, extractVoiceInsights } from "./actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

type Resume = { label: string; text: string; created_at: string };

export function WhyGenerator({
  roleId,
  sourceUrl,
  resumes,
}: {
  roleId: string;
  sourceUrl: string | null;
  resumes: Resume[];
}) {
  const [questionType, setQuestionType] = useState("why_role");
  const [selectedResumes, setSelectedResumes] = useState<number[] | "all">(
    "all"
  );
  const [answer, setAnswer] = useState("");
  const [generatedText, setGeneratedText] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  function toggleResume(index: number) {
    if (selectedResumes === "all") {
      const allIndexes = resumes.map((_, i) => i).filter((i) => i !== index);
      setSelectedResumes(allIndexes);
    } else {
      const next = selectedResumes.includes(index)
        ? selectedResumes.filter((i) => i !== index)
        : [...selectedResumes, index];
      if (next.length === resumes.length) {
        setSelectedResumes("all");
      } else {
        setSelectedResumes(next);
      }
    }
  }

  function toggleAll() {
    if (selectedResumes === "all") {
      setSelectedResumes([]);
    } else {
      setSelectedResumes("all");
    }
  }

  function isSelected(index: number) {
    return selectedResumes === "all" || selectedResumes.includes(index);
  }

  async function handleGenerate() {
    setError("");
    setAnswer("");
    setGeneratedText("");
    setSaved(false);
    setStreaming(true);

    try {
      const res = await fetch("/api/why-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roleId,
          questionType,
          resumeIndexes: selectedResumes,
        }),
      });

      if (!res.ok) {
        const json = await res.json();
        setError(json.error || "Something went wrong");
        setStreaming(false);
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) {
        setError("No response stream");
        setStreaming(false);
        return;
      }

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
            if (
              parsed.type === "content_block_delta" &&
              parsed.delta?.type === "text_delta"
            ) {
              accumulated += parsed.delta.text;
              setAnswer(accumulated);
            }
          } catch {
            // incomplete JSON, skip
          }
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
    setSaved(true);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="question_type">Question</Label>
        <select
          id="question_type"
          value={questionType}
          onChange={(e) => setQuestionType(e.target.value)}
          className="w-full border border-input rounded-lg h-9 px-3 text-sm bg-transparent text-foreground transition-colors focus:border-ring focus:ring-3 focus:ring-ring/50 focus:outline-none"
        >
          <option value="why_role">Why this role?</option>
          <option value="why_company">Why this company?</option>
          <option value="both">Why this role and company?</option>
        </select>
      </div>

      {resumes.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <Label>Resume</Label>
          <div className="flex flex-col gap-1">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={selectedResumes === "all"}
                onChange={toggleAll}
                className="rounded"
              />
              All resumes
            </label>
            {resumes.map((r, i) => (
              <label
                key={r.created_at}
                className="flex items-center gap-2 text-sm cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={isSelected(i)}
                  onChange={() => toggleResume(i)}
                  className="rounded"
                />
                {r.label}
              </label>
            ))}
          </div>
        </div>
      )}

      <Button
        size="sm"
        className="self-start"
        onClick={handleGenerate}
        disabled={streaming}
      >
        {streaming ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
            Generating
          </>
        ) : (
          "Generate answer"
        )}
      </Button>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {answer && (
        <div className="flex flex-col gap-3">
          <Textarea
            value={answer}
            onChange={(e) => {
              setAnswer(e.target.value);
              setSaved(false);
            }}
            rows={10}
            disabled={streaming}
          />
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              onClick={handleSave}
              disabled={saving || streaming || !answer.trim()}
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                  Saving
                </>
              ) : (
                "Save"
              )}
            </Button>
            {saved && (
              <p className="text-sm text-muted-foreground">Saved</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
