import { Navbar } from "@/components/layout/Navbar";
import Image from "next/image";
import { Footer } from "@/components/layout/Footer";
import { PillarsSection } from "@/components/sections/PillarsSection";
import type { Metadata } from 'next';
import { Search, Triangle, Flower } from "lucide-react";

export const metadata: Metadata = {
    title: 'About | Anushtan Indic School',
    description: 'Our Identity, Protocols, and Governance.',
};

export default function About() {
    return (
        <>
            <Navbar />

            {/* 1. New Header: Our Identity (Logo & Meaning) */}
            <section className="py-24 bg-anushtan-parchment">
                <div className="container-custom max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row gap-16 items-center">
                        {/* Left Column: Logo */}
                        <div className="w-full md:w-1/3 flex justify-center">
                            <div className="w-64 h-64 border-4 border-anushtan-gold/20 rounded-full flex items-center justify-center bg-white shadow-2xl overflow-hidden relative p-4">
                                <div className="relative w-full h-full">
                                    <Image
                                        src="/logo.jpg"
                                        alt="Anushtan Indic School Logo"
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Meaning & Philosophy */}
                        <div className="w-full md:w-2/3 text-left">
                            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6 text-anushtan-terracotta">
                                Our Identity
                            </h1>
                            <p className="text-xl text-anushtan-charcoal/80 leading-relaxed italic mb-8 border-l-4 border-anushtan-gold pl-6">
                                "Our logo is not just a design; it is a visual representation of our educational philosophy."
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h3 className="font-heading text-xl font-bold text-anushtan-terracotta flex items-center gap-2">
                                        <Triangle className="w-5 h-5 text-anushtan-gold fill-current" /> The Equilateral Triangle
                                    </h3>
                                    <p className="text-anushtan-charcoal/80 text-sm leading-relaxed">
                                        Represents <strong>Balance, Interconnectedness, and Growth</strong>. It symbolizes the harmony between Teacher, Student, and Parent, and the alignment of Body, Mind, and Intellect.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="font-heading text-xl font-bold text-anushtan-terracotta flex items-center gap-2">
                                        <Flower className="w-5 h-5 text-anushtan-gold" /> The Lotus (Kamalam)
                                    </h3>
                                    <p className="text-anushtan-charcoal/80 text-sm leading-relaxed">
                                        Symbolizing <strong>Purity and Clarity</strong>. The petals represent the <em>Panchakoshas</em> (Five Layers of Existence) we aim to blossom in every child: Physical, Vital, Mental, Intellectual, and Bliss.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. The 7 Foundational Protocols */}
            <PillarsSection />

            {/* 3. Continuous Quality Audits */}
            <section className="py-24 bg-anushtan-parchment text-anushtan-charcoal relative border-t border-anushtan-border">
                <div className="container-custom">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <span className="text-anushtan-terracotta font-bold uppercase tracking-widest text-sm block mb-2">Quality Assurance</span>
                            <h2 className="font-heading text-4xl font-bold mb-6 text-anushtan-charcoal">Continuous Quality Audits</h2>
                            <div className="space-y-6 text-lg text-anushtan-charcoal/80 leading-relaxed font-light">
                                <p>
                                    At Anushtan, we do not rely on standard metrics alone. Our curriculum is built on <strong>"Descriptive Logic,"</strong> a rigorous framework monitored daily to ensure deeper conceptual understanding rather than rote memorization.
                                </p>
                                <p>
                                    We actively monitor <strong>AI-driven educational shifts</strong>. Our Academic Audit team reviews and adapts our methodologies to ensure our students stay ahead of technological disruptions, retaining their edge in a world where AI will replace routine cognition.
                                </p>
                            </div>
                        </div>
                        <div className="relative h-80 lg:h-full min-h-[400px] border border-anushtan-border rounded-xl overflow-hidden bg-anushtan-parchment shadow-sm p-8 flex flex-col justify-center items-center text-center">
                            <div className="w-20 h-20 bg-anushtan-gold/10 rounded-full flex items-center justify-center text-4xl text-anushtan-gold mb-6 border border-anushtan-gold/30">
                                <Search className="w-10 h-10 text-anushtan-gold" />
                            </div>
                            <h3 className="text-2xl font-bold text-anushtan-terracotta mb-2">Continuous Monitoring</h3>
                            <p className="text-sm text-anushtan-charcoal/60">Real-time curriculum adjustments based on global standards.</p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}
