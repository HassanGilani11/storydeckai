"use server";

import { createClient } from "@/lib/db/server";
import { revalidatePath } from "next/cache";

export async function getUserProfile() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

    if (error) {
        console.error("Error fetching user profile:", error.message);
        return null;
    }

    return data;
}

export async function updateUserProfile(data: { full_name?: string; role?: string; avatar_url?: string }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    const { error } = await supabase
        .from("users")
        .upsert({
            id: user.id,
            email: user.email,
            ...data
        });

    if (error) {
        console.error("Upsert error:", error);
        return { error: error.message };
    }

    revalidatePath("/dashboard", "layout");
    return { success: true };
}
