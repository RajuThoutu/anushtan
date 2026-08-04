import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { PageHeader } from "@/components/sections/PageHeader";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms of Use | Anushtan Indic School",
    description: "Terms for using the Anushtan Indic School website.",
};

export default function TermsPage() {
    return (
        <>
            <Navbar />
            <PageHeader title="Terms of Use" subtitle="Guidance for using the Anushtan Indic School website." />
            <main className="bg-anushtan-parchment py-16">
                <article className="container-custom max-w-3xl mx-auto rounded-2xl border border-anushtan-border bg-white p-8 md:p-12 shadow-sm text-anushtan-charcoal/80 leading-relaxed space-y-8">
                    <section>
                        <h2 className="font-heading text-2xl font-bold text-anushtan-charcoal mb-3">Website information</h2>
                        <p>We aim to keep this website accurate and useful. Programme details, availability, events, and admissions processes may change, so please confirm current information with the admissions team before making a decision.</p>
                    </section>
                    <section>
                        <h2 className="font-heading text-2xl font-bold text-anushtan-charcoal mb-3">Admissions enquiries</h2>
                        <p>Submitting an enquiry or scheduling a campus visit does not guarantee admission. Admissions decisions and enrolment are subject to the school&apos;s applicable process and requirements.</p>
                    </section>
                    <section>
                        <h2 className="font-heading text-2xl font-bold text-anushtan-charcoal mb-3">Website content</h2>
                        <p>All website content, including text, photographs, design, and brand assets, belongs to Anushtan Indic School or its respective owners. Please do not reproduce or use it without permission.</p>
                    </section>
                    <section>
                        <h2 className="font-heading text-2xl font-bold text-anushtan-charcoal mb-3">Contact us</h2>
                        <p>For questions about the website or admissions, contact <a className="text-anushtan-terracotta underline underline-offset-4" href="mailto:anushtanschool@gmail.com">anushtanschool@gmail.com</a>.</p>
                    </section>
                </article>
            </main>
            <Footer />
        </>
    );
}
