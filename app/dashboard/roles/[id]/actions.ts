"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addInteraction(roleId: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase.from("interactions").insert({
    user_id: user.id,
    role_id: roleId,
    type: formData.get("type") as string,
    summary: (formData.get("summary") as string) || null,
    follow_up_date: (formData.get("follow_up_date") as string) || null,
  });

  if (error) throw error;
  revalidatePath(`/dashboard/roles/${roleId}`);
}
