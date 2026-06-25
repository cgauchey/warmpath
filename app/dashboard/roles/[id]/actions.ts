"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateRoleStage(roleId: string, stage: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase
    .from("roles")
    .update({ stage })
    .eq("id", roleId)
    .eq("user_id", user.id);

  if (error) throw error;
  revalidatePath(`/dashboard/roles/${roleId}`);
}

export async function saveWhyAnswer(
  roleId: string,
  questionType: string,
  answerText: string,
  roleUrl: string | null
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase.from("why_answers").insert({
    user_id: user.id,
    role_id: roleId,
    question_type: questionType,
    answer_text: answerText,
    role_url: roleUrl,
    prompt_version: "v1",
  });

  if (error) throw error;
  revalidatePath(`/dashboard/roles/${roleId}`);
}

export async function updateWhyAnswer(
  answerId: string,
  roleId: string,
  answerText: string
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase
    .from("why_answers")
    .update({ answer_text: answerText })
    .eq("id", answerId)
    .eq("user_id", user.id);

  if (error) throw error;
  revalidatePath(`/dashboard/roles/${roleId}`);
}

export async function addInteraction(roleId: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase.from("interactions").insert({
    user_id: user.id,
    role_id: roleId,
    type: formData.get("type") as string,
    summary: (formData.get("summary") as string) || null,
    interaction_date: (formData.get("interaction_date") as string) || null,
    follow_up_date: (formData.get("follow_up_date") as string) || null,
  });

  if (error) throw error;
  revalidatePath(`/dashboard/roles/${roleId}`);
}
