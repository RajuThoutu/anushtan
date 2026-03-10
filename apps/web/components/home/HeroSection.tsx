"use client";

import { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import { Button } from "@repo/ui";

const marqueeValues = [
    "Swadharma", "Satsang", "Sadhana", "Annam Brahma",
    "Grit", "Man-Making", "Trishakti", "Ancient Roots",
];

export const HeroSection = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end start"],
    });
    const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);

    return (
        <section
            ref={sectionRef}
            className="relative h-[90vh] w-full overflow-hidden flex items-center justify-center bg-anushtan-parchment"
        >
            {/* Parallax Background */}
            <motion.div className="absolute inset-0 z-0" style={{ y: bgY }}>
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60 z-10" />
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-anushtan-parchment/50 z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-anushtan-parchment/60 via-transparent to-anushtan-parchment/60 z-10" />
                <div className="w-full h-full relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src="/images/hero-banner-collage.png"
                        alt="Anushtan Hero Banner"
                        className="w-full h-full object-cover object-top opacity-80 saturate-125"
                    />
                </div>
            </motion.div>

            {/* Floating Geometry */}
            <div className="absolute inset-0 z-[5] pointer-events-none overflow-hidden">
                {/* Triangle — top left */}
                <motion.svg
                    className="absolute top-[15%] left-[8%] text-anushtan-terracotta"
                    width="80" height="80" viewBox="0 0 80 80"
                    style={{ opacity: 0.1 }}
                    animate={{ y: [0, -20, 0] }}
                    transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                >
                    <polygon points="40,5 75,70 5,70" fill="none" stroke="currentColor" strokeWidth="2" />
                </motion.svg>

                {/* Lotus dots — bottom right */}
                <motion.svg
                    className="absolute bottom-[25%] right-[8%] text-anushtan-gold"
                    width="90" height="90" viewBox="0 0 100 100"
                    style={{ opacity: 0.1 }}
                    animate={{ y: [0, 15, 0], rotate: [0, 15, 0] }}
                    transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
                >
                    {Array.from({ length: 8 }).map((_, i) => {
                        const angle = (i * 45 * Math.PI) / 180;
                        return (
                            <circle
                                key={i}
                                cx={50 + 35 * Math.cos(angle)}
                                cy={50 + 35 * Math.sin(angle)}
                                r="4"
                                fill="currentColor"
                            />
                        );
                    })}
                    <circle cx="50" cy="50" r="5" fill="currentColor" />
                </motion.svg>

                {/* Small solid triangle — right mid */}
                <motion.svg
                    className="absolute top-[35%] right-[18%] text-anushtan-terracotta"
                    width="48" height="48" viewBox="0 0 48 48"
                    style={{ opacity: 0.07 }}
                    animate={{ y: [0, -12, 0] }}
                    transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 2 }}
                >
                    <polygon points="24,2 46,44 2,44" fill="currentColor" />
                </motion.svg>
            </div>

            {/* Main Content */}
            <div className="container-custom relative z-20 text-center flex flex-col items-center pb-16">
                {/* Pulsing badge */}
                <div className="relative inline-flex items-center justify-center mb-8">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-anushtan-terracotta/20 animate-ping-slow" />
                    <div className="relative inline-block border border-anushtan-terracotta/30 bg-white/80 backdrop-blur-md px-6 py-2 rounded-full shadow-sm">
                        <span className="text-anushtan-terracotta font-bold tracking-[0.2em] text-sm uppercase">
                            Admissions Opening for 2026
                        </span>
                    </div>
                </div>

                {/* Animated headline — word by word */}
                <h1 className="font-heading text-6xl md:text-7xl lg:text-9xl font-bold text-anushtan-charcoal mb-8 leading-none drop-shadow-sm">
                    <span className="block">
                        {["Ancient", "Roots."].map((word, i) => (
                            <motion.span
                                key={word}
                                className="inline-block mr-3 md:mr-6"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    delay: i * 0.15,
                                    duration: 0.7,
                                    ease: [0.25, 0.46, 0.45, 0.94],
                                }}
                            >
                                {word}
                            </motion.span>
                        ))}
                    </span>
                    <span className="block text-anushtan-terracotta italic">
                        {["Global", "Minds."].map((word, i) => (
                            <motion.span
                                key={word}
                                className="inline-block mr-3 md:mr-6"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    delay: (2 + i) * 0.15,
                                    duration: 0.7,
                                    ease: [0.25, 0.46, 0.45, 0.94],
                                }}
                            >
                                {word}
                            </motion.span>
                        ))}
                    </span>
                </h1>

                <div className="flex flex-col md:flex-row gap-6">
                    <Button
                        href="/admissions"
                        className="bg-anushtan-terracotta text-white hover:bg-anushtan-terracotta/90 border-0 px-10 py-8 text-xl tracking-wide shadow-lg shadow-anushtan-terracotta/20"
                    >
                        Secure a Founding Batch Seat
                    </Button>
                    <Button
                        href="#trayi"
                        variant="outline"
                        className="text-anushtan-terracotta border-2 border-anushtan-terracotta hover:bg-anushtan-terracotta/10 px-10 py-8 text-xl tracking-wide bg-white/90 backdrop-blur-sm font-semibold"
                    >
                        Explore the Trinity
                    </Button>
                </div>
            </div>

            {/* Marquee values strip */}
            <div className="absolute bottom-0 left-0 right-0 z-20 bg-anushtan-terracotta/90 py-3 overflow-hidden">
                <div className="flex animate-marquee whitespace-nowrap">
                    {[0, 1].map((repeatIdx) => (
                        <span key={repeatIdx} className="inline-flex shrink-0">
                            {marqueeValues.map((value) => (
                                <span key={value} className="inline-flex items-center px-8">
                                    <span className="text-anushtan-gold text-sm font-bold tracking-[0.2em] uppercase">
                                        {value}
                                    </span>
                                    <span className="ml-8 text-anushtan-gold/40 text-base">·</span>
                                </span>
                            ))}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
};
