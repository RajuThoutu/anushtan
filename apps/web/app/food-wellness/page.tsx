import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/sections/PageHeader";
import { SectionHeader } from "@repo/ui";
import Image from "next/image";
import { Droplets, Heart, Users, Utensils } from "lucide-react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Food & Wellness | Anushtan Indic School',
    description: 'Holistic nutrition, student activities, physical wellness, and residential life at Anushtan.',
};

export default function FoodWellnessPage() {
    return (
        <>
            <Navbar />
            <PageHeader
                title="Food & Wellness"
                subtitle="Holistic nourishment, vibrant activities, and comprehensive well-being for every student."
            />

            {/* Sri Sarada Kitchen Partnership */}
            <section className="py-16 bg-anushtan-parchment">
                <div className="container-custom">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <span className="text-anushtan-terracotta font-bold uppercase tracking-widest text-sm block mb-3">Our Catering Partner</span>
                            <h2 className="font-heading text-4xl font-bold text-anushtan-charcoal mb-6">
                                Sri Sarada Kitchen
                            </h2>
                            <div className="space-y-4 text-lg text-anushtan-charcoal/80 leading-relaxed">
                                <p>
                                    Our catering partner, Sri Sarada Kitchen, operates with modern, automated kitchen equipment that ensures the highest standards of hygiene and nutrient retention in food while maintaining consistency in taste across every meal.
                                </p>
                                <div className="grid grid-cols-3 gap-4 mt-6">
                                    <div className="text-center p-4 bg-white rounded-lg border border-anushtan-border">
                                        <div className="text-anushtan-terracotta font-bold text-2xl mb-1">100%</div>
                                        <div className="text-sm text-anushtan-charcoal/70">Hygiene Standard</div>
                                    </div>
                                    <div className="text-center p-4 bg-white rounded-lg border border-anushtan-border">
                                        <div className="text-anushtan-terracotta font-bold text-2xl mb-1">Fresh</div>
                                        <div className="text-sm text-anushtan-charcoal/70">Daily Preparations</div>
                                    </div>
                                    <div className="text-center p-4 bg-white rounded-lg border border-anushtan-border">
                                        <div className="text-anushtan-terracotta font-bold text-2xl mb-1">Modern</div>
                                        <div className="text-sm text-anushtan-charcoal/70">Equipment</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="relative h-96 rounded-2xl overflow-hidden shadow-lg">
                            <div className="absolute inset-0 bg-gradient-to-br from-anushtan-terracotta/20 to-transparent z-10" />
                            <Utensils className="absolute inset-0 m-auto w-32 h-32 text-anushtan-terracotta/30" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Indic Food Culture & Nutrition Philosophy */}
            <section className="py-16 bg-white">
                <div className="container-custom">
                    <SectionHeader title="Indic Food Culture & Nutrition Philosophy" />
                    <div className="max-w-4xl mx-auto space-y-8">
                        <p className="text-lg text-anushtan-charcoal/80 leading-relaxed">
                            We consciously introduce a wide range of Indic foods to help students experience the richness of native cereals, legumes, and spices. Our menu follows a balanced and familiar dietary structure for children.
                        </p>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-anushtan-parchment p-6 rounded-lg border border-anushtan-border">
                                <h3 className="font-heading text-2xl font-bold text-anushtan-charcoal mb-4">Traditional Preparations</h3>
                                <ul className="space-y-3 text-anushtan-charcoal/80">
                                    <li className="flex items-start gap-2">
                                        <div className="w-2 h-2 bg-anushtan-gold rounded-full mt-2"></div>
                                        <span><strong>Ragi Java, Ragi Dosa, Ragi Idly</strong> – Ancient grain preparations</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <div className="w-2 h-2 bg-anushtan-gold rounded-full mt-2"></div>
                                        <span><strong>A2 Desi Cow Milk</strong> – From our on-campus Goshala</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <div className="w-2 h-2 bg-anushtan-gold rounded-full mt-2"></div>
                                        <span><strong>Indigenous Cuisines</strong> – Regularly included in menus</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-anushtan-parchment p-6 rounded-lg border border-anushtan-border">
                                <h3 className="font-heading text-2xl font-bold text-anushtan-charcoal mb-4">Quality Standards</h3>
                                <ul className="space-y-3 text-anushtan-charcoal/80">
                                    <li className="flex items-start gap-2">
                                        <div className="w-2 h-2 bg-anushtan-terracotta rounded-full mt-2"></div>
                                        <span>Zero-sugar policy: Only jaggery and natural sweeteners</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <div className="w-2 h-2 bg-anushtan-terracotta rounded-full mt-2"></div>
                                        <span>Junk food consciously avoided</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <div className="w-2 h-2 bg-anushtan-terracotta rounded-full mt-2"></div>
                                        <span>Healthy desserts and snacks offered occasionally</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-anushtan-gold/10 via-anushtan-terracotta/10 to-anushtan-gold/10 p-8 rounded-2xl border-2 border-anushtan-gold/30 text-center">
                            <p className="text-anushtan-charcoal font-heading text-xl md:text-2xl font-semibold italic">
                                "Our aim is to nurture in every child a natural appreciation for the Indic lifestyle and its time-tested wisdom."
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Child Wellness Team */}
            <section className="py-16 bg-anushtan-parchment">
                <div className="container-custom max-w-4xl mx-auto">
                    <div className="text-center mb-8">
                        <Heart className="w-16 h-16 text-anushtan-terracotta mx-auto mb-4" />
                        <h2 className="font-heading text-3xl md:text-4xl font-bold text-anushtan-charcoal mb-4">
                            Child Wellness Team
                        </h2>
                    </div>
                    <div className="text-lg text-anushtan-charcoal/80 leading-relaxed space-y-6 text-center">
                        <p>
                            Our Child Wellness Team works in close and regular consultation with qualified nutrition and mental health experts to thoughtfully design food menus and environment that support both the physical health and mental well-being of every child.
                        </p>
                    </div>
                </div>
            </section>

            {/* Residential Living & Sahabhojan */}
            <section className="py-16 bg-white">
                <div className="container-custom">
                    <SectionHeader title="Residential Living & Community" />
                    <div className="max-w-4xl mx-auto space-y-8">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <Users className="w-12 h-12 text-anushtan-gold mb-4" />
                                <h3 className="font-heading text-2xl font-bold text-anushtan-charcoal mb-4">Hostel</h3>
                                <p className="text-lg text-anushtan-charcoal/80 leading-relaxed">
                                    Our residential students are an extended family of Team Anushtan, experiencing a strong sense of community and shared identity. We provide a nurturing environment where lifelong friendships are formed, with physical and mental well-being of every student placed at the highest priority by our management team.
                                </p>
                            </div>

                            <div>
                                <Utensils className="w-12 h-12 text-anushtan-terracotta mb-4" />
                                <h3 className="font-heading text-2xl font-bold text-anushtan-charcoal mb-4">Sahabhojan</h3>
                                <p className="text-lg text-anushtan-charcoal/80 leading-relaxed">
                                    Serving food with love and compassion, cultivating gratitude and community. Students serve each other, building bonds and fostering a culture of care.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Professional Sports Training */}
            <section className="py-20 bg-anushtan-parchment">
                <div className="container-custom">
                    <div className="text-center mb-12">
                        <span className="text-anushtan-terracotta font-bold uppercase tracking-widest text-sm block mb-3">
                            Professional Sports Training
                        </span>
                        <h2 className="font-heading text-4xl md:text-5xl font-bold text-anushtan-charcoal mb-6">
                            Sports, Skills & Student Development
                        </h2>
                        <div className="h-1 w-24 bg-anushtan-gold mx-auto mb-8"></div>
                        <p className="text-2xl text-anushtan-terracotta font-semibold max-w-4xl mx-auto">
                            Physical Education is Integral to Mental Discipline and Leadership
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                        <SportsFacilityCard
                            name="Basketball Court"
                            description="Professional court for team training and tournaments"
                        />
                        <SportsFacilityCard
                            name="Skating Rink"
                            description="Dedicated facility for skating and balance training"
                        />
                        <SportsFacilityCard
                            name="Kabaddi & Kho-Kho Courts"
                            description="Traditional Indian sports fostering agility and teamwork"
                        />
                        <SportsFacilityCard
                            name="Horse Riding"
                            description="Equestrian training and animal care experience"
                        />
                        <SportsFacilityCard
                            name="Volleyball"
                            description="Team coordination and athletic fitness"
                        />
                        <SportsFacilityCard
                            name="Football Court"
                            description="Full-size field for matches and practice"
                        />
                        <SportsFacilityCard
                            name="Cricket Nets"
                            description="Professional cricket practice facilities"
                        />
                        <SportsFacilityCard
                            name="Indoor Games"
                            description="Chess, table tennis, and other strategic games"
                        />
                    </div>
                </div>
            </section>

            {/* Student Activities & Well-being */}
            <section className="py-16 bg-white">
                <div className="container-custom">
                    <SectionHeader title="Student Activities & Well-being" />
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        <ActivityCard
                            title="Physical Activity & Health"
                            description="Physical activity is integral, supporting vitality, coordination, resilience, and emotional regulation through regular movement, games, and practices."
                        />
                        <ActivityCard
                            title="Arts, Expression & Creativity"
                            description="Creative expression through music, visual arts, and storytelling supports cognitive flexibility, emotional articulation, and aesthetic sensitivity."
                        />
                        <ActivityCard
                            title="Community Life & Responsibility"
                            description="Students participate in shared community life where cooperation, respect, responsibility, and care for the environment are cultivated."
                        />
                        <ActivityCard
                            title="Reflection & Inner Discipline"
                            description="Quiet reflection, attention practices, and contemplative activities support emotional regulation, self-awareness, and inner stability."
                        />
                        <ActivityCard
                            title="Daily Rhythm"
                            description="A steady flow between focused academic engagement, physical movement, creative expression, social interaction, and quiet reflection."
                        />
                        <ActivityCard
                            title="Student Well-being"
                            description="Holistic approach recognizing the interconnection of physical health, emotional balance, social belonging, and intellectual engagement."
                        />
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}

function SportsFacilityCard({ name, description }: { name: string; description: string }) {
    return (
        <div className="bg-white rounded-xl p-6 border border-anushtan-border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-full aspect-video bg-gradient-to-br from-anushtan-terracotta/10 to-anushtan-gold/10 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-anushtan-terracotta/5 group-hover:bg-anushtan-terracotta/10 transition-colors" />
                <div className="text-4xl grayscale group-hover:grayscale-0 transition-all relative z-10">
                    {name.includes('Basketball') && '🏀'}
                    {name.includes('Skating') && '⛸️'}
                    {name.includes('Kabaddi') && '🤼'}
                    {name.includes('Horse') && '🐴'}
                    {name.includes('Volleyball') && '🏐'}
                    {name.includes('Football') && '⚽'}
                    {name.includes('Cricket') && '🏏'}
                    {name.includes('Indoor') && '♟️'}
                </div>
            </div>
            <h3 className="font-heading text-lg font-bold text-anushtan-charcoal mb-2">{name}</h3>
            <p className="text-sm text-anushtan-charcoal/70 leading-relaxed">{description}</p>
        </div>
    );
}

function ActivityCard({ title, description }: { title: string; description: string }) {
    return (
        <div className="bg-white p-6 rounded-lg border border-anushtan-border shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-heading text-xl font-bold text-anushtan-charcoal mb-3">{title}</h3>
            <p className="text-anushtan-charcoal/80 leading-relaxed">{description}</p>
        </div>
    );
}
