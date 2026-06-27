"use client";

import { createRole } from "../actions";
import { scrapeJobPosting } from "../scrape-action";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PillButton } from "@/components/brand/pill-button";
import { useState } from "react";
import { Loader2, Link as LinkIcon } from "lucide-react";

const inputClass =
  "bg-brand-surface border border-white/10 text-white placeholder:text-white/30 focus-visible:border-white/30 focus-visible:ring-0";
const labelClass = "text-sm font-bold text-white/60 mb-1.5 block";
const selectClass =
  "w-full bg-brand-surface border border-white/10 text-white rounded-lg h-9 px-3 text-sm transition-colors focus:outline-none focus:border-white/30";

export default function NewRolePage() {
  const [importUrl, setImportUrl] = useState("");
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState("");

  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [stage, setStage] = useState("applied");
  const [jobDescription, setJobDescription] = useState("");

  async function handleImport() {
    if (!importUrl.trim()) return;

    setImporting(true);
    setImportError("");

    const { data, error } = await scrapeJobPosting(importUrl.trim());

    if (error) {
      setImportError(error);
      setImporting(false);
      return;
    }

    if (data) {
      if (data.title) setTitle(data.title);
      if (data.company) setCompany(data.company);
      if (data.job_description) setJobDescription(data.job_description);
      setSourceUrl(importUrl.trim());
    }

    setImporting(false);
  }

  return (
    <div className="bg-brand-base -mx-6 -my-10 px-6 py-12 min-h-[calc(100vh-4rem)]">
      <h1 className="text-4xl font-black text-white lowercase tracking-tight mb-8">
        new role
      </h1>

      <div className="max-w-md mb-8 p-4 bg-brand-surface border border-dashed border-white/10 rounded-lg">
        <Label htmlFor="import_url" className={labelClass}>
          import from job posting url
        </Label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <LinkIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-white/30" />
            <Input
              id="import_url"
              value={importUrl}
              onChange={(e) => setImportUrl(e.target.value)}
              placeholder="paste job posting link"
              className={`${inputClass} pl-8`}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleImport();
                }
              }}
            />
          </div>
          <PillButton
            variant="outlined"
            color="white"
            size="sm"
            onClick={handleImport}
            disabled={importing || !importUrl.trim()}
            className="opacity-100 disabled:opacity-30"
          >
            {importing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                importing
              </>
            ) : (
              "import"
            )}
          </PillButton>
        </div>
        {importError && (
          <p className="text-sm text-brand-red mt-2">{importError}</p>
        )}
      </div>

      <form action={createRole} className="max-w-md flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="title" className={labelClass}>title</Label>
          <Input
            id="title"
            name="title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="company" className={labelClass}>company</Label>
          <Input
            id="company"
            name="company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="source_url" className={labelClass}>source url</Label>
          <Input
            id="source_url"
            name="source_url"
            placeholder="link to job posting"
            value={sourceUrl}
            onChange={(e) => setSourceUrl(e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="stage" className={labelClass}>stage</Label>
          <select
            id="stage"
            name="stage"
            value={stage}
            onChange={(e) => setStage(e.target.value)}
            className={selectClass}
          >
            <option value="researching">Researching</option>
            <option value="applied">Applied</option>
            <option value="phone_screen">Phone screen</option>
            <option value="onsite">Onsite</option>
            <option value="offer">Offer</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="job_description" className={labelClass}>job description</Label>
          <Textarea
            id="job_description"
            name="job_description"
            rows={6}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className={inputClass}
          />
        </div>

        <PillButton type="submit" color="orange" className="w-full mt-2">
          save role
        </PillButton>
      </form>
    </div>
  );
}
