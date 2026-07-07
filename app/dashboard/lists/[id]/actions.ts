"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addCompanyToList(listId: string, companyId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase
    .from("company_list_items")
    .insert({ list_id: listId, company_id: companyId });

  if (error && error.code !== "23505") throw error;

  revalidatePath(`/dashboard/lists/${listId}`);
}

export async function removeCompanyFromList(listId: string, companyId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase
    .from("company_list_items")
    .delete()
    .eq("list_id", listId)
    .eq("company_id", companyId);

  if (error) throw error;

  revalidatePath(`/dashboard/lists/${listId}`);
}
