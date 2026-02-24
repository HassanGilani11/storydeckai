"use server";

import { createClient } from "@/lib/db/server";
import { generateSlideContent } from "@/lib/ai/slide-generator";
import { revalidatePath } from "next/cache";

export async function generateAllPendingSlides(projectId: string) {
    const supabase = await createClient();

    // 1. Get all slides for this project
    const { data: slides, error: slideError } = await supabase
        .from("slides")
        .select("*")
        .eq("project_id", projectId);

    if (slideError || !slides) throw new Error("Failed to fetch slides");

    // 2. Get the outline for context
    const { data: outline, error: outlineError } = await supabase
        .from("deck_outlines")
        .select("*")
        .eq("project_id", projectId)
        .single();

    if (outlineError || !outline) throw new Error("Outline context missing");

    // For MVP, we pass the raw JSON outline string as context for better relevance
    const context = JSON.stringify(outline.structured_json);

    // 3. Generate content for each slide sequentially (to avoid rate limits/timeout for now)
    // In a real production app, this would be a background job
    for (const slide of slides) {
        // Only generate if content is empty or generic
        if (slide.content_json && slide.content_json.bullets && slide.content_json.bullets.length > 0) continue;

        console.log(`Generating content for slide: ${slide.slide_type}`);
        const generatedContent = await generateSlideContent(slide.slide_type, slide.content_json?.title || slide.slide_type, context);

        await supabase
            .from("slides")
            .update({ content_json: generatedContent })
            .eq("id", slide.id);
    }
}
