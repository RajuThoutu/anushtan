import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/sections/PageHeader";
import { SectionHeader } from "@repo/ui";
import type { Metadata } from 'next';
import { Lightbulb, Users, Sprout, ChefHat, FlaskConical, Cpu } from "lucide-react";

export const metadata: Metadata = {
    title: 'Academics | Anushtan Indic School',
    description: 'Ancient Roots. Global Minds. Academic framework thoughtfully designed to nurture thinking minds, skilled hands, and conscious hearts, fully aligned with NEP-2020.',
};

const keyPillars = [
    {
        id: 1,
        name: "Conceptual Learning",
        description: "Focus on why and how, not rote memorisation that builds strong fundamentals and clarity of thought.",
        icon: Lightbulb,
        color: "from-blue-500 to-blue-600"
    },
    {
        id: 2,
        name: "Activity-Based Pedagogy",
        description: "Learning through experiments, projects, discussions, sports, team games and real-life applications, making education joyful and meaningful.",
        icon: Users,
        color: "from-green-500 to-green-600"
    },
    {
        id: 3,
        name: "Farming & Goshala Exposure",
        description: "Hands-on engagement with soil, crops, nature, and cows, fostering respect for life, sustainability, and Indian agrarian wisdom.",
        icon: Sprout,
        color: "from-emerald-500 to-emerald-600"
    },
    {
        id: 4,
        name: "Cooking as a Life Skill",
        description: "Practical understanding of nutrition, health, measurements, teamwork, and self-reliance through guided cooking activities.",
        icon: ChefHat,
        color: "from-orange-500 to-orange-600"
    },
    {
        id: 5,
        name: "Science Labs & Robotics",
        description: "Inquiry-driven science education with labs, robotics, tinkering, and problem-solving, encouraging innovation and curiosity.",
        icon: FlaskConical,
        color: "from-purple-500 to-purple-600"
    },
    {
        id: 6,
        name: "AI Tools & Digital Literacy",
        description: "Age-appropriate exposure to AI tools, logical thinking, and technology, preparing students for future careers with responsibility.",
        icon: Cpu,
        color: "from-indigo-500 to-indigo-600"
    }
];

export default function Academics() {
    return (
        <div className="min-h-screen bg-anushtan-parchment">
            <Navbar />
            <PageHeader
                title="Academic Framework & Pedagogy"
                subtitle="Ancient Roots. Global Minds"
            />

            {/* Mission Statement */}
            <section className="py-12 bg-white border-y border-anushtan-border">
                <div className="container-custom max-w-4xl mx-auto text-center">
                    <p className="text-xl md:text-2xl text-anushtan-charcoal leading-relaxed font-light">
                        The Anushtan Curriculum is thoughtfully designed to nurture <strong className="font-semibold text-anushtan-terracotta">thinking minds, skilled hands, and conscious hearts</strong>, fully aligned with the spirit and framework of <strong className="font-semibold text-anushtan-terracotta">NEP-2020</strong>.
                    </p>
                </div>
            </section>

            {/* Key Pillars of Learning */}
            <section className="py-20 bg-anushtan-parchment">
                <div className="container-custom">
                    <div className="text-center mb-16">
                        <span className="text-anushtan-terracotta font-bold uppercase tracking-widest text-sm block mb-3">
                            Our Approach
                        </span>
                        <h2 className="font-heading text-4xl md:text-5xl font-bold text-anushtan-charcoal mb-6">
                            Key Pillars of Learning
                        </h2>
                        <div className="h-1 w-24 bg-anushtan-gold mx-auto"></div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {keyPillars.map((pillar) => {
                            const Icon = pillar.icon;
                            return (
                                <div
                                    key={pillar.id}
                                    className="bg-white rounded-2xl p-8 border border-anushtan-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                                >
                                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${pillar.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                        <Icon className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="font-heading text-2xl font-bold text-anushtan-charcoal mb-4 min-h-[3.5rem] flex items-end">
                                        {pillar.name}
                                    </h3>
                                    <div className="w-12 h-[2px] bg-anushtan-gold/50 mb-4"></div>
                                    <p className="text-anushtan-charcoal/80 leading-relaxed">
                                        {pillar.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Academic Foundations */}
            <section className="py-16 bg-white">
                <div className="container-custom">
                    <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                        {/* Academic Orientation */}
                        <div className="bg-anushtan-parchment rounded-xl p-8 border border-anushtan-border">
                            <h3 className="font-heading text-2xl font-bold text-anushtan-terracotta mb-4">
                                Academic Orientation
                            </h3>
                            <div className="text-lg text-anushtan-charcoal/80 leading-relaxed space-y-4">
                                <p>
                                    The academic program at Anushtan is designed to build strong conceptual foundations, disciplined learning habits, and intellectual clarity appropriate to each stage of development.
                                </p>
                                <p>
                                    Learning is treated as a continuous and cumulative process rather than a series of disconnected units, with emphasis on understanding, coherence, and thoughtful engagement.
                                </p>
                            </div>
                        </div>

                        {/* Structure of Learning */}
                        <div className="bg-anushtan-parchment rounded-xl p-8 border border-anushtan-border">
                            <h3 className="font-heading text-2xl font-bold text-anushtan-terracotta mb-4">
                                Structure of Learning
                            </h3>
                            <div className="text-lg text-anushtan-charcoal/80 leading-relaxed space-y-4">
                                <p>
                                    Academic learning is structured across clearly defined stages of childhood and adolescence, with each stage emphasizing different developmental needs — cognitive, emotional, physical, and social.
                                </p>
                                <p>
                                    The structure ensures that complexity is introduced progressively and that students are not prematurely overloaded or fragmented in their learning experience.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Philosophy Footer Quote */}
            <section className="py-16 bg-gradient-to-r from-anushtan-terracotta/5 via-anushtan-gold/10 to-anushtan-terracotta/5">
                <div className="container-custom max-w-5xl mx-auto text-center">
                    <div className="bg-white/80 backdrop-blur-sm px-8 md:px-12 py-10 rounded-2xl border-2 border-anushtan-gold/30 shadow-lg">
                        <p className="text-anushtan-charcoal font-heading text-2xl md:text-3xl font-semibold italic leading-relaxed">
                            "At Anushtan, education is not just preparation for exams — but for living and learning to blend Indian values with modern skills."
                        </p>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
