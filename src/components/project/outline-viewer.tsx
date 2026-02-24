"use client";

import { useState } from "react";
import { OutlineJSON, SlideType } from "@/types";
import { approveOutlineAndGenerateSlides } from "@/actions/slide";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Edit2, GripVertical, Plus, Trash2, ArrowRight, Loader2 } from "lucide-react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from "@/lib/utils";

interface SortableSlideProps {
    slide: any;
    index: number;
    editingIndex: number | null;
    setEditingIndex: (index: number | null) => void;
    handleUpdateTitle: (index: number, title: string) => void;
    removeSlide: (index: number) => void;
}

function SortableSlide({
    slide,
    index,
    editingIndex,
    setEditingIndex,
    handleUpdateTitle,
    removeSlide
}: SortableSlideProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: slide.id || `slide-${index}` });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 'auto',
    };

    return (
        <Card
            ref={setNodeRef}
            style={style}
            className={cn(
                "bg-card border-border group overflow-hidden transition-colors",
                isDragging ? "opacity-50 ring-2 ring-primary" : "opacity-100"
            )}
        >
            <div className="flex items-center p-4 gap-4">
                <div
                    {...attributes}
                    {...listeners}
                    className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground p-2 -ml-2 rounded hover:bg-muted"
                >
                    <GripVertical className="w-5 h-5" />
                </div>

                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold border border-indigo-500/20">
                    {index + 1}
                </div>

                <div className="flex-1">
                    {editingIndex === index ? (
                        <Input
                            value={slide.title}
                            onChange={(e) => handleUpdateTitle(index, e.target.value)}
                            onBlur={() => setEditingIndex(null)}
                            onKeyDown={(e) => e.key === 'Enter' && setEditingIndex(null)}
                            autoFocus
                            className="bg-muted border-primary text-foreground"
                        />
                    ) : (
                        <div className="flex items-center gap-2">
                            <h3 className="text-foreground font-medium">{slide.title}</h3>
                            <span className="px-2 py-0.5 rounded bg-muted text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
                                {slide.type}
                            </span>
                        </div>
                    )}
                    {slide.bullets && slide.bullets.length > 0 && (
                        <p className="text-sm text-muted-foreground mt-1 truncate max-w-xl">
                            {slide.bullets.join(" • ")}
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingIndex(index)}
                        className="text-muted-foreground hover:text-foreground"
                    >
                        <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeSlide(index)}
                        className="text-muted-foreground hover:text-red-400"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </Card>
    );
}

interface OutlineViewerProps {
    initialOutline: OutlineJSON;
    projectId: string;
}

export function OutlineViewer({ initialOutline, projectId }: OutlineViewerProps) {
    const [outline, setOutline] = useState<OutlineJSON>(() => {
        // Ensure each slide has a unique ID for dnd-kit
        const slidesWithIds = initialOutline.slides.map((s, i) => ({
            ...s,
            id: (s as any).id || `slide-${Date.now()}-${i}`
        }));
        return { ...initialOutline, slides: slidesWithIds };
    });
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setOutline((prev) => {
                const oldIndex = prev.slides.findIndex((s: any) => s.id === active.id);
                const newIndex = prev.slides.findIndex((s: any) => s.id === over.id);
                return {
                    ...prev,
                    slides: arrayMove(prev.slides, oldIndex, newIndex),
                };
            });
        }
    };

    const handleUpdateTitle = (index: number, newTitle: string) => {
        const nextOutline = { ...outline };
        nextOutline.slides[index].title = newTitle;
        setOutline(nextOutline);
    };

    const removeSlide = (index: number) => {
        const nextOutline = { ...outline };
        nextOutline.slides = nextOutline.slides.filter((_, i) => i !== index);
        setOutline(nextOutline);
    };

    const [isApproving, setIsApproving] = useState(false);

    const approveOutline = async () => {
        setIsApproving(true);
        try {
            await approveOutlineAndGenerateSlides(projectId, outline);
        } catch (error: any) {
            if (error.message?.includes("NEXT_REDIRECT")) {
                return;
            }
            console.error("Approval failed:", error);
            setIsApproving(false);
            alert("Failed to initialize slides. Please try again.");
        }
    };

    const addCustomSlide = () => {
        const newSlide = {
            id: `slide-${Date.now()}`,
            type: "solution" as SlideType,
            title: "New Slide",
            bullets: []
        };
        setOutline({
            ...outline,
            slides: [...outline.slides, newSlide]
        });
    };

    return (
        <div className="space-y-8">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <div className="grid gap-4">
                    <SortableContext
                        items={outline.slides.map((s: any) => s.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        {outline.slides.map((slide, index) => (
                            <SortableSlide
                                key={(slide as any).id}
                                slide={slide}
                                index={index}
                                editingIndex={editingIndex}
                                setEditingIndex={setEditingIndex}
                                handleUpdateTitle={handleUpdateTitle}
                                removeSlide={removeSlide}
                            />
                        ))}
                    </SortableContext>
                </div>
            </DndContext>

            <div className="flex justify-between items-center py-6 border-t border-border">
                <Button
                    variant="outline"
                    onClick={addCustomSlide}
                    className="border-border text-muted-foreground"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Custom Slide
                </Button>
                <Button
                    onClick={approveOutline}
                    disabled={isApproving}
                    className="bg-primary text-primary-foreground hover:opacity-90 min-w-[200px]"
                >
                    {isApproving ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Initializing Slides...
                        </>
                    ) : (
                        <>
                            Approve & Generate Slides
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
