"use client";

import { useState } from "react";
import { startOutlineGeneration, createManualOutline } from "@/actions/outline";
import { updateProjectData } from "@/actions/project";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, ArrowLeft, Loader2, Sparkles } from "lucide-react";

interface QuestionnaireFormProps {
    projectId: string;
    initialData?: Record<string, string>;
}

const STEPS = [
    {
        title: "The Problem",
        description: "What pain point are you solving for your customers?",
        fields: [
            { id: "problem", label: "Problem Statement", type: "textarea", placeholder: "e.g. Traditional business presentations are slow to build and lack strategic structure..." },
        ],
    },
    {
        title: "The Solution",
        description: "How does your product or service solve this problem?",
        fields: [
            { id: "solution", label: "Solution Overview", type: "textarea", placeholder: "e.g. StoryDeck AI is a structured thinking engine that guides users through strategic frameworks..." },
        ],
    },
    {
        title: "Target Market",
        description: "Who are you building this for?",
        fields: [
            { id: "market", label: "Target Audience & Size", type: "input", placeholder: "e.g. SaaS Founders, Marketing Teams, $2B TAM" },
        ],
    },
    {
        title: "The 'Ask'",
        description: "What do you need from investors or stakeholders?",
        fields: [
            { id: "ask", label: "Funding / Resources needed", type: "input", placeholder: "e.g. Seeking $500k for product development and initial GTM..." },
        ],
    },
];

export function QuestionnaireForm({ projectId, initialData = {} }: QuestionnaireFormProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState<Record<string, string>>(initialData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const next = async () => {
        setIsSaving(true);
        try {
            await updateProjectData(projectId, formData);
            setCurrentStep((s) => Math.min(s + 1, STEPS.length - 1));
        } catch (error) {
            console.error("Failed to auto-save:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const back = () => setCurrentStep((s) => Math.max(s - 1, 0));

    const handleChange = (id: string, value: string) => {
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const isLastStep = currentStep === STEPS.length - 1;

    const handleManualBuild = async () => {
        setIsSubmitting(true);
        try {
            await createManualOutline(projectId);
        } catch (error: any) {
            if (error.message === "NEXT_REDIRECT") return;

            console.error("Manual build failed:", error);
            setIsSubmitting(false);

            // Extract message if it exists
            const msg = error.message || "Failed to start manual build. Please try again.";
            alert(msg);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            await startOutlineGeneration(projectId, formData);
        } catch (error: any) {
            if (error.message === "NEXT_REDIRECT") return;

            console.error("Outline generation failed:", error);
            setIsSubmitting(false);

            // Extract a user-friendly message
            const message = error.message || "Failed to generate outline. Please check your AI configuration.";
            alert(`${message}\n\nYou can click 'Skip AI & Build Manually' to proceed without AI.`);
        }
    };

    const step = STEPS[currentStep];

    return (
        <Card className="glass-panel border-border bg-card rounded-[2.5rem] overflow-hidden slide-fade-in shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)]">
            <CardHeader className="p-10 lg:p-14">
                <div className="flex justify-between items-center mb-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-indigo-500/20">
                        Step {currentStep + 1} of {STEPS.length}
                    </div>
                    <div className="flex gap-1.5">
                        {STEPS.map((_, i) => (
                            <div
                                key={i}
                                className={`h-1.5 w-10 rounded-full transition-all duration-500 ${i <= currentStep ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'bg-muted'}`}
                            />
                        ))}
                    </div>
                </div>
                <CardTitle className="text-4xl lg:text-5xl font-black text-foreground tracking-tight leading-tight mb-4">
                    {step.title}
                </CardTitle>
                <CardDescription className="text-xl text-muted-foreground font-medium leading-relaxed">
                    {step.description}
                </CardDescription>
            </CardHeader>
            <CardContent className="px-10 lg:px-14 pb-10">
                <div className="space-y-8">
                    {step.fields.map((field) => (
                        <div key={field.id} className="space-y-4">
                            <Label htmlFor={field.id} className="text-muted-foreground text-xs font-black uppercase tracking-widest">{field.label}</Label>
                            {field.type === "textarea" ? (
                                <Textarea
                                    id={field.id}
                                    placeholder={field.placeholder}
                                    value={formData[field.id] || ""}
                                    onChange={(e) => handleChange(field.id, e.target.value)}
                                    className="glass-panel bg-muted/30 border-border text-foreground min-h-[200px] focus:ring-indigo-500/50 rounded-2xl p-6 text-lg font-medium placeholder:text-muted-foreground/50 transition-all focus:border-indigo-500/50"
                                />
                            ) : (
                                <Input
                                    id={field.id}
                                    placeholder={field.placeholder}
                                    value={formData[field.id] || ""}
                                    onChange={(e) => handleChange(field.id, e.target.value)}
                                    className="glass-panel h-16 bg-muted/30 border-border text-foreground focus:ring-indigo-500/50 rounded-2xl px-6 text-lg font-medium placeholder:text-muted-foreground/50 transition-all focus:border-indigo-500/50"
                                />
                            )}
                        </div>
                    ))}
                </div>
            </CardContent>
            <CardFooter className="px-10 lg:px-14 py-10 border-t border-border bg-muted/5 flex justify-between items-center">
                <Button
                    variant="ghost"
                    onClick={back}
                    disabled={currentStep === 0 || isSubmitting || isSaving}
                    className="text-muted-foreground hover:text-foreground font-black tracking-widest uppercase text-[10px] gap-2 hover:bg-muted h-12 rounded-xl"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </Button>

                <div className="flex items-center gap-6">
                    {isLastStep ? (
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                onClick={handleManualBuild}
                                disabled={isSubmitting || isSaving}
                                className="text-muted-foreground hover:text-foreground font-black tracking-widest uppercase text-[10px] h-12 rounded-xl"
                            >
                                Skip AI Manual Build
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                disabled={isSubmitting || isSaving}
                                className="bg-primary text-primary-foreground hover:opacity-90 min-w-[220px] h-14 rounded-2xl font-black text-base shadow-[0_20px_40px_-10px_rgba(99,102,241,0.3)] transition-all hover:scale-105 active:scale-95 px-8"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                                        Thinking...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5 mr-3" />
                                        Generate AI Outline
                                    </>
                                )}
                            </Button>
                        </div>
                    ) : (
                        <Button
                            onClick={next}
                            disabled={isSaving}
                            className="bg-primary text-primary-foreground hover:opacity-90 h-14 rounded-2xl px-10 font-black text-base shadow-[0_20px_40px_-10px_rgba(99,102,241,0.3)] transition-all hover:scale-105 active:scale-95"
                        >
                            {isSaving ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Next Step
                                    <ArrowRight className="w-5 h-5 ml-3" />
                                </>
                            )}
                        </Button>
                    )}
                </div>
            </CardFooter>
        </Card>
    );
}
