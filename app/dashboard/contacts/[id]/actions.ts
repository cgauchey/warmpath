"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateContactStage(contactId: string, stage: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase
    .from("contacts")
    .update({ stage })
    .eq("id", contactId)
    .eq("user_id", user.id);

  if (error) throw error;
  revalidatePath(`/dashboard/contacts/${contactId}`);
}

export async function deleteInteraction(contactId: string, interactionId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase
    .from("interactions")
    .delete()
    .eq("id", interactionId)
    .eq("user_id", user.id);

  if (error) throw error;
  revalidatePath(`/dashboard/contacts/${contactId}`);
}

export async function addInteraction(contactId: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase.from("interactions").insert({
    user_id: user.id,
    contact_id: contactId,
    type: formData.get("type") as string,
    summary: (formData.get("summary") as string) || null,
    interaction_date: (formData.get("interaction_date") as string) || null,
    follow_up_date: (formData.get("follow_up_date") as string) || null,
  });

  if (error) throw error;
  revalidatePath(`/dashboard/contacts/${contactId}`);
}
