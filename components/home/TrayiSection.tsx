"use client";

import { Card } from "@/components/ui/Card";
import Image from "next/image";

export const TrayiSection = () => {
    return (
        <section id="trayi" className="py-32 bg-anushtan-parchment relative overflow-hidden">
            {/* Background Decoration - Light Theme */}
            <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(#6B3126 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
            </div>

            <div className="container-custom relative z-10">
                <div className="text-center mb-20">
                    <h2 className="font-heading text-5xl md:text-6xl font-bold text-anushtan-charcoal mb-4">
                        The Trinity of Inspirations
                    </h2>
                    <p className="text-anushtan-terracotta text-lg font-bold tracking-widest uppercase">
                        Architecting potential through the Trishakti Framework
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-7xl mx-auto px-4">
                    {/* Column 1: Iccha Shakti (The Soul) */}
                    <div className="group relative">
                        <Card className="relative h-full bg-white border-2 border-anushtan-border p-0 overflow-hidden group-hover:-translate-y-2 transition-all duration-500 group-hover:border-anushtan-terracotta hover:shadow-[0_10px_40px_rgba(212,175,55,0.2)]">
                            <div className="h-96 w-full relative transition-all duration-700">
                                <Image
                                    src="/hero-swami-standing.jpg" // Placeholder for Vivekananda
                                    alt="Swami Vivekananda"
                                    fill
                                    className="object-cover object-top"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-100" />
                                <div className="absolute bottom-6 left-6">
                                    <h3 className="font-heading text-3xl font-bold mb-1 text-white">Iccha Shakti</h3>
                                    <p className="text-anushtan-gold font-medium tracking-wide">The Soul</p>
                                </div>
                            </div>
                            <div className="p-8 bg-white text-anushtan-charcoal h-full relative border-t border-anushtan-border">
                                <div className="absolute top-0 right-0 w-20 h-20 bg-anushtan-terracotta/10 rounded-bl-full" />
                                <p className="text-lg leading-relaxed font-light mb-6 italic">
                                    "Education is the manifestation of the perfection already in man."
                                </p>
                                <p className="text-sm font-bold text-anushtan-terracotta uppercase tracking-widest">
                                    Protagonist: Swami Vivekananda
                                </p>
                            </div>
                        </Card>
                    </div>


                    {/* Column 2: Jnana Shakti (The Mind) */}
                    <div className="group relative mt-0 lg:-mt-12">
                        <Card className="relative h-full bg-white border-2 border-anushtan-border p-0 overflow-hidden group-hover:-translate-y-2 transition-all duration-500 group-hover:border-anushtan-terracotta hover:shadow-[0_10px_40px_rgba(212,175,55,0.2)]">
                            <div className="h-96 w-full relative transition-all duration-700 bg-anushtan-parchment">
                                {/* Fractal Pattern for Mind */}
                                <div className="absolute inset-0 opacity-10"
                                    style={{
                                        backgroundImage: 'repeating-linear-gradient(45deg, #D4AF37 0, #D4AF37 1px, transparent 0, transparent 50%)',
                                        backgroundSize: '10px 10px'
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-100" />
                                <div className="absolute bottom-6 left-6">
                                    <h3 className="font-heading text-3xl font-bold mb-1 text-white">Jnana Shakti</h3>
                                    <p className="text-anushtan-gold font-medium tracking-wide">The Mind</p>
                                </div>
                                <Image
                                    src="/images/chukka-ramaiah.png"
                                    alt="Chukka Ramaiah"
                                    fill
                                    className="object-cover object-top"
                                />

                            </div>
                            <div className="p-8 bg-white text-anushtan-charcoal h-full relative border-t border-anushtan-border">
                                <div className="absolute top-0 right-0 w-20 h-20 bg-anushtan-gold/10 rounded-bl-full" />
                                <p className="text-lg leading-relaxed font-light mb-6 italic">
                                    "People think a classroom runs when the teacher talks, but learning happens only when student thinks."
                                </p>
                                <p className="text-sm font-bold text-anushtan-terracotta uppercase tracking-widest">
                                    Protagonist: Chukka Ramayya
                                </p>
                            </div>
                        </Card>
                    </div>

                    {/* Column 3: Kriya Shakti (The Future) */}
                    <div className="group relative">
                        <Card className="relative h-full bg-white border-2 border-anushtan-border p-0 overflow-hidden group-hover:-translate-y-2 transition-all duration-500 group-hover:border-anushtan-terracotta hover:shadow-[0_10px_40px_rgba(212,175,55,0.2)]">
                            <div className="h-96 w-full relative transition-all duration-700 bg-anushtan-parchment">
                                {/* Tech Pattern for Future */}
                                <div className="absolute inset-0 opacity-10"
                                    style={{
                                        backgroundImage: 'radial-gradient(circle, #4a90e2 1px, transparent 1px)',
                                        backgroundSize: '20px 20px'
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-100" />
                                <div className="absolute bottom-6 left-6">
                                    <h3 className="font-heading text-3xl font-bold mb-1 text-white">Kriya Shakti</h3>
                                    <p className="text-anushtan-gold font-medium tracking-wide">The Future</p>
                                </div>
                                <Image
                                    src="/images/apj-kalam.jpg"
                                    alt="APJ Abdul Kalam"
                                    fill
                                    className="object-cover object-top"
                                />

                            </div>
                            <div className="p-8 bg-white text-anushtan-charcoal h-full relative border-t border-anushtan-border">
                                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-bl-full" />
                                <p className="text-lg leading-relaxed font-light mb-6 italic">
                                    "The technology is of no use unless and until it reaches those for whom it is intended... Knowledge without action is useless and irrelevant."
                                </p>
                                <p className="text-sm font-bold text-anushtan-terracotta uppercase tracking-widest">
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
