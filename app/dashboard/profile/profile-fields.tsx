"use client";

import { useState } from "react";
import { saveProfile } from "./actions";
import { PillButton } from "@/components/brand/pill-button";

type Field = {
  name: string;
  label: string;
  placeholder: string;
  value: string;
  inputType?: "url";
};

export function ProfileFields({ fields }: { fields: Field[] }) {
  const [editing, setEditing] = useState(false);
  const hasContent = fields.some((f) => f.value);

  async function handleSave(formData: FormData) {
    await saveProfile(formData);
    setEditing(false);
  }

  if (!editing) {
    return (
      <div className="flex flex-col gap-4">
        {hasContent ? (
          fields.map((field) => (
            <div key={field.name} className="bg-brand-surface rounded-2xl p-5">
              <p className="text-xs font-black uppercase tracking-widest text-white/30 mb-2">
                {field.label}
              </p>
              {field.value ? (
                field.inputType === "url" ? (
                  <a
                    href={field.value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-white/80 underline underline-offset-4 hover:text-white transition-colors"
                  >
                    {field.value}
                  </a>
                ) : (
                  <p className="text-sm text-white/70 whitespace-pre-wrap leading-relaxed">{field.value}</p>
                )
              ) : (
                <p className="text-sm text-white/25 italic">not filled in</p>
              )}
            </div>
          ))
        ) : (
          <p className="text-sm text-white/40">
            No details yet. Add information about your background to get personalized answers.
          </p>
        )}
        <PillButton
          variant="outlined"
          color="white"
          size="sm"
          className="self-start mt-1"
          onClick={() => setEditing(true)}
        >
          {hasContent ? "edit" : "add details"}
        </PillButton>
      </div>
    );
  }

  return (
    <form action={handleSave} className="flex flex-col gap-4">
      {fields.map((field) => (
        <div key={field.name} className="bg-brand-surface rounded-2xl p-5">
          <label
            htmlFor={field.name}
            className="text-xs font-black uppercase tracking-widest text-white/40"
          >
            {field.label}
          </label>
          {field.inputType === "url" ? (
            <input
              id={field.name}
              name={field.name}
              type="url"
              placeholder={field.placeholder}
              defaultValue={field.value}
              className="mt-3 w-full bg-brand-base border border-white/10 text-white placeholder:text-white/20 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-white/30 transition-colors"
            />
          ) : (
            <textarea
              id={field.name}
              name={field.name}
              placeholder={field.placeholder}
              defaultValue={field.value}
              rows={5}
              className="mt-3 w-full bg-brand-base border border-white/10 text-white placeholder:text-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/30 transition-colors resize-none"
            />
          )}
        </div>
      ))}

      <div className="flex items-center gap-3 mt-1">
        <PillButton type="submit" color="orange" size="sm">save</PillButton>
        <button
          type="button"
          onClick={() => setEditing(false)}
          className="text-xs font-bold text-white/30 hover:text-white transition-colors"
        >
          cancel
        </button>
      </div>
    </form>
  );
}
