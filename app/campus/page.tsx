import { Hero } from "@/components/sections/Hero";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Card } from "@/components/ui/Card";

export default function Campus() {
    return (
        <>
            <Navbar />
            <Hero
                title="Campus"
                subtitle="Campus environment, facilities, and learning spaces at Anushtan."
                background="bg-secondary"
            />

            {/* Campus as a Silent Teacher */}
            <section id="environment" className="py-20 bg-surface">
                <div className="container-custom max-w-4xl mx-auto">
                    <SectionHeader title="Campus as a Silent Teacher" />
                    <p className="text-lg text-text/80 leading-relaxed mb-8">
                        The campus functions as a silent teacher—supporting focus, movement, cleanliness, order, and balance.
                    </p>
                </div>
            </section>

            {/* Facilities */}
            <section id="facilities" className="py-20 bg-background">
                <div className="container-custom">
                    <SectionHeader title="Facilities" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card>
                            <h3 className="font-heading text-xl font-bold mb-2">Classrooms</h3>
                            <p className="text-text/70">Calm, functional learning spaces.</p>
                        </Card>
                        <Card>
                            <h3 className="font-heading text-xl font-bold mb-2">Sports Grounds</h3>
                            <p className="text-text/70">Daily training and outdoor activity areas.</p>
                        </Card>
                        <Card>
                            <h3 className="font-heading text-xl font-bold mb-2">Activity Spaces</h3>
                            <p className="text-text/70">Cultural and experiential learning zones.</p>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Gallery */}
            <section id="gallery" className="py-20 bg-surface">
                <div className="container-custom">
                    <SectionHeader title="Gallery" />
                    <div className="h-96 bg-background border border-text/10 rounded-lg flex items-center justify-center text-text/30">
                        {{ GALLERY: CAMPUS }}
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}
