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
        <>
            <Navbar />
            <PageHeader
                title="Academics"
                subtitle="Curriculum framework, learning domains, grade progression, and assessment approach."
            />

            {/* Academic Orientation */}
            <section className="py-20 bg-transparent">
                <div className="container-custom max-w-4xl mx-auto">
                    <SectionHeader title="Academic Orientation" />
                    <div className="text-lg text-anushtan-charcoal/80 leading-relaxed space-y-6">
                        <p>
                            The academic program at Anushtan is designed to build strong conceptual foundations, disciplined learning habits, and intellectual clarity appropriate to each stage of development.
                        </p>
                        <p>
                            Learning is treated as a continuous and cumulative process rather than a series of disconnected units, with emphasis on understanding, coherence, and thoughtful engagement.
                        </p>
                    </div>
                </div>
            </section>

            {/* Structure of Learning */}
            <section className="py-20 bg-transparent">
                <div className="container-custom max-w-4xl mx-auto">
                    <SectionHeader title="Structure of Learning" />
                    <div className="text-lg text-anushtan-charcoal/80 leading-relaxed space-y-6">
                        <p>
                            Academic learning is structured across clearly defined stages of childhood and adolescence, with each stage emphasizing different developmental needs — cognitive, emotional, physical, and social.
                        </p>
                        <p>
                            The structure ensures that complexity is introduced progressively and that students are not prematurely overloaded or fragmented in their learning experience.
                        </p>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}
