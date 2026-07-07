import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PillButton } from "@/components/brand/pill-button";
import { CompanyList } from "@/lib/types";

export default async function ListsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: lists } = await supabase
    .from("company_lists")
    .select("id, name, description, company_list_items(id)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .returns<CompanyList[]>();

  return (
    <div className="bg-brand-base -mx-6 -my-10 px-6 py-12 min-h-[calc(100vh-4rem)]">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-black text-white lowercase tracking-tight">lists</h1>
        <PillButton color="orange" size="sm" asChild>
          <Link href="/dashboard/lists/new">new list</Link>
        </PillButton>
      </div>

      {!lists?.length && (
        <p className="text-sm text-white/40 font-medium">
          no lists yet. create your first one.
        </p>
      )}

      <div className="flex flex-col divide-y divide-white/10">
        {lists?.map((list) => {
          const count = list.company_list_items?.length ?? 0;
          return (
            <Link
              key={list.id}
              href={`/dashboard/lists/${list.id}`}
              className="py-4 flex justify-between items-center hover:bg-white/5 -mx-3 px-3 rounded-lg transition-colors"
            >
              <div>
                <p className="font-bold text-white">{list.name}</p>
                {list.description && (
                  <p className="text-sm text-white/40 mt-0.5">{list.description}</p>
                )}
              </div>
              <span className="text-xs font-bold text-white/30">
                {count} {count === 1 ? "company" : "companies"}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
