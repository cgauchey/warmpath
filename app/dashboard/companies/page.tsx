import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { PillButton } from "@/components/brand/pill-button";
import { CompanyList } from "./company-list";

export default async function CompaniesPage() {
  const supabase = await createClient();

  const { data: companies } = await supabase
    .from("companies")
    .select("id, name, industry, roles(id, stage), contacts(id)")
    .order("name");

  return (
    <div className="bg-brand-base -mx-6 -my-10 px-6 py-12 min-h-[calc(100vh-4rem)]">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-black text-white lowercase tracking-tight">
          companies
        </h1>
        <PillButton color="orange" size="sm" asChild>
          <Link href="/dashboard/companies/new">add company</Link>
        </PillButton>
      </div>

      <CompanyList companies={(companies ?? []) as any} />
    </div>
  );
}
