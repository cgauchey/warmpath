"use client";

import { useState } from "react";
import { updateWhyAnswer } from "./actions";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const QUESTION_LABELS: Record<string, string> = {
  why_role: "Why this role?",
  why_company: "Why this company?",
  both: "Why this role and company?",
};

type SavedAnswer = {
  id: string;
  question_type: string;
  answer_text: string;
  created_at: string;
};

export function SavedAnswers({
  answers,
  roleId,
}: {
  answers: SavedAnswer[];
  roleId: string;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [saving, setSaving] = useState(false);

  function startEdit(answer: SavedAnswer) {
    setEditingId(answer.id);
    setEditText(answer.answer_text);
  }

  async function handleSave(answerId: string) {
    if (!editText.trim()) return;
    setSaving(true);
    await updateWhyAnswer(answerId, roleId, editText.trim());
    setSaving(false);
    setEditingId(null);
  }

  if (answers.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      {answers.map((answer) => (
        <Card key={answer.id}>
          <CardContent>
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                {QUESTION_LABELS[answer.question_type] ?? answer.question_type}
              </p>
              {editingId !== answer.id && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                  onClick={() => startEdit(answer)}
                >
                  Edit
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              {new Date(answer.created_at).toLocaleDateString()}
            </p>

            {editingId === answer.id ? (
              <div className="flex flex-col gap-3">
                <Textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  rows={6}
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleSave(answer.id)}
                    disabled={saving}
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
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingId(null)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm whitespace-pre-wrap">{answer.answer_text}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
