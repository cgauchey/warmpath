"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import Anthropic from "@anthropic-ai/sdk";
import type { ContactResult } from "@/lib/types";

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

export async function updateGenerationNotes(
  roleId: string,
  notes: string | null
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase
    .from("roles")
    .update({ generation_notes: notes })
    .eq("id", roleId)
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

export async function findContactsForRole(roleId: string): Promise<{ data?: ContactResult[]; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data: role } = await supabase
    .from("roles")
    .select("*, companies(name)")
    .eq("id", roleId)
    .eq("user_id", user.id)
    .single();

  if (!role) return { error: "Role not found" };

  const companyName = (role.companies as { name: string } | null)?.name;
  if (!companyName) return { data: [] };

  // Tier 1: contacts who work at the target company
  const tier1Query = supabase
    .from("contacts")
    .select("id, name, role_title, companies(name), interactions(summary, interaction_date)")
    .eq("user_id", user.id);

  if (role.company_id) {
    tier1Query.eq("company_id", role.company_id);
  } else {
    return { data: [] };
  }

  const { data: tier1Raw } = await tier1Query;
  const tier1Contacts = (tier1Raw ?? []).map((c: any) => ({ ...c, tier: 1 as const }));
  const tier1Ids = new Set(tier1Contacts.map((c: any) => c.id));

  // Tier 2: contacts whose interaction summaries mention the company name
  const { data: tier2Interactions } = await supabase
    .from("interactions")
    .select("contact_id")
    .ilike("summary", `%${companyName}%`)
    .eq("user_id", user.id)
    .not("contact_id", "is", null);

  const tier2Ids = [...new Set(
    (tier2Interactions ?? [])
      .map((i: any) => i.contact_id as string)
      .filter((id) => !tier1Ids.has(id))
  )];

  let tier2Contacts: any[] = [];
  if (tier2Ids.length > 0) {
    const { data } = await supabase
      .from("contacts")
      .select("id, name, role_title, companies(name), interactions(summary, interaction_date)")
      .in("id", tier2Ids)
      .eq("user_id", user.id);
    tier2Contacts = (data ?? []).map((c: any) => ({ ...c, tier: 2 as const }));
  }

  const allContacts = [...tier1Contacts, ...tier2Contacts];
  if (allContacts.length === 0) return { data: [] };

  // Generate angles with Claude
  const anthropic = new Anthropic();
  const contactsText = allContacts.map((c: any) => {
    const summaries = ((c.interactions ?? []) as { summary: string | null }[])
      .filter((i) => i.summary)
      .slice(0, 3)
      .map((i) => i.summary)
      .join("; ");
    const tier = c.tier === 1 ? "works at target company" : "mentioned company in interaction notes";
    return `- ID: ${c.id} | ${c.name}, ${c.role_title ?? "unknown title"} at ${(c.companies as { name: string } | null)?.name ?? "unknown"} | ${tier}${summaries ? ` | Notes: ${summaries}` : ""}`;
  }).join("\n");

  let angles: { contact_id: string; angle: string }[] = [];
  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 600,
      messages: [{
        role: "user",
        content: `You are helping a job seeker identify the best angle for reaching out to contacts who can help them get a referral or introduction.

Target role: ${role.title} at ${companyName}

Contacts:
${contactsText}

For each contact, write one sentence (max 15 words) explaining why they're useful and what angle to use. Be specific.

Return valid JSON only, no other text: [{"contact_id": "...", "angle": "..."}]`,
      }],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "[]";
    angles = JSON.parse(text);
  } catch {
    angles = allContacts.map((c: any) => ({
      contact_id: c.id,
      angle: c.tier === 1
        ? `Works at ${companyName} — well-positioned to refer you.`
        : `Has discussed ${companyName} — may have useful context or connections.`,
    }));
  }

  const angleMap = new Map(angles.map((a) => [a.contact_id, a.angle]));

  // Auto-save results
  await supabase.from("contact_role_connections").upsert(
    allContacts.map((c: any) => ({
      user_id: user.id,
      contact_id: c.id,
      role_id: roleId,
      angle: angleMap.get(c.id) ?? "",
      tier: c.tier,
    })),
    { onConflict: "contact_id,role_id" }
  );

  revalidatePath(`/dashboard/roles/${roleId}`);

  return {
    data: allContacts.map((c: any) => ({
      contact_id: c.id,
      name: c.name,
      role_title: c.role_title,
      company_name: (c.companies as { name: string } | null)?.name ?? null,
      angle: angleMap.get(c.id) ?? "",
      tier: c.tier,
    })),
  };
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
