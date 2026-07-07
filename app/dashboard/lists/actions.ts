"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createList(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data, error } = await supabase
    .from("company_lists")
    .insert({
      user_id: user.id,
      name: formData.get("name") as string,
      description: (formData.get("description") as string) || null,
    })
    .select("id")
    .single();

  if (error) throw error;

  revalidatePath("/dashboard/lists");
  redirect(`/dashboard/lists/${data.id}`);
}
