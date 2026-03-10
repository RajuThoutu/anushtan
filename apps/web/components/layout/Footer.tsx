import Link from "next/link";
import Image from "next/image";

export function Footer() {
    return (
        <footer
            className="relative overflow-hidden text-anushtan-parchment"
            style={{ background: "linear-gradient(135deg, #3D1A14 0%, #1A1A1A 100%)" }}
        >
            {/* Gold top border gradient */}
            <div
                style={{
                    background: "linear-gradient(90deg, transparent 0%, #C5A059 50%, transparent 100%)",
                    height: "1px",
                }}
            />

            {/* Devanagari watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
                <span
                    className="font-heading font-bold text-anushtan-parchment leading-none"
                    style={{ fontSize: "clamp(120px, 18vw, 220px)", opacity: 0.035 }}
                >
                    अनुष्ठान
                </span>
            </div>

            {/* Philosophy pull-quote */}
            <div className="relative z-10 text-center py-10 px-4 border-b border-anushtan-parchment/10">
                <p className="font-heading italic text-xl md:text-2xl text-anushtan-parchment/75 max-w-2xl mx-auto leading-relaxed">
                    "We do not manufacture students. We kindle Swadharma."
                </p>
            </div>

            {/* Main footer grid */}
            <div className="container-custom relative z-10 grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-anushtan-parchment/10 py-12">
                {/* Brand column */}
                <div className="col-span-1">
                    <Link href="/" className="flex items-center gap-3 mb-6">
                        <div className="relative h-8 w-8 overflow-hidden rounded-full border border-anushtan-parchment/20">
                            <Image src="/logo.jpg" alt="Anushtan Logo" fill className="object-cover" sizes="32px" />
                        </div>
                        <span className="font-heading text-xl font-bold text-anushtan-parchment">Anushtan</span>
                    </Link>
                    <p className="text-anushtan-parchment/60 mb-6 text-sm leading-relaxed">
                        An institutional approach to education integrating academics, physical vitality, cultural grounding, and inner discipline.
                    </p>
                    <div className="flex gap-3">
                        {/* Facebook */}
                        <a href="#" aria-label="Facebook" className="w-9 h-9 rounded-full bg-anushtan-parchment/10 hover:bg-anushtan-gold/20 flex items-center justify-center transition-colors">
                            <svg className="w-4 h-4 text-anushtan-parchment/70" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                            </svg>
                        </a>
                        {/* Instagram */}
                        <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-full bg-anushtan-parchment/10 hover:bg-anushtan-gold/20 flex items-center justify-center transition-colors">
                            <svg className="w-4 h-4 text-anushtan-parchment/70" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                            </svg>
                        </a>
                        {/* YouTube */}
                        <a href="#" aria-label="YouTube" className="w-9 h-9 rounded-full bg-anushtan-parchment/10 hover:bg-anushtan-gold/20 flex items-center justify-center transition-colors">
                            <svg className="w-4 h-4 text-anushtan-parchment/70" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 01-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 01-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 011.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418zM15.194 12L10 15V9l5.194 3z" clipRule="evenodd" />
                            </svg>
                        </a>
                    </div>
                </div>

                <div>
                    <h4 className="font-heading font-bold text-lg mb-6 text-anushtan-gold">Quick Links</h4>
                    <ul className="space-y-3 text-sm">
                        <li><Link href="/about" className="text-anushtan-parchment/60 hover:text-anushtan-gold transition-colors">About</Link></li>
                        <li><Link href="/academics" className="text-anushtan-parchment/60 hover:text-anushtan-gold transition-colors">Academics</Link></li>
                        <li><Link href="/student-life" className="text-anushtan-parchment/60 hover:text-anushtan-gold transition-colors">Student Life</Link></li>
                        <li><Link href="/teachers-community" className="text-anushtan-parchment/60 hover:text-anushtan-gold transition-colors">Teachers & Community</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-heading font-bold text-lg mb-6 text-anushtan-gold">Explore</h4>
                    <ul className="space-y-3 text-sm">
                        <li><Link href="/campus" className="text-anushtan-parchment/60 hover:text-anushtan-gold transition-colors">Campus</Link></li>
                        <li><Link href="/admissions" className="text-anushtan-parchment/60 hover:text-anushtan-gold transition-colors">Admissions</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-heading font-bold text-lg mb-6 text-anushtan-gold">Visit Us</h4>
                    <address className="not-italic text-anushtan-parchment/60 space-y-2 text-sm">
                        <p>ANUSHTAN INDIC SCHOOL, Beside NINE EDUCATION</p>
                        <p>SIDDIPET</p>
                        <div className="mt-4">
                            <p>Contact: +91-9044454441, +91-9044454442</p>
                            <p>anushtanschool@gmail.com</p>
                        </div>
                    </address>
                </div>
            </div>

            {/* Bottom strip */}
            <div className="container-custom relative z-10 pt-6 pb-8 flex flex-col md:flex-row justify-between items-center text-anushtan-parchment/30 text-sm">
                <p>&copy; {new Date().getFullYear()} Anushtan Indic School. All rights reserved.</p>
                <div className="flex gap-6 mt-4 md:mt-0">
                    <span>Privacy Policy</span>
                    <span>Terms of Use</span>
                </div>
            </div>
        </footer>
    );
}
