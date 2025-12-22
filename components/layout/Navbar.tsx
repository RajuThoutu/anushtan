"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { Button } from "../ui/Button";

const navLinks = [
    { name: "About", href: "/about" },
    { name: "Academics", href: "/academics" },
    { name: "Student Life", href: "/student-life" },
    { name: "Teachers", href: "/teachers-community" },
    { name: "Campus", href: "/campus" },
    { name: "Contact", href: "/contact" },
];

export function Navbar() {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-primary/10 bg-background/80 backdrop-blur-md">
            <div className="container-custom flex h-20 items-center justify-between">
                {/* Logo Placeholder */}
                <Link href="/" className="flex items-center gap-2">
                    <Image src="/logo.jpg" alt="Anushtan Logo" width={40} height={40} className="rounded-full object-contain" />
                    <span className="font-heading text-xl font-bold text-secondary">
                        Anushtan
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden lg:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-sm font-medium text-text/80 hover:text-primary transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Button href="/admissions" size="sm">
                        Admissions
                    </Button>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="lg:hidden p-2 text-text"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Nav */}
            {isOpen && (
                <div className="lg:hidden border-t border-primary/10 bg-background p-4 shadow-lg">
                    <div className="flex flex-col gap-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-base font-medium text-text px-4 py-2 hover:bg-primary/5 rounded-md"
                                onClick={() => setIsOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Button href="/admissions" fullWidth onClick={() => setIsOpen(false)}>
                            Admissions
                        </Button>
                    </div>
                </div>
            )}
        </nav>
    );
}
