"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

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
