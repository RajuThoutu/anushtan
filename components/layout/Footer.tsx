import Link from "next/link";
import Image from "next/image";

export function Footer() {
    return (
        <footer className="bg-anushtan-charcoal text-anushtan-parchment py-16">
            <div className="container-custom grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-white/10 pb-12">
                <div className="col-span-1 md:col-span-1">
                    <Link href="/" className="flex items-center gap-3 mb-6">
                        <div className="relative h-8 w-8 overflow-hidden rounded-full border border-white/20">
                            <Image
                                src="/logo.jpg"
                                alt="Anushtan Logo"
                                fill
                                className="object-cover"
                                sizes="32px"
                            />
                        </div>
                        <span className="font-heading text-xl font-bold text-anushtan-parchment">
                            Anushtan
                        </span>
                    </Link>
                    <p className="text-anushtan-parchment/70 mb-6 text-sm leading-relaxed">
                        An institutional approach to education integrating academics, physical vitality, cultural grounding, and inner discipline.
                    </p>
                    <div className="flex gap-4">
                        <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-xs">FB</div>
                        <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-xs">IG</div>
                        <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-xs">YT</div>
                    </div>
                </div>

                <div>
                    <h4 className="font-heading font-bold text-lg mb-6 text-anushtan-gold">Quick Links</h4>
                    <ul className="space-y-3 text-sm">
                        <li><Link href="/about" className="text-anushtan-parchment/70 hover:text-anushtan-gold transition-colors">About</Link></li>
                        <li><Link href="/academics" className="text-anushtan-parchment/70 hover:text-anushtan-gold transition-colors">Academics</Link></li>
                        <li><Link href="/student-life" className="text-anushtan-parchment/70 hover:text-anushtan-gold transition-colors">Student Life</Link></li>
                        <li><Link href="/teachers-community" className="text-anushtan-parchment/70 hover:text-anushtan-gold transition-colors">Teachers & Community</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-heading font-bold text-lg mb-6 text-anushtan-gold">Explore</h4>
                    <ul className="space-y-3 text-sm">
                        <li><Link href="/campus" className="text-anushtan-parchment/70 hover:text-anushtan-gold transition-colors">Campus</Link></li>
                        <li><Link href="/admissions" className="text-anushtan-parchment/70 hover:text-anushtan-gold transition-colors">Admissions</Link></li>

                    </ul>
                </div>

                <div>
                    <h4 className="font-heading font-bold text-lg mb-6 text-anushtan-gold">Visit Us</h4>
                    <address className="not-italic text-anushtan-parchment/70 space-y-2 text-sm">
                        <p>ANUSHTAN INDIC SCHOOL, Beside NINE EDUCATION</p>
                        <p>SIDDIPET</p>
                        <div className="mt-4">
                            <p>Contact: +91-9044454441, +91-9044454442</p>
                            <p>anushtanschool@gmail.com</p>
                        </div>
                    </address>
                </div>
            </div>
            <div className="container-custom pt-8 flex flex-col md:flex-row justify-between items-center text-anushtan-parchment/40 text-sm">
                <p>&copy; {new Date().getFullYear()} Anushtan Indic School. All rights reserved.</p>
                <div className="flex gap-6 mt-4 md:mt-0">
                    <span>Privacy Policy</span>
                    <span>Terms of Use</span>
                </div>
            </div>
        </footer>
    );
}
