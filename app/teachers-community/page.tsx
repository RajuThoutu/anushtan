import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";

export default function TeachersPage() {
    return (
        <>
            <Navbar />
            <Hero
                title="Teachers & Community"
                subtitle="It takes a village to raise a child. Our village is built on trust, respect, and shared values."
                background="bg-primary/5"
            />

            <section className="py-24 bg-background">
                <div className="container-custom">
                    <SectionHeader title="Our Acharyas" subtitle="Mentors, guides, and lifelong learners." />
                    <div className="max-w-4xl mx-auto text-center mb-16">
                        <p className="text-text/70 text-lg">
                            [Placeholder: Description of the recruitment process, the ongoing training in both modern pedagogy and Indic wisdom, and the role of the teacher as a role model.]
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <Card key={i} className="text-center">
                                <div className="h-32 w-32 bg-surface rounded-full mx-auto mb-4 border border-text/10 flex items-center justify-center text-text/30">[PHOTO]</div>
                                <h4 className="font-heading text-xl font-bold text-primary">Teacher Name</h4>
                                <p className="text-sm font-medium text-secondary mb-2">Subject / Role</p>
                                <p className="text-sm text-text/60 line-clamp-3">[Short bio placeholder about their qualifications and passion for teaching.]</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-24 bg-surface">
                <div className="container-custom">
                    <SectionHeader title="Parent Partnership" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h3 className="font-heading text-2xl font-bold mb-4 text-primary">Co-creators of the Future</h3>
                            <p className="text-text/70 mb-6">
                                [Placeholder describing how parents are involved in the school ecosystem, workshops for parents, and open communication channels.]
                            </p>
                            <ul className="space-y-3">
                                <li className="flex gap-2 items-center"><span className="h-1.5 w-1.5 bg-secondary rounded-full" /> Monthly Satsangs</li>
                                <li className="flex gap-2 items-center"><span className="h-1.5 w-1.5 bg-secondary rounded-full" /> Volunteering Opportunities</li>
                                <li className="flex gap-2 items-center"><span className="h-1.5 w-1.5 bg-secondary rounded-full" /> Holistic Parenting Workshops</li>
                            </ul>
                        </div>
                        <div className="h-80 bg-background rounded-lg flex items-center justify-center border border-text/10 text-text/30">
                            [COMMUNITY_IMAGE_PLACEHOLDER]
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}
