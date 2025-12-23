import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/sections/PageHeader";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import type { Metadata } from 'next';

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

            {/* Academic Orientation */}
            <section className="py-20 bg-[#FBF6EF] border-b border-[#8A3A32]/20">
                <div className="container-custom max-w-4xl mx-auto">
                    <SectionHeader title="Academic Orientation" className="mb-12" />
                    <div className="bg-white shadow-[0_6px_18px_rgba(0,0,0,0.04)] sm:p-10 p-6 rounded-xl border border-[#8A3A32]/10">
                        <div className="text-lg text-[#2B2B2B] leading-relaxed space-y-6">
                            <p>
                                The academic program at Anushtan is designed to build strong conceptual foundations, disciplined learning habits, and intellectual clarity appropriate to each stage of development.
                            </p>
                            <p>
                                Learning is treated as a continuous and cumulative process rather than a series of disconnected units, with emphasis on understanding, coherence, and thoughtful engagement.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Structure of Learning */}
            <section className="py-20 bg-[#F1E6D4] border-b border-[#8A3A32]/20">
                <div className="container-custom max-w-4xl mx-auto">
                    <SectionHeader title="Structure of Learning" className="mb-12" />
                    <div className="bg-white shadow-[0_6px_18px_rgba(0,0,0,0.04)] sm:p-10 p-6 rounded-xl border border-[#8A3A32]/10">
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
            </section>

            <Footer />
        </div>
    );
}
