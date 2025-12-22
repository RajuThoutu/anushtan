import { Hero } from "@/components/sections/Hero";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Admissions | Anushtan Indic School',
    description: 'Admission process, eligibility, and fee structure details.',
};

export default function Admissions() {
    return (
        <>
            <Navbar />
            <Hero
                title="Admissions"
                subtitle="Admissions details will be listed here. Families may schedule a campus visit for orientation."
                background="bg-anushtan-maroon"
            />

            {/* Admission Process */}
            <section id="process" className="py-20 bg-anushtan-ivory">
                <div className="container-custom max-w-4xl mx-auto">
                    <SectionHeader title="Admission Process" />
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-anushtan-border">
                            <span className="font-heading font-bold text-2xl text-anushtan-maroon w-8">1</span>
                            <span className="text-lg text-anushtan-charcoal/80">Submit inquiry</span>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-anushtan-border">
                            <span className="font-heading font-bold text-2xl text-anushtan-maroon w-8">2</span>
                            <span className="text-lg text-anushtan-charcoal/80">Campus visit</span>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-anushtan-border">
                            <span className="font-heading font-bold text-2xl text-anushtan-maroon w-8">3</span>
                            <span className="text-lg text-anushtan-charcoal/80">Interaction/assessment (as applicable)</span>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-anushtan-border">
                            <span className="font-heading font-bold text-2xl text-anushtan-maroon w-8">4</span>
                            <span className="text-lg text-anushtan-charcoal/80">Confirmation and enrollment</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Eligibility */}
            <section id="eligibility" className="py-20 bg-white">
                <div className="container-custom max-w-4xl mx-auto">
                    <SectionHeader title="Eligibility" />
                    <p className="text-lg text-anushtan-charcoal/80 leading-relaxed mb-8">
                        Eligibility criteria will be listed here.
                    </p>
                </div>
            </section>

            {/* Fee Structure */}
            <section id="fees" className="py-20 bg-anushtan-ivory">
                <div className="container-custom max-w-4xl mx-auto">
                    <SectionHeader title="Fee Structure" />
                    <p className="text-lg text-anushtan-charcoal/80 leading-relaxed mb-8">
                        Fee structure will be listed here.
                    </p>
                </div>
            </section>

            {/* FAQs */}
            <section id="faqs" className="py-20 bg-white">
                <div className="container-custom max-w-4xl mx-auto">
                    <SectionHeader title="FAQs" />
                    <div className="space-y-6">
                        <div className="p-6 bg-anushtan-ivory rounded-lg border border-anushtan-border">
                            <h4 className="font-bold text-lg mb-2 text-anushtan-maroon">What is the educational approach?</h4>
                            <p className="text-anushtan-charcoal/70">Answer placeholder.</p>
                        </div>
                        <div className="p-6 bg-anushtan-ivory rounded-lg border border-anushtan-border">
                            <h4 className="font-bold text-lg mb-2 text-anushtan-maroon">How is assessment handled?</h4>
                            <p className="text-anushtan-charcoal/70">Answer placeholder.</p>
                        </div>
                        <div className="p-6 bg-anushtan-ivory rounded-lg border border-anushtan-border">
                            <h4 className="font-bold text-lg mb-2 text-anushtan-maroon">How do I schedule a visit?</h4>
                            <p className="text-anushtan-charcoal/70">Answer placeholder.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-anushtan-maroon text-white text-center">
                <div className="container-custom">
                    <h2 className="font-heading text-3xl font-bold mb-6">Admissions Inquiry</h2>
                    <p className="text-white/80 max-w-xl mx-auto mb-8">
                        Admissions information and campus visit scheduling.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Button href="/contact" className="bg-anushtan-saffron text-white hover:bg-anushtan-saffron/90 border-0">
                            {"{{CTA:VISIT_CAMPUS}}"}
                        </Button>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}
