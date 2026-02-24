"use client";

import { useState, useTransition } from "react";
import { BrandKit } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Palette, Type, Image as ImageIcon, Check, Upload, ExternalLink } from "lucide-react";
import { updateBrandKit } from "@/actions/settings";
import { createClient } from "@/lib/db/supabase";
import { cn } from "@/lib/utils";

const FONT_OPTIONS = [
    "Inter", "Roboto", "Open Sans", "Montserrat", "Lato", "Poppins", "Oswald", "Playfair Display", "Merriweather", "Outfit", "Space Grotesk", "Syncopate"
];

interface BrandAssetManagerProps {
    brandKit: BrandKit | null;
}

export function BrandAssetManager({ brandKit }: BrandAssetManagerProps) {
    const [isPending, startTransition] = useTransition();
    const [formData, setFormData] = useState({
        primary_color: brandKit?.primary_color || "#4F46E5",
        secondary_color: brandKit?.secondary_color || "#0F172A",
        font_family: brandKit?.font_family || "Inter",
        logo_url: brandKit?.logo_url || "",
    });

    const onLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        startTransition(async () => {
            try {
                const supabase = createClient();
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('Settings')
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('Settings')
                    .getPublicUrl(filePath);

                setFormData(prev => ({ ...prev, logo_url: publicUrl }));
                toast.success("Logo uploaded successfully");
            } catch (error: any) {
                toast.error(error.message || "Failed to upload logo");
            }
        });
    };

    const onSubmit = async () => {
        startTransition(async () => {
            try {
                await updateBrandKit(formData);
                toast.success("Brand Identity Synchronized");
            } catch (error: any) {
                toast.error(error.message || "Failed to update brand kit");
            }
        });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 slide-fade-in">
            {/* Visual Identity Preview Card */}
            <div className="space-y-8">
                <div className="glass-panel rounded-[2.5rem] p-12 border border-border/50 bg-gradient-to-br from-card to-muted/30 relative overflow-hidden group h-full">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full -z-10" />

                    <div className="flex items-center justify-between mb-12">
                        <div className="space-y-1">
                            <h3 className="text-2xl font-black italic uppercase tracking-tight text-foreground">Visual <span className="text-primary">Identity</span></h3>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Global Design Tokens</p>
                        </div>
                        <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20 text-primary">
                            <Palette className="w-5 h-5" />
                        </div>
                    </div>

                    <div className="space-y-12">
                        {/* Logo View */}
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2">
                                <ImageIcon className="w-3 h-3" />
                                Brand Logo
                            </label>
                            <div className="relative group/logo w-40 h-40">
                                <div className="absolute inset-0 bg-primary/10 blur-2xl opacity-0 group-hover/logo:opacity-100 transition-opacity rounded-full -z-10" />
                                <div className="w-full h-full rounded-3xl bg-card border border-border flex items-center justify-center overflow-hidden p-6 shadow-2xl transition-transform group-hover/logo:scale-105 duration-500">
                                    {formData.logo_url ? (
                                        <img src={formData.logo_url} alt="Brand" className="w-full h-full object-contain" />
                                    ) : (
                                        <ImageIcon className="w-12 h-12 text-muted-foreground opacity-20" />
                                    )}
                                </div>
                                <label className="absolute -bottom-3 -right-3 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center cursor-pointer shadow-xl hover:scale-110 active:scale-95 transition-all">
                                    <Upload className="w-4 h-4" />
                                    <input type="file" className="hidden" accept="image/*" onChange={onLogoChange} disabled={isPending} />
                                </label>
                            </div>
                        </div>

                        {/* Colors View */}
                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2">
                                    Primary
                                </label>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl border border-border/50 shadow-inner" style={{ backgroundColor: formData.primary_color }} />
                                    <Input
                                        value={formData.primary_color}
                                        onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                                        className="bg-transparent border-none p-0 text-sm font-black uppercase tracking-widest h-auto w-24 focus-visible:ring-0"
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2">
                                    Secondary
                                </label>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl border border-border/50 shadow-inner" style={{ backgroundColor: formData.secondary_color }} />
                                    <Input
                                        value={formData.secondary_color}
                                        onChange={(e) => setFormData({ ...formData, secondary_color: e.target.value })}
                                        className="bg-transparent border-none p-0 text-sm font-black uppercase tracking-widest h-auto w-24 focus-visible:ring-0"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Typography View */}
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2">
                                <Type className="w-3 h-3" />
                                Active Typography
                            </label>
                            <Select
                                value={formData.font_family}
                                onValueChange={(val) => setFormData({ ...formData, font_family: val })}
                            >
                                <SelectTrigger className="h-14 rounded-2xl border border-border/50 bg-card/50 text-base font-bold shadow-sm">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border border-border bg-popover shadow-2xl">
                                    {FONT_OPTIONS.map((font) => (
                                        <SelectItem key={font} value={font} className="font-medium p-3">
                                            <span style={{ fontFamily: font }}>{font}</span>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="mt-12 flex justify-end">
                        <Button
                            onClick={onSubmit}
                            disabled={isPending}
                            className="premium-gradient rounded-2xl px-8 h-12 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20 hover:scale-105 transition-all"
                        >
                            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}
                            Sync Changes
                        </Button>
                    </div>
                </div>
            </div>

            {/* Documentation / Info Card */}
            <div className="space-y-8">
                <div className="glass-panel rounded-[2.5rem] p-10 border border-border/30 bg-muted/10 h-full flex flex-col">
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-foreground mb-8">Asset Usage Guidelines</h4>

                    <div className="space-y-6 flex-1">
                        <div className="p-6 rounded-3xl bg-card/60 border border-border/40 space-y-3">
                            <div className="flex items-center gap-3 text-indigo-400">
                                <Check className="w-4 h-4" />
                                <span className="text-[11px] font-black uppercase tracking-widest">Global Synchronization</span>
                            </div>
                            <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                                Updating your colors and primary font here will automatically re-skin all existing decks and future strategic outlines.
                            </p>
                        </div>

                        <div className="p-6 rounded-3xl bg-card/60 border border-border/40 space-y-3 opacity-60">
                            <div className="flex items-center gap-3 text-fuchsia-400">
                                <ExternalLink className="w-4 h-4" />
                                <span className="text-[11px] font-black uppercase tracking-widest">SVG Icon Library</span>
                            </div>
                            <p className="text-sm text-muted-foreground font-medium leading-relaxed italic">
                                Support for custom SVG icon sets and component-based assets is launching in late Q1 2026.
                            </p>
                        </div>
                    </div>

                    <div className="mt-12 p-8 rounded-[2rem] bg-indigo-500/10 border border-indigo-500/20">
                        <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-2">Pro Recommendation</p>
                        <p className="text-sm font-medium italic text-indigo-300/80">
                            "Maintain a contrast ratio of at least 4.5:1 between your primary brand color and surface backgrounds for peak readability."
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
