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
            <section className="py-24 bg-anushtan-parchment overflow-hidden">
                <div className="container-custom max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="font-heading text-4xl md:text-5xl font-bold text-anushtan-terracotta mb-8">
                            Our Identity
                        </h1>
                        <div className="w-full bg-white/50 border-y border-anushtan-gold/20 py-8 px-4 mb-16 backdrop-blur-sm">
                            <p className="text-2xl md:text-3xl text-anushtan-charcoal font-heading leading-relaxed italic max-w-4xl mx-auto text-center">
                                "Our logo is not just a design; it is a visual representation of our educational philosophy."
                            </p>
                        </div>
                    </div>

                    {/* Symmetrical Exploded View */}
                    <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-0 relative">

                        {/* Left Wing: Triangle */}
                        <div className="w-full lg:w-1/3 text-center lg:text-right lg:pr-12 relative">
                            {/* Connector Line (Desktop) */}
                            <div className="hidden lg:block absolute top-1/2 right-0 w-12 h-[1px] bg-anushtan-gold/30"></div>

                            <h3 className="font-heading text-2xl font-bold text-anushtan-terracotta mb-4 flex items-center justify-center lg:justify-end gap-2">
                                The Equilateral Triangle <Triangle className="w-6 h-6 text-anushtan-gold fill-current" />
                            </h3>
                            <div className="text-anushtan-charcoal/80 space-y-4 text-sm leading-relaxed">
                                <p>
                                    The triangle represents <strong>Balance, Interconnectedness, and Growth</strong>. Each side carries a profound meaning, representing the core pillars of our philosophy:
                                </p>
                                <ul className="space-y-1 text-anushtan-terracotta font-medium">
                                    <li>Academic Excellence</li>
                                    <li>Holistic Development</li>
                                    <li>Cultural Rootedness</li>
                                </ul>
                                <p className="text-xs uppercase tracking-widest text-anushtan-charcoal/50 pt-2 border-t border-anushtan-border inline-block">
                                    It also symbolizes the harmony between the Teacher, Student, and Parent, and the alignment of Body, Mind, and Intellect.
                                </p>
                            </div>
                        </div>

                        {/* Center: Hero Logo */}
                        <div className="w-full lg:w-1/3 flex justify-center relative z-10 my-8 lg:my-0">
                            <div className="w-80 h-80 relative">
                                {/* Glow Effect */}
                                <div className="absolute inset-0 bg-anushtan-gold/5 rounded-full blur-3xl scale-110"></div>
                                <div className="w-full h-full border-[1px] border-anushtan-gold/20 rounded-full flex items-center justify-center bg-white shadow-2xl relative p-6">
                                    <div className="absolute inset-4 border border-anushtan-gold/10 rounded-full border-dashed animate-spin-slow"></div>
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
                        </div>

                        {/* Right Wing: Lotus */}
                        <div className="w-full lg:w-1/3 text-center lg:text-left lg:pl-12 relative">
                            {/* Connector Line (Desktop) */}
                            <div className="hidden lg:block absolute top-1/2 left-0 w-12 h-[1px] bg-anushtan-gold/30"></div>

                            <h3 className="font-heading text-2xl font-bold text-anushtan-terracotta mb-4 flex items-center justify-center lg:justify-start gap-2">
                                <Flower className="w-6 h-6 text-anushtan-gold" /> The Lotus (Kamalam)
                            </h3>
                            <div className="text-anushtan-charcoal/80 space-y-4 text-sm leading-relaxed">
                                <p>
                                    The Lotus blooms in mud but remains unstained. It symbolizes <strong>Purity and Clarity</strong> amidst the complexities of the world.
                                </p>
                                <ul className="space-y-1 text-anushtan-terracotta font-medium">
                                    <li>Annamaya (Physical)</li>
                                    <li>Pranamaya (Vital)</li>
                                    <li>Manomaya (Mental)</li>
                                    <li>Vijnanamaya (Intellectual)</li>
                                    <li>Anandamaya (Bliss)</li>
                                </ul>
                                <p className="text-xs uppercase tracking-widest text-anushtan-charcoal/50 pt-2 border-t border-anushtan-border inline-block">
                                    The Lotus is also a powerful emblem of Heart, Devotion, and Divinity.
                                </p>
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
