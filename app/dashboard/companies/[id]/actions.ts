"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function toggleCompanyList(
  listId: string,
  companyId: string,
  isMember: boolean
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  if (isMember) {
    const { error } = await supabase
      .from("company_list_items")
      .delete()
      .eq("list_id", listId)
      .eq("company_id", companyId);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("company_list_items")
      .insert({ list_id: listId, company_id: companyId });
    if (error && error.code !== "23505") throw error;
  }

  revalidatePath(`/dashboard/companies/${companyId}`);
}

export async function updateCompanyNotes(companyId: string, notes: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase
    .from("companies")
    .update({ notes: notes || null })
    .eq("id", companyId)
    .eq("user_id", user.id);

  if (error) throw error;
  revalidatePath(`/dashboard/companies/${companyId}`);
}
