import { SectionHeader } from "@/components/ui/SectionHeader";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/sections/PageHeader";
import { VideoSection } from "@/components/sections/VideoSection";
import Image from "next/image";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Campus | Anushtan Indic School',
    description: 'Eco-friendly environment, facilities, and campus life.',
};

export default function Campus() {
    return (
        <>
            <Navbar />
            <PageHeader
                title="Campus"
                subtitle="Eco-friendly environment, facilities, and campus life."
            />

            <VideoSection />


            {/* Campus as a Silent Teacher */}
            <section id="environment" className="py-20 bg-transparent">
                <div className="container-custom max-w-4xl mx-auto">
                    <SectionHeader title="Campus as a Silent Teacher" />
                    <p className="text-lg text-text/80 leading-relaxed mb-8">
                        The campus functions as a silent teacher—supporting focus, movement, cleanliness, order, and balance.
                    </p>
                </div>
            </section>

            {/* Facilities */}
            <section id="facilities" className="py-20 bg-transparent">
                <div className="container-custom">
                    <SectionHeader title="Facilities" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card>
                            <h3 className="font-heading text-xl font-bold mb-2">Classrooms</h3>
                            <p className="text-text/70">Calm, functional learning spaces.</p>
                        </Card>
                        <Card>
                            <h3 className="font-heading text-xl font-bold mb-2">Sports Grounds</h3>
                            <p className="text-text/70">Daily training and outdoor activity areas.</p>
                        </Card>
                        <Card>
                            <h3 className="font-heading text-xl font-bold mb-2">Activity Spaces</h3>
                            <p className="text-text/70">Cultural and experiential learning zones.</p>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Gallery */}
            <section id="gallery" className="py-20 bg-transparent">
                <div className="container-custom">
                    <SectionHeader title="Gallery" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Building */}
                        <div className="relative h-64 w-full rounded-lg overflow-hidden border border-text/10 shadow-md hover:shadow-lg transition-shadow">
                            <Image
                                src="/campus-building.jpg"
                                alt="Campus Building"
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                        {/* Masterplan */}
                        <div className="relative h-64 w-full rounded-lg overflow-hidden border border-text/10 shadow-md hover:shadow-lg transition-shadow">
                            <Image
                                src="/campus-masterplan.jpg"
                                alt="Campus Masterplan"
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                        {/* Perspective */}
                        <div className="relative h-64 w-full rounded-lg overflow-hidden border border-text/10 shadow-md hover:shadow-lg transition-shadow">
                            <Image
                                src="/campus-perspective.jpg"
                                alt="Campus Perspective"
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                        {/* Lobby */}
                        <div className="relative h-64 w-full rounded-lg overflow-hidden border border-text/10 shadow-md hover:shadow-lg transition-shadow">
                            <Image
                                src="/campus-lobby.jpg"
                                alt="Anushtan Campus Lobby"
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                        {/* Classroom 1 */}
                        <div className="relative h-64 w-full rounded-lg overflow-hidden border border-text/10 shadow-md hover:shadow-lg transition-shadow">
                            <Image
                                src="/campus-classroom-1.jpg"
                                alt="Modern Classroom"
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                        {/* Tech Lab */}
                        <div className="relative h-64 w-full rounded-lg overflow-hidden border border-text/10 shadow-md hover:shadow-lg transition-shadow">
                            <Image
                                src="/campus-tech-lab.jpg"
                                alt="Computer Lab"
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                        {/* Science Lab */}
                        <div className="relative h-64 w-full rounded-lg overflow-hidden border border-text/10 shadow-md hover:shadow-lg transition-shadow">
                            <Image
                                src="/campus-science-lab.jpg"
                                alt="Science Lab"
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                        {/* Library */}
                        <div className="relative h-64 w-full rounded-lg overflow-hidden border border-text/10 shadow-md hover:shadow-lg transition-shadow">
                            <Image
                                src="/campus-library.jpg"
                                alt="Library"
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                        {/* Classroom 2 */}
                        <div className="relative h-64 w-full rounded-lg overflow-hidden border border-text/10 shadow-md hover:shadow-lg transition-shadow">
                            <Image
                                src="/campus-classroom-2.jpg"
                                alt="Collaborative Learning Space"
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}
