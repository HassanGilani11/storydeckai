"use server";

import { createClient } from "@/lib/db/server";
import { OutlineJSON, SlideType } from "@/types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function approveOutlineAndGenerateSlides(projectId: string, outline: OutlineJSON) {
    const supabase = await createClient();

    // 1. Update outline as approved
    const { error: updateError } = await supabase
        .from("deck_outlines")
        .update({
            structured_json: outline,
            approved: true
        })
        .eq("project_id", projectId);

    if (updateError) throw new Error("Failed to approve outline");

    // 2. Initialize Slides based on outline
    // We insert them with orders based on the outline array
    const slidesToInsert = outline.slides.map((s, index) => ({
        project_id: projectId,
        slide_type: s.type,
        slide_order: index,
        content_json: { title: s.title, bullets: s.bullets || [] },
        template: "standard" // Default template
    }));

    const { error: slideError } = await supabase
        .from("slides")
        .insert(slidesToInsert);

    if (slideError) {
        console.error("Error creating slides:", slideError);
        throw new Error("Failed to initialize slides");
    }

    // 3. Trigger content generation (AI expansion) in background
    // In a production app, this would be a queued job
    import("./slide-generation").then(m => m.generateAllPendingSlides(projectId));

    revalidatePath(`/project/${projectId}/outline`);
    redirect(`/project/${projectId}/editor`);
}
