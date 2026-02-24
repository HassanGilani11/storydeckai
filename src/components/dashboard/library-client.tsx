"use client";

import { useState } from "react";
import { Project, BrandKit } from "@/types";
import { ProjectList } from "@/components/dashboard/project-list";
import { BrandAssetManager } from "@/components/dashboard/brand-asset-manager";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Layout, Archive, Package } from "lucide-react";

interface LibraryClientProps {
    activeProjects: Project[];
    archivedProjects: Project[];
    brandKit: BrandKit | null;
}

type Tab = "active" | "archived" | "assets";

export function LibraryClient({ activeProjects, archivedProjects, brandKit }: LibraryClientProps) {
    const [activeTab, setActiveTab] = useState<Tab>("active");

    const tabs: { id: Tab; label: string; icon: any; count?: number }[] = [
        { id: "active", label: "Projects", icon: Layout, count: activeProjects.length },
        { id: "archived", label: "Archived", icon: Archive, count: archivedProjects.length },
        { id: "assets", label: "Assets & UI", icon: Package },
    ];

    return (
        <div className="space-y-16 pb-20">
            <div className="flex flex-wrap items-center gap-6">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "flex items-center gap-3 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all relative group",
                                isActive
                                    ? "text-primary shadow-xl shadow-primary/5"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="library-tab"
                                    className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-2xl -z-10"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <Icon className="w-4 h-4" />
                            <span>{tab.label}</span>
                            {tab.count !== undefined && (
                                <span className={cn(
                                    "ml-2 px-2.5 py-1 rounded-full text-[9px] border transition-colors",
                                    isActive ? "bg-primary/20 border-primary/30" : "bg-muted border-border"
                                )}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            <div className="slide-fade-in pt-4">
                {activeTab === "active" && (
                    <section className="space-y-10">
                        <div className="flex items-center gap-4">
                            <h2 className="text-2xl font-black tracking-tight text-foreground uppercase italic">Active Projects</h2>
                            <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
                        </div>
                        <ProjectList projects={activeProjects} />
                    </section>
                )}

                {activeTab === "archived" && (
                    <section className="space-y-10">
                        <div className="flex items-center gap-4">
                            <h2 className="text-2xl font-black tracking-tight text-foreground uppercase italic">Project Archive</h2>
                            <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
                        </div>
                        <ProjectList projects={archivedProjects} />
                    </section>
                )}

                {activeTab === "assets" && (
                    <section className="space-y-10">
                        <div className="flex items-center gap-4 mb-2">
                            <h2 className="text-2xl font-black tracking-tight text-foreground uppercase italic">Brand Vault</h2>
                            <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
                        </div>
                        <BrandAssetManager brandKit={brandKit} />
                    </section>
                )}
            </div>
        </div>
    );
}

