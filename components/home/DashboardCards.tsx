"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const cards = [
    {
        title: "The Analytical Protocol",
        description: "Beyond OMR factories.",
        icon: "📐",
        color: "from-blue-500/20 to-cyan-500/20",
        borderColor: "border-blue-500/30",
        textColor: "text-blue-200",
    },
    {
        title: "The 6-Acre Sanctuary",
        description: "Grit, Growth, & Goshala.",
        icon: "mk_tree_icon",
        color: "from-green-500/20 to-emerald-500/20",
        borderColor: "border-green-500/30",
        textColor: "text-green-200",
    },
    {
        title: "The Man-Making Mandate",
        description: "Character is our Operating System.",
        icon: "🕉️",
        color: "from-amber-500/20 to-orange-500/20",
        borderColor: "border-amber-500/30",
        textColor: "text-amber-200",
    },
];

export const DashboardCards = () => {
    return (
        <section className="py-20 bg-anushtan-parchment relative">
            {/* Background Gradients for Glassmorphism Context - Light Theme */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[20%] left-[10%] w-96 h-96 bg-anushtan-terracotta/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-anushtan-gold/10 rounded-full blur-[100px]" />
            </div>

            <div className="container-custom relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {cards.map((card, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className={cn(
                                "group relative overflow-hidden rounded-2xl border-2 p-8 transition-all hover:-translate-y-1 hover:shadow-xl",
                                "bg-white", // White card background
                                "border-anushtan-border hover:border-anushtan-terracotta", // Terracotta border hover
                            )}
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-anushtan-terracotta/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className="relative z-10">
                                <div className="mb-4 text-4xl">{card.icon === "mk_tree_icon" ? "🌿" : card.icon}</div>
                                <h3 className={cn("text-2xl font-bold mb-2 font-heading", "text-anushtan-charcoal group-hover:text-anushtan-terracotta transition-colors")}>
                                    {card.title}
                                </h3>
                                <p className="text-lg font-light text-anushtan-charcoal/80">
                                    {card.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
