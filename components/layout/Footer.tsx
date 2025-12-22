import Link from "next/link";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-secondary text-white pt-16 pb-8">
            <div className="container-custom grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                {/* Brand */}
                <div className="col-span-1 md:col-span-1">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="h-8 w-8 bg-white/10 flex items-center justify-center rounded-full text-xs">
                            [LOGO]
                        </div>
                        <span className="font-heading text-xl font-bold">Anushtan</span>
                    </div>
                    <p className="text-white/80 text-sm leading-relaxed mb-6">
                        An institution dedicated to reviving the timeless wisdom of India
                        while embracing the best of modern education.
                    </p>
                    <div className="flex gap-4">
                        <a href="#" className="text-white/60 hover:text-white"><Facebook size={20} /></a>
                        <a href="#" className="text-white/60 hover:text-white"><Instagram size={20} /></a>
                        <a href="#" className="text-white/60 hover:text-white"><Twitter size={20} /></a>
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="font-heading font-semibold text-lg mb-6">Quick Links</h3>
                    <ul className="space-y-3 text-sm text-white/80">
                        <li><Link href="/about" className="hover:text-amber-200">About Us</Link></li>
                        <li><Link href="/academics" className="hover:text-amber-200">Academics</Link></li>
                        <li><Link href="/teachers-community" className="hover:text-amber-200">Leadership</Link></li>
                        <li><Link href="/features" className="hover:text-amber-200">Features</Link></li>
                    </ul>
                </div>

                {/* Admissions */}
                <div>
                    <h3 className="font-heading font-semibold text-lg mb-6">Admissions</h3>
                    <ul className="space-y-3 text-sm text-white/80">
                        <li><Link href="/admissions" className="hover:text-amber-200">Apply Now</Link></li>
                        <li><Link href="/admissions#fees" className="hover:text-amber-200">Fee Structure</Link></li>
                        <li><Link href="/admissions#faq" className="hover:text-amber-200">FAQs</Link></li>
                        <li><Link href="/contact" className="hover:text-amber-200">Schedule Visit</Link></li>
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h3 className="font-heading font-semibold text-lg mb-6">Contact Us</h3>
                    <ul className="space-y-4 text-sm text-white/80">
                        <li className="flex gap-3">
                            <MapPin size={18} className="shrink-0 text-amber-200" />
                            <span>123 Knowledge Park, [City], [State], India - 500000</span>
                        </li>
                        <li className="flex gap-3">
                            <Phone size={18} className="shrink-0 text-amber-200" />
                            <span>+91 98765 43210</span>
                        </li>
                        <li className="flex gap-3">
                            <Mail size={18} className="shrink-0 text-amber-200" />
                            <span>admissions@anushtanschool.edu</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="container-custom border-t border-white/10 pt-8 text-center text-sm text-white/40">
                <p>&copy; {new Date().getFullYear()} Anushtan Indic School. All rights reserved.</p>
            </div>
        </footer>
    );
}
