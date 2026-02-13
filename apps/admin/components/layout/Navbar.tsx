"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@repo/ui";
import Image from "next/image";

const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Academics", href: "/academics" },
    { name: "Food & Wellness", href: "/food-wellness" },
    { name: "Campus", href: "/campus" },
];

export function Navbar() {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-anushtan-border bg-anushtan-parchment/95 backdrop-blur-md">
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
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-sm font-medium text-anushtan-charcoal hover:text-anushtan-terracotta transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Button href="/admissions" className="bg-anushtan-terracotta text-white hover:bg-[#8B3A2B] font-bold px-6 shadow-md hover:shadow-xl transition-all hover:-translate-y-0.5 border border-white/10">
                        Admissions
                    </Button>
                </div>

                {/* Mobile Menu Toggle */}
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

            {/* Mobile Nav */}
            {isOpen && (
                <div className="lg:hidden border-t border-anushtan-border bg-anushtan-parchment p-4 shadow-lg">
                    <div className="flex flex-col gap-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-base font-medium text-anushtan-charcoal px-4 py-2 hover:bg-anushtan-terracotta/5 rounded-md"
                                onClick={() => setIsOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Button href="/admissions" fullWidth onClick={() => setIsOpen(false)} className="bg-anushtan-terracotta text-white font-bold shadow-md hover:bg-[#8B3A2B]">
                            Admissions
                        </Button>
                    </div>
                </div>
            )}
        </nav>
    );
}
