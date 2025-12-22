import { Hero } from "@/components/sections/Hero";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export default function About() {
    return (
        <>
            <Navbar />
            <Hero
                title="About Anushtan"
                subtitle="The purpose, vision, and educational philosophy of Anushtan Indic School."
                background="bg-secondary"
            />

            {/* Why Anushtan Exists */}
            <section className="py-20 bg-surface">
                <div className="container-custom max-w-4xl mx-auto">
                    <SectionHeader title="Why Anushtan Exists" />
                    <p className="text-lg text-text/80 leading-relaxed mb-8">
                        Anushtan was conceived to restore balance to education—ensuring strong academics without sacrificing well-being, cultural grounding, and disciplined growth.
                    </p>
                </div>
            </section>

            {/* Vision of the Anushtan Student */}
            <section className="py-20 bg-background">
                <div className="container-custom max-w-4xl mx-auto">
                    <SectionHeader title="Vision of the Anushtan Student" />
                    <ul className="space-y-4 text-lg text-text/80">
                        <li className="flex items-start gap-3">
                            <span className="mt-2 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                            <span>A happy and emotionally balanced individual</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="mt-2 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                            <span>Globally competent and intellectually confident</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="mt-2 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                            <span>Culturally rooted with Indian values and patriotic consciousness</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="mt-2 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                            <span>Holistic development across academics, sports, culture, and inner growth</span>
                        </li>
                    </ul>
                </div>
            </section>

            {/* Educational Philosophy */}
            <section className="py-20 bg-surface">
                <div className="container-custom max-w-4xl mx-auto">
                    <SectionHeader title="Educational Philosophy" />
                    <p className="text-lg text-text/80 leading-relaxed">
                        Education is the unfolding of inherent potential through age-appropriate learning, conceptual clarity, physical vitality, cultural identity, and inner discipline.
                    </p>
                </div>
            </section>

            <Footer />
        </>
    );
}
