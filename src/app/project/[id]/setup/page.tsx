import { QuestionnaireForm } from "@/components/project/questionnaire-form";
import { Sparkles, ChevronLeft } from "lucide-react";
import { getProject } from "@/actions/project";
import { ModeToggle } from "@/components/mode-toggle";
import Link from "next/link";

interface SetupPageProps {
    params: Promise<{ id: string }>;
}

export default async function SetupPage({ params }: SetupPageProps) {
    const { id } = await params;
    const project = await getProject(id);

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-indigo-500/30 overflow-x-hidden relative">
            {/* Background elements */}
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none z-50" />
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-indigo-600/5 blur-[120px] rounded-full -z-10 pointer-events-none" />

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

                <div className="text-center mb-20 slide-fade-in">
                    <div className="flex justify-center mb-10">
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-primary/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative inline-flex items-center justify-center p-4 bg-card rounded-[2rem] border border-border shadow-inner transition-all hover:scale-110">
                                <Sparkles className="w-10 h-10 text-indigo-400" />
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-center gap-4 mb-6">
                        <h1 className="text-6xl font-black tracking-tight text-foreground leading-tight">
                            Guided <span className="italic text-gradient">Strategy</span>
                        </h1>
                        <ModeToggle />
                    </div>
                    <p className="text-muted-foreground text-xl max-w-2xl mx-auto font-medium leading-relaxed">
                        Answer a few strategic questions about your business. Our AI will analyze your inputs to generate a <span className="text-foreground">structured pitch deck outline.</span>
                    </p>
                </div>

                <div className="slide-fade-in" style={{ animationDelay: '0.2s' }}>
                    <QuestionnaireForm
                        projectId={id}
                        initialData={project?.business_data || {}}
                    />
                </div>

                <div className="mt-20 text-center slide-fade-in" style={{ animationDelay: '0.4s' }}>
                    <p className="text-[10px] text-muted-foreground/40 font-black tracking-[0.4em] uppercase">
                        POWERED BY STORYDECK AI STRATEGY ENGINE
                    </p>
                </div>
            </div>
        </div>
    );
}
