"use client";

import { useTransition, useEffect, Suspense, useState } from "react";
import { createProject } from "@/actions/project";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";

function CreateProjectFormContent() {
    const [isPending, startTransition] = useTransition();
    const searchParams = useSearchParams();
    const [title, setTitle] = useState("");
    const [type, setType] = useState("startup_pitch");
    const [templateId, setTemplateId] = useState<string | null>(null);

    useEffect(() => {
        const tId = searchParams.get("template");
        const tTitle = searchParams.get("title");

        if (tTitle) {
            setTitle(tTitle);
        }

        if (tId) {
            setTemplateId(tId);
            // Priority Mappings
            if (["sales-closing", "board-report", "minimal-modern"].includes(tId)) {
                setType("business_presentation");
            } else {
                setType("startup_pitch");
            }
        }
    }, [searchParams]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        startTransition(async () => {
            await createProject(formData);
        });
    };

    return (
        <div className="glass-panel rounded-[2.5rem] p-12 border border-border/50 shadow-2xl relative overflow-hidden group hover:border-primary/20 transition-all max-w-4xl">
            <div className="flex items-center gap-4 mb-12">
                <div className="w-12 h-12 rounded-2xl premium-gradient flex items-center justify-center text-white shadow-lg">
                    <Loader2 className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-2xl font-black italic tracking-tight underline-offset-8">New <span className="text-primary">Project</span></h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Pitch Deck & Strategy Configuration</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
                <input type="hidden" name="templateId" value={templateId || ""} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                        <Label htmlFor="title" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2">Project Title</Label>
                        <Input
                            id="title"
                            name="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Acme Tech Series A"
                            required
                            disabled={isPending}
                            className="bg-background/50 border-border h-14 rounded-2xl px-6 focus:ring-primary/20 transition-all font-medium text-lg"
                        />
                    </div>

                    <div className="space-y-4">
                        <Label htmlFor="type" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2">Project Mode</Label>
                        <Select name="type" value={type} onValueChange={setType} disabled={isPending}>
                            <SelectTrigger className="bg-background/50 border-border h-14 rounded-2xl px-6 focus:ring-primary/20 transition-all font-medium text-lg">
                                <SelectValue placeholder="Select a mode" />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl border-border bg-popover shadow-2xl">
                                <SelectItem value="startup_pitch" className="py-3 px-4">Startup Pitch (MVP)</SelectItem>
                                <SelectItem value="business_presentation" className="py-3 px-4">
                                    Strategic Presentation
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-border/50">
                    <Button variant="ghost" type="button" disabled={isPending} className="text-muted-foreground hover:text-foreground font-black uppercase tracking-widest text-[10px] rounded-xl px-6">
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={isPending}
                        className="rounded-2xl px-12 py-7 h-auto font-black italic uppercase tracking-widest text-[11px] premium-gradient hover:opacity-90 transition-all shadow-xl hover:shadow-indigo-500/30"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                                Analyzing...
                            </>
                        ) : (
                            "Initialize Engine"
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}

export function CreateProjectForm() {
    return (
        <Suspense fallback={<div className="h-96 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
            <CreateProjectFormContent />
        </Suspense>
    );
}
