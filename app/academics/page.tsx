import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";

export default function Academics() {
    return (
        <>
            <Navbar />
            <Hero
                title="Academics"
                subtitle="Curriculum framework, learning domains, grade progression, and assessment approach."
                background="bg-primary"
            />

            {/* Learning Domains */}
            <section className="py-20 bg-surface">
                <div className="container-custom">
                    <SectionHeader title="Learning Domains" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Card>
                            <h3 className="font-heading text-xl font-bold mb-2">Academic Foundations</h3>
                            <p className="text-text/70">Mathematics, sciences, languages, and analytical thinking.</p>
                        </Card>
                        <Card>
                            <h3 className="font-heading text-xl font-bold mb-2">Physical Education</h3>
                            <p className="text-text/70">Daily sports, yoga, fitness, stamina, teamwork.</p>
                        </Card>
                        <Card>
                            <h3 className="font-heading text-xl font-bold mb-2">Cultural Learning</h3>
                            <p className="text-text/70">Values, heritage, tradition integrated into daily life.</p>
                        </Card>
                        <Card>
                            <h3 className="font-heading text-xl font-bold mb-2">Experiential Learning</h3>
                            <p className="text-text/70">Nature, agriculture, community exposure, projects.</p>
                        </Card>
                        <Card>
                            <h3 className="font-heading text-xl font-bold mb-2">Inner Discipline</h3>
                            <p className="text-text/70">Mindfulness, reflection, routines, self-regulation.</p>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Grade-Wise Weightage */}
            <section className="py-20 bg-background">
                <div className="container-custom">
                    <SectionHeader title="Grade-Wise Weightage" />
                    <div className="overflow-x-auto bg-surface rounded-lg shadow-sm border border-border">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-primary/5 border-b border-border">
                                    <th className="p-4 font-heading font-bold text-secondary">Grade Band</th>
                                    <th className="p-4 font-heading font-bold text-secondary">Academics</th>
                                    <th className="p-4 font-heading font-bold text-secondary">Physical</th>
                                    <th className="p-4 font-heading font-bold text-secondary">Cultural</th>
                                    <th className="p-4 font-heading font-bold text-secondary">Experiential</th>
                                    <th className="p-4 font-heading font-bold text-secondary">Inner Discipline</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-border hover:bg-background/50">
                                    <td className="p-4 font-medium">Primary (1–5)</td>
                                    <td className="p-4">35%</td>
                                    <td className="p-4">25%</td>
                                    <td className="p-4">20%</td>
                                    <td className="p-4">10%</td>
                                    <td className="p-4">10%</td>
                                </tr>
                                <tr className="border-b border-border hover:bg-background/50">
                                    <td className="p-4 font-medium">Middle (6–8)</td>
                                    <td className="p-4">45%</td>
                                    <td className="p-4">20%</td>
                                    <td className="p-4">15%</td>
                                    <td className="p-4">10%</td>
                                    <td className="p-4">10%</td>
                                </tr>
                                <tr className="hover:bg-background/50">
                                    <td className="p-4 font-medium">Secondary (9–12)</td>
                                    <td className="p-4">55%</td>
                                    <td className="p-4">15%</td>
                                    <td className="p-4">10%</td>
                                    <td className="p-4">10%</td>
                                    <td className="p-4">10%</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Assessment & Evaluation */}
            <section className="py-20 bg-surface">
                <div className="container-custom max-w-4xl mx-auto">
                    <SectionHeader title="Assessment & Evaluation" />
                    <p className="text-lg text-text/80 leading-relaxed">
                        Assessment supports growth through conceptual understanding, continuous observation, constructive feedback, and structured exams without fear-based pressure.
                    </p>
                </div>
            </section>

            <Footer />
        </>
    );
}
