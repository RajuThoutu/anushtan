"use client";

import { motion } from "framer-motion";
import { Ruler, TreePine, BookOpen } from "lucide-react";

export const DashboardCards = () => {
    return (
        <section className="py-20 bg-anushtan-parchment relative">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[20%] left-[10%] w-96 h-96 bg-anushtan-terracotta/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-anushtan-gold/10 rounded-full blur-[100px]" />
            </div>

            <div className="container-custom relative z-10">
                {/* Asymmetric bento: large card left (55%), two stacked cards right (45%) */}
                <div className="flex flex-col md:flex-row gap-6 md:min-h-[480px]">

                    {/* Large card — The Analytical Protocol */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        viewport={{ once: true }}
                        className="md:w-[55%] group relative overflow-hidden rounded-2xl border-2 p-10 transition-all hover:-translate-y-1 hover:shadow-xl bg-anushtan-terracotta/5 border-anushtan-terracotta/20 hover:border-anushtan-terracotta"
                    >
                        {/* Subtle grid pattern */}
                        <div
                            className="absolute inset-0 opacity-[0.025]"
                            style={{
                                backgroundImage:
                                    "linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)",
                                backgroundSize: "40px 40px",
                            }}
                        />
                        {/* Large ordinal overlay */}
                        <span className="absolute bottom-2 right-4 font-heading font-bold text-anushtan-terracotta/[0.05] leading-none select-none pointer-events-none" style={{ fontSize: "160px" }}>
                            01
                        </span>
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="mb-6">
                                <Ruler className="w-10 h-10 text-anushtan-gold" />
                            </div>
                            <h3 className="text-3xl font-bold font-heading text-anushtan-charcoal group-hover:text-anushtan-terracotta transition-colors mb-3">
                                The Analytical Protocol
                            </h3>
                            <p className="text-xl font-light text-anushtan-charcoal/70">
                                Beyond OMR factories.
                            </p>
                        </div>
                    </motion.div>

                    {/* Right stack — two smaller cards */}
                    <div className="md:w-[45%] flex flex-col gap-6">

                        {/* The 6-Acre Sanctuary */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            viewport={{ once: true }}
                            className="flex-1 group relative overflow-hidden rounded-2xl border-2 p-8 transition-all hover:-translate-y-1 hover:shadow-xl bg-anushtan-gold/5 border-anushtan-gold/20 hover:border-anushtan-gold"
                        >
                            <span className="absolute bottom-0 right-3 font-heading font-bold text-anushtan-charcoal/[0.04] leading-none select-none pointer-events-none" style={{ fontSize: "110px" }}>
                                02
                            </span>
                            <div className="relative z-10">
                                <div className="mb-4">
                                    <TreePine className="w-9 h-9 text-anushtan-gold" />
                                </div>
                                <h3 className="text-2xl font-bold font-heading text-anushtan-charcoal group-hover:text-anushtan-terracotta transition-colors mb-2">
                                    The 6-Acre Sanctuary
                                </h3>
                                <p className="text-lg font-light text-anushtan-charcoal/70">
                                    Grit, Growth, & Goshala.
                                </p>
                            </div>
                        </motion.div>

                        {/* The Man-Making Mandate */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            viewport={{ once: true }}
                            className="flex-1 group relative overflow-hidden rounded-2xl border-2 p-8 transition-all hover:-translate-y-1 hover:shadow-xl bg-anushtan-parchment border-anushtan-border hover:border-anushtan-charcoal/30"
                        >
                            <span className="absolute bottom-0 right-3 font-heading font-bold text-anushtan-charcoal/[0.04] leading-none select-none pointer-events-none" style={{ fontSize: "110px" }}>
                                03
                            </span>
                            <div className="relative z-10">
                                <div className="mb-4">
                                    <BookOpen className="w-9 h-9 text-anushtan-gold" />
                                </div>
                                <h3 className="text-2xl font-bold font-heading text-anushtan-charcoal group-hover:text-anushtan-terracotta transition-colors mb-2">
                                    The Man-Making Mandate
                                </h3>
                                <p className="text-lg font-light text-anushtan-charcoal/70">
                                    Character is our Operating System.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};
