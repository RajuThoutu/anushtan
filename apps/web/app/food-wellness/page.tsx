import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Apple, ArrowRight, ChefHat, HeartPulse, Leaf, Sparkles, Sun } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
    title: "Food & Wellness | Anushtan Indic School",
    description: "Food, movement, nature, and everyday care at Anushtan Indic School.",
};

const everydayCare = [
    {
        title: "Seasonal food",
        text: "Children meet familiar, seasonal foods as part of a living connection to place and climate.",
        icon: Apple,
        tone: "bg-[#f8ead6] text-[#a45d27]",
    },
    {
        title: "Food as a life skill",
        text: "Preparing food together helps children learn observation, measurement, patience, teamwork, and self-reliance.",
        icon: ChefHat,
        tone: "bg-[#eef1db] text-[#647042]",
    },
    {
        title: "Knowledge from nature",
        text: "Plants and familiar local ingredients open conversations about care, tradition, and everyday wellbeing.",
        icon: Leaf,
        tone: "bg-[#e4f0e8] text-[#397050]",
    },
    {
        title: "Balance in the day",
        text: "Movement, play, quiet attention, and a steady rhythm support a child&apos;s sense of ease and energy.",
        icon: HeartPulse,
        tone: "bg-[#e8eef7] text-[#4e6689]",
    },
];

const reelMoments = [
    ["Seasonal nourishment", "Thaati munjalu", "A small school moment that connects children with a seasonal fruit and the rhythms of the year."],
    ["Cooking together", "Pesarattu making", "A hands-on food activity where making, sharing, and learning come together."],
    ["Local knowledge", "Nallaram", "A reel exploring the uses of a familiar plant and the everyday wisdom held in nature."],
];

export default function FoodWellnessPage() {
    return (
        <div className="min-h-screen bg-[#fdfbf7]">
            <Navbar />

            <main>
                <section className="overflow-hidden bg-[#304d3b] text-white">
                    <div className="container-custom grid min-h-[620px] items-center gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
                        <div className="relative z-10 max-w-2xl">
                            <span className="mb-6 inline-flex rounded-full border border-[#d9b66f]/45 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#f0d69f]">
                                Food &amp; wellness
                            </span>
                            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-white/60">Everyday care at Anushtan</p>
                            <h1 className="font-heading text-5xl font-bold leading-[0.98] md:text-7xl">
                                Nourishment is part of <span className="text-[#f0d69f]">learning.</span>
                            </h1>
                            <p className="mt-8 max-w-xl text-lg leading-relaxed text-white/80 md:text-xl">
                                Food, movement, nature, and moments of quiet care help children arrive at school ready to participate, explore, and grow.
                            </p>
                            <div className="mt-10 flex flex-wrap gap-3 text-sm text-white/80">
                                <span className="rounded-full border border-white/20 px-4 py-2">Seasonal</span>
                                <span className="rounded-full border border-white/20 px-4 py-2">Hands-on</span>
                                <span className="rounded-full border border-white/20 px-4 py-2">Rooted in care</span>
                            </div>
                        </div>

                        <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
                            <div className="absolute -inset-5 rounded-[2.5rem] border border-[#d9b66f]/35" />
                            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-2xl">
                                <Image
                                    src="/kitchen-goshala.png"
                                    alt="A warm, nature-connected setting representing Anushtan food and wellness"
                                    fill
                                    priority
                                    className="object-cover"
                                    sizes="(min-width: 1024px) 42vw, 90vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                                <div className="absolute inset-x-6 bottom-6 rounded-2xl border border-white/20 bg-black/35 p-5 backdrop-blur-sm">
                                    <Sun className="mb-3 h-6 w-6 text-[#f0d69f]" />
                                    <p className="font-heading text-xl font-bold">A child&apos;s wellbeing is built through small things, repeated with care.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="border-b border-anushtan-border bg-white py-10">
                    <div className="container-custom flex flex-col items-start justify-between gap-5 md:flex-row md:items-center">
                        <p className="max-w-2xl text-lg leading-relaxed text-anushtan-charcoal/80">
                            Recent school stories show food and wellness as lived experiences: preparing pesarattu, enjoying seasonal thaati munjalu, learning from plants, and moving with joy.
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
                            <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-anushtan-gold">A whole-child rhythm</p>
                            <h2 className="font-heading text-4xl font-bold leading-tight text-anushtan-charcoal md:text-6xl">Care that children can feel.</h2>
                            <p className="mt-6 text-lg leading-relaxed text-anushtan-charcoal/75">
                                Wellness is not one class or one menu. It is the everyday relationship between food, energy, attention, connection, and the natural world.
                            </p>
                        </div>

                        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                            {everydayCare.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <article key={item.title} className="group min-h-[275px] rounded-2xl border border-anushtan-border bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                                        <div className={`mb-8 flex h-14 w-14 items-center justify-center rounded-2xl ${item.tone}`}>
                                            <Icon className="h-7 w-7" />
                                        </div>
                                        <h3 className="font-heading text-2xl font-bold text-anushtan-terracotta">{item.title}</h3>
                                        <p className="mt-4 leading-relaxed text-anushtan-charcoal/80">{item.text}</p>
                                    </article>
                                );
                            })}
                        </div>
                    </div>
                </section>

                <section className="bg-[#efe5d2] py-24 md:py-28">
                    <div className="container-custom">
                        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
                            <div className="max-w-2xl">
                                <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-anushtan-terracotta">Seen in school life</p>
                                <h2 className="font-heading text-4xl font-bold leading-tight text-anushtan-terracotta md:text-5xl">Small experiences. Lasting habits.</h2>
                            </div>
                            <Sparkles className="h-10 w-10 text-anushtan-gold" />
                        </div>

                        <div className="grid gap-5 md:grid-cols-3">
                            {reelMoments.map(([eyebrow, title, text], index) => (
                                <article key={title} className="rounded-2xl bg-white p-8 shadow-sm">
                                    <span className="text-sm font-bold tracking-[0.16em] text-anushtan-gold">0{index + 1} · {eyebrow}</span>
                                    <h3 className="mt-5 font-heading text-3xl font-bold text-anushtan-charcoal">{title}</h3>
                                    <p className="mt-4 leading-relaxed text-anushtan-charcoal/75">{text}</p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-24 md:py-28">
                    <div className="container-custom grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
                        <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-xl">
                            <Image src="/campus-classroom-1.jpg" alt="A calm learning environment at Anushtan" fill className="object-cover" sizes="(min-width: 1024px) 36vw, 90vw" />
                            <div className="absolute inset-0 bg-gradient-to-t from-anushtan-charcoal/40 to-transparent" />
                        </div>
                        <div>
                            <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-anushtan-gold">A steady day</p>
                            <h2 className="font-heading text-4xl font-bold leading-tight text-anushtan-charcoal md:text-5xl">More than what is on the plate.</h2>
                            <p className="mt-6 text-lg leading-relaxed text-anushtan-charcoal/75">
                                A child&apos;s sense of wellbeing grows through belonging, movement, meaningful work, and the confidence that comes from being seen and included.
                            </p>
                            <div className="mt-8 border-l-2 border-anushtan-gold pl-5 text-lg italic leading-relaxed text-anushtan-terracotta">
                                Nourishing a child is also about making room for curiosity, calm, play, and connection.
                            </div>
                        </div>
                    </div>
                </section>

                <section className="pb-24 md:pb-28">
                    <div className="container-custom overflow-hidden rounded-[2rem] bg-anushtan-terracotta px-7 py-12 text-white md:px-14 md:py-16">
                        <div className="grid items-center gap-10 md:grid-cols-[1.25fr_0.75fr]">
                            <div>
                                <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-anushtan-gold">Come see school life</p>
                                <h2 className="font-heading text-4xl font-bold leading-tight md:text-5xl">See how a fuller school day feels.</h2>
                                <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/75">Visit the campus and experience the places where children learn, play, eat, and grow together.</p>
                            </div>
                            <div className="md:text-right">
                                <Link href="/admissions" className="inline-flex items-center gap-2 rounded-md bg-white px-6 py-4 font-bold text-anushtan-terracotta shadow-md transition-all hover:-translate-y-0.5 hover:bg-anushtan-parchment hover:shadow-xl">
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
