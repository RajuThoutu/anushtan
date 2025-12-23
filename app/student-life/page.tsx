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
                subtitle="Student life at Anushtan is designed to be balanced, purposeful, and developmentally appropriate."
                background="bg-anushtan-gold"
            />

            {/* Life at Anushtan */}
            <section className="py-16 bg-transparent">
                <div className="container-custom max-w-4xl mx-auto">
                    <SectionHeader title="Life at Anushtan" />
                    <div className="text-lg text-anushtan-charcoal/80 leading-relaxed space-y-6">
                        <p>
                            Student life at Anushtan is designed to be balanced, purposeful, and developmentally appropriate.
                        </p>
                        <p>
                            The school day integrates learning, activity, reflection, and community interaction in a way that supports intellectual growth alongside emotional stability, physical health, and ethical awareness.
                        </p>
                    </div>
                </div>
            </section>

            {/* Daily Rhythm */}
            <section className="py-16 bg-transparent">
                <div className="container-custom max-w-4xl mx-auto">
                    <SectionHeader title="Daily Rhythm" />
                    <div className="text-lg text-anushtan-charcoal/80 leading-relaxed space-y-6">
                        <p>
                            The daily rhythm at Anushtan provides structure and predictability while allowing space for curiosity, creativity, and rest.
                        </p>
                        <p>
                            Students experience a steady flow between focused academic engagement, physical movement, creative expression, social interaction, and quiet reflection.
                        </p>
                    </div>
                </div>
            </section>

            {/* Physical Activity & Health */}
            <section className="py-16 bg-transparent">
                <div className="container-custom max-w-4xl mx-auto">
                    <SectionHeader title="Physical Activity & Health" />
                    <div className="text-lg text-anushtan-charcoal/80 leading-relaxed space-y-6">
                        <p>
                            Physical activity is an integral part of student life, supporting vitality, coordination, resilience, and emotional regulation.
                        </p>
                        <p>
                            Students participate in regular movement, games, and physical practices appropriate to their age and developmental stage.
                        </p>
                    </div>
                </div>
            </section>

            {/* Arts, Expression & Creativity */}
            <section className="py-16 bg-transparent">
                <div className="container-custom max-w-4xl mx-auto">
                    <SectionHeader title="Arts, Expression & Creativity" />
                    <div className="text-lg text-anushtan-charcoal/80 leading-relaxed space-y-6">
                        <p>
                            Creative expression through music, visual arts, storytelling, and other forms is encouraged as a way for students to explore imagination, emotion, and communication.
                        </p>
                        <p>
                            Artistic activities support cognitive flexibility, emotional articulation, and aesthetic sensitivity.
                        </p>
                    </div>
                </div>
            </section>

            {/* Community Life & Responsibility */}
            <section className="py-16 bg-transparent">
                <div className="container-custom max-w-4xl mx-auto">
                    <SectionHeader title="Community Life & Responsibility" />
                    <div className="text-lg text-anushtan-charcoal/80 leading-relaxed space-y-6">
                        <p>
                            Students participate in a shared community life where cooperation, respect, responsibility, and care for the environment are cultivated.
                        </p>
                        <p>
                            Community practices help students develop social awareness, empathy, and a sense of contribution beyond the self.
                        </p>
                    </div>
                </div>
            </section>

            {/* Reflection & Inner Discipline */}
            <section className="py-16 bg-transparent">
                <div className="container-custom max-w-4xl mx-auto">
                    <SectionHeader title="Reflection & Inner Discipline" />
                    <div className="text-lg text-anushtan-charcoal/80 leading-relaxed space-y-6">
                        <p>
                            Quiet reflection, attention practices, and contemplative activities are part of student life to support emotional regulation, self-awareness, and inner stability.
                        </p>
                        <p>
                            These practices help students develop focus, calmness, and the capacity to observe their own thoughts and emotions.
                        </p>
                    </div>
                </div>
            </section>

            {/* Student Well-being */}
            <section className="py-16 bg-transparent">
                <div className="container-custom max-w-4xl mx-auto">
                    <SectionHeader title="Student Well-being" />
                    <div className="text-lg text-anushtan-charcoal/80 leading-relaxed space-y-6">
                        <p>
                            Student well-being is approached holistically, recognizing the interconnection of physical health, emotional balance, social belonging, and intellectual engagement.
                        </p>
                        <p>
                            The school environment is designed to be safe, respectful, and supportive of healthy development.
                        </p>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}
