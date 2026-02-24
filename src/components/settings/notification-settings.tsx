"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Bell, Mail, Check } from "lucide-react";
import { updateUserSettings } from "@/actions/settings";

interface NotificationSettingsProps {
    initialSettings: {
        email_notifications?: boolean;
        in_app_notifications?: boolean;
        marketing_emails?: boolean;
    };
}

export function NotificationSettings({ initialSettings }: NotificationSettingsProps) {
    const [isPending, startTransition] = useTransition();
    const [settings, setSettings] = useState({
        email_notifications: initialSettings?.email_notifications ?? true,
        in_app_notifications: initialSettings?.in_app_notifications ?? true,
        marketing_emails: initialSettings?.marketing_emails ?? false,
    });

    const onToggle = (key: keyof typeof settings) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const onSave = async () => {
        startTransition(async () => {
            try {
                await updateUserSettings(settings);
                toast.success("Notification preferences updated");
            } catch (error: any) {
                toast.error(error.message || "Failed to update settings");
            }
        });
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/50 group hover:border-primary/20 transition-all">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                            <Mail className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm font-black text-foreground">Email Notifications</p>
                            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Receive updates via email</p>
                        </div>
                    </div>
                    <button
                        onClick={() => onToggle("email_notifications")}
                        className={`w-12 h-6 rounded-full transition-all relative ${settings.email_notifications ? 'bg-primary' : 'bg-muted'}`}
                    >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.email_notifications ? 'right-1' : 'left-1'}`} />
                    </button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/50 group hover:border-primary/20 transition-all">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                            <Bell className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm font-black text-foreground">In-App Alerts</p>
                            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Real-time dashboard notifications</p>
                        </div>
                    </div>
                    <button
                        onClick={() => onToggle("in_app_notifications")}
                        className={`w-12 h-6 rounded-full transition-all relative ${settings.in_app_notifications ? 'bg-primary' : 'bg-muted'}`}
                    >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.in_app_notifications ? 'right-1' : 'left-1'}`} />
                    </button>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <Button
                    onClick={onSave}
                    disabled={isPending}
                    className="rounded-2xl px-8 py-6 h-auto font-black italic uppercase tracking-widest text-[10px] premium-gradient hover:opacity-90 transition-all shadow-lg hover:shadow-indigo-500/20"
                >
                    {isPending ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Updating...
                        </>
                    ) : (
                        <>
                            <Check className="w-4 h-4 mr-2" />
                            Save Preferences
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
