"use server";
import { createClient } from "@/lib/supabase/server";
import { findOrCreateCompany } from "@/lib/companies";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createContact(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const companyId = await findOrCreateCompany(
    supabase,
    user.id,
    formData.get("company") as string
  );

  const { error } = await supabase.from("contacts").insert({
    user_id: user.id,
    company_id: companyId,
    name: formData.get("name") as string,
    role_title: (formData.get("role_title") as string) || null,
    relationship: (formData.get("relationship") as string) || null,
    linkedin_url: (formData.get("linkedin_url") as string) || null,
    notes: (formData.get("notes") as string) || null,
  });

  if (error) throw error;

  revalidatePath("/dashboard/contacts");
  redirect("/dashboard/contacts");
}
