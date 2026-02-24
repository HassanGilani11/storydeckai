import { getProjects, getArchivedProjects } from "@/actions/project";
import { getBrandKit } from "@/actions/settings";
import { LibraryClient } from "@/components/dashboard/library-client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function LibraryPage() {
    const activeProjects = await getProjects();
    const archivedProjects = await getArchivedProjects();
    const brandKit = await getBrandKit();

    return (
        <div className="p-16 lg:p-24 relative max-w-[1600px] mx-auto min-h-screen">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/5 blur-[140px] rounded-full -z-10" />

            <div className="mb-20 slide-fade-in flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 glass-panel rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-8 border border-indigo-500/20 shadow-lg shadow-indigo-500/5">
                        Assets
                    </div>
                    <h1 className="text-5xl lg:text-8xl font-black tracking-tighter mb-4 text-foreground leading-none">
                        Component <span className="italic text-gradient">Library</span>
                    </h1>
                    <p className="text-xl text-muted-foreground font-medium max-w-2xl leading-relaxed">
                        Manage your reusable slides, strategic patterns, and brand assets in one high-end vault.
                    </p>
                </div>
                <Link href="/dashboard/new">
                    <Button className="bg-primary text-primary-foreground hover:opacity-90 rounded-2xl px-10 py-8 font-black text-lg shadow-[0_32px_64px_-16px_rgba(99,102,241,0.2)] transition-all hover:scale-105 hover:-translate-y-2">
                        <Plus className="w-5 h-5 mr-3" />
                        New Project
                    </Button>
                </Link>
            </div>

            <LibraryClient
                activeProjects={activeProjects}
                archivedProjects={archivedProjects}
                brandKit={brandKit}
            />
        </div>
    );
}
