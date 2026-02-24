import { getUserProfile } from "@/actions/user";
import { ProfileForm } from "@/components/profile/profile-form";

export default async function ProfilePage() {
    const profile = await getUserProfile();

    return (
        <div className="p-12 lg:p-20 relative max-w-[1600px] mx-auto">
            <div className="mb-20 slide-fade-in">
                <div className="inline-flex items-center gap-2 px-3 py-1 glass-panel rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-6">
                    Workspace
                </div>
                <h1 className="text-5xl lg:text-7xl font-black tracking-tight mb-4 text-foreground">
                    User <span className="italic text-gradient">Profile</span>
                </h1>
                <p className="text-xl text-muted-foreground font-medium">Customize your professional identity and strategic workspace.</p>
            </div>

            <div className="max-w-4xl glass-panel rounded-[2.5rem] p-12 slide-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="flex flex-col gap-12 items-center">
                    <div className="flex-1 w-full">
                        <ProfileForm initialData={{
                            full_name: profile?.full_name || "",
                            role: profile?.role || "",
                            avatar_url: profile?.avatar_url || ""
                        }} />

                        <div className="pt-6 mt-8">
                            <p className="text-xs text-muted-foreground font-medium max-w-lg leading-relaxed">
                                You are currently on the <span className="text-primary font-black uppercase">Free Plan</span>. Upgrade to unlock the full power of the strategic AI engine and unlimited exports.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
