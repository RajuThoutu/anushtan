import React from 'react';

const pillars = [
    {
        name: "Swami Vivekananda",
        title: "The Man-Making Protocol",
        quote: "Education is the manifestation of the perfection already in man.",
        description: "Focusing on character building, strength of mind, and the expansion of the intellect. This protocol ensures students become self-reliant, fearless, and driven by a spirit of service."
    },
    {
        name: 'Sri Sarada Devi',
        title: "The Sharada Mata Nutrition Protocol",
        quote: "I am the mother of the wicked, as I am the mother of the virtuous.",
        description: "The Anushtan kitchen is a sanctuary of love. We serve high-prana, satvic food with the same devotion she practiced. This protocol emphasizes that nourishment is for both the body and the soul, fostering compassion."
    },
    {
        name: "Sri Aurobindo",
        title: "The Integral Education Protocol",
        quote: "The first principle of true teaching is that nothing can be taught.",
        description: "Learning is a process of self-discovery. We facilitate an environment where the child's psychic and mental faculties evolve naturally, integrating the physical, vital, mental, and spiritual self."
    },
    {
        name: "Rabindranath Tagore",
        title: "The Shantinikethan Arts Protocol",
        quote: "The highest education is that which does not merely give us information but makes our life in harmony with all existence.",
        description: "Cultivating the 'Culture of the Heart' through Fine Arts, Music, and Nature. This protocol integrates creativity into daily life, encouraging expression and harmony with the universe."
    },
    {
        name: "Dr. APJ Abdul Kalam",
        title: "The Ignited Minds Innovation Protocol",
        quote: "Dream is not that which you see while sleeping; it is something that does not let you sleep.",
        description: "Blending value-based education with cutting-edge technology. This protocol drives the 'Kriya Shakti' (Action) aspect, preparing students to lead India's future through science, innovation, and integrity."
    },
    {
        name: "Chanakya",
        title: "The Arthashastra Governance Protocol",
        quote: "Before you start some work, always ask yourself three questions - Why am I doing it, What the results might be and Will I be successful.",
        description: "Instilling strategic thinking, leadership, and statecraft. This protocol shapes future leaders who understand governance, economics, and the responsible use of power for the welfare of society."
    },
    {
        name: "Patanjali",
        title: "The Yogic Wellness Protocol",
        quote: "Yoga is the settling of the mind into silence.",
        description: "Physical and mental discipline through Yoga. This protocol ensures the alignment of body, breath, and mind, creating a stable foundation for periods of intense intellectual focus."
    }
];

export function PillarsSection() {
    return (
        <section className="py-20 bg-white">
            <div className="container-custom">
                <div className="text-center mb-16">
                    <h2 className="font-heading text-4xl md:text-5xl font-bold text-anushtan-terracotta mb-4">
                        The 7 Pillars of Governance
                    </h2>
                    <div className="h-1 w-24 bg-anushtan-gold mx-auto mb-6"></div>
                    <p className="max-w-3xl mx-auto text-lg text-anushtan-charcoal/80 leading-relaxed">
                        At Anushtan, our educational framework is not just a curriculum; it is a tapestry woven from the timeless wisdom of India’s greatest visionaries. We harmonize traditional roots with a future-forward vision through these five sacred influences.
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-8">
                    {pillars.map((pillar, idx) => (
                        <div
                            key={idx}
                            className={`w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.33%-1.5rem)] flex flex-col`}
                        >
                            <div className="bg-[#fdfbf7] border border-anushtan-border rounded-lg p-8 h-full shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-anushtan-gold/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>

                                <h3 className="font-heading text-2xl font-bold text-anushtan-terracotta mb-2 relative z-10">
                                    {pillar.name}
                                </h3>
                                <div className="text-anushtan-gold font-medium uppercase text-sm tracking-wider mb-6 relative z-10">
                                    {pillar.title}
                                </div>

                                <blockquote className="italic text-anushtan-charcoal/90 mb-6 relative pl-4 border-l-2 border-anushtan-gold/50">
                                    "{pillar.quote}"
                                </blockquote>

                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {pillar.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
