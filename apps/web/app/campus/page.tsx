import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, BookOpen, MapPin, Music2, Sprout, Trophy, TreePine } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
    title: "Campus | Anushtan Indic School",
    description: "A campus for learning, movement, expression, and connection with nature at Anushtan Indic School.",
};

const campusSettings = [
    {
        title: "Spaces to focus",
        text: "Calm classrooms, reading spaces, and places where attention can settle and questions can grow.",
        image: "/campus-classroom-1.jpg",
        icon: BookOpen,
    },
    {
        title: "Spaces to create",
        text: "Learning spaces that invite hands-on discovery, conversation, and practical work.",
        image: "/campus-tech-lab.jpg",
        icon: Sprout,
    },
    {
        title: "Spaces to gather",
        text: "The campus becomes a shared stage for music, culture, celebration, and belonging.",
        image: "/campus-lobby.jpg",
        icon: Music2,
    },
    {
        title: "Spaces to move",
        text: "Grounds and open areas give children room for sport, play, confidence, and energy.",
        image: "/campus-perspective.jpg",
        icon: Trophy,
    },
];

const schoolLife = [
    ["A stage for expression", "Folk dance, garba, Balotsav, and solo song make the amphitheatre and gathering spaces come alive."],
    ["Grounds for confidence", "Sports fest, skating, cricket, and horse riding create room for courage, coordination, and teamwork."],
    ["Nature within reach", "Plantation activities, strawberry growing, and animal care connect children with the living world around them."],
];

export default function Campus() {
    return (
        <div className="min-h-screen bg-[#fcfaf6]">
            <Navbar />

            <main>
                <section className="overflow-hidden bg-anushtan-charcoal text-white">
                    <div className="container-custom grid min-h-[650px] items-center gap-12 py-16 lg:grid-cols-[1fr_1fr] lg:py-20">
                        <div className="relative z-10 max-w-2xl">
                            <span className="mb-6 inline-flex rounded-full border border-anushtan-gold/40 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-anushtan-gold">
                                The Anushtan campus
                            </span>
                            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-white/60">Siddipet, Telangana</p>
                            <h1 className="font-heading text-5xl font-bold leading-[0.98] md:text-7xl">
                                A campus built for a <span className="text-anushtan-gold">fuller childhood.</span>
                            </h1>
                            <p className="mt-8 max-w-xl text-lg leading-relaxed text-white/80 md:text-xl">
                                A child&apos;s school is more than a building. It is where they learn, move, perform, make friends, care for living things, and discover what they enjoy doing.
                            </p>
                            <div className="mt-10 flex items-center gap-3 text-sm text-white/70">
                                <MapPin className="h-5 w-5 text-anushtan-gold" />
                                Beside SUDA Office, Siddipet
                            </div>
                        </div>

                        <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
                            <div className="absolute -inset-5 rounded-[2.5rem] border border-anushtan-gold/30" />
                            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-2xl">
                                <Image
                                    src="/campus-perspective.jpg"
                                    alt="Anushtan Indic School campus perspective"
                                    fill
                                    priority
                                    className="object-cover"
                                    sizes="(min-width: 1024px) 44vw, 90vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
                                <div className="absolute inset-x-6 bottom-6 rounded-2xl border border-white/20 bg-black/30 p-5 backdrop-blur-sm">
                                    <p className="font-heading text-xl font-bold">A school day has more in it when the campus gives children room to grow.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="border-b border-anushtan-border bg-white py-10">
                    <div className="container-custom flex flex-col items-start justify-between gap-5 md:flex-row md:items-center">
                        <p className="max-w-2xl text-lg leading-relaxed text-anushtan-charcoal/80">
                            In the school&apos;s recent stories, the campus is a place for activities, culture, sport, farming, and everyday discovery—not simply a backdrop to lessons.
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
                            <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-anushtan-gold">A place with many settings</p>
                            <h2 className="font-heading text-4xl font-bold leading-tight text-anushtan-charcoal md:text-6xl">Every space has a part to play.</h2>
                            <p className="mt-6 text-lg leading-relaxed text-anushtan-charcoal/75">
                                The best campuses are not only impressive to look at. They quietly support different kinds of concentration, energy, creativity, and connection throughout the day.
                            </p>
                        </div>

                        <div className="grid gap-5 md:grid-cols-2">
                            {campusSettings.map((setting) => {
                                const Icon = setting.icon;
                                return (
                                    <article key={setting.title} className="group overflow-hidden rounded-2xl border border-anushtan-border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                                        <div className="relative aspect-[16/9] overflow-hidden">
                                            <Image src={setting.image} alt={setting.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(min-width: 768px) 45vw, 90vw" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                                            <div className="absolute bottom-5 left-5 flex h-12 w-12 items-center justify-center rounded-xl bg-white/90 text-anushtan-terracotta shadow-lg">
                                                <Icon className="h-6 w-6" />
                                            </div>
                                        </div>
                                        <div className="p-7 md:p-8">
                                            <h3 className="font-heading text-3xl font-bold text-anushtan-terracotta">{setting.title}</h3>
                                            <p className="mt-4 max-w-xl text-lg leading-relaxed text-anushtan-charcoal/75">{setting.text}</p>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    </div>
                </section>

                <section className="bg-[#e9dfcc] py-24 md:py-28">
                    <div className="container-custom grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
                        <div>
                            <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-anushtan-terracotta">The outdoors matter</p>
                            <h2 className="font-heading text-4xl font-bold leading-tight text-anushtan-terracotta md:text-5xl">School life spills beyond the classroom.</h2>
                            <p className="mt-6 text-lg leading-relaxed text-anushtan-charcoal/75">
                                Children make stronger memories when their school has places to run, gather, care for nature, and celebrate together.
                            </p>
                            <div className="mt-8 flex items-center gap-3 text-anushtan-terracotta">
                                <TreePine className="h-7 w-7" />
                                <span className="font-heading text-xl font-bold">Learning has room to breathe here.</span>
                            </div>
                        </div>
                        <div className="grid gap-4">
                            {schoolLife.map(([title, text], index) => (
                                <article key={title} className="rounded-2xl bg-white/85 p-7 shadow-sm backdrop-blur-sm md:flex md:gap-8">
                                    <span className="font-heading text-5xl font-bold text-anushtan-gold/55">0{index + 1}</span>
                                    <div className="mt-3 md:mt-0">
                                        <h3 className="font-heading text-2xl font-bold text-anushtan-charcoal">{title}</h3>
                                        <p className="mt-3 leading-relaxed text-anushtan-charcoal/75">{text}</p>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-24 md:py-32">
                    <div className="container-custom">
                        <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
                            <div className="max-w-2xl">
                                <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-anushtan-gold">Look around</p>
                                <h2 className="font-heading text-4xl font-bold leading-tight text-anushtan-charcoal md:text-5xl">Designed for more than one kind of learning.</h2>
                            </div>
                            <p className="max-w-sm leading-relaxed text-anushtan-charcoal/65">From reading and science to conversation and collaboration, these spaces support different rhythms of the day.</p>
                        </div>

                        <div className="grid auto-rows-[190px] gap-4 md:grid-cols-4">
                            <GalleryImage src="/campus-library.jpg" alt="Anushtan library" className="md:col-span-2 md:row-span-2" />
                            <GalleryImage src="/campus-science-lab.jpg" alt="Anushtan science learning space" className="md:col-span-2" />
                            <GalleryImage src="/campus-classroom-2.jpg" alt="Anushtan classroom" className="md:col-span-1" />
                            <GalleryImage src="/campus-masterplan.jpg" alt="Anushtan campus view" className="md:col-span-1" />
                        </div>
                    </div>
                </section>

                <section className="pb-24 md:pb-28">
                    <div className="container-custom overflow-hidden rounded-[2rem] bg-anushtan-terracotta px-7 py-12 text-white md:px-14 md:py-16">
                        <div className="grid items-center gap-10 md:grid-cols-[1.25fr_0.75fr]">
                            <div>
                                <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-anushtan-gold">Come experience it</p>
                                <h2 className="font-heading text-4xl font-bold leading-tight md:text-5xl">The best way to know a school is to walk through it.</h2>
                                <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/75">Plan a visit and see how Anushtan&apos;s spaces come together as one school day.</p>
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

function GalleryImage({ src, alt, className }: { src: string; alt: string; className: string }) {
    return (
        <div className={`group relative overflow-hidden rounded-2xl ${className}`}>
            <Image src={src} alt={alt} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(min-width: 768px) 50vw, 90vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
    );
}
