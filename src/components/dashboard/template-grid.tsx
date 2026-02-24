"use client";

import { motion, AnimatePresence } from "framer-motion";
import { TemplateCategory } from "./template-tabs";
import { ArrowRight, FileText, Layout, Presentation, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TemplateGridProps {
    category: TemplateCategory;
}

import { TEMPLATES } from "@/lib/constants/templates";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { TemplatePreviewModal } from "./template-preview-modal";

export function TemplateGrid({ category }: TemplateGridProps) {
    const router = useRouter();
    const [previewTemplate, setPreviewTemplate] = useState<any | null>(null);

    const filteredTemplates = TEMPLATES.filter(
        (t) => category === "all" || t.category === category
    );

    const handleUsePattern = (template: any) => {
        router.push(`/dashboard/new?template=${template.id}&title=${encodeURIComponent(template.title)}`);
    };

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence mode="popLayout">
                    {filteredTemplates.map((template, index) => (
                        <motion.div
                            key={template.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="glass-panel rounded-[2.5rem] p-10 border border-border/50 shadow-2xl relative overflow-hidden group hover:border-primary/20 transition-all flex flex-col h-full"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -z-10 group-hover:bg-primary/10 transition-colors" />

                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform">
                                    <template.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black italic tracking-tight">{template.title}</h3>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{template.category.replace("-", " ")}</p>
                                </div>
                            </div>

                            <p className="text-muted-foreground font-medium mb-12 flex-grow leading-relaxed">
                                {template.description}
                            </p>

                            <div className="flex items-center justify-between pt-6 border-t border-border/50">
                                <Button
                                    variant="ghost"
                                    onClick={() => setPreviewTemplate(template)}
                                    className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground p-0 h-auto"
                                >
                                    Preview
                                </Button>
                                <Button
                                    variant="link"
                                    onClick={() => handleUsePattern(template)}
                                    className="text-[10px] font-black uppercase tracking-widest text-primary p-0 h-auto gap-2 group-hover:translate-x-1 transition-transform"
                                >
                                    Use Pattern <ArrowRight className="w-3 h-3" />
                                </Button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <TemplatePreviewModal
                template={previewTemplate}
                isOpen={!!previewTemplate}
                onClose={() => setPreviewTemplate(null)}
            />
        </>
    );
}
