"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createCompany(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data, error } = await supabase
    .from("companies")
    .insert({
      user_id: user.id,
      name: formData.get("name") as string,
      website: (formData.get("website") as string) || null,
      linkedin_url: (formData.get("linkedin_url") as string) || null,
      industry: (formData.get("industry") as string) || null,
      size: (formData.get("size") as string) || null,
      description: (formData.get("description") as string) || null,
      notes: (formData.get("notes") as string) || null,
    })
    .select("id")
    .single();

  if (error) throw error;

  revalidatePath("/dashboard/companies");
  redirect(`/dashboard/companies/${data.id}`);
}
