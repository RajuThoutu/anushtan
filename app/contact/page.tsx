import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { PageHeader } from "@/components/sections/PageHeader";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contact | Anushtan Indic School',
    description: 'Get in touch for admissions, visits, and inquiries.',
};

export default function Contact() {
    return (
        <>
            <Navbar />
            <PageHeader
                title="Contact Us"
                subtitle="Get in touch for admissions, visits, and inquiries."
            />

            {/* Contact Details */}
            <section id="details" className="py-20 bg-transparent">
                <div className="container-custom max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="p-6">
                        <h3 className="font-heading text-xl font-bold mb-4 text-anushtan-maroon">Address</h3>
                        <p className="text-anushtan-charcoal/80">
                            Anushtan Indic School<br />
                            [Street Address Placeholder]<br />
                            [City, State, Zip]
                        </p>
                    </div>
                    <div className="p-6">
                        <h3 className="font-heading text-xl font-bold mb-4 text-anushtan-maroon">Phone</h3>
                        <p className="text-anushtan-charcoal/80">
                            +91 000 000 0000<br />
                            +91 000 000 0000
                        </p>
                    </div>
                    <div className="p-6">
                        <h3 className="font-heading text-xl font-bold mb-4 text-anushtan-maroon">Email</h3>
                        <p className="text-anushtan-charcoal/80">
                            admissions@anushtanschool.edu<br />
                            info@anushtanschool.edu
                        </p>
                    </div>
                </div>
            </section>

            {/* Schedule a Visit Form */}
            <section id="visit" className="py-20 bg-transparent">
                <div className="container-custom max-w-2xl mx-auto">
                    <SectionHeader title="Schedule a Visit" />
                    <div className="bg-anushtan-ivory p-8 rounded-lg border border-anushtan-border text-center text-anushtan-charcoal/50 py-16">
                        {"{{FORM:VISIT_REQUEST}}"}
                    </div>
                </div>
            </section>

            {/* Map */}
            <section id="map" className="py-20 bg-transparent">
                <div className="container-custom">
                    <SectionHeader title="Location" />
                    <div className="h-96 bg-white rounded-lg flex items-center justify-center text-anushtan-charcoal/30 border border-anushtan-border">
                        {"{{MAP:EMBED}}"}
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}
