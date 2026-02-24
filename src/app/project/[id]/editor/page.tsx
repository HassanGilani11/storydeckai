import { createClient } from "@/lib/db/server";
import { EditorClient } from "@/components/slide-editor/editor-client";
import { redirect } from "next/navigation";
import { getBrandKit } from "@/actions/settings";

interface EditorPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditorPage({ params }: EditorPageProps) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: slides, error } = await supabase
        .from("slides")
        .select("*")
        .eq("project_id", id)
        .order("slide_order", { ascending: true });

    const brandKit = await getBrandKit();

    if (error || !slides || slides.length === 0) {
        // If no slides, redirect back to outline or setup
        redirect(`/project/${id}/outline`);
    }

    return <EditorClient initialSlides={slides} projectId={id} brandKit={brandKit} />;
}
