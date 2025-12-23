import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'About | Anushtan Indic School',
    description: 'An overview of the vision, mission, and student profile at Anushtan Indic School.',
};

export default function About() {
    return (
        <>
            <Navbar />
            <Hero
                title="About Anushtan Indic School"
                subtitle="Integrating academic learning with cultural grounding and holistic development."
                background="bg-anushtan-maroon"
            />

            {/* About Anushtan (Intro) */}
            <section className="py-20 bg-transparent">
                <div className="container-custom max-w-4xl mx-auto">
                    <SectionHeader title="Overview" />
                    <div className="text-lg text-anushtan-charcoal/80 leading-relaxed space-y-6">
                        <p>
                            Anushtan Indic School is an educational institution designed to integrate academic learning with cultural grounding and holistic development.
                        </p>
                        <p>
                            The school is structured around a coherent educational vision that views education not merely as skill acquisition, but as a process of nurturing intellectual clarity, ethical maturity, emotional stability, and cultural continuity.
                        </p>
                    </div>
                </div>
            </section>

            {/* The Purpose of Anushtan */}
            <section className="py-20 bg-transparent">
                <div className="container-custom max-w-4xl mx-auto">
                    <SectionHeader title="The Purpose of Anushtan" />
                    <div className="text-lg text-anushtan-charcoal/80 leading-relaxed space-y-6">
                        <p>
                            The purpose of Anushtan is to create an educational environment where learning is meaningful, disciplined, and rooted in context.
                        </p>
                        <p>
                            Education here is understood as a formative process — shaping how students think, how they relate to others, how they understand responsibility, and how they locate themselves within society and tradition.
                        </p>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}
