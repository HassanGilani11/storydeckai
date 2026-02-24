"use client";

import Link from "next/link";
import { Project } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Layout, Pencil, Check, X, Archive, RotateCcw } from "lucide-react";
import { useState } from "react";
import { updateProjectTitle, archiveProject, unarchiveProject } from "@/actions/project";
import { toast } from "sonner";

interface ProjectListProps {
    projects: Project[];
}

export function ProjectList({ projects }: ProjectListProps) {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleStartEdit = (project: Project) => {
        setEditingId(project.id);
        setEditValue(project.title);
    };

    const handleSaveEdit = async (id: string) => {
        if (!editValue.trim() || isLoading) return;

        setIsLoading(true);
        try {
            await updateProjectTitle(id, editValue.trim());
            setEditingId(null);
            toast.success("Project title updated");
        } catch (error) {
            toast.error("Failed to update project title");
        } finally {
            setIsLoading(false);
        }
    };

    const handleArchive = async (id: string) => {
        setIsLoading(true);
        try {
            await archiveProject(id);
            toast.success("Project archived");
        } catch (error) {
            toast.error("Failed to archive project");
        } finally {
            setIsLoading(false);
        }
    };

    const handleUnarchive = async (id: string) => {
        setIsLoading(true);
        try {
            await unarchiveProject(id);
            toast.success("Project restored");
        } catch (error) {
            toast.error("Failed to unarchive project");
        } finally {
            setIsLoading(false);
        }
    };

    if (projects.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-20 glass-panel rounded-[2.5rem] border-dashed border-border bg-muted/20 text-center">
                <div className="w-20 h-20 bg-muted rounded-3xl flex items-center justify-center mb-8 shadow-inner border border-border">
                    <Layout className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-black mb-3 text-foreground tracking-tight">No projects yet</h3>
                <p className="text-muted-foreground mb-10 max-w-sm font-medium text-lg leading-relaxed">
                    Start your story-telling journey by creating your first strategic deck outline.
                </p>
                <Link href="/dashboard/new">
                    <Button size="lg" className="bg-primary text-primary-foreground hover:opacity-90 rounded-2xl px-10 py-7 font-black text-base shadow-2xl transition-all hover:scale-105 active:scale-95">
                        <Plus className="w-5 h-5 mr-3" />
                        Create First Project
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
                <div key={project.id} className="group relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-fuchsia-500/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem] -z-10" />
                    <Card className="glass-panel border-border bg-card rounded-[2rem] overflow-hidden hover:bg-muted/50 transition-all h-full flex flex-col hover:-translate-y-2">
                        <CardHeader className="p-8 pb-4">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-muted rounded-xl border border-border text-indigo-400 shadow-inner group-hover:scale-110 transition-transform">
                                    <Layout className="w-5 h-5" />
                                </div>
                                <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-indigo-500/20">
                                    {project.type.replace("_", " ")}
                                </span>
                            </div>

                            {editingId === project.id ? (
                                <div className="flex items-center gap-2 mt-2">
                                    <input
                                        autoFocus
                                        value={editValue}
                                        onChange={(e) => setEditValue(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") handleSaveEdit(project.id);
                                            if (e.key === "Escape") setEditingId(null);
                                        }}
                                        className="bg-muted border border-primary/30 rounded-lg px-3 py-2 text-lg font-bold text-foreground w-full outline-none focus:ring-2 ring-primary/20"
                                    />
                                    <button onClick={() => handleSaveEdit(project.id)} className="p-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
                                        <Check className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => setEditingId(null)} className="p-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-opacity">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between gap-2 group/title">
                                    <CardTitle className="text-2xl font-black text-foreground group-hover:text-indigo-400 transition-colors tracking-tight leading-tight truncate">
                                        {project.title}
                                    </CardTitle>
                                    <div className="flex items-center gap-1 opacity-0 group-hover/title:opacity-100 transition-all shrink-0">
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleStartEdit(project);
                                            }}
                                            className="p-1.5 text-muted-foreground hover:text-primary transition-all"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (project.is_archived) {
                                                    handleUnarchive(project.id);
                                                } else {
                                                    handleArchive(project.id);
                                                }
                                            }}
                                            disabled={isLoading}
                                            className="p-1.5 text-muted-foreground hover:text-amber-500 transition-all disabled:opacity-50"
                                            title={project.is_archived ? "Restore" : "Archive"}
                                        >
                                            {project.is_archived ? <RotateCcw className="w-4 h-4" /> : <Archive className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </CardHeader>
                        <CardContent className="px-8 flex-1">
                            <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest opacity-60">
                                Last modified: {new Date(project.created_at).toLocaleDateString()}
                            </p>
                        </CardContent>
                        <CardFooter className="p-8 pt-4">
                            <Link href={`/project/${project.id}/outline`} className="w-full">
                                <Button variant="secondary" className="w-full bg-muted hover:bg-muted/80 text-foreground border-border rounded-xl h-12 font-black tracking-wide uppercase text-xs transition-all">
                                    Open Designer
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>
                </div>
            ))}
        </div>
    );
}
