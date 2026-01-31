import { PageHeader } from "@/components/sections/PageHeader";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";
import { AdmissionsForm } from "@/components/sections/AdmissionsForm";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Admissions | Anushtan Indic School',
    description: 'Admission process, eligibility, and fee structure details.',
};

export default function Admissions() {
    return (
        <>
            <Navbar />
            <PageHeader
                title="Admissions"
                subtitle="Join the founding cohort of Anushtan. Begin your journey towards ancient wisdom and modern excellence."
            />

            {/* Schedule a Visit Form - NOW AT TOP */}
            <section id="visit" className="py-20 bg-gradient-to-b from-anushtan-parchment to-white">
                <div className="container-custom max-w-3xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="font-heading text-4xl md:text-5xl font-bold text-anushtan-charcoal mb-4">
                            Schedule a Campus Visit
                        </h2>
                        <p className="text-lg text-anushtan-charcoal/70 max-w-2xl mx-auto">
                            Experience Anushtan firsthand. Fill out the form below and our admissions team will contact you to arrange your personalized campus tour.
                        </p>
                    </div>
                    <div className="bg-white p-8 md:p-10 rounded-2xl border border-anushtan-border shadow-lg">
                        <AdmissionsForm />
                    </div>
                </div>
            </section>

            {/* Admission Process */}
            <section id="process" className="py-20 bg-white">
                <div className="container-custom max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <SectionHeader title="Admission Process" />
                        <p className="text-anushtan-charcoal/70 mt-4 text-lg">
                            A simple, transparent journey to joining Anushtan
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="relative p-6 bg-gradient-to-br from-anushtan-parchment to-white rounded-xl border border-anushtan-border shadow-md hover:shadow-xl transition-shadow group">
                            <div className="absolute top-4 left-4 w-12 h-12 bg-anushtan-terracotta rounded-full flex items-center justify-center text-white font-heading font-bold text-xl shadow-md">
                                1
                            </div>
                            <div className="ml-16">
                                <h3 className="font-heading text-xl font-bold text-anushtan-charcoal mb-2">Submit Inquiry</h3>
                                <p className="text-anushtan-charcoal/70">
                                    Fill out the form above to express your interest and schedule a campus visit.
                                </p>
                            </div>
                        </div>

                        <div className="relative p-6 bg-gradient-to-br from-anushtan-parchment to-white rounded-xl border border-anushtan-border shadow-md hover:shadow-xl transition-shadow group">
                            <div className="absolute top-4 left-4 w-12 h-12 bg-anushtan-terracotta rounded-full flex items-center justify-center text-white font-heading font-bold text-xl shadow-md">
                                2
                            </div>
                            <div className="ml-16">
                                <h3 className="font-heading text-xl font-bold text-anushtan-charcoal mb-2">Campus Visit</h3>
                                <p className="text-anushtan-charcoal/70">
                                    Tour our facilities, meet our educators, and experience the Anushtan environment.
                                </p>
                            </div>
                        </div>

                        <div className="relative p-6 bg-gradient-to-br from-anushtan-parchment to-white rounded-xl border border-anushtan-border shadow-md hover:shadow-xl transition-shadow group">
                            <div className="absolute top-4 left-4 w-12 h-12 bg-anushtan-terracotta rounded-full flex items-center justify-center text-white font-heading font-bold text-xl shadow-md">
                                3
                            </div>
                            <div className="ml-16">
                                <h3 className="font-heading text-xl font-bold text-anushtan-charcoal mb-2">Interaction & Assessment</h3>
                                <p className="text-anushtan-charcoal/70">
                                    Informal interaction with faculty and age-appropriate assessment (as applicable).
                                </p>
                            </div>
                        </div>

                        <div className="relative p-6 bg-gradient-to-br from-anushtan-parchment to-white rounded-xl border border-anushtan-border shadow-md hover:shadow-xl transition-shadow group">
                            <div className="absolute top-4 left-4 w-12 h-12 bg-anushtan-terracotta rounded-full flex items-center justify-center text-white font-heading font-bold text-xl shadow-md">
                                4
                            </div>
                            <div className="ml-16">
                                <h3 className="font-heading text-xl font-bold text-anushtan-charcoal mb-2">Confirmation & Enrollment</h3>
                                <p className="text-anushtan-charcoal/70">
                                    Receive your admission decision and complete enrollment formalities.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map */}
            <section id="map" className="py-20 bg-gradient-to-b from-white to-anushtan-parchment">
                <div className="container-custom">
                    <div className="text-center mb-12">
                        <SectionHeader title="Visit Our Campus" />
                        <p className="text-anushtan-charcoal/70 mt-4 text-lg">
                            ANUSHTAN INDIC SCHOOL, Beside NINE EDUCATION, SIDDIPET
                        </p>
                    </div>
                    <div className="w-full h-[500px] bg-gray-100 rounded-2xl overflow-hidden border border-anushtan-border shadow-xl relative">
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
                        <div className="absolute bottom-6 right-6">
                            <a
                                href="https://maps.app.goo.gl/oCNEMU2XM3eY7Ewn6"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-anushtan-terracotta h-12 px-6 bg-white text-anushtan-terracotta hover:bg-anushtan-terracotta hover:text-white border-2 border-anushtan-terracotta shadow-lg text-base font-bold"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                    <circle cx="12" cy="10" r="3"></circle>
                                </svg>
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
