"use client";

import { useState } from "react";
import { saveProfile } from "./actions";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

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
            <Card key={field.name}>
              <CardContent>
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
                  {field.label}
                </p>
                {field.value ? (
                  field.inputType === "url" ? (
                    <a
                      href={field.value}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-foreground underline underline-offset-4 hover:text-muted-foreground transition-colors"
                    >
                      {field.value}
                    </a>
                  ) : (
                    <p className="text-sm whitespace-pre-wrap">{field.value}</p>
                  )
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    Not filled in
                  </p>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">
            No details yet. Add information about your background to get
            personalized answers.
          </p>
        )}
        <Button
          variant="outline"
          size="sm"
          className="self-start"
          onClick={() => setEditing(true)}
        >
          {hasContent ? "Edit" : "Add details"}
        </Button>
      </div>
    );
  }

  return (
    <form action={handleSave} className="flex flex-col gap-5">
      {fields.map((field) => (
        <Card key={field.name}>
          <CardContent>
            <Label
              htmlFor={field.name}
              className="text-xs uppercase tracking-wide text-muted-foreground"
            >
              {field.label}
            </Label>
            {field.inputType === "url" ? (
              <Input
                id={field.name}
                name={field.name}
                type="url"
                placeholder={field.placeholder}
                defaultValue={field.value}
                className="mt-2"
              />
            ) : (
              <Textarea
                id={field.name}
                name={field.name}
                placeholder={field.placeholder}
                defaultValue={field.value}
                rows={5}
                className="mt-2"
              />
            )}
          </CardContent>
        </Card>
      ))}

      <div className="flex gap-2">
        <Button type="submit" size="sm">
          Save
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setEditing(false)}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
