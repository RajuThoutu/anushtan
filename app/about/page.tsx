import { Navbar } from "@/components/layout/Navbar";
import Image from "next/image";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/sections/PageHeader";
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
            <PageHeader
                title="About Anushtan Indic School"
                subtitle="Integrating academic learning with cultural grounding and holistic development."
            />

            {/* About Anushtan (Intro) */}
            <section className="py-20 bg-transparent">
                <div className="container-custom max-w-4xl mx-auto">
                    <SectionHeader title="Overview" />
                    <div className="text-lg text-[#2B2B2B] leading-relaxed space-y-6 bg-[rgba(196,106,26,0.08)] border-l-4 border-anushtan-saffron p-6">
                        <p>
                            Anushtan Indic School is an educational institution designed to integrate academic learning with cultural grounding and holistic development.
                        </p>
                        <p>
                            The school is structured around a coherent educational vision that views education not merely as skill acquisition, but as a process of nurturing intellectual clarity, ethical maturity, emotional stability, and cultural continuity.
                        </p>
                    </div>
                </div>
            </section>

            {/* The Purpose of Anushtan */}
            <section className="py-20 bg-transparent">
                <div className="container-custom max-w-4xl mx-auto">
                    <SectionHeader title="The Purpose of Anushtan" />
                    <div className="text-lg text-[#2B2B2B] leading-relaxed space-y-6 bg-[rgba(196,106,26,0.08)] border-l-4 border-anushtan-saffron p-6">
                        <p>
                            The purpose of Anushtan is to create an educational environment where learning is meaningful, disciplined, and rooted in context.
                        </p>
                        <p>
                            Education here is understood as a formative process — shaping how students think, how they relate to others, how they understand responsibility, and how they locate themselves within society and tradition.
                        </p>
                    </div>
                </div>
            </section>

            {/* Meaning of the Logo */}
            <section className="py-20 bg-anushtan-ivory/30">
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
                            <h3 className="font-heading text-xl font-bold mb-4 text-anushtan-maroon flex items-center gap-2">
                                <span className="text-anushtan-saffron text-2xl">△</span> The Equilateral Triangle
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
                            <h3 className="font-heading text-xl font-bold mb-4 text-anushtan-maroon flex items-center gap-2">
                                <span className="text-anushtan-saffron text-2xl">✿</span> The Lotus (Kamalam)
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
