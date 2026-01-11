"use client";

import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Droplets } from "lucide-react";

export const KitchenSection = () => {
    return (
        <section className="py-24 bg-anushtan-parchment">
            <div className="container-custom">
                <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
                    <div>
                        <span className="text-anushtan-terracotta font-bold uppercase tracking-widest text-sm block mb-2">Annam Brahma</span>
                        <h2 className="font-heading text-4xl md:text-5xl font-bold text-anushtan-charcoal">
                            Nourishment as Prayer
                        </h2>
                    </div>
                    <p className="text-lg text-anushtan-charcoal/70 max-w-md text-right md:text-left">
                        Nourishment as Prana. Pure, saturation-free food compliant with ancient yogic principles.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-auto md:h-[500px]">
                    {/* Feature 1: A2 Milk */}
                    <div className="relative group overflow-hidden rounded-2xl bg-white md:col-span-2 md:row-span-2 shadow-sm border border-anushtan-border">
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors z-10" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-20" />
                        <Image
                            src="/kitchen-goshala.png"
                            alt="A2 Desi Cow Milk Goshala"
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105 saturate-125"
                        />
                        <div className="absolute bottom-8 left-8 z-30">
                            <h3 className="text-white font-heading text-4xl font-bold mb-3 tracking-wide drop-shadow-md">A2 Desi Cow Milk</h3>
                            <p className="text-white/90 max-w-sm font-medium text-lg leading-relaxed">From our own on-campus Goshala. Antibiotic-free, high-prana nourishment.</p>
                        </div>
                    </div>

                    {/* Feature 2: Ancient Grains */}
                    <div className="relative group overflow-hidden rounded-2xl bg-white shadow-sm border border-anushtan-border">
                        <div className="absolute inset-0 bg-anushtan-gold/5 group-hover:bg-anushtan-gold/10 transition-colors z-10" />
                        <div className="absolute bottom-6 left-6 z-20">
                            <h3 className="text-anushtan-charcoal font-heading text-2xl font-bold mb-1">Ancient Millets</h3>
                            <p className="text-anushtan-charcoal/90 font-medium">Returning to roots.</p>
                        </div>
                    </div>

                    {/* Feature 3: Zero Sugar */}
                    <div className="relative group overflow-hidden rounded-2xl bg-white border-2 border-anushtan-terracotta/20 shadow-md">
                        <div className="absolute inset-0 flex items-center justify-center opacity-80 group-hover:scale-110 transition-transform duration-500">
                            <Droplets className="w-24 h-24 text-anushtan-gold" />
                        </div>
                        <div className="absolute bottom-6 left-6 z-20">
                            <h3 className="text-anushtan-charcoal font-heading text-2xl font-bold mb-1">Zero-Sugar Standard</h3>
                            <p className="text-anushtan-charcoal/90 font-medium">Jaggery & Natural Sweeteners only.</p>
                        </div>
                    </div>

                    {/* Feature 4: Sahabhojan (Service) */}
                    <div className="relative group overflow-hidden rounded-2xl bg-white md:col-span-2 shadow-sm border border-anushtan-border">
                        <div className="absolute inset-0 bg-anushtan-charcoal/5 group-hover:bg-anushtan-charcoal/10 transition-colors z-10" />
                        <div className="p-8 relative z-30 flex flex-col justify-center h-full">
                            <h3 className="text-anushtan-charcoal font-heading text-3xl font-bold mb-3 tracking-wide">Sahabhojan</h3>
                            <p className="text-anushtan-charcoal/80 max-w-sm mb-6 text-lg font-light leading-relaxed">"The Culture of Service." Students serve each other, breaking ego and building community.</p>
                            <div className="w-full h-1 bg-anushtan-gold/30 rounded-full overflow-hidden">
                                <div className="w-2/3 h-full bg-anushtan-gold" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
