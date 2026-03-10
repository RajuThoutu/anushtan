"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@repo/ui";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";

const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Academics", href: "/academics" },
    { name: "Food & Wellness", href: "/food-wellness" },
    { name: "Campus", href: "/campus" },
];

function NavLink({ name, href }: { name: string; href: string }) {
    return (
        <Link
            href={href}
            className="relative text-sm font-medium text-anushtan-charcoal hover:text-anushtan-terracotta transition-colors group py-1"
        >
            {name}
            <span className="absolute bottom-0 left-0 h-[2px] w-full bg-anushtan-terracotta origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full" />
        </Link>
    );
}

export function Navbar() {
    const [isOpen, setIsOpen] = React.useState(false);
    const [scrolled, setScrolled] = React.useState(false);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        setScrolled(latest > 80);
    });

    return (
        <nav
            className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
                scrolled
                    ? "border-anushtan-border bg-anushtan-parchment/95 backdrop-blur-md shadow-sm"
                    : "border-transparent bg-anushtan-parchment/80 backdrop-blur-sm"
            }`}
        >
            <div className="container-custom flex items-center justify-between py-6">
                <Link href="/" className="flex items-center gap-3">
                    <div className="relative h-12 w-12 overflow-hidden rounded-full border border-anushtan-terracotta/20">
                        <Image
                            src="/logo.jpg"
                            alt="Anushtan Logo"
                            fill
                            className="object-cover"
                            sizes="48px"
                        />
                    </div>
                    <span className="font-heading text-2xl font-semibold text-anushtan-terracotta tracking-tight">
                        Anushtan
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden lg:flex items-center gap-6">
                    {navLinks.map((link) => (
                        <NavLink key={link.href} name={link.name} href={link.href} />
                    ))}
                    <Button
                        href="/admissions"
                        className="bg-anushtan-terracotta text-white hover:bg-[#8B3A2B] font-bold px-6 shadow-md hover:shadow-xl transition-all hover:-translate-y-0.5 border border-white/10"
                    >
                        Admissions
                    </Button>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="lg:hidden flex items-center gap-2 px-3 py-2 text-anushtan-terracotta hover:bg-anushtan-terracotta/5 rounded-md transition-colors border border-anushtan-terracotta/10"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle menu"
                >
                    <span className="font-bold text-sm uppercase tracking-wider">{isOpen ? "Close" : "Menu"}</span>
                    {isOpen ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="4" y1="12" x2="20" y2="12"></line>
                            <line x1="4" y1="6" x2="20" y2="6"></line>
                            <line x1="4" y1="18" x2="20" y2="18"></line>
                        </svg>
                    )}
                </button>
            </div>

            {/* Mobile Nav — animated slide down with staggered links */}
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        className="lg:hidden border-t border-anushtan-border bg-anushtan-parchment shadow-lg overflow-hidden"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <div className="p-4 flex flex-col gap-1">
                            {navLinks.map((link, idx) => (
                                <motion.div
                                    key={link.href}
                                    initial={{ opacity: 0, x: 16 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05, duration: 0.25 }}
                                >
                                    <Link
                                        href={link.href}
                                        className="block text-base font-medium text-anushtan-charcoal px-4 py-2.5 hover:bg-anushtan-terracotta/5 hover:text-anushtan-terracotta rounded-md transition-colors"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {link.name}
                                    </Link>
                                </motion.div>
                            ))}
                            <motion.div
                                initial={{ opacity: 0, x: 16 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: navLinks.length * 0.05, duration: 0.25 }}
                                className="mt-2"
                            >
                                <Button
                                    href="/admissions"
                                    fullWidth
                                    onClick={() => setIsOpen(false)}
                                    className="bg-anushtan-terracotta text-white font-bold shadow-md hover:bg-[#8B3A2B]"
                                >
                                    Admissions
                                </Button>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
