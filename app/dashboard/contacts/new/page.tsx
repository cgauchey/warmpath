import { createContact } from "../actions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function NewContactPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight mb-8">New contact</h1>
      <form action={createContact} className="max-w-md flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="company">Company</Label>
          <Input id="company" name="company" />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="role_title">Their role / title</Label>
          <Input id="role_title" name="role_title" />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="relationship">Relationship</Label>
          <select id="relationship" name="relationship" className="w-full border border-input rounded-lg h-9 px-3 text-sm bg-transparent text-foreground transition-colors focus:border-ring focus:ring-3 focus:ring-ring/50 focus:outline-none">
            <option value="">--</option>
            <option value="warm">Warm</option>
            <option value="cold">Cold</option>
            <option value="recruiter">Recruiter</option>
            <option value="referral">Referral</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="linkedin_url">LinkedIn URL</Label>
          <Input id="linkedin_url" name="linkedin_url" />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" name="notes" rows={4} />
        </div>

        <Button type="submit" className="w-full mt-2">Save contact</Button>
      </form>
    </div>
  );
}
