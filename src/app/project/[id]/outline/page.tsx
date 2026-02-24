import { createClient } from "@/lib/db/server";
import { OutlineViewer } from "@/components/project/outline-viewer";
import { OutlineJSON } from "@/types";
import { redirect } from "next/navigation";
import { Sparkles, ChevronLeft } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import Link from "next/link";

interface OutlinePageProps {
    params: Promise<{ id: string }>;
}

export default async function OutlinePage({ params }: OutlinePageProps) {
    const { id } = await params;
    const supabase = await createClient();

    // Fetch the latest outline for this project
    const { data: outline, error } = await supabase
        .from("deck_outlines")
        .select("*")
        .eq("project_id", id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

    if (error || !outline) {
        redirect(`/project/${id}/setup`);
    }

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-indigo-500/30 overflow-x-hidden relative">
            {/* Background elements */}
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none z-50" />
            <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] rounded-full -z-10 pointer-events-none" />

            <div className="max-w-4xl mx-auto pt-12 pb-24 px-6 relative z-10">
                <div className="mb-12 slide-fade-in">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 px-6 py-3 glass-panel rounded-2xl text-[10px] font-black uppercase tracking-[0.2rem] text-muted-foreground hover:text-primary transition-all border border-border/50 group"
                    >
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Library
                    </Link>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 mb-20 slide-fade-in">
                    <div>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="inline-flex items-center gap-2 text-indigo-400 px-3 py-1 glass-panel rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(99,102,241,0.1)]">
                                <Sparkles className="w-4 h-4" />
                                <span>AI Strategic Blueprint</span>
                            </div>
                            <ModeToggle />
                        </div>
                        <h1 className="text-5xl lg:text-6xl font-black tracking-tight mb-6 text-foreground leading-tight">
                            Review <span className="italic text-gradient">Outline</span>
                        </h1>
                        <p className="text-xl text-muted-foreground font-medium leading-relaxed max-w-xl">
                            AI has structured your narrative. Review, refine, and approve to generate <span className="text-foreground">your high-impact slide content.</span>
                        </p>
                    </div>
                </div>

                <div className="slide-fade-in" style={{ animationDelay: '0.2s' }}>
                    <OutlineViewer initialOutline={outline.structured_json as unknown as OutlineJSON} projectId={id} />
                </div>
            </div>
        </div>
    );
}
