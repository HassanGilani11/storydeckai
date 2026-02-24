"use server";

import { createClient } from "@/lib/db/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getProject(projectId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .single();

    if (error) throw new Error(error.message);
    return data;
}

export async function updateProjectData(projectId: string, businessData: Record<string, string>) {
    const supabase = await createClient();

    // Merge or overwrite business_data
    const { error } = await supabase
        .from("projects")
        .update({ business_data: businessData })
        .eq("id", projectId);

    if (error) throw new Error(error.message);

    revalidatePath(`/project/${projectId}/setup`);
    revalidatePath("/dashboard");
    return { success: true };
}

export async function getProjects() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_archived", false)
        .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
}

export async function getArchivedProjects() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_archived", true)
        .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
}

export async function archiveProject(projectId: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("projects")
        .update({ is_archived: true })
        .eq("id", projectId);

    if (error) throw new Error(error.message);

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/library");
    return { success: true };
}

export async function unarchiveProject(projectId: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("projects")
        .update({ is_archived: false })
        .eq("id", projectId);

    if (error) throw new Error(error.message);

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/library");
    return { success: true };
}

export async function createProject(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    const title = formData.get("title") as string;
    const type = formData.get("type") as string;
    const templateId = formData.get("templateId") as string;

    const { data, error } = await supabase
        .from("projects")
        .insert({
            user_id: user.id,
            title,
            type,
            business_data: templateId ? { template_id: templateId } : {},
        })
        .select()
        .single();

    if (error) throw new Error(error.message);

    revalidatePath("/dashboard");
    redirect(`/project/${data.id}/setup`);
}
export async function updateProjectTitle(projectId: string, title: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("projects")
        .update({ title })
        .eq("id", projectId);

    if (error) throw new Error(error.message);

    revalidatePath("/dashboard");
    revalidatePath(`/project/${projectId}/outline`);
    return { success: true };
}
