import { PageHeader } from "@/components/sections/PageHeader";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Teachers & Community | Anushtan Indic School',
    description: 'Role of teachers as Acharyas, parent partnership, and community engagement.',
};

export default function TeachersCommunity() {
    return (
        <>
            <Navbar />
            <PageHeader
                title="Teachers & Community"
                subtitle="Educators entrusted with the responsibility of guiding intellectual, ethical, and personal development."
            />

            {/* Teachers at Anushtan */}
            <section className="py-16 bg-transparent">
                <div className="container-custom max-w-4xl mx-auto">
                    <SectionHeader title="Teachers at Anushtan" />
                    <div className="text-lg text-anushtan-charcoal/80 leading-relaxed space-y-6">
                        <p>
                            Teachers at Anushtan are educators entrusted with the responsibility of guiding intellectual, ethical, and personal development.
                        </p>
                        <p>
                            Their role extends beyond instruction to mentorship, modeling conduct, and supporting the overall growth of each student.
                        </p>
                    </div>
                </div>
            </section>

            {/* The Role of the Acharya */}
            <section className="py-16 bg-transparent">
                <div className="container-custom max-w-4xl mx-auto">
                    <SectionHeader title="The Role of the Acharya" />
                    <div className="text-lg text-anushtan-charcoal/80 leading-relaxed space-y-6">
                        <p>
                            The concept of the Acharya reflects the traditional understanding of the teacher as a guide who supports learning through example, discipline, care, and clarity.
                        </p>
                        <p>
                            At Anushtan, teachers are encouraged to cultivate presence, patience, and responsibility in their interactions with students.
                        </p>
                    </div>
                </div>
            </section>

            {/* Teacher Development & Responsibility */}
            <section className="py-16 bg-transparent">
                <div className="container-custom max-w-4xl mx-auto">
                    <SectionHeader title="Teacher Development & Responsibility" />
                    <div className="text-lg text-anushtan-charcoal/80 leading-relaxed space-y-6">
                        <p>
                            Teachers engage in continuous reflection and professional growth to refine their understanding of pedagogy, child development, and subject knowledge.
                        </p>
                        <p>
                            The school emphasizes responsibility, integrity, and consistency in teaching practice.
                        </p>
                    </div>
                </div>
            </section>

            {/* The School Community */}
            <section className="py-16 bg-transparent">
                <div className="container-custom max-w-4xl mx-auto">
                    <SectionHeader title="The School Community" />
                    <div className="text-lg text-anushtan-charcoal/80 leading-relaxed space-y-6">
                        <p>
                            Anushtan is a learning community where teachers, students, families, and staff participate in a shared educational process.
                        </p>
                        <p>
                            The community is grounded in mutual respect, cooperation, and a shared commitment to learning and development.
                        </p>
                    </div>
                </div>
            </section>

            {/* Family Partnership */}
            <section className="py-16 bg-transparent">
                <div className="container-custom max-w-4xl mx-auto">
                    <SectionHeader title="Family Partnership" />
                    <div className="text-lg text-anushtan-charcoal/80 leading-relaxed space-y-6">
                        <p>
                            Families are regarded as partners in the educational journey of the child.
                        </p>
                        <p>
                            Regular communication, shared understanding, and alignment of values support continuity between home and school environments.
                        </p>
                    </div>
                </div>
            </section>

            {/* Culture of Respect & Learning */}
            <section className="py-16 bg-transparent">
                <div className="container-custom max-w-4xl mx-auto">
                    <SectionHeader title="Culture of Respect & Learning" />
                    <div className="text-lg text-anushtan-charcoal/80 leading-relaxed space-y-6">
                        <p>
                            The institutional culture at Anushtan is shaped by respect for individuals, commitment to learning, and responsibility toward the community and environment.
                        </p>
                        <p>
                            This culture supports emotional safety, intellectual curiosity, and ethical conduct.
                        </p>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}
