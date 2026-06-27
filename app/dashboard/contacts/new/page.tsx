import { createContact } from "../actions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PillButton } from "@/components/brand/pill-button";

const inputClass =
  "bg-brand-surface border border-white/10 text-white placeholder:text-white/30 focus-visible:border-white/30 focus-visible:ring-0";
const labelClass = "text-sm font-bold text-white/60 mb-1.5 block";
const selectClass =
  "w-full bg-brand-surface border border-white/10 text-white rounded-lg h-9 px-3 text-sm transition-colors focus:outline-none focus:border-white/30";

export default function NewContactPage() {
  return (
    <div className="bg-brand-base -mx-6 -my-10 px-6 py-12 min-h-[calc(100vh-4rem)]">
      <h1 className="text-4xl font-black text-white lowercase tracking-tight mb-8">
        new contact
      </h1>
      <form action={createContact} className="max-w-md flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name" className={labelClass}>name</Label>
          <Input id="name" name="name" required className={inputClass} />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="company" className={labelClass}>company</Label>
          <Input id="company" name="company" className={inputClass} />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="role_title" className={labelClass}>their role / title</Label>
          <Input id="role_title" name="role_title" className={inputClass} />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="relationship" className={labelClass}>relationship</Label>
          <select id="relationship" name="relationship" className={selectClass}>
            <option value="">--</option>
            <option value="warm">Warm</option>
            <option value="cold">Cold</option>
            <option value="recruiter">Recruiter</option>
            <option value="referral">Referral</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="linkedin_url" className={labelClass}>linkedin url</Label>
          <Input id="linkedin_url" name="linkedin_url" className={inputClass} />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="notes" className={labelClass}>notes</Label>
          <Textarea id="notes" name="notes" rows={4} className={inputClass} />
        </div>

        <PillButton type="submit" color="orange" className="w-full mt-2">
          save contact
        </PillButton>
      </form>
    </div>
  );
}
