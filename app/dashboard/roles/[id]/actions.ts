"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import Anthropic from "@anthropic-ai/sdk";

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
  roleUrl: string | null,
  generatedText: string
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
    generated_text: generatedText,
  });

  if (error) throw error;
  revalidatePath(`/dashboard/roles/${roleId}`);
}

export async function extractVoiceInsights(
  generatedText: string,
  finalText: string
) {
  if (!generatedText || !finalText || generatedText === finalText) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { data: profile } = await supabase
    .from("user_profile")
    .select("voice_profile")
    .eq("user_id", user.id)
    .single();

  const anthropic = new Anthropic();
  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 600,
    messages: [
      {
        role: "user",
        content: `You are analyzing how a user edits AI-generated writing to learn their personal voice and style.

<original_text>
${generatedText}
</original_text>

<user_edited_text>
${finalText}
</user_edited_text>

${profile?.voice_profile ? `<current_voice_profile>\n${profile.voice_profile}\n</current_voice_profile>` : ""}

Analyze what the user changed and what it reveals about their writing preferences. Consider: sentence length and structure, vocabulary and formality level, tone, what they added or removed, hedging language, specific words or phrases they avoid or prefer.

Return an updated voice profile (under 300 words) that captures these preferences concisely and concretely. If there is an existing profile, incorporate new observations rather than starting over.`,
      },
    ],
  });

  const updatedProfile =
    message.content[0].type === "text" ? message.content[0].text : null;
  if (!updatedProfile) return;

  const { error } = await supabase
    .from("user_profile")
    .update({ voice_profile: updatedProfile })
    .eq("user_id", user.id);

  if (error) throw error;
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
