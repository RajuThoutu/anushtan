import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Image from 'next/image';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Leadership | Anushtan Indic School',
    description: 'The organizational framework and leadership guiding the Anushtan Indic School vision.',
};

const principal = [{
    id: 'or-sunayana',
    name: "O.R. Sunayana",
    title: "Principal, Anushtan Indic School",
    bio: "Leading the day-to-day academic culture, care, and growth of every child at Anushtan.",
    image: "/images/or-sunayana-principal.png"
}];
const chiefAdvisors = [
    {
        id: 'sbr-talks',
        name: "Pratishtan Edu Research / SBR Talks",
        title: "Chief Academic Advisor",
        bio: "Providing strategic direction for a thoughtful, concept-led learning culture."
    },
    {
        id: 'bharath-teja',
        name: "Bharat Teja",
        title: "Academic Advisor",
        bio: "Guiding academic excellence and student-centred learning at Anushtan."
    }
];
const directors = [
    {
        id: 'raju-thoutu',
        name: "Raju Thoutu",
        title: "Director",
        bio: "Guiding Anushtan’s strategic growth with a focus on future-ready learning and strong values."
    },
    {
        id: 'sreedhar-bollavaram',
        name: "Sreedhar B",
        title: "Director",
        bio: "Guiding institutional direction and value-based, student-centred learning."
    },
    {
        id: 'kartik-narendrula',
        name: "Kartik Narendrula",
        title: "Director",
        bio: "Guiding sustainable, nature-aligned learning and long-term school development."
    }
];


export default function LeadershipPage() {
    return (
        <>
            <Navbar />

            <main className="bg-[#fdfbf7] min-h-screen">
                {/* Page Header */}
                {/* Page Header */}
                <section className="bg-anushtan-terracotta text-white py-16 text-center">
                    <div className="container-custom">
                        <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6">Leadership & Guidance</h1>
                        <div className="max-w-4xl mx-auto space-y-4">
                            <h2 className="text-2xl md:text-3xl font-bold text-anushtan-gold">
                                A Convergence of Vision and Governance
                            </h2>
                            <p className="text-lg md:text-xl font-light text-white/90 leading-relaxed tracking-wide">
                                A focused group of school, academic, and institutional leaders guides Anushtan with clarity and continuity.
                            </p>
                        </div>
                    </div>
                </section>
                <div className="container-custom py-16 space-y-20">

                    <LeadershipSection
                        title="School Leadership"
                        items={principal}
                        description="The Principal leads Anushtan’s academic culture and day-to-day school life."
                        cols={1}
                    />

                    <LeadershipSection
                        title="Chief Advisory"
                        items={chiefAdvisors}
                        description="Academic guidance and strategic direction for the school’s learning culture."
                        cols={2}
                    />

                    {/* Section 2: Directors */}
                    <LeadershipSection
                        title="Directors"
                        items={directors}
                        cols={3}
                    />



                </div>
            </main>

            <Footer />
        </>
    );
}

type Leader = { id: string; name: string; title: string; bio: string; image?: string };

function LeadershipSection({ title, items, description, cols = 3 }: { title: string, items: Leader[], description?: string, cols?: number }) {
    return (
        <section>
            <div className="mb-10 text-center md:text-left">
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-anushtan-maroon mb-3 border-b-2 border-anushtan-gold inline-block pb-1">
                    {title}
                </h2>
                {description && <p className="text-anushtan-charcoal/70 mt-2 text-lg">{description}</p>}
            </div>

            {/* Grid Layout: Dynamic columns */}
            <div className="flex flex-wrap gap-8">
                {items.map((person, idx) => (
                    <div
                        key={idx}
                        className={`w-full ${cols === 2 ? 'md:w-[calc(50%-1rem)] lg:w-[calc(50%-1rem)]' : ''} ${cols === 3 ? 'md:w-[calc(50%-1rem)] lg:w-[calc(33.33%-1.5rem)]' : ''}`}
                    >
                        <LeadershipCard person={person} />
                    </div>
                ))}
            </div>
        </section>
    );
}

function LeadershipCard({ person }: { person: Leader }) {
    return (
        <div className="bg-white border border-anushtan-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow p-8 flex flex-col items-center gap-6 text-center">
            {person.image && (
                <div className="relative h-40 w-32 shrink-0 overflow-hidden rounded-t-full border-4 border-anushtan-ivory shadow-md">
                    <Image src={person.image} alt={person.name} fill className="object-cover object-top" sizes="128px" />
                </div>
            )}
            <div className="flex-grow">
                <h3 className="font-heading text-2xl md:text-3xl font-bold text-[#6B3126] mb-2">
                    {person.name}
                </h3>
                <div className="text-anushtan-saffron font-medium text-base uppercase tracking-wide mb-4">
                    {person.title}
                </div>
                <p className="text-gray-700 text-lg leading-relaxed">
                    {person.bio}
                </p>
            </div>
        </div>
    );
}
