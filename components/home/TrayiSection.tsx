"use client";

import { Card } from "@/components/ui/Card";
import Image from "next/image";

export const TrayiSection = () => {
    return (
        <section id="trayi" className="py-32 bg-anushtan-parchment relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(#6B3126 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
            </div>

            <div className="container-custom relative z-10">
                <div className="text-center mb-20">
                    <h2 className="font-heading text-5xl md:text-6xl font-bold text-anushtan-charcoal mb-4">
                        The Anushtan Trayi
                    </h2>
                    <p className="text-anushtan-terracotta text-lg font-bold tracking-widest uppercase">
                        The Trishakti Framework
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-7xl mx-auto px-4">
                    {/* Column 1: Iccha Shakti (The Soul) */}
                    <div className="group relative">
                        <div className="absolute inset-0 bg-gradient-to-b from-anushtan-terracotta to-anushtan-charcoal opacity-0 group-hover:opacity-40 transition-opacity duration-500 rounded-xl blur-2xl -inset-2" />
                        <Card className="relative h-full bg-white border-none shadow-2xl p-0 overflow-hidden group-hover:-translate-y-4 transition-transform duration-500 ring-1 ring-transparent group-hover:ring-anushtan-terracotta/50">
                            <div className="h-96 w-full relative grayscale group-hover:grayscale-0 transition-all duration-700">
                                <Image
                                    src="/hero-swami-standing.jpg" // Placeholder for Vivekananda
                                    alt="Swami Vivekananda"
                                    fill
                                    className="object-cover object-top"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-anushtan-charcoal via-transparent to-transparent opacity-90" />
                                <div className="absolute bottom-6 left-6 text-white">
                                    <h3 className="font-heading text-3xl font-bold mb-1">Iccha Shakti</h3>
                                    <p className="text-anushtan-gold font-medium tracking-wide">The Soul</p>
                                </div>
                            </div>
                            <div className="p-8 bg-anushtan-charcoal text-white h-full relative">
                                <div className="absolute top-0 right-0 w-20 h-20 bg-anushtan-terracotta/20 rounded-bl-full" />
                                <p className="text-lg leading-relaxed text-white/80 font-light mb-6">
                                    "Man-Making & Character Governance."
                                </p>
                                <p className="text-sm font-bold text-anushtan-gold uppercase tracking-widest">
                                    Protagonist: Swami Vivekananda
                                </p>
                            </div>
                        </Card>
                    </div>


                    {/* Column 2: Jnana Shakti (The Mind) */}
                    <div className="group relative mt-0 lg:-mt-12">
                        <div className="absolute inset-0 bg-gradient-to-b from-anushtan-gold to-anushtan-charcoal opacity-0 group-hover:opacity-40 transition-opacity duration-500 rounded-xl blur-2xl -inset-2" />
                        <Card className="relative h-full bg-white border-none shadow-2xl p-0 overflow-hidden group-hover:-translate-y-4 transition-transform duration-500 ring-1 ring-transparent group-hover:ring-anushtan-gold/50">
                            <div className="h-96 w-full relative grayscale group-hover:grayscale-0 transition-all duration-700 bg-anushtan-charcoal">
                                {/* Fractal Pattern for Mind */}
                                <div className="absolute inset-0 opacity-30"
                                    style={{
                                        backgroundImage: 'repeating-linear-gradient(45deg, #D4AF37 0, #D4AF37 1px, transparent 0, transparent 50%)',
                                        backgroundSize: '10px 10px'
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-anushtan-charcoal via-transparent to-transparent opacity-90" />
                                <Image
                                    src="/images/chukka-ramaiah.png"
                                    alt="Chukka Ramaiah"
                                    fill
                                    className="object-cover object-top"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-anushtan-charcoal via-anushtan-charcoal/50 to-transparent opacity-90" />
                                <div className="absolute bottom-6 left-6 text-white">
                                    <h3 className="font-heading text-3xl font-bold mb-1">Jnana Shakti</h3>
                                    <p className="text-anushtan-gold font-medium tracking-wide">The Mind</p>
                                </div>
                            </div>
                            <div className="p-8 bg-anushtan-charcoal text-white h-full relative">
                                <div className="absolute top-0 right-0 w-20 h-20 bg-anushtan-gold/20 rounded-bl-full" />
                                <p className="text-lg leading-relaxed text-white/80 font-light mb-6">
                                    "People think a classroom runs when the teacher talks, but learning happens only when student thinks."
                                </p>
                                <p className="text-sm font-bold text-anushtan-gold uppercase tracking-widest">
                                    Protagonist: Chukka Ramayya
                                </p>
                            </div>
                        </Card>
                    </div>

                    {/* Column 3: Kriya Shakti (The Future) */}
                    <div className="group relative">
                        <div className="absolute inset-0 bg-gradient-to-b from-blue-900 to-anushtan-charcoal opacity-0 group-hover:opacity-40 transition-opacity duration-500 rounded-xl blur-2xl -inset-2" />
                        <Card className="relative h-full bg-white border-none shadow-2xl p-0 overflow-hidden group-hover:-translate-y-4 transition-transform duration-500 ring-1 ring-transparent group-hover:ring-blue-500/50">
                            <div className="h-96 w-full relative grayscale group-hover:grayscale-0 transition-all duration-700 bg-anushtan-charcoal">
                                {/* Tech Pattern for Future */}
                                <div className="absolute inset-0 opacity-30"
                                    style={{
                                        backgroundImage: 'radial-gradient(circle, #4a90e2 1px, transparent 1px)',
                                        backgroundSize: '20px 20px'
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-anushtan-charcoal via-transparent to-transparent opacity-90" />
                                <Image
                                    src="/images/apj-kalam.jpg"
                                    alt="APJ Abdul Kalam"
                                    fill
                                    className="object-cover object-top"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-anushtan-charcoal via-anushtan-charcoal/50 to-transparent opacity-90" />
                                <div className="absolute bottom-6 left-6 text-white">
                                    <h3 className="font-heading text-3xl font-bold mb-1">Kriya Shakti</h3>
                                    <p className="text-anushtan-gold font-medium tracking-wide">The Future</p>
                                </div>
                            </div>
                            <div className="p-8 bg-anushtan-charcoal text-white h-full relative">
                                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/20 rounded-bl-full" />
                                <p className="text-lg leading-relaxed text-white/80 font-light mb-6">
                                    "AI, Robotics, and National Innovation for 2030."
                                </p>
                                <p className="text-sm font-bold text-anushtan-gold uppercase tracking-widest">
                                    Protagonist: APJ Abdul Kalam
                                </p>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    );
};
