"use client";

import { createCompany } from "../actions";
import { scrapeCompanyPage } from "../scrape-action";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PillButton } from "@/components/brand/pill-button";
import { useState } from "react";
import { Loader2, Link as LinkIcon } from "lucide-react";

const inputClass =
  "bg-brand-surface border border-white/10 text-white placeholder:text-white/30 focus-visible:border-white/30 focus-visible:ring-0";
const labelClass = "text-sm font-bold text-white/60 mb-1.5 block";

export default function NewCompanyPage() {
  const [importUrl, setImportUrl] = useState("");
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState("");

  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");

  async function handleImport() {
    if (!importUrl.trim()) return;
    setImporting(true);
    setImportError("");

    const { data, error } = await scrapeCompanyPage(importUrl.trim());

    if (error) {
      setImportError(error);
      setImporting(false);
      return;
    }

    if (data) {
      if (data.name) setName(data.name);
      if (data.description) setDescription(data.description);
      setWebsite(importUrl.trim());
    }

    setImporting(false);
  }

  return (
    <div className="bg-brand-base -mx-6 -my-10 px-6 py-12 min-h-[calc(100vh-4rem)]">
      <h1 className="text-4xl font-black text-white lowercase tracking-tight mb-8">
        new company
      </h1>

      <div className="max-w-md mb-8 p-4 bg-brand-surface border border-dashed border-white/10 rounded-lg">
        <Label htmlFor="import_url" className={labelClass}>
          import from company website
        </Label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <LinkIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-white/30" />
            <Input
              id="import_url"
              value={importUrl}
              onChange={(e) => setImportUrl(e.target.value)}
              placeholder="paste company url"
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

      <form action={createCompany} className="max-w-md flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name" className={labelClass}>name</Label>
          <Input
            id="name"
            name="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="website" className={labelClass}>website</Label>
          <Input
            id="website"
            name="website"
            placeholder="https://"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="linkedin_url" className={labelClass}>linkedin url</Label>
          <Input
            id="linkedin_url"
            name="linkedin_url"
            placeholder="https://linkedin.com/company/..."
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="industry" className={labelClass}>industry</Label>
          <Input
            id="industry"
            name="industry"
            placeholder="e.g. fintech, healthcare, saas"
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="size" className={labelClass}>size</Label>
          <Input
            id="size"
            name="size"
            placeholder="e.g. 50–200, series b"
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="description" className={labelClass}>description</Label>
          <Textarea
            id="description"
            name="description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="notes" className={labelClass}>notes</Label>
          <Textarea
            id="notes"
            name="notes"
            rows={3}
            placeholder="your personal notes about this company"
            className={inputClass}
          />
        </div>

        <PillButton type="submit" color="orange" className="w-full mt-2">
          save company
        </PillButton>
      </form>
    </div>
  );
}
