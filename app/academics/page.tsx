import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/sections/PageHeader";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import type { Metadata } from 'next';
import { BookOpen, Layers } from "lucide-react";

export const metadata: Metadata = {
    title: 'Academics | Anushtan Indic School',
    description: 'Curriculum framework, learning domains, grade progression, and assessment approach.',
};

export default function Academics() {
    return (
        <div className="min-h-screen bg-[#F7F2EA]">
            <Navbar />
            <PageHeader
                title="Academics"
                subtitle="Curriculum framework, learning domains, grade progression, and assessment approach."
                className="bg-[linear-gradient(180deg,#F1E6D4_0%,#F7F2EA_100%)]"
            />

            <div className="container-custom py-20">
                <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {/* Academic Orientation */}
                    <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-t-4 border-anushtan-maroon p-8 h-full">
                        <div className="flex items-start justify-between mb-6">
                            <h2 className="font-heading text-3xl font-bold text-anushtan-maroon">
                                Academic Orientation
                            </h2>
                            <BookOpen className="w-8 h-8 text-anushtan-saffron/80" />
                        </div>
                        <div className="text-lg text-[#2B2B2B] leading-relaxed space-y-6">
                            <p>
                                The academic program at Anushtan is designed to build strong conceptual foundations, disciplined learning habits, and intellectual clarity appropriate to each stage of development.
                            </p>
                            <p>
                                Learning is treated as a continuous and cumulative process rather than a series of disconnected units, with emphasis on understanding, coherence, and thoughtful engagement.
                            </p>
                        </div>
                    </div>

                    {/* Structure of Learning */}
                    <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-t-4 border-anushtan-maroon p-8 h-full">
                        <div className="flex items-start justify-between mb-6">
                            <h2 className="font-heading text-3xl font-bold text-anushtan-maroon">
                                Structure of Learning
                            </h2>
                            <Layers className="w-8 h-8 text-anushtan-saffron/80" />
                        </div>
                        <div className="text-lg text-[#2B2B2B] leading-relaxed space-y-6">
                            <p>
                                Academic learning is structured across clearly defined stages of childhood and adolescence, with each stage emphasizing different developmental needs — cognitive, emotional, physical, and social.
                            </p>
                            <p>
                                The structure ensures that complexity is introduced progressively and that students are not prematurely overloaded or fragmented in their learning experience.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
