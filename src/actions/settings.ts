"use server";

import { createClient } from "@/lib/db/server";
import { revalidatePath } from "next/cache";

export async function getBrandKit() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    const { data, error } = await supabase
        .from("brand_kits")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

    if (error) throw error;
    return data;
}

export async function updateBrandKit(data: {
    primary_color?: string;
    secondary_color?: string;
    font_family?: string;
    logo_url?: string;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    const { error } = await supabase
        .from("brand_kits")
        .upsert({
            user_id: user.id,
            ...data
        }, { onConflict: 'user_id' });

    if (error) throw error;
    revalidatePath("/dashboard/settings");
    return { success: true };
}

export async function getUserSettings() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    const { data, error } = await supabase
        .from("users")
        .select("settings")
        .eq("id", user.id)
        .single();

    if (error) throw error;
    return data.settings || {};
}

export async function updateUserSettings(settings: any) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    const { error } = await supabase
        .from("users")
        .update({ settings })
        .eq("id", user.id);

    if (error) throw error;
    revalidatePath("/dashboard/settings");
    return { success: true };
}
