"use server";

import { createClient } from "@/lib/db/server";
import { generateDeckOutline } from "@/lib/ai/outline-generator";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { TEMPLATES, TEMPLATE_BLUEPRINTS } from "@/lib/constants/templates";

export async function startOutlineGeneration(projectId: string, questionnaireData: Record<string, string>) {
    try {
        const supabase = await createClient();

        // 1. Fetch project to ensure access and get template
        const { data: project, error: projectError } = await supabase
            .from("projects")
            .select("*")
            .eq("id", projectId)
            .single();

        if (projectError || !project) {
            console.error("Project fetch error:", projectError);
            throw new Error("Project not found");
        }

        const templateId = (project.business_data as any)?.template_id;
        const template = TEMPLATES.find(t => t.id === templateId);

        // 2. Generate Outline via AI (with template hint)
        const promptContext = template
            ? `Note: The user chosen the "${template.title}" pattern. Ensure the deck has exactly ${template.slideCount} slides covering the strategic narrative of this pattern.`
            : "";

        const outlineJson = await generateDeckOutline(project.title, { ...questionnaireData, promptContext });

        // 3. Save to deck_outlines table (Upsert on project_id)
        const { error: outlineError } = await supabase
            .from("deck_outlines")
            .upsert({
                project_id: projectId,
                structured_json: outlineJson,
                approved: false,
            }, { onConflict: 'project_id' });

        if (outlineError) {
            console.error("Error saving outline to DB:", outlineError);
            throw new Error("Failed to save outline: " + outlineError.message);
        }

    } catch (error: any) {
        console.error("startOutlineGeneration failed trace:", error);
        throw error;
    }

    revalidatePath(`/project/${projectId}/outline`);
    redirect(`/project/${projectId}/outline`);
}

export async function createManualOutline(projectId: string) {
    try {
        const supabase = await createClient();

        // 1. Get project template
        const { data: project } = await supabase
            .from("projects")
            .select("business_data")
            .eq("id", projectId)
            .single();

        const templateId = (project?.business_data as any)?.template_id;
        const blueprint = templateId ? TEMPLATE_BLUEPRINTS[templateId] : null;

        // Use blueprint if available, otherwise fallback to generic
        const manualOutlineContent = blueprint ? {
            slides: blueprint.map(s => ({
                type: s.type,
                title: s.title,
                bullets: s.bullets
            }))
        } : {
            slides: [
                { type: "title", title: "Project Title", bullets: ["Tagline or short description"] },
                { type: "problem", title: "The Problem", bullets: ["Key pain point 1", "Key pain point 2"] },
                { type: "solution", title: "The Solution", bullets: ["How we solve it", "Key feature"] },
                { type: "market", title: "Market Opportunity", bullets: ["Target audience", "Market size"] },
                { type: "solution", title: "Business Model", bullets: ["Revenue stream 1", "Pricing strategy"] },
                { type: "ask", title: "The Ask", bullets: ["Funding needed", "Strategic goal"] },
            ]
        };

        const { error } = await supabase
            .from("deck_outlines")
            .upsert({
                project_id: projectId,
                structured_json: manualOutlineContent,
                approved: false,
            }, { onConflict: 'project_id' });

        if (error) throw new Error("Failed to create manual outline: " + error.message);

    } catch (error: any) {
        console.error("createManualOutline failed trace:", error);
        throw error;
    }

    revalidatePath(`/project/${projectId}/outline`);
    redirect(`/project/${projectId}/outline`);
}
