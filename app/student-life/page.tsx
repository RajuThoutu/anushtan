import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Student Life | Anushtan Indic School',
    description: 'Daily rhythm, sports, yoga, culture, and experiential learning at Anushtan.',
};

export default function StudentLife() {
    return (
        <>
            <Navbar />
            <Hero
                title="Student Life"
                subtitle="Daily rhythm, sports, yoga, culture, and experiential learning at Anushtan."
                background="bg-anushtan-gold"
            />

            {/* Daily Life at Anushtan */}
            <section id="daily" className="py-20 bg-anushtan-ivory">
                <div className="container-custom max-w-4xl mx-auto">
                    <SectionHeader title="The Daily Rhythm" />
                    <p className="text-lg text-anushtan-charcoal/80 leading-relaxed">
                        The school day follows a balanced rhythm (`Dinacharya`) integrating focused learning, physical movement (`Vyayama`), cultural routines, and reflection.
                    </p>
                </div>
            </section>

            {/* Physical Education & Sports */}
            <section id="sports" className="py-20 bg-white">
                <div className="container-custom max-w-4xl mx-auto">
                    <SectionHeader title="Physical Education & Sports" />
                    <p className="text-lg text-anushtan-charcoal/80 leading-relaxed">
                        Daily physical activity is mandatory to support strength, confidence, and mental clarity. This includes team sports, traditional Indian games, and yoga.
                    </p>
                </div>
            </section>

            {/* Cultural & Experiential Learning */}
            <section id="culture" className="py-20 bg-anushtan-ivory">
                <div className="container-custom max-w-4xl mx-auto">
                    <SectionHeader title="Cultural & Experiential Learning" />
                    <p className="text-lg text-anushtan-charcoal/80 leading-relaxed mb-6">
                        Culture and real-world exposure are integrated into weekly routines. Students engage in arts, music, and community service to cultivate identity and responsibility.
                    </p>
                    <div className="h-64 bg-white border border-anushtan-border rounded flex items-center justify-center text-anushtan-charcoal/30">
                        {"{{GALLERY:STUDENT_LIFE}}"}
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}
