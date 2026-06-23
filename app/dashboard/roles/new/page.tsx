"use client";

import { createRole } from "../actions";
import { scrapeJobPosting } from "../scrape-action";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Loader2, Link as LinkIcon } from "lucide-react";

export default function NewRolePage() {
  const [importUrl, setImportUrl] = useState("");
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState("");

  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [stage, setStage] = useState("researching");
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
    <div>
      <h1 className="text-2xl font-semibold tracking-tight mb-8">New role</h1>

      <div className="max-w-md mb-8 p-4 border border-dashed border-muted-foreground/30 rounded-lg">
        <Label htmlFor="import_url" className="text-sm font-medium mb-1.5 block">
          Import from job posting URL
        </Label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <LinkIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="import_url"
              value={importUrl}
              onChange={(e) => setImportUrl(e.target.value)}
              placeholder="Paste job posting link"
              className="pl-8"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleImport();
                }
              }}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={handleImport}
            disabled={importing || !importUrl.trim()}
          >
            {importing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                Importing
              </>
            ) : (
              "Import"
            )}
          </Button>
        </div>
        {importError && (
          <p className="text-sm text-destructive mt-2">{importError}</p>
        )}
      </div>

      <form action={createRole} className="max-w-md flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="company">Company</Label>
          <Input
            id="company"
            name="company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="source_url">Source URL</Label>
          <Input
            id="source_url"
            name="source_url"
            placeholder="Link to job posting"
            value={sourceUrl}
            onChange={(e) => setSourceUrl(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="stage">Stage</Label>
          <select
            id="stage"
            name="stage"
            value={stage}
            onChange={(e) => setStage(e.target.value)}
            className="w-full border border-input rounded-md h-9 px-3 text-sm bg-transparent"
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
          <Label htmlFor="job_description">Job description</Label>
          <Textarea
            id="job_description"
            name="job_description"
            rows={6}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
        </div>

        <Button type="submit" className="w-full mt-2">Save role</Button>
      </form>
    </div>
  );
}
