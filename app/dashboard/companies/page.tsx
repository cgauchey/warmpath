import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { PillButton } from "@/components/brand/pill-button";

export default async function CompaniesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const supabase = await createClient();

  const { data: allCompanies } = await supabase
    .from("companies")
    .select("id, name, industry, roles(id), contacts(id)")
    .order("name");

  const companies = q
    ? allCompanies?.filter((c) => {
        const search = q.toLowerCase();
        return (
          c.name?.toLowerCase().includes(search) ||
          c.industry?.toLowerCase().includes(search)
        );
      })
    : allCompanies;

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

      <form className="mb-6">
        <input
          type="search"
          name="q"
          placeholder="search companies"
          defaultValue={q ?? ""}
          className="w-full bg-brand-surface border border-white/10 text-white placeholder:text-white/30 rounded-full px-5 py-2.5 text-sm font-medium focus:outline-none focus:border-white/30 transition-colors"
        />
      </form>

      {!companies?.length && (
        <p className="text-sm text-white/40 font-medium">
          {q ? "no companies found." : "no companies yet. add your first one."}
        </p>
      )}

      <div className="flex flex-col divide-y divide-white/10">
        {companies?.map((c) => {
          const roleCount = (c.roles as { id: string }[])?.length ?? 0;
          const contactCount = (c.contacts as { id: string }[])?.length ?? 0;
          return (
            <Link
              key={c.id}
              href={`/dashboard/companies/${c.id}`}
              className="py-4 flex justify-between items-center hover:bg-white/5 -mx-3 px-3 rounded-lg transition-colors"
            >
              <div>
                <p className="font-bold text-white">{c.name}</p>
                {c.industry && (
                  <p className="text-sm text-white/40 mt-0.5">{c.industry}</p>
                )}
              </div>
              <div className="flex gap-3 text-xs font-bold text-white/30">
                {roleCount > 0 && (
                  <span>{roleCount} role{roleCount !== 1 ? "s" : ""}</span>
                )}
                {contactCount > 0 && (
                  <span>{contactCount} contact{contactCount !== 1 ? "s" : ""}</span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
