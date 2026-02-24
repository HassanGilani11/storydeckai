"use client";

import { useEditorStore } from "@/store/use-editor-store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Layout,
    Type,
    BarChart3,
    LayoutList,
    Trash2,
    Plus,
    Image as ImageIcon,
    Clock,
    Columns,
    Quote,
    MousePointerClick
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { createClient } from "@/lib/db/supabase";

const PRESET_ICONS = [
    "Rocket", "Target", "Zap", "Users", "Shield",
    "Globe", "Award", "Lightbulb", "CheckCircle", "TrendingUp"
];

export function ContentForm() {
    const { slides, activeSlideId, updateActiveSlideContent } = useEditorStore();
    const activeSlide = slides.find(s => s.id === activeSlideId);
    const [isUploading, setIsUploading] = useState(false);

    if (!activeSlide) return null;

    const content = activeSlide.content_json || { title: "", bullets: [] };

    const handleImageUpload = async (file: File) => {
        setIsUploading(true);
        const supabase = createClient();

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `slides/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('SlideDeck')
                .upload(filePath, file);

            if (uploadError) {
                console.error("Supabase upload error:", uploadError);
                throw new Error(uploadError.message);
            }

            const { data: { publicUrl } } = supabase.storage
                .from('SlideDeck')
                .getPublicUrl(filePath);

            updateActiveSlideContent({ ...content, imageUrl: publicUrl });
        } catch (error: any) {
            console.error("Upload failed:", error);
            alert(`Upload failed: ${error.message || "Unknown error"}`);
        } finally {
            setIsUploading(false);
        }
    };

    const handleTitleChange = (title: string) => {
        updateActiveSlideContent({ ...content, title });
    };

    const handleBulletChange = (index: number, value: string) => {
        const nextBullets = [...(content.bullets || [])];
        nextBullets[index] = value;
        updateActiveSlideContent({ ...content, bullets: nextBullets });
    };

    const removeBullet = (index: number) => {
        const nextBullets = (content.bullets || []).filter((_: any, i: number) => i !== index);
        updateActiveSlideContent({ ...content, bullets: nextBullets });
    };

    const addBullet = () => {
        updateActiveSlideContent({ ...content, bullets: [...(content.bullets || []), ""] });
    };

    return (
        <div className="w-80 border-l border-border bg-background/50 backdrop-blur-3xl flex flex-col h-full overflow-y-auto p-6 space-y-8 slide-fade-in relative z-20" style={{ animationDelay: '0.2s' }}>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-foreground tracking-widest uppercase opacity-80">Editor</h3>
                    <div className="px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-[9px] font-bold text-indigo-400">
                        AI Magic
                    </div>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-muted border border-border">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    <p className="text-[10px] text-muted-foreground leading-relaxed uppercase tracking-widest font-bold">
                        {activeSlide.slide_type}
                    </p>
                </div>

                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Visual Layout</Label>
                    <Select
                        value={content.layout || "standard"}
                        onValueChange={(value: string) => updateActiveSlideContent({ ...content, layout: value })}
                    >
                        <SelectTrigger className="bg-muted border-border h-11 rounded-xl font-bold text-xs uppercase tracking-widest">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-border bg-popover shadow-2xl">
                            <SelectItem value="standard" className="py-3">
                                <div className="flex items-center gap-3">
                                    <Layout className="w-4 h-4 text-indigo-400" />
                                    <span className="text-xs font-bold uppercase tracking-wider">Standard</span>
                                </div>
                            </SelectItem>
                            <SelectItem value="centered-title" className="py-3">
                                <div className="flex items-center gap-3">
                                    <Type className="w-4 h-4 text-fuchsia-400" />
                                    <span className="text-xs font-bold uppercase tracking-wider">Centered Title</span>
                                </div>
                            </SelectItem>
                            <SelectItem value="metrics-grid" className="py-3">
                                <div className="flex items-center gap-3">
                                    <BarChart3 className="w-4 h-4 text-emerald-400" />
                                    <span className="text-xs font-bold uppercase tracking-wider">Metrics Grid</span>
                                </div>
                            </SelectItem>
                            <SelectItem value="split-hero" className="py-3">
                                <div className="flex items-center gap-3">
                                    <LayoutList className="w-4 h-4 text-rose-400" />
                                    <span className="text-xs font-bold uppercase tracking-wider">Split Hero</span>
                                </div>
                            </SelectItem>
                            <SelectItem value="timeline" className="py-3">
                                <div className="flex items-center gap-3">
                                    <Clock className="w-4 h-4 text-amber-400" />
                                    <span className="text-xs font-bold uppercase tracking-wider">Timeline</span>
                                </div>
                            </SelectItem>
                            <SelectItem value="comparison" className="py-3">
                                <div className="flex items-center gap-3">
                                    <Columns className="w-4 h-4 text-cyan-400" />
                                    <span className="text-xs font-bold uppercase tracking-wider">Comparison</span>
                                </div>
                            </SelectItem>
                            <SelectItem value="quote" className="py-3">
                                <div className="flex items-center gap-3">
                                    <Quote className="w-4 h-4 text-purple-400" />
                                    <span className="text-xs font-bold uppercase tracking-wider">Quote</span>
                                </div>
                            </SelectItem>
                            <SelectItem value="cta" className="py-3">
                                <div className="flex items-center gap-3">
                                    <MousePointerClick className="w-4 h-4 text-blue-400" />
                                    <span className="text-xs font-bold uppercase tracking-wider">CTA</span>
                                </div>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-6">
                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Headline</Label>
                    <Input
                        value={content.title || ""}
                        onChange={(e) => updateActiveSlideContent({ ...content, title: e.target.value })}
                        className="bg-muted border-border text-foreground focus:ring-primary h-11 rounded-xl font-medium"
                        placeholder="Main title of the slide"
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Subtitle</Label>
                    <Input
                        value={content.subtitle || ""}
                        onChange={(e) => updateActiveSlideContent({ ...content, subtitle: e.target.value })}
                        className="bg-muted border-border text-foreground focus:ring-primary h-11 rounded-xl text-sm"
                        placeholder="Supporting headline"
                    />
                </div>

                <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Key Points</Label>
                    <div className="space-y-3">
                        {(content.bullets || []).map((bullet: string, index: number) => (
                            <div key={index} className="flex gap-2 group slide-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                                <Textarea
                                    value={bullet}
                                    onChange={(e) => handleBulletChange(index, e.target.value)}
                                    className="bg-muted border-border text-foreground text-sm min-h-[60px] resize-none focus:ring-primary rounded-xl"
                                    placeholder={`Point ${index + 1}`}
                                />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeBullet(index)}
                                    className="text-muted-foreground hover:text-red-400 hover:bg-red-500/10 md:opacity-0 group-hover:opacity-100 transition-all h-auto rounded-lg"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                        <Button
                            variant="outline"
                            onClick={addBullet}
                            className="w-full border-dashed border-border text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl h-11"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Point
                        </Button>
                    </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-border">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Visual Icon</Label>
                    <div className="grid grid-cols-5 gap-2">
                        {PRESET_ICONS.map((iconName) => {
                            const IconComponent = (LucideIcons as any)[iconName];
                            return (
                                <Button
                                    key={iconName}
                                    variant="outline"
                                    size="icon"
                                    onClick={() => updateActiveSlideContent({ ...content, icon: iconName })}
                                    className={cn(
                                        "w-10 h-10 border-border bg-muted transition-all rounded-xl",
                                        content.icon === iconName
                                            ? "border-primary text-primary bg-primary/10 ring-1 ring-primary/50"
                                            : "text-muted-foreground hover:text-foreground hover:border-border hover:bg-muted/80"
                                    )}
                                >
                                    <IconComponent className="w-4 h-4" />
                                </Button>
                            );
                        })}
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateActiveSlideContent({ ...content, icon: undefined })}
                            className={cn(
                                "w-10 h-10 border-border bg-muted text-muted-foreground hover:text-foreground hover:bg-red-500/10 hover:border-red-500/20 rounded-xl",
                                !content.icon && "hidden"
                            )}
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-border">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Slide Image</Label>
                    <div className="space-y-3">
                        {content.imageUrl ? (
                            <div className="relative group rounded-2xl overflow-hidden border border-border aspect-video bg-muted shadow-lg">
                                <img src={content.imageUrl} alt="Slide preview" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-background/80 md:opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => updateActiveSlideContent({ ...content, imageUrl: undefined })}
                                        className="rounded-lg font-bold h-8"
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Remove
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="relative border-2 border-dashed border-border rounded-2xl p-6 flex flex-col items-center justify-center gap-3 bg-muted hover:bg-muted/80 hover:border-primary/50 transition-all cursor-pointer group">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handleImageUpload(file);
                                    }}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    disabled={isUploading}
                                />
                                {isUploading ? (
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Uploading...</span>
                                    </div>
                                ) : (
                                    <>
                                        <div className="p-3 rounded-[1.25rem] bg-background border border-border text-muted-foreground group-hover:text-primary group-hover:bg-primary/5 transition-all">
                                            <Plus className="w-5 h-5" />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Add Media</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-border">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Call to Action (Button)</Label>
                    <div className="space-y-3">
                        <Input
                            value={content.cta || ""}
                            onChange={(e) => updateActiveSlideContent({ ...content, cta: e.target.value })}
                            className="bg-muted border-border text-foreground focus:ring-primary h-11 rounded-xl text-sm font-medium"
                            placeholder="e.g. Shop Now"
                        />
                        <Input
                            value={content.ctaLink || ""}
                            onChange={(e) => updateActiveSlideContent({ ...content, ctaLink: e.target.value })}
                            className="bg-muted border-border text-muted-foreground focus:ring-primary h-9 rounded-xl text-[10px] font-mono"
                            placeholder="https://yourlink.com"
                        />
                    </div>
                </div>

                <div className="space-y-2 pt-6 border-t border-border">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Footer Text</Label>
                    <Input
                        value={content.footer || ""}
                        onChange={(e) => updateActiveSlideContent({ ...content, footer: e.target.value })}
                        className="bg-muted border-border text-muted-foreground focus:ring-primary h-11 rounded-xl text-xs"
                        placeholder="e.g. 2024 StoryDeck AI Inc."
                    />
                </div>
            </div>
        </div>
    );
}
