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
                title="About Anushtan"
                subtitle="A vision for education grounded in Indian wisdom and modern requirements."
                background="bg-anushtan-maroon"
            />

            {/* Why Anushtan Exists */}
            <section className="py-20 bg-anushtan-ivory">
                <div className="container-custom max-w-4xl mx-auto">
                    <SectionHeader title="Institutional Vision" />
                    <p className="text-lg text-anushtan-charcoal/80 leading-relaxed mb-8">
                        Anushtan exists to provide an education that respects the cultural context of the student while ensuring high academic standards. It aims to create an environment where learning is natural, rigorous, and balanced.
                    </p>
                </div>
            </section>

            {/* Vision of the Student */}
            <section className="py-20 bg-white">
                <div className="container-custom max-w-4xl mx-auto">
                    <SectionHeader title="The Student Profile" />
                    <ul className="space-y-4">
                        <li className="flex items-start gap-3">
                            <span className="text-anushtan-saffron mt-1">▪</span>
                            <span className="text-anushtan-charcoal/80">Physically vital and capable of sustained effort.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-anushtan-saffron mt-1">▪</span>
                            <span className="text-anushtan-charcoal/80">Intellectually curious and rigorous in study.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-anushtan-saffron mt-1">▪</span>
                            <span className="text-anushtan-charcoal/80">Culturally rooted and comfortable in their identity.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-anushtan-saffron mt-1">▪</span>
                            <span className="text-anushtan-charcoal/80">Socially responsible and oriented towards service.</span>
                        </li>
                    </ul>
                </div>
            </section>

            {/* Philosophy */}
            <section className="py-20 bg-anushtan-ivory">
                <div className="container-custom max-w-4xl mx-auto">
                    <SectionHeader title="Educational Philosophy" />
                    <p className="text-lg text-anushtan-charcoal/80 leading-relaxed mb-6">
                        The educational approach prioritizes the development of the whole person—body, mind, and spirit—through a structured daily routine (`Dinacharya`) and dedicated practice (`Abhyasa`).
                    </p>
                    <div className="h-64 bg-white border border-anushtan-border rounded flex items-center justify-center text-anushtan-charcoal/30 font-medium">
                        {"{{IMAGE:RAMAKRISHNA_SARADA}}"}
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}
