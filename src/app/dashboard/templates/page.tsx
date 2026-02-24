"use client";

import { useState } from "react";
import { TemplateTabs, TemplateCategory } from "@/components/dashboard/template-tabs";
import { TemplateGrid } from "@/components/dashboard/template-grid";

export default function TemplatesPage() {
    const [activeCategory, setActiveCategory] = useState<TemplateCategory>("all");

    return (
        <div className="p-12 lg:p-20 relative max-w-[1600px] mx-auto min-h-screen">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full -z-10" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 blur-[120px] rounded-full -z-10" />

            <div className="mb-20 slide-fade-in">
                <div className="inline-flex items-center gap-2 px-4 py-2 glass-panel rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-8 border border-indigo-500/20 shadow-lg shadow-indigo-500/5">
                    Resources & Templates
                </div>
                <h1 className="text-5xl lg:text-8xl font-black tracking-tighter mb-6 text-foreground leading-none">
                    Project <span className="italic text-gradient">Templates</span>
                </h1>
                <p className="text-xl text-muted-foreground font-medium max-w-2xl leading-relaxed">
                    Choose from our curated collection of strategic deck patterns designed for maximum impact.
                </p>
            </div>

            <div className="slide-fade-in" style={{ animationDelay: '0.1s' }}>
                <TemplateTabs activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
            </div>

            <div className="slide-fade-in" style={{ animationDelay: '0.2s' }}>
                <TemplateGrid category={activeCategory} />
            </div>
        </div>
    );
}
