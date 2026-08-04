import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, BookOpenCheck, Brain, Flag, HandHeart, Music2, Sprout } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
    title: "Academics | Anushtan Indic School",
    description: "A lived curriculum at Anushtan Indic School: children think, make, express, move, and lead.",
};

const learningModes = [
    {
        number: "01",
        title: "Question & understand",
        text: "Mathematics, Telugu, discussion, and no-bag-day experiences build clarity before memorisation.",
        detail: "Children are encouraged to ask why, notice patterns, and explain their thinking.",
        icon: Brain,
        tone: "bg-[#f4e9db] text-anushtan-terracotta",
    },
    {
        number: "02",
        title: "Make with the hands",
        text: "Paper-bag making, plantation work, and learning around plants turn ideas into something real.",
        detail: "Making develops observation, care, patience, and practical confidence.",
        icon: HandHeart,
        tone: "bg-[#e8f0e4] text-[#496a45]",
    },
    {
        number: "03",
        title: "Find a voice",
        text: "Solo song, shloka, music, and language give every child space to express with confidence.",
        detail: "Expression is treated as part of learning, not an activity outside it.",
        icon: Music2,
        tone: "bg-[#f1e9f3] text-[#76516f]",
    },
    {
        number: "04",
        title: "Learn in motion",
        text: "Games such as the balancing wheel connect physical movement, attention, and everyday science.",
        detail: "The body is an active part of how children explore and understand the world.",
        icon: Sprout,
        tone: "bg-[#e7f1ef] text-[#356b64]",
    },
    {
        number: "05",
        title: "Practise responsibility",
        text: "The Investiture Ceremony and classroom culture help children experience leadership as service.",
        detail: "Children learn to contribute, care for shared spaces, and stand with others.",
        icon: Flag,
        tone: "bg-[#f8eed9] text-[#9b6b26]",
    },
];

export default function Academics() {
    return (
        <div className="min-h-screen bg-[#fcfaf6]">
            <Navbar />

            <main>
                <section className="overflow-hidden bg-anushtan-terracotta text-white">
                    <div className="container-custom grid min-h-[620px] items-center gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
                        <div className="relative z-10 max-w-2xl">
                            <span className="mb-6 inline-flex rounded-full border border-anushtan-gold/40 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-anushtan-gold">
                                2026–27 academic year
                            </span>
                            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-white/60">Academics at Anushtan</p>
                            <h1 className="font-heading text-5xl font-bold leading-[0.98] md:text-7xl">
                                Learning is something children <span className="text-anushtan-gold">do.</span>
                            </h1>
                            <p className="mt-8 max-w-xl text-lg leading-relaxed text-white/80 md:text-xl">
                                A school day can move from a question to a paper bag, a song, a seedling, a game, or a moment of leadership. That is how learning becomes real.
                            </p>
                            <div className="mt-10 flex flex-wrap gap-3 text-sm text-white/80">
                                <span className="rounded-full border border-white/20 px-4 py-2">Think deeply</span>
                                <span className="rounded-full border border-white/20 px-4 py-2">Make meaningfully</span>
                                <span className="rounded-full border border-white/20 px-4 py-2">Grow together</span>
                            </div>
                        </div>

                        <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
                            <div className="absolute -inset-5 rounded-[2.5rem] border border-anushtan-gold/35" />
                            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-anushtan-charcoal shadow-2xl">
                                <Image
                                    src="/campus-classroom-2.jpg"
                                    alt="Anushtan classroom designed for exploration"
                                    fill
                                    priority
                                    className="object-cover"
                                    sizes="(min-width: 1024px) 42vw, 90vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-anushtan-charcoal/75 via-transparent to-transparent" />
                                <div className="absolute inset-x-6 bottom-6 rounded-2xl border border-white/20 bg-anushtan-charcoal/75 p-5 backdrop-blur-sm">
                                    <BookOpenCheck className="mb-3 h-6 w-6 text-anushtan-gold" />
                                    <p className="font-heading text-xl font-bold">A curriculum children can see, touch, and remember.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="border-b border-anushtan-border bg-white py-10">
                    <div className="container-custom flex flex-col items-start justify-between gap-5 md:flex-row md:items-center">
                        <p className="max-w-2xl text-lg leading-relaxed text-anushtan-charcoal/80">
                            The school&apos;s recent activities show a curriculum that reaches beyond textbooks—into expression, nature, movement, craft, and responsibility.
                        </p>
                        <a
                            href="https://www.instagram.com/anushtan_indicschool_siddipet/"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex shrink-0 items-center gap-2 font-semibold text-anushtan-terracotta transition-colors hover:text-anushtan-gold"
                        >
                            See school life on Instagram <ArrowRight className="h-4 w-4" />
                        </a>
                    </div>
                </section>

                <section className="py-24 md:py-32">
                    <div className="container-custom">
                        <div className="mb-14 max-w-3xl">
                            <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-anushtan-gold">A lived curriculum</p>
                            <h2 className="font-heading text-4xl font-bold leading-tight text-anushtan-charcoal md:text-6xl">Five ways learning comes alive.</h2>
                            <p className="mt-6 text-lg leading-relaxed text-anushtan-charcoal/75">
                                Not separate departments or promises for later—these are the kinds of experiences already visible in Anushtan school life.
                            </p>
                        </div>

                        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
                            {learningModes.map((mode) => {
                                const Icon = mode.icon;
                                return (
                                    <article key={mode.number} className="group flex min-h-[320px] flex-col rounded-2xl border border-anushtan-border bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                                        <div className={`mb-8 flex h-14 w-14 items-center justify-center rounded-2xl ${mode.tone}`}>
                                            <Icon className="h-7 w-7" />
                                        </div>
                                        <span className="text-xs font-bold tracking-[0.2em] text-anushtan-gold">{mode.number}</span>
                                        <h3 className="mt-3 font-heading text-2xl font-bold text-anushtan-terracotta">{mode.title}</h3>
                                        <p className="mt-4 leading-relaxed text-anushtan-charcoal/80">{mode.text}</p>
                                        <p className="mt-auto pt-6 text-sm leading-relaxed text-anushtan-charcoal/55">{mode.detail}</p>
                                    </article>
                                );
                            })}
                        </div>
                    </div>
                </section>

                <section className="bg-anushtan-charcoal py-24 text-white md:py-28">
                    <div className="container-custom grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
                        <div>
                            <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-anushtan-gold">The academic foundation</p>
                            <h2 className="font-heading text-4xl font-bold leading-tight md:text-5xl">The habits beneath every good education.</h2>
                            <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/70">
                                We want children to develop a steady relationship with learning: attention, curiosity, effort, and the confidence to keep going.
                            </p>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-3">
                            {[
                                ["Clarity before speed", "Children build understanding before they are asked to perform."],
                                ["Practice before pressure", "Daily learning habits grow through patient guidance and meaningful work."],
                                ["Values in practice", "Respect, responsibility, and cultural grounding are part of school life."],
                            ].map(([title, text], index) => (
                                <div key={title} className="border-t border-anushtan-gold/40 pt-6">
                                    <span className="text-sm font-bold text-anushtan-gold">0{index + 1}</span>
                                    <h3 className="mt-3 font-heading text-2xl font-bold">{title}</h3>
                                    <p className="mt-4 leading-relaxed text-white/65">{text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-24 md:py-28">
                    <div className="container-custom overflow-hidden rounded-[2rem] bg-[#f0e4d1] px-7 py-12 md:px-14 md:py-16">
                        <div className="grid items-center gap-10 md:grid-cols-[1.25fr_0.75fr]">
                            <div>
                                <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-anushtan-terracotta">See it in person</p>
                                <h2 className="font-heading text-4xl font-bold leading-tight text-anushtan-terracotta md:text-5xl">Come see a school day with more in it.</h2>
                                <p className="mt-6 max-w-xl text-lg leading-relaxed text-anushtan-charcoal/75">A campus visit is the best way to understand how these learning experiences fit together.</p>
                            </div>
                            <div className="md:text-right">
                                <Link href="/admissions" className="inline-flex items-center gap-2 rounded-md bg-anushtan-terracotta px-6 py-4 font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-[#8B3A2B] hover:shadow-xl">
                                    Plan a campus visit <ArrowRight className="h-5 w-5" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
