"use client";

import { useEffect } from "react";
import { useEditorStore } from "@/store/use-editor-store";
import { Slide } from "@/types";
import { cn } from "@/lib/utils";
import { EditorSidebar } from "@/components/slide-editor/editor-sidebar";
import { SlideRenderer } from "@/components/slide-canvas/slide-renderer";
import { ContentForm } from "@/components/slide-editor/content-form";
import { saveAllSlides } from "@/actions/editor";
import { generatePptx } from "@/lib/export/pptx";
import { Button } from "@/components/ui/button";
import { Save, Play, Download, ChevronLeft, Loader2, X } from "lucide-react";
import Link from "next/link";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogHeader,
    DialogTitle,
    DialogClose
} from "@/components/ui/dialog";
import { useState } from "react";

interface EditorClientProps {
    initialSlides: Slide[];
    projectId: string;
    brandKit: any | null;
}



export function EditorClient({ initialSlides, projectId, brandKit }: EditorClientProps) {
    const { slides, setSlides, setBrandKit, activeSlideId, setActiveSlideId, isSaving, setIsSaving } = useEditorStore();
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    useEffect(() => {
        setSlides(initialSlides);
        setBrandKit(brandKit);
        if (initialSlides.length > 0 && !activeSlideId) {
            setActiveSlideId(initialSlides[0].id);
        }
    }, [initialSlides, brandKit, setSlides, setBrandKit, setActiveSlideId, activeSlideId]);

    const activeSlide = slides.find((s) => s.id === activeSlideId);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await saveAllSlides(projectId, slides);
        } catch (error) {
            console.error("Save failed:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleExport = async () => {
        await generatePptx("StoryDeck_Export", slides);
    };

    return (
        <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden selection:bg-indigo-500/30">
            {/* Top Navbar - Glassmorphic */}
            <header className="h-16 border-b border-border bg-background/50 backdrop-blur-xl flex items-center justify-between px-6 z-20">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-muted">
                            <ChevronLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div className="h-6 w-px bg-border" />
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg premium-gradient flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white">
                            <span className="font-black text-xs">SD</span>
                        </div>
                        <h1 className="text-sm font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/50">
                            StoryDeck AI
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {slides.length > 0 && (
                        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted border border-border text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                            <div className="w-1 h-1 rounded-full bg-indigo-500 animate-pulse" />
                            {slides.length} Slides
                        </div>
                    )}



                    <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground hover:bg-muted">
                                <Play className="w-4 h-4 mr-2" />
                                Preview
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-[95vw] w-full h-[90vh] p-0 bg-background border-border flex flex-col overflow-hidden">
                            <DialogHeader className="p-4 border-b border-border flex flex-row items-center justify-between space-y-0 bg-muted/50 backdrop-blur-md">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-red-500" />
                                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                    <DialogTitle className="text-foreground text-sm font-medium ml-2">Presentation Mode</DialogTitle>
                                </div>
                                <DialogClose asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                        <X className="w-4 h-4" />
                                    </Button>
                                </DialogClose>
                            </DialogHeader>
                            <div className="flex-1 p-12 flex items-center justify-center bg-background overflow-hidden relative">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/5 via-transparent to-transparent" />
                                {activeSlide ? (
                                    <div className="w-full max-w-5xl shadow-[0_0_80px_rgba(79,70,229,0.1)] transition-transform duration-500 hover:scale-[1.01]">
                                        <SlideRenderer slide={activeSlide} />
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground">No slide selected</p>
                                )}
                            </div>
                        </DialogContent>
                    </Dialog>

                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className={cn(
                            "min-w-[90px] h-9 transition-all rounded-full font-bold text-xs",
                            isSaving
                                ? "bg-muted text-muted-foreground"
                                : "bg-primary text-primary-foreground hover:opacity-90 hover:scale-105 active:scale-95 shadow-xl shadow-primary/20"
                        )}
                    >
                        {isSaving ? (
                            <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                        ) : (
                            <Save className="w-3.5 h-3.5 mr-2" />
                        )}
                        {isSaving ? "Saving..." : "Save"}
                    </Button>

                    <Button
                        onClick={handleExport}
                        size="sm"
                        className="h-9 rounded-full bg-indigo-600 text-white hover:bg-indigo-500 hover:scale-105 active:scale-95 px-5 font-bold text-xs shadow-lg shadow-indigo-600/20"
                    >
                        <Download className="w-3.5 h-3.5 mr-2" />
                        Export
                    </Button>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="flex flex-1 overflow-hidden relative">
                {/* Visual Grain background */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.03] animate-pulse" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />

                <EditorSidebar projectId={projectId} />

                <main className="flex-1 bg-background p-8 lg:p-16 overflow-y-auto flex items-center justify-center custom-scrollbar relative">
                    {/* Stage background decorations */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-px bg-gradient-to-r from-transparent via-border to-transparent" />

                    <div className="max-w-5xl w-full z-10">
                        {activeSlide ? (
                            <div className="slide-zoom-in drop-shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
                                <SlideRenderer slide={activeSlide} />
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-4 text-muted-foreground">
                                <div className="w-16 h-16 rounded-3xl bg-muted border border-border flex items-center justify-center">
                                    <Loader2 className="w-6 h-6 animate-spin opacity-20" />
                                </div>
                                <p className="text-sm font-medium tracking-wide uppercase opacity-40">Select a slide to build</p>
                            </div>
                        )}
                    </div>
                </main>

                <ContentForm />
            </div>
        </div>
    );
}
