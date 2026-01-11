import { Navbar } from "@/components/layout/Navbar";
import Image from "next/image";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/sections/PageHeader";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PillarsSection } from "@/components/sections/PillarsSection"; // Import updated PillarsSection
import { Card } from "@/components/ui/Card"; // Assuming Card component exists
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'About | Anushtan Indic School',
    description: 'Governance of the Soul, Mind, and Future. The Anushtan Mandate and Leadership Architecture.',
};

import { Search, Triangle, Flower } from "lucide-react";

export default function About() {
    return (
        <>
            <Navbar />

            {/* 1. Header: The Architect's Vision */}
            <header className="bg-anushtan-parchment text-anushtan-charcoal py-24 text-center">
                <div className="container-custom">
                    <h1 className="font-heading text-4xl md:text-6xl font-bold mb-6 text-anushtan-terracotta">
                        The Architect's Vision
                    </h1>
                    <p className="text-xl md:text-2xl font-light text-anushtan-charcoal/80 max-w-3xl mx-auto tracking-wide">
                        Governance of the Soul, Mind, and Future.
                    </p>
                </div>
            </header>

            {/* 2. Governance and Leadership Architecture */}
            <section className="py-24 bg-white relative overflow-hidden">
                <div className="container-custom">
                    <div className="text-center mb-16">
                        <span className="text-anushtan-terracotta font-bold uppercase tracking-widest text-sm block mb-2">Global Oversight</span>
                        <h2 className="font-heading text-4xl md:text-5xl font-bold text-anushtan-charcoal mb-6">
                            Global Oversight Map
                        </h2>
                        <div className="h-1 w-24 bg-anushtan-gold mx-auto mb-8"></div>
                    </div>

                    <div className="max-w-4xl mx-auto bg-anushtan-parchment/30 border border-anushtan-border p-10 rounded-2xl relative shadow-lg">
                        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none"
                            style={{ backgroundImage: 'radial-gradient(#6B3126 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
                        </div>
                        <p className="text-xl md:text-2xl text-anushtan-charcoal font-heading leading-relaxed text-center font-medium">
                            "Led by a <span className="text-anushtan-terracotta font-bold">Global System Architect</span>, Anushtan applies the principles of enterprise-level precision to education."
                        </p>
                        <p className="text-base text-gray-600 text-center mt-6 max-w-2xl mx-auto">
                            Our leadership structure mirrors high-performance organizational governance, ensuring that every educational process is monitored, measured, and optimized for world-class outcomes.
                        </p>
                    </div>
                </div>
            </section>

            {/* 3. The 7 Pillars (Protocols) - Transitioned from Home Page */}
            <PillarsSection />

            {/* 4. Continuous Quality Audits */}
            <section className="py-24 bg-anushtan-parchment text-anushtan-charcoal relative">
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
                        <div className="relative h-80 lg:h-full min-h-[400px] border border-anushtan-border rounded-xl overflow-hidden bg-white shadow-sm p-8 flex flex-col justify-center items-center text-center">
                            <div className="w-20 h-20 bg-anushtan-gold/10 rounded-full flex items-center justify-center text-4xl text-anushtan-gold mb-6 border border-anushtan-gold/30">
                                <Search className="w-10 h-10 text-anushtan-gold" />
                            </div>
                            <h3 className="text-2xl font-bold text-anushtan-terracotta mb-2">Continuous Monitoring</h3>
                            <p className="text-sm text-anushtan-charcoal/60">Real-time curriculum adjustments based on global standards.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. Meaning of the Logo (Preserved) */}
            <section className="py-24 bg-anushtan-parchment">
                <div className="container-custom max-w-4xl mx-auto">
                    <SectionHeader title="Our Identity: The Meaning of the Logo" />

                    <div className="flex flex-col md:flex-row gap-12 items-center mb-12">
                        <div className="w-full md:w-1/3 flex justify-center">
                            <div className="w-48 h-48 border-2 border-anushtan-gold rounded-full flex items-center justify-center bg-white shadow-lg overflow-hidden relative">
                                <Image
                                    src="/logo.jpg"
                                    alt="Anushtan Indic School Logo"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                        <div className="w-full md:w-2/3">
                            <p className="text-lg text-anushtan-charcoal/80 leading-relaxed italic">
                                "Our logo is not just a design; it is a visual representation of our educational philosophy."
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white p-6 rounded-lg border border-anushtan-border shadow-sm">
                            <h3 className="font-heading text-xl font-bold mb-4 text-anushtan-terracotta flex items-center gap-2">
                                <span className="text-anushtan-gold"><Triangle className="w-6 h-6 fill-current" /></span> The Equilateral Triangle
                            </h3>
                            <div className="text-anushtan-charcoal/80 space-y-3">
                                <p>
                                    The triangle represents <strong>Balance, Interconnectedness, and Growth</strong>. Each side carries a profound meaning, representing the core pillars of our philosophy:
                                </p>
                                <ul className="list-disc list-inside pl-2 space-y-1">
                                    <li><strong>Academic Excellence</strong></li>
                                    <li><strong>Holistic Development</strong></li>
                                    <li><strong>Cultural Rootedness</strong></li>
                                </ul>
                                <p className="text-sm mt-4 pt-4 border-t border-dashed border-gray-200">
                                    It also symbolizes the harmony between the <strong>Teacher, Student, and Parent</strong>, and the alignment of <strong>Body, Mind, and Intellect</strong>.
                                </p>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg border border-anushtan-border shadow-sm">
                            <h3 className="font-heading text-xl font-bold mb-4 text-anushtan-terracotta flex items-center gap-2">
                                <span className="text-anushtan-gold"><Flower className="w-6 h-6" /></span> The Lotus (Kamalam)
                            </h3>
                            <div className="text-anushtan-charcoal/80 space-y-3">
                                <p>
                                    The Lotus blooms in mud but remains unstained. It symbolizes <strong>Purity and Clarity</strong> amidst the complexities of the world.
                                </p>
                                <p>
                                    The five petals represent the <em>Panchakoshas</em> (Five Layers of Existence) that we aim to blossom in every child:
                                </p>
                                <ul className="list-disc list-inside pl-2 space-y-1 text-sm font-medium text-anushtan-maroon/80">
                                    <li>Annamaya (Physical)</li>
                                    <li>Pranamaya (Vital)</li>
                                    <li>Manomaya (Mental)</li>
                                    <li>Vijnanamaya (Intellectual)</li>
                                    <li>Anandamaya (Bliss)</li>
                                </ul>
                                <div className="mt-4 pt-4 border-t border-dashed border-gray-200 space-y-2">
                                    <p>The Lotus is also a powerful emblem of:</p>
                                    <ul className="list-disc list-inside pl-2 space-y-1 text-sm">
                                        <li><strong>Heart and Emotional Growth:</strong> Cultivating compassion, empathy, and values.</li>
                                        <li><strong>Devotion and Discipline:</strong> Dedication to learning, teaching, and self-mastery.</li>
                                        <li><strong>Divinity and Purity:</strong> Blossoming with knowledge even amidst challenges.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}
