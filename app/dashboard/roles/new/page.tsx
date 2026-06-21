import { createRole } from "../actions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function NewRolePage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight mb-8">New role</h1>
      <form action={createRole} className="max-w-md flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" required />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="company">Company</Label>
          <Input id="company" name="company" />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="source_url">Source URL</Label>
          <Input id="source_url" name="source_url" placeholder="Link to job posting" />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="stage">Stage</Label>
          <select id="stage" name="stage" className="w-full border border-input rounded-md h-9 px-3 text-sm bg-transparent">
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
          <Textarea id="job_description" name="job_description" rows={6} />
        </div>

        <Button type="submit" className="w-full mt-2">Save role</Button>
      </form>
    </div>
  );
}
