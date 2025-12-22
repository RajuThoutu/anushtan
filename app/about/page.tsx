import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function AboutPage() {
    return (
        <>
            <Navbar />
            <Hero
                title="About Anushtan"
                subtitle="Our journey, our values, and our commitment to holistic education."
                background="bg-primary/5"
            />

            <section className="py-24 bg-background">
                <div className="container-custom">
                    <SectionHeader title="Why Anushtan Exists" />
                    <p className="text-lg text-text/80 max-w-4xl mx-auto text-center mb-12">
                        [Short narrative about the founding of the school, the perceived need for an Indic-centered yet modern educational institution, and the goals of the founders.]
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-20">
                        <div className="bg-surface p-8 rounded-lg border-l-4 border-primary shadow-sm">
                            <h3 className="font-heading text-2xl font-bold mb-4 text-primary">Our Vision</h3>
                            <p className="text-text/70">[Placeholder text for the Vision Statement of Anushtan Indic School.]</p>
                        </div>
                        <div className="bg-surface p-8 rounded-lg border-l-4 border-secondary shadow-sm">
                            <h3 className="font-heading text-2xl font-bold mb-4 text-secondary">Our Mission</h3>
                            <p className="text-text/70">[Placeholder text for the Mission Statement, focusing on actionable goals.]</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24 bg-surface">
                <div className="container-custom">
                    <SectionHeader title="Educational Philosophy" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div className="p-6">
                            <h4 className="font-heading text-xl font-bold mb-2">Wisdom</h4>
                            <p className="text-text/60">[Placeholder regarding Wisdom]</p>
                        </div>
                        <div className="p-6">
                            <h4 className="font-heading text-xl font-bold mb-2">Service</h4>
                            <p className="text-text/60">[Placeholder regarding Service]</p>
                        </div>
                        <div className="p-6">
                            <h4 className="font-heading text-xl font-bold mb-2">Excellence</h4>
                            <p className="text-text/60">[Placeholder regarding Excellence]</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 bg-secondary text-white text-center">
                <div className="container-custom">
                    <blockquote className="font-heading text-2xl italic leading-relaxed max-w-3xl mx-auto">
                        "Arise, awake, and stop not till the goal is reached."
                    </blockquote>
                    <cite className="block mt-4 text-amber-200 not-italic">— Swami Vivekananda</cite>
                </div>
            </section>

            <Footer />
        </>
    );
}
