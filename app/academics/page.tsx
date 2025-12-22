import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Academics | Anushtan Indic School',
    description: 'Curriculum framework, learning domains, grade progression, and assessment approach.',
};

export default function Academics() {
    return (
        <>
            <Navbar />
            <Hero
                title="Academics"
                subtitle="Curriculum framework, learning domains, grade progression, and assessment approach."
                background="bg-anushtan-maroon"
            />

            {/* Learning Domains */}
            <section className="py-20 bg-anushtan-ivory">
                <div className="container-custom">
                    <SectionHeader title="Learning Domains" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Card className="border-anushtan-border">
                            <h3 className="font-heading text-xl font-bold mb-2 text-anushtan-maroon">Academic Foundations</h3>
                            <p className="text-anushtan-charcoal/70">Mathematics, sciences, languages, and analytical thinking.</p>
                        </Card>
                        <Card className="border-anushtan-border">
                            <h3 className="font-heading text-xl font-bold mb-2 text-anushtan-maroon">Physical Education</h3>
                            <p className="text-anushtan-charcoal/70">Daily sports, yoga, fitness, stamina, and teamwork.</p>
                        </Card>
                        <Card className="border-anushtan-border">
                            <h3 className="font-heading text-xl font-bold mb-2 text-anushtan-maroon">Cultural Learning</h3>
                            <p className="text-anushtan-charcoal/70">Values, heritage, and tradition integrated into daily life.</p>
                        </Card>
                        <Card className="border-anushtan-border">
                            <h3 className="font-heading text-xl font-bold mb-2 text-anushtan-maroon">Experiential Learning</h3>
                            <p className="text-anushtan-charcoal/70">Nature, agriculture, community exposure, and projects.</p>
                        </Card>
                        <Card className="border-anushtan-border">
                            <h3 className="font-heading text-xl font-bold mb-2 text-anushtan-maroon">Inner Discipline</h3>
                            <p className="text-anushtan-charcoal/70">Mindfulness, reflection, routines, and self-regulation.</p>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Grade-Wise Weightage */}
            <section className="py-20 bg-white">
                <div className="container-custom">
                    <SectionHeader title="Curriculum Emphasis" />
                    <div className="overflow-x-auto bg-white rounded-lg border border-anushtan-border">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-anushtan-ivory border-b border-anushtan-border">
                                    <th className="p-4 font-heading font-bold text-anushtan-maroon">Grade Band</th>
                                    <th className="p-4 font-heading font-bold text-anushtan-maroon">Academics</th>
                                    <th className="p-4 font-heading font-bold text-anushtan-maroon">Physical</th>
                                    <th className="p-4 font-heading font-bold text-anushtan-maroon">Cultural</th>
                                    <th className="p-4 font-heading font-bold text-anushtan-maroon">Experiential</th>
                                    <th className="p-4 font-heading font-bold text-anushtan-maroon">Inner Discipline</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-anushtan-border hover:bg-anushtan-ivory/50">
                                    <td className="p-4 font-medium text-anushtan-charcoal">Primary (1–5)</td>
                                    <td className="p-4 text-anushtan-charcoal/80">35%</td>
                                    <td className="p-4 text-anushtan-charcoal/80">25%</td>
                                    <td className="p-4 text-anushtan-charcoal/80">20%</td>
                                    <td className="p-4 text-anushtan-charcoal/80">10%</td>
                                    <td className="p-4 text-anushtan-charcoal/80">10%</td>
                                </tr>
                                <tr className="border-b border-anushtan-border hover:bg-anushtan-ivory/50">
                                    <td className="p-4 font-medium text-anushtan-charcoal">Middle (6–8)</td>
                                    <td className="p-4 text-anushtan-charcoal/80">45%</td>
                                    <td className="p-4 text-anushtan-charcoal/80">20%</td>
                                    <td className="p-4 text-anushtan-charcoal/80">15%</td>
                                    <td className="p-4 text-anushtan-charcoal/80">10%</td>
                                    <td className="p-4 text-anushtan-charcoal/80">10%</td>
                                </tr>
                                <tr className="hover:bg-anushtan-ivory/50">
                                    <td className="p-4 font-medium text-anushtan-charcoal">Secondary (9–12)</td>
                                    <td className="p-4 text-anushtan-charcoal/80">55%</td>
                                    <td className="p-4 text-anushtan-charcoal/80">15%</td>
                                    <td className="p-4 text-anushtan-charcoal/80">10%</td>
                                    <td className="p-4 text-anushtan-charcoal/80">10%</td>
                                    <td className="p-4 text-anushtan-charcoal/80">10%</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Assessment & Evaluation */}
            <section className="py-20 bg-anushtan-ivory">
                <div className="container-custom max-w-4xl mx-auto">
                    <SectionHeader title="Assessment & Evaluation" />
                    <p className="text-lg text-anushtan-charcoal/80 leading-relaxed">
                        Assessment supports growth through conceptual understanding, continuous observation, constructive feedback, and structured exams without fear-based pressure.
                    </p>
                </div>
            </section>

            <Footer />
        </>
    );
}
