import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";

export default function AdmissionsPage() {
    return (
        <>
            <Navbar />
            <Hero
                title="Admissions"
                subtitle="We welcome families who share our vision of holistic, rooted, and modern education."
                background="bg-primary/5"
            />

            <section className="py-24 bg-background">
                <div className="container-custom">
                    <SectionHeader title="The Process" />
                    <div className="max-w-4xl mx-auto">
                        <div className="relative border-l-2 border-primary/20 space-y-12 pl-8">
                            {/* Step 1 */}
                            <div className="relative">
                                <span className="absolute -left-[41px] bg-primary h-6 w-6 rounded-full border-4 border-background" />
                                <h3 className="font-heading text-xl font-bold text-primary mb-2">Step 1: Inquiry & Campus Visit</h3>
                                <p className="text-text/70">Submit an online inquiry form and schedule a visit to experience our campus.</p>
                            </div>
                            {/* Step 2 */}
                            <div className="relative">
                                <span className="absolute -left-[41px] bg-primary h-6 w-6 rounded-full border-4 border-background" />
                                <h3 className="font-heading text-xl font-bold text-primary mb-2">Step 2: Interaction</h3>
                                <p className="text-text/70">A friendly interaction with the child and parents to understand shared values.</p>
                            </div>
                            {/* Step 3 */}
                            <div className="relative">
                                <span className="absolute -left-[41px] bg-primary h-6 w-6 rounded-full border-4 border-background" />
                                <h3 className="font-heading text-xl font-bold text-primary mb-2">Step 3: Registration</h3>
                                <p className="text-text/70">Complete the application formalities and fee payment.</p>
                            </div>
                        </div>
                        <div className="mt-12 text-center">
                            <Button>Start Application</Button>
                        </div>
                    </div>
                </div>
            </section>

            <section id="fees" className="py-24 bg-surface">
                <div className="container-custom">
                    <SectionHeader title="Fee Structure" />
                    <div className="max-w-3xl mx-auto border border-text/10 rounded-lg overflow-hidden">
                        <div className="bg-primary/10 p-4 font-bold grid grid-cols-2">
                            <span>Component</span>
                            <span className="text-right">Amount (INR)</span>
                        </div>
                        <div className="p-4 border-b border-text/5 grid grid-cols-2">
                            <span>Admission Fee (One-time)</span>
                            <span className="text-right text-text/60">[PLACEHOLDER]</span>
                        </div>
                        <div className="p-4 border-b border-text/5 grid grid-cols-2">
                            <span>Annual Tuition</span>
                            <span className="text-right text-text/60">[PLACEHOLDER]</span>
                        </div>
                        <div className="p-4 border-b border-text/5 grid grid-cols-2">
                            <span>Transport (Optional)</span>
                            <span className="text-right text-text/60">[PLACEHOLDER]</span>
                        </div>
                        <div className="p-4 grid grid-cols-2 bg-text/5 font-medium">
                            <span>Total</span>
                            <span className="text-right">[TOTAL_PLACEHOLDER]</span>
                        </div>
                    </div>
                    <p className="text-center text-sm text-text/60 mt-4">* Fees are subject to change. Scholarships available for deserving students.</p>
                </div>
            </section>

            <section id="faq" className="py-24 bg-background">
                <div className="container-custom max-w-3xl">
                    <SectionHeader title="Frequently Asked Questions" />
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="border border-text/10 rounded p-4 bg-white">
                                <h4 className="font-bold mb-2">Question Placeholder {i}?</h4>
                                <p className="text-text/70">Placeholder answer text explaining the specific query in detail.</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}
