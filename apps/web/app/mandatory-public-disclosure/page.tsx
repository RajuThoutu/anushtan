import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { FileText } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Mandatory Public Disclosure | Anushtan Indic School",
    description: "Mandatory public disclosure documents for Anushtan Indic School.",
};

type Disclosure = {
    title: string;
    href?: string;
};

// Add the final PDF or external URL to each `href` as the documents are supplied.
const generalInformation: Disclosure[] = [
    { title: "Academic Calendar", href: "/disclosures/academic-calendar.pdf" },
    { title: "Fee Particulars", href: "/disclosures/fee-particulars.pdf" },
    { title: "Fire Certificate", href: "/disclosures/fire-certificate.pdf" },
    { title: "Sanitary Certificate" },
    { title: "Parents Teachers Association (PTA) Members", href: "/disclosures/pta-members.pdf" },
    { title: "School Management Committee (SMC)", href: "/disclosures/smc-members.pdf" },
    { title: "Society Certificate", href: "/disclosures/society-certificate.pdf" },
    { title: "Building Safety Certificate", href: "/disclosures/building-safety-certificate.pdf" },
    { title: "Architect Certificate", href: "/disclosures/architect-certificate.pdf" },
    { title: "Recognition Certificate" },
    { title: "Land Certificate" },
    { title: "Students Strength", href: "/disclosures/student-strength.pdf" },
];

export default function MandatoryPublicDisclosurePage() {
    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-anushtan-parchment">
                <section className="border-b border-anushtan-border bg-white/60 py-14 md:py-20">
                    <div className="container-custom">
                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-anushtan-terracotta">
                            Public information
                        </p>
                        <h1 className="mt-3 max-w-4xl font-heading text-4xl font-bold leading-tight text-anushtan-charcoal md:text-5xl">
                            Mandatory Public Disclosure
                        </h1>
                        <p className="mt-4 max-w-2xl text-base leading-relaxed text-anushtan-charcoal/70 md:text-lg">
                            Official school information and compliance documents available for public reference.
                        </p>
                    </div>
                </section>

                <section className="container-custom py-12 md:py-16">
                    <div className="mb-6 flex items-end justify-between gap-4">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-anushtan-gold">Section A</p>
                            <h2 className="mt-2 font-heading text-2xl font-bold text-anushtan-charcoal md:text-3xl">
                                General Information
                            </h2>
                        </div>
                        <p className="hidden text-sm text-anushtan-charcoal/55 sm:block">
                            {generalInformation.length} documents
                        </p>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-anushtan-border bg-white shadow-sm">
                        <div className="hidden grid-cols-[5rem_1fr_10rem] border-b border-anushtan-border bg-anushtan-terracotta px-6 py-4 text-xs font-bold uppercase tracking-[0.14em] text-white md:grid">
                            <span>S. No.</span>
                            <span>Information</span>
                            <span className="text-right">Details</span>
                        </div>

                        <ol className="divide-y divide-anushtan-border">
                            {generalInformation.map((item, index) => (
                                <li
                                    key={item.title}
                                    className="grid gap-4 px-5 py-5 transition-colors hover:bg-anushtan-terracotta/[0.035] md:grid-cols-[5rem_1fr_10rem] md:items-center md:px-6 md:py-4"
                                >
                                    <span className="text-sm font-semibold tabular-nums text-anushtan-charcoal/45">
                                        {String(index + 1).padStart(2, "0")}
                                    </span>
                                    <span className="flex items-center gap-3 font-medium text-anushtan-charcoal">
                                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-anushtan-terracotta/8 text-anushtan-terracotta">
                                            <FileText className="h-4 w-4" aria-hidden="true" />
                                        </span>
                                        {item.title}
                                    </span>
                                    {item.href ? (
                                        <a
                                            href={item.href}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-anushtan-terracotta px-4 text-sm font-bold text-anushtan-terracotta transition-colors hover:bg-anushtan-terracotta hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-anushtan-gold focus-visible:ring-offset-2 md:justify-self-end"
                                            aria-label={`View ${item.title}`}
                                        >
                                            View
                                        </a>
                                    ) : (
                                        <span
                                            className="inline-flex min-h-11 cursor-not-allowed items-center justify-center rounded-lg border border-anushtan-terracotta/35 px-4 text-sm font-bold text-anushtan-terracotta/50 md:justify-self-end"
                                            aria-disabled="true"
                                            title="Document will be available soon"
                                        >
                                            View
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ol>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
