import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { StatusBadge } from "@/components/status-badge";
import { NotesEditor } from "./notes-editor";

export default async function CompanyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: company }, { data: roles }, { data: contacts }] =
    await Promise.all([
      supabase.from("companies").select("*").eq("id", id).single(),
      supabase
        .from("roles")
        .select("id, title, stage")
        .eq("company_id", id)
        .order("created_at", { ascending: false }),
      supabase
        .from("contacts")
        .select("id, name, role_title, stage, relationship")
        .eq("company_id", id)
        .order("created_at", { ascending: false }),
    ]);

  if (!company) notFound();

  return (
    <div className="bg-brand-base -mx-6 -my-10 px-6 py-12 min-h-[calc(100vh-4rem)]">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white tracking-tight leading-tight">
          {company.name}
        </h1>

        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
          {company.industry && (
            <span className="text-sm text-white/40 font-medium">
              {company.industry}
            </span>
          )}
          {company.size && (
            <span className="text-sm text-white/40 font-medium">
              {company.size}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-4 mt-3">
          {company.website && (
            <a
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-bold text-white/40 underline underline-offset-4 hover:text-white transition-colors"
            >
              website ↗
            </a>
          )}
          {company.linkedin_url && (
            <a
              href={company.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-bold text-white/40 underline underline-offset-4 hover:text-white transition-colors"
            >
              linkedin ↗
            </a>
          )}
        </div>
      </div>

      {company.description && (
        <div className="mb-10">
          <h2 className="text-xs font-black uppercase tracking-widest text-white/30 mb-3">
            About
          </h2>
          <p className="text-sm text-white/60 leading-relaxed whitespace-pre-wrap">
            {company.description}
          </p>
        </div>
      )}

      <div className="mb-10">
        <h2 className="text-xs font-black uppercase tracking-widest text-white/30 mb-3">
          Notes
        </h2>
        <NotesEditor companyId={id} initialNotes={company.notes} />
      </div>

      <section className="mb-10">
        <h2 className="text-xs font-black uppercase tracking-widest text-white/30 mb-4">
          Roles
        </h2>
        {!roles?.length ? (
          <p className="text-sm text-white/25">no roles yet.</p>
        ) : (
          <div className="flex flex-col divide-y divide-white/10">
            {roles.map((r) => (
              <Link
                key={r.id}
                href={`/dashboard/roles/${r.id}`}
                className="py-3.5 flex justify-between items-center hover:bg-white/5 -mx-3 px-3 rounded-lg transition-colors"
              >
                <p className="font-bold text-white text-sm">{r.title}</p>
                <StatusBadge stage={r.stage} type="role" />
              </Link>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-xs font-black uppercase tracking-widest text-white/30 mb-4">
          Contacts
        </h2>
        {!contacts?.length ? (
          <p className="text-sm text-white/25">no contacts yet.</p>
        ) : (
          <div className="flex flex-col divide-y divide-white/10">
            {contacts.map((c) => (
              <Link
                key={c.id}
                href={`/dashboard/contacts/${c.id}`}
                className="py-3.5 flex justify-between items-center hover:bg-white/5 -mx-3 px-3 rounded-lg transition-colors"
              >
                <div>
                  <p className="font-bold text-white text-sm">{c.name}</p>
                  {c.role_title && (
                    <p className="text-xs text-white/40 mt-0.5">{c.role_title}</p>
                  )}
                </div>
                <StatusBadge stage={c.stage} type="contact" />
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
