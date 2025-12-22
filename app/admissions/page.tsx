import { Hero } from "@/components/sections/Hero";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";

export default function Admissions() {
    return (
        <>
            <Navbar />
            <Hero
                title="Admissions"
                subtitle="Admission process, steps, and visit scheduling."
                background="bg-primary"
            />

            {/* Admission Process */}
            <section id="process" className="py-20 bg-surface">
                <div className="container-custom max-w-4xl mx-auto">
                    <SectionHeader title="Admission Process" />
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 p-4 bg-background rounded-lg border border-primary/10">
                            <span className="font-heading font-bold text-2xl text-primary w-8">1</span>
                            <span className="text-lg text-text/80">Submit inquiry</span>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-background rounded-lg border border-primary/10">
                            <span className="font-heading font-bold text-2xl text-primary w-8">2</span>
                            <span className="text-lg text-text/80">Campus visit</span>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-background rounded-lg border border-primary/10">
                            <span className="font-heading font-bold text-2xl text-primary w-8">3</span>
                            <span className="text-lg text-text/80">Interaction/assessment (as applicable)</span>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-background rounded-lg border border-primary/10">
                            <span className="font-heading font-bold text-2xl text-primary w-8">4</span>
                            <span className="text-lg text-text/80">Confirmation and enrollment</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Eligibility */}
            <section id="eligibility" className="py-20 bg-background">
                <div className="container-custom max-w-4xl mx-auto">
                    <SectionHeader title="Eligibility" />
                    <p className="text-lg text-text/80 leading-relaxed mb-8">
                        Eligibility criteria will be listed here.
                    </p>
                </div>
            </section>

            {/* Fee Structure */}
            <section id="fees" className="py-20 bg-surface">
                <div className="container-custom max-w-4xl mx-auto">
                    <SectionHeader title="Fee Structure" />
                    <p className="text-lg text-text/80 leading-relaxed mb-8">
                        Fee structure will be listed here.
                    </p>
                </div>
            </section>

            {/* FAQs */}
            <section id="faqs" className="py-20 bg-background">
                <div className="container-custom max-w-4xl mx-auto">
                    <SectionHeader title="FAQs" />
                    <div className="space-y-6">
                        <div className="p-6 bg-surface rounded-lg shadow-sm">
                            <h4 className="font-bold text-lg mb-2">What is the educational approach?</h4>
                            <p className="text-text/70">Answer placeholder.</p>
                        </div>
                        <div className="p-6 bg-surface rounded-lg shadow-sm">
                            <h4 className="font-bold text-lg mb-2">How is assessment handled?</h4>
                            <p className="text-text/70">Answer placeholder.</p>
                        </div>
                        <div className="p-6 bg-surface rounded-lg shadow-sm">
                            <h4 className="font-bold text-lg mb-2">How do I schedule a visit?</h4>
                            <p className="text-text/70">Answer placeholder.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-secondary text-white text-center">
                <div className="container-custom">
                    <h2 className="font-heading text-3xl font-bold mb-6">Ready to Apply?</h2>
                    <div className="flex justify-center gap-4">
                        <Button href="/contact" className="bg-white text-secondary hover:bg-white/90">Contact Us</Button>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}
