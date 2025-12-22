import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function StudentLife() {
    return (
        <>
            <Navbar />
            <Hero
                title="Student Life"
                subtitle="Daily rhythm, sports, yoga, culture, and experiential learning at Anushtan."
                background="bg-accent"
            />

            {/* Daily Life at Anushtan */}
            <section id="daily" className="py-20 bg-surface">
                <div className="container-custom max-w-4xl mx-auto">
                    <SectionHeader title="Daily Life at Anushtan" />
                    <p className="text-lg text-text/80 leading-relaxed">
                        The school day follows a balanced rhythm integrating focused learning, movement, cultural routines, and reflection.
                    </p>
                </div>
            </section>

            {/* Physical Education & Sports */}
            <section id="sports" className="py-20 bg-background">
                <div className="container-custom max-w-4xl mx-auto">
                    <SectionHeader title="Physical Education & Sports" />
                    <p className="text-lg text-text/80 leading-relaxed">
                        Daily physical activity supports strength, confidence, and mental clarity.
                    </p>
                </div>
            </section>

            {/* Cultural & Experiential Learning */}
            <section id="culture" className="py-20 bg-surface">
                <div className="container-custom max-w-4xl mx-auto">
                    <SectionHeader title="Cultural & Experiential Learning" />
                    <p className="text-lg text-text/80 leading-relaxed">
                        Culture and real-world exposure are integrated into weekly routines to cultivate identity, responsibility, and practical understanding.
                    </p>
                </div>
            </section>

            <Footer />
        </>
    );
}
