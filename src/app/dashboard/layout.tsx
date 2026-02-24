import { DashboardSidebar } from "@/components/sidebar/dashboard-sidebar";
import { createClient } from "@/lib/db/server";
import { getUserProfile } from "@/actions/user";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const profile = await getUserProfile();

    return (
        <div className="flex h-screen bg-background text-foreground selection:bg-indigo-500/30 overflow-hidden relative">
            {/* Shared Background Elements */}
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none z-[60]" />
            <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] rounded-full -z-10 pointer-events-none" />

            <DashboardSidebar user={user} profile={profile} />

            <main className="flex-1 relative z-10 w-full overflow-y-auto custom-scrollbar">
                {children}
            </main>
        </div>
    );
}
