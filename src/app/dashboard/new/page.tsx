import { CreateProjectForm } from "@/components/dashboard/create-project-form";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function NewProjectPage() {
    return (
        <div className="p-12 lg:p-20 relative max-w-[1600px] mx-auto min-h-screen">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full -z-10" />

            <div className="max-w-5xl">
                <Link
                    href="/dashboard"
                    className="inline-flex items-center text-gray-400 hover:text-white mb-12 transition-all hover:translate-x-1 duration-300 text-xs font-black uppercase tracking-widest"
                >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                </Link>

                <div className="mb-20 slide-fade-in">
                    <h1 className="text-6xl lg:text-8xl font-black tracking-tighter mb-6 italic text-gradient leading-none">
                        Initialize <span className="text-foreground">Story</span>
                    </h1>
                    <p className="text-xl lg:text-2xl text-muted-foreground font-medium max-w-2xl leading-relaxed">
                        Let's start by defining the basics of your business presentation.
                    </p>
                </div>

                <div className="slide-fade-in" style={{ animationDelay: '0.2s' }}>
                    <CreateProjectForm />
                </div>
            </div>
        </div>
    );
}
