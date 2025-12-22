import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function CampusPage() {
    return (
        <>
            <Navbar />
            <Hero
                title="Our Campus"
                subtitle="Designed to be a silent teacher. A space that inspires calm, focus, and wonder."
                background="bg-primary/5"
            />

            <section className="py-24 bg-background">
                <div className="container-custom">
                    <SectionHeader title="Infrastructure" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                        <div className="h-80 bg-surface rounded-lg flex items-center justify-center border border-text/10 text-text/30">[CAMPUS_AERIAL_VIEW]</div>
                        <div className="flex flex-col justify-center">
                            <h3 className="font-heading text-2xl font-bold mb-4 text-primary">Architecture & Design</h3>
                            <p className="text-text/70 text-lg leading-relaxed">
                                [Placeholder description of the campus architecture, emphasizing eco-friendly design, open spaces, natural light, and traditional aesthetics.]
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Card>
                            <div className="h-48 bg-background mb-4 rounded flex items-center justify-center text-text/30">[LIBRARY_IMG]</div>
                            <h4 className="font-heading text-xl font-bold mb-2">Library & Research</h4>
                            <p className="text-sm text-text/70">[Placeholder: A vast collection of physical and digital resources.]</p>
                        </Card>
                        <Card>
                            <div className="h-48 bg-background mb-4 rounded flex items-center justify-center text-text/30">[STEM_LABS_IMG]</div>
                            <h4 className="font-heading text-xl font-bold mb-2">STEM Labs</h4>
                            <p className="text-sm text-text/70">[Placeholder: State-of-the-art science and robotics laboratories.]</p>
                        </Card>
                        <Card>
                            <div className="h-48 bg-background mb-4 rounded flex items-center justify-center text-text/30">[ARTS_STUDIO_IMG]</div>
                            <h4 className="font-heading text-xl font-bold mb-2">Arts Studio</h4>
                            <p className="text-sm text-text/70">[Placeholder: Spaces for music, dance, and visual arts.]</p>
                        </Card>
                    </div>
                </div>
            </section>

            <section className="py-20 bg-secondary text-white text-center">
                <div className="container-custom">
                    <h2 className="font-heading text-3xl font-bold mb-6">Experience it yourself</h2>
                    <p className="text-white/80 max-w-2xl mx-auto mb-8">
                        We invite you to walk through our corridors and feel the difference. Schedule a campus tour today.
                    </p>
                    <Button href="/contact" className="bg-white text-secondary hover:bg-white/90">Book a Visit</Button>
                </div>
            </section>

            <Footer />
        </>
    );
}
