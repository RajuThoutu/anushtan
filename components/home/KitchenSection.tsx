"use client";

import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Droplets, Heart } from "lucide-react";

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
                        Pure, nutrient-rich food compliant with ancient yogic principles.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {/* Feature 1: A2 Desi Cow Milk */}
                    <div className="relative group overflow-hidden rounded-2xl bg-white md:col-span-2 shadow-sm border border-anushtan-border">
                        <div className="absolute inset-0 z-0">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-20" />
                            <Image
                                src="/kitchen-goshala.png"
                                alt="A2 Desi Cow Milk Goshala"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105 saturate-125"
                            />
                        </div>
                        <div className="p-6 md:p-8 relative z-30 flex flex-col justify-end h-full min-h-[200px]">
                            <h3 className="text-white font-heading text-3xl md:text-4xl font-bold mb-2 tracking-wide drop-shadow-md">
                                A2 Desi Cow Milk
                            </h3>
                            <p className="text-white/90 max-w-md font-medium text-base leading-relaxed">
                                From our own on-campus Goshala. Antibiotic-free, high-prana nourishment.
                            </p>
                        </div>
                    </div>

                    {/* Feature 2: Ancient Millets */}
                    <div className="relative group overflow-hidden rounded-2xl bg-white shadow-sm border border-anushtan-border">
                        <div className="absolute inset-0 bg-anushtan-gold/5 group-hover:bg-anushtan-gold/10 transition-colors z-10" />
                        <div className="p-6 relative z-20 flex flex-col justify-center h-full">
                            <h3 className="text-anushtan-charcoal font-heading text-2xl font-bold mb-2">
                                Ancient Millets
                            </h3>
                            <p className="text-anushtan-charcoal/90 font-medium">
                                Returning to roots.
                            </p>
                        </div>
                    </div>

                    {/* Feature 3: Zero Sugar */}
                    <div className="relative group overflow-hidden rounded-2xl bg-white border-2 border-anushtan-terracotta/20 shadow-md">
                        <div className="absolute inset-0 flex items-center justify-center opacity-80 group-hover:scale-110 transition-transform duration-500">
                            <Droplets className="w-20 h-20 text-anushtan-gold" />
                        </div>
                        <div className="p-6 relative z-20 flex flex-col justify-end h-full">
                            <h3 className="text-anushtan-charcoal font-heading text-2xl font-bold mb-2">
                                Zero-Sugar Standard
                            </h3>
                            <p className="text-anushtan-charcoal/90 font-medium">
                                Jaggery & Natural Sweeteners only.
                            </p>
                        </div>
                    </div>

                    {/* Feature 4: Sahabhojan */}
                    <div className="relative group overflow-hidden rounded-2xl bg-white md:col-span-2 shadow-sm border border-anushtan-border">
                        <div className="absolute inset-0 bg-anushtan-charcoal/5 group-hover:bg-anushtan-charcoal/10 transition-colors z-10" />
                        <div className="p-8 relative z-30 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex-1">
                                <h3 className="text-anushtan-charcoal font-heading text-3xl font-bold mb-3 tracking-wide">
                                    Sahabhojan
                                </h3>
                                <p className="text-anushtan-charcoal/80 max-w-lg text-lg font-light leading-relaxed">
                                    Serving food with love and compassion, cultivating gratitude and community.
                                </p>
                            </div>
                            <div className="w-full md:w-64 h-2 bg-anushtan-gold/30 rounded-full overflow-hidden">
                                <div className="w-2/3 h-full bg-anushtan-gold" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA Card to Food & Wellness */}
                <div className="relative group overflow-hidden rounded-2xl bg-gradient-to-br from-anushtan-terracotta to-anushtan-terracotta/80 shadow-xl p-8 md:p-12 text-center">
                    <Heart className="w-16 h-16 text-white/30 mx-auto mb-4" />
                    <h3 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
                        Explore Our Complete Food & Wellness Philosophy
                    </h3>
                    <p className="text-white/90 text-lg max-w-2xl mx-auto mb-6 leading-relaxed">
                        Discover our comprehensive approach to holistic nutrition, Indic food culture, student activities, and residential community life.
                    </p>
                    <Button
                        href="/food-wellness"
                        className="bg-white text-anushtan-terracotta hover:bg-anushtan-parchment px-8 py-4 text-lg font-bold shadow-lg hover:shadow-xl transition-all"
                    >
                        Learn About Food & Wellness →
                    </Button>
                </div>
            </div>
        </section>
    );
};
