"use client";

import { Slide } from "@/types";
import { useEditorStore } from "@/store/use-editor-store";
import { cn } from "@/lib/utils";
import { ArrowUp, ArrowDown, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EditorSidebarProps {
    projectId: string;
}

export function EditorSidebar({ projectId }: EditorSidebarProps) {
    const { slides, activeSlideId, setActiveSlideId, addSlide, removeSlide, reorderSlides } = useEditorStore();

    return (
        <div className="w-64 border-r border-border bg-background/30 backdrop-blur-xl flex flex-col h-full slide-fade-in font-sans relative z-20">
            <div className="p-6 border-b border-border flex items-center justify-between bg-muted/50">
                <div className="flex items-center gap-2">
                    <div className="w-1 h-3 rounded-full premium-gradient" />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Navigator</h3>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => addSlide(projectId)}
                    className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full"
                >
                    <Plus className="w-3.5 h-3.5" />
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {slides.map((slide, index) => (
                    <div key={slide.id} className="relative group">
                        <button
                            onClick={() => setActiveSlideId(slide.id)}
                            className={cn(
                                "w-full text-left transition-all rounded-[1.25rem] overflow-hidden border",
                                activeSlideId === slide.id
                                    ? "border-primary bg-primary/5 shadow-[0_0_20px_rgba(99,102,241,0.1)]"
                                    : "border-transparent hover:bg-muted"
                            )}
                        >
                            <div className="aspect-[16/9] w-full bg-muted flex items-center justify-center p-2 relative group-hover:scale-[1.02] transition-transform">
                                <span className="text-[10px] text-muted-foreground font-black absolute top-2 left-3 bg-background/50 px-1.5 py-0.5 rounded-md backdrop-blur-sm border border-border">
                                    {String(index + 1).padStart(2, '0')}
                                </span>
                                <div className="scale-[0.25] origin-center w-[400%] absolute pointer-events-none opacity-20">
                                    <div className="h-4 w-3/4 bg-muted-foreground mb-3 rounded-full" />
                                    <div className="h-2 w-full bg-muted-foreground mb-2 rounded-full" />
                                    <div className="h-2 w-2/3 bg-muted-foreground mb-2 rounded-full" />
                                </div>
                            </div>
                            <div className="px-4 py-3 border-t border-border bg-muted/20">
                                <p className={cn(
                                    "text-[11px] font-bold truncate uppercase tracking-wider",
                                    activeSlideId === slide.id ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                                )}>
                                    {slide.content_json?.title || slide.slide_type || "No Title"}
                                </p>
                            </div>
                        </button>

                        {/* Slide Controls - Premium Floating Mini-Overlay */}
                        <div className="absolute -right-2 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-all translate-x-1 group-hover:translate-x-0 z-10 p-1 bg-card border border-border rounded-xl shadow-2xl backdrop-blur-3xl">
                            <button
                                disabled={index === 0}
                                onClick={(e) => { e.stopPropagation(); reorderSlides(index, index - 1); }}
                                className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg disabled:opacity-10 transition-colors"
                            >
                                <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                                disabled={index === slides.length - 1}
                                onClick={(e) => { e.stopPropagation(); reorderSlides(index, index + 1); }}
                                className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg disabled:opacity-10 transition-colors"
                            >
                                <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            <div className="h-px bg-border w-1/2 mx-auto my-1" />
                            <button
                                onClick={(e) => { e.stopPropagation(); removeSlide(slide.id); }}
                                className="p-1.5 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                title="Remove Slide"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-6 mt-auto">
                <Button
                    variant="outline"
                    className="w-full border-border bg-muted/50 text-muted-foreground hover:text-primary-foreground hover:bg-primary hover:border-primary hover:scale-[1.02] active:scale-95 py-6 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all shadow-xl group/new"
                    onClick={() => addSlide(projectId)}
                >
                    <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform" />
                    Add Slide
                </Button>
            </div>
        </div>
    );
}
