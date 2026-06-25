"use client";

import { useRef, useState } from "react";
import { addResume, deleteResume, type ResumeEntry } from "./actions";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

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
        <Card key={r.created_at}>
          <CardContent>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm">{r.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {new Date(r.created_at).toLocaleDateString()}
                </p>
                <p className="text-sm whitespace-pre-wrap mt-2 text-muted-foreground line-clamp-4">
                  {r.text}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-destructive shrink-0"
                onClick={() => deleteResume(r.created_at)}
              >
                Remove
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {adding ? (
        <Card>
          <CardContent>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="label">Label</Label>
                <Input
                  id="label"
                  placeholder='e.g. "Product Manager resume" or "SWE resume"'
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label>Upload a file</Label>
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileChange}
                  disabled={uploading}
                  className="cursor-pointer"
                />
                {uploading && (
                  <p className="text-xs text-muted-foreground">
                    Extracting text...
                  </p>
                )}
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-card px-2 text-xs text-muted-foreground">
                    or paste text
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="text">Resume text</Label>
                <Textarea
                  id="text"
                  placeholder="Paste your resume content here"
                  rows={8}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <div className="flex gap-2">
                <Button size="sm" onClick={handleAdd}>
                  Save
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetForm}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button
          variant="outline"
          size="sm"
          className="self-start"
          onClick={() => setAdding(true)}
        >
          Add resume
        </Button>
      )}
    </div>
  );
}
