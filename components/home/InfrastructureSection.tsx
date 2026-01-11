"use client";

import Image from "next/image";

export const InfrastructureSection = () => {
    return (
        <section className="py-24 bg-anushtan-parchment">
            <div className="container-custom">
                <div className="text-center mb-16">
                    <h2 className="font-heading text-4xl md:text-5xl font-bold text-anushtan-charcoal mb-4">
                        The Ecosystem
                    </h2>
                    <p className="text-anushtan-charcoal/60">An environment architected for focus and flow.</p>
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-2 gap-4 h-[800px] mb-20">
                    {/* Item 1: Main Block (Large) - Campus Aerial View */}
                    <div className="md:col-span-2 md:row-span-2 relative rounded-3xl overflow-hidden group shadow-sm border border-anushtan-border bg-white flex flex-col">
                        <div className="relative h-2/3 overflow-hidden">
                            <Image
                                src="/images/campus-arial.jpg"
                                alt="Anushtan Campus Aerial View"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        </div>
                        <div className="p-8 flex-1 flex flex-col justify-center">
                            <h3 className="text-anushtan-charcoal text-4xl font-heading font-bold mb-3 tracking-wide">The 6-Acre Sanctuary</h3>
                            <p className="text-anushtan-charcoal/80 text-lg font-medium max-w-md">Siddipet's first purpose-built integral campus.</p>
                        </div>
                    </div>

                    {/* Item 2: Anushtan Building */}
                    <div className="md:col-span-1 md:row-span-1 relative rounded-3xl overflow-hidden group shadow-sm hover:shadow-md transition-all border border-anushtan-border hover:border-anushtan-terracotta duration-300 bg-white flex flex-col">
                        <div className="relative h-3/5 overflow-hidden">
                            <Image
                                src="/images/anushtan-building.jpg"
                                alt="Anushtan Generic Block"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        </div>
                        <div className="p-6 flex-1 flex flex-col justify-center">
                            <h3 className="text-anushtan-charcoal text-2xl font-heading font-bold mb-1">Academic Block</h3>
                            <p className="text-anushtan-charcoal/80 text-sm font-medium">Modern infrastructure.</p>
                        </div>
                    </div>

                    {/* Item 3: Open Air Mandapa */}
                    <div className="md:col-span-1 md:row-span-1 relative rounded-3xl overflow-hidden group shadow-sm hover:shadow-md transition-all border border-anushtan-border hover:border-anushtan-terracotta duration-300 bg-white flex flex-col">
                        <div className="relative h-3/5 overflow-hidden">
                            <Image
                                src="/images/mandapa.jpg"
                                alt="Open-Air Mandapa"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        </div>
                        <div className="p-6 flex-1 flex flex-col justify-center">
                            <h3 className="text-anushtan-charcoal text-2xl font-heading font-bold mb-1">Open-Air Mandapa</h3>
                            <p className="text-anushtan-charcoal/80 text-sm font-medium">Classes under the sky.</p>
                        </div>
                    </div>
                </div>


            </div>
        </section>
    );
};
