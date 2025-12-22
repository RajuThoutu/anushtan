import { Hero } from "@/components/sections/Hero";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Teachers & Community | Anushtan Indic School',
    description: 'Role of teachers as Acharyas, parent partnership, and community engagement.',
};

export default function TeachersCommunity() {
    return (
        <>
            <Navbar />
            <Hero
                title="Teachers & Community"
                subtitle="Role of teachers as Acharyas, parent partnership, and community engagement."
                background="bg-anushtan-maroon"
            />

            {/* Role of Teachers & Acharyas */}
            <section id="acharyas" className="py-20 bg-transparent">
                <div className="container-custom max-w-4xl mx-auto">
                    <SectionHeader title="Role of Teachers" />
                    <p className="text-lg text-anushtan-charcoal/80 leading-relaxed max-w-3xl mx-auto mb-12">
                        Teachers at Anushtan serve as mentors (`Acharyas`). They guide students through academic competence, disciplined conduct, and their own lived example.
                    </p>
                </div>
            </section>

            {/* Parent Partnership */}
            <section id="parents" className="py-20 bg-transparent">
                <div className="container-custom max-w-4xl mx-auto">
                    <SectionHeader title="Parent Partnership" />
                    <p className="text-lg text-anushtan-charcoal/80 leading-relaxed mb-8">
                        Parents are viewed as partners in the educational journey. We expect alignment with the school's routines, values, and restrictions on digital consumption to ensure a coherent environment for the child.
                    </p>
                </div>
            </section>

            {/* Community Engagement */}
            <section id="community" className="py-20 bg-transparent">
                <div className="container-custom max-w-4xl mx-auto">
                    <SectionHeader title="Community Engagement" />
                    <p className="text-lg text-anushtan-charcoal/80 leading-relaxed mb-8">
                        Students engage with society through participation, responsibility, and service-oriented exposure. Education is not isolated from the community it serves.
                    </p>
                </div>
            </section>

            <Footer />
        </>
    );
}
