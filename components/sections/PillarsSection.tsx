import { Card } from "@/components/ui/Card";

interface Pillar {
    vertex: string;
    title: string;
    content: string;
}

const pillars: Pillar[] = [
    {
        vertex: "Mind",
        title: "Academic Excellence",
        content: "Beyond the 'Rote-Learning Prison.' NCERT-aligned conceptual mastery without the stress of drill-culture."
    },
    {
        vertex: "Body",
        title: "Holistic Development",
        content: "A 6-acre ecosystem where grit is built on the sports field and empathy is learned in the Goshala."
    },
    {
        vertex: "Soul",
        title: "Cultural Rootedness",
        content: "The Gurukulam spirit. Anchored in Bharatiya values, Vedic wisdom, and Vivekananda's Man-making philosophy."
    }
];

export function PillarsSection() {
    return (
        <section className="py-24 bg-surface">
            <div className="container-custom">
                <div className="text-center max-w-4xl mx-auto mb-16">
                    <h2 className="font-heading text-4xl font-bold text-anushtan-primary mb-6">
                        Triangle of Excellence
                    </h2>
                    <p className="text-xl text-anushtan-charcoal/80 italic">
                        "Education is an equilateral balance. If one side is weak, the child's potential is incomplete."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {pillars.map((pillar, index) => (
                        <Card key={index} className="bg-anushtan-bg border-border p-8 text-center h-full hover:-translate-y-1 transition-transform duration-300">
                            <div className="w-16 h-16 mx-auto bg-anushtan-primary text-white rounded-full flex items-center justify-center font-heading font-bold text-xl mb-6 shadow-lg">
                                {pillar.vertex}
                            </div>
                            <h3 className="font-heading text-2xl font-bold text-anushtan-primary mb-4">
                                {pillar.title}
                            </h3>
                            <p className="text-anushtan-charcoal/80 leading-relaxed">
                                {pillar.content}
                            </p>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
