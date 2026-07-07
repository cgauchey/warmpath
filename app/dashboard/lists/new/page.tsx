import { createList } from "../actions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PillButton } from "@/components/brand/pill-button";

const inputClass =
  "bg-brand-surface border border-white/10 text-white placeholder:text-white/30 focus-visible:border-white/30 focus-visible:ring-0";
const labelClass = "text-sm font-bold text-white/60 mb-1.5 block";

export default function NewListPage() {
  return (
    <div className="bg-brand-base -mx-6 -my-10 px-6 py-12 min-h-[calc(100vh-4rem)]">
      <h1 className="text-4xl font-black text-white lowercase tracking-tight mb-8">
        new list
      </h1>

      <form action={createList} className="max-w-md flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name" className={labelClass}>name</Label>
          <Input
            id="name"
            name="name"
            required
            placeholder="e.g. fintech targets, bay area 2026"
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="description" className={labelClass}>description</Label>
          <Textarea
            id="description"
            name="description"
            rows={3}
            placeholder="optional note about this list"
            className={inputClass}
          />
        </div>

        <PillButton type="submit" color="orange" className="w-full mt-2">
          create list
        </PillButton>
      </form>
    </div>
  );
}
