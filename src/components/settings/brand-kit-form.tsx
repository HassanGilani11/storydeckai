"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Palette, Type, Image as ImageIcon, Check, Upload } from "lucide-react";
import { updateBrandKit } from "@/actions/settings";
import { createClient } from "@/lib/db/supabase";

const FONT_OPTIONS = [
    "Inter",
    "Roboto",
    "Open Sans",
    "Montserrat",
    "Lato",
    "Poppins",
    "Oswald",
    "Playfair Display",
    "Merriweather",
    "Outfit",
    "Space Grotesk",
    "Syncopate"
];

interface BrandKitFormProps {
    initialData: {
        primary_color: string | null;
        secondary_color: string | null;
        font_family: string | null;
        logo_url: string | null;
    } | null;
}

export function BrandKitForm({ initialData }: BrandKitFormProps) {
    const [isPending, startTransition] = useTransition();
    const [formData, setFormData] = useState({
        primary_color: initialData?.primary_color || "#4F46E5",
        secondary_color: initialData?.secondary_color || "#0F172A",
        font_family: initialData?.font_family || "Inter",
        logo_url: initialData?.logo_url || "",
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
                toast.success("Logo uploaded to Settings bucket");
            } catch (error: any) {
                toast.error(error.message || "Failed to upload logo");
            }
        });
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        startTransition(async () => {
            try {
                await updateBrandKit(formData);
                toast.success("Brand kit updated globally");
            } catch (error: any) {
                toast.error(error.message || "Failed to update brand kit");
            }
        });
    };

    return (
        <form onSubmit={onSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Primary Color */}
                <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2">
                        <Palette className="w-3 h-3" />
                        Primary Color
                    </label>
                    <div className="flex gap-4">
                        <div
                            className="w-12 h-12 rounded-xl border border-border shrink-0 shadow-inner transition-colors duration-500"
                            style={{ backgroundColor: formData.primary_color }}
                        />
                        <Input
                            value={formData.primary_color}
                            onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                            placeholder="#000000"
                            className="font-mono h-12"
                        />
                    </div>
                </div>

                {/* Secondary Color */}
                <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2">
                        <Palette className="w-3 h-3" />
                        Secondary Color
                    </label>
                    <div className="flex gap-4">
                        <div
                            className="w-12 h-12 rounded-xl border border-border shrink-0 shadow-inner transition-colors duration-500"
                            style={{ backgroundColor: formData.secondary_color }}
                        />
                        <Input
                            value={formData.secondary_color}
                            onChange={(e) => setFormData({ ...formData, secondary_color: e.target.value })}
                            placeholder="#000000"
                            className="font-mono h-12"
                        />
                    </div>
                </div>

                {/* Font Family Selection */}
                <div className="space-y-4 text-left">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2">
                        <Type className="w-3 h-3" />
                        Global Font Family
                    </label>
                    <Select
                        value={formData.font_family}
                        onValueChange={(val) => setFormData({ ...formData, font_family: val })}
                    >
                        <SelectTrigger className="h-12 rounded-xl border border-border bg-background focus:ring-primary/20">
                            <SelectValue placeholder="Select a font" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border border-border bg-popover shadow-2xl">
                            {FONT_OPTIONS.map((font) => (
                                <SelectItem key={font} value={font} className="font-medium">
                                    <span style={{ fontFamily: font }}>{font}</span>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <p className="text-[9px] text-muted-foreground italic">Choice will reflect across all pages instantly after saving.</p>
                </div>

                {/* Logo Upload Feature */}
                <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2">
                        <ImageIcon className="w-3 h-3" />
                        Organization Logo
                    </label>
                    <div className="flex items-center gap-4 p-2 rounded-2xl bg-muted/30 border border-border/50">
                        <div className="w-16 h-16 rounded-xl bg-card border border-border flex items-center justify-center overflow-hidden shrink-0">
                            {formData.logo_url ? (
                                <img src={formData.logo_url} alt="Logo" className="w-full h-full object-contain p-2" />
                            ) : (
                                <ImageIcon className="w-6 h-6 text-muted-foreground" />
                            )}
                        </div>
                        <div className="flex-1">
                            <label className="cursor-pointer">
                                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-all text-xs font-black uppercase tracking-tight">
                                    <Upload className="w-3 h-3" />
                                    {formData.logo_url ? "Replace Logo" : "Upload Logo"}
                                </div>
                                <input type="file" className="hidden" accept="image/*" onChange={onLogoChange} disabled={isPending} />
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <Button
                    type="submit"
                    disabled={isPending}
                    className="rounded-2xl px-10 py-7 h-auto font-black italic uppercase tracking-widest text-[11px] premium-gradient hover:opacity-90 transition-all shadow-xl hover:shadow-indigo-500/30"
                >
                    {isPending ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Synchronizing...
                        </>
                    ) : (
                        <>
                            <Check className="w-5 h-5 mr-2" />
                            Apply Brand Changes
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}
