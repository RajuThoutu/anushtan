"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
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
                <Link href="/" className="flex items-center gap-2">
                    <div className="h-10 w-10 flex items-center justify-center font-bold text-anushtan-maroon bg-anushtan-maroon/10 rounded">
                        {"{{IMAGE:LOGO}}"}
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
                <button
                    className="lg:hidden p-2 text-anushtan-charcoal"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span className="sr-only">Menu</span>
                    {isOpen ? "✕" : "☰"}
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
