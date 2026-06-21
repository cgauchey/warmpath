import { createContact } from "../actions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function NewContactPage() {
  return (
    <form action={createContact} className="max-w-md flex flex-col gap-4">
      <h1 className="text-2xl font-semibold mb-2">New contact</h1>

      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" required />
      </div>

      <div>
        <Label htmlFor="company">Company</Label>
        <Input id="company" name="company" />
      </div>

      <div>
        <Label htmlFor="role_title">Their role / title</Label>
        <Input id="role_title" name="role_title" />
      </div>

      <div>
        <Label htmlFor="relationship">Relationship</Label>
        <select id="relationship" name="relationship" className="w-full border rounded-md h-9 px-3 text-sm">
          <option value="">—</option>
          <option value="warm">Warm</option>
          <option value="cold">Cold</option>
          <option value="recruiter">Recruiter</option>
          <option value="referral">Referral</option>
        </select>
      </div>

      <div>
        <Label htmlFor="linkedin_url">LinkedIn URL</Label>
        <Input id="linkedin_url" name="linkedin_url" />
      </div>

      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" name="notes" rows={4} />
      </div>

      <Button type="submit">Save contact</Button>
    </form>
  );
}
