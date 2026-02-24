"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Slack, FileText, Database, ArrowRight, ExternalLink } from "lucide-react";

export function IntegrationSettings() {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {[
                {
                    name: "Slack",
                    icon: Slack,
                    color: "text-[#E01E5A]",
                    bg: "bg-[#E01E5A]/5",
                    desc: "Send story updates and alerts to your Slack channels."
                },
                {
                    name: "Notion",
                    icon: FileText,
                    color: "text-[#000000]",
                    bg: "bg-muted",
                    desc: "Sync deck outlines and business data with Notion pages."
                },
                {
                    name: "HubSpot CRM",
                    icon: Database,
                    color: "text-[#FF7A59]",
                    bg: "bg-[#FF7A59]/10",
                    desc: "Import lead data and export personalized pitches."
                }
            ].map((integration, i) => (
                <div key={integration.name} className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 rounded-2xl bg-muted/30 border border-border/50 group hover:border-primary/20 transition-all gap-4">
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl ${integration.bg} flex items-center justify-center ${integration.color}`}>
                            <integration.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-black text-foreground">{integration.name}</p>
                            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">{integration.desc}</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-xl px-4 py-2 h-auto font-black italic uppercase tracking-widest text-[9px] hover:bg-primary hover:text-white transition-all group/btn"
                        onClick={() => toast.info(`Connecting to ${integration.name}...`)}
                    >
                        Connect
                        <ArrowRight className="w-3 h-3 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                </div>
            ))}

            <div className="p-6 rounded-3xl bg-indigo-500/5 border border-indigo-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <p className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-1">Developer API</p>
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Connect StoryDeck to your custom workflow</p>
                </div>
                <Button
                    variant="outline"
                    className="rounded-xl border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 font-black italic uppercase tracking-widest text-[9px]"
                >
                    View API Docs
                    <ExternalLink className="w-3 h-3 ml-2" />
                </Button>
            </div>
        </div>
    );
}
