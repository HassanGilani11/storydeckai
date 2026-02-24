"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type TemplateCategory = "all" | "pitch-decks" | "sales" | "reports" | "marketing";

interface TemplateTabsProps {
    activeCategory: TemplateCategory;
    onCategoryChange: (category: TemplateCategory) => void;
}

const CATEGORIES: { id: TemplateCategory; label: string }[] = [
    { id: "all", label: "All Patterns" },
    { id: "pitch-decks", label: "Pitch Decks" },
    { id: "sales", label: "Sales Decks" },
    { id: "reports", label: "Board Reports" },
    { id: "marketing", label: "Marketing" },
];

export function TemplateTabs({ activeCategory, onCategoryChange }: TemplateTabsProps) {
    return (
        <div className="flex flex-wrap items-center gap-4 mb-12">
            {CATEGORIES.map((category) => (
                <button
                    key={category.id}
                    onClick={() => onCategoryChange(category.id)}
                    className={cn(
                        "px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all relative group",
                        activeCategory === category.id
                            ? "text-primary shadow-lg shadow-primary/10"
                            : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    {activeCategory === category.id && (
                        <motion.div
                            layoutId="active-tab"
                            className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-2xl -z-10"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                    )}
                    <span className="relative z-10">{category.label}</span>
                </button>
            ))}
        </div>
    );
}
