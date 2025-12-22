import { Hero } from "@/components/sections/Hero";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";

export default function Contact() {
    return (
        <>
            <Navbar />
            <Hero
                title="Contact"
                subtitle="Contact details and visit scheduling."
                background="bg-primary"
            />

            {/* Contact Details */}
            <section id="details" className="py-20 bg-surface">
                <div className="container-custom max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="p-6">
                        <h3 className="font-heading text-xl font-bold mb-4 text-primary">Address</h3>
                        <p className="text-text/80">
                            Anushtan Indic School<br />
                            [Street Address Placeholder]<br />
                            [City, State, Zip]
                        </p>
                    </div>
                    <div className="p-6">
                        <h3 className="font-heading text-xl font-bold mb-4 text-primary">Phone</h3>
                        <p className="text-text/80">
                            +91 000 000 0000<br />
                            +91 000 000 0000
                        </p>
                    </div>
                    <div className="p-6">
                        <h3 className="font-heading text-xl font-bold mb-4 text-primary">Email</h3>
                        <p className="text-text/80">
                            admissions@anushtan.in<br />
                            info@anushtan.in
                        </p>
                    </div>
                </div>
            </section>

            {/* Schedule a Visit Form */}
            <section id="visit" className="py-20 bg-background">
                <div className="container-custom max-w-2xl mx-auto">
                    <SectionHeader title="Schedule a Visit" />
                    <div className="bg-surface p-8 rounded-lg shadow-sm border border-primary/10 text-center text-text/50 py-16">
                        {{ FORM: VISIT_REQUEST }}
                    </div>
                </div>
            </section>

            {/* Map */}
            <section id="map" className="py-20 bg-surface">
                <div className="container-custom">
                    <SectionHeader title="Location" />
                    <div className="h-96 bg-background rounded-lg flex items-center justify-center text-text/30 border border-text/10">
                        MAP_EMBED_PLACEHOLDER
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}
