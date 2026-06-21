import { SupabaseClient } from "@supabase/supabase-js";

export async function findOrCreateCompany(
  supabase: SupabaseClient,
  userId: string,
  companyName: string | null
): Promise<string | null> {
  if (!companyName?.trim()) return null;
  const name = companyName.trim();

  const { data: existing } = await supabase
    .from("companies")
    .select("id")
    .eq("user_id", userId)
    .ilike("name", name)
    .maybeSingle();

  if (existing) return existing.id;

  const { data: created, error } = await supabase
    .from("companies")
    .insert({ user_id: userId, name })
    .select("id")
    .single();

  if (error) throw error;
  return created.id;
}
