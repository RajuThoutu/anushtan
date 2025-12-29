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
                            ANUSHTAN INDIC SCHOOL, Beside NINE EDUCATION<br />
                            SIDDIPET
                        </p>
                    </div>
                    <div className="p-6">
                        <h3 className="font-heading text-xl font-bold mb-4 text-anushtan-maroon">Phone</h3>
                        <p className="text-anushtan-charcoal/80">
                            +91-91103 93271
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
                    <div className="w-full h-96 bg-gray-100 rounded-lg overflow-hidden border border-anushtan-border shadow-md relative">
                        <iframe
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            style={{ border: 0 }}
                            src="https://maps.google.com/maps?q=Anushtan%20Indic%20School%2C%20Siddipet&t=&z=15&ie=UTF8&iwloc=&output=embed"
                            allowFullScreen
                            loading="lazy"
                            title="Anushtan Indic School Location"
                        ></iframe>
                        <div className="absolute bottom-4 right-4">
                            <a
                                href="https://maps.app.goo.gl/oCNEMU2XM3eY7Ewn6"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary h-10 px-4 py-2 bg-white text-anushtan-maroon hover:bg-gray-50 border border-anushtan-border shadow-lg text-sm"
                            >
                                Open in Google Maps
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}
