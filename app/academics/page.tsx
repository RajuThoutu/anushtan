import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";

export default function AcademicsPage() {
    return (
        <>
            <Navbar />
            <Hero
                title="Academics"
                subtitle="A rigorous curriculum designed to foster intellectual curiosity and deep understanding."
                background="bg-primary/5"
            />

            <section className="py-24 bg-background">
                <div className="container-custom">
                    <SectionHeader title="Curriculum Framework" />
                    <p className="text-center max-w-3xl mx-auto text-text/80 mb-16">
                        [Overview placeholder: We follow a blended curriculum that integrates [Board Name] standards with Indic knowledge systems.]
                    </p>

                    <div className="space-y-12">
                        {/* Primary */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                            <div className="md:col-span-5 bg-surface h-64 rounded-lg flex items-center justify-center border border-text/10">[IMAGE_PRIMARY]</div>
                            <div className="md:col-span-7">
                                <h3 className="font-heading text-2xl font-bold mb-4 text-primary">Primary Years (Grades 1-5)</h3>
                                <p className="text-text/70 mb-4">[Placeholder description of the primary years methodology, focusing on play, inquiry, and foundational skills.]</p>
                                <ul className="list-disc list-inside text-text/70 space-y-1">
                                    <li>Language & Storytelling</li>
                                    <li>Mathematics in Nature</li>
                                    <li>Arts & Movement</li>
                                </ul>
                            </div>
                        </div>

                        {/* Middle */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                            <div className="md:col-span-7 order-2 md:order-1">
                                <h3 className="font-heading text-2xl font-bold mb-4 text-primary">Middle Years (Grades 6-8)</h3>
                                <p className="text-text/70 mb-4">[Placeholder description of middle years, introducing more structured subjects and critical thinking.]</p>
                                <ul className="list-disc list-inside text-text/70 space-y-1">
                                    <li>Sciences & Laboratory</li>
                                    <li>History & Civics</li>
                                    <li>Classical Languages</li>
                                </ul>
                            </div>
                            <div className="md:col-span-5 order-1 md:order-2 bg-surface h-64 rounded-lg flex items-center justify-center border border-text/10">[IMAGE_MIDDLE]</div>
                        </div>

                        {/* Secondary */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                            <div className="md:col-span-5 bg-surface h-64 rounded-lg flex items-center justify-center border border-text/10">[IMAGE_SECONDARY]</div>
                            <div className="md:col-span-7">
                                <h3 className="font-heading text-2xl font-bold mb-4 text-primary">Secondary Years (Grades 9-12)</h3>
                                <p className="text-text/70 mb-4">[Placeholder description of secondary education, focusing on board exams, career guidance, and deep subject matter expertise.]</p>
                                <ul className="list-disc list-inside text-text/70 space-y-1">
                                    <li>Advanced Sciences & Commerce</li>
                                    <li>Research Projects</li>
                                    <li>Leadership Development</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24 bg-surface">
                <div className="container-custom text-center">
                    <SectionHeader title="Assessment Approach" />
                    <p className="text-text/80 max-w-3xl mx-auto">
                        [Placeholder describing continuous comprehensive evaluation, moving away from rote memorization towards understanding and application.]
                    </p>
                </div>
            </section>

            <Footer />
        </>
    );
}
