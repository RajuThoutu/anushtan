import { Hero } from "@/components/sections/Hero";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export default function TeachersCommunity() {
    return (
        <>
            <Navbar />
            <Hero
                title="Teachers & Community"
                subtitle="Role of teachers as Acharyas, parent partnership, and community engagement."
                background="bg-primary"
            />

            {/* Role of Teachers & Acharyas */}
            <section id="acharyas" className="py-20 bg-surface">
                <div className="container-custom max-w-4xl mx-auto">
                    <SectionHeader title="Role of Teachers & Acharyas" />
                    <p className="text-lg text-text/80 leading-relaxed max-w-3xl mx-auto mb-12">
                        Teachers guide through academic competence, disciplined conduct, and lived example.
                    </p>
                </div>
            </section>

            {/* Parent Partnership */}
            <section id="parents" className="py-20 bg-background">
                <div className="container-custom max-w-4xl mx-auto">
                    <SectionHeader title="Parent Partnership" />
                    <p className="text-lg text-text/80 leading-relaxed mb-8">
                        Parents are partners in the educational journey, aligned with routines, values, and balanced expectations.
                    </p>
                </div>
            </section>

            {/* Community Engagement */}
            <section id="community" className="py-20 bg-surface">
                <div className="container-custom max-w-4xl mx-auto">
                    <SectionHeader title="Community Engagement" />
                    <p className="text-lg text-text/80 leading-relaxed mb-8">
                        Students engage with society through participation, responsibility, and service-oriented exposure.
                    </p>
                </div>
            </section>

            <Footer />
        </>
    );
}
