import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { PageHeader } from "@/components/sections/PageHeader";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy | Anushtan Indic School",
    description: "How Anushtan Indic School uses information submitted through its website.",
};

export default function PrivacyPage() {
    return (
        <>
            <Navbar />
            <PageHeader title="Privacy Policy" subtitle="How we use information submitted through this website." />
            <main className="bg-anushtan-parchment py-16">
                <article className="container-custom max-w-3xl mx-auto rounded-2xl border border-anushtan-border bg-white p-8 md:p-12 shadow-sm text-anushtan-charcoal/80 leading-relaxed space-y-8">
                    <section>
                        <h2 className="font-heading text-2xl font-bold text-anushtan-charcoal mb-3">Information we collect</h2>
                        <p>When you submit an admissions enquiry, we collect the student&apos;s name, parent or guardian name, contact details, grade of interest, and any information you choose to include in your message.</p>
                    </section>
                    <section>
                        <h2 className="font-heading text-2xl font-bold text-anushtan-charcoal mb-3">How we use it</h2>
                        <p>We use this information to respond to your enquiry, arrange a campus visit, discuss admissions, and manage follow-up communication from the school.</p>
                    </section>
                    <section>
                        <h2 className="font-heading text-2xl font-bold text-anushtan-charcoal mb-3">Sharing and protection</h2>
                        <p>We share enquiry information only with the school team and service providers that help us operate admissions communications. Please do not submit sensitive medical, financial, or identity information through the enquiry form.</p>
                    </section>
                    <section>
                        <h2 className="font-heading text-2xl font-bold text-anushtan-charcoal mb-3">Contact us</h2>
                        <p>To ask about information submitted through this website, contact Anushtan Indic School at <a className="text-anushtan-terracotta underline underline-offset-4" href="mailto:anushtanschool@gmail.com">anushtanschool@gmail.com</a> or +91 90444 54441.</p>
                    </section>
                </article>
            </main>
            <Footer />
        </>
    );
}
