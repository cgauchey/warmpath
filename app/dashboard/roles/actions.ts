"use server";
import { createClient } from "@/lib/supabase/server";
import { findOrCreateCompany } from "@/lib/companies";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createRole(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const companyId = await findOrCreateCompany(
    supabase,
    user.id,
    formData.get("company") as string
  );

  const { error } = await supabase.from("roles").insert({
    user_id: user.id,
    company_id: companyId,
    title: formData.get("title") as string,
    job_description: (formData.get("job_description") as string) || null,
    source_url: (formData.get("source_url") as string) || null,
    stage: (formData.get("stage") as string) || "researching",
  });

  if (error) throw error;

  revalidatePath("/dashboard/roles");
  redirect("/dashboard/roles");
}
