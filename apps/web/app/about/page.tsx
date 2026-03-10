import { Navbar } from "@/components/layout/Navbar";
import Image from "next/image";
import { Footer } from "@/components/layout/Footer";
import type { Metadata } from 'next';
import { Triangle, Flower } from "lucide-react";

export const metadata: Metadata = {
    title: 'About | Anushtan Indic School',
    description: 'Our Identity, Lineage, and Wisdom.',
};

export default function About() {
    return (
        <>
            <Navbar />

            {/* 1. Header: Our Identity (Logo & Meaning) */}
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

            {/* 2. The Foundational Lineage (The Holy Trio) */}
            <section className="py-24 bg-white relative">
                <div className="container-custom max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="text-anushtan-gold font-bold tracking-widest uppercase text-sm mb-2 block">
                            Our Spiritual Roots
                        </span>
                        <h2 className="font-heading text-4xl md:text-5xl font-bold text-anushtan-terracotta mb-6">
                            The Foundational Lineage
                        </h2>
                        <div className="h-1 w-24 bg-anushtan-gold mx-auto mb-8"></div>
                        <p className="text-2xl text-anushtan-charcoal/80 font-heading leading-relaxed italic max-w-4xl mx-auto">
                            "Guided by the Ramakrishna Math vision, we architect a <span className="text-anushtan-terracotta">'Man-Making'</span> educational system dedicated to nation-building."
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                        {/* Ramakrishna */}
                        <div className="text-center group">
                            <div className="w-64 h-80 mx-auto relative overflow-hidden rounded-t-full border-4 border-anushtan-border shadow-lg mb-6 grayscale hover:grayscale-0 transition-all duration-500">
                                <Image src="/images/ramakrishna.jpg" alt="Sri Ramakrishna Paramahamsa" fill className="object-cover object-top" />
                            </div>
                            <h3 className="text-2xl font-bold text-anushtan-terracotta font-heading">Sri Ramakrishna Paramahamsa</h3>
                            <p className="text-anushtan-charcoal/60 text-sm italic mb-4">The Divine Mystic</p>
                            <div className="max-w-md mx-auto bg-anushtan-parchment p-6 rounded-lg border border-anushtan-gold/30">
                                <p className="text-anushtan-charcoal/80 leading-relaxed italic">
                                    "God can be realized through all paths. All religions are true. The important thing is to reach the roof."
                                </p>
                            </div>
                        </div>

                        {/* Sarada Devi */}
                        <div className="text-center group mt-0 md:-mt-12">
                            <div className="w-64 h-80 mx-auto relative overflow-hidden rounded-t-full border-4 border-anushtan-border shadow-lg mb-6 grayscale hover:grayscale-0 transition-all duration-500">
                                <Image src="/images/sarada-devi.jpg" alt="Sri Sarada Devi" fill className="object-cover object-top" />
                            </div>
                            <h3 className="text-2xl font-bold text-anushtan-terracotta font-heading">Sri Sarada Devi</h3>
                            <p className="text-anushtan-charcoal/60 text-sm italic mb-4">The Holy Mother</p>
                            <div className="max-w-md mx-auto bg-anushtan-parchment p-6 rounded-lg border border-anushtan-gold/30">
                                <p className="text-anushtan-charcoal/80 leading-relaxed italic">
                                    "If you want peace of mind, do not find fault with others. Learn to make the whole world your own."
                                </p>
                            </div>
                        </div>

                        {/* Vivekananda */}
                        <div className="text-center group">
                            <div className="w-64 h-80 mx-auto relative overflow-hidden rounded-t-full border-4 border-anushtan-border shadow-lg mb-6 grayscale hover:grayscale-0 transition-all duration-500">
                                <Image src="/hero-swami-standing.jpg" alt="Swami Vivekananda" fill className="object-cover object-top" />
                            </div>
                            <h3 className="text-2xl font-bold text-anushtan-terracotta font-heading">Swami Vivekananda</h3>
                            <p className="text-anushtan-charcoal/60 text-sm italic mb-4">The Awakener of Souls</p>
                            <div className="max-w-md mx-auto bg-anushtan-parchment p-6 rounded-lg border border-anushtan-gold/30">
                                <p className="text-anushtan-charcoal/80 leading-relaxed italic">
                                    "We want that education by which character is formed, strength of mind is increased, and by which one can stand on one's own feet."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Leadership & Governance */}
            <section className="py-24 bg-white">
                <div className="container-custom max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="text-anushtan-gold font-bold tracking-widest uppercase text-sm mb-2 block">
                            Our Team
                        </span>
                        <h2 className="font-heading text-4xl md:text-5xl font-bold text-anushtan-terracotta mb-6">
                            Leadership & Governance
                        </h2>
                        <div className="h-1 w-24 bg-anushtan-gold mx-auto mb-8"></div>
                        <p className="text-xl text-anushtan-charcoal/80 leading-relaxed max-w-4xl mx-auto">
                            Governed by a collective of Global Experts, IITians, and Strategic Visionaries dedicated to building a world-class Indic educational institution.
                        </p>
                    </div>

                    {/* Strategic Academic Partner — Featured card */}
                    <div className="mb-16">
                        <h3 className="font-heading text-2xl font-bold text-anushtan-charcoal mb-6 text-center">Strategic Academic Partner</h3>
                        <FeaturedLeaderCard
                            name="Pratishtan Edu Research / SBR Talks"
                            title="Strategic Academic Advisor"
                            bio="Providing the foundational pedagogical framework for Anushtan's 'Descriptive Logic' standard — a transformative approach to conceptual education that builds thinking minds, not rote memorizers."
                        />
                    </div>

                    {/* Advisory Board */}
                    <div className="text-center mb-8">
                        <h3 className="font-heading text-2xl font-bold text-anushtan-charcoal mb-4">Our Advisory Board & Guiding Force</h3>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                        <LeadershipCompactCard
                            name="Sri. Srikanth Bollavaram"
                            title="Vice President - PEPSICO, USA"
                            bio="Visionary Leader with Global Corporate Exposure and Strong Commitment to Nation-Building Through Education."
                        />
                        <LeadershipCompactCard
                            name="Sri. Bharat Teja"
                            title="B.TECH, M.TECH, IIT Kharagpur"
                            bio="Education Visionary with Strong Academic and Research Orientation."
                        />
                        <LeadershipCompactCard
                            name="Sri. Jaswanth"
                            title="B.TECH, IIT Kharagpur"
                            bio="Mentor in Technology-Driven Farming and Innovation Frameworks."
                        />
                        <LeadershipCompactCard
                            name="Sri. Divi Reddy"
                            title="B.TECH, M.TECH, NIT Warangal"
                            bio="Former Director & CEO US Based Software Companies, Expert in Global Systems, Technology Leadership and Institutional Strategy."
                        />
                    </div>

                    {/* Directors */}
                    <div className="text-center mb-8">
                        <h3 className="font-heading text-2xl font-bold text-anushtan-charcoal mb-4">Directors</h3>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <LeadershipCompactCard
                            name="Sri. Raju Thoutu"
                            title="Architect - CITI BANK, USA"
                            bio="Renowned Professional with Deep Expertise in Infrastructure Planning and Sustainable Development."
                        />
                        <LeadershipCompactCard
                            name="Sri. Sreedhar Bollavaram"
                            title="CEO - Pratishtan Education & Research, Hyderabad"
                            bio="Education Reformer Focused on Value-Based Student-Centric Learning Models."
                        />
                        <LeadershipCompactCard
                            name="Sri. Kartik Narendrula"
                            title="Research Scholar - Organic Farming"
                            bio="Advocate of Sustainability, Environmental Responsibility and Rural Development."
                        />
                        <LeadershipCompactCard
                            name="Sri. Goutham Reddy"
                            title="B.Tech, IIT Mandi - AI Application Engineer"
                            bio="Specializing in building pre-trained Real-world AI solutions."
                        />
                        <LeadershipCompactCard
                            name="Ramu T"
                            title="Global IT Leader & Product Specialist"
                            bio="Integrating world-class pedagogical practices from diverse global schooling systems."
                        />
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}

function FeaturedLeaderCard({ name, title, bio }: { name: string; title: string; bio: string }) {
    return (
        <div className="relative overflow-hidden rounded-xl border-2 border-anushtan-gold/30 hover:border-anushtan-gold/60 transition-all p-8 md:p-10"
            style={{ background: "linear-gradient(135deg, rgba(197,160,89,0.08) 0%, rgba(107,49,38,0.05) 100%)" }}
        >
            {/* Decorative element */}
            <span className="absolute top-6 right-8 font-heading text-[80px] font-bold text-anushtan-terracotta/[0.06] leading-none select-none">✦</span>
            <div className="relative z-10">
                <div className="text-anushtan-gold/70 text-xs uppercase tracking-widest font-bold mb-3">Strategic Partner</div>
                <h4 className="font-heading text-2xl md:text-3xl font-bold text-anushtan-terracotta mb-2">{name}</h4>
                <div className="text-anushtan-gold text-sm font-medium mb-4">{title}</div>
                <div className="w-12 h-[2px] bg-anushtan-gold/40 mb-4" />
                <p className="text-anushtan-charcoal/80 leading-relaxed md:max-w-2xl">{bio}</p>
            </div>
        </div>
    );
}

function LeadershipCompactCard({ name, title, bio }: { name: string; title: string; bio: string }) {
    return (
        <div className="relative overflow-hidden bg-anushtan-parchment p-6 rounded-lg border border-anushtan-border hover:border-anushtan-terracotta/50 hover:shadow-lg transition-all group cursor-default">
            {/* Slide-up hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-anushtan-terracotta to-anushtan-terracotta/75 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out flex flex-col justify-end p-6 z-10">
                <h4 className="font-heading text-lg font-bold text-white mb-1">{name}</h4>
                <div className="text-anushtan-gold text-sm font-medium">{title}</div>
            </div>
            <h4 className="font-heading text-xl font-bold text-anushtan-terracotta mb-2">{name}</h4>
            <div className="text-anushtan-gold text-sm font-medium mb-3">{title}</div>
            <p className="text-anushtan-charcoal/70 text-sm leading-relaxed">{bio}</p>
        </div>
    );
}
