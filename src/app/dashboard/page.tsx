import { getProjects } from "@/actions/project";
import { ProjectList } from "@/components/dashboard/project-list";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";



export default async function DashboardPage() {
    const projects = await getProjects();

    return (
        <div className="p-12 lg:p-20 relative max-w-[1600px] mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-20 slide-fade-in">
                <div>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 glass-panel rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">
                            Founder Console
                        </div>
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-black tracking-tight mb-4 text-foreground">
                        Your <span className="italic text-gradient">Dashboard</span>
                    </h1>
                    <p className="text-xl text-muted-foreground font-medium">Manage your story decks and strategic outlines.</p>
                </div>
                <Link href="/dashboard/new">
                    <Button className="bg-primary text-primary-foreground hover:opacity-90 rounded-2xl px-10 py-8 font-black text-lg shadow-[0_32px_64px_-16px_rgba(99,102,241,0.2)] transition-all hover:scale-105 hover:-translate-y-2">
                        <Plus className="w-5 h-5 mr-3" />
                        New Project
                    </Button>
                </Link>
            </div>

            <section className="slide-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-center gap-4 mb-10">
                    <h2 className="text-2xl font-black tracking-tight text-foreground uppercase italic">Recent Projects</h2>
                    {projects.length > 0 && (
                        <span className="px-3 py-1 bg-secondary border border-border text-[10px] font-black rounded-full text-indigo-400">
                            {projects.length}
                        </span>
                    )}
                    <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
                </div>

                <ProjectList projects={projects} />
            </section>
        </div>
    );
}
