"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { updateUserProfile } from "@/actions/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, Sparkles, Upload, User as UserIcon } from "lucide-react";
import { createClient } from "@/lib/db/supabase";

const profileSchema = z.object({
    full_name: z.string().min(2, "Name must be at least 2 characters"),
    role: z.string().min(2, "Role must be at least 2 characters"),
    avatar_url: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileFormProps {
    initialData: {
        full_name: string | null;
        role: string | null;
        avatar_url?: string | null;
    };
}

export function ProfileForm({ initialData }: ProfileFormProps) {
    const [isPending, startTransition] = useTransition();

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            full_name: initialData.full_name || "",
            role: initialData.role || "",
            avatar_url: initialData.avatar_url || "",
        },
    });

    const avatarUrl = form.watch("avatar_url");

    const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        console.log("Starting avatar upload:", file.name, file.size, file.type);

        startTransition(async () => {
            try {
                const supabase = createClient();
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `${fileName}`;

                console.log("Uploading to 'Profile' bucket at path:", filePath);

                const { error: uploadError, data: uploadData } = await supabase.storage
                    .from('Profile')
                    .upload(filePath, file);

                if (uploadError) {
                    console.error("Supabase Storage Upload Error:", uploadError);
                    throw uploadError;
                }

                console.log("Upload successful, fetching public URL...", uploadData);

                const { data: { publicUrl } } = supabase.storage
                    .from('Profile')
                    .getPublicUrl(filePath);

                console.log("Public URL generated:", publicUrl);

                form.setValue("avatar_url", publicUrl);
                toast.success("Avatar uploaded successfully");
            } catch (error: any) {
                console.error("Avatar Upload Process Failed:", error);
                toast.error(error.message || "Failed to upload avatar");
            }
        });
    };

    const onSubmit = (values: ProfileFormValues) => {
        startTransition(async () => {
            try {
                const result = await updateUserProfile(values);
                if (result?.error) {
                    toast.error(result.error);
                } else {
                    toast.success("Profile updated successfully");
                }
            } catch (error) {
                toast.error("Failed to update profile");
            }
        });
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex flex-col items-center mb-12">
                <div className="relative group">
                    <div className="w-40 h-40 rounded-[2.5rem] premium-gradient p-1 shadow-2xl transition-all group-hover:scale-105">
                        <div className="w-full h-full rounded-[2.25rem] bg-card flex items-center justify-center overflow-hidden relative">
                            {avatarUrl ? (
                                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-5xl font-black italic text-foreground opacity-90">
                                    {(form.getValues("full_name") || "S").charAt(0).toUpperCase()}
                                </span>
                            )}

                            <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer backdrop-blur-[2px]">
                                <Upload className="w-8 h-8 text-white mb-2 animate-bounce" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-white">Upload New</span>
                                <input type="file" className="hidden" accept="image/*" onChange={onAvatarChange} disabled={isPending} />
                            </label>
                        </div>
                    </div>
                    {isPending && (
                        <div className="absolute inset-0 flex items-center justify-center bg-card/50 rounded-[2.5rem] z-10 backdrop-blur-sm">
                            <Loader2 className="w-10 h-10 animate-spin text-primary" />
                        </div>
                    )}
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 mt-6">Professional Identity</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Full Name</label>
                    <Input
                        {...form.register("full_name")}
                        className="bg-card border-border rounded-xl h-12 font-bold px-4 focus:ring-primary/20"
                        placeholder="John Doe"
                        disabled={isPending}
                    />
                    {form.formState.errors.full_name && (
                        <p className="text-xs text-destructive font-bold">{form.formState.errors.full_name.message}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Professional Role</label>
                    <Input
                        {...form.register("role")}
                        className="bg-card border-border rounded-xl h-12 font-bold px-4 focus:ring-primary/20"
                        placeholder="Strategic Founder"
                        disabled={isPending}
                    />
                    {form.formState.errors.role && (
                        <p className="text-xs text-destructive font-bold">{form.formState.errors.role.message}</p>
                    )}
                </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-border mt-8">
                <Button
                    type="submit"
                    disabled={isPending}
                    className="bg-primary text-primary-foreground hover:opacity-90 rounded-2xl px-10 py-6 font-black text-sm shadow-xl transition-all hover:scale-105 active:scale-95"
                >
                    {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                    Save Profile
                </Button>
            </div>
        </form>
    );
}
