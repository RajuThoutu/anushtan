"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import Image from "next/image";

const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Directors", href: "/leadership" },
    { name: "Academics", href: "/academics" },
    { name: "Student Life", href: "/student-life" },
    { name: "Teachers & Community", href: "/teachers-community" },
    { name: "Campus", href: "/campus" },
    { name: "Contact", href: "/contact" },
];

export function Navbar() {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-anushtan-border bg-anushtan-ivory/95 backdrop-blur-md">
            <div className="container-custom flex h-20 items-center justify-between">
                <Link href="/" className="flex items-center gap-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-full border border-anushtan-maroon/20">
                        <Image
                            src="/logo.jpg"
                            alt="Anushtan Logo"
                            fill
                            className="object-cover"
                            sizes="40px"
                        />
                    </div>
                    <span className="font-heading text-xl font-bold text-anushtan-maroon tracking-tight">
                        Anushtan
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden lg:flex items-center gap-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-sm font-medium text-anushtan-charcoal hover:text-anushtan-saffron transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Button href="/admissions" className="bg-anushtan-maroon text-white hover:bg-anushtan-maroon/90">
                        Admissions
                    </Button>
                </div>

                {/* Mobile Menu Toggle */}
                {/* Mobile Menu Toggle */}
                <button
                    className="lg:hidden flex items-center gap-2 px-3 py-2 text-anushtan-maroon hover:bg-anushtan-maroon/5 rounded-md transition-colors border border-anushtan-maroon/10"
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
                <div className="lg:hidden border-t border-anushtan-border bg-anushtan-ivory p-4 shadow-lg">
                    <div className="flex flex-col gap-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-base font-medium text-anushtan-charcoal px-4 py-2 hover:bg-anushtan-maroon/5 rounded-md"
                                onClick={() => setIsOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Button href="/admissions" fullWidth onClick={() => setIsOpen(false)} className="bg-anushtan-maroon text-white">
                            Admissions
                        </Button>
                    </div>
                </div>
            )}
        </nav>
    );
}
