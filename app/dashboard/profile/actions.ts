"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function saveProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const profile = {
    user_id: user.id,
    background_notes: (formData.get("background_notes") as string) || null,
    values_motivations:
      (formData.get("values_motivations") as string) || null,
    career_narrative: (formData.get("career_narrative") as string) || null,
    writing_samples: (formData.get("writing_samples") as string) || null,
  };

  const { error } = await supabase
    .from("user_profile")
    .upsert(profile, { onConflict: "user_id" });

  if (error) throw error;

  revalidatePath("/dashboard/profile");
}

export type ResumeEntry = {
  label: string;
  text: string;
  created_at: string;
};

export async function addResume(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const label = (formData.get("label") as string) || "Untitled";
  const text = formData.get("text") as string;
  if (!text?.trim()) return { error: "Resume text is required" };

  const { data: profile } = await supabase
    .from("user_profile")
    .select("resume_text")
    .eq("user_id", user.id)
    .single();

  const existing: ResumeEntry[] = (profile?.resume_text as ResumeEntry[] | null) ?? [];
  const entry: ResumeEntry = {
    label,
    text: text.trim(),
    created_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("user_profile")
    .upsert(
      { user_id: user.id, resume_text: [...existing, entry] },
      { onConflict: "user_id" }
    );

  if (error) return { error: error.message };

  revalidatePath("/dashboard/profile");
  return {};
}

export async function deleteResume(createdAt: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { data: profile } = await supabase
    .from("user_profile")
    .select("resume_text")
    .eq("user_id", user.id)
    .single();

  const existing: ResumeEntry[] = (profile?.resume_text as ResumeEntry[] | null) ?? [];
  const updated = existing.filter((r) => r.created_at !== createdAt);

  const { error } = await supabase
    .from("user_profile")
    .update({ resume_text: updated })
    .eq("user_id", user.id);

  if (error) throw error;

  revalidatePath("/dashboard/profile");
}
