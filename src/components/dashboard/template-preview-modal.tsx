"use client";

import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { TEMPLATE_BLUEPRINTS } from "@/lib/constants/templates";

interface TemplatePreviewModalProps {
    template: any | null;
    isOpen: boolean;
    onClose: () => void;
}

export function TemplatePreviewModal({ template, isOpen, onClose }: TemplatePreviewModalProps) {
    const router = useRouter();

    if (!template) return null;

    const slides = TEMPLATE_BLUEPRINTS[template.id] || [];

    const handleUsePattern = () => {
        router.push(`/dashboard/new?template=${template.id}&title=${encodeURIComponent(template.title)}`);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl bg-[#0B0F1A] border-white/5 rounded-[2.5rem] p-0 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] focus:outline-none h-[80vh] min-h-[500px] flex flex-col md:flex-row">
                <DialogClose className="absolute right-6 top-6 z-50 rounded-full p-2 bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all border border-white/5">
                    <X className="w-5 h-5" />
                    <span className="sr-only">Close</span>
                </DialogClose>

                {/* Visual Preview Side (Left) */}
                <div className="w-full md:w-[40%] bg-[#05070A] p-8 lg:p-12 flex flex-col justify-between border-r border-white/5 relative shrink-0">
                    <div className="absolute top-0 left-0 w-full h-1 premium-gradient" />

                    <div className="relative z-10">
                        <div className="w-16 h-16 rounded-2xl premium-gradient flex items-center justify-center text-white mb-8 shadow-2xl shadow-indigo-500/20">
                            <template.icon className="w-8 h-8" />
                        </div>
                        <DialogTitle className="text-3xl font-black italic tracking-tighter mb-2 text-white leading-none">
                            {template.title}
                        </DialogTitle>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-8 border border-indigo-500/20">
                            {template.category.replace("-", " ")}
                        </div>

                        <DialogDescription className="text-lg text-slate-400 font-medium leading-relaxed mb-8">
                            {template.description}
                        </DialogDescription>
                    </div>

                    <Button
                        onClick={handleUsePattern}
                        className="w-full rounded-2xl py-8 h-auto font-black italic uppercase tracking-[0.2em] text-[12px] premium-gradient hover:opacity-90 transition-all shadow-2xl hover:shadow-indigo-500/40 relative z-10 group"
                    >
                        Use This Pattern <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>

                {/* Content/Slides Side (Right) */}
                <div className="flex-1 h-full relative flex flex-col bg-[#0B0F1A] min-w-0">
                    <div className="p-8 lg:p-12 pb-6 border-b border-white/5 bg-[#0B0F1A]/80 backdrop-blur-md z-20 shrink-0">
                        <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500">Blueprint Breakdown</h4>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-8 lg:p-12 pt-6 relative">
                        <div className="space-y-4 pb-32">
                            {slides.map((slide: any, idx: number) => (
                                <div
                                    key={idx}
                                    className="flex items-center gap-5 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.05] group hover:border-indigo-500/40 transition-all hover:bg-white/[0.04] relative"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-[#05070A] flex items-center justify-center text-[11px] font-black text-slate-500 group-hover:text-indigo-400 border border-white/5 transition-colors shadow-inner shrink-0">
                                        {String(idx + 1).padStart(2, "0")}
                                    </div>
                                    <div className="flex flex-col gap-1 min-w-0">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400/60 group-hover:text-indigo-400 transition-colors truncate">
                                            {slide.type.replace("-", " ")}
                                        </span>
                                        <span className="text-[15px] font-bold text-slate-200 group-hover:text-white group-hover:translate-x-1 transition-all truncate">
                                            {slide.title}
                                        </span>
                                    </div>
                                    <div className="ml-auto flex items-center justify-center w-8 h-8 rounded-full bg-white/[0.02] border border-white/5 group-hover:border-indigo-500/40 transition-all shrink-0">
                                        <CheckCircle2 className="w-4 h-4 text-indigo-500 opacity-20 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Mask overlay for better focus */}
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0B0F1A] via-[#0B0F1A]/90 to-transparent pointer-events-none z-30" />
                </div>
            </DialogContent>
        </Dialog>
    );
}
