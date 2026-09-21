import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin, Phone } from "lucide-react";

const instagramUrl = "https://www.instagram.com/anushtan_indicschool_siddipet/";

export function Footer() {
    return (
        <footer id="footer" className="relative overflow-hidden bg-[#211a18] text-anushtan-parchment">
            <div className="h-px bg-gradient-to-r from-transparent via-anushtan-gold to-transparent" />
            <div className="pointer-events-none absolute -right-10 top-16 select-none font-heading text-[14rem] font-bold leading-none text-white/[0.025]">अनुष्ठान</div>

            <div className="container-custom relative py-16 md:py-20">
                <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
                    <div className="lg:col-span-4">
                        <Link href="/" className="inline-flex items-center gap-3">
                            <div className="relative h-12 w-12 overflow-hidden rounded-full border border-anushtan-parchment/20 bg-white/5">
                                <Image src="/logo.jpg" alt="Anushtan Logo" fill className="object-cover" sizes="48px" />
                            </div>
                            <span className="font-heading text-2xl font-bold tracking-tight">Anushtan</span>
                        </Link>
                        <p className="mt-6 max-w-sm text-base leading-relaxed text-anushtan-parchment/65">
                            A school where academics, activity, culture, nature, and care come together in a fuller school day.
                        </p>
                        <p className="mt-8 font-heading text-xl italic leading-relaxed text-anushtan-gold/90">
                            &ldquo;We do not manufacture students. We kindle Swadharma.&rdquo;
                        </p>
                    </div>

                    <div className="grid gap-10 sm:grid-cols-2 lg:col-span-4">
                        <FooterLinks
                            title="Explore"
                            links={[
                                ["About", "/about"],
                                ["Academics", "/academics"],
                                ["Food & Wellness", "/food-wellness"],
                                ["Campus", "/campus"],
                                ["Mandatory Public Disclosure", "/mandatory-public-disclosure"],
                            ]}
                        />
                        <div>
                            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-anushtan-gold">Visit us</h2>
                            <address className="mt-5 not-italic space-y-4 text-sm leading-relaxed text-anushtan-parchment/65">
                                <p className="flex gap-3"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-anushtan-gold" />Beside SUDA Office, Siddipet</p>
                                <p className="flex gap-3"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-anushtan-gold" /><span>+91 9044 454 441<br />+91 9044 454 442</span></p>
                                <a href="mailto:anushtanschool@gmail.com" className="block whitespace-nowrap text-xs tracking-tight transition-colors hover:text-anushtan-gold">anushtanschool@gmail.com</a>
                            </address>
                        </div>
                    </div>

                    <a
                        href={instagramUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="group relative overflow-hidden rounded-2xl border border-anushtan-gold/30 bg-[#382720] p-7 transition-all hover:-translate-y-1 hover:border-anushtan-gold/70 hover:bg-[#433027] lg:col-span-4"
                    >
                        <div className="absolute right-5 top-5 text-anushtan-gold/70 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"><ArrowUpRight className="h-6 w-6" /></div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-anushtan-gold text-[#382720]">
                            <InstagramMark className="h-6 w-6" />
                        </div>
                        <p className="mt-7 text-xs font-bold uppercase tracking-[0.2em] text-anushtan-gold">Follow the school day</p>
                        <h2 className="mt-3 font-heading text-2xl font-bold leading-tight">Anushtan on Instagram</h2>
                        <p className="mt-4 text-sm leading-relaxed text-anushtan-parchment/65">Activities, celebrations, classroom moments, sport, culture, and the everyday stories behind school life.</p>
                        <p className="mt-6 font-semibold text-anushtan-gold">@anushtan_indicschool_siddipet</p>
                    </a>
                </div>

                <div className="mt-16 flex flex-col gap-5 border-t border-white/10 pt-7 text-sm text-anushtan-parchment/45 md:flex-row md:items-center md:justify-between">
                    <p>&copy; {new Date().getFullYear()} Anushtan Indic School. All rights reserved.</p>
                    <div className="flex flex-wrap gap-x-6 gap-y-3">
                        <Link href="/admissions" className="transition-colors hover:text-anushtan-gold">Admissions</Link>
                        <Link href="/privacy" className="transition-colors hover:text-anushtan-gold">Privacy Policy</Link>
                        <Link href="/terms" className="transition-colors hover:text-anushtan-gold">Terms of Use</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function FooterLinks({ title, links }: { title: string; links: [string, string][] }) {
    return (
        <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-anushtan-gold">{title}</h2>
            <ul className="mt-5 space-y-3 text-sm">
                {links.map(([label, href]) => (
                    <li key={href}>
                        <Link href={href} className="text-anushtan-parchment/65 transition-colors hover:text-anushtan-gold">{label}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function InstagramMark({ className }: { className?: string }) {
    return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
        </svg>
    );
}
