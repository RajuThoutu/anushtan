import { Navbar } from "@/components/layout/Navbar";
import Image from "next/image";
import { Footer } from "@/components/layout/Footer";
import type { Metadata } from 'next';
import { Search, Triangle, Flower, User, Heart, Zap, Feather } from "lucide-react";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = {
    title: 'About | Anushtan Indic School',
    description: 'Our Identity, Lineage, and Wisdom.',
};

export default function About() {
    const pillars = [
        {
            name: "Sri Ramakrishna Paramahamsa",
            theme: "Universal Harmony & The Core of Being",
            focus: "Cultivating the realization of divinity in every soul and the harmony of all paths.",
            icon: <Heart className="w-8 h-8 text-anushtan-gold" />,
            image: "/images/ramakrishna.jpg" // Placeholder path
        },
        {
            name: "Sri Sarada Devi",
            theme: "Maternal Nurturing & Purity",
            focus: "Governance of the Sacred Kitchen (Annam Brahma) and the emotional safety of the child.",
            icon: <User className="w-8 h-8 text-anushtan-gold" />,
            image: "/images/sarada-devi.jpg" // Placeholder path
        },
        {
            name: "Swami Vivekananda",
            theme: "The Man-Making Mandate",
            focus: "Building the grit, ethics, and strength of character required for leadership and service.",
            icon: <Zap className="w-8 h-8 text-anushtan-gold" />,
            image: "/hero-swami-standing.jpg"
        },
        {
            name: "Rabindranath Tagore",
            theme: "Natural Freedom & Aesthetic Harmony",
            focus: "Integrating learning into the 6-acre sanctuary and cultivating the 'Culture of the Heart'.",
            icon: <Feather className="w-8 h-8 text-anushtan-gold" />,
            image: "/images/tagore.jpg" // Placeholder path
        }
    ];

    return (
        <>
            <Navbar />

            {/* 1. Header: Our Identity (Logo & Meaning) - KEPT AS IS */}
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

                    {/* Triptych Display for The Holy Trio */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                        {/* Ramakrishna */}
                        <div className="text-center group">
                            <div className="w-64 h-80 mx-auto relative overflow-hidden rounded-t-full border-4 border-anushtan-border shadow-lg mb-6 grayscale hover:grayscale-0 transition-all duration-500">
                                <Image
                                    src="/images/ramakrishna.jpg"
                                    alt="Sri Ramakrishna Paramahamsa"
                                    fill
                                    className="object-cover object-top"
                                />
                            </div>
                            <h3 className="text-2xl font-bold text-anushtan-terracotta font-heading">Sri Ramakrishna</h3>
                            <p className="text-anushtan-charcoal/60 text-sm italic">The Prophet of Harmony</p>
                        </div>

                        {/* Sarada Devi */}
                        <div className="text-center group mt-0 md:-mt-12">
                            <div className="w-64 h-80 mx-auto relative overflow-hidden rounded-t-full border-4 border-anushtan-border shadow-lg mb-6 grayscale hover:grayscale-0 transition-all duration-500">
                                <Image
                                    src="/images/sarada-devi.jpg"
                                    alt="Sri Sarada Devi"
                                    fill
                                    className="object-cover object-top"
                                />
                            </div>
                            <h3 className="text-2xl font-bold text-anushtan-terracotta font-heading">Sri Sarada Devi</h3>
                            <p className="text-anushtan-charcoal/60 text-sm italic">The Holy Mother</p>
                        </div>

                        {/* Vivekananda */}
                        <div className="text-center group">
                            <div className="w-64 h-80 mx-auto relative overflow-hidden rounded-t-full border-4 border-anushtan-border shadow-lg mb-6 grayscale hover:grayscale-0 transition-all duration-500">
                                <Image
                                    src="/hero-swami-standing.jpg"
                                    alt="Swami Vivekananda"
                                    fill
                                    className="object-cover object-top"
                                />
                            </div>
                            <h3 className="text-2xl font-bold text-anushtan-terracotta font-heading">Swami Vivekananda</h3>
                            <p className="text-anushtan-charcoal/60 text-sm italic">The Awakener of Souls</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. The 4 Pillars of Universal Wisdom */}
            <section className="py-24 bg-anushtan-parchment border-t border-anushtan-border">
                <div className="container-custom max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="font-heading text-4xl md:text-5xl font-bold text-anushtan-terracotta mb-6">
                            The 4 Pillars of Universal Wisdom
                        </h2>
                        <div className="h-1 w-24 bg-anushtan-gold mx-auto"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {pillars.map((pillar, index) => (
                            <div key={index} className="bg-white border border-anushtan-border p-8 rounded-xl shadow-sm hover:shadow-xl hover:border-anushtan-terracotta/30 transition-all duration-300 group hover:-translate-y-1">
                                <div className="w-16 h-16 bg-anushtan-parchment rounded-full flex items-center justify-center mb-6 border border-anushtan-gold/20 group-hover:bg-anushtan-gold/10 transition-colors">
                                    {pillar.icon}
                                </div>
                                <h3 className="font-heading text-xl font-bold text-anushtan-terracotta mb-2 min-h-[3.5rem] flex items-end">
                                    {pillar.name}
                                </h3>
                                <div className="w-12 h-[2px] bg-anushtan-gold/50 mb-4"></div>
                                <p className="text-sm font-bold text-anushtan-charcoal/80 mb-3 uppercase tracking-wide">
                                    {pillar.theme}
                                </p>
                                <p className="text-anushtan-charcoal/70 text-sm leading-relaxed">
                                    {pillar.focus}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}
