import React from 'react';

const pillars = [
    {
        name: "Swami Vivekananda",
        title: "The Foundation of Man-Making",
        quote: "Education is the manifestation of the perfection already in man.",
        description: "Following the ideals of Swami Vivekananda, our primary goal is Man-making Education. We believe in building character, strengthening the mind, and expanding the intellect so that our students can stand on their own feet, driven by self-reliance and an indomitable spirit of service."
    },
    {
        name: "Sri Sharada Mata",
        title: "The Sacred Kitchen of Kindness",
        quote: "I am the mother of the wicked, as I am the mother of the virtuous.",
        description: "Inspired by the holiness of Sri Sharada Devi, the Anushtan kitchen is more than a place of sustenance; it is a sanctuary of love. We serve every child with the same kindness and devotion she practiced, teaching our students that serving others with love is the highest form of worship. Our nourishment is for both the body and the soul."
    },
    {
        name: "Sri Aurobindo",
        title: "The Integral Path of Free Learning",
        quote: "The first principle of true teaching is that nothing can be taught.",
        description: "We adopt Sri Aurobindo’s Integral Education concepts, where learning is a process of self-discovery rather than instruction. By fostering an environment of Free Learning, we allow the child’s psychic and mental faculties to evolve naturally, ensuring the development of the body, mind, and spirit as one unified whole."
    },
    {
        name: "Rabindranath Tagore",
        title: "The Harmony of Fine Arts",
        quote: "The highest education is that which does not merely give us information but makes our life in harmony with all existence.",
        description: "Taking inspiration from Tagore’s Shantinikethan, we celebrate the \"Culture of the Heart.\" We integrate Fine Arts, Music, and Creativity into the daily rhythm of school life, encouraging students to express their inner beauty and find harmony with nature and humanity."
    },
    {
        name: "Dr. APJ Abdul Kalam",
        title: "Igniting the Future",
        quote: "Dream is not that which you see while sleeping; it is something that does not let you sleep.",
        description: "Dr. Kalam represents the Modern Scientific Spirit of Anushtan. We strive to create \"Ignited Minds\" by blending value-based education with a passion for technology and innovation. We empower our students to dream big, work with integrity, and lead India toward a bright, self-reliant future through excellence in science and leadership."
    }
];

export function PillarsSection() {
    return (
        <section className="py-20 bg-white">
            <div className="container-custom">
                <div className="text-center mb-16">
                    <h2 className="font-heading text-4xl md:text-5xl font-bold text-anushtan-maroon mb-4">
                        The Pillars of Anushtan
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

                                <h3 className="font-heading text-2xl font-bold text-anushtan-maroon mb-2 relative z-10">
                                    {pillar.name}
                                </h3>
                                <div className="text-anushtan-saffron font-medium uppercase text-sm tracking-wider mb-6 relative z-10">
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
