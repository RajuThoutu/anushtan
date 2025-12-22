import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";

export default function StudentLifePage() {
    return (
        <>
            <Navbar />
            <Hero
                title="Student Life"
                subtitle="Growth happens everywhere — in the classroom, on the field, and in quiet moments of reflection."
                background="bg-primary/5"
            />

            <section className="py-24 bg-background">
                <div className="container-custom">
                    <SectionHeader title="A Day at Anushtan" />
                    <div className="max-w-4xl mx-auto space-y-6">
                        <div className="flex gap-6 border-l-2 border-primary/20 pl-6 pb-6 relative">
                            <span className="shrink-0 font-bold text-primary w-20">06:00 AM</span>
                            <div>
                                <h4 className="font-bold text-lg">Morning Prayer & Yoga</h4>
                                <p className="text-text/70">Starting the day with mindfulness and physical activation.</p>
                            </div>
                        </div>
                        <div className="flex gap-6 border-l-2 border-primary/20 pl-6 pb-6 relative">
                            <span className="shrink-0 font-bold text-primary w-20">08:00 AM</span>
                            <div>
                                <h4 className="font-bold text-lg">Academic Sessions</h4>
                                <p className="text-text/70">Focused learning periods with breaks.</p>
                            </div>
                        </div>
                        <div className="flex gap-6 border-l-2 border-primary/20 pl-6 pb-6 relative">
                            <span className="shrink-0 font-bold text-primary w-20">01:00 PM</span>
                            <div>
                                <h4 className="font-bold text-lg">Community Lunch</h4>
                                <p className="text-text/70">Nutritious meals shared together.</p>
                            </div>
                        </div>
                        <div className="flex gap-6 border-l-2 border-primary/20 pl-6 pb-0 relative">
                            <span className="shrink-0 font-bold text-primary w-20">04:00 PM</span>
                            <div>
                                <h4 className="font-bold text-lg">Sports & Hobbies</h4>
                                <p className="text-text/70">Time for physical activities, arts, and clubs.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24 bg-surface">
                <div className="container-custom">
                    <SectionHeader title="Beyond Academics" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <Card hoverEffect><h4 className="font-bold text-lg mb-2 text-primary">Sports</h4><p className="text-sm text-text/70">[Placeholder: Football, Cricket, Archery, etc.]</p></Card>
                        <Card hoverEffect><h4 className="font-bold text-lg mb-2 text-primary">Arts & Music</h4><p className="text-sm text-text/70">[Placeholder: Classical music, dance, painting.]</p></Card>
                        <Card hoverEffect><h4 className="font-bold text-lg mb-2 text-primary">Service</h4><p className="text-sm text-text/70">[Placeholder: Village adoption, environmental drives.]</p></Card>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}
