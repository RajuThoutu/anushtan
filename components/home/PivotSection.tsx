"use client";

import { motion } from "framer-motion";
import { Microscope, Leaf, Landmark } from "lucide-react";

export const PivotSection = () => {
    return (
        <section className="py-24 bg-anushtan-parchment text-anushtan-charcoal relative overflow-hidden">
            <div className="container-custom">
                <div className="text-center mb-16">
                    <h2 className="font-heading text-4xl md:text-5xl font-bold text-anushtan-terracotta mb-6">
                        The Specialization Roadmap
                    </h2>
                    <p className="text-xl max-w-2xl mx-auto text-anushtan-charcoal/80 leading-relaxed font-light">
                        "Stop the Factory. Start the Specialization. We identify your child's Swadharma and optimize for their future arena."
                    </p>
                </div>

                {/* Content Wrapper */}
                <div className="relative">

                    {/* --- MOBILE LAYOUT: Horizontal Branching Tree --- */}
                    <div className="block md:hidden relative">
                        {/* Grades 1-7 Header (Mobile) */}
                        <div className="flex flex-col items-center mb-8">
                            <div className="bg-anushtan-charcoal text-white font-bold py-2 px-6 rounded-full border-2 border-white shadow-md relative text-sm">
                                Grades 1 - 7
                                <span className="absolute -right-2 -top-2 w-6 h-6 bg-anushtan-gold rounded-full flex items-center justify-center text-[10px] text-anushtan-charcoal font-bold border-2 border-white">✓</span>
                            </div>
                            <div className="h-16 w-[1px] bg-anushtan-terracotta/50"></div>
                        </div>

                        {/* Horizontal Scroll Container */}
                        <div className="overflow-x-auto pb-12 -mx-4 px-4 snap-x snap-mandatory flex flex-col items-center">

                            {/* Tree Wrapper: Pivot + Branches + Cards */}
                            <div className="relative min-w-[280vw] flex flex-col items-center">

                                {/* 1. Pivot Node */}
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    whileInView={{ scale: 1, opacity: 1 }}
                                    viewport={{ once: true }}
                                    className="relative z-20 mb-12"
                                >
                                    <div className="bg-anushtan-gold text-white font-heading font-bold text-xl p-6 rounded-full shadow-[0_0_30px_rgba(212,175,55,0.4)] border-4 border-white text-center w-40 h-40 flex items-center justify-center">
                                        Grade 8<br />Pivot
                                    </div>
                                </motion.div>

                                {/* 2. SVG Connections */}
                                <svg className="absolute top-[160px] left-0 w-full h-24 z-0 pointer-events-none overflow-visible">
                                    {/* Center Line */}
                                    <motion.path
                                        d="M50% 0 V 40"
                                        fill="none"
                                        stroke="#6B3126"
                                        strokeWidth="2"
                                        initial={{ pathLength: 0 }}
                                        whileInView={{ pathLength: 1 }}
                                        transition={{ duration: 1 }}
                                    />
                                    {/* Horizontal Branch Bar */}
                                    <motion.path
                                        d="M16% 40 H 84%"
                                        fill="none"
                                        stroke="#6B3126"
                                        strokeWidth="2"
                                        initial={{ pathLength: 0 }}
                                        whileInView={{ pathLength: 1 }}
                                        transition={{ duration: 1, delay: 0.5 }}
                                    />
                                    {/* Drops to Cards */}
                                    <motion.path
                                        d="M16% 40 V 100" // Left Drop
                                        fill="none"
                                        stroke="#6B3126"
                                        strokeWidth="2"
                                        initial={{ pathLength: 0 }}
                                        whileInView={{ pathLength: 1 }}
                                        transition={{ duration: 0.5, delay: 1 }}
                                    />
                                    <motion.path
                                        d="M50% 40 V 100" // Center Drop
                                        fill="none"
                                        stroke="#6B3126"
                                        strokeWidth="2"
                                        initial={{ pathLength: 0 }}
                                        whileInView={{ pathLength: 1 }}
                                        transition={{ duration: 0.5, delay: 1 }}
                                    />
                                    <motion.path
                                        d="M84% 40 V 100" // Right Drop
                                        fill="none"
                                        stroke="#6B3126"
                                        strokeWidth="2"
                                        initial={{ pathLength: 0 }}
                                        whileInView={{ pathLength: 1 }}
                                        transition={{ duration: 0.5, delay: 1 }}
                                    />
                                </svg>

                                {/* 3. Cards Row */}
                                <div className="flex w-full justify-between items-start pt-8">
                                    {/* Card 1 */}
                                    <div className="w-[90vw] flex justify-center snap-center px-2">
                                        <div className="bg-white border border-anushtan-gold/10 p-8 rounded-xl text-center shadow-sm w-full relative">
                                            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
                                                <Microscope className="w-8 h-8 text-red-600" />
                                            </div>
                                            <h3 className="font-heading text-xl font-bold text-red-700 mb-1">Mathematical Sciences</h3>
                                            <p className="text-xs text-red-900/60 uppercase tracking-widest">JEE / BITSAT Focus</p>
                                        </div>
                                    </div>

                                    {/* Card 2 */}
                                    <div className="w-[90vw] flex justify-center snap-center px-2">
                                        <div className="bg-white border border-anushtan-gold/10 p-8 rounded-xl text-center shadow-sm w-full relative">
                                            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-100">
                                                <Leaf className="w-8 h-8 text-green-600" />
                                            </div>
                                            <h3 className="font-heading text-xl font-bold text-green-700 mb-1">Life Sciences</h3>
                                            <p className="text-xs text-green-900/60 uppercase tracking-widest">NEET / Research Focus</p>
                                        </div>
                                    </div>

                                    {/* Card 3 */}
                                    <div className="w-[90vw] flex justify-center snap-center px-2">
                                        <div className="bg-white border border-anushtan-gold/10 p-8 rounded-xl text-center shadow-sm w-full relative">
                                            <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-yellow-100">
                                                <Landmark className="w-8 h-8 text-yellow-600" />
                                            </div>
                                            <h3 className="font-heading text-xl font-bold text-yellow-700 mb-1">Management</h3>
                                            <p className="text-xs text-yellow-900/60 uppercase tracking-widest">IAS / Leadership Focus</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Swipe Indicator */}
                                <div className="mt-8 flex items-center gap-2 text-anushtan-terracotta/60 text-sm font-medium animate-pulse">
                                    <span>← Swipe to Explore Paths →</span>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* --- DESKTOP LAYOUT (Existing Grid) --- */}
                    <div className="hidden md:block">
                        {/* Unified Path (Grades 1-7) */}
                        <div className="flex flex-col items-center mb-12 relative z-10">
                            <div className="w-1 h-32 bg-anushtan-terracotta absolute top-0 left-1/2 -translate-x-1/2" />
                            <div className="bg-anushtan-charcoal text-white font-bold py-3 px-8 rounded-full z-10 mb-8 border-4 border-white shadow-lg relative">
                                Grades 1 - 7
                                <span className="absolute -right-4 -top-4 w-8 h-8 bg-anushtan-gold rounded-full flex items-center justify-center text-xs text-anushtan-charcoal font-bold border-2 border-white">✓</span>
                            </div>
                            <p className="text-sm font-bold uppercase tracking-widest text-anushtan-terracotta mb-8">Foundational Logic</p>
                        </div>

                        {/* The Divergence Point */}
                        <div className="flex flex-col items-center mb-12 relative z-20">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                viewport={{ once: true }}
                                className="bg-anushtan-gold text-white font-heading font-bold text-2xl p-6 rounded-full shadow-[0_0_40px_rgba(212,175,55,0.4)] border-4 border-white text-center w-48 h-48 flex items-center justify-center z-10"
                            >
                                Grade 8<br />Pivot
                            </motion.div>
                        </div>

                        {/* Branches */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 lg:gap-12 relative z-10 max-w-6xl mx-auto">
                            {/* Decorative Branch Lines (Desktop) */}
                            <div className="hidden md:block absolute top-[-48px] left-1/2 -translate-x-1/2 w-full h-24 border-t-2 border-l-2 border-r-2 border-anushtan-terracotta rounded-t-[4rem] pointer-events-none" style={{ width: '66%' }} />

                            {/* Branch 1: Mathematical Sciences */}
                            <motion.div
                                initial={{ y: 50, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="bg-red-50/50 border border-red-200 p-8 rounded-xl text-center hover:bg-red-100/50 transition-colors group shadow-lg shadow-red-900/5 hover:shadow-xl"
                            >
                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl group-hover:bg-red-200 transition-colors">
                                    <Microscope className="w-8 h-8 text-red-600" />
                                </div>
                                <h3 className="font-heading text-2xl font-bold text-red-700 mb-2">Mathematical Sciences</h3>
                                <p className="text-sm text-red-900/60 mb-4">JEE / BITSAT Focus</p>
                            </motion.div>

                            {/* Branch 2: Life Sciences */}
                            <motion.div
                                initial={{ y: 50, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="bg-green-50/50 border border-green-200 p-8 rounded-xl text-center hover:bg-green-100/50 transition-colors mt-0 md:mt-12 group shadow-lg shadow-green-900/5 hover:shadow-xl"
                            >
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl group-hover:bg-green-200 transition-colors">
                                    <Leaf className="w-8 h-8 text-green-600" />
                                </div>
                                <h3 className="font-heading text-2xl font-bold text-green-700 mb-2">Life Sciences</h3>
                                <p className="text-sm text-green-900/60 mb-4">NEET / Research Focus</p>
                            </motion.div>

                            {/* Branch 3: Management */}
                            <motion.div
                                initial={{ y: 50, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="bg-yellow-50/50 border border-yellow-200 p-8 rounded-xl text-center hover:bg-yellow-100/50 transition-colors group shadow-lg shadow-yellow-900/5 hover:shadow-xl"
                            >
                                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl group-hover:bg-yellow-200 transition-colors">
                                    <Landmark className="w-8 h-8 text-yellow-600" />
                                </div>
                                <h3 className="font-heading text-2xl font-bold text-yellow-700 mb-2">Management & Governance</h3>
                                <p className="text-sm text-yellow-900/60 mb-4">IAS / Leadership Focus</p>
                            </motion.div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};
