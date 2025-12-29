import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SectionHeader } from "@/components/ui/SectionHeader";
import Image from 'next/image';

// Placeholder data generator
const generatePlaceholders = (count: number, role: string) =>
    Array(count).fill(null).map((_, i) => ({
        id: i,
        name: "Name of the Person",
        title: role,
        bio: "A brief description about the person, their background, and their contribution to the philosophy of Anushtan Indic School.",
        image: "/logo.jpg" // Using logo as placeholder
    }));

const chiefAdvisors = [
    {
        id: 'bhasker-reddy',
        name: "Bhasker Reddy Sanditi",
        title: "Founder, Bharathiya Vidya (SBR Talks)",
        bio: "With over 30 years of expertise in ancient Bharatiya educational culture, Bhasker Reddy Sanditi is a cornerstone of institutional excellence. He bridges traditional wisdom with modern standards, designing learning environments that mirror the discipline of the Gurukulam while fostering character-building and heritage.",
        image: "/logo.jpg"
    },
    {
        id: 'bharath-teja',
        name: "Bharath Teja",
        title: "Founder & CEO, Nine Education | IIT Kharagpur Alumnus",
        bio: "An IIT Kharagpur alumnus and visionary leader, Bharath Teja specializes in student-centric learning models and academic excellence. His leadership at Nine Education and his focus on high-energy, empathy-led teaching ensure Anushtan remains at the forefront of both traditional values and future-ready skills.",
        image: "/logo.jpg"
    },
    {
        id: 'jaswanth',
        name: "Jaswanth",
        title: "Director, Nine Education | IIT Kharagpur Alumnus",
        bio: "An IIT Kharagpur graduate with 13+ years of expertise, Jaswanth blends academic rigor with emotional intelligence. As a Heartfulness Meditation Trainer, he guides Anushtan in creating a stress-free environment, ensuring students achieve peak performance while maintaining mental well-being and inner peace.",
        image: "/logo.jpg"
    },
    {
        id: 'srikanth',
        name: "Srikanth",
        title: "Director, Nine Education | IIT Alumnus",
        bio: "A strategist and IIT alumnus, Srikanth specializes in analytical problem-solving and modern technology trends. He advocates for Speed Mathematics and Logical Interpretation, equipping Anushtan students with the IQ and technical mastery required for elite global opportunities in high-growth fields like HFT and advanced coding.",
        image: "/logo.jpg"
    },
    {
        id: 'mr-nimma-divi-reddy',
        name: "Mr. Nimma Divi Reddy",
        title: "Global IT Leader & Educationist | NIT Warangal Alumnus",
        bio: "A distinguished alumnus of NIT Warangal (REC) with a B.Tech and M.Tech, Mr. Nimma Divi Reddy brings over 25 years of global leadership experience within Fortune 100 companies. Having served in high-level roles as Director, VP, and CEO, he combines world-class corporate strategy with a deep passion for education. Currently managing four premier schools in Trivandrum and serving as a partner at UrbanSky, Mr. Reddy provides Anushtan with the strategic vision to scale institutional excellence while integrating cutting-edge global IT perspectives into our educational framework.",
        image: "/logo.jpg"
    }
];
const directors = [
    {
        id: 'raju-thoutu',
        name: "Raju Thoutu",
        title: "Architect & AI Strategist",
        bio: "An Architect by profession and an AI Strategist specializing in corporate AI adoption. Bringing high-level expertise from the United States financial sector, Raju bridges the gap between cutting-edge technology and human values. Deeply rooted in Bharatiya ethos, he steers Anushtan’s strategic technological roadmap, ensuring students are future-ready yet culturally grounded.",
        image: "/logo.jpg"
    },
    {
        id: 'srikanth-bollavaram',
        name: "Srikanth Bollavaram",
        title: "Transformation Strategist",
        bio: "A transformation strategist with an extensive background heading digital initiatives for global MNCs across the United States and Europe. Srikanth brings international-standard corporate governance and rigorous institutional supervision to Anushtan. He specializes in architecting scalable systems of excellence, ensuring the school’s growth is guided by elite global benchmarks.",
        image: "/logo.jpg"
    },
    {
        id: 'sreedhar-bollavaram',
        name: "Sreedhar Bollavaram",
        title: "Founder & Executive Director, Pratishtan Educational Services",
        bio: "Founder and Executive Director of Pratishtan Educational Services Pvt. Ltd. He brings over 15 years of experience in the software industry — with a strong background in corporate leadership and a proven track record of building & scaling startups.",
        image: "/logo.jpg"
    },
    {
        id: 'karthikeya-narendrula',
        name: "Karthikeya Narendrula",
        title: "Serial Entrepreneur & Permaculture Designer",
        bio: "A serial entrepreneur, permaculture designer, and pedagogy researcher committed to building learner-centric, nature-aligned education systems that preserve curiosity, character and nurture life skills.",
        image: "/logo.jpg"
    },
    {
        id: 'ramu-tavutu',
        name: "Ramu Tavutu",
        title: "Global IT Leader & Product Specialist",
        bio: "A seasoned leader with 15+ years in global IT project management and product leadership. With extensive international exposure across South Africa and the United States, Ramu specializes in educational innovations derived from studying diverse global schooling systems. He leads the integration of world-class pedagogical practices into the Anushtan framework to ensure our students are globally competitive.",
        image: "/logo.jpg"
    }
];


export default function LeadershipPage() {
    return (
        <>
            <Navbar />

            <main className="bg-[#fdfbf7] min-h-screen">
                {/* Page Header */}
                <section className="bg-anushtan-maroon text-white py-16 text-center">
                    <div className="container-custom">
                        <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">Leadership & Guidance</h1>
                        <p className="max-w-2xl mx-auto text-white/80 text-lg">
                            The visionaries and mentors guiding Anushtan Indic School towards its mission of holistic and rooted education.
                        </p>
                    </div>
                </section>

                <div className="container-custom py-16 space-y-20">

                    {/* Section 1: Chief Advisors */}
                    <LeadershipSection
                        title="Chief Advisors"
                        items={chiefAdvisors}
                        description="Our guiding lights providing strategic direction and wisdom."
                        cols={1}
                    />

                    {/* Section 2: Directors */}
                    <LeadershipSection
                        title="Directors"
                        items={directors}
                        cols={1}
                    />



                </div>
            </main>

            <Footer />
        </>
    );
}

function LeadershipSection({ title, items, description, cols = 3 }: { title: string, items: any[], description?: string, cols?: number }) {
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

function LeadershipCard({ person }: { person: any }) {
    return (
        <div className="bg-white border border-anushtan-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow p-8 flex flex-col md:flex-row items-center md:items-start md:text-left text-center gap-8">
            <div className="w-48 h-48 md:w-56 md:h-56 relative flex-shrink-0 rounded-full overflow-hidden border-4 border-anushtan-ivory shadow-md">
                <Image
                    src={person.image}
                    alt={person.name}
                    fill
                    className="object-cover"
                />
            </div>

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
