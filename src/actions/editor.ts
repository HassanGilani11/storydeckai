"use server";

import { createClient } from "@/lib/db/server";
import { revalidatePath } from "next/cache";

export async function saveSlideContent(slideId: string, content: any) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("slides")
        .update({ content_json: content })
        .eq("id", slideId);

    if (error) {
        console.error("Error saving slide content:", error);
        throw new Error("Failed to save slide content");
    }

    // Not revalidating everything to keep the UI snappy
    // revalidatePath(`/project/...`);
}

export async function saveAllSlides(projectId: string, slides: any[]) {
    const supabase = await createClient();

    // In a real app, use a RPC or a more efficient bulk update
    for (const slide of slides) {
        await supabase
            .from("slides")
            .update({ content_json: slide.content_json })
            .eq("id", slide.id);
    }

    revalidatePath(`/project/${projectId}/editor`);
}
