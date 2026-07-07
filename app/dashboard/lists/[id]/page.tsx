import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { AddCompanies } from "./add-companies";
import { removeCompanyFromList } from "./actions";

export default async function ListDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: list } = await supabase
    .from("company_lists")
    .select("id, name, description")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!list) notFound();

  const [{ data: items }, { data: allCompanies }] = await Promise.all([
    supabase
      .from("company_list_items")
      .select("id, company_id, companies(id, name, industry)")
      .eq("list_id", id)
      .order("position", { ascending: true }),
    supabase
      .from("companies")
      .select("id, name, industry")
      .eq("user_id", user.id)
      .order("name"),
  ]);

  const addedIds = new Set((items ?? []).map((item) => item.company_id));
  const availableCompanies = (allCompanies ?? []).filter(
    (c) => !addedIds.has(c.id)
  );

  return (
    <div className="bg-brand-base -mx-6 -my-10 px-6 py-12 min-h-[calc(100vh-4rem)]">
      <div className="mb-8">
        <Link
          href="/dashboard/lists"
          className="text-xs font-bold text-white/30 uppercase tracking-widest hover:text-white/60 transition-colors"
        >
          ← lists
        </Link>
        <h1 className="text-3xl font-black text-white tracking-tight leading-tight mt-3">
          {list.name}
        </h1>
        {list.description && (
          <p className="text-white/50 font-medium mt-1">{list.description}</p>
        )}
      </div>

      {!items?.length ? (
        <p className="text-sm text-white/40 font-medium mb-10">
          no companies yet. add some below.
        </p>
      ) : (
        <div className="flex flex-col divide-y divide-white/10 mb-10">
          {items.map((item) => {
            const company = item.companies as any;
            return (
              <div
                key={item.id}
                className="py-4 flex items-center justify-between -mx-3 px-3"
              >
                <Link
                  href={`/dashboard/companies/${item.company_id}`}
                  className="flex-1 hover:opacity-70 transition-opacity"
                >
                  <p className="font-bold text-white">{company?.name}</p>
                  {company?.industry && (
                    <p className="text-sm text-white/40 mt-0.5">
                      {company.industry}
                    </p>
                  )}
                </Link>
                <form
                  action={removeCompanyFromList.bind(null, id, item.company_id)}
                >
                  <button
                    type="submit"
                    className="text-white/20 hover:text-white/60 transition-colors text-xl font-bold ml-4 leading-none"
                    aria-label="remove"
                  >
                    ×
                  </button>
                </form>
              </div>
            );
          })}
        </div>
      )}

      <section>
        <h2 className="text-xs font-black uppercase tracking-widest text-white/30 mb-4">
          add companies
        </h2>
        <AddCompanies listId={id} companies={availableCompanies} />
      </section>
    </div>
  );
}
